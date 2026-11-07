import { splitProps, type JSX } from "solid-js";
import { cx, densityClass, type Density } from "../../utils";
import "./Card.css";

export interface CardProps extends JSX.HTMLAttributes<HTMLElement> {
  /** 這張卡片裡的元件用哪一端的密度 */
  density?: Density;
}

/** 卡片：圓角 22，系統裡最大的容器。只用在需要和周圍分開的一組內容。 */
export function Card(props: CardProps) {
  const [local, rest] = splitProps(props, ["density", "class", "children"]);
  return (
    <article class={cx("pc-card", densityClass(local.density), local.class)} {...rest}>
      {local.children}
    </article>
  );
}

export interface CardHeaderProps {
  children: JSX.Element;
  /** 右上角的小字，例如「學生端」 */
  aside?: JSX.Element;
}

export function CardHeader(props: CardHeaderProps) {
  return (
    <header class="pc-card__head">
      <div class="pc-card__head-main">{props.children}</div>
      {props.aside && <span class="pc-card__aside">{props.aside}</span>}
    </header>
  );
}
