# Textbook Gaming — Product Requirements

> 狀態：Living document；以使用者明確決策為準。
> Prototype: ./

## 1. 產品概述
- [Confirmed] 專案名稱為 **Textbook Gaming**。
- [Confirmed] 使用者提供 `storybook/Qrio_Stone_Age_Explorer_Hackathon_Workflow_User_Stories.md` v0.2 並於 2026-11-07 授權依已提出的六畫面方案實作 Prototype、推 GitHub main、發布既有站點。
- [Confirmed for Prototype v1] 整體展示 Teacher Intent → Mission Blueprint → Student Explorer → Learning Evidence → Teacher Decision；Stone Age Explorer 是通用 Integrated Learning Mission 的示例 Runner。
- [TBD] Textbook Gaming 與 Qrio 的產品命名/定位關係、正式使用者與落地方式，仍待確認。

## 2. 範圍與邊界
- REQ-001 [Confirmed] 建立一個可執行的 Web Prototype。
- REQ-002 [Superseded 2026-11-07] 初始只需 Placeholder；已由互動 Prototype v1 的最新授權取代。
- REQ-003 [Confirmed] Prototype 需提交並推送至 `kaoruisaac/textbook-game-prototype` 的 `main` 分支。
- REQ-005 [Confirmed] User Stories 保存於專案根目錄 `storybook/`；後續先討論故事，再將已確認內容整理成需求並形成 Prototype。
- REQ-006 [Confirmed] Prototype 公開網址為 `https://textbook-gaming.isaac-lin.cc/`；原 Placeholder 已由 v1 互動版新需求取代。
- REQ-007 [Superseded 2026-11-07] 先提案暫不實作；使用者已批准依提案建立 Prototype。
- REQ-008 [Confirmed for Prototype v1] 六畫面 Demo：首頁、教師三步驟 Builder、學生 Mission Brief、探索遊戲、結果、教師 Evidence Studio。
- REQ-009 [Confirmed for Prototype v1] 完成後推送 `kaoruisaac/textbook-game-prototype` 的 main，重新部署到既有 `https://textbook-gaming.isaac-lin.cc/`。
- [Provisional] 原型暫用 SolidJS、Vite、TypeScript（原型技術選擇，不代表正式產品決策）。

## 3. 功能需求
- REQ-004 [Superseded 2026-11-07] 初始 Placeholder 顯示。
- [Prototype v1 / Demo-only] Teacher Builder：預載三份範例教材與教學意圖，允許追加檔名；示範分析狀態、編輯並確認三種學習目標與來源、編輯共同目標與三條學習路徑，最後產生前端示範連結。**不解析實際上傳檔案**。
- [Prototype v1 / Demo-only] Student Runner：選路徑、5×5 地形圖、X/Y 座標核對、輸入 Why、讀取地形提示、決定挖掘、查看文物線索、Collect/Leave、固定規則計分、120 秒倒數與結果摘要。
- [Prototype v1 / Demo-only] Evidence Studio：原始事件時間線、示範學生資料及本輪操作資料、三項候選理解訊號、教師接受／編輯／拒絕與 Next Move 示意。
- [Prototype v1 / Demo-only] 學習路徑與任務文字的編輯會反映到同次前端體驗；資料無永久儲存或班級同步。

## 4. 畫面與互動
- [Implemented / Prototype v1] 六個畫面與建議路由：`/`、`/teacher/builder`、`/mission/demo`、`/mission/demo/explore`、`/mission/demo/result`、`/teacher/evidence/demo`。
- [Implemented / Prototype v1] 遊戲地圖和 AI 助手桌面雙欄、手機上下排列；座標、Why、Hint、挖掘、文物、採集、回饋可以走完一輪。
- [Provisional / 未核准為產品規則] 5×5、10 組有文物地點、120 秒倒數、+10/−5/+5/0 計分與不允許重複探索格，均作為來源建議的 Demo 預設。
- [Prototype-only] 倒數從按下「開始探索」後啟動，包含輸入理由及閱讀提示時間；目前無暫停，另有「結束本輪（Demo）」便於展示。

## 5. 資料與整合
- [Prototype v1] 前端固定示範教材/地形/文物/預寫 AI 提示/學生紀錄；新增檔案只使用檔名，不讀取內容，無真實 AI、後端 API、登入、班級指派或資料上傳。
- [Provisional] 探索事件及教師選擇只保存在目前頁面生命週期內，重新整理會失去本輪資料。

## 6. 驗收條件
- Prototype 可在本機執行與建置。
- 首頁展示 Qrio／Textbook Gaming Demo 入口；可走通教師→學生→Evidence 的完整流程（Mock）。
- 120 秒耗盡或按 Demo 結束後停止遊戲並進入結果頁；分數僅作遊戲回饋，不單獨推定學習能力。
- 源文件中的 Teacher Confirmation、文物線索與資料來源均可在介面分辨。
- 程式碼存在 GitHub 指定倉庫的 `main`。

## 7. TBD — 未決需求
- TBD-001 [Open] 「Textbook Gaming」的產品定位、受眾與核心價值是什麼？
- TBD-002 [Resolved for Prototype v1] 已採六畫面教師→學生→Evidence 流程；正式產品的完整頁面與功能深度仍待定。
- TBD-003 [Open] 未來是否需要使用者帳號、儲存進度、內容管理與 API？
- TBD-004 [Open] 最終品牌視覺、配色及支援裝置需求？
- TBD-005 [Resolved for Prototype v1, 2026-11-07] 使用者要求依提案實作六畫面完整教學閉環。
- TBD-006 [Open] 120 秒倒數何時開始？是否包含輸入理由時間及允許暫停？
- TBD-007 [Resolved as Prototype-only default] v1 採 5×5、10 組固定文物地點及 +10/−5/+5/0；正式規則仍需教師/團隊確認。
- TBD-008 [Resolved for Prototype v1] 教材只處理檔名、AI 問答與來源為預寫 Demo、資料只在前端暫存、發布只產生前端連結；真實串接留待正式設計。
- TBD-009 [Open] Textbook Gaming / Qrio / Stone Age Explorer 三個名稱的展示層級？

## 8. 決策與變更紀錄
- 2026-11-07：使用者要求建立獨立子專案與 Web Prototype Placeholder，並推送指定 GitHub main。
- 2026-11-07：確認 `storybook/` 專門保存 User Stories，後續由 User Stories 驅動 Prototype；本次不修改畫面。
- 2026-11-07：使用者授權將現有 Placeholder 發布到獨立子網域 `textbook-gaming.isaac-lin.cc`；首頁與靜態資源 HTTPS 已驗證。
- 2026-11-07：已匯入 Qrio User Story v0.2，並先提出 UX 提案。
- 2026-11-07：使用者批准依此提案實作完整可操作的 Prototype v1、推送 GitHub 並更新原站；上述 Mock 設定仍標為 Demo-only，不宣稱真 AI/教師班級功能。
- 2026-11-07：Prototype v1 六畫面已落碼；本地/公開 Mac Chrome Playwright Smoke 各 5/5 PASS、六個頁面路由與 CSS/JS 公網 HTTPS 200/TLS PASS；已重新部署 `textbook-gaming.isaac-lin.cc`，待使用者親自審閱 UI。
