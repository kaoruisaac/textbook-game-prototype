import { cx } from "../../utils";
import "./Stamp.css";

export interface StampProps {
  /** 兩個字最好：全對、進步、讚 */
  text: string;
  size?: "md" | "sm";
}

/** 獎勵章：取代星星與獎盃，像老師蓋在作業上的印章。 */
export function Stamp(props: StampProps) {
  return (
    <div class={cx("pc-stamp", props.size === "sm" && "pc-stamp--sm")} role="img" aria-label={`獎勵章：${props.text}`}>
      {props.text}
    </div>
  );
}
