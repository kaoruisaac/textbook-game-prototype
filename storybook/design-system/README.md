# 鉛筆盒設計系統總覽

Textbook Gaming 的設計系統總覽頁。頁面上的每一個元件都是 `src/design-system/` 裡的真實 Solid 元件，不是截圖或複製的 HTML。

## 怎麼看

```bash
npm run dev
```

開啟 <http://localhost:5173/storybook/design-system/>。

頁首可以切換：
- **淺色／深色**：預覽兩種色彩模式。
- **學生端／教師端**：切換基礎元件、介面框架、學習與學習證據區段的密度。

## 內容

原則、色彩、字體、圓角與厚度、符號臉、基礎元件、介面框架（整理自目前的 Qrio 介面）、學習與遊戲、學習證據，以及「目前介面 class → 設計系統元件」對照表。

## 檔案位置

| 用途 | 位置 |
|---|---|
| Tokens（色彩、字體、圓角、間距、密度） | `src/design-system/tokens.css` |
| 全域樣式（載入 tokens） | `src/design-system/base.css` |
| 元件 | `src/design-system/components/` |
| 匯出入口 | `src/design-system/index.ts` |
| 這個總覽頁的程式 | `src/design-system/overview/` |

## 狀態

- 2026-11-07：第一版。元件已建立；`src/App.tsx` 還沒有改用設計系統，對照表列出遷移時的對應方式。
