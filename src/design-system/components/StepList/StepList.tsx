import { For } from "solid-js";
import { cx } from "../../utils";
import "./StepList.css";

export interface StepItem {
  title: string;
  description?: string;
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
                <span class="pc-steplist__num pc-num">{done() ? "✓" : i() + 1}</span>
                <span class="pc-steplist__text">
                  <strong>{step.title}</strong>
                  {step.description && <small>{step.description}</small>}
                </span>
              </button>
            </li>
          );
        }}
      </For>
    </ol>
  );
}
