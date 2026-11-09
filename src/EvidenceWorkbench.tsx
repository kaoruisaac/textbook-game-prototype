import { createMemo, createSignal, For, Show } from "solid-js";
import { Button, Check, Chip, CircleCheckBig, Crosshair, Gem, LayoutGrid, MapPin, MessageSquare, Pencil, SectionHeading, Shovel, Sparkles, TextField } from "./design-system";
import { TeacherWorkbench } from "./TeacherWorkbench";
import {
  analyzeTrip, classRecords, evidenceGoals, fmt, levels, misconceptionLabels, same, summarize, terrainName,
  type Level, type StudentRecord, type SubjectKey, type Trip,
} from "./evidence-data";
import "./evidence-workbench.css";

const plannerSteps = ["教材與課綱", "目標與迷思", "設計挑戰", "試玩與調校", "發布", "學習證據"].map(title => ({ title }));
const EVIDENCE_STEP = 5;

/* 老師的選擇放在模組層，切換頁面再回來不會遺失 */
const [view, setView] = createSignal<string>("class");
const [openMc, setOpenMc] = createSignal<string | null>(null);
const [overrides, setOverrides] = createSignal<Record<string, Level>>({});
const [naming, setNaming] = createSignal<string | null>(null);
const [nameDraft, setNameDraft] = createSignal("");
const [named, setNamed] = createSignal<Record<string, string>>({});

