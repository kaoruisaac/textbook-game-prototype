# Textbook Gaming — Qrio Stone Age Explorer Prototype v1 UX 提案

> Status: **Accepted for Prototype v1 implementation, 2026-11-07**；詳細 Demo 預設仍以 requirements.md 的 Provisional/TBD 為準。
> 本文保留原 UX 提案脈絡；使用者已指示先實作並推 GitHub/部署，Prototype v1 包含六個主要畫面。
> 唯一原始 User Story 來源：`../storybook/Qrio_Stone_Age_Explorer_Hackathon_Workflow_User_Stories.md`，v0.2（使用者提供）。

## 1. 核心設計主張

- 將產品表現為通用 **Integrated Learning Mission** 工作流程，而不是只有 Stone Age Explorer 遊戲。
- 首版覆蓋 **Teacher Intent → Mission Contract → Interactive Runner → Learning Evidence → Teacher Decision**。
- 教師與學生呈現不同資訊密度和介面語言；兩端在單一 Demo 中可切換，不實作真帳號系統。
- Stone Age Explorer 是第一個 Runner Template；地圖、物品與分數使用固定示例資料，避免用生成式 AI 當場決定正確答案。
- 使用者故事中的 P0 以可點選的 Mock 狀態走通；P1 只做低成本入口示意（需要審閱的部分不假裝完成）。

## 2. 資訊架構（建議六個主要畫面）

| 畫面 / 建議路徑 | 主要內容 | 來源故事 |
| --- | --- | --- |
| ① Demo 首頁 `/` | 教師建立 Mission / 學生加入 / 查看教師 Evidence 三條示範入口；展示總流程 | Product Vision |
| ② 教師 Mission Builder `/teacher/builder` | 同頁三步驟：教材與意圖 → 目標確認 → Mission 預覽及發布 | US-01～US-05 |
| ③ 學生 Mission Brief `/mission/demo` | 共同目標、兩至三條學習路徑，選擇後開始探索 | US-06 |
| ④ 探索遊戲 `/mission/demo/explore` | 5×5 座標地形圖、AI 助手、文物卡、分數與 120 秒計時 | US-06A/B、US-07A/B/C、US-08A/B/C/D |
| ⑤ 學生結果 `/mission/demo/result` | 總分、座標及探索紀錄、選擇理由與回顧；不將分數視為學習能力分級 | US-08、US-08D |
| ⑥ 教師 Evidence Studio `/teacher/evidence/demo` | 學生記錄、原始事件、候選理解訊號、教師接受/修改/拒絕與 Next Move | US-10、US-10A、US-11、US-12 |

頁面數為 UX 提案，不是文件要求的固定路由。② 的三步驟採同頁 Stepper，減少 Hackathon 展示切換成本。

## 3. 教師端流程與頁面布局

### ① 首頁
- 標題為 Integrated Learning Mission，副標顯示 Stone Age Explorer 示範情境。
- 主操作為「以老師身份開始」；另外有「體驗學生端」與「查看 Learning Evidence」。
- 最簡單的角色示範切換，不宣稱有完整登入/班級權限功能。

### ② Mission Builder（三步驟同頁）
- 左側窄欄為「1 教材與教學意圖 / 2 確認學習目標 / 3 設計與發布」進度。
- 右側主工作區隨步驟切換，底部固定下一步與返回。
- Step 1：多檔上傳清單（範例：座標、石器時代、跨科評量規準）＋一句教學意圖＋ Mock 分析狀態。
- Step 2：數學/社會學習目標卡片，分別標示「文件明確提供」「AI 推論」「教師已確認」；可調整文字並確認。
- Step 3：Mission Goal、Shared Outcome、共同學習目標、2–3 條路徑、Checkpoint、Stone Age Explorer 設定卡；右上可「預覽學生端」。
- 完成時在 Step 3 顯示發布成功與學生連結；連結進入 ③。先用 Demo Link，不建立真後端。

## 4. 學生端流程與頁面布局

### ③ Mission Brief
- 卡片展示共同探索目標與探險家角色設定。
- 顯示 2–3 條可選學習路徑（同一共同目標，切入點不同），選定後按「開始 120 秒探索」。
- 計時器直到按下開始才啟動。

