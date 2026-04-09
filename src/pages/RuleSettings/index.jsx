import styles from './RuleSettings.module.css'

export default function RuleSettings({ rulesStore, staffStore }) {
  const { rules, updateRule } = rulesStore
  const { staff } = staffStore

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>⚙️ ルール設定</h2>
      </div>

      <div className={styles.body}>
        {/* ── 施設共通ルール ── */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>施設共通ルール</h3>
          <div className={styles.ruleGrid}>

            <RuleRow label="月間公休日数" unit="日">
              <input
                type="number" min={0} max={20}
                value={rules.monthlyHolidays}
                onChange={e => updateRule('monthlyHolidays', Number(e.target.value))}
                className={styles.numInput}
              />
            </RuleRow>

            <RuleRow label="最大連勤日数" unit="日">
              <input
                type="number" min={1} max={14}
                value={rules.maxConsecutive}
                onChange={e => updateRule('maxConsecutive', Number(e.target.value))}
                className={styles.numInput}
              />
            </RuleRow>

            <RuleRow label="日勤帯 最低配置人数" unit="名">
              <input
                type="number" min={1} max={20}
                value={rules.minDaytimeStaff}
                onChange={e => updateRule('minDaytimeStaff', Number(e.target.value))}
                className={styles.numInput}
              />
            </RuleRow>

            <RuleRow label="夜勤 配置人数" unit="名">
              <input
                type="number" min={1} max={10}
                value={rules.nightStaffCount}
                onChange={e => updateRule('nightStaffCount', Number(e.target.value))}
                className={styles.numInput}
              />
            </RuleRow>

            <RuleRow label="夜勤後は明けを自動挿入">
              <input
                type="checkbox"
                checked={rules.autoNightAfter}
                onChange={e => updateRule('autoNightAfter', e.target.checked)}
                className={styles.checkbox}
              />
            </RuleRow>

            <RuleRow label="デフォルト夜勤上限回数/月" unit="回">
              <input
                type="number" min={0} max={10}
                value={rules.defaultNightMax}
                onChange={e => updateRule('defaultNightMax', Number(e.target.value))}
                className={styles.numInput}
              />
            </RuleRow>

          </div>
        </section>

        {/* ── スタッフ個別ルール（アコーディオン） ── */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>スタッフ個別ルール</h3>
          <p className={styles.sectionNote}>未設定の項目は施設共通ルールを適用します。</p>
          <div className={styles.staffRuleList}>
            {staff.map(s => (
              <StaffRuleRow key={s.id} staff={s} defaultNightMax={rules.defaultNightMax} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

// ── 共通ルール行コンポーネント ──
function RuleRow({ label, unit, children }) {
  return (
    <div className={styles.ruleRow}>
      <span className={styles.ruleLabel}>{label}</span>
      <div className={styles.ruleControl}>
        {children}
        {unit && <span className={styles.ruleUnit}>{unit}</span>}
      </div>
    </div>
  )
}

// ── スタッフ個別ルール行（TODO: アコーディオン展開） ──
function StaffRuleRow({ staff, defaultNightMax }) {
  return (
    <div className={styles.staffRuleRow}>
      <span className={styles.staffRuleName}>{staff.name}</span>
      <span className={styles.staffRoleTag}>{staff.role}</span>
      <span className={styles.staffRoleTag}>{staff.employment}</span>
      <span className={`${styles.staffRoleTag} ${staff.nightOk ? styles.tagOk : styles.tagNg}`}>
        夜勤{staff.nightOk ? '可' : '不可'}
      </span>
      <span className={styles.staffRulePlaceholder}>
        夜勤上限: {defaultNightMax}回（共通）
      </span>
      {/* TODO: アコーディオン展開で個別上限を編集できるようにする */}
    </div>
  )
}
