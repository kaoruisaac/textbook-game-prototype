/*
 * 學習證據：從 Evidence Studio（原介面 EventList、.student-entry、.insight-card）整理出來。
 */
import { For, Show, type JSX } from "solid-js";
import { cx } from "../../utils";
import { Chip, type ChipTone } from "../Chip/Chip";
import type { FaceColor } from "../Face/Face";
import "../Face/Face.css";
import "./Evidence.css";

/* ---------- 事件列表 ---------- */

export interface EventItem {
  id: number | string;
  /** 事件類型，例如「座標」「推理」「採集決策」 */
  tag: string;
  title: string;
  details?: string;
  /** 分數變化，0 也會顯示 */
  delta?: number;
  time?: string;
}

export interface EventListProps {
  items: EventItem[];
}

export function EventList(props: EventListProps) {
  return (
    <ol class="pc-events">
      <For each={props.items}>
        {(item) => (
          <li class="pc-events__row">
            <span class="pc-events__tag">{item.tag}</span>
            <div class="pc-events__body">
              <strong>{item.title}</strong>
              <Show when={item.details}>
                <p>{item.details}</p>
              </Show>
            </div>
            <Show when={item.delta !== undefined}>
              <span class={cx("pc-events__delta pc-num", item.delta! < 0 && "is-negative")}>
                {item.delta! > 0 ? "+" : ""}
                {item.delta}
              </span>
            </Show>
            <Show when={item.time}>
              <span class="pc-events__time pc-num">{item.time}</span>
            </Show>
          </li>
        )}
      </For>
    </ol>
  );
}

/* ---------- 頭像與學生列 ---------- */

export interface AvatarProps {
  /** 一個字，通常是名字最後一個字 */
  text: string;
  color?: FaceColor;
  size?: number;
}

/** 文字頭像。需要表情時改用 <Face />。 */
export function Avatar(props: AvatarProps) {
  return (
    <span
      class={cx("pc-avatar", `pc-face--${props.color ?? "blue"}`)}
      style={{ "--pc-avatar-size": `${props.size ?? 36}px` }}
      aria-hidden="true"
    >
      {props.text}
    </span>
  );
}

export interface StudentEntryProps {
  avatar: JSX.Element;
  name: string;
  meta?: string;
  current?: boolean;
  onClick?: () => void;
}

export function StudentEntry(props: StudentEntryProps) {
  return (
    <button
      type="button"
      class={cx("pc-student", props.current && "is-current")}
      aria-current={props.current ? "true" : undefined}
      onClick={() => props.onClick?.()}
    >
      {props.avatar}
      <span class="pc-student__text">
        <strong>{props.name}</strong>
        {props.meta && <small>{props.meta}</small>}
      </span>
    </button>
  );
}

/* ---------- 待老師確認的解讀 ---------- */

export type ReviewStatus = "pending" | "accepted" | "edited" | "rejected";

const STATUS: Record<ReviewStatus, { label: string; tone: ChipTone }> = {
  pending: { label: "等老師確認", tone: "neutral" },
  accepted: { label: "老師已接受", tone: "leaf" },
  edited: { label: "老師已修正", tone: "blue" },
  rejected: { label: "老師已拒絕", tone: "red" },
};

export interface InsightCardProps {
  title: string;
  description: string;
  status: ReviewStatus;
  /** 對應的學習目標，例如「數學：座標定位」 */
  goal?: string;
  /** 引用一段學生的原始紀錄 */
  quote?: string;
  /** 可回溯的事件數。0 時會提醒老師不能推斷。 */
  evidenceCount: number;
  onDecide: (status: Exclude<ReviewStatus, "pending">) => void;
  /** 修正時顯示的編輯區 */
  children?: JSX.Element;
}

/** AI 解讀卡片：每一則都要由老師接受、修正或拒絕。 */
export function InsightCard(props: InsightCardProps) {
  return (
    <article class="pc-insight">
      <header class="pc-insight__head">
        <h3>{props.title}</h3>
        <Chip tone={STATUS[props.status].tone}>{STATUS[props.status].label}</Chip>
      </header>
      <p class="pc-insight__desc">{props.description}</p>
      <Show when={props.goal}>
        <span class="pc-insight__goal">{props.goal}</span>
      </Show>
      <Show when={props.quote}>
        <blockquote class="pc-insight__quote">{props.quote}</blockquote>
      </Show>
      <small class={cx("pc-insight__count", props.evidenceCount === 0 && "is-empty")}>
        {props.evidenceCount > 0 ? `可回溯到 ${props.evidenceCount} 筆紀錄` : "目前沒有對應紀錄，不能據此推斷學生表現。"}
      </small>
      {props.children}
      <div class="pc-insight__actions" role="group" aria-label={`${props.title}的老師決定`}>
        <button type="button" aria-pressed={props.status === "accepted"} onClick={() => props.onDecide("accepted")}>
          接受
        </button>
        <button type="button" aria-pressed={props.status === "edited"} onClick={() => props.onDecide("edited")}>
          修正
        </button>
        <button type="button" aria-pressed={props.status === "rejected"} onClick={() => props.onDecide("rejected")}>
          拒絕
        </button>
      </div>
    </article>
  );
}
