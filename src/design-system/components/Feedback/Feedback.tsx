import type { JSX } from "solid-js";
import { CheckCircleIcon, CrossCircleIcon } from "../../icons";
import "./Feedback.css";

export interface FeedbackProps {
  tone: "right" | "wrong";
  /** 預設「答對了」「再想想」 */
  title?: string;
  /** 一句說明為什麼。答錯時給線索，不直接給答案。 */
  children: JSX.Element;
}

export function Feedback(props: FeedbackProps) {
  return (
    <div class={`pc-feedback pc-feedback--${props.tone}`} aria-live="polite">
      {props.tone === "right" ? <CheckCircleIcon class="pc-feedback__icon" /> : <CrossCircleIcon class="pc-feedback__icon" />}
      <div>
        <strong class="pc-feedback__title">{props.title ?? (props.tone === "right" ? "答對了" : "再想想")}</strong>
        <span>{props.children}</span>
      </div>
    </div>
  );
}
