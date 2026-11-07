import type { JSX } from "solid-js";
import { cx } from "../../utils";
import "./Chip.css";

export type ChipTone = "neutral" | "blue" | "leaf" | "amber" | "red";

export interface ChipProps {
  tone?: ChipTone;
  /** 前面加一個狀態圓點 */
  dot?: boolean;
  class?: string;
  children: JSX.Element;
}

/** 標籤：科目、單元、作答狀態。圓角 6，是系統裡最小的圓角。 */
export function Chip(props: ChipProps) {
  return (
    <span class={cx("pc-chip", `pc-chip--${props.tone ?? "neutral"}`, props.class)}>
      {props.dot && <span class="pc-chip__dot" aria-hidden="true" />}
      {props.children}
    </span>
  );
}
