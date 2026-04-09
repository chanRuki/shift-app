import { useEffect, useMemo } from 'react'
import ShiftTable from './ShiftTable.jsx'
import { LEGEND_SHIFTS, SHIFT_COLORS, SHIFT_LABELS } from '../../constants.js'
import styles from './ShiftEditor.module.css'

// ─────────────────────────────────────────────
// バリデーション関数
// 【目的】シフトデータ全体を走査し、エラー・警告を返す
// 【副作用】なし（純粋関数）
// ─────────────────────────────────────────────
function runValidation(staff, monthShifts, rules, days) {
  const issues = [] // { type: 'error'|'warning', staffId, dayIndex, message }

  staff.forEach(s => {
    const shifts = monthShifts[s.id] || Array(days).fill('　')

    // ① 夜勤不可スタッフへの夜勤アサイン
    if (!s.nightOk) {
      shifts.forEach((sh, di) => {
        if (sh === '夜') {
          issues.push({
            type: 'error',
            staffId: s.id,
            dayIndex: di,
            message: `${s.name}（${di + 1}日）：夜勤不可スタッフに夜勤が設定されています`,
          })
        }
      })
    }

    // ② 夜勤後に明けが入っていない
    shifts.forEach((sh, di) => {
      if (sh === '夜' && di + 1 < days) {
        const next = shifts[di + 1]
        if (next !== '明') {
          issues.push({
            type: 'warning',
            staffId: s.id,
            dayIndex: di + 1,
            message: `${s.name}（${di + 2}日）：夜勤翌日に「明」が入っていません`,
          })
        }
      }
    })

    // ③ 明けの翌日に公休が入っていない
    shifts.forEach((sh, di) => {
      if (sh === '明' && di + 1 < days) {
        const next = shifts[di + 1]
        if (next !== '公' && next !== '休') {
          issues.push({
            type: 'warning',
            staffId: s.id,
            dayIndex: di + 1,
            message: `${s.name}（${di + 2}日）：明け翌日に公休が入っていません`,
          })
        }
      }
    })

    // ④ 連勤上限超過
    let consecutive = 0
    const WORK = new Set(['早', '普', '遅', '夜', '明', '研', '有'])
    const RESET = new Set(['公', '休'])
    let streakStart = 0
    shifts.forEach((sh, di) => {
      if (WORK.has(sh)) {
        if (consecutive === 0) streakStart = di
        consecutive++
        if (consecutive > rules.maxConsecutive) {
          issues.push({
            type: 'error',
            staffId: s.id,
            dayIndex: di,
            message: `${s.name}（${di + 1}日）：${rules.maxConsecutive}連勤超過（${consecutive}連勤目）`,
          })
        }
      } else if (RESET.has(sh)) {
        consecutive = 0
      }
      // 　（未設定）はカウントもリセットもしない
    })

    // ⑤ 夜勤回数が上限超過
    const nightCount = shifts.filter(sh => sh === '夜').length
    const nightMax = rules.defaultNightMax
    if (nightCount > nightMax) {
      issues.push({
        type: 'warning',
        staffId: s.id,
        dayIndex: null,
        message: `${s.name}：夜勤回数が上限超過（${nightCount}回 / 上限${nightMax}回）`,
      })
    }

    // ⑥ 公休日数が上限超過
    const kyuCount = shifts.filter(sh => sh === '公' || sh === '休').length
    if (kyuCount > rules.monthlyHolidays) {
      issues.push({
        type: 'warning',
        staffId: s.id,
        dayIndex: null,
        message: `${s.name}：公休日数が設定超過（${kyuCount}日 / 設定${rules.monthlyHolidays}日）`,
      })
    }
  })

  // ⑦ 日別：日勤帯の最低配置人数チェック
  const DAYTIME = new Set(['早', '普', '遅'])
  for (let di = 0; di < days; di++) {
    const count = staff.filter(s => {
      const sh = monthShifts[s.id]?.[di] ?? '　'
      return DAYTIME.has(sh)
    }).length
    if (count < rules.minDaytimeStaff) {
      issues.push({
        type: 'error',
        staffId: null,
        dayIndex: di,
        message: `${di + 1}日：日勤帯の配置人数不足（${count}名 / 最低${rules.minDaytimeStaff}名）`,
      })
    }
  }

  return issues
}