### ④ Stone Age Explorer（關鍵示範畫面）
- Desktop 頂部：Mission 名稱、120 秒倒數、目前分數、離開/返回入口。
- Desktop 主區左側約 65%：可點的 X/Y 方格地圖，五種地形（河流/平原/沼澤/森林/高山）；格子選中態與已探索標記。
- Desktop 主區右側約 35%：「AI Exploration Assistant」固定互動欄；保留地圖可見，不用每一步都跳整頁。
- 手機版改為地圖在上、助手及座標輸入在下；不犧牲可點選格子的大小。
- 互動狀態：選地點 → 輸入並驗證座標 → 回答 Why → 顯示地形與歷史線索 → 是否挖掘？
- 若不挖掘，保存選擇並回地圖；若挖掘，展示帶材質/出土層位/歷史背景的物品卡。
- 學生選擇 Collect/Leave，可補理由；由固定資料計分並立即回饋，繼續下個位置。
- 倒數歸零時停止新操作並導向 ⑤。分層提示（US-07）屬 P1，不當作 P0 已確認。
- 示範數據先用文件建議的 5×5、8–12 個探索點、+10/−5/+5/0 計分，皆明確標為 Demo-only / 待確認。

### ⑤ 學生結果
- 顯示分數、探索過的地點、發現或留下的文物、學生理由簡短摘要。
- 以「你的探索證據」命名學習紀錄，而不是「你已掌握歷史/數學」的自動能力判定。
- 提供「查看探索紀錄」與「返回 Mission」的 Demo 導航。

## 5. 教師 Evidence Studio

### ⑥ 教師 Evidence Studio
- 左欄：學生/示例紀錄清單，含任務與時間資訊。
- 中欄：選定學生的事件時間線（座標、Why、提示、挖掘、文物卡、Collect/Leave、分數）。
- 右欄：Qrio 的「候選學習訊號」，逐項連到原始事件及學習目標；老師可接受、編輯或拒絕。
- 下方展示 Next Move 建議，但保持老師為最終決策者；前後作品比較（US-13）先不做完整功能。
- 所有示範學生資料清楚標明 Demo Data。

## 6. 初版 Demo 動線

Teacher Home → 上傳教材＋一句話 → 檢視/修改學習目標 → 審閱任務與路徑 → 發布 → Student Mission Brief → 選擇路徑 → 120 秒探索一輪（座標、Why、Hint、挖掘、Collect/Leave、得分）→ 時間到結果 → Teacher Evidence Studio → 老師確認候選訊號。

## 7. 視覺與互動原則（僅提案）

- 教師端：溫暖、清楚、低干擾的工作台；教材來源、目標與老師確認狀態優先於裝飾。
- 學生端：地圖/探險式視覺、易點擊大格子、立即可見的時間與分數；可讀的繁體中文。
- 優先讓地圖與 AI 助手並存，學生能連結「我選哪裡」與「我為什麼選」。
- 不用成績直接宣稱學會；Learning Evidence 與 Teacher Decision 要清楚分層。

## 8. 預計 Mock / Non-goals

- [Proposed] 多文件上傳與 Qrio 擷取：預先配置示範資料與模擬分析步驟，不宣稱實際讀取 PDF。
- [Proposed] AI 助手：使用預寫地形/歷史提示與問句，日後再接真 AI。
- [Proposed] 學生、任務、事件與分數：存在前端 Demo 狀態，非真實班級/多人同步。
- [Not in this proposal] 真實 AI 文檔分析、教師登入/班級管理、後端永久儲存、學生身份認證、完整 P1 後續作品比較。
- [Historical] 初次提案階段暫不修改 UI；2026-11-07 後續指示已授權依方案實作、推送與部署，取代這項限制。

## 9. 需要審閱的設計決策

- TBD-A：Textbook Gaming 是專案總名，還是公開產品應稱 Qrio？Stone Age Explorer 是否用作遊戲名稱？
- TBD-B：第一版要展示完整教師→學生→Evidence 閉環，還是偏重 120 秒遊戲、教師端只用簡短導覽？
- TBD-C：遊戲倒數是否包含輸入 Why/提示閱讀時間？一輪遊戲中是否允許暫停？
- TBD-D：Demo 是否使用文件建議的 5×5、8–12 點和加減分規則？歷史範圍需教師確定。
- TBD-E：模擬多使用者的資料切換、遊戲結果是否要跨頁保留／重新整理可恢復？
- TBD-F：學生端需手機優先，還是 Hackathon 桌面演示優先？

## 10. Source IDs

- 教師：US-01～US-05。
- 學生：US-06、US-06A、US-06B、US-07A/B/C、US-08、US-08A/B/C/D；US-07、US-09 暫列 P1。
- Evidence：US-10、US-10A、US-11、US-12；US-13 P1。
- 計分、5×5 與 8–12 組案例皆依來源建議，未自動升格為 User Confirmed。
