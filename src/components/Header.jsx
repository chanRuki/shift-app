import styles from './Header.module.css'

export default function Header({ year, month, onMonthChange }) {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>📋</div>
        <span>勤務表管理</span>
      </div>
      <div className={styles.monthNav}>
        <button className={styles.monthBtn} onClick={() => onMonthChange(-1)}>‹</button>
        <span className={styles.monthLabel}>{year}年{month}月</span>
        <button className={styles.monthBtn} onClick={() => onMonthChange(1)}>›</button>
      </div>
    </header>
  )
}
