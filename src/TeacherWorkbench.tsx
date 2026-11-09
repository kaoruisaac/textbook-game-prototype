import { createEffect, createSignal, For, on, Show, type JSX } from "solid-js";
import { Button, ChatBubble, Check, MessagesSquare, SegmentedControl, Send, Sparkles, StepList, X, type StepItem } from "./design-system";
import { assistantGreeting, assistantReply, assistantSuggestions, defaultDiscussion, type AssistantMessage, type DiscussionComment } from "./teacher-assistant";
import { assistantOpen, guide, setAssistantOpen, setGuide } from "./teacher-guide";
import { checkGoal, rewriteGoal } from "./lesson-plan-data";
import { Typewriter } from "./Typewriter";
import "./teacher-workbench.css";

const coPlanners = [
  { initial: "王", name: "王老師", subject: "數學" },
  { initial: "林", name: "林老師", subject: "社會" },
];

export interface TeacherWorkbenchProps {
  steps: StepItem[];
  step: number;
  onStep: (index: number) => void;
  canSelect: (index: number) => boolean;
  onHome: () => void;
  meta: string;
  children: JSX.Element;
  footer?: JSX.Element;
  /** 左側欄的內容；沒有給就顯示步驟列 */
  rail?: JSX.Element;
  /** 左側欄的名稱（給輔助科技） */
  railLabel?: string;
  /** 工作區裡有內容放大填滿畫面（例如學生端試玩）時為 true，工作區不再捲動 */
  staged?: boolean;
}

/** 教師課前工作臺：左側步驟、中間工作區、右側 Qrio 共備助手。 */
export function TeacherWorkbench(props: TeacherWorkbenchProps) {
  let canvas: HTMLDivElement | undefined;
  createEffect(() => { props.step; props.staged; canvas?.scrollTo({ top: 0 }); });

  return (
    <div class={"wb pc-density-teacher" + (assistantOpen() ? " wb--assistant" : "")}>
      <header class="wb-head">
        <button type="button" class="wb-home" onClick={props.onHome} aria-label="返回首頁">
          <img src="/brand/qrio-logo.svg" alt="Qrio" width="84" height="28" />
        </button>
        <div class="wb-head__title">
          <h1>座標 × 石器時代</h1>
          <span>{props.meta}</span>
        </div>
        <div class="wb-head__side">
          <div class="wb-team" aria-label="共備成員：王老師（數學）、林老師（社會）">
            <For each={coPlanners}>{person => <span class="wb-avatar" title={person.name + " · " + person.subject}>{person.initial}</span>}</For>
          </div>
          <Button variant={assistantOpen() ? "quiet" : "secondary"} size="sm" aria-pressed={assistantOpen()} onClick={() => setAssistantOpen(!assistantOpen())}><Sparkles aria-hidden="true" />Qrio</Button>
        </div>
      </header>

      <aside class="wb-rail" aria-label={props.railLabel ?? "課前準備步驟"}>
        <Show when={props.rail} fallback={<StepList label="課前準備步驟" steps={props.steps} current={props.step} onSelect={props.onStep} canSelect={props.canSelect} />}>{props.rail}</Show>
      </aside>

      <main class={"wb-canvas" + (props.staged ? " wb-canvas--staged" : "")} ref={canvas}>
        <div class="wb-sheet">{props.children}</div>
        <Show when={props.footer}><div class="wb-footer">{props.footer}</div></Show>
      </main>

      <TeacherAssistant open={assistantOpen()} step={props.step} stepTitle={i => props.steps[i]?.title ?? ""} onClose={() => setAssistantOpen(false)} />
    </div>
  );
}

/* 對話放在模組層，切到學生端試玩再回來時不會遺失 */
const [messages, setMessages] = createSignal<AssistantMessage[]>([]);
const [greeted, setGreeted] = createSignal<number[]>([]);
const [discussion, setDiscussion] = createSignal<DiscussionComment[]>(defaultDiscussion.map(c => ({ ...c })));
const [tab, setTab] = createSignal<"qrio" | "team">("qrio");
const [asked, setAsked] = createSignal<number[]>([]);

