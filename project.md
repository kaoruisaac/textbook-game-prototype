# Textbook Gaming

> 狀態：Active — User Story 已匯入／Prototype v1 版面流程待審（2026-11-07）；公開站仍為 Placeholder

## 專案目標
- 建立名為 **Textbook Gaming** 的獨立主題子專案。
- 先提供可執行、內容留白的 Web Prototype，後續再討論產品定位與功能。

## 專案結構
- [storybook/](./storybook/)：User Stories 草稿與已確認故事，先討論故事再形成 Prototype。
- [requirements.md](./requirements.md)：整理已確認需求與 TBD 的 Living product requirements。
- [notes/prototype-v1-page-flow-proposal.md](./notes/prototype-v1-page-flow-proposal.md)：根據 Qrio v0.2 User Stories 擬定的六畫面 UX 動線，尚待 User 核准。
- [prototype/](./)：依已確認 User Stories 衍生的 SolidJS + Vite + TypeScript Web Prototype，獨立 Git repository。

## 版本控制
- Prototype GitHub: https://github.com/kaoruisaac/textbook-game-prototype
- Prototype 公開網站：https://textbook-gaming.isaac-lin.cc/ （Cloudflare Tunnel + Gateway，首次公開於 2026-11-07）
- 本 GitHub repository 對應本機 `prototype/`；此處的 `project.md`、`requirements.md`、`storybook/`、`notes/` 為上層 Workspace 文件的同步副本。

## 最新進度
- 2026-11-07：建立子專案與 placeholder 原型，不預設遊戲機制或使用者流程；`npm run build` PASS，Prototype GitHub main 已推送。
- 2026-11-07：新增 `storybook/`，明確採用 User Story → requirements → prototype 的工作順序；目前尚未撰寫故事。
- 2026-11-07：已將 Storybook README、project/requirements 文件副本納入 Prototype Git repository，提交並推送 GitHub `main`。
- 2026-11-07：使用者授權新子網域公開，`textbook-gaming.isaac-lin.cc` 已部署 Placeholder。Build PASS；首頁、CSS、JS 外部 HTTPS 200／TLS PASS，Gateway／Tunnel／Recovery ACTIVE；其餘站點未變。
- 2026-11-07：原封不動保存使用者提供的 `Qrio_Stone_Age_Explorer_Hackathon_Workflow_User_Stories.md`（SHA-256 已核實）；提出教師 Builder → 學生 Explorer → Evidence Studio 的六畫面 UX 方案。僅文件提案，**尚未修改 Prototype 或發布新版**。

## 下一步
- 等待 User 審閱 `notes/prototype-v1-page-flow-proposal.md` 的頁面動線、遊戲倒數與 Demo 深度；確認後再同步正式需求與調整 Prototype。
