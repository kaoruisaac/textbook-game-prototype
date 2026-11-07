import { For } from "solid-js";
import { cx } from "../../utils";
import "./SegmentedControl.css";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

export interface SegmentedControlProps<T extends string> {
  /** 給輔助科技的群組名稱 */
  label: string;
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: "sm" | "md";
}

export function SegmentedControl<T extends string>(props: SegmentedControlProps<T>) {
  return (
    <div class={cx("pc-seg", props.size === "sm" && "pc-seg--sm")} role="group" aria-label={props.label}>
      <For each={props.options}>
        {(option) => (
          <button
            type="button"
            class="pc-seg__item"
            aria-pressed={props.value === option.value}
            onClick={() => props.onChange(option.value)}
          >
            {option.label}
          </button>
        )}
      </For>
    </div>
  );
}
