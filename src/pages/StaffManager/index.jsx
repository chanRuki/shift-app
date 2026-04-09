import { useState } from 'react'
import { QUALIFICATIONS, ROLES, EMPLOYMENTS } from '../../constants.js'
import styles from './StaffManager.module.css'

const EMPTY_FORM = {
  name: '', role: 'スタッフ', employment: '正社員',
  nightOk: true, qualification: '介護福祉士',
}

export default function StaffManager({ staffStore }) {
  const { staff, addStaff, removeStaff } = staffStore
  const [form, setForm] = useState(EMPTY_FORM)
  const [confirmId, setConfirmId] = useState(null)

  const handleAdd = () => {
    if (!form.name.trim()) return alert('氏名を入力してください')
    addStaff(form)
    setForm(EMPTY_FORM)
  }

  const handleRemove = (id) => {
    removeStaff(id)
    setConfirmId(null)
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>👥 スタッフ管理</h2>
        <span className={styles.count}>{staff.length}名登録中</span>
      </div>

      <div className={styles.body}>
        {/* ── スタッフ一覧 ── */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>スタッフ一覧</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>氏名</th>
                <th>役職</th>
                <th>雇用形態</th>
                <th>夜勤</th>
                <th>保有資格</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {staff.map(s => (
                <tr key={s.id}>
                  <td className={styles.tdName}>{s.name}</td>
                  <td>{s.role}</td>
                  <td>{s.employment}</td>
                  <td>
                    <span className={`${styles.tag} ${s.nightOk ? styles.tagOk : styles.tagNg}`}>
                      {s.nightOk ? '可' : '不可'}
                    </span>
                  </td>
                  <td>{s.qualification}</td>
                  <td className={styles.tdAction}>
                    {confirmId === s.id ? (
                      <div className={styles.confirmRow}>
                        <span className={styles.confirmText}>削除しますか？</span>
                        <button className="btn btn-danger" onClick={() => handleRemove(s.id)}>削除</button>
                        <button className="btn btn-outline" onClick={() => setConfirmId(null)}>キャンセル</button>
                      </div>
                    ) : (
                      <button className="btn btn-outline" onClick={() => setConfirmId(s.id)}>削除</button>
                    )}
                  </td>
                </tr>
              ))}
              {staff.length === 0 && (
                <tr><td colSpan={6} className={styles.emptyRow}>スタッフが登録されていません</td></tr>
              )}
            </tbody>
          </table>
        </section>

        {/* ── 新規登録フォーム ── */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>新規登録</h3>
          <div className={styles.form}>

            <div className={styles.formRow}>
              <label className={styles.formLabel}>氏名 <span className={styles.required}>*</span></label>
              <input
                type="text"
                className={styles.textInput}
                placeholder="例：山田 太郎"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>

            <div className={styles.formRow}>
              <label className={styles.formLabel}>役職</label>
              <select className={styles.selectInput} value={form.role}
                onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>

            <div className={styles.formRow}>
              <label className={styles.formLabel}>雇用形態</label>
              <div className={styles.radioGroup}>
                {EMPLOYMENTS.map(e => (
                  <label key={e} className={styles.radioLabel}>
                    <input type="radio" name="employment" value={e}
                      checked={form.employment === e}
                      onChange={() => setForm(f => ({ ...f, employment: e }))} />
                    {e}
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.formRow}>
              <label className={styles.formLabel}>夜勤対応</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input type="radio" name="nightOk" checked={form.nightOk === true}
                    onChange={() => setForm(f => ({ ...f, nightOk: true }))} />可
                </label>
                <label className={styles.radioLabel}>
                  <input type="radio" name="nightOk" checked={form.nightOk === false}
                    onChange={() => setForm(f => ({ ...f, nightOk: false }))} />不可
                </label>
              </div>
            </div>

            <div className={styles.formRow}>
              <label className={styles.formLabel}>保有資格</label>
              <select className={styles.selectInput} value={form.qualification}
                onChange={e => setForm(f => ({ ...f, qualification: e.target.value }))}>
                {QUALIFICATIONS.map(q => <option key={q}>{q}</option>)}
              </select>
            </div>

            <div className={styles.formActions}>
              <button className="btn btn-primary" onClick={handleAdd}>＋ 登録する</button>
              <button className="btn btn-outline" onClick={() => setForm(EMPTY_FORM)}>リセット</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
