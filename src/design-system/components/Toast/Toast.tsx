import { Show } from "solid-js";
import { CheckIcon } from "../../icons";
import "./Toast.css";

export interface ToastProps {
  /** 用和按鈕相同的動詞：按「提醒」，通知寫「已提醒」 */
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function Toast(props: ToastProps) {
  return (
    <div class="pc-toast" role="status">
      <CheckIcon class="pc-toast__icon" />
      <span>{props.message}</span>
      <Show when={props.actionLabel}>
        <button type="button" class="pc-toast__action" onClick={() => props.onAction?.()}>
          {props.actionLabel}
        </button>
      </Show>
    </div>
  );
}
