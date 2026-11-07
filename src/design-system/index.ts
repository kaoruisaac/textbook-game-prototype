/*
 * 鉛筆盒 Pencilcase — Textbook Gaming 設計系統
 *
 * 使用方式：
 *   import "./design-system/base.css";        // 在入口載入一次（含 tokens）
 *   import { Button, Card } from "./design-system";
 *
 * 總覽頁：npm run dev 後開 /storybook/design-system/
 */

export { cx, densityClass, type Density } from "./utils";
export * from "./icons";

// 基礎元件
export * from "./components/Button/Button";
export * from "./components/Chip/Chip";
export * from "./components/Card/Card";
export * from "./components/TextField/TextField";
export * from "./components/Toast/Toast";
export * from "./components/Notice/Notice";
export * from "./components/SegmentedControl/SegmentedControl";
export * from "./components/Progress/Progress";
export * from "./components/SectionHeading/SectionHeading";
export * from "./components/StepList/StepList";
export * from "./components/Upload/Upload";

// 介面框架（整理自目前的 Qrio 介面）
export * from "./components/Shell/Shell";

// 卡片與流程
export * from "./components/ActionCard/ActionCard";
export * from "./components/UnitCard/UnitCard";
export * from "./components/EmptyState/EmptyState";

// 學習與遊戲
export * from "./components/AnswerOption/AnswerOption";
export * from "./components/Feedback/Feedback";
export * from "./components/Highlight/Highlight";
export * from "./components/Stamp/Stamp";
export * from "./components/Face/Face";
export * from "./components/Chat/Chat";
export * from "./components/GameHud/GameHud";

// 學習證據（教師端）
export * from "./components/Evidence/Evidence";
