import { createEffect, createSignal, on, onCleanup, Show } from "solid-js";

/* 已經打完的內容（以 id + 文字為鍵），重新顯示時直接出現，不再重打一次 */
const typed = new Set<string>();
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** 生成內容逐字出現，讓老師知道這是 Qrio 產生的。 */
export function Typewriter(props: { text: string; id?: string; speed?: number; onDone?: () => void }) {
  const [count, setCount] = createSignal(0);

  createEffect(on(() => props.text, text => {
    const key = props.id ? props.id + "|" + text : undefined;
    if (reduceMotion || (key && typed.has(key))) { setCount(text.length); return; }
    setCount(0);
    const step = Math.max(1, Math.ceil(text.length / 50));
    const timer = window.setInterval(() => {
      setCount(current => {
        const next = Math.min(text.length, current + step);
        if (next >= text.length) {
          window.clearInterval(timer);
          if (key) typed.add(key);
          queueMicrotask(() => props.onDone?.());
        }
        return next;
      });
    }, props.speed ?? 26);
    onCleanup(() => window.clearInterval(timer));
  }));

  return (
    <>
      <span aria-hidden="true">{props.text.slice(0, count())}<Show when={count() < props.text.length}><span class="wb-caret" /></Show></span>
      <span class="pc-visually-hidden">{props.text}</span>
    </>
  );
}
