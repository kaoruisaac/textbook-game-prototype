import { createMemo, createSignal, For, onCleanup, onMount, Show } from "solid-js";
import {
  Button, Card, CardHeader, Check, Chip, CircleHelp, FilePlus, FileChip, Heart, Lightbulb, ListChecks, LoaderCircle, Maximize2, MessagesSquare, Minimize2,
  Notice, Play, Plus, RotateCcw, SectionHeading, SegmentedControl, Sparkles, TextArea, TextField, UserPlus, type ChipTone,
} from "./design-system";
import type { JSX } from "solid-js";
import { TeacherWorkbench } from "./TeacherWorkbench";
import { Typewriter } from "./Typewriter";
import { startGuide } from "./teacher-guide";
import {
  bloomLevels, bloomOf, curriculum, curriculumCatalog, defaultFeedback, defaultReviewers, defaultSelected, detectVague, detectVerb, goalReady,
  knowledgePoints, materials, proposeChallenges, recommendedVerbs, selfChecks, subjects, suggestGoal,
  type CurriculumEntry, type Feedback, type FeedbackKind, type KnowledgePoint, type Misconception, type Source, type Subject, type SubjectId,
} from "./lesson-plan-data";

export interface LessonPlannerProps {
  published: boolean;
  onPublish: () => void;
  onStudent: () => void;
  onHome: () => void;
  shareUrl: string;
}

const stepTitles = ["教材與課綱", "目標與迷思", "設計挑戰", "試玩與調校", "發布"];
const sourceTone: Record<Source, ChipTone> = { "教材": "blue", "Qrio 推論": "amber", "上週班級": "leaf" };
const kindTone: Record<FeedbackKind, ChipTone> = { "我喜歡": "leaf", "我好奇": "blue", "建議": "amber" };
const kindIcon: Record<FeedbackKind, () => JSX.Element> = { "我喜歡": () => <Heart size={14} aria-hidden="true" />, "我好奇": () => <CircleHelp size={14} aria-hidden="true" />, "建議": () => <Lightbulb size={14} aria-hidden="true" /> };
/* 試玩時學生端放在 iframe 裡，帶 preview=teacher 會略過學生登入、不顯示切換視角的按鈕 */
const PREVIEW_URL = "/mission/demo?preview=teacher";
const GOAL_MAX = 120;

/* 課前規劃的狀態放在模組層，切到學生端試玩再回來時不會遺失 */
const [step, setStep] = createSignal(0);
const [maxStep, setMaxStep] = createSignal(0);
const [extraFiles, setExtraFiles] = createSignal<Record<SubjectId, string[]>>({ math: [], social: [] });
const [reading, setReading] = createSignal<SubjectId[]>([]);
const [read, setRead] = createSignal<SubjectId[]>([]);
const [entries, setEntries] = createSignal<CurriculumEntry[]>([...curriculum]);
const [checkedEntries, setCheckedEntries] = createSignal<string[]>(curriculum.filter(c => c.core).map(c => c.id));
const [searching, setSearching] = createSignal<SubjectId | null>(null);
const [query, setQuery] = createSignal("");
const [goalTab, setGoalTab] = createSignal<SubjectId>("math");
const [goals, setGoals] = createSignal<Record<SubjectId, string>>({ math: "", social: "" });
const [suggestion, setSuggestion] = createSignal<{ subject: SubjectId; verb: string; variant: number; text: string; reason: string } | null>(null);
const [moreVerbs, setMoreVerbs] = createSignal(false);
const [selected, setSelected] = createSignal<string[]>([...defaultSelected]);
const [custom, setCustom] = createSignal<(Misconception & { subject: SubjectId; kp: string })[]>([]);
const [customKps, setCustomKps] = createSignal<KnowledgePoint[]>([]);
const [adding, setAdding] = createSignal<string | null>(null);
const [customDraft, setCustomDraft] = createSignal("");
const [theme, setTheme] = createSignal("");
const [editingTheme, setEditingTheme] = createSignal(false);
const [themeDraft, setThemeDraft] = createSignal("");
const [challenge, setChallenge] = createSignal("c-1");
const [behaviors, setBehaviors] = createSignal<Record<string, string>>({});
const [checks, setChecks] = createSignal<boolean[]>(selfChecks.map(() => false));
const [feedback, setFeedback] = createSignal<Feedback[]>(defaultFeedback.map(f => ({ ...f })));
const [reviewers, setReviewers] = createSignal(defaultReviewers.map(r => ({ ...r })));
const [inviteDraft, setInviteDraft] = createSignal("");
const [inviting, setInviting] = createSignal(false);
const [testTab, setTestTab] = createSignal<"play" | "feedback">("play");
const [playExpanded, setPlayExpanded] = createSignal(false);
const [checklistOpen, setChecklistOpen] = createSignal(false);
const [schedule, setSchedule] = createSignal("11 月 13 日（五）13:30–14:50");
const [joinMode, setJoinMode] = createSignal<"link" | "code">("link");
const [liveView, setLiveView] = createSignal(true);