function TeacherAssistant(props: { open: boolean; step: number; stepTitle: (index: number) => string; onClose: () => void }) {
  const [draft, setDraft] = createSignal("");
  const [note, setNote] = createSignal("");
  let log: HTMLDivElement | undefined;
  const toBottom = () => queueMicrotask(() => log?.scrollTo({ top: log.scrollHeight, behavior: "smooth" }));

  createEffect(on(() => [props.open, tab()], ([open]) => { if (open) toBottom(); }, { defer: true }));
  createEffect(on(guide, request => { if (request) setTab("qrio"); else toBottom(); }, { defer: true }));
  createEffect(on(() => props.step, step => {
    if (greeted().includes(step)) return;
    setGreeted(prev => [...prev, step]);
    setMessages(prev => [...prev, { id: prev.length + 1, role: "qrio", text: assistantGreeting(step) }]);
    toBottom();
  }));

  function ask(text: string) {
    const question = text.trim();
    if (!question) return;
    setAsked(prev => prev.includes(props.step) ? prev : [...prev, props.step]);
    setMessages(prev => [...prev,
      { id: prev.length + 1, role: "teacher", text: question },
      { id: prev.length + 2, role: "qrio", text: assistantReply(question, props.step) },
    ]);
    setDraft("");
    toBottom();
  }

  function post() {
    const text = note().trim();
    if (!text) return;
    setDiscussion(prev => [...prev, { id: prev.length + 1, author: "你", step: props.step, text }]);
    setNote("");
    toBottom();
  }

  return (
    <aside class="wb-assistant" aria-label="Qrio 共備助手" hidden={!props.open}>
      <div class="wb-assistant__head">
        <SegmentedControl label="助手內容" size="sm" value={tab()} onChange={setTab}
          options={[{ value: "qrio", label: <><Sparkles aria-hidden="true" />問 Qrio</> }, { value: "team", label: <><MessagesSquare aria-hidden="true" />共備討論<span class="wb-count">{discussion().length}</span></> }]} />
        <button type="button" class="wb-icon-btn" aria-label="收起 Qrio 助手" onClick={props.onClose}><X aria-hidden="true" /></button>
      </div>
      <Show when={tab() === "qrio" && guide()}>
        <GoalGuide onDone={text => setMessages(prev => [...prev, { id: prev.length + 1, role: "qrio", text }])} />
      </Show>
      <Show when={tab() === "qrio" && !guide()}>
        <div class="wb-assistant__log" ref={log} aria-live="polite">
          <For each={messages()}>{message =>
            <ChatBubble from={message.role === "teacher" ? "student" : "qrio"} label={message.role === "teacher" ? "你" : undefined}>
              <p>{message.role === "qrio" ? <Typewriter id={"msg-" + message.id} text={message.text} onDone={toBottom} /> : message.text}</p>
            </ChatBubble>
          }</For>
        </div>
        <Show when={!asked().includes(props.step)}><div class="wb-assistant__suggest">
          <For each={assistantSuggestions(props.step)}>{text => <button type="button" class="wb-suggest" onClick={() => ask(text)}>{text}</button>}</For>
        </div></Show>
        <form class="wb-composer" onSubmit={e => { e.preventDefault(); ask(draft()); }}>
          <label class="pc-visually-hidden" for="wb-composer-input">問 Qrio</label>
          <textarea id="wb-composer-input" rows={2} placeholder="問 Qrio，或請它幫你起草…" value={draft()} onInput={e => setDraft(e.currentTarget.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); ask(draft()); } }} />
          <Button type="submit" size="sm" disabled={!draft().trim()}><Send aria-hidden="true" />送出</Button>
        </form>
      </Show>
      <Show when={tab() === "team"}>
        <div class="wb-assistant__log" ref={log} aria-live="polite">
          <For each={discussion()}>{comment => <div class="wb-thread">
            <span class="wb-avatar">{comment.author.slice(0, 1)}</span>
            <div class="wb-thread__body">
              <div class="wb-thread__meta"><strong>{comment.author}</strong><span>{props.stepTitle(comment.step)}</span></div>
              <p>{comment.text}</p>
            </div>
          </div>}</For>
        </div>
        <form class="wb-composer" onSubmit={e => { e.preventDefault(); post(); }}>
          <label class="pc-visually-hidden" for="wb-note-input">留言給共備老師</label>
          <textarea id="wb-note-input" rows={2} placeholder="留言給王老師、林老師…" value={note()} onInput={e => setNote(e.currentTarget.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); post(); } }} />
          <Button type="submit" size="sm" disabled={!note().trim()}>留言</Button>
        </form>
      </Show>
    </aside>
  );
}

/** 右側的固定引導：一題一題檢查老師寫的學習目標，最後給一句可以套用的版本。 */
function GoalGuide(props: { onDone: (message: string) => void }) {
  const [shown, setShown] = createSignal(1);
  let log: HTMLDivElement | undefined;
  const request = () => guide()!;
  const checks = () => checkGoal(request().subject, request().text);
  const finalText = () => rewriteGoal(request().subject, request().text);
  const done = () => shown() > checks().length;
  createEffect(on(guide, () => setShown(1)));
  createEffect(on(shown, () => queueMicrotask(() => log?.scrollTo({ top: log.scrollHeight, behavior: "smooth" }))));

  function close(message?: string) {
    if (message) props.onDone(message);
    setGuide(null);
  }

  return <>
    <div class="wb-assistant__log" ref={log} aria-live="polite">
      <ChatBubble><p><Typewriter text={"我們一起檢查" + request().subject.name + "的學習目標，一共 " + checks().length + " 個問題。"} /></p></ChatBubble>
      <ChatBubble from="student" label="你寫的目標"><p>{request().text.trim() ? "學生能夠" + request().text.trim() : "（還沒寫）"}</p></ChatBubble>
      <For each={checks().slice(0, shown())}>{(check, i) =>
        <div class="wb-check">
          <span class={"wb-check__mark" + (check.ok ? " is-ok" : "")} aria-hidden="true">{check.ok ? <Check size={14} strokeWidth={3} /> : i() + 1}</span>
          <div><strong>{check.question}</strong><p><Typewriter text={check.result} /></p></div>
        </div>
      }</For>
      <Show when={done()}>
        <ChatBubble label={checks().every(c => c.ok) ? "這樣寫很清楚" : "整理好的版本"}><p>學生能夠<Typewriter text={finalText()} /></p></ChatBubble>
      </Show>
    </div>
    <div class="wb-composer wb-composer--actions">
      <Show when={done()} fallback={<>
        <Button variant="quiet" size="sm" onClick={() => close()}>結束檢查</Button>
        <Button size="sm" onClick={() => setShown(shown() + 1)}>{shown() === checks().length ? "看整理好的版本" : "下一題"}</Button>
      </>}>
        <Button variant="quiet" size="sm" onClick={() => close()}>不用了</Button>
        <Show when={finalText() !== request().text.trim()} fallback={<Button size="sm" onClick={() => close("目標檢查完成，不需要修改。")}>完成</Button>}>
          <Button size="sm" onClick={() => { request().apply(finalText()); close(`已把整理好的版本套用到${request().subject.name}目標，你可以再自己修改。`); }}>套用到目標</Button>
        </Show>
      </Show>
    </div>
  </>;
}
