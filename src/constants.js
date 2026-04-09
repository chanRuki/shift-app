// ── 勤務区分 ──
export const SHIFTS = ['　', '早', '普', '遅', '夜', '明', '休', '公', '有', '研']

export const SHIFT_COLORS = {
  '早': '#ffffff',
  '普': '#c8e6c9',
  '遅': '#ffffff',
  '夜': '#bbdefb',
  '明': '#bbdefb',
  '休': '#ffab40',
  '公': '#e0e0e0',
  '有': '#dcedc8',
  '研': '#ffffff',
  '　': '#e0e0e0',
}

export const SHIFT_LABELS = {
  '早': '早番',
  '普': '普通',
  '遅': '遅番',
  '夜': '夜勤',
  '明': '明け',
  '休': '休み',
  '公': '公休',
  '有': '有給',
  '研': '研修',
  '　': '空白',
}

// 凡例に表示する順番・種別
export const LEGEND_SHIFTS = ['早', '普', '遅', '夜', '明', '休', '有']

// 集計行に表示する種別
export const TOTAL_SHIFTS = ['早', '普', '遅', '夜', '明', '休']

// 休み扱い（休計にカウント）
export const REST_SHIFTS = new Set(['休', '公', '有'])

// 出勤扱い（連勤カウント対象）
export const WORK_SHIFTS = new Set(['早', '普', '遅', '夜', '明', '研', '有'])

// 連勤リセット
export const RESET_SHIFTS = new Set(['公', '休'])

// ── 曜日 ──
export const DOW_LABELS = ['日', '月', '火', '水', '木', '金', '土']

// ── 希望種別 ──
export const WISH_TYPES = {
  wish:      { label: '希望休',    color: '#fca5a5', textColor: '#991b1b' },
  paid:      { label: '年休（有給）', color: '#86efac', textColor: '#166534' },
  committee: { label: '委員会・研修', color: '#d8b4fe', textColor: '#6b21a8' },
}

// ── スタッフ属性選択肢 ──
export const QUALIFICATIONS = [
  '介護福祉士',
  '看護師',
  '准看護師',
  '社会福祉士',
  '介護職員初任者研修',
  '無資格',
]

export const ROLES = ['スタッフ', 'リーダー', '主任', '施設長', '相談員']

export const EMPLOYMENTS = ['正社員', 'パートタイム']
