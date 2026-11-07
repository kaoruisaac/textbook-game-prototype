import type { JSX } from "solid-js";
import { cx } from "../../utils";
import "./Highlight.css";

export interface HighlightProps {
  /** 載入時畫一次螢光筆。一個畫面最多一處。 */
  draw?: boolean;
  children: JSX.Element;
}

/** 螢光筆：只標題目關鍵字。內容要短，不換行。 */
export function Highlight(props: HighlightProps) {
  return <mark class={cx("pc-hl", props.draw && "pc-hl--draw")}>{props.children}</mark>;
}
