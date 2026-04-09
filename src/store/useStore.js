/**
 * useStore.js
 * 【目的】アプリ全体の状態を管理し、localStorageへの永続化を担う
 * 【設計方針】
 *   - React の useState + useEffect で実装（外部ライブラリ不要）
 *   - 各ストアは独立した hook として export し、必要な画面で import して使う
 *   - localStorage のキー名は定数 STORAGE_KEYS で一元管理
 */

import { useState, useEffect } from 'react'

// ── localStorage キー ──
const STORAGE_KEYS = {
  STAFF:    'shift_app_staff',
  SHIFTS:   'shift_app_shifts',
  WISHES:   'shift_app_wishes',
  RULES:    'shift_app_rules',
}

// ── デフォルト値 ──
const DEFAULT_STAFF = [
  { id: 's001', name: '田中 花子', role: 'スタッフ',  employment: '正社員', nightOk: true,  qualification: '介護福祉士' },
  { id: 's002', name: '鈴木 一郎', role: 'リーダー',  employment: '正社員', nightOk: true,  qualification: '介護福祉士' },
  { id: 's003', name: '佐藤 美咲', role: 'スタッフ',  employment: '正社員', nightOk: true,  qualification: '介護職員初任者研修' },
  { id: 's004', name: '山田 健二', role: 'スタッフ',  employment: '正社員', nightOk: true,  qualification: '介護福祉士' },
  { id: 's005', name: '伊藤 さくら',role: 'スタッフ', employment: '正社員', nightOk: true,  qualification: '看護師' },
  { id: 's006', name: '中村 浩二', role: 'スタッフ',  employment: '正社員', nightOk: true,  qualification: '介護福祉士' },
  { id: 's007', name: '小林 陽子', role: 'スタッフ',  employment: 'パート', nightOk: false, qualification: '介護職員初任者研修' },
  { id: 's008', name: '加藤 雄一', role: 'スタッフ',  employment: '正社員', nightOk: true,  qualification: '無資格' },
]

const DEFAULT_RULES = {
  monthlyHolidays:  9,   // 月間公休日数
  maxConsecutive:   5,   // 最大連勤日数
  minDaytimeStaff:  3,   // 日勤帯最低配置人数
  nightStaffCount:  1,   // 夜勤配置人数
  autoNightAfter:   true, // 夜勤後は明けを自動挿入
  defaultNightMax:  5,   // デフォルト夜勤上限回数/月
}

// ── ユーティリティ ──
function loadFromStorage(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : defaultValue
  } catch {
    return defaultValue
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.warn('localStorage save failed:', e)
  }
}

// ── スタッフストア ──
export function useStaffStore() {
  const [staff, setStaff] = useState(() => loadFromStorage(STORAGE_KEYS.STAFF, DEFAULT_STAFF))

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.STAFF, staff)
  }, [staff])

  const addStaff = (member) => {
    const newMember = { ...member, id: `s${Date.now()}` }
    setStaff(prev => [...prev, newMember])
  }

  const removeStaff = (id) => {
    setStaff(prev => prev.filter(s => s.id !== id))
  }

  const updateStaff = (id, updates) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
  }

  return { staff, addStaff, removeStaff, updateStaff }
}

// ── シフトストア ──
// shifts の構造: { 'YYYY-MM': { staffId: ['早','休','夜',...] } }
export function useShiftStore() {
  const [shifts, setShifts] = useState(() => loadFromStorage(STORAGE_KEYS.SHIFTS, {}))

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SHIFTS, shifts)
  }, [shifts])

  const getMonthShifts = (year, month) => {
    const key = `${year}-${String(month).padStart(2, '0')}`
    return shifts[key] || {}
  }

  const updateCell = (year, month, staffId, dayIndex, value) => {
    const key = `${year}-${String(month).padStart(2, '0')}`
    setShifts(prev => {
      const monthData = prev[key] || {}
      const staffShifts = monthData[staffId] ? [...monthData[staffId]] : []
      staffShifts[dayIndex] = value
      return { ...prev, [key]: { ...monthData, [staffId]: staffShifts } }
    })
  }

  const initMonthForStaff = (year, month, staffId, days) => {
    const key = `${year}-${String(month).padStart(2, '0')}`
    setShifts(prev => {
      const monthData = prev[key] || {}
      if (monthData[staffId] && monthData[staffId].length === days) return prev
      const staffShifts = Array(days).fill('　')
      return { ...prev, [key]: { ...monthData, [staffId]: staffShifts } }
    })
  }

  const setMonthShifts = (year, month, data) => {
    const key = `${year}-${String(month).padStart(2, '0')}`
    setShifts(prev => ({ ...prev, [key]: data }))
  }

  return { shifts, getMonthShifts, updateCell, initMonthForStaff, setMonthShifts }
}

// ── 希望入力ストア ──
// wishes の構造: { 'YYYY-MM': { staffId: { dayIndex: 'wish' | 'paid' | 'committee' } } }
export function useWishStore() {
  const [wishes, setWishes] = useState(() => loadFromStorage(STORAGE_KEYS.WISHES, {}))

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.WISHES, wishes)
  }, [wishes])

  const getMonthWishes = (year, month) => {
    const key = `${year}-${String(month).padStart(2, '0')}`
    return wishes[key] || {}
  }

  const updateWish = (year, month, staffId, dayIndex, type) => {
    const key = `${year}-${String(month).padStart(2, '0')}`
    setWishes(prev => {
      const monthData = prev[key] || {}
      const staffWishes = { ...(monthData[staffId] || {}) }
      if (type === null) {
        delete staffWishes[dayIndex]
      } else {
        staffWishes[dayIndex] = type
      }
      return { ...prev, [key]: { ...monthData, [staffId]: staffWishes } }
    })
  }

  return { wishes, getMonthWishes, updateWish }
}

// ── ルール設定ストア ──
export function useRulesStore() {
  const [rules, setRules] = useState(() => loadFromStorage(STORAGE_KEYS.RULES, DEFAULT_RULES))

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.RULES, rules)
  }, [rules])

  const updateRule = (key, value) => {
    setRules(prev => ({ ...prev, [key]: value }))
  }

  return { rules, updateRule }
}
