import { SHIFTS, SHIFT_COLORS, TOTAL_SHIFTS, REST_SHIFTS, DOW_LABELS } from '../../constants.js'
import styles from './ShiftTable.module.css'

function getDow(year, month, day) {
  return new Date(year, month - 1, day).getDay()
}

function getDowClass(dow) {
  if (dow === 0) return styles.sun
  if (dow === 6) return styles.sat
  return ''
}

export default function ShiftTable({
  year, month, days, staff, monthShifts,
  cellIssueMap,   // { 'staffId-dayIndex': 'error'|'warning' }
  onCellChange,
}) {
  const dayArr = Array.from({ length: days }, (_, i) => i + 1)

  const calcSummary = (staffId) => {
    const shifts = monthShifts[staffId] || []
    let kyu = 0, kin = 0, ya = 0
    shifts.forEach(sh => {
      if (REST_SHIFTS.has(sh)) kyu++
      else if (sh !== '　' && sh !== '明') kin++
      if (sh === '夜') ya++
    })
    return { kyu, kin, ya }
  }

  return (
    <table className={styles.table}>
      <colgroup>
        <col className={styles.colName} />
        {dayArr.map(d => <col key={d} className={styles.colDay} />)}
        <col className={styles.colSum} />
        <col className={styles.colSum} />
        <col className={styles.colSum} />
      </colgroup>

      <thead>
        <tr>
          <th className={`${styles.thMonth} ${styles.nameCell}`}>
            {year}年{month}月
          </th>
          {dayArr.map(d => {
            const dow = getDow(year, month, d)
            return (
              <th key={d} className={`${styles.thMonth} ${getDowClass(dow)}`}>
                {d}
              </th>
            )
          })}
          <th className={styles.thMonth}>休計</th>
          <th className={styles.thMonth}>勤計</th>
          <th className={styles.thMonth}>夜</th>
        </tr>

        <tr>
          <th className={`${styles.thDow} ${styles.nameCell}`}>曜日</th>
          {dayArr.map(d => {
            const dow = getDow(year, month, d)
            return (
              <th key={d} className={`${styles.thDow} ${getDowClass(dow)}`}>
                {DOW_LABELS[dow]}
              </th>
            )
          })}
          <th className={styles.thDow} />
          <th className={styles.thDow} />
          <th className={styles.thDow} />
        </tr>

        <tr>
          <th className={`${styles.thEvent} ${styles.nameCell}`}>行事</th>
          {dayArr.map(d => (
            <th key={d} className={styles.thEvent} />
          ))}
          <th className={styles.thEvent} />
          <th className={styles.thEvent} />
          <th className={styles.thEvent} />
        </tr>
      </thead>

      <tbody>
        {staff.map(s => {
          const shifts = monthShifts[s.id] || Array(days).fill('　')
          const { kyu, kin, ya } = calcSummary(s.id)
          return (
            <tr key={s.id}>
              <td className={`${styles.nameCell} ${styles.staffName}`}>
                {s.name}
              </td>
              {dayArr.map((d, di) => {
                const sh = shifts[di] ?? '　'
                const bg = SHIFT_COLORS[sh] || '#fff'
                const issueType = cellIssueMap?.[`${s.id}-${di}`]

                // エラー → 赤枠、警告 → 黄枠
                const cellClass = [
                  styles.shiftCell,
                  issueType === 'error'   ? styles.cellError   : '',
                  issueType === 'warning' ? styles.cellWarning : '',
                ].filter(Boolean).join(' ')

                return (
                  <td
                    key={d}
                    className={cellClass}
                    style={{ background: bg }}
                    title={issueType ? (issueType === 'error' ? '⛔ エラー' : '⚠️ 警告') : undefined}
                  >
                    <select
                      className={styles.shiftSelect}
                      value={sh}
                      onChange={e => onCellChange(s.id, di, e.target.value)}
                      style={{ background: 'transparent' }}
                    >
                      {SHIFTS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </td>
                )
              })}
              <td className={styles.sumCell}>{kyu}</td>
              <td className={styles.sumCell}>{kin}</td>
              <td className={styles.sumCell}>{ya}</td>
            </tr>
          )
        })}

        {TOTAL_SHIFTS.map(sh => (
          <tr key={sh}>
            <td className={styles.totalLabel}>{sh}計</td>
            {dayArr.map((d, di) => {
              const cnt = staff.filter(s => (monthShifts[s.id]?.[di] ?? '　') === sh).length
              return (
                <td
                  key={d}
                  className={styles.totalCell}
                  style={{ background: SHIFT_COLORS[sh] }}
                >
                  {cnt > 0 ? cnt : ''}
                </td>
              )
            })}
            <td className={styles.totalCell} />
            <td className={styles.totalCell} />
            <td className={styles.totalCell} />
          </tr>
        ))}
      </tbody>
    </table>
  )
}
