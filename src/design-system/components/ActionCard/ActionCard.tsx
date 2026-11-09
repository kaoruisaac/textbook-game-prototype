import type { JSX } from "solid-js";
import { cx } from "../../utils";
import { Check } from "../../icons";
import "./ActionCard.css";

export interface JourneyCardProps {
  /** 流程中的第幾步。只有真正有順序的流程才傳。 */
  step?: number;
  /** 誰使用這一步，例如「老師」「學生」 */
  role: string;
  icon: JSX.Element;
  title: string;
  description: string;
  /** 卡片底部的動作文字，說明點了會去哪 */
  actionLabel: string;
  onClick: () => void;
}

/** 流程入口卡片（原介面 .journey-card）。整張可點。 */
export function JourneyCard(props: JourneyCardProps) {
  return (
    <button type="button" class="pc-journey" onClick={() => props.onClick()}>
      <span class="pc-journey__role">
        {props.step !== undefined && <span class="pc-num">{props.step}</span>}
        {props.role}
      </span>
      <span class="pc-journey__icon" aria-hidden="true">
        {props.icon}
      </span>
      <strong class="pc-journey__title">{props.title}</strong>
      <span class="pc-journey__desc">{props.description}</span>
      <span class="pc-journey__action">{props.actionLabel}</span>
    </button>
  );
}

export type ChoiceTone = "blue" | "green" | "yellow" | "coral" | "sky" | "lilac";

export interface ChoiceCardProps {
  icon: JSX.Element;
  title: string;
  description: string;
  /** 卡片底部的補充 */
  footnote?: string;
  selected: boolean;
  onSelect: () => void;
  tone?: ChoiceTone;
}

/** 可選擇的卡片（原介面 .path-card）。一組裡只會選一張。 */
export function ChoiceCard(props: ChoiceCardProps) {
  return (
    <button
      type="button"
      class={cx("pc-choice", `pc-choice--${props.tone ?? "blue"}`, props.selected && "is-selected")}
      aria-pressed={props.selected}
      onClick={() => props.onSelect()}
    >
      <span class="pc-choice__top">
        <span class="pc-choice__icon" aria-hidden="true">
          {props.icon}
        </span>
        <span class="pc-choice__check" aria-hidden="true">
          {props.selected ? <Check size={16} strokeWidth={2.6} /> : ""}
        </span>
      </span>
      <strong class="pc-choice__title">{props.title}</strong>
      <span class="pc-choice__desc">{props.description}</span>
      {props.footnote && <span class="pc-choice__foot">{props.footnote}</span>}
    </button>
  );
}