export function EvidenceWorkbench(props: { live: StudentRecord | null; onHome: () => void }) {
  const records = createMemo(() => props.live ? [props.live, ...classRecords] : classRecords);
  const summaries = createMemo(() => new Map(records().map(r => [r.id, summarize(r)])));
  const sum = (id: string) => summaries().get(id)!;
  const current = () => records().find(r => r.id === view());
  const levelOf = (id: string, subject: SubjectKey) => overrides()[id + ":" + subject] ?? sum(id).levels[subject];

  /** 每個迷思：出現的學生、其中自己修正的人數 */
  const mcMap = createMemo(() => Object.keys(misconceptionLabels).map(id => {
    const students = records().filter(r => sum(r.id).mcs[id]);
    const fixed = students.filter(r => sum(r.id).mcs[id].fixed >= sum(r.id).mcs[id].count).length;
    return { id, students, fixed };
  }));
  const unclassified = createMemo(() => records().flatMap(r => sum(r.id).other.map(o => ({ ...o, record: r, key: r.id + ":" + o.trip }))));

  const rail = <nav class="ev-rail">
    <button type="button" class={"ev-nav" + (view() === "class" ? " is-current" : "")} aria-current={view() === "class" ? "page" : undefined} onClick={() => setView("class")}>
      <LayoutGrid aria-hidden="true" />班級總覽
    </button>
    <span class="ev-rail__label">學生<span>{records().length}</span></span>
    <ul class="ev-students">
      <For each={records()}>{r => <li>
        <button type="button" class={"ev-nav ev-nav--student" + (view() === r.id ? " is-current" : "")} aria-current={view() === r.id ? "page" : undefined} onClick={() => setView(r.id)}>
          <span class={"wb-avatar" + (r.live ? " is-live" : "")}>{r.name.slice(0, 1)}</span>
          <span class="ev-nav__name">{r.name}</span>
          <Show when={sum(r.id).unresolved > 0}><span class="ev-dot" aria-label={sum(r.id).unresolved + " 個未修正的迷思"} /></Show>
        </button>
      </li>}</For>
    </ul>
  </nav>;

  return (
    <TeacherWorkbench steps={plannerSteps} step={EVIDENCE_STEP} onStep={() => {}} canSelect={() => false} onHome={props.onHome}
      meta="五年 3 班 · 學習證據 · 11 月 13 日" rail={rail} railLabel="學習證據">
      <Show when={current()} fallback={<ClassOverview />}>{r => <StudentView record={r()} />}</Show>
    </TeacherWorkbench>
  );

  function ClassOverview() {
    const total = () => records().length;
    const count = (subject: SubjectKey, level: Level) => records().filter(r => levelOf(r.id, subject) === level).length;
    return <>
      <SectionHeading title="班級總覽" aside={<span class="wb-muted">{total()} 人</span>} />
      <div class="ev-goals">
        <For each={evidenceGoals}>{g => <section class="ev-goal">
          <header><strong>{g.name}</strong><span>{g.goal}</span></header>
          <div class="ev-levels">
            <For each={levels}>{level => <div class={"ev-level ev-level--" + levels.indexOf(level)}><b>{count(g.id, level)}</b><span>{level}</span></div>}</For>
          </div>
        </section>}</For>
      </div>

      <SectionHeading size="panel" title="迷思地圖" />
      <For each={evidenceGoals}>{g => <section class="ev-map" aria-label={g.name + "迷思"}>
        <span class="ev-map__subject">{g.name}</span>
        <For each={mcMap().filter(m => misconceptionLabels[m.id].subject === g.id).sort((a, b) => b.students.length - a.students.length)}>{m => {
          const open = () => openMc() === m.id;
          return <div class={"ev-mc" + (open() ? " is-open" : "")}>
            <button type="button" class="ev-mc__row" aria-expanded={open()} disabled={!m.students.length} onClick={() => setOpenMc(open() ? null : m.id)}>
              <span class="ev-mc__text">{misconceptionLabels[m.id].text}</span>
              <span class="ev-bar" aria-hidden="true"><span style={{ width: (m.students.length / total() * 100) + "%" }} /></span>
              <span class="ev-mc__count">{m.students.length} 人</span>
              <span class="ev-mc__fixed">{g.id === "math" && m.id !== "mc-m4" && m.students.length ? "修正 " + m.fixed : ""}</span>
            </button>
            <Show when={open()}>
              <div class="ev-mc__students">
                <For each={m.students}>{r => <button type="button" class="ev-person" onClick={() => setView(r.id)}>
                  <span class="wb-avatar">{r.name.slice(0, 1)}</span>{r.name}
                  <Show when={sum(r.id).mcs[m.id].fixed >= sum(r.id).mcs[m.id].count && g.id === "math" && m.id !== "mc-m4"}><Check aria-label="已自行修正" /></Show>
                </button>}</For>
              </div>
            </Show>
          </div>;
        }}</For>
      </section>}</For>

      <Show when={unclassified().length}>
        <SectionHeading size="panel" title="未歸類的表現" />
        <div class="ev-map">
          <For each={unclassified()}>{u => <div class="ev-other">
            <button type="button" class="ev-person" onClick={() => setView(u.record.id)}><span class="wb-avatar">{u.record.name.slice(0, 1)}</span>{u.record.name}</button>
            <span class="ev-other__text">想去 {fmt(u.intent)}，輸入 {fmt(u.typed)}</span>
            <Show when={named()[u.key]} fallback={
              <Show when={naming() === u.key} fallback={<Button variant="secondary" size="sm" onClick={() => { setNaming(u.key); setNameDraft(""); }}>命名為迷思</Button>}>
                <form class="wb-add ev-other__form" onSubmit={e => { e.preventDefault(); if (!nameDraft().trim()) return; setNamed(prev => ({ ...prev, [u.key]: nameDraft().trim() })); setNaming(null); }}>
                  <TextField id={"name-" + u.key} label="迷思名稱" placeholder="學生可能怎麼想錯？" value={nameDraft()} onInput={e => setNameDraft(e.currentTarget.value)} />
                  <Button type="submit" variant="secondary" disabled={!nameDraft().trim()}>加入</Button>
                  <Button variant="quiet" onClick={() => setNaming(null)}>取消</Button>
                </form>
              </Show>}>
              <Chip tone="leaf"><Check aria-hidden="true" />{named()[u.key]}</Chip>
            </Show>
          </div>}</For>
        </div>
      </Show>
    </>;
  }

  function StudentView(p: { record: StudentRecord }) {
    const s = () => sum(p.record.id);
    return <>
      <header class="ev-student-head">
        <span class={"wb-avatar ev-avatar-lg" + (p.record.live ? " is-live" : "")}>{p.record.name.slice(0, 1)}</span>
        <div><h2>{p.record.name}</h2><span class="wb-muted">{p.record.trips.length} 個地點{p.record.live ? " · 本次操作" : ""}</span></div>
      </header>
      <div class="ev-goals">
        <For each={evidenceGoals}>{g => {
          const suggested = () => s().levels[g.id];
          const value = () => levelOf(p.record.id, g.id);
          return <section class="ev-goal">
            <header><strong>{g.name}</strong><span>{g.goal}</span></header>
            <div class="ev-pick" role="radiogroup" aria-label={g.name + "程度"}>
              <For each={levels}>{level => <button type="button" role="radio" aria-checked={value() === level} class="ev-pick__item"
                onClick={() => setOverrides(prev => ({ ...prev, [p.record.id + ":" + g.id]: level }))}>
                <Show when={suggested() === level}><Sparkles aria-label="Qrio 建議" /></Show>{level}
              </button>}</For>
            </div>
          </section>;
        }}</For>
      </div>

      <SectionHeading size="panel" title="探索步驟" />
      <Show when={p.record.trips.length} fallback={<p class="wb-muted">還沒有探索紀錄</p>}>
        <For each={p.record.trips}>{(trip, i) => <TripCard trip={trip} index={i()} />}</For>
      </Show>
    </>;
  }
}

