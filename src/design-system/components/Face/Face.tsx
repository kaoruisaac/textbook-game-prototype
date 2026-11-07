import { For, type JSX } from "solid-js";
import { cx } from "../../utils";
import "./Face.css";

export type FaceColor = "blue" | "yellow" | "green" | "coral" | "sky" | "lilac" | "peach" | "mint" | "gray";

export type FaceExpression = "default" | "right" | "wrong" | "thinking" | "perfect" | "discover" | "waiting" | "notStarted";

export interface FaceExpressionSpec {
  symbol: string;
  color: FaceColor;
  name: string;
  when: string;
}

/** 表情對應狀態：同一個表情永遠代表同一件事。 */
export const FACE_EXPRESSIONS: Record<FaceExpression, FaceExpressionSpec> = {
  default: { symbol: "• •", color: "sky", name: "預設頭像", when: "還沒有任何作答紀錄" },
  right: { symbol: "^ ^", color: "green", name: "答對", when: "單題答對、闖關成功" },
  wrong: { symbol: ">_<", color: "coral", name: "答錯", when: "單題答錯，搭配解說一起出現" },
  thinking: { symbol: "? ?", color: "yellow", name: "想一想", when: "作答中、看提示、進行中" },
  perfect: { symbol: "+ +", color: "blue", name: "全對", when: "整個關卡零失誤，跟獎勵章一起給" },
  discover: { symbol: "O O", color: "lilac", name: "新發現", when: "解鎖新單元、第一次遇到的題型" },
  waiting: { symbol: "· ·", color: "peach", name: "等批改", when: "已交卷，老師還沒看" },
  notStarted: { symbol: "– –", color: "gray", name: "未開始", when: "教師端名單，學生還沒點開" },
};

/** 頭像依座號在八個顏色中輪流分配，學生不需要上傳照片。 */
const SEAT_COLORS: FaceColor[] = ["blue", "yellow", "green", "coral", "sky", "lilac", "peach", "mint"];

export function faceColorForSeat(seat: number): FaceColor {
  return SEAT_COLORS[(((seat - 1) % SEAT_COLORS.length) + SEAT_COLORS.length) % SEAT_COLORS.length];
}

export interface FaceProps {
  expression?: FaceExpression;
  /** 直徑。建議 26、36、52、72、120（px），插畫裡可用 cqw。 */
  size?: number | string;
  /** 預設依表情決定，頭像可依座號覆寫 */
  color?: FaceColor;
  /** 只在插畫組合裡使用 */
  tilt?: number;
  /** 提供時以圖片朗讀，否則視為裝飾 */
  label?: string;
  class?: string;
  style?: JSX.CSSProperties;
}

/** 符號臉：用標點和數學符號拼成的表情圓。不加腮紅、手腳或額外五官。 */
export function Face(props: FaceProps) {
  const spec = () => FACE_EXPRESSIONS[props.expression ?? "default"];
  const size = () => (typeof props.size === "number" ? `${props.size}px` : props.size ?? "72px");
  return (
    <span
      class={cx("pc-face", `pc-face--${props.color ?? spec().color}`, props.class)}
      style={{
        "--pc-face-size": size(),
        ...(props.tilt ? { transform: `rotate(${props.tilt}deg)` } : {}),
        ...props.style,
      }}
      role={props.label ? "img" : undefined}
      aria-label={props.label}
      aria-hidden={props.label ? undefined : "true"}
    >
      {spec().symbol}
    </span>
  );
}

export interface FaceClusterItem {
  expression: FaceExpression;
  color?: FaceColor;
  /** 容器寬度的百分比 */
  size: number;
  left: number;
  top: number;
  tilt?: number;
}

const DEFAULT_CLUSTER: FaceClusterItem[] = [
  { expression: "right", size: 22, left: 2, top: 30, tilt: -6 },
  { expression: "thinking", size: 13, left: 24, top: 4, tilt: 8 },
  { expression: "perfect", size: 27, left: 33, top: 30 },
  { expression: "wrong", size: 12, left: 22, top: 72, tilt: -10 },
  { expression: "discover", size: 18, left: 63, top: 2, tilt: 5 },
  { expression: "default", color: "mint", size: 10, left: 84, top: 40, tilt: -4 },
  { expression: "waiting", size: 16, left: 66, top: 60, tilt: 7 },
];

export interface FaceClusterProps {
  /** 每組最多 7 個 */
  items?: FaceClusterItem[];
  class?: string;
}

/** 符號臉組合：空白頁、結果頁的插圖。大小隨容器寬度縮放。 */
export function FaceCluster(props: FaceClusterProps) {
  return (
    <div class={cx("pc-face-cluster", props.class)} aria-hidden="true">
      <For each={(props.items ?? DEFAULT_CLUSTER).slice(0, 7)}>
        {(item) => (
          <Face
            expression={item.expression}
            color={item.color}
            size={`${item.size}cqw`}
            tilt={item.tilt}
            style={{ position: "absolute", left: `${item.left}%`, top: `${item.top}%` }}
          />
        )}
      </For>
    </div>
  );
}