const allMisconceptions = createMemo(() => [...knowledgePoints.flatMap(kp => kp.misconceptions), ...custom()]);
const findMisconception = (id: string) => allMisconceptions().find(m => m.id === id);
const subjectOfMisconception = (id: string) => custom().find(c => c.id === id)?.subject ?? knowledgePoints.find(kp => kp.misconceptions.some(m => m.id === id))?.subject;
const selectedFor = (subject: SubjectId) => selected().filter(id => subjectOfMisconception(id) === subject);
const subjectDone = (subject: SubjectId) => goalReady(goals()[subject]) && selectedFor(subject).length > 0;
const entriesFor = (subject: SubjectId) => entries().filter(e => e.subject === subject);
const kpsFor = (subject: SubjectId) => [...knowledgePoints, ...customKps()].filter(kp => kp.subject === subject);
const misconceptionsOf = (kp: KnowledgePoint) => [...kp.misconceptions, ...custom().filter(c => c.kp === kp.id)];
const toggleIn = (set: (fn: (prev: string[]) => string[]) => void, id: string, on: boolean) => set(prev => on ? [...prev, id] : prev.filter(x => x !== id));

function readMaterials(subject: SubjectId) {
  setReading(prev => [...prev, subject]);
  window.setTimeout(() => {
    setReading(prev => prev.filter(s => s !== subject));
    setRead(prev => prev.includes(subject) ? prev : [...prev, subject]);
  }, 900);
}

