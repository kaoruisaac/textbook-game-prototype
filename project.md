# Textbook Gaming

> 狀態：Active — Prototype v1 六畫面互動版已公開／待 User UX 審閱（2026-11-07）

## 專案目標
- 建立名為 **Textbook Gaming** 的獨立主題子專案。
- 依 Qrio Hackathon User Stories v0.2 建立可操作的 Integrated Learning Mission Prototype：教師以教材意圖設計任務，學生參與 Stone Age Explorer，教師回看學習證據。正式產品定位仍 TBD。

## 專案結構
- [storybook/](./storybook/)：User Stories 草稿與已確認故事，先討論故事再形成 Prototype。
- [requirements.md](./requirements.md)：整理已確認需求與 TBD 的 Living product requirements。
- [notes/prototype-v1-page-flow-proposal.md](./notes/prototype-v1-page-flow-proposal.md)：根據 Qrio v0.2 User Stories 提出的六畫面 UX 動線；已獲准作為 Prototype v1 實作基準（非產品正式規格）。
- [prototype/](./)：依已確認 User Stories 衍生的 SolidJS + Vite + TypeScript Web Prototype，獨立 Git repository。

## 版本控制
- Prototype GitHub: https://github.com/kaoruisaac/textbook-game-prototype
- Prototype 公開網站：https://textbook-gaming.isaac-lin.cc/ （Cloudflare Tunnel + Gateway，首次公開於 2026-11-07）
- 本 GitHub repository 對應本機 `prototype/`；此處的 `project.md`、`requirements.md`、`storybook/`、`notes/` 是上層 Workspace 文件的同步副本。

## 最新進度
- 2026-11-07：建立子專案與 placeholder 原型，不預設遊戲機制或使用者流程；`npm run build` PASS，Prototype GitHub main 已推送。
- 2026-11-07：新增 `storybook/`，明確採用 User Story → requirements → prototype 的工作順序；目前尚未撰寫故事。
- 2026-11-07：已將 Storybook README、project/requirements 文件副本納入 Prototype Git repository，提交並推送 GitHub `main`。
- 2026-11-07：使用者授權新子網域公開，`textbook-gaming.isaac-lin.cc` 已部署 Placeholder。Build PASS；首頁、CSS、JS 外部 HTTPS 200／TLS PASS，Gateway／Tunnel／Recovery ACTIVE；其餘站點未變。
- 2026-11-07：原封不動保存使用者提供的 `Qrio_Stone_Age_Explorer_Hackathon_Workflow_User_Stories.md`（SHA-256 已核實）；先提出教師 Builder → 學生 Explorer → Evidence Studio 六畫面 UX 方案。
- 2026-11-07：使用者批准直接實作提案。六畫面互動版已落碼，包含三步驟教師 Builder、可編輯路徑、學生 5×5 座標地圖與 120 秒計時／文物判斷、結果與 Evidence Studio。所有 AI、教材擷取、學生樣本均維持可辨識 Mock。
- 2026-11-07：`npm run build` PASS；Mac Chrome Playwright 本機與公開 HTTPS 端到端 Demo Smoke 各 5/5 PASS（含路徑編輯、錯誤座標修正、採集+10、結果、老師確認與 390px mobile）；首頁及五子頁、CSS/JS 共 8 個 HTTPS endpoints = 200／TLS Verify=0，Tunnel/Gateway/Recovery active；原 `textbook-gaming.isaac-lin.cc` 更新為 v1。程式主功能 commit `a43d555` 已推 `main`。

## 下一步
- 請使用者審閱已公開 v1 的教師 Builder、學生 120 秒探索與 Evidence Studio；驗收後再進行 UX 調整。
- 後續 TBD：品牌層級、計時器是否可暫停、正式教材及 AI 接線、帳號與資料保存、跨科歷史內容驗證。