// ─────────────────────────────────────────────
// メインコンポーネント
// ─────────────────────────────────────────────
export default function ShiftEditor({ year, month, staffStore, shiftStore, rulesStore }) {
  const { staff } = staffStore
  const { getMonthShifts, updateCell, initMonthForStaff } = shiftStore
  const { rules } = rulesStore

  const days = new Date(year, month, 0).getDate()

  useEffect(() => {
    staff.forEach(s => initMonthForStaff(year, month, s.id, days))
  }, [year, month, staff.length])

  const monthShifts = getMonthShifts(year, month)

  // バリデーション結果（シフト・ルールが変わるたびに再計算）
  const issues = useMemo(
    () => runValidation(staff, monthShifts, rules, days),
    [staff, monthShifts, rules, days]
  )

  const errors   = issues.filter(i => i.type === 'error')
  const warnings = issues.filter(i => i.type === 'warning')

  // セルごとの issue を高速引きするマップ
  // key: `${staffId}-${dayIndex}`
  const cellIssueMap = useMemo(() => {
    const map = {}
    issues.forEach(issue => {
      if (issue.staffId && issue.dayIndex !== null) {
        const key = `${issue.staffId}-${issue.dayIndex}`
        if (!map[key] || (map[key] === 'warning' && issue.type === 'error')) {
          map[key] = issue.type
        }
      }
    })
    return map
  }, [issues])

  const handleCellChange = (staffId, dayIndex, value) => {
    updateCell(year, month, staffId, dayIndex, value)
  }

  const handleAutoGenerate = () => {
    alert('自動生成エンジンは実装予定です（仕様書 4-3 参照）')
  }

  const handleExcelExport = () => {
    alert('Excel出力は実装予定です')
  }

  return (
    <div className={styles.page}>

      {/* ── ツールバー ── */}
      <div className={styles.toolbar}>
        <button className="btn btn-primary" onClick={handleAutoGenerate}>
          ⚡ 自動生成
        </button>
        <div className="btn-sep" />
        <button className="btn btn-outline">＋ スタッフ追加</button>
        <div className="btn-sep" />
        <button className="btn btn-success" onClick={handleExcelExport}>
          📥 Excel出力
        </button>
        <button className="btn btn-outline">🖨 PDF出力</button>
      </div>

      {/* ── バリデーション アラートパネル ── */}
      {issues.length > 0 && (
        <div className={styles.alertPanel}>
          {errors.length > 0 && (
            <div className={styles.alertGroup}>
              <div className={styles.alertGroupTitle}>
                🔴 エラー（{errors.length}件）
              </div>
              <ul className={styles.alertList}>
                {errors.map((e, i) => (
                  <li key={i} className={styles.alertItemError}>{e.message}</li>
                ))}
              </ul>
            </div>
          )}
          {warnings.length > 0 && (
            <div className={styles.alertGroup}>
              <div className={styles.alertGroupTitle}>
                🟡 警告（{warnings.length}件）
              </div>
              <ul className={styles.alertList}>
                {warnings.map((w, i) => (
                  <li key={i} className={styles.alertItemWarning}>{w.message}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ── 凡例 ── */}
      <div className={styles.legend}>
        <span className={styles.legendTitle}>凡例：</span>
        {LEGEND_SHIFTS.map(sh => (
          <div key={sh} className={styles.legendItem}>
            <div
              className={styles.legendChip}
              style={{ background: SHIFT_COLORS[sh] }}
            >
              {sh}
            </div>
            <span>{SHIFT_LABELS[sh]}</span>
          </div>
        ))}
      </div>

      {/* ── テーブル ── */}
      <div className={styles.tableWrapper}>
        <ShiftTable
          year={year}
          month={month}
          days={days}
          staff={staff}
          monthShifts={monthShifts}
          cellIssueMap={cellIssueMap}
          onCellChange={handleCellChange}
        />
      </div>

    </div>
  )
}
