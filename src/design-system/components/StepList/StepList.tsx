import { For } from "solid-js";
import { cx } from "../../utils";
import { Check } from "../../icons";
import "./StepList.css";

export interface StepItem {
  title: string;
  description?: string;
  /** 步驟旁的數量提示，例如待處理的回饋 */
  badge?: number;
  /** 數量需要老師處理時為 true，提示會用醒目色 */
  badgeAlert?: boolean;
}

export interface StepListProps {
  label: string;
  steps: StepItem[];
  /** 目前步驟，從 0 開始 */
  current: number;
  onSelect?: (index: number) => void;
  /** 回傳 false 時該步驟不能點 */
  canSelect?: (index: number) => boolean;
}

/** 直式步驟（原介面 .builder-step）。步驟是有順序的，所以用數字；完成的步驟換成勾。 */
export function StepList(props: StepListProps) {
  return (
    <ol class="pc-steplist" aria-label={props.label}>
      <For each={props.steps}>
        {(step, i) => {
          const done = () => i() < props.current;
          const now = () => i() === props.current;
          return (
            <li>
              <button
                type="button"
                class={cx("pc-steplist__item", now() && "is-current", done() && "is-done")}
                aria-current={now() ? "step" : undefined}
                disabled={props.canSelect ? !props.canSelect(i()) : !props.onSelect}
                onClick={() => props.onSelect?.(i())}
              >
                <span class="pc-steplist__num pc-num">{done() ? <Check size={18} strokeWidth={2.6} aria-label="已完成" /> : i() + 1}</span>
                <span class="pc-steplist__text">
                  <strong>{step.title}</strong>
                  {step.description && <small>{step.description}</small>}
                </span>
                {!!step.badge && <span class={cx("pc-steplist__badge", step.badgeAlert && "is-alert")} aria-label={step.badge + " 則"}>{step.badge}</span>}
              </button>
            </li>
          );
        }}
      </For>
    </ol>
  );
}
