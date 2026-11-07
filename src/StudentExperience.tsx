import { createEffect, createMemo, createSignal, For, Show, onMount, onCleanup } from "solid-js";
import type { JSX } from "solid-js";
import type { GameEvent } from "./demo-data";
import "./student-experience.css";

export type StudentIdentity = { name: string; classroom: string };
type MissionPath = { id: string; name: string; tagline: string; icon: string };

export function StudentPanelPager(props: { children: JSX.Element; resetKey: string }) {
  let viewport!: HTMLDivElement;
  let content!: HTMLDivElement;
  const [page, setPage] = createSignal(0);
  const [pages, setPages] = createSignal(1);
  const measure = () => { if (viewport) setPages(Math.max(1, Math.ceil((viewport.scrollHeight - 1) / Math.max(1, viewport.clientHeight)))); };
  createEffect(() => { props.resetKey; setPage(0); if (viewport) viewport.scrollTop = 0; });
  onMount(() => {
    const observer = new ResizeObserver(measure);
    observer.observe(viewport); observer.observe(content);
    measure(); onCleanup(() => observer.disconnect());
  });
  function turn(next: number) { setPage(next); viewport.scrollTop = Math.min(next * viewport.clientHeight, viewport.scrollHeight - viewport.clientHeight); }
  return <div class="student-assistant-content"><div class="assistant-body" ref={viewport}><div ref={content}>{props.children}</div></div><Show when={pages() > 1}><nav class="assistant-pagination" aria-label="探險助手內容分頁"><button disabled={page() === 0} onClick={() => turn(page()-1)}>← 上一段</button><span>{page()+1} / {pages()}</span><button disabled={page()+1 >= pages()} onClick={() => turn(page()+1)}>繼續閱讀 →</button></nav></Show></div>;
}

export function StudentHeader(props: { identity: StudentIdentity | null; stage: number }) {
  return <header class="student-header">
    <div class="student-wordmark"><span>Q<span>✦</span></span><strong>qrio</strong></div>
    <ol class="student-progress" aria-label="探索進度"><For each={["探險報到", "任務封面", "開始探索", "探索足跡"]}>{(label, i) => <li class={props.stage === i() ? "current" : props.stage > i() ? "complete" : ""} aria-current={props.stage === i() ? "step" : undefined}><span>{props.stage > i() ? "✓" : `0${i()+1}`}</span><b>{label}</b></li>}</For></ol>
    <Show when={props.identity}><span class="student-identity">{props.identity!.classroom} · {props.identity!.name}</span></Show>
  </header>;
}

export function ViewSwitcher(props: { student: boolean; onStudent: () => void; onTeacher: () => void }) {
  const [open, setOpen] = createSignal(false);
  return <div class="view-switcher" onKeyDown={e => { if (e.key === "Escape") setOpen(false); }}>
    <button class="view-fab" aria-label="切換學生或老師視角" aria-expanded={open()} aria-controls="view-options" onClick={() => setOpen(!open())}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M8 21h8m-4-4v4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg><span>{props.student ? "學生視角" : "老師視角"}</span><span aria-hidden="true">⌄</span></button>
    <Show when={open()}><div class="view-options" id="view-options"><small>預覽視角</small><button onClick={() => { props.onStudent(); setOpen(false); }}>學生體驗 <span>{props.student ? "✓" : "↗"}</span></button><button onClick={() => { props.onTeacher(); setOpen(false); }}>老師工作台 <span>{!props.student ? "✓" : "↗"}</span></button></div></Show>
  </div>;
}

export function StudentEntry(props: { onJoin: (identity: StudentIdentity) => void }) {
  const [name, setName] = createSignal("");
  const [classroom, setClassroom] = createSignal("");
  return <section class="student-entry-screen">
    <div class="entry-landscape" aria-hidden="true"><div class="entry-orbit"/><span class="entry-sun">✳</span><div class="entry-hill back"/><div class="entry-hill front"/><div class="entry-river"/><div class="entry-map-lines"/><span class="entry-pin">⌖</span><span class="entry-caption">A LITTLE CURIOSITY.<br/>A WORLD TO DISCOVER.</span></div>
    <form class="student-entry-form" onSubmit={e => { e.preventDefault(); if (name().trim() && classroom().trim()) props.onJoin({ name: name().trim(), classroom: classroom().trim() }); }}>
      <div class="overline">YOUR NEXT ADVENTURE</div><h1>你好，<br/><em>小小探險家。</em></h1><p>留下你的名字，<br/>準備展開今天的發現之旅。</p>
      <label for="student-name">你的姓名<input id="student-name" class="field" autocomplete="off" required maxLength={30} value={name()} onInput={e => setName(e.currentTarget.value)} placeholder="請輸入姓名"/></label>
      <label for="student-class">你的班級<input id="student-class" class="field" autocomplete="off" required maxLength={30} value={classroom()} onInput={e => setClassroom(e.currentTarget.value)} placeholder="例如：五年三班"/></label>
      <button class="btn primary large" type="submit">查看今天的任務 <span>→</span></button><small>姓名與班級僅用於本次體驗，不會上傳。</small>
    </form>
  </section>;
}

