import { useState } from 'react'
import Header from './components/Header.jsx'
import TabBar from './components/TabBar.jsx'
import ShiftEditor from './pages/ShiftEditor/index.jsx'
import RuleSettings from './pages/RuleSettings/index.jsx'
import StaffManager from './pages/StaffManager/index.jsx'
import WishAdmin from './pages/WishAdmin/index.jsx'
import WishStaff from './pages/WishStaff/index.jsx'
import { useStaffStore, useShiftStore, useWishStore, useRulesStore } from './store/useStore.js'
import styles from './App.module.css'

// ── タブ定義 ──
const TABS = [
  { id: 'shift',      label: 'シフト編集',        icon: '📅' },
  { id: 'rules',      label: 'ルール設定',         icon: '⚙️' },
  { id: 'staff',      label: 'スタッフ管理',       icon: '👥' },
  { id: 'wish-admin', label: '希望入力（管理者）', icon: '📝' },
  { id: 'wish-staff', label: '希望入力（スタッフ）',icon: '🙋' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('shift')
  const [year,  setYear]  = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)

  // ── ストア（全画面で共有） ──
  const staffStore = useStaffStore()
  const shiftStore = useShiftStore()
  const wishStore  = useWishStore()
  const rulesStore = useRulesStore()

  const handleMonthChange = (delta) => {
    let m = month + delta
    let y = year
    if (m > 12) { m = 1;  y++ }
    if (m < 1)  { m = 12; y-- }
    setMonth(m)
    setYear(y)
  }

  // ── 共通 props ──
  const commonProps = { year, month, staffStore, shiftStore, wishStore, rulesStore }

  return (
    <div className={styles.app}>
      <Header
        year={year}
        month={month}
        onMonthChange={handleMonthChange}
      />
      <TabBar
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <main className={styles.content}>
        {activeTab === 'shift'      && <ShiftEditor  {...commonProps} />}
        {activeTab === 'rules'      && <RuleSettings {...commonProps} />}
        {activeTab === 'staff'      && <StaffManager {...commonProps} />}
        {activeTab === 'wish-admin' && <WishAdmin    {...commonProps} />}
        {activeTab === 'wish-staff' && <WishStaff    {...commonProps} />}
      </main>
    </div>
  )
}
