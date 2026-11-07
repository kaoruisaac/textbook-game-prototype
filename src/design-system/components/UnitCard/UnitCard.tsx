import "./UnitCard.css";

export type UnitTone = "blue" | "yellow" | "green";

export interface UnitCardProps {
  subject: string;
  /** 例如「五上」 */
  grade: string;
  /** 例如「第二單元 水溶液的性質」 */
  unit: string;
  tone: UnitTone;
}

/** 單元卡：白色書框加一塊主色，輔助色只做圖形點綴。 */
export function UnitCard(props: UnitCardProps) {
  return (
    <article class="pc-unit">
      <h3 class="pc-unit__title">
        {props.subject}
        <small>{props.grade}</small>
      </h3>
      <div class={`pc-unit__fill pc-unit__fill--${props.tone}`}>
        <span>{props.unit}</span>
      </div>
    </article>
  );
}