export function StudentCover(props: { identity: StudentIdentity; goal: string; paths: MissionPath[]; selectedPath: string; onPath: (id: string) => void; onStart: () => void }) {
  return <section class="student-cover">
    <div class="cover-art" aria-hidden="true"><div class="entry-map-lines"/><span class="cover-art-label">FIELD EXPEDITION<br/><b>№ 001</b></span><div class="entry-hill back"/><div class="entry-hill front"/><div class="entry-river"/><span class="entry-sun">✳</span><span class="entry-pin">⌖</span><span class="entry-caption">STONE AGE<br/>EXPLORER</span></div>
    <div class="cover-content"><div class="overline">TODAY’S MISSION · 今日任務</div><p class="cover-greeting">{props.identity.name}，你的探索任務已準備好。</p><h1>石器時代，<br/><em>等待你的發現。</em></h1><p class="cover-goal">{props.goal}</p>
      <div class="cover-facts"><span><b>02:00</b>探索時間</span><span><b>5 × 5</b>座標地圖</span><span><b>數學 × 社會</b>跨科挑戰</span></div>
      <fieldset class="cover-paths"><legend>選擇你的探索路徑</legend><div><For each={props.paths}>{p => <button type="button" class={props.selectedPath === p.id ? "chosen" : ""} aria-pressed={props.selectedPath === p.id} onClick={() => props.onPath(p.id)}><span>{p.icon}</span><strong>{p.name}</strong><small>{p.tagline}</small></button>}</For></div></fieldset>
      <div class="cover-start"><button class="btn primary large" onClick={props.onStart}>開始探索 <span>↗</span></button><span>準備好再出發，點擊後開始倒數。</span></div>
    </div>
  </section>;
}

export function StudentTrail(props: { identity: StudentIdentity; score: number; visited: number; events: GameEvent[]; onReplay: () => void; onChangeStudent: () => void }) {
  const [page, setPage] = createSignal(0);
  const trail = createMemo(() => props.events.filter(e => e.type !== "score_updated" && e.type !== "game_finished"));
  const pages = createMemo(() => Math.max(1, Math.ceil(trail().length / 2)));
  return <section class="student-trail">
    <div class="trail-summary"><div class="trail-spark" aria-hidden="true">✦</div><div class="overline">YOUR EXPLORATION JOURNAL</div><h1>{props.identity.name}，<br/>這是你的<br/><em>探索足跡。</em></h1><p>你去過的地方、提出的想法，<br/>都讓這趟旅程有了自己的模樣。</p><div class="trail-stats"><span><b>{props.visited}</b>探索地點</span><span><b>{props.events.filter(e => e.type === "reasoning_submitted").length}</b>留下的想法</span><span><b>{props.score}</b>本次分數</span></div><div class="trail-actions"><button class="btn primary" onClick={props.onReplay}>再探索一次 ↗</button><button class="btn ghost" onClick={props.onChangeStudent}>換一位探險家</button></div></div>
    <div class="trail-journal"><div class="trail-journal-title"><span>FIELD NOTES / 01</span><h2>每一個選擇，都值得記下。</h2></div><div class="trail-pages" aria-live="polite"><Show when={trail().length} fallback={<div class="trail-empty"><span>⌖</span><h3>這次還沒有留下探索紀錄</h3><p>下次試著選一個地點，說說你的想法。</p></div>}><For each={trail().slice(page()*2,page()*2+2)}>{(event,i) => <article class="trail-note"><span class="trail-note-number">{String(page()*2+i()+1).padStart(2,"0")}</span><div><span class="trail-note-time">{event.time}{event.coordinate ? ` · ${event.coordinate}` : ""}</span><h3>{event.label}</h3><p>{event.details}</p></div></article>}</For></Show></div><nav class="trail-pagination" aria-label="探索足跡分頁"><button aria-label="上一頁足跡" disabled={page() === 0} onClick={() => setPage(page()-1)}>←</button><span>{page()+1} / {pages()}</span><button aria-label="下一頁足跡" disabled={page()+1 >= pages()} onClick={() => setPage(page()+1)}>→</button></nav></div>
  </section>;
}
