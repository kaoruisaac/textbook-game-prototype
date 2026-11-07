# Textbook Gaming — Product Requirements

> 狀態：Living document；以使用者明確決策為準。
> Prototype: ./

## 1. 產品概述
- [Confirmed] 專案名稱為 **Textbook Gaming**。
- [Confirmed] 使用者已提供 `storybook/Qrio_Stone_Age_Explorer_Hackathon_Workflow_User_Stories.md` v0.2，要求以此為來源提出 Prototype 頁面/流程提案；此輪不可實作新畫面。
- [Proposed / Unapproved] 文件描述通用的 Integrated Learning Mission：老師以教材及意圖生成 Mission → 學生體驗 Stone Age Explorer → 老師審閱證據並決定 Next Move。這是來源文件提出的產品範圍，尚未經 User 確認作為實作需求。
- [TBD] Textbook Gaming 與 Qrio 的產品命名/定位關係、正式使用者與落地方式，仍待確認。

## 2. 範圍與邊界
- REQ-001 [Confirmed] 建立一個可執行的 Web Prototype。
- REQ-002 [Confirmed] 目前僅需空白 Placeholder，不提前實作產品功能或遊戲規則。
- REQ-003 [Confirmed] Prototype 需提交並推送至 `kaoruisaac/textbook-game-prototype` 的 `main` 分支。
- REQ-005 [Confirmed] User Stories 保存於專案根目錄 `storybook/`；後續先討論故事，再將已確認內容整理成需求並形成 Prototype。
- REQ-006 [Confirmed] 以新的公開子網域部署現有 Placeholder Prototype；目前網址為 `https://textbook-gaming.isaac-lin.cc/`。
- REQ-007 [Confirmed] 本次只將使用者提供的原始 User Story 存放在 `storybook/` 並提案版面流程，不改動已公開的 Placeholder Prototype。
- [Provisional] 原型暫用 SolidJS、Vite、TypeScript（原型技術選擇，不代表正式產品決策）。

## 3. 功能需求
- REQ-004 [Provisional] 顯示專案名稱、Placeholder 狀態及後續待規劃提示；不包含可操作的遊戲、登入或資料功能。

## 4. 畫面與互動
- [Proposed / 尚未實作] v1 六畫面架構：Demo 首頁、教師 Mission Builder（三步驟）、學生 Mission Brief、Stone Age Explorer 遊戲、遊戲結果、教師 Evidence Studio；詳 `notes/prototype-v1-page-flow-proposal.md`。
- [Proposed / 尚未實作] Student Explorer 在同頁保留 5×5 地圖與 AI 助手，可走完座標、Why、Hint、挖掘、文物、採集、計分、120 秒結算。5×5/計分數字/8–12 地點依來源為**建議值**，未經使用者核定。
- [Provisional] 單頁式響應式佔位畫面。
- [Confirmed] 當前不要求互動流程。

## 5. 資料與整合
- [Confirmed] 本輪無資料、API、帳號系統或外部整合需求。

## 6. 驗收條件
- Prototype 可在本機執行與建置。
- 首頁能顯示 Textbook Gaming 空白佔位畫面。
- 程式碼存在 GitHub 指定倉庫的 `main`。

## 7. TBD — 未決需求
- TBD-001 [Open] 「Textbook Gaming」的產品定位、受眾與核心價值是什麼？
- TBD-002 [Open] 核心頁面、內容與遊戲／教材互動流程有哪些？
- TBD-003 [Open] 未來是否需要使用者帳號、儲存進度、內容管理與 API？
- TBD-004 [Open] 最終品牌視覺、配色及支援裝置需求？
- TBD-005 [Open] Prototype v1 採六畫面完整教學閉環，或優先只展示學生遊戲與精簡教師端？
- TBD-006 [Open] 120 秒倒數何時開始？是否包含輸入理由時間及允許暫停？
- TBD-007 [Open] 使用 5×5、8–12 地點與建議計分表作為首版 Demo 資料嗎？
- TBD-008 [Open] 教材擷取、AI 問答、學生證據與發布在 Demo 階段要 Mock 到什麼程度？
- TBD-009 [Open] Textbook Gaming / Qrio / Stone Age Explorer 三個名稱的展示層級？

## 8. 決策與變更紀錄
- 2026-11-07：使用者要求建立獨立子專案與 Web Prototype Placeholder，並推送指定 GitHub main。
- 2026-11-07：確認 `storybook/` 專門保存 User Stories，後續由 User Stories 驅動 Prototype；本次不修改畫面。
- 2026-11-07：使用者授權將現有 Placeholder 發布到獨立子網域 `textbook-gaming.isaac-lin.cc`；首頁與靜態資源 HTTPS 已驗證。
- 2026-11-07：已匯入 Qrio User Story v0.2，建立未核准的 Prototype v1 頁面動線提案；目前公開原型仍保持 Placeholder，不將來源中的建議設定升格為 Confirmed。
