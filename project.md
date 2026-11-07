# Textbook Gaming

> 狀態：Active — Placeholder Web Prototype 已建立（2026-11-07）

## 專案目標
- 建立名為 **Textbook Gaming** 的獨立主題子專案。
- 先提供可執行、內容留白的 Web Prototype，後續再討論產品定位與功能。

## 專案結構
- [storybook/](./storybook/)：User Stories 草稿與已確認故事，先討論故事再形成 Prototype。
- [requirements.md](./requirements.md)：整理已確認需求與 TBD 的 Living product requirements。
- [prototype/](./)：依已確認 User Stories 衍生的 SolidJS + Vite + TypeScript Web Prototype，獨立 Git repository。

## 版本控制
- Prototype GitHub: https://github.com/kaoruisaac/textbook-game-prototype
- 本 GitHub repository 對應本機 `prototype/`；本目錄的 `project.md`、`requirements.md`、`storybook/` 為 Workspace 上層文件同步副本，正式編輯來源位於上層。

## 最新進度
- 2026-11-07：建立子專案與 placeholder 原型，不預設遊戲機制或使用者流程；`npm run build` PASS，Prototype GitHub main 已推送。
- 2026-11-07：新增 `storybook/`，明確採用 User Story → requirements → prototype 的工作順序；目前尚未撰寫故事。

## 下一步
- 先在 `storybook/` 討論並記錄第一批 User Stories，確認後同步 `requirements.md`，再調整 Prototype。
