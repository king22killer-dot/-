# 夜班小幫手（夜班抄表 PWA）

iPhone 用的夜班抄表網頁 App。純靜態網站，沒有建置步驟，部署在 Netlify（推上 main 就自動部署）。

## 檔案
- `index.html`：整個 App（HTML＋CSS＋JS 都在這個檔）。
- `firebase-config.js`：Firebase 專案 night-inspection 的連線設定。**不要刪、不要改成 null**，否則資料不會記錄到 Firebase。要改設定時，在這個檔上修改。
- `sw.js`：Service Worker，`CACHE` 名稱要跟著版本號更新（例如 `waste-inspection-v46`）。
- `manifest.json`、`icon-*.png`：加入主畫面用。
- `firestore.rules`：Firestore 權限規則（要到 Firebase 後台貼上才會生效）。
- `netlify.toml`：Netlify 設定（index.html／sw.js 不快取）。
- `docs/`：Firebase 設定說明、共用設定備份。
- `schedule/`：另一個獨立 App「班表小幫手」（月曆班表，資料存在手機 localStorage）。網址 `/schedule/`，有自己的 `manifest.json`、`sw.js`（`CACHE` 為 `shift-helper-vN`）、圖示；版本號 `APP_VER` 在 `schedule/index.html`。

## 每次修改的規則
1. 改 `index.html` 裡的 `const APP_VER='vNN（YYYY-MM-DD）';`，版本號加 1。
2. `sw.js` 的 `CACHE` 改成同一個版本號。
3. 有新功能或操作改變時，更新 `index.html` 裡 `HELP` 陣列的使用說明。
4. 用 Playwright（iPhone 13 模擬）開頁面測試，確認沒有 JS 錯誤再 commit。
5. commit 訊息用中文簡述改了什麼。

## 重要的程式區塊（index.html）
- `judgement()`：判定規則。標準只填 `>` ＝ 大於或等於上次值為正常；`=` ＝ 自動帶入上次值且必須相同；`<N`、`>N`、`a~b`；`--` 不判定。
- 確定列（`#numBar`）：`positionNumBar()`、`nbVisibleBottom()`、`revealRow()`、`nbGuard()`。
  - 獨立網站（Netlify）：確定列 `position:fixed`，用估計鍵盤高度（螢幕高度 36%）貼齊鍵盤上方。
  - 在 claude.ai 框架內（`EMBED`）：確定列改成貼著輸入列（`.inline`）。
- 自動捲動 `autoScroll`（預設關）與微調 `revealOff`（🎯 按鍵）。
- 雲端：Firebase（`fbInit`、`cloudStart`），集合 `config/main`、`records`、`admins/{uid}`。

## 使用者偏好
- 介面與說明一律繁體中文。
- 使用者主要在 iPhone 上使用；鍵盤遮擋是最常見的問題，改動確定列／捲動時要特別小心。
