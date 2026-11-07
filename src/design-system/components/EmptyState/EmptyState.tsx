import type { JSX } from "solid-js";
import { FaceCluster } from "../Face/Face";
import "./EmptyState.css";

export interface EmptyStateProps {
  /** 說明現在是什麼狀態 */
  title: string;
  /** 告訴使用者下一步做什麼 */
  description: string;
  action?: JSX.Element;
  /** 預設為符號臉組合 */
  illustration?: JSX.Element;
}

export function EmptyState(props: EmptyStateProps) {
  return (
    <section class="pc-empty">
      <div class="pc-empty__copy">
        <h3 class="pc-empty__title">{props.title}</h3>
        <p class="pc-empty__desc">{props.description}</p>
        {props.action}
      </div>
      <div class="pc-empty__art">{props.illustration ?? <FaceCluster />}</div>
    </section>
  );
}
