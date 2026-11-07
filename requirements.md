# Textbook Gaming — Product Requirements

> 狀態：Living document；以使用者明確決策為準。
> Prototype: ./prototype/

## 1. 產品概述
- [Confirmed] 專案名稱為 **Textbook Gaming**。
- [Confirmed] 使用者提供 `storybook/Qrio_Stone_Age_Explorer_Hackathon_Workflow_User_Stories.md` v0.2 並於 2026-11-07 授權依已提出的六畫面方案實作 Prototype、推 GitHub main、發布既有站點。
- [Confirmed for Prototype v1] 整體展示 Teacher Intent → Mission Blueprint → Student Explorer → Learning Evidence → Teacher Decision；Stone Age Explorer 是通用 Integrated Learning Mission 的示例 Runner。
- [Confirmed 2026-11-07] Stone Age Explorer Gameplay Iteration v0.3：地形選擇不判對錯、AI 對學生地形想像進行一輪回饋、每次挖掘都有物品、以年代與 Collect 決定獎懲。原始 Story v0.2 保留，增補見 `storybook/Stone_Age_Explorer_Gameplay_Iteration_v0.3.md`。
- [Confirmed 2026-11-07] 學生端必須先**輸入 X/Y 座標**來決定地點；地圖立即顯示輸入所對應的位置標記。地圖僅供觀察，不可點擊選點或發動挖掘。學生確認座標、完成 Qrio 地形想像／回饋後，點擊「開始挖掘」，挖掘目標永遠是剛才輸入並定位的座標。
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
- [Confirmed] Student Runner 由學生輸入 X/Y 座標決定地點與對應地形；有效輸入即在地圖顯示定位標記，地圖不得點擊選格或挖掘。確認座標後詢問學生想像此地的石器時代人類活動、為何選擇挖掘；學生回答後再有一輪不判對錯的回饋，補充地形與歷史脈絡，不提前透露出土物正誤。點擊「開始挖掘」後直接對該已確認座標挖掘。
- [Confirmed] 地圖任一格挖掘都必定出現一件物品（無空格）；同局挖掘各格物品不同。出土物包含石器時代及其他年代案例，不能把農耕或陶器一律視為非石器時代。
- [Confirmed] 只有正確採集石器時代物品得正分，錯採非石器時代物品扣分；地形選擇與推理回答無正誤評分。
- [Prototype v0.3 / Demo-only] Student Runner：5×5 圖、X/Y 座標核對、回答與回應、地形提示、挖掘、線索、Collect/Leave、教學題庫計分、120 秒倒數與結果。AI 回應採本地關鍵字模板，非真正 AI 服務。
- [Prototype v1 / Demo-only] Evidence Studio：原始事件時間線、示範學生資料及本輪操作資料、三項候選理解訊號、教師接受／編輯／拒絕與 Next Move 示意。
- [Prototype v1 / Demo-only] 學習路徑與任務文字的編輯會反映到同次前端體驗；資料無永久儲存或班級同步。

- [Confirmed 2026-11-07] Student Runner 增加獨立 Qrio 浮動學習助教：學生不理解題目、回答方式或操作時可以自由提問；助教只引導當前任務與相關知識，不被離題問題帶走，且提供固定引導問題與 Script 回覆。它不代替學生選座標、挖掘或選擇採集答案。
- [Confirmed] 學生送進 Chatbot 的所有已送出提問（含選用固定問題）都是 Learning Evidence 來源之一。教師可看到原始提問和助教回覆，不把求助行為直接當成能力評分。

## 4. 畫面與互動
- [Implemented / Prototype v1] 六個畫面與建議路由：`/`、`/teacher/builder`、`/mission/demo`、`/mission/demo/explore`、`/mission/demo/result`、`/teacher/evidence/demo`。
- [Confirmed / Prototype v0.4] 桌面地圖／助手雙欄，手機上下排列；**輸入 X/Y → 地圖依輸入即時定位（不可點格）→ 確認該座標 → AI 提問 → 學生自由回答 → AI 一輪回饋＋地形線索 → 點擊「開始挖掘」（僅挖已定位的座標）→ 保證發現文物 → Collect/Leave → 年代揭示及計分 → 下一組座標**。地圖以定位標記、已挖掘標記與已探索標記呈現結果，不可作為輸入控制器。
- [Confirmed] 不允許「挖空」；任何格點只要挖掘就有文物，同局無重複物品。
- [Provisional / 未核准為產品規則] 5×5、25 件題庫每局洗牌、120 秒倒數、正確 Collect +10／錯誤 Collect −5／Leave 0／不挖掘 0，以及不允許重複探索格，均為 Demo 預設（見 TBD-012）。
- [Prototype-only] 倒數從按下「開始探索」後啟動，包含輸入理由及閱讀提示時間；目前無暫停，另有「結束本輪（Demo）」便於展示。

