/*
 * 遊戲中的資訊：從 Stone Age Explorer（原介面 .indicator、.mission-stats、.result-stat-grid、.hint-card、.feedback-panel）整理出來。
 */
import { For, type JSX } from "solid-js";
import { cx } from "../../utils";
import "./GameHud.css";

export interface IndicatorProps {
  label: string;
  value: JSX.Element;
  /** 時間快到時提醒，例如剩 25 秒 */
  urgent?: boolean;
}

/** 遊戲中常駐的數字，例如分數、剩餘時間。 */
export function Indicator(props: IndicatorProps) {
  return (
    <div class={cx("pc-indicator", props.urgent && "is-urgent")}>
      <span class="pc-indicator__label">{props.label}</span>
      <strong class="pc-indicator__value pc-num">{props.value}</strong>
    </div>
  );
}

export interface StatGroupProps {
  items: { value: JSX.Element; label: string }[];
}

/** 一排大數字，用在任務簡介與結果頁。 */
export function StatGroup(props: StatGroupProps) {
  return (
    <dl class="pc-statgroup">
      <For each={props.items}>
        {(item) => (
          <div>
            <dt>{item.label}</dt>
            <dd class="pc-num">{item.value}</dd>
          </div>
        )}
      </For>
    </dl>
  );
}

export interface ClueCardProps {
  /** 線索的種類，例如「地形觀察」「文物線索」 */
  label: string;
  title?: string;
  children: JSX.Element;
}

/** 線索卡片：給學生推理用的資訊，不直接給答案。 */
export function ClueCard(props: ClueCardProps) {
  return (
    <div class="pc-clue">
      <span class="pc-clue__label">{props.label}</span>
      {props.title && <strong class="pc-clue__title">{props.title}</strong>}
      <div class="pc-clue__text">{props.children}</div>
    </div>
  );
}

export interface ScoreFeedbackProps {
  delta: number;
  title: string;
  /** 一段說明，告訴學生為什麼得到這個分數 */
  children: JSX.Element;
  /** 底部的累計，例如「目前總分 20，已探索 3 格」 */
  summary?: JSX.Element;
  action?: JSX.Element;
}

/** 單次得分回饋（原介面 .feedback-panel）。 */
export function ScoreFeedback(props: ScoreFeedbackProps) {
  return (
    <div class={cx("pc-score", props.delta < 0 && "is-loss", props.delta === 0 && "is-zero")}>
      <div class="pc-score__badge">
        <span>本次得分</span>
        <strong class="pc-num">
          {props.delta > 0 ? "+" : ""}
          {props.delta}
        </strong>
      </div>
      <h3 class="pc-score__title">{props.title}</h3>
      <div class="pc-score__text">{props.children}</div>
      {props.summary && <p class="pc-score__summary">{props.summary}</p>}
      {props.action}
    </div>
  );
}
