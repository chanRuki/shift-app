import { useState } from 'react'
import { DOW_LABELS, WISH_TYPES } from '../../constants.js'
import styles from './WishStaff.module.css'

export default function WishStaff({ year, month, staffStore, wishStore }) {
  const { staff } = staffStore
  const { getMonthWishes, updateWish } = wishStore
  const [selectedId, setSelectedId] = useState('')

  const days = new Date(year, month, 0).getDate()
  const dayArr = Array.from({ length: days }, (_, i) => i + 1)
  const monthWishes = getMonthWishes(year, month)
  const staffWishes = selectedId ? (monthWishes[selectedId] || {}) : {}

  const handleCellClick = (di) => {
    if (!selectedId) return
    const current = staffWishes[di]
    // クリックごとに 希望休 → 年休 → 委員会 → なし と循環
    const order = [null, 'wish', 'paid', 'committee']
    const idx = order.indexOf(current ?? null)
    const next = order[(idx + 1) % order.length]
    updateWish(year, month, selectedId, di, next)
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>🙋 希望入力（スタッフ用）</h2>
        <div className={styles.staffSelect}>
          <label className={styles.selectLabel}>スタッフ：</label>
          <select
            className={styles.select}
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
          >
            <option value="">-- 選択してください --</option>
            {staff.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div className={styles.legend}>
          {Object.entries(WISH_TYPES).map(([key, { label, color, textColor }]) => (
            <span key={key} className={styles.legendChip} style={{ background: color, color: textColor }}>
              {label}
            </span>
          ))}
        </div>
      </div>

      {!selectedId ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🙋</div>
          <div className={styles.emptyTitle}>スタッフを選択してください</div>
          <div className={styles.emptyDesc}>上のプルダウンから自分の名前を選ぶと、希望入力カレンダーが表示されます。</div>
        </div>
      ) : (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <colgroup>
                <col className={styles.colName} />
                {dayArr.map(d => <col key={d} className={styles.colDay} />)}
              </colgroup>
              <thead>
                <tr>
                  <th className={`${styles.thHead} ${styles.nameCell}`}>{year}年{month}月</th>
                  {dayArr.map(d => {
                    const dow = new Date(year, month - 1, d).getDay()
                    const cls = dow === 0 ? styles.sun : dow === 6 ? styles.sat : ''
                    return <th key={d} className={`${styles.thHead} ${cls}`}>{d}</th>
                  })}
                </tr>
                <tr>
                  <th className={`${styles.thDow} ${styles.nameCell}`}>曜日</th>
                  {dayArr.map(d => {
                    const dow = new Date(year, month - 1, d).getDay()
                    const cls = dow === 0 ? styles.sun : dow === 6 ? styles.sat : ''
                    return <th key={d} className={`${styles.thDow} ${cls}`}>{DOW_LABELS[dow]}</th>
                  })}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={`${styles.nameCell} ${styles.staffNameCell}`}>
                    {staff.find(s => s.id === selectedId)?.name}
                  </td>
                  {dayArr.map((d, di) => {
                    const wish = staffWishes[di]
                    const wishInfo = wish ? WISH_TYPES[wish] : null
                    return (
                      <td
                        key={d}
                        className={styles.wishCell}
                        style={wishInfo ? {
                          background: wishInfo.color,
                          color: wishInfo.textColor,
                          fontWeight: 700,
                          cursor: 'pointer',
                        } : { cursor: 'pointer' }}
                        onClick={() => handleCellClick(di)}
                        title={wishInfo ? wishInfo.label : 'クリックして希望を入力'}
                      >
                        {wish ? wishInfo?.label?.slice(0, 2) : ''}
                      </td>
                    )
                  })}
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.hint}>
            💡 セルをクリックするたびに「希望休 → 年休 → 委員会 → なし」と切り替わります。
          </div>
        </>
      )}
    </div>
  )
}
