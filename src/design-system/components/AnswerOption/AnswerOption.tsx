import type { JSX } from "solid-js";
import { CheckIcon, CrossIcon } from "../../icons";
import { cx } from "../../utils";
import "./AnswerOption.css";

export type AnswerState = "idle" | "right" | "wrong";

export interface AnswerOptionProps {
  /** 選項代號：A、B、C、D */
  keyLabel: string;
  state?: AnswerState;
  onClick?: () => void;
  disabled?: boolean;
  children: JSX.Element;
}

/** 選擇題選項。對錯同時用顏色、代號底色和圖示表達。 */
export function AnswerOption(props: AnswerOptionProps) {
  const state = () => props.state ?? "idle";
  return (
    <button
      type="button"
      class={cx("pc-opt", state() !== "idle" && `pc-opt--${state()}`)}
      aria-pressed={state() !== "idle"}
      disabled={props.disabled}
      onClick={() => props.onClick?.()}
    >
      <span class="pc-opt__key">{props.keyLabel}</span>
      <span class="pc-opt__text">{props.children}</span>
      {state() === "right" && <CheckIcon class="pc-opt__icon" />}
      {state() === "wrong" && <CrossIcon class="pc-opt__icon" />}
      {state() !== "idle" && <span class="pc-visually-hidden">{state() === "right" ? "，答對" : "，答錯"}</span>}
    </button>
  );
}

export interface AnswerGroupProps {
  label: string;
  children: JSX.Element;
  /** 每列幾個選項，手機寬度一律一列一個 */
  columns?: 1 | 2;
}

export function AnswerGroup(props: AnswerGroupProps) {
  return (
    <div class={cx("pc-opts", props.columns === 1 && "pc-opts--single")} role="group" aria-label={props.label}>
      {props.children}
    </div>
  );
}
