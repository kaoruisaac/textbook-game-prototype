// 工作區與右側 Qrio 之間的共用狀態：助手開關，以及「檢查學習目標」的引導請求。
import { createSignal } from "solid-js";
import type { Subject } from "./lesson-plan-data";

export type GuideRequest = { subject: Subject; text: string; apply: (text: string) => void };

export const [assistantOpen, setAssistantOpen] = createSignal(window.matchMedia("(min-width: 1280px)").matches);
export const [guide, setGuide] = createSignal<GuideRequest | null>(null);

export function startGuide(request: GuideRequest) {
  setGuide(request);
  setAssistantOpen(true);
}
