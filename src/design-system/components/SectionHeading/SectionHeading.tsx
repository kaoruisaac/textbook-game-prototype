import { Dynamic } from "solid-js/web";
import type { JSX } from "solid-js";
import { cx } from "../../utils";
import "./SectionHeading.css";

export interface SectionHeadingProps {
  /**
   * page：頁面標題（原介面 .page-top）
   * section：區段標題（原介面 SectionHeading）
   * panel：面板標題（原介面 .panel-heading）
   */
  size?: "page" | "section" | "panel";
  /** 標題上方的位置說明，例如「教師工作台」。一般句子大小寫，不用全大寫。 */
  kicker?: string;
  title: JSX.Element;
  description?: JSX.Element;
  /** 右側的標籤或操作 */
  aside?: JSX.Element;
}

const TAG = { page: "h1", section: "h2", panel: "h3" } as const;

export function SectionHeading(props: SectionHeadingProps) {
  const size = () => props.size ?? "section";
  return (
    <div class={cx("pc-heading", `pc-heading--${size()}`)}>
      <div class="pc-heading__main">
        {props.kicker && <p class="pc-heading__kicker">{props.kicker}</p>}
        <Dynamic component={TAG[size()]} class="pc-heading__title">
          {props.title}
        </Dynamic>
        {props.description && <p class="pc-heading__desc">{props.description}</p>}
      </div>
      {props.aside && <div class="pc-heading__aside">{props.aside}</div>}
    </div>
  );
}
