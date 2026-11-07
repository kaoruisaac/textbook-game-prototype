# Textbook Gaming — Product Requirements

> 狀態：Living document；以使用者明確決策為準。
> Prototype: ./

## 1. 產品概述
- [Confirmed] 專案名稱為 **Textbook Gaming**。
- [TBD] 產品目標、主要使用者、使用情境與任務流程尚未定義。

## 2. 範圍與邊界
- REQ-001 [Confirmed] 建立一個可執行的 Web Prototype。
- REQ-002 [Confirmed] 目前僅需空白 Placeholder，不提前實作產品功能或遊戲規則。
- REQ-003 [Confirmed] Prototype 需提交並推送至 `kaoruisaac/textbook-game-prototype` 的 `main` 分支。
- REQ-005 [Confirmed] User Stories 保存於專案根目錄 `storybook/`；後續先討論故事，再將已確認內容整理成需求並形成 Prototype。
- REQ-006 [Confirmed] 以新的公開子網域部署現有 Placeholder Prototype；目前網址為 `https://textbook-gaming.isaac-lin.cc/`。
- [Provisional] 原型暫用 SolidJS、Vite、TypeScript（原型技術選擇，不代表正式產品決策）。

## 3. 功能需求
- REQ-004 [Provisional] 顯示專案名稱、Placeholder 狀態及後續待規劃提示；不包含可操作的遊戲、登入或資料功能。

## 4. 畫面與互動
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

## 8. 決策與變更紀錄
- 2026-11-07：使用者要求建立獨立子專案與 Web Prototype Placeholder，並推送指定 GitHub main。
- 2026-11-07：確認 `storybook/` 專門保存 User Stories，後續由 User Stories 驅動 Prototype；本次不修改畫面。
- 2026-11-07：使用者授權將現有 Placeholder 發布到獨立子網域 `textbook-gaming.isaac-lin.cc`；首頁與靜態資源 HTTPS 已驗證。
