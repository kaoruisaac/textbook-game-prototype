# 遊戲地圖浮層與聊天接入

`src/MapWorkspace.tsx` 是滿屏地圖外殼，`src/map-workspace.css` 負責浮層定位與響應式排列。

- `map` 插槽：地圖景觀、格線和點選互動。目前使用 `ExpeditionMap`。
- `chat` 插槽：放入完整 chatbot UI。外殼負責右側面板位置、展開與收起；插槽是可用高度有限的 flex 容器，內容需設定 `min-height: 0`，避免撐高頁面。手機展開時覆蓋在地圖上。
- `x`、`y`、`onX`、`onY`、`onLocate`：底部座標 sheet 的受控輸入。定位後由 App 記錄 `coordinate_selected`，進入現有探索流程。
- `selecting`：可定位狀態；從定位進入探索階段時，聊天面板自動展開。
- `onExit`：退出確認後回任務封面；`onFinish`：結束並查看探索足跡。

在 `src/App.tsx` 的 `<MapWorkspace chat={...} />` 替換聊天插槽內容即可接入新的 chatbot，不必修改地圖或座標 sheet。現階段插槽沿用既有助手流程，不代表已接上另一位 agent 開發的 chatbot。

Brief、座標 sheet、聊天面板可分別收合；「隱藏工具」可一次隱藏所有面板。返回與恢復工具的按鈕保持可用。原生 `<dialog>` 提供退出確認、焦點限制與 Escape 取消。
