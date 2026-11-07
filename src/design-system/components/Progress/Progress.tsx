import { For, Show, type JSX } from "solid-js";
import { cx } from "../../utils";
import "./Progress.css";

export interface ProgressBarProps {
  /** 0–100 */
  value: number;
  tone?: "blue" | "leaf";
  label: string;
}

export function ProgressBar(props: ProgressBarProps) {
  const clamped = () => Math.max(0, Math.min(100, props.value));
  return (
    <div
      class="pc-bar"
      role="progressbar"
      aria-label={props.label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped())}
    >
      <i class={cx("pc-bar__fill", props.tone === "leaf" && "pc-bar__fill--leaf")} style={{ width: `${clamped()}%` }} />
    </div>
  );
}

export interface StatProps {
  label: string;
  value: JSX.Element;
  /** 數字後面的小字，例如「/ 29」「%」 */
  suffix?: string;
  /** 0–100，提供時下面多一條進度條 */
  progress?: number;
  tone?: "blue" | "leaf";
}

/** 教師端的統計列：標籤、數字、進度條。 */
export function Stat(props: StatProps) {
  return (
    <div class="pc-stat">
      <div class="pc-stat__top">
        <span class="pc-stat__label">{props.label}</span>
        <b class="pc-stat__value pc-num">
          {props.value}
          <Show when={props.suffix}>
            <small>{props.suffix}</small>
          </Show>
        </b>
      </div>
      <Show when={props.progress !== undefined}>
        <ProgressBar value={props.progress!} tone={props.tone} label={props.label} />
      </Show>
    </div>
  );
}

export interface LevelStepsProps {
  total: number;
  /** 目前所在的關卡，從 1 開始 */
  current: number;
  /** 左側的說明，例如「正在第 5 關：移項」。省略時顯示「第 n 關」。 */
  caption?: string;
  hideCaption?: boolean;
}

/** 關卡進度：已完成用封面藍，目前所在用螢光黃。 */
export function LevelSteps(props: LevelStepsProps) {
  const steps = () => Array.from({ length: props.total }, (_, i) => i);
  return (
    <div class="pc-steps" role="img" aria-label={`第 ${props.current} 關，共 ${props.total} 關`}>
      <div class="pc-steps__track">
        <For each={steps()}>
          {(i) => (
            <i
              class={cx(
                "pc-steps__step",
                i < props.current - 1 && "pc-steps__step--done",
                i === props.current - 1 && "pc-steps__step--now",
              )}
            />
          )}
        </For>
      </div>
      <Show when={!props.hideCaption}>
        <div class="pc-steps__caption" aria-hidden="true">
          <span>{props.caption ?? `第 ${props.current} 關`}</span>
          <span class="pc-num">
            {props.current} / {props.total}
          </span>
        </div>
      </Show>
    </div>
  );
}
