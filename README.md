# 勤務表管理アプリ

**Draft v0.1 — React + Vite スケルトン**

## セットアップ

```bash
# 1. 依存パッケージのインストール
npm install

# 2. 開発サーバー起動
npm run dev
```

ブラウザで `http://localhost:5173` を開く。

## ビルド・デプロイ

```bash
# 本番ビルド
npm run build

# GitHub Pages / Vercel にデプロイする場合
# → dist/ フォルダの内容をアップロード
```

## ディレクトリ構成

```
src/
├── main.jsx              エントリーポイント
├── App.jsx               タブナビゲーション・ルーティング
├── index.css             グローバルスタイル・CSS変数
├── constants.js          勤務区分・色・定数
├── store/
│   └── useStore.js       localStorage込みの状態管理（各画面で共有）
├── components/
│   ├── Header.jsx        上部ヘッダー（アプリ名・月ナビ）
│   └── TabBar.jsx        タブバー
└── pages/
    ├── ShiftEditor/      シフト編集画面（メイン）
    ├── RuleSettings/     ルール設定画面
    ├── StaffManager/     スタッフ管理画面
    ├── WishAdmin/        希望入力（管理者用一覧）
    └── WishStaff/        希望入力（スタッフ用）
```

## データ永続化

`localStorage` に保存。キー一覧：

| キー | 内容 |
|------|------|
| `shift_app_staff`  | スタッフ一覧 |
| `shift_app_shifts` | 月別シフトデータ |
| `shift_app_wishes` | 月別希望データ |
| `shift_app_rules`  | ルール設定 |

## 実装状況

| 画面 | 状態 |
|------|------|
| シフト編集（テーブル表示・セル編集） | ✅ 実装済み |
| シフト編集（自動生成エンジン） | 🔲 未実装（仕様書 4-3 参照） |
| シフト編集（Excel出力） | 🔲 未実装 |
| ルール設定 | ✅ 実装済み（スケルトン） |
| スタッフ管理 | ✅ 実装済み（登録・削除） |
| 希望入力（管理者用） | ✅ 実装済み（読み取り専用一覧） |
| 希望入力（スタッフ用） | ✅ 実装済み（クリック入力） |
