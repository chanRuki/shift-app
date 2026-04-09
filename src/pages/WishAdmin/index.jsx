import { DOW_LABELS, WISH_TYPES } from '../../constants.js'
import styles from './WishAdmin.module.css'

export default function WishAdmin({ year, month, staffStore, wishStore }) {
  const { staff } = staffStore
  const { getMonthWishes } = wishStore
  const days = new Date(year, month, 0).getDate()
  const dayArr = Array.from({ length: days }, (_, i) => i + 1)
  const monthWishes = getMonthWishes(year, month)

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>📝 希望入力（管理者用一覧）</h2>
        <div className={styles.legend}>
          {Object.entries(WISH_TYPES).map(([key, { label, color, textColor }]) => (
            <span key={key} className={styles.legendChip} style={{ background: color, color: textColor }}>
              {label}
            </span>
          ))}
        </div>
      </div>

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
            {staff.map(s => {
              const staffWishes = monthWishes[s.id] || {}
              return (
                <tr key={s.id}>
                  <td className={`${styles.nameCell} ${styles.staffName}`}>{s.name}</td>
                  {dayArr.map((d, di) => {
                    const wish = staffWishes[di]
                    const style = wish ? {
                      background: WISH_TYPES[wish]?.color,
                      color: WISH_TYPES[wish]?.textColor,
                      fontWeight: 700,
                      fontSize: '9px',
                    } : {}
                    return (
                      <td key={d} className={styles.wishCell} style={style}>
                        {wish ? WISH_TYPES[wish]?.label?.slice(0, 2) : ''}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className={styles.note}>
        ※ 希望の編集は「希望入力（スタッフ）」タブから行います。
      </div>
    </div>
  )
}