function TripCard(props: { trip: Trip; index: number }) {
  const signals = () => analyzeTrip(props.trip);
  const drafts = () => props.trip.coords;
  return <article class="ev-trip">
    <header class="ev-trip__head">
      <strong>地點 {props.index + 1}</strong>
      <div class="ev-trip__tags">
        <For each={signals().mcs}>{id => <Chip tone="amber">{misconceptionLabels[id].short}</Chip>}</For>
        <Show when={signals().other}><Chip>未歸類</Chip></Show>
        <Show when={signals().fixed}><Chip tone="leaf"><CircleCheckBig aria-hidden="true" />自行修正</Chip></Show>
      </div>
    </header>
    <ol class="ev-steps">
      <li><MapPin aria-hidden="true" /><span>想去 <b>{fmt(props.trip.intent)}</b> {terrainName(props.trip.intent)}</span></li>
      <For each={drafts()}>{(c, i) => {
        const hit = () => same(c, props.trip.intent);
        const firstOfRun = () => i() === 0 || drafts()[i() - 1].kind === "confirm";
        return <li class={hit() ? "" : "is-off"}>
          <Show when={c.kind === "confirm"} fallback={<Pencil aria-hidden="true" />}><Crosshair aria-hidden="true" /></Show>
          <span>
            {c.kind === "confirm" ? "確認 " : firstOfRun() ? "輸入 " : "改成 "}<b>{fmt(c)}</b> {terrainName(c)}
            <Show when={c.answer}><span class="ev-steps__answer">{c.answer === "same" ? "說是這裡" : "說要修改"}</span></Show>
          </span>
        </li>;
      }}</For>
      <Show when={props.trip.reason}><li><MessageSquare aria-hidden="true" /><span>「{props.trip.reason}」</span></li></Show>
      <Show when={props.trip.dig !== undefined}><li><Shovel aria-hidden="true" /><span>{props.trip.dig ? "挖掘" : "沒有挖掘"}</span></li></Show>
      <Show when={props.trip.artefact}>{a => <li class={props.trip.collect === undefined || props.trip.collect === a().target ? "" : "is-off"}>
        <Gem aria-hidden="true" />
        <span>{a().name}<span class="ev-steps__era">{a().era}</span> → <b>{props.trip.collect === undefined ? "還沒決定" : props.trip.collect ? "採集" : "留下"}</b>
          <Show when={props.trip.collectReason}>「{props.trip.collectReason}」</Show></span>
      </li>}</Show>
    </ol>
  </article>;
}
