import { createSignal, Show } from "solid-js";
import type { JSX } from "solid-js";
import "./map-workspace.css";

export type MapWorkspaceProps = {
  map: JSX.Element; chat: JSX.Element; chatOpen: boolean; onChatOpen: (open: boolean) => void;
  goal: string; time: string; urgent: boolean; score: number; explored: number;
  x: string; y: string; error: string; selecting: boolean; location: string;
  onX: (value: string) => void; onY: (value: string) => void;
  onLocate: () => void; onExit: () => void; onFinish: () => void;
};

export default function MapWorkspace(props: MapWorkspaceProps) {
  const [briefOpen, setBriefOpen] = createSignal(false);
  let exitDialog!: HTMLDialogElement;
  return <section class="map-workspace" aria-label="史前探險地圖工作區" data-chat-open={props.chatOpen}>
    <header class="workspace-heading"><button class="workspace-back" aria-label="返回任務封面" onClick={() => exitDialog.showModal()}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m14 6-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>返回</span></button><h1>石器時代探險</h1><button class="workspace-brief-button" aria-expanded={briefOpen()} aria-controls="workspace-brief" onClick={() => setBriefOpen(!briefOpen())}>任務說明 <span aria-hidden="true">{briefOpen() ? "−" : "+"}</span></button></header>
    <Show when={briefOpen()}><section id="workspace-brief" class="workspace-brief" aria-label="任務說明"><h2>這次的任務</h2><p>{props.goal}</p><button onClick={() => setBriefOpen(false)}>知道了</button></section></Show>
    <div class="workspace-stage"><div class="workspace-map">{props.map}</div><aside id="learning-assistant-panel" class="workspace-assistant" aria-label="Qrio 學習助教" hidden={!props.chatOpen}><div class="workspace-assistant-heading"><strong><span aria-hidden="true">✦</span> Qrio 學習助教</strong><button aria-label="收起學習助教" onClick={() => props.onChatOpen(false)}>×</button></div><div class="workspace-assistant-content">{props.chat}</div></aside></div>
    <div class="workspace-toolbar" role="toolbar" aria-label="地圖探索工具列">
      <Show when={props.error}><p class="toolbar-error" role="alert">{props.error}</p></Show>
      <form class="toolbar-coordinates" onSubmit={e => { e.preventDefault(); props.onLocate(); }}><label for="map-x"><span>X</span><input id="map-x" aria-label="X 座標" type="number" min="1" max="5" step="1" required inputmode="numeric" placeholder="1–5" value={props.x} disabled={!props.selecting} onInput={e => props.onX(e.currentTarget.value)}/></label><label for="map-y"><span>Y</span><input id="map-y" aria-label="Y 座標" type="number" min="1" max="5" step="1" required inputmode="numeric" placeholder="1–5" value={props.y} disabled={!props.selecting} onInput={e => props.onY(e.currentTarget.value)}/></label><button class="btn primary" type="submit" disabled={!props.selecting}>{props.selecting ? "確認探索" : "探索中"}</button></form>
      <span class="toolbar-location" aria-live="polite">{props.location || "選一個座標"}</span>
      <div class="toolbar-actions"><span class="toolbar-score">{props.score}<small> 分</small></span><span class={"toolbar-time" + (props.urgent ? " urgent" : "")} aria-label={"剩餘時間 " + props.time}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="13" r="8" stroke="currentColor" stroke-width="1.8"/><path d="M12 9v4l3 2M9 2h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg><span>{props.time}</span></span><button class="toolbar-assistant-button" aria-expanded={props.chatOpen} aria-controls="learning-assistant-panel" onClick={() => props.onChatOpen(!props.chatOpen)}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 11a8 8 0 0 1-8 8H6l-4 3V11a9 9 0 0 1 18 0Z" stroke="currentColor" stroke-width="1.7"/><path d="M7 9h7M7 13h5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg><span>學習助教</span></button></div>
    </div>
    <dialog class="workspace-exit-dialog" ref={exitDialog} aria-labelledby="workspace-exit-title"><div><h2 id="workspace-exit-title">要離開探索嗎？</h2><p>返回任務封面後，重新開始會建立新的探索紀錄。</p><div class="workspace-exit-actions"><button class="btn outline" autofocus onClick={() => exitDialog.close()}>繼續探索</button><button class="btn primary" onClick={() => { exitDialog.close(); props.onExit(); }}>返回封面</button></div><button class="workspace-finish" onClick={() => { exitDialog.close(); props.onFinish(); }}>結束探索，查看足跡 →</button></div></dialog>
  </section>;
}
