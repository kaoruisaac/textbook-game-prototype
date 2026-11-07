import type { JSX } from "solid-js";
import { CheckIcon } from "../../icons";
import { cx } from "../../utils";
import "./Notice.css";

export type NoticeTone = "success" | "info" | "warning" | "neutral";

export interface NoticeProps {
  /**
   * success：完成（原介面 .success-note、.publish-success）
   * info：說明（原介面 .inline-note）
   * warning：需要注意
   * neutral：提示（原介面 .sidebar-tip）
   */
  tone?: NoticeTone;
  title?: string;
  /** 預設依 tone 決定，傳 null 不顯示 */
  icon?: JSX.Element | null;
  children?: JSX.Element;
}

const DEFAULT_ICON: Record<NoticeTone, () => JSX.Element> = {
  success: () => <CheckIcon size={18} />,
  info: () => <span>i</span>,
  warning: () => <span>!</span>,
  neutral: () => <span>✦</span>,
};

export function Notice(props: NoticeProps) {
  const tone = () => props.tone ?? "success";
  return (
    <div class={cx("pc-notice", `pc-notice--${tone()}`, props.title && "pc-notice--titled")} role={tone() === "success" ? "status" : undefined}>
      {props.icon !== null && (
        <span class="pc-notice__icon" aria-hidden="true">
          {props.icon ?? DEFAULT_ICON[tone()]()}
        </span>
      )}
      <div class="pc-notice__body">
        {props.title && <strong class="pc-notice__title">{props.title}</strong>}
        {props.children}
      </div>
    </div>
  );
}
