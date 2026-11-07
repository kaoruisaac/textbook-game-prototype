# Textbook Gaming

> 狀態：Active — Prototype v0.5「浮動學習助教＋聊天學習證據」已實作、Build／Chrome Smoke PASS、原公開站已更新／待 User UX 審閱（2026-11-07）

## 專案目標
- 建立名為 **Textbook Gaming** 的獨立主題子專案。
- 依 Qrio Hackathon User Stories v0.2 建立可操作的 Integrated Learning Mission Prototype：教師以教材意圖設計任務，學生參與 Stone Age Explorer，教師回看學習證據。正式產品定位仍 TBD。

## 專案結構
- [storybook/](./storybook/)：原始 v0.2 User Stories、[Gameplay v0.3 增補](./storybook/Stone_Age_Explorer_Gameplay_Iteration_v0.3.md)、[Learning Tutor v0.5](./storybook/Stone_Age_Explorer_Learning_Tutor_v0.5.md)，先討論故事再形成 Prototype。
- [requirements.md](./requirements.md)：整理已確認需求與 TBD 的 Living product requirements。
- [notes/prototype-v1-page-flow-proposal.md](./notes/prototype-v1-page-flow-proposal.md)：根據 Qrio v0.2 User Stories 提出的六畫面 UX 動線；已獲准作為 Prototype v1 實作基準（非產品正式規格）。
- [prototype/](./prototype/)：依已確認 User Stories 衍生的 SolidJS + Vite + TypeScript Web Prototype，獨立 Git repository。

## 版本控制
- Prototype GitHub: https://github.com/kaoruisaac/textbook-game-prototype
- Prototype 公開網站：https://textbook-gaming.isaac-lin.cc/ （Cloudflare Tunnel + Gateway，首次公開於 2026-11-07）
- Git repository root: `prototype/`。Workspace 上層的 `storybook/`、`requirements.md`、`project.md` 為正式編輯來源；推送時會同步副本至 Prototype Git repository，以便 GitHub 檢視。

## 最新進度
- 2026-11-07：建立子專案與 placeholder 原型，不預設遊戲機制或使用者流程；`npm run build` PASS，Prototype GitHub main 已推送。
- 2026-11-07：新增 `storybook/`，明確採用 User Story → requirements → prototype 的工作順序；目前尚未撰寫故事。
- 2026-11-07：已將 Storybook README、project/requirements 文件副本納入 Prototype Git repository，提交並推送 GitHub `main`。
- 2026-11-07：使用者授權新子網域公開，`textbook-gaming.isaac-lin.cc` 已部署 Placeholder。Build PASS；首頁、CSS、JS 外部 HTTPS 200／TLS PASS，Gateway／Tunnel／Recovery ACTIVE；其餘站點未變。
- 2026-11-07：原封不動保存使用者提供的 `Qrio_Stone_Age_Explorer_Hackathon_Workflow_User_Stories.md`（SHA-256 已核實）；先提出教師 Builder → 學生 Explorer → Evidence Studio 六畫面 UX 方案。
- 2026-11-07：使用者批准直接實作提案。六畫面互動版已落碼，包含三步驟教師 Builder、可編輯路徑、學生 5×5 座標地圖與 120 秒計時／文物判斷、結果與 Evidence Studio。所有 AI、教材擷取、學生樣本均維持可辨識 Mock。
- 2026-11-07：`npm run build` PASS；Mac Chrome Playwright 本機與公開 HTTPS 端到端 Demo Smoke 各 5/5 PASS（含路徑編輯、錯誤座標修正、採集+10、結果、老師確認與 390px mobile）；首頁及五子頁、CSS/JS 共 8 個 HTTPS endpoints = 200／TLS Verify=0，Tunnel/Gateway/Recovery active；原 `textbook-gaming.isaac-lin.cc` 更新為 v1。程式主功能 commit `a43d555` 已推 `main`。
- 2026-11-07：Gameplay Iteration v0.3：學生選地形／座標後以開放文字想像古人活動，Qrio 使用前端 Mock 關鍵字＋地形模板回應第二輪且不判地形對錯；25 件跨文化教學題庫每輪洗牌、每格挖掘必得不重複物品、正確 Collect +10／錯誤 Collect −5／Leave 0；教師端新增 `reasoning_feedback` 事件。歷史分類固定由題庫控制，非 AI 即席鑑定。Mac Chrome 完整 25/25 挖掘、15 正／10 負、25 AI 回饋 Evidence、mobile 390px no overflow、拒挖掘／Leave 0 分均 PASS；GitHub main 已推送 `df785f3`；原站 `textbook-gaming.isaac-lin.cc` 已重新 Build／部署，HTTPS /mission/demo/explore 200／TLS PASS，公開 Mac Chrome AI 回應→挖掘 Smoke PASS。
- 2026-11-07：UX 更正 v0.4：最新使用者決議將學生地點選擇改為 X/Y 輸入即時定位，地圖僅唯讀呈現，不能點格；確認後延續 AI 提問／回饋，挖掘按鈕只挖已確認的座標，地圖顯示挖掘標記。TypeScript + Vite Build PASS，Mac Chrome Playwright 驗證 25 格全不可點、輸入定位、點格不更動位置、挖掘定位一致、已探索不可重訪與無頁面錯誤 PASS；390px 無水平溢出。GitHub main commit `a24c945` 已推送；`https://textbook-gaming.isaac-lin.cc/` 已重新發布，公開 Mac Chrome 同套 Smoke PASS、HTTPS 子路由 200／TLS verify 0，Gateway active。

- 2026-11-07：學生模式新增獨立浮動 Learning Tutor（Brief／Explorer／Result 可收合），階段式固定引導問題、本地 Script 回覆、離題導回與不劇透答案；自由提問／固定提問與回覆均記入教師 Evidence 時間線，額外新增「主動求助與釐清」候選訊號。TypeScript／Vite Build PASS；Mac Chrome Playwright 本地桌機與 390px Smoke PASS（離題、收合、階段切換、證據、手機無水平溢出／Console 0）；原站 textbook-gaming.isaac-lin.cc 已重新發布、HTTPS 學生簡介與教師證據頁 200。正式真 AI、安全護欄、未成年資料治理仍 TBD。見 storybook v0.5 與 requirements.md。

## 下一步
- 請使用者審閱 v0.5 浮動助教的問答與證據流程，以及原 v0.4 座標輸入定位與 v0.3 文物題庫。
- 後續 TBD：品牌層級、計時器是否可暫停、正式教材及 AI 接線、帳號與資料保存、跨科歷史內容驗證。