- [Confirmed / Prototype v0.5] 浮動助教可在學生任務簡介、探索與結果頁開啟／收合，和原本操作流程側欄共存；固定引導問題依學生目前頁面／階段變化；離題問題引導回座標、地形、挖掘或文物線索，不揭露文物的判定答案。
- [Provisional / Prototype v0.5] 大螢幕預設開啟，較小螢幕預設收合為浮動按鈕。回應使用本地關鍵字分類與固定文字，不是真正的 AI 或正式 Guardrail；助教提問不修改遊戲操作狀態。

## 5. 資料與整合
- [Prototype v0.3] 前端固定示範教材／地形、25 件預定年代標籤的文物題庫、每局重新洗牌與文字關鍵字／地形回饋模板；新增檔案只使用檔名，不讀取內容，無真實 AI、後端 API、登入、班級指派或資料上傳。
- [Confirmed] 保存學生地形推理原文、AI 第二輪回應、發現物品與採集判斷於 Learning Evidence；教師端可回看。正式歷史題庫須依地區與授課年代審定（TBD-011）。
- [Provisional] 探索事件及教師選擇只保存在目前頁面生命週期內，重新整理會失去本輪資料。

- [Confirmed / Prototype v0.5] 每個已送出的助教提問、提問方式（自由輸入／預設問題）、當前頁面與階段、可用的 X/Y 座標、助教回覆及時間，納入 Teacher Evidence Studio 的本輪原始事件時間線；新增「主動求助與釐清」候選訊號。離題提問同樣保留，不以離題與求助自動扣分。
- [Prototype-only] 事件為本頁記憶體資料，不會上傳；尚未送出的草稿不記錄、重新整理後不保留、目前沒有課堂或學生帳號儲存。

## 6. 驗收條件
- Prototype 可在本機執行與建置。
- 首頁展示 Qrio／Textbook Gaming Demo 入口；可走通教師→學生→Evidence 的完整流程（Mock）。
- 120 秒耗盡或按 Demo 結束後停止遊戲並進入結果頁；分數僅作遊戲回饋，不單獨推定學習能力。
- 每輪 25 個格點都有可發現物品，任一發現事件都可進入 Collect/Leave；採集後僅以已定義題庫的 target 決定加扣分。
- [Confirmed] 不可透過點擊地圖更改位置；合法 X/Y 輸入即在地圖對應格顯示定位標記，非法或不完整座標不能進入下一步，已探索座標不得重複挖掘（Prototype v0.4 預設）。完成想像與 AI 回饋後按下挖掘，只能更動該已確認座標的挖掘狀態、文物和 Evidence。
- 提交學生地形想像後出現回映其文字內容的 Qrio 回饋，並在老師 Evidence Studio 留下 `reasoning_feedback` 事件。
- 源文件中的 Teacher Confirmation、文物線索與資料來源均可在介面分辨。
- 程式碼存在 GitHub 指定倉庫的 `main`。

- [Confirmed / Prototype v0.5] 學生能在各學生頁面展開／收起助教、送出自由輸入或固定問題，並看到符合目前階段的回答；離題內容得到範圍內引導、不直接給出文物年代正確答案；座標與分數不因此變動。
- [Confirmed / Prototype v0.5] 教師端可回看每個學生助教提問、所處階段與 Script 回覆，能將其當作學習歷程而非唯一判定。

