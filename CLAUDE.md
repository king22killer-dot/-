# 夜班小幫手（夜班抄表 PWA）

iPhone 用的夜班抄表網頁 App。純靜態網站，沒有建置步驟，部署在 GitHub Pages（推上 main 就自動部署，網址 https://king22killer-dot.github.io/-/）。
以前用 Netlify，因為免費額度有部署次數限制而改用 GitHub Pages。改動請先放在開發分支，累積好再一次推上 main。

## 檔案
- `index.html`：整個 App（HTML＋CSS＋JS 都在這個檔）。
- `firebase-config.js`：Firebase 專案 night-inspection 的連線設定。**不要刪、不要改成 null**，否則資料不會記錄到 Firebase。要改設定時，在這個檔上修改。
- `sw.js`：Service Worker，`CACHE` 名稱要跟著版本號更新（例如 `waste-inspection-v46`）。
- `manifest.json`、`icon-*.png`：加入主畫面用。
- `firestore.rules`：Firestore 權限規則（要到 Firebase 後台貼上才會生效）。
- `.nojekyll`：讓 GitHub Pages 直接發布檔案（不要刪）。
- `netlify.toml`：舊的 Netlify 設定，GitHub Pages 不會用到（GitHub Pages 會快取約 10 分鐘，更新後可能要等一下才拿到新版）。
- `docs/`：Firebase 設定說明、共用設定備份。

## 每次修改的規則
1. 改 `index.html` 裡的 `const APP_VER='vNN（YYYY-MM-DD）';`，版本號加 1。
2. `sw.js` 的 `CACHE` 改成同一個版本號。
3. 有新功能或操作改變時，更新 `index.html` 裡 `HELP` 陣列的使用說明。
4. 用 Playwright（iPhone 13 模擬）開頁面測試，確認沒有 JS 錯誤再 commit。
5. commit 訊息用中文簡述改了什麼。

## 重要的程式區塊（index.html）
- `judgement()`：判定規則。標準只填 `>` ＝ 大於或等於上次值為正常；`=` ＝ 自動帶入上次值且必須相同；`<N`、`>N`、`a~b`；`--` 不判定。
- 確定列（`#numBar`）：`positionNumBar()`、`nbVisibleBottom()`、`revealRow()`、`nbGuard()`。
  - 獨立網站（GitHub Pages）：確定列 `position:fixed`，用估計鍵盤高度（螢幕高度 36%）貼齊鍵盤上方。
  - 在 claude.ai 框架內（`EMBED`）：確定列改成貼著輸入列（`.inline`）。
- 自動捲動 `autoScroll`（預設關）與微調 `revealOff`（🎯 按鍵）。
- 雲端：Firebase（`fbInit`、`cloudStart`），集合 `config/main`、`records`、`admins/{uid}`。

## 使用者偏好
- 介面與說明一律繁體中文。
- 使用者主要在 iPhone 上使用；鍵盤遮擋是最常見的問題，改動確定列／捲動時要特別小心。

## 另一個獨立 App：薪資出勤（`salary/`）
老闆用的排班＋出勤＋薪資統計 App，跟夜班小幫手完全分開（自己的 manifest、圖示、Service Worker），網址 https://king22killer-dot.github.io/-/salary/。
- `salary/index.html`：整個 App。資料存在瀏覽器 localStorage（key `salaryBoss.v1`），沒有接 Firebase；設定頁有匯出／匯入備份。
- `salary/sw.js`：`CACHE` 名稱 `salary-vN`，跟 `salary/index.html` 的 `APP_VER` 同步加 1。改這個 App 時不用動夜班小幫手的版本號。
- 薪資計算在 `calc()`：時薪＝工時×時薪、日薪＝出勤天數×日薪、月薪＝月薪−請假扣款（月薪÷30）；加班前 2 小時 ×1.34、之後 ×1.67（設定可改）；特休全薪、病假半薪、事假無薪。
- 有新功能時更新 `helpCard()` 的使用說明。
