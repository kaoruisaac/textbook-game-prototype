import type { JSX } from "solid-js";
import { cx } from "../../utils";
import "./Chat.css";
import { Sparkles } from "../../icons";

export interface ChatBubbleProps {
  /** qrio：助手說的話（原介面 .chat-bubble）；student：學生自己寫的（原介面 .student-echo） */
  from?: "qrio" | "student";
  /** 說話者或這段話的用途，例如「Qrio」「你的想法」 */
  label?: string;
  children: JSX.Element;
}

export function ChatBubble(props: ChatBubbleProps) {
  const from = () => props.from ?? "qrio";
  return (
    <div class={cx("pc-bubble", `pc-bubble--${from()}`)}>
      <span class="pc-bubble__label">{props.label ?? (from() === "qrio" ? <><Sparkles size={14} aria-hidden="true" />Qrio</> : "你的想法")}</span>
      <div class="pc-bubble__text">{props.children}</div>
    </div>
  );
}

export interface AssistantHeaderProps {
  name: string;
  description?: string;
  online?: boolean;
}

/** 助手面板的頁首（原介面 .assistant-head）。 */
export function AssistantHeader(props: AssistantHeaderProps) {
  return (
    <div class="pc-assistant">
      <span class="pc-assistant__avatar" aria-hidden="true">
        <Sparkles size={18} />
      </span>
      <span class="pc-assistant__text">
        <strong>{props.name}</strong>
        {props.description && <small>{props.description}</small>}
      </span>
      {props.online !== false && (
        <span class="pc-assistant__status">
          <span class="pc-visually-hidden">上線中</span>
        </span>
      )}
    </div>
  );
}
