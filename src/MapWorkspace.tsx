import { createEffect, createSignal, Show } from "solid-js";
import type { JSX } from "solid-js";
import "./map-workspace.css";

export type MapWorkspaceProps = {
  map: JSX.Element;
  /** Replace this slot with the chatbot UI; the workspace owns positioning and collapse controls. */
  chat: JSX.Element;
  goal: string;
  time: string;
  urgent: boolean;
  score: number;
  explored: number;
  x: string;
  y: string;
  error: string;
  selecting: boolean;
  location: string;
  onX: (value: string) => void;
  onY: (value: string) => void;
  onLocate: () => void;
  onExit: () => void;
  onFinish: () => void;
};

export default function MapWorkspace(props: MapWorkspaceProps) {
  const [briefOpen, setBriefOpen] = createSignal(true);
  const [sheetOpen, setSheetOpen] = createSignal(true);
  const [chatOpen, setChatOpen] = createSignal(window.matchMedia("(min-width: 900px)").matches);
  const [toolsVisible, setToolsVisible] = createSignal(true);
  createEffect(() => { if (!props.selecting) { setChatOpen(true); setToolsVisible(true); } });
  let exitDialog!: HTMLDialogElement;
  const closeExit = () => exitDialog.close();
  return <section class="map-workspace" aria-label="史前探險地圖工作區" data-chat-open={chatOpen() && toolsVisible()} data-tools-visible={toolsVisible()}>
    <div class="workspace-map">{props.map}</div>
    <button class="map-back map-floating-icon" aria-label="返回任務封面" onClick={() => exitDialog.showModal()}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m14 6-6 6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
    <Show when={toolsVisible()}>
      <section class="map-mission-brief map-floating-card" aria-label="目前任務">
        <button class="map-brief-toggle" aria-expanded={briefOpen()} aria-controls="map-mission-details" onClick={() => setBriefOpen(!briefOpen())}><span class="map-mission-icon" aria-hidden="true">✧</span><span><small>MISSION 01 · 史前河谷</small><strong>石器時代探險</strong></span><span class="map-collapse-icon" aria-hidden="true">{briefOpen() ? "−" : "+"}</span></button>
        <Show when={briefOpen()}><div class="map-brief-details" id="map-mission-details"><p>{props.goal}</p><span>觀察地形 → 座標定位 → 根據線索做判斷</span></div></Show>
      </section>
      <div class="map-live-status map-floating-card" aria-label="探索狀態"><span class={props.urgent ? "urgent" : ""}><small>剩餘時間</small><b>{props.time}</b></span><span><small>本次分數</small><b>{props.score}</b></span><span><small>探索格點</small><b>{props.explored}<i> / 25</i></b></span></div>
      <aside class="map-chat-dock map-floating-card" aria-label="Qrio 聊天助手" hidden={!chatOpen()}>
        <div class="map-chat-toolbar"><span>✦ 探險助手</span><button aria-label="收起聊天助手" onClick={() => setChatOpen(false)}>−</button></div>
        <div class="map-chat-slot">{props.chat}</div>
      </aside>
      <Show when={!chatOpen()}><button class="map-chat-launcher map-floating-card" aria-label="展開聊天助手" onClick={() => setChatOpen(true)}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-8 8H5l-3 2v-10a9 9 0 0 1 18 0Z" stroke="currentColor" stroke-width="1.6"/><path d="M7 10h8M7 14h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg><span>Qrio 助手</span></button></Show>
      <section class="map-coordinate-sheet map-floating-card" aria-label="座標定位">
        <button class="map-sheet-toggle" aria-expanded={sheetOpen()} aria-controls="coordinate-sheet-content" onClick={() => setSheetOpen(!sheetOpen())}><span class="sheet-grip" aria-hidden="true"/><span><b>⌖ 探索座標</b><small>{props.location || "用座標，找到下一個發現。"}</small></span><span aria-hidden="true">{sheetOpen() ? "⌄" : "⌃"}</span></button>
        <Show when={sheetOpen()}><div class="map-sheet-content" id="coordinate-sheet-content"><Show when={props.selecting} fallback={<div class="map-coordinate-status"><span>已定位 · {props.location}</span><button onClick={() => setChatOpen(true)}>繼續與 Qrio 探索 →</button></div>}>
          <form class="map-coordinate-form" onSubmit={e => { e.preventDefault(); props.onLocate(); }}><label for="map-x">X 座標<input id="map-x" type="number" min="1" max="5" step="1" inputmode="numeric" placeholder="1–5" value={props.x} onInput={e => props.onX(e.currentTarget.value)}/></label><span class="coordinate-divider" aria-hidden="true">,</span><label for="map-y">Y 座標<input id="map-y" type="number" min="1" max="5" step="1" inputmode="numeric" placeholder="1–5" value={props.y} onInput={e => props.onY(e.currentTarget.value)}/></label><button class="btn primary" type="submit">前往探索 ↗</button></form>
          <Show when={props.error}><p class="map-coordinate-error" role="alert">{props.error}</p></Show><p class="map-coordinate-tip">輸入 X / Y，地圖會標出位置。X 向右增加，Y 向上增加。</p>
        </Show></div></Show>
      </section>
      <div class="map-bottom-note"><span>河流 · 平原 · 沼澤 · 森林 · 高山</span><span>探索示意圖 · 非真實遺址</span></div>
    </Show>
    <button class="map-tools-toggle map-floating-card" aria-pressed={!toolsVisible()} onClick={() => setToolsVisible(!toolsVisible())}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/></svg>{toolsVisible() ? "隱藏工具" : "顯示工具"}</button>
    <dialog class="map-exit-dialog" ref={exitDialog} aria-labelledby="map-exit-title" onClick={e => { if (e.target === exitDialog) closeExit(); }}><div class="map-exit-content"><span class="map-exit-icon" aria-hidden="true">↖</span><h2 id="map-exit-title">要退出這次探索嗎？</h2><p>你會回到任務封面。這次探索不會結算，重新開始後將建立新的探索紀錄。</p><div><button class="btn outline" autofocus onClick={closeExit}>繼續探索</button><button class="btn primary" onClick={() => { closeExit(); props.onExit(); }}>退出，返回封面</button></div><button class="map-exit-finish" onClick={() => { closeExit(); props.onFinish(); }}>完成這次探索，查看足跡 →</button></div></dialog>
  </section>;
}