export function LessonPlanner(props: LessonPlannerProps) {
  onMount(() => subjects.forEach(s => { if (!read().includes(s.id) && !reading().includes(s.id)) readMaterials(s.id); }));

  const go = (index: number) => { setStep(index); setMaxStep(m => Math.max(m, index)); };
  const currentSubject = () => subjects.find(s => s.id === goalTab())!;
  const nextSubject = () => subjects[subjects.findIndex(s => s.id === goalTab()) + 1];
  const pending = () => feedback().filter(f => f.kind !== "我喜歡" && f.status === "open").length;
  /* 步驟列在「試玩與調校」旁顯示回饋則數，還有待處理的就用醒目色 */
  const steps = () => stepTitles.map((title, i) => i === 3 && maxStep() >= 3 ? { title, badge: feedback().length, badgeAlert: pending() > 0 } : { title });
  let frame: HTMLIFrameElement | undefined;
  const restartPlay = () => frame?.contentWindow?.location.replace(PREVIEW_URL);
  /* 放大：試玩畫面蓋滿整個螢幕，瀏覽器允許的話也進入全螢幕；按 Esc 離開全螢幕就縮回來 */
  let playSection: HTMLElement | undefined;
  function togglePlayFull() {
    const next = !playExpanded();
    setPlayExpanded(next);
    setChecklistOpen(false);
    if (next) playSection?.requestFullscreen?.().catch(() => {});
    else if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }
  const onFullscreen = () => { if (!document.fullscreenElement && playExpanded()) setPlayExpanded(false); };
  document.addEventListener("fullscreenchange", onFullscreen);
  onCleanup(() => document.removeEventListener("fullscreenchange", onFullscreen));
  const meta = () => "五年 3 班 · 數學 × 社會 · 週五 13:30" + (theme().trim() ? " · 專題：" + theme().trim() : "");

  const setGoal = (subject: SubjectId, text: string) => setGoals(prev => ({ ...prev, [subject]: text.slice(0, GOAL_MAX) }));
  function pickVerb(subject: SubjectId, verb: string) {
    const prev = suggestion();
    const variant = prev && prev.subject === subject && prev.verb === verb ? prev.variant + 1 : 0;
    setSuggestion({ subject, verb, variant, ...suggestGoal(subject, verb, goals()[subject], variant) });
  }
  function addMisconception(kp: KnowledgePoint) {
    const text = customDraft().trim();
    if (!text) return;
    const id = "mc-custom-" + (custom().length + 1);
    setCustom(prev => [...prev, { id, subject: kp.subject, kp: kp.id, text, source: "教材", behavior: "", response: "" }]);
    setSelected(prev => [...prev, id]);
    setCustomDraft("");
    setAdding(null);
  }
  function addKnowledgePoint(subject: SubjectId) {
    const text = customDraft().trim();
    if (!text) return;
    setCustomKps(prev => [...prev, { id: "kp-custom-" + (prev.length + 1), subject, text, misconceptions: [] }]);
    setCustomDraft("");
    setAdding(null);
  }
  const startAdding = (key: string) => { setAdding(key); setCustomDraft(""); };
  function addEntry(entry: CurriculumEntry) {
    if (!entries().some(e => e.id === entry.id)) setEntries(prev => [...prev, entry]);
    setCheckedEntries(prev => prev.includes(entry.id) ? prev : [...prev, entry.id]);
    setQuery("");
    setSearching(null);
  }
  function invite() {
    const name = inviteDraft().trim();
    if (!name) return;
    setReviewers(prev => [...prev, { name, note: "已邀請" }]);
    setInviteDraft("");
    setInviting(false);
  }

  const back = () => <Button variant="secondary" onClick={() => go(step() - 1)}>上一步</Button>;

  const footer = <>
    <Show when={step() === 0}>
      <div class="wb-footer__actions">
        <Button disabled={reading().length > 0 || !subjects.every(s => entriesFor(s.id).some(e => checkedEntries().includes(e.id)))} onClick={() => go(1)}>下一步：目標與迷思</Button>
      </div>
    </Show>
    <Show when={step() === 1}>
      {back()}
      <Show when={!subjectDone(goalTab())}><span class="wb-footer__caption">{goalReady(goals()[goalTab()]) ? "至少採用一項迷思" : "先寫好" + currentSubject().name + "的目標"}</span></Show>
      <div class="wb-footer__actions">
        <Show when={nextSubject() && !subjectDone(nextSubject()!.id)} fallback={
          <Button disabled={!subjects.every(s => subjectDone(s.id))} onClick={() => go(2)}>下一步：設計挑戰</Button>}>
          <Button disabled={!subjectDone(goalTab())} onClick={() => { setGoalTab(nextSubject()!.id); setSuggestion(null); setMoreVerbs(false); }}>下一科：{nextSubject()!.name}</Button>
        </Show>
      </div>
    </Show>
    <Show when={step() === 2}>
      {back()}
      <div class="wb-footer__actions"><Button onClick={() => go(3)}>下一步：試玩與調校</Button></div>
    </Show>
    <Show when={step() === 3}>
      {back()}
      <div class="wb-footer__actions"><Button onClick={() => go(4)}>下一步：發布</Button></div>
    </Show>
    <Show when={step() === 4}>
      {back()}
      <div class="wb-footer__actions">
        <Button variant="secondary" onClick={props.onStudent}>預覽學生端</Button>
        <Button onClick={() => props.published ? props.onStudent() : props.onPublish()}>{props.published ? "前往學生任務" : "發布到班級"}</Button>
      </div>
    </Show>
  </>;

  return (
    <TeacherWorkbench steps={steps()} step={step()} staged={step() === 3 && testTab() === "play" && playExpanded()} onStep={go} canSelect={i => i <= maxStep()} onHome={props.onHome} meta={meta()} footer={footer}>
      {/* 步驟 1：教材與課綱 */}
      <Show when={step() === 0}>
        <SectionHeading title="教材與課綱" description="各科放入這週的教材，Qrio 會找出對應的 108 課綱條目。" />
        <For each={subjects}>{subject => <Card density="teacher">
          <CardHeader aside={subject.teacher}><strong>{subject.name} · {subject.unit}</strong></CardHeader>
          <div class="wb-files">
            <For each={materials.filter(m => m.subject === subject.id)}>{m => <FileChip name={m.name} />}</For>
            <For each={extraFiles()[subject.id]}>{(f, i) => <FileChip name={f} onRemove={() => setExtraFiles(prev => ({ ...prev, [subject.id]: prev[subject.id].filter((_, idx) => idx !== i()) }))} />}</For>
            <label class="wb-attach"><FilePlus aria-hidden="true" />加入教材<input class="pc-visually-hidden" type="file" multiple accept=".pdf,.doc,.docx,.txt"
              onChange={e => { const list = Array.from(e.currentTarget.files ?? []).map(f => f.name); if (!list.length) return; setExtraFiles(prev => ({ ...prev, [subject.id]: [...prev[subject.id], ...list] })); readMaterials(subject.id); }} /></label>
          </div>
          <Show when={!reading().includes(subject.id) && read().includes(subject.id)} fallback={<p class="wb-muted wb-reading" role="status"><LoaderCircle class="wb-spin" aria-hidden="true" />Qrio 正在讀{subject.name}教材…</p>}>
            <div class="wb-entries">
              <For each={entriesFor(subject.id)}>{entry => <label class="wb-mc">
                <input type="checkbox" checked={checkedEntries().includes(entry.id)} onChange={e => toggleIn(setCheckedEntries, entry.id, e.currentTarget.checked)} />
                <span class="wb-entry"><span><Typewriter id={"entry-" + entry.id} text={entry.text} /></span><small>{entry.kind}{entry.source ? " · " + entry.source : " · 老師加入"}</small></span>
              </label>}</For>
            </div>
            <Show when={searching() === subject.id} fallback={<Button variant="quiet" size="sm" class="wb-start" onClick={() => { setSearching(subject.id); setQuery(""); }}><Plus aria-hidden="true" />加入課綱</Button>}>
              <div class="wb-search">
                <TextField id={"search-" + subject.id} label={"搜尋" + subject.name + "課綱"} placeholder="輸入關鍵字" value={query()} onInput={e => setQuery(e.currentTarget.value)} />
                <div class="wb-search__results">
                  <For each={curriculumCatalog.filter(c => c.subject === subject.id && !entries().some(e => e.id === c.id) && (!query().trim() || c.text.includes(query().trim())))}
                    fallback={<p class="wb-muted">找不到符合的條目</p>}>{c =>
                    <button type="button" class="wb-result" onClick={() => addEntry(c)}><span>{c.text}</span><small>{c.kind}</small></button>}</For>
                </div>
                <Button variant="quiet" size="sm" class="wb-start" onClick={() => setSearching(null)}>取消</Button>
              </div>
            </Show>
          </Show>
        </Card>}</For>
      </Show>

      {/* 步驟 2：目標與迷思 */}
      <Show when={step() === 1}>
        <SectionHeading title="目標與迷思" description="每科寫一個學習目標，再決定要讓學生面對哪些迷思。" />
        <SegmentedControl label="科目" size="sm" value={goalTab()} onChange={v => { setGoalTab(v); setSuggestion(null); setMoreVerbs(false); }}
          options={subjects.map(s => ({ value: s.id, label: <>{subjectDone(s.id) && <Check aria-label="已完成" />}{s.name}</> }))} />
        <GoalField subject={currentSubject()} value={goals()[goalTab()]} onInput={text => setGoal(goalTab(), text)} onVerb={verb => pickVerb(goalTab(), verb)}
          more={moreVerbs()} onMore={() => setMoreVerbs(!moreVerbs())}
          suggestion={suggestion()?.subject === goalTab() ? suggestion() : null}
          onAccept={() => { setGoal(goalTab(), suggestion()!.text); setSuggestion(null); }}
          onSkip={() => setSuggestion(null)}
          onCheck={() => { const subject = currentSubject(); startGuide({ subject, text: goals()[subject.id], apply: text => setGoal(subject.id, text) }); }} />
        <Show when={goalReady(goals()[goalTab()])} fallback={<p class="wb-muted">寫好目標後，Qrio 會找出需要的知識點與可能的迷思。</p>}>
          <SectionHeading size="panel" title="知識點與迷思" description="Qrio 依目標找出需要的知識點。每個知識點下方是學生可能的迷思，採用的迷思會放進遊戲。" />
          <For each={kpsFor(goalTab())}>{(kp, i) => <article class="wb-kp-card">
            <header class="wb-kp-card__head">
              <span class="wb-kp-card__index">知識點 {i() + 1}</span>
              <p>{kp.id.startsWith("kp-custom") ? kp.text : <Typewriter id={"kp-" + kp.id} text={kp.text} />}</p>
            </header>
            <div class="wb-kp-card__body">
              <span class="wb-kp-card__label">可能的迷思</span>
              <For each={misconceptionsOf(kp)} fallback={<p class="wb-muted">還沒有迷思</p>}>{mc => {
                const on = () => selected().includes(mc.id);
                return <div class={"wb-mc-row" + (on() ? " is-on" : "")}>
                  <span class="wb-mc-row__text">{mc.id.startsWith("mc-custom") ? mc.text : <Typewriter id={"mc-" + mc.id} text={mc.text} />}</span>
                  <Chip tone={custom().some(c => c.id === mc.id) ? "neutral" : sourceTone[mc.source]}>{custom().some(c => c.id === mc.id) ? "老師新增" : mc.source}</Chip>
                  <button type="button" class="wb-adopt" aria-pressed={on()} onClick={() => toggleIn(setSelected, mc.id, !on())}><Show when={on()} fallback="採用"><Check aria-hidden="true" />已採用</Show></button>
                </div>;
              }}</For>
              <Show when={adding() === kp.id} fallback={<button type="button" class="wb-add-link" onClick={() => startAdding(kp.id)}><Plus aria-hidden="true" />新增迷思</button>}>
                <form class="wb-add" onSubmit={e => { e.preventDefault(); addMisconception(kp); }}>
                  <TextField id={"new-mc-" + kp.id} label="新增迷思" placeholder="學生可能怎麼想錯？" value={customDraft()} onInput={e => setCustomDraft(e.currentTarget.value)} />
                  <Button type="submit" variant="secondary" disabled={!customDraft().trim()}>新增</Button>
                  <Button variant="quiet" onClick={() => setAdding(null)}>取消</Button>
                </form>
              </Show>
            </div>
          </article>}</For>
          <Show when={adding() === "kp-" + goalTab()} fallback={<Button variant="secondary" size="sm" class="wb-start" onClick={() => startAdding("kp-" + goalTab())}><Plus aria-hidden="true" />新增知識點</Button>}>
            <form class="wb-add" onSubmit={e => { e.preventDefault(); addKnowledgePoint(goalTab()); }}>
              <TextField id="new-kp" label="新增知識點" placeholder="學生需要知道什麼？" value={customDraft()} onInput={e => setCustomDraft(e.currentTarget.value)} />
              <Button type="submit" variant="secondary" disabled={!customDraft().trim()}>新增</Button>
              <Button variant="quiet" onClick={() => setAdding(null)}>取消</Button>
            </form>
          </Show>
        </Show>
      </Show>

      {/* 步驟 3：設計挑戰 */}
      <Show when={step() === 2}>
        <SectionHeading title="設計挑戰" description="Qrio 依兩科的目標提出挑戰情境。選一個，再確認學生會出現的表現。" />
        <div class="wb-theme">
          <span class="wb-row__label">專題主題</span>
          <Show when={editingTheme()} fallback={<>
            <span class={theme().trim() ? "" : "wb-muted"}>{theme().trim() || "未設定，Qrio 會自由提案"}</span>
            <Button variant="quiet" size="sm" onClick={() => { setThemeDraft(theme()); setEditingTheme(true); }}>{theme().trim() ? "修改" : "設定"}</Button>
          </>}>
            <form class="wb-add" onSubmit={e => { e.preventDefault(); setTheme(themeDraft().trim()); setChallenge("c-1"); setEditingTheme(false); }}>
              <TextField id="theme" label="專題主題" placeholder="例如：野外求生" value={themeDraft()} onInput={e => setThemeDraft(e.currentTarget.value)} />
              <Button type="submit" variant="secondary">套用</Button>
            </form>
          </Show>
        </div>
        <div class="wb-options" role="radiogroup" aria-label="挑戰提案">
          <For each={proposeChallenges(theme())}>{option => <button type="button" role="radio" class="wb-option" aria-checked={challenge() === option.id} onClick={() => setChallenge(option.id)}>
            <span class="wb-option__top"><strong>{option.name}</strong><Show when={option.id === "c-1"}><Chip tone="blue">推薦</Chip></Show></span>
            <span><Typewriter id={"challenge-" + option.id} text={option.desc} /></span>
          </button>}</For>
        </div>
        <Show when={!proposeChallenges(theme()).find(c => c.id === challenge())?.playable}>
          <Notice tone="info">選定後 Qrio 會依這個情境生成遊戲，生成前的預覽仍是考古探險。</Notice>
        </Show>
        <SectionHeading size="panel" title="學生會出現的表現" description="學生帶著這些迷思，會在遊戲裡做出什麼？課後 Qrio 會依這些表現整理學習證據。" />
        <Card density="teacher">
          <For each={selected()}>{id => {
            const mc = () => findMisconception(id);
            return <Show when={mc()}>
              <TextArea id={"behavior-" + id} label={mc()!.text} rows={2} placeholder="例如：學生輸入了什麼、選了什麼、寫了什麼理由"
                value={behaviors()[id] ?? mc()!.behavior} onInput={e => setBehaviors(prev => ({ ...prev, [id]: e.currentTarget.value }))} />
            </Show>;
          }}</For>
        </Card>
        <details class="wb-details">
          <summary>遊戲怎麼回應這些表現</summary>
          <Card density="teacher">
            <For each={selected().map(findMisconception).filter((m): m is Misconception => !!m)}>{mc =>
              <div class="wb-align"><span class="wb-align__subject">{mc.text}</span><span>{mc.response || "Qrio 會依表現產生回應"}</span></div>}</For>
          </Card>
        </details>
      </Show>

      {/* 步驟 4：試玩與調校 */}
      <Show when={step() === 3}>
        <SectionHeading title="試玩與調校" description="直接在這裡當一次學生，再看同事留下的回饋。" />
        <SegmentedControl label="試玩與回饋" size="sm" value={testTab()} onChange={v => { setTestTab(v); setChecklistOpen(false); }}
          options={[
            { value: "play", label: <><Play aria-hidden="true" />自己試玩</> },
            { value: "feedback", label: <><MessagesSquare aria-hidden="true" />同事回饋<span class={"wb-count" + (pending() ? " is-alert" : "")} aria-label={feedback().length + " 則，" + pending() + " 則待處理"}>{feedback().length}</span></> },
          ]} />
        <section ref={playSection} class={"wb-play" + (playExpanded() ? " is-expanded" : "")} aria-label="學生端試玩" hidden={testTab() !== "play"}>
          <div class="wb-play__bar">
            <span class="wb-play__title">學生畫面<small>試玩紀錄不會計入班級</small></span>
            <div class="wb-pop">
              <Button variant="secondary" size="sm" aria-expanded={checklistOpen()} onClick={() => setChecklistOpen(!checklistOpen())}>
                <ListChecks aria-hidden="true" />試玩檢查 {checks().filter(Boolean).length}/{selfChecks.length}
              </Button>
              <Show when={checklistOpen()}>
                <div class="wb-pop__panel" role="group" aria-label="試玩檢查">
                  <For each={selfChecks}>{(text, i) => <label class="wb-confirm"><input type="checkbox" checked={checks()[i()]} onChange={e => setChecks(prev => prev.map((v, idx) => idx === i() ? e.currentTarget.checked : v))} />{text}</label>}</For>
                </div>
              </Show>
            </div>
            <button type="button" class="wb-icon-btn" aria-label="重新開始試玩" title="重新開始" onClick={restartPlay}><RotateCcw aria-hidden="true" /></button>
            <button type="button" class="wb-icon-btn" aria-label={playExpanded() ? "結束全螢幕試玩" : "全螢幕試玩"} title={playExpanded() ? "結束全螢幕" : "全螢幕"} onClick={togglePlayFull}>
              <Show when={playExpanded()} fallback={<Maximize2 aria-hidden="true" />}><Minimize2 aria-hidden="true" /></Show>
            </button>
          </div>
          <iframe ref={frame} class="wb-play__frame" src={PREVIEW_URL} title="學生端試玩畫面" />
        </section>
        <Show when={testTab() === "feedback"}>
          <div class="wb-reviewers">
            <div class="wb-team">
              <For each={reviewers()}>{person => <span class="wb-avatar" title={person.name + " · " + person.note}>{person.name.slice(0, 1)}</span>}</For>
            </div>
            <span class="wb-muted">{reviewers().length} 位同事 · {pending() ? pending() + " 則待處理" : "回饋都處理好了"}</span>
            <Show when={!inviting()}><Button variant="secondary" size="sm" class="wb-reviewers__invite" onClick={() => setInviting(true)}><UserPlus aria-hidden="true" />邀請同事</Button></Show>
            <Show when={inviting()}>
              <form class="wb-add wb-reviewers__form" onSubmit={e => { e.preventDefault(); invite(); }}>
                <TextField id="invite" label="邀請同事試玩" placeholder="輸入老師姓名" value={inviteDraft()} onInput={e => setInviteDraft(e.currentTarget.value)} />
                <Button type="submit" variant="secondary" disabled={!inviteDraft().trim()}>邀請</Button>
                <Button variant="quiet" onClick={() => setInviting(false)}>取消</Button>
              </form>
            </Show>
          </div>
          <div class="wb-feed">
            <For each={feedback()}>{item => <article class="wb-fb">
              <span class="wb-avatar">{item.author.slice(0, 1)}</span>
              <div class="wb-fb__body">
                <div class="wb-fb__meta"><strong>{item.author}</strong><Chip tone={kindTone[item.kind]}>{kindIcon[item.kind]()}{item.kind}</Chip></div>
                <p>{item.text}</p>
                <Show when={item.kind !== "我喜歡"}>
                  <Show when={item.status === "open"} fallback={<div class="wb-legend">
                    <Chip tone={item.status === "adopted" ? "leaf" : "neutral"} dot>{item.status === "adopted" ? "已採納，會產生修正版" : "先保留"}</Chip>
                    <Button variant="quiet" size="sm" onClick={() => setFeedback(prev => prev.map(f => f.id === item.id ? { ...f, status: "open" } : f))}>復原</Button>
                  </div>}>
                    <div class="wb-legend">
                      <Button size="sm" onClick={() => setFeedback(prev => prev.map(f => f.id === item.id ? { ...f, status: "adopted" } : f))}><Check aria-hidden="true" />採納</Button>
                      <Button size="sm" variant="secondary" onClick={() => setFeedback(prev => prev.map(f => f.id === item.id ? { ...f, status: "kept" } : f))}>先保留</Button>
                    </div>
                  </Show>
                </Show>
              </div>
            </article>}</For>
          </div>
        </Show>
      </Show>

      {/* 步驟 5：發布 */}
      <Show when={step() === 4}>
        <SectionHeading title="發布到班級" description="確認班級與上課時間，發布後學生就能加入。" />
        <Card density="teacher">
          <TextField id="publish-class" label="班級" value="五年 3 班（26 人）" readOnly />
          <TextField id="publish-time" label="上課時間" value={schedule()} onInput={e => setSchedule(e.currentTarget.value)} />
          <div class="wb-stack wb-stack--tight">
            <span class="wb-row__label">學生加入方式</span>
            <SegmentedControl label="學生加入方式" size="sm" value={joinMode()} onChange={setJoinMode} options={[{ value: "link", label: "連結" }, { value: "code", label: "班級代碼" }]} />
          </div>
          <label class="wb-confirm"><input type="checkbox" checked={liveView()} onChange={e => setLiveView(e.currentTarget.checked)} />上課時開啟即時畫面，看全班卡在哪裡</label>
        </Card>
        <Show when={props.published}>
          <Notice tone="success" title="已發布到五年 3 班">
            <p class="wb-muted">{joinMode() === "link" ? "學生連結：" + props.shareUrl : "班級代碼：QR5F21"}</p>
          </Notice>
        </Show>
      </Show>
    </TeacherWorkbench>
  );
}

