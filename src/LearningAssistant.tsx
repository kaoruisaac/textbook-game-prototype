import { children, createEffect, createSignal, For, Show } from "solid-js";
import type { JSX } from "solid-js";
import { tutorGreeting, tutorSuggestions } from "./student-tutor";
import type { TutorContext, TutorMessage, TutorOrigin } from "./student-tutor";
import "./learning-assistant.css";

type Props = {
  context: TutorContext;
  task?: JSX.Element;
  messages: TutorMessage[];
  draft: string;
  onDraft: (value: string) => void;
  onAsk: (text: string, origin: TutorOrigin) => void;
};

/** One assistant identity, with task actions and the remote tutor's independent help behaviour. */
export default function LearningAssistant(props: Props) {
  const activity = children(() => props.task);
  const [tab, setTab] = createSignal(activity() ? "task" : "help");
  let log: HTMLDivElement | undefined;
  createEffect(() => {
    const context = props.context;
    if (activity() && context !== "select") setTab("task");
  });
  createEffect(() => {
    props.messages.length; tab();
    requestAnimationFrame(() => { if (log) log.scrollTop = log.scrollHeight; });
  });
  return <div class="learning-assistant">
    <Show when={activity()}><div class="learning-tabs" role="tablist" aria-label="學習助教內容"><button id="assistant-task-tab" role="tab" aria-selected={tab() === "task"} aria-controls="assistant-task" onClick={() => setTab("task")}>探索步驟</button><button id="assistant-help-tab" role="tab" aria-selected={tab() === "help"} aria-controls="assistant-help" onClick={() => setTab("help")}>我想問問題</button></div></Show>
    <Show when={activity()}><div class="learning-task" id="assistant-task" role="tabpanel" aria-labelledby="assistant-task-tab" hidden={tab() !== "task"}>{activity()}</div></Show>
    <div class="learning-help" id="assistant-help" role={activity() ? "tabpanel" : undefined} aria-labelledby={activity() ? "assistant-help-tab" : undefined} hidden={tab() !== "help"}>
      <div class="learning-dialogue" ref={log} role="log" aria-label="學習助教對話"><div class="learning-message tutor"><p>{tutorGreeting(props.context)}</p></div><For each={props.messages}>{message => <div class={"learning-message " + message.role}><span>{message.role === "student" ? "你" : "Qrio"}</span><p>{message.text}</p></div>}</For></div>
      <div class="learning-composer"><div class="learning-suggestions"><For each={tutorSuggestions(props.context)}>{prompt => <button onClick={() => props.onAsk(prompt,"suggested")}>{prompt}</button>}</For></div><form onSubmit={e => { e.preventDefault(); props.onAsk(props.draft,"typed"); }}><label class="sr-only" for="learning-question">向學習助教提問</label><textarea id="learning-question" rows={2} maxLength={500} placeholder="有哪裡不懂？問問 Qrio…" value={props.draft} onInput={e => props.onDraft(e.currentTarget.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); props.onAsk(props.draft,"typed"); } }}/><button class="btn primary" type="submit" disabled={!props.draft.trim()}>送出</button></form></div>
    </div>
  </div>;
}
