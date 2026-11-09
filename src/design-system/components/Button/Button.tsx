import { splitProps, type JSX } from "solid-js";
import { cx } from "../../utils";
import "./Button.css";

/**
 * primary：主要動作
 * secondary：次要動作（原介面的 .btn.outline）
 * quiet：文字按鈕（原介面的 .btn.ghost）
 * done：已完成的動作
 */
export type ButtonVariant = "primary" | "secondary" | "quiet" | "done";

export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** sm：表格、卡片內；md：預設，高度跟著密度；lg：頁面主要行動 */
  size?: "sm" | "md" | "lg";
  /** 撐滿容器寬度（原介面的 .btn.full） */
  block?: boolean;
  icon?: JSX.Element;
}

/** Qrio 按鈕：主要為 teal-500 底深色字加青綠微光，次要為白底灰框。高度跟著密度（學生端 48px，教師端 40px）。圖示用 Lucide，放在文字前。 */
export function Button(props: ButtonProps) {
  const [local, rest] = splitProps(props, ["variant", "size", "block", "icon", "class", "children", "type"]);
  return (
    <button
      type={local.type ?? "button"}
      class={cx(
        "pc-btn",
        `pc-btn--${local.variant ?? "primary"}`,
        local.size && local.size !== "md" && `pc-btn--${local.size}`,
        local.block && "pc-btn--block",
        local.class,
      )}
      {...rest}
    >
      {local.icon}
      {local.children}
    </button>
  );
}