/** 學習目標欄位：「學生能夠」開頭，下方是依 Bloom 分層的動詞，點了會依目前內容給建議。 */
function GoalField(props: {
  subject: Subject; value: string; more: boolean; suggestion: { verb: string; text: string; reason: string } | null;
  onInput: (text: string) => void; onVerb: (verb: string) => void; onMore: () => void; onAccept: () => void; onSkip: () => void; onCheck: () => void;
}) {
  const id = () => "goal-" + props.subject.id;
  const verb = () => detectVerb(props.value);
  const vague = () => detectVague(props.value);
  const verbButton = (v: string) => <button type="button" class="wb-verb" aria-pressed={props.suggestion?.verb === v} title={"Bloom：" + bloomOf(v)} onClick={() => props.onVerb(v)}>{v}</button>;

  return (
    <div class="wb-goal">
      <div class="wb-goal__label"><label for={id()}>學習目標</label><span>一個目標，一個可觀察的動詞</span></div>
      <div class="wb-goal__box">
        <span class="wb-goal__prefix">學生能夠</span>
        <textarea id={id()} rows={2} maxLength={GOAL_MAX} placeholder={props.subject.placeholder} value={props.value} onInput={e => props.onInput(e.currentTarget.value)} />
        <div class="wb-goal__bar">
          <div class="wb-goal__verbs" role="group" aria-label="動詞建議">
            <For each={recommendedVerbs[props.subject.id]}>{verbButton}</For>
            <button type="button" class="wb-verb wb-verb--more" aria-expanded={props.more} onClick={props.onMore}>{props.more ? "收起" : "更多"}</button>
          </div>
          <span class="wb-goal__count">{props.value.length} / {GOAL_MAX}</span>
        </div>
        <Show when={props.more}>
          <div class="wb-goal__more">
            <For each={bloomLevels}>{group => <div class="wb-goal__level">
              <span>{group.level}</span>
              <div class="wb-goal__verbs"><For each={group.verbs}>{verbButton}</For></div>
            </div>}</For>
          </div>
        </Show>
      </div>
      <Show when={props.suggestion}>{s => <div class="wb-suggestion" role="status">
        <span class="wb-suggestion__label"><Sparkles aria-hidden="true" />Qrio 建議</span>
        <p>學生能夠<strong><Typewriter text={s().text} /></strong></p>
        <div class="wb-suggestion__actions">
          <Button size="sm" onClick={props.onAccept}>採用</Button>
          <Button size="sm" variant="secondary" onClick={() => props.onVerb(s().verb)}><RotateCcw aria-hidden="true" />換一個</Button>
          <Button size="sm" variant="quiet" onClick={props.onSkip}>略過</Button>
        </div>
      </div>}</Show>
      <div class="wb-goal__meta">
        <Show when={vague()} fallback={<Show when={verb()}><span class="wb-muted">Bloom：{bloomOf(verb()!)}</span></Show>}>
          <span class="wb-warn">「{vague()}」看不到學生的行為，點上方的動詞換一個</span>
        </Show>
        <button type="button" class="wb-link" onClick={props.onCheck}><CircleHelp aria-hidden="true" />不確定這樣寫對不對？</button>
      </div>
    </div>
  );
}