## 7. TBD — 未決需求
- TBD-001 [Open] 「Textbook Gaming」的產品定位、受眾與核心價值是什麼？
- TBD-002 [Resolved for Prototype v1] 已採六畫面教師→學生→Evidence 流程；正式產品的完整頁面與功能深度仍待定。
- TBD-003 [Open] 未來是否需要使用者帳號、儲存進度、內容管理與 API？
- TBD-004 [Open] 最終品牌視覺、配色及支援裝置需求？
- TBD-005 [Resolved for Prototype v1, 2026-11-07] 使用者要求依提案實作六畫面完整教學閉環。
- TBD-006 [Open] 120 秒倒數何時開始？是否包含輸入理由時間及允許暫停？
- TBD-007 [Superseded 2026-11-07] 舊版 10 處出土與 Leave +5 Demo 規則不再適用，依 v0.3 全地圖必有文物與新的暫定計分（見 TBD-012）。
- TBD-008 [Resolved for Prototype v1] 教材只處理檔名、AI 問答與來源為預寫 Demo、資料只在前端暫存、發布只產生前端連結；真實串接留待正式設計。
- TBD-009 [Open] Textbook Gaming / Qrio / Stone Age Explorer 三個名稱的展示層級？
- TBD-010 [Open] 正式 AI 如何依學生自由文字回應，需何種教材引用、兒童適齡限制、誤導防護、失敗降級？v0.3 只提供本地 Mock 回應。
- TBD-011 [Open] 歷史題庫的授課地區、石器時代定義、年代邊界、考古文獻審稿者與版本管理；目前 25 件只是跨文化教學示範。
- TBD-012 [Open] 25 件題庫／正負比例、+10／−5／Leave 0 與 120 秒包含 AI 對話時間是否正式採用？目前均為 Prototype 預設。

- TBD-013 [Open] 正式學習助教的教學範圍、固定 Script 與 LLM 策略、教材綁定、離題防護、兒童適齡審查、教師配置權限及防止透露測驗答案的設計。
- TBD-014 [Open] 未成年學生聊天證據的收集告知／同意、存取權限、保存期限、刪除機制、課堂／遊戲 Session 邊界；「所有輸入」目前指已送出訊息，非每個鍵入草稿。
- TBD-015 [Open] 使用助教時 120 秒是否暫停，以及如何避免將求助次數錯誤解讀成能力不足。

## 8. 決策與變更紀錄
- 2026-11-07：使用者要求獨立右側浮動 Chatbot 擔任學生助教，提供固定引導問題、限制離題與回答範圍，並將學生 Chatbot 輸入納入教師學習證據；v0.5 以可操作固定腳本 Mock 實現，正式 AI 與資料治理另列 TBD。
- 2026-11-07：使用者要求建立獨立子專案與 Web Prototype Placeholder，並推送指定 GitHub main。
- 2026-11-07：確認 `storybook/` 專門保存 User Stories，後續由 User Stories 驅動 Prototype；本次不修改畫面。
- 2026-11-07：使用者授權將現有 Placeholder 發布到獨立子網域 `textbook-gaming.isaac-lin.cc`；首頁與靜態資源 HTTPS 已驗證。
- 2026-11-07：已匯入 Qrio User Story v0.2，並先提出 UX 提案。
- 2026-11-07：使用者批准依此提案實作完整可操作的 Prototype v1、推送 GitHub 並更新原站；上述 Mock 設定仍標為 Demo-only，不宣稱真 AI/教師班級功能。
- 2026-11-07：Prototype v1 六畫面已落碼；本地/公開 Mac Chrome Playwright Smoke 各 5/5 PASS、六個頁面路由與 CSS/JS 公網 HTTPS 200/TLS PASS；已重新部署 `textbook-gaming.isaac-lin.cc`，待使用者親自審閱 UI。
- 2026-11-07：使用者更新地形開放式對話＋AI 二輪回應、挖掘必出物品且不重複、正確／錯誤採集獎懲。Prototype v0.3 把 Leave 設為 0 分、25 件跨文化題庫每局洗牌，正式 AI／題庫區域與計分細節仍 TBD。
- 2026-11-07：使用者明確糾正學生端交互：**不點地圖選點**，X/Y 輸入驅動即時地圖定位；確認後沿用地形想像與 AI 回饋，挖掘按鈕只能挖該座標。原 v1「點格→核對座標」與 v0.3「選地形／地圖格」已被本規則取代。
