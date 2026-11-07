import { createEffect, createMemo, createSignal, For, onCleanup, Show } from "solid-js";
import { defaultGoals, defaultIntent, demoFiles, demoTimeline, getSite, getTerrain, grid, paths, scoreDecision, terrainInfo } from "./demo-data";
import type { EventType, GameEvent, Phase } from "./demo-data";

type Goal = { subject: string; title: string; source: string; provenance: string; confirmed: boolean };
type InsightStatus = "pending" | "accepted" | "rejected" | "edited";
const HOME = "/";
const BUILDER = "/teacher/builder";
const BRIEF = "/mission/demo";
const EXPLORE = "/mission/demo/explore";
const RESULT = "/mission/demo/result";
const EVIDENCE = "/teacher/evidence/demo";
const routeNames: Record<string, string> = { [HOME]: "總覽", [BUILDER]: "Mission Builder", [BRIEF]: "學生任務", [EXPLORE]: "探索中", [RESULT]: "探索結果", [EVIDENCE]: "Evidence Studio" };
const steps = [{ num: "01", title: "教學起點", sub: "教材與一句意圖" }, { num: "02", title: "對齊學習目標", sub: "來源與教師確認" }, { num: "03", title: "設計 Mission", sub: "路徑、Checkpoint、發布" }];
const labels: Record<EventType, string> = { coordinate_selected: "座標", reasoning_submitted: "推理", hint_displayed: "提示", excavation_decision: "挖掘", artefact_discovered: "文物", collection_decision: "採集決策", score_updated: "分數", game_finished: "完成" };
const initialGoals: Goal[] = defaultGoals.map(g => ({ ...g, confirmed: false }));

function Brand() {
  return <div class="brand">
    <span class="brand-mark"><span>Q</span><i>✦</i></span>
    <div class="brand-words"><strong>qrio</strong><small>TEXTBOOK GAMING</small></div>
  </div>;
}
function Tag(props: { children: any; color?: string }) {
  return <span class={"tag " + (props.color ?? "")}>{props.children}</span>;
}
function SectionHeading(props: { overline: string; title: string; desc?: string }) {
  return <div class="section-heading"><div class="overline">{props.overline}</div><h2>{props.title}</h2><Show when={props.desc}><p>{props.desc}</p></Show></div>;
}
function EventList(props: { events: GameEvent[] }) {
  return <div class="event-list">
    <For each={props.events}>{item => <div class="event-row">
      <span class="event-icon">{labels[item.type]}</span>
      <div class="event-body"><strong>{item.label}</strong><p>{item.details}</p></div>
      <Show when={item.scoreDelta !== undefined}><span class={"points " + ((item.scoreDelta ?? 0) >= 0 ? "positive" : "negative")}>{(item.scoreDelta ?? 0) > 0 ? "+" : ""}{item.scoreDelta}</span></Show>
    </div>}</For>
  </div>;
}
export default function App() {
  const knownRoutes = [HOME, BUILDER, BRIEF, EXPLORE, RESULT, EVIDENCE];
  const [route, setRoute] = createSignal(knownRoutes.includes(window.location.pathname) ? window.location.pathname : HOME);
  const [builderStep, setBuilderStep] = createSignal(0);
  const [files, setFiles] = createSignal<string[]>([...demoFiles]);
  const [intent, setIntent] = createSignal(defaultIntent);
  const [analysing, setAnalysing] = createSignal(false);
  const [analysed, setAnalysed] = createSignal(false);
  const [goals, setGoals] = createSignal<Goal[]>(initialGoals);
  const [missionPaths, setMissionPaths] = createSignal(paths.map(p => ({ ...p })));
  const [missionGoal, setMissionGoal] = createSignal("在 120 秒內探索史前地形，運用座標與文物線索，為探險隊找出值得保存的歷史證據。");
  const [sharedOutcome, setSharedOutcome] = createSignal("共同完成一份具有理由與考古線索的探索紀錄。");
  const [published, setPublished] = createSignal(false);
  const [selectedPath, setSelectedPath] = createSignal("water");
  const [deadline, setDeadline] = createSignal<number | null>(null);
  const [remaining, setRemaining] = createSignal(120);
  const [score, setScore] = createSignal(0);
  const [events, setEvents] = createSignal<GameEvent[]>([]);
  const [visited, setVisited] = createSignal<string[]>([]);
  const [phase, setPhase] = createSignal<Phase>("select");
  const [selected, setSelected] = createSignal<{ x: number; y: number } | null>(null);
  const [inputX, setInputX] = createSignal("");
  const [inputY, setInputY] = createSignal("");
  const [coordError, setCoordError] = createSignal("");
  const [reason, setReason] = createSignal("");
  const [collectReason, setCollectReason] = createSignal("");
  const [feedback, setFeedback] = createSignal("");
  const [lastDelta, setLastDelta] = createSignal(0);
  const [selectedStudent, setSelectedStudent] = createSignal("sample");
  const [insightStates, setInsightStates] = createSignal<Record<number, InsightStatus>>({});
  const [insightNotes, setInsightNotes] = createSignal<Record<number, string>>({});
  const [nextMove, setNextMove] = createSignal("");
  const appIsStudent = createMemo(() => [BRIEF, EXPLORE, RESULT].includes(route()));
  const timeLabel = createMemo(() => String(Math.floor(remaining() / 60)).padStart(2, "0") + ":" + String(remaining() % 60).padStart(2, "0"));
  const lastSite = createMemo(() => selected() ? getSite(selected()!.x, selected()!.y) : undefined);
  const selectedTerrain = createMemo(() => selected() ? terrainInfo[getTerrain(selected()!.x, selected()!.y)] : null);
  const evidenceEvents = createMemo(() => selectedStudent() === "live" ? events() : selectedStudent() === "other" ? demoTimeline.slice(0, 3) : demoTimeline);
  const evidenceName = createMemo(() => selectedStudent() === "live" ? "我的示範探索" : selectedStudent() === "other" ? "小安 · 示範紀錄" : "小宇 · 示範紀錄");
  const record = (type: EventType, label: string, details: string, coordinate?: string, scoreDelta?: number) => {
    const date = new Date();
    setEvents(prev => [...prev, { id: prev.length + 1, type, label, details, coordinate, scoreDelta, time: date.toLocaleTimeString("zh-TW", { hour12: false }) }]);
  };
  const go = (path: string) => {
    if (!knownRoutes.includes(path)) path = HOME;
    window.history.pushState({}, "", path);
    setRoute(path);
    window.scrollTo(0, 0);
  };
  const onPop = () => setRoute(knownRoutes.includes(window.location.pathname) ? window.location.pathname : HOME);
  window.addEventListener("popstate", onPop);
  onCleanup(() => window.removeEventListener("popstate", onPop));
  function finishGame() {
    if (route() !== EXPLORE) return;
    setDeadline(null);
    record("game_finished", "探索任務結束", "120 秒結算或由 Demo 操作提前結束，總分 " + score() + " 分。");
    go(RESULT);
  }
  createEffect(() => {
    const end = deadline();
    if (route() !== EXPLORE || end === null) return;
    const tick = () => {
      const next = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      setRemaining(next);
      if (next === 0) finishGame();
    };
    tick();
    const timer = window.setInterval(tick, 250);
    onCleanup(() => window.clearInterval(timer));
  });
  function startGame() {
    setScore(0); setEvents([]); setVisited([]); setSelected(null);
    setPhase("select"); setReason(""); setFeedback(""); setCoordError("");
    setRemaining(120); setDeadline(Date.now() + 120000);
    setSelectedStudent("live"); setInsightStates({}); setNextMove("");
    go(EXPLORE);
  }
  function chooseTile(x: number, y: number) {
    if (phase() !== "select" || visited().includes(x + "," + y)) return;
    setSelected({ x, y }); setInputX(""); setInputY("");
    setReason(""); setCoordError("");
  }
  function confirmCoordinate() {
    const loc = selected();
    if (!loc) { setCoordError("先在地圖選擇一個探索格。"); return; }
    const x = Number(inputX()), y = Number(inputY());
    if (!Number.isInteger(x) || !Number.isInteger(y) || x < 1 || x > 5 || y < 1 || y > 5) { setCoordError("X、Y 都必須是 1～5 的整數。"); return; }
    if (loc.x !== x || loc.y !== y) { setCoordError("輸入座標與地圖選取的位置不同，請再核對。"); return; }
    setCoordError("");
    record("coordinate_selected", "選擇座標 (" + x + ", " + y + ")", "定位於" + selectedTerrain()!.name + "地形。", "(" + x + ", " + y + ")");
    setPhase("reason");
  }
  function submitReason() {
    if (!reason().trim()) return;
    const loc = selected()!;
    record("reasoning_submitted", "說明探索原因", reason().trim(), "(" + loc.x + ", " + loc.y + ")");
    record("hint_displayed", "查看" + selectedTerrain()!.name + "線索", selectedTerrain()!.hint);
    setPhase("hint");
  }
  function decideDig(dig: boolean) {
    const loc = selected()!;
    record("excavation_decision", dig ? "決定挖掘" : "決定不挖掘", dig ? "選擇在座標 (" + loc.x + ", " + loc.y + ") 挖掘。" : "保留體力，改找下一個地點。");
    setVisited(v => [...v, loc.x + "," + loc.y]);
    if (!dig) { setFeedback("這次選擇暫不挖掘。決策已留在探索紀錄中。"); setLastDelta(0); setPhase("feedback"); return; }
    if (!lastSite()) { setFeedback("這個地點沒有發現可判讀的文物。換個方向繼續探索吧！"); setLastDelta(0); setPhase("feedback"); return; }
    record("artefact_discovered", "發現「" + lastSite()!.artefact.name + "」", lastSite()!.artefact.clue);
    setCollectReason(""); setPhase("discover");
  }
  function decideCollect(collect: boolean) {
    const a = lastSite()!.artefact;
    const delta = scoreDecision(a.target, collect);
    setScore(v => v + delta);
    setLastDelta(delta);
    record("collection_decision", collect ? "採集「" + a.name + "」" : "留下「" + a.name + "」", (collect ? "Collect" : "Leave") + "；" + (collectReason().trim() || "未補充理由"), undefined, delta);
    record("score_updated", "本次得分 " + (delta > 0 ? "+" : "") + delta, "依預設文物資料與固定規則計分。");
    setFeedback(a.feedback);
    setPhase("feedback");
  }
  function nextTile() { setSelected(null); setInputX(""); setInputY(""); setReason(""); setCollectReason(""); setPhase("select"); }
  function updateGoal(index: number, value: string) { setGoals(prev => prev.map((g, i) => i === index ? { ...g, title: value, confirmed: false } : g)); }
  function updateMissionPath(index: number, field: "name" | "tagline", value: string) { setMissionPaths(prev => prev.map((p, i) => i === index ? { ...p, [field]: value } : p)); }
  const shareUrl = () => window.location.origin + BRIEF;
  const studentCount = () => visited().length;
  return <div class={"app " + (appIsStudent() ? "student-mode" : "")}>
    <header class="topbar">
      <div class="topbar-inner"><button class="brand-button" onClick={() => go(HOME)} aria-label="返回首頁"><Brand /></button>
        <nav class="nav" aria-label="主要導覽">
          <button class={route() === BUILDER ? "active" : ""} onClick={() => go(BUILDER)}>教師工作台</button>
          <button class={[BRIEF, EXPLORE, RESULT].includes(route()) ? "active" : ""} onClick={() => go(BRIEF)}>學生體驗</button>
          <button class={route() === EVIDENCE ? "active" : ""} onClick={() => go(EVIDENCE)}>學習證據</button>
        </nav>
        <span class="demo-badge"><span class="live-dot" /> INTERACTIVE DEMO</span>
      </div>
    </header>
    <main class="main">
      <Show when={route() === HOME}>
        <section class="hero-wrap">
          <div class="hero-copy">
            <div class="eyebrow"><span class="mini-sun">✳</span> THE NEXT CHAPTER OF LEARNING</div>
            <h1>讓每一堂課，<br /><em>變成一場探索。</em></h1>
            <p class="hero-desc">從老師的教材與一句教學意圖出發，讓 Qrio 生成跨科學習 Mission。學生透過真實決策展現所學，老師從探索證據找到下一步。</p>
            <div class="hero-actions"><button class="btn primary large" onClick={() => go(BUILDER)}>開始建立學習任務 <span>↗</span></button><button class="btn ghost large" onClick={() => go(BRIEF)}>以學生身份體驗 <span>→</span></button></div>
            <div class="trust-line"><span>✦ 跨科整合任務</span><span>✦ 遊戲化探索</span><span>✦ 可觀察學習證據</span></div>
          </div>
          <div class="hero-art" aria-hidden="true">
            <div class="hero-art-inner"><span class="map-north">N <span>↑</span></span><div class="hero-orbit one"></div><div class="hero-orbit two"></div><span class="floating-star one">✳</span><span class="floating-star two">✷</span><div class="hero-map-card"><span class="map-card-top">FIELD NOTES <b>№ 001</b></span><div class="art-grid"><For each={grid.flat()}>{terrain => <span class={"art-cell " + terrain}>{terrainInfo[terrain].symbol}</span>}</For></div><span class="map-card-bottom">STONE AGE EXPLORER <b>↗</b></span></div><div class="hero-note"><span>✦</span><strong>Think. Explore.<br />Discover.</strong></div></div>
            <div class="hero-art-footer"><span>DISCOVERY IS A WAY OF LEARNING</span><span>01 / 03</span></div>
          </div>
        </section>
        <section class="journey-section"><div class="journey-title"><div><div class="overline">A CONNECTED LEARNING JOURNEY</div><h2>從教學意圖，到看得見的理解。</h2></div><p>一套任務設計流程，連接老師的教學目標與學生真正做出的選擇。</p></div>
          <div class="journey-grid">
            <button class="journey-card" onClick={() => go(BUILDER)}><span class="journey-number">01 / TEACHER</span><span class="journey-icon">▤</span><h3>建立 Mission</h3><p>整合教材、確認學習目標，設計共同挑戰與多條路徑。</p><span class="journey-link">開啟 Builder ↗</span></button>
            <button class="journey-card" onClick={() => go(BRIEF)}><span class="journey-number">02 / STUDENT</span><span class="journey-icon">✧</span><h3>展開探索</h3><p>學生用座標找地點、解釋原因，再依文物線索做決定。</p><span class="journey-link">開始探險 ↗</span></button>
            <button class="journey-card" onClick={() => go(EVIDENCE)}><span class="journey-number">03 / EVIDENCE</span><span class="journey-icon">◎</span><h3>看見學習證據</h3><p>保留推理與選擇，讓老師決定接下來的教學行動。</p><span class="journey-link">查看 Evidence ↗</span></button>
          </div>
        </section>
      </Show>
      <Show when={route() === BUILDER}>
        <div class="content-shell">
          <div class="page-top"><div><div class="overline">TEACHER WORKSPACE / MISSION BUILDER</div><h1 class="page-title">把教材變成一場學習任務。</h1><p>三個步驟，從教學意圖走到學生可以參與的探索。</p></div><Tag color="warm">示範模式 · Mock AI</Tag></div>
          <div class="builder-layout"><aside class="builder-sidebar"><div class="sidebar-label">MISSION CREATION</div>
            <For each={steps}>{(s, i) => <button class={"builder-step " + (builderStep() === i() ? "current" : "") + (builderStep() > i() ? " completed" : "")} onClick={() => { if (i() === 0 || (analysed() && (i() < 2 || goals().every(g => g.confirmed)))) setBuilderStep(i()); }}><span class="step-number">{builderStep() > i() ? "✓" : s.num}</span><span><strong>{s.title}</strong><small>{s.sub}</small></span></button>}</For>
            <div class="sidebar-tip"><span>✦ Qrio's note</span><p>任務的好壞，從清楚的教學目標開始。所有 AI 解讀都交由老師確認。</p></div>
          </aside>
          <section class="builder-card">
            <Show when={builderStep() === 0}>
              <SectionHeading overline="STEP 01 / TEACHER INTENT" title="從你的教材開始" desc="先放入教過的內容，再用一句話說明你希望學生完成什麼。" />
              <div class="input-label">教學資料 <span class="label-helper">已放入 3 份示範教材</span></div>
              <div class="upload-area"><div class="upload-icon">↥</div><strong>加入教材文件</strong><p>可選擇多個 PDF / DOCX；Demo 只記錄檔名，不會讀取或上傳檔案內容。</p><label class="btn outline small upload-button">選擇檔案<input type="file" multiple accept=".pdf,.doc,.docx,.txt" onChange={e => { const list = Array.from(e.currentTarget.files ?? []).map(f => f.name); setFiles(prev => [...prev, ...list]); }} /></label></div>
              <div class="file-list"><For each={files()}>{(f, i) => <div class="file-chip"><span class="file-icon">▤</span><span>{f}</span><Show when={i() >= demoFiles.length}><button aria-label={"移除 " + f} onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i()))}>×</button></Show><Show when={i() < demoFiles.length}><span class="mock-caption">示範</span></Show></div>}</For></div>
              <label class="input-label" for="teacher-intent">用一句話描述你的教學意圖</label>
              <textarea id="teacher-intent" class="field textarea" rows={4} value={intent()} onInput={e => setIntent(e.currentTarget.value)} />
              <div class="inline-note">✧ 此處展示預設的 Qrio 解讀情境，並非真的解析你選取的教材。</div>
              <Show when={analysed()}><div class="success-note">✓ 示範教學脈絡已準備完成。接著請老師確認 Qrio 整理的學習目標。</div></Show>
              <div class="builder-actions"><span class="action-caption">學習目標會與教材來源一起呈現</span><button class="btn primary" disabled={!intent().trim() || analysing()} onClick={() => { if(analysed()) { setBuilderStep(1); return; } setAnalysing(true); window.setTimeout(() => {setAnalysing(false);setAnalysed(true);setBuilderStep(1);}, 520); }}>{analysing() ? "正在產生示範解析…" : analysed() ? "下一步 · 確認目標 →" : "讓 Qrio 整理學習目標 →"}</button></div>
            </Show>
            <Show when={builderStep() === 1}>
              <SectionHeading overline="STEP 02 / INTENT ALIGNMENT" title="老師，這是你想教的嗎？" desc="這些是依示範教材準備的學習目標。你可以修正內容，再確認設計方向。" />
              <div class="provenance-legend"><Tag color="green">教師已確認</Tag><Tag color="cream">示範教材對應</Tag><Tag color="warm">示範 AI 推論</Tag></div>
              <div class="goal-list"><For each={goals()}>{(goal, i) => <div class="goal-item"><div class="goal-header"><span class="goal-subject">{goal.subject}</span><Tag color={goal.confirmed ? "green" : goal.provenance.includes("推論") ? "warm" : "cream"}>{goal.confirmed ? "教師已確認" : goal.provenance}</Tag></div><textarea class="field goal-text" aria-label={goal.subject + "學習目標"} rows={2} value={goal.title} onInput={e => updateGoal(i(), e.currentTarget.value)} /><div class="goal-source">▤ {goal.source} <span>· 示範映射，未解析實體檔案</span></div><label class="confirm-line"><input type="checkbox" checked={goal.confirmed} onChange={e => setGoals(prev => prev.map((g, idx) => idx === i() ? {...g, confirmed:e.currentTarget.checked} : g))} /> 我已檢查並確認此學習目標</label></div>}</For></div>
              <div class="builder-actions"><button class="btn ghost" onClick={() => setBuilderStep(0)}>← 上一步</button><button class="btn primary" onClick={() => {setGoals(prev => prev.map(g => ({...g, confirmed:true})));setBuilderStep(2);}}>確認學習目標，設計 Mission →</button></div>
            </Show>
            <Show when={builderStep() === 2}>
              <SectionHeading overline="STEP 03 / MISSION BLUEPRINT" title="一起完成一場石器時代探索。" desc="這是基於示範資料的任務藍圖；可以編輯目標，發布後開啟學生端。" />
              <div class="field-block"><label class="input-label" for="mission-goal">Mission Goal</label><textarea class="field" id="mission-goal" rows={3} value={missionGoal()} onInput={e => setMissionGoal(e.currentTarget.value)} /></div>
              <div class="field-block"><label class="input-label" for="mission-outcome">Shared Outcome</label><input class="field" id="mission-outcome" value={sharedOutcome()} onInput={e => setSharedOutcome(e.currentTarget.value)} /></div>
              <div class="input-label">不同路徑，同一個共同目標 <span class="label-helper">3 條示範路徑</span></div>
              <div class="builder-paths"><For each={missionPaths()}>{(p,i) => <div class={"mini-path " + p.color}><span class="path-icon">{p.icon}</span><input class="field mini-input" aria-label={"路徑 " + (i()+1) + " 名稱"} value={p.name} onInput={e => updateMissionPath(i(),"name",e.currentTarget.value)} /><textarea class="field mini-desc" rows={3} aria-label={"路徑 " + (i()+1) + " 描述"} value={p.tagline} onInput={e => updateMissionPath(i(),"tagline",e.currentTarget.value)} /></div>}</For></div>
              <div class="checkpoint-card"><div class="checkpoint-symbol">⌖</div><div><strong>CHECKPOINT 01 · Stone Age Explorer</strong><p>5×5 座標地圖 · 五種地形 · 120 秒探索 · 依預設文物資料計分</p></div><Tag color="cream">Demo</Tag></div>
              <Show when={published()}><div class="publish-success"><div class="publish-icon">✓</div><div><h3>Mission 已發布（Demo）</h3><p>學生連結已準備好。這是前端示範，不會建立真實班級任務。</p><input class="field" readonly value={shareUrl()} /></div></div></Show>
              <div class="builder-actions split"><button class="btn ghost" onClick={() => setBuilderStep(1)}>← 上一步</button><div class="action-pair"><button class="btn outline" onClick={() => go(BRIEF)}>預覽學生端 ↗</button><button class="btn primary" onClick={() => published() ? go(BRIEF) : setPublished(true)}>{published() ? "進入學生任務 →" : "發布 Mission →"}</button></div></div>
            </Show>
          </section></div>
        </div>
      </Show>
      <Show when={route() === BRIEF}>
        <section class="mission-brief"><div class="brief-head"><div class="overline">STUDENT MISSION / FIELD EXPEDITION 01</div><Tag color="cream">MISSION READY · DEMO</Tag></div>
          <div class="brief-hero"><div class="brief-text"><div class="brief-kicker">✧ 你的探險旅程即將開始</div><h1>石器時代，<br /><em>等待你的發現。</em></h1><p>你是一位史前探險家。觀察地形、使用座標找到位置，從出土物的線索判斷哪些文物值得帶回探險隊。</p><div class="mission-stats"><div><strong>02:00</strong><span>探索時間</span></div><div><strong>5 × 5</strong><span>座標地圖</span></div><div><strong>03</strong><span>探索路徑</span></div></div></div><div class="brief-drawing"><div class="brief-ring"></div><div class="sun-disc">✳</div><div class="brief-mountain back"></div><div class="brief-mountain front"></div><div class="brief-river"></div><span class="brief-coordinate">X:03 · Y:04</span><span class="brief-character">⌖</span></div></div>
          <div class="path-choose"><div class="path-top"><div><div class="overline">CHOOSE YOUR PATH</div><h2>你想從哪裡開始尋找線索？</h2></div><p>不同起點、相同目標。每條路徑都能探索完整地圖。</p></div><div class="path-grid"><For each={missionPaths()}>{p => <button class={"path-card " + p.color + (selectedPath()===p.id?" chosen":"")} onClick={() => setSelectedPath(p.id)}><span class="path-card-icon">{p.icon}</span><span class="path-card-check">{selectedPath()===p.id?"✓":"○"}</span><h3>{p.name}</h3><p>{p.tagline}</p><span class="path-card-bottom">探索路徑 / {p.id.toUpperCase()}</span></button>}</For></div>
            <div class="brief-bottom"><div><strong>任務目標</strong><p>{missionGoal()}</p><span>※ 這是一段示範探險；倒數在點擊開始後啟動。</span></div><button class="btn primary large" onClick={startGame}>開始 120 秒探索 <span>↗</span></button></div>
          </div>
        </section>
      </Show>
      <Show when={route() === EXPLORE}>
        <Show when={deadline() !== null} fallback={<div class="empty-state"><h2>還沒開始這次探險</h2><p>請先選擇學習路徑，準備好之後再啟動倒數。</p><button class="btn primary" onClick={() => go(BRIEF)}>選擇探索路徑 →</button></div>}>
          <section class="game-shell">
            <div class="game-top"><div><div class="overline">FIELD EXPEDITION / STONE AGE EXPLORER</div><h1>史前探險地圖 <span>⌖</span></h1></div><div class="game-indicators"><div class="indicator"><span>SCORE</span><strong>{score()}</strong></div><div class={"indicator timer " + (remaining()<=25?"urgent":"")}><span>TIME LEFT</span><strong>{timeLabel()}</strong></div></div></div>
            <div class="game-content"><section class="map-panel"><div class="map-title"><div><strong>探索區域 01</strong><span>從座標選一個地點，解開史前生活的秘密。</span></div><Tag color="cream">X / Y GRID</Tag></div>
              <div class="map-frame"><div class="map-compass">N ↑</div><div class="map-layout"><div class="y-labels"><For each={[5,4,3,2,1]}>{num=><span>{num}</span>}</For></div><div class="map-and-x"><div class="map-grid"><For each={grid.flatMap((r, row)=>r.map((t,col)=>({t, x:col+1,y:5-row})))}>{cell => {
                const active=()=>selected()?.x===cell.x&&selected()?.y===cell.y;
                const seen=()=>visited().includes(cell.x+","+cell.y);
                return <button class={"tile "+cell.t+(active()?" selected":"")+(seen()?" seen":"")} aria-label={"座標 "+cell.x+", "+cell.y+"，"+terrainInfo[cell.t].name} title={"("+cell.x+", "+cell.y+") "+terrainInfo[cell.t].name} disabled={phase()!=="select"||seen()} onClick={()=>chooseTile(cell.x,cell.y)}><span class="tile-landmark">{terrainInfo[cell.t].symbol}</span><span class="tile-coord">{cell.x},{cell.y}</span><Show when={seen()}><span class="tile-seen">✓</span></Show></button>;
              }}</For></div><div class="x-labels"><For each={[1,2,3,4,5]}>{num=><span>{num}</span>}</For></div></div></div><span class="map-y-caption">Y</span><span class="map-x-caption">X →</span></div>
              <div class="terrain-legend"><For each={Object.entries(terrainInfo)}>{([key,info])=><span><i class={"legend-dot "+key}></i>{info.name}</span>}</For></div>
              <div class="map-foot"><span>⌖ 已探索 {studentCount()} / 25 個格點</span><span>提示：每格只能探索一次</span></div>
            </section>
            <section class="assistant-panel"><div class="assistant-head"><div class="assistant-avatar">✦</div><div><strong>Qrio 探險助手</strong><span>EXPLORATION ASSISTANT · DEMO</span></div><span class="assistant-status">●</span></div>
              <div class="assistant-body">
                <Show when={phase()==="select"}><div class="chat-bubble"><span>✦ QRIO</span><p>準備好了嗎？先在左邊地圖挑選一格，再試著輸入它的 X / Y 座標。</p></div>
                  <Show when={selected()} fallback={<div class="assistant-placeholder"><div class="radar">⌖</div><strong>等待你的第一個發現</strong><p>點選地圖上的任一格，開始探索。</p></div>}><div class="coordinate-card"><span class="input-label">目前選擇</span><strong>{selectedTerrain()?.name}</strong><small>{selectedTerrain()?.caption}</small><div class="coordinate-fields"><label>X 座標<input class="field" type="number" min="1" max="5" step="1" value={inputX()} onInput={e=>setInputX(e.currentTarget.value)} placeholder="1–5" /></label><label>Y 座標<input class="field" type="number" min="1" max="5" step="1" value={inputY()} onInput={e=>setInputY(e.currentTarget.value)} placeholder="1–5" /></label></div><Show when={coordError()}><p class="form-error" role="alert">{coordError()}</p></Show><button class="btn primary full" onClick={confirmCoordinate}>確認座標 →</button></div></Show>
                </Show>
                <Show when={phase()==="reason"}><div class="chat-bubble"><span>✦ QRIO · THINK FIRST</span><p>你選擇了 <b>{selectedTerrain()?.name}</b>。為什麼你認為這裡可能找到史前人類活動的痕跡？</p></div><div class="assistant-question"><label class="input-label" for="reason">說出你的推理</label><textarea id="reason" class="field" rows={5} value={reason()} placeholder="例如：這裡可能有水源，人類需要水和食物……" onInput={e=>setReason(e.currentTarget.value)} /><button class="btn primary full" disabled={!reason().trim()} onClick={submitReason}>送出我的想法 →</button></div></Show>
                <Show when={phase()==="hint"}><div class="chat-bubble"><span>✦ QRIO · TERRAIN CLUE</span><p>{selectedTerrain()?.hint}</p></div><div class="hint-card"><span>地形觀察</span><h3>{selectedTerrain()?.name}</h3><p>這是一條幫助推理的線索，不會直接告訴你文物的年代。</p></div><h3 class="assistant-question-title">你準備好在這裡挖掘了嗎？</h3><div class="decision-actions"><button class="btn outline" onClick={()=>decideDig(false)}>先不挖掘</button><button class="btn primary" onClick={()=>decideDig(true)}>開始挖掘 ↗</button></div></Show>
                <Show when={phase()==="discover"}><div class="discovery-kicker">✦ DISCOVERY UNLOCKED</div><div class="artefact-card"><div class="artefact-image"><span>⌁</span><small>ARTEFACT / {selected()?.x},{selected()?.y}</small></div><div class="artefact-copy"><span>找到一項文物</span><h3>{lastSite()?.artefact.name}</h3><p>材質：{lastSite()?.artefact.material}</p><p>{lastSite()?.artefact.clue}</p></div></div><div class="chat-bubble"><span>✦ QRIO</span><p>它可能屬於石器時代嗎？請根據線索決定 Collect 或 Leave。</p></div><button class="btn primary full" onClick={()=>setPhase("collect")}>我要做出判斷 →</button></Show>
                <Show when={phase()==="collect"}><div class="chat-bubble"><span>✦ QRIO · YOUR DECISION</span><p>看過「{lastSite()?.artefact.name}」的材質與線索後，你會怎麼做？</p></div><div class="evidence-clue"><strong>文物線索</strong><p>{lastSite()?.artefact.clue}</p></div><label class="input-label" for="collect-reason">你的判斷理由（選填）</label><textarea id="collect-reason" class="field" rows={3} value={collectReason()} onInput={e=>setCollectReason(e.currentTarget.value)} placeholder="我會選擇這樣做，因為……" /><div class="decision-actions"><button class="btn outline" onClick={()=>decideCollect(false)}>Leave · 留下</button><button class="btn primary" onClick={()=>decideCollect(true)}>Collect · 採集</button></div></Show>
                <Show when={phase()==="feedback"}><div class="feedback-panel"><div class={"feedback-score "+(lastDelta()<0?"loss":"")}><span>本次獲得</span><strong>{lastDelta()>0?"+":""}{lastDelta()}</strong><small>分</small></div><h3>探索已記錄！</h3><p>{feedback()}</p><div class="feedback-rule">目前總分 <b>{score()}</b> · 已探索 <b>{studentCount()}</b> 格</div><button class="btn primary full" onClick={nextTile}>繼續尋找線索 →</button></div></Show>
              </div><div class="assistant-bottom"><span>↗ 選擇和理由都會成為學習證據</span><button onClick={finishGame}>結束本輪（Demo）</button></div>
            </section></div><div class="game-disclaimer">GAMEPLAY DEMO · 地形、文物及分數皆為固定示範資料，Qrio 提示為預寫腳本，非即時 AI 判定。</div>
          </section>
        </Show>
      </Show>
      <Show when={route()===RESULT}><div class="content-shell result-page"><div class="result-hero"><div class="result-spark">✦</div><div class="overline">EXPLORATION COMPLETE / MISSION 01</div><h1>每一個選擇，<br /><em>都是學習的線索。</em></h1><p>你的探索紀錄已完成。分數呈現遊戲回饋，背後的理由與選擇才是老師可以討論的學習證據。</p><div class="result-stat-grid"><div><strong>{score()}</strong><span>最終分數</span></div><div><strong>{visited().length}</strong><span>探索地點</span></div><div><strong>{events().filter(e=>e.type==="reasoning_submitted").length}</strong><span>推理紀錄</span></div></div><div class="result-actions"><button class="btn primary large" onClick={()=>go(EVIDENCE)}>老師查看學習證據 ↗</button><button class="btn outline large" onClick={()=>go(BRIEF)}>重新選擇路徑</button></div></div>
        <div class="result-log"><div class="result-log-head"><h2>你的探索足跡</h2><Tag color="cream">原始活動紀錄 · Demo</Tag></div><Show when={events().length} fallback={<p class="muted">這次尚未產生探索紀錄。你可以先開始一輪遊戲。</p>}><EventList events={events()} /></Show></div>
      </div></Show>
      <Show when={route()===EVIDENCE}><div class="evidence-shell"><div class="page-top"><div><div class="overline">TEACHER WORKSPACE / EVIDENCE STUDIO</div><h1 class="page-title">從選擇，看見理解的線索。</h1><p>學習證據由學生的真實操作留下；Qrio 的整理只是候選解讀，最後由老師確認。</p></div><Tag color="warm">Demo Data + 本輪紀錄</Tag></div>
        <div class="evidence-grid"><aside class="evidence-students"><div class="panel-heading"><span>STUDENT RECORDS</span><strong>學生探索紀錄</strong></div><Show when={events().length>0}><button class={"student-entry "+(selectedStudent()==="live"?"current":"")} onClick={()=>setSelectedStudent("live")}><span class="student-avatar light">我</span><span><strong>我的示範探索</strong><small>{events().length} 筆真實前端互動事件</small></span></button></Show><button class={"student-entry "+(selectedStudent()==="sample"?"current":"")} onClick={()=>setSelectedStudent("sample")}><span class="student-avatar">宇</span><span><strong>小宇 · 示範紀錄</strong><small>6 筆 Mock 事件 · +10 分</small></span></button><button class={"student-entry "+(selectedStudent()==="other"?"current":"")} onClick={()=>setSelectedStudent("other")}><span class="student-avatar light">安</span><span><strong>小安 · 示範紀錄</strong><small>3 筆 Mock 事件 · 推理中</small></span></button><div class="evidence-aside-note"><strong>資料透明原則</strong><p>「示範紀錄」為固定情境；「我的示範探索」才是你這次在網頁上的操作。資料不會上傳伺服器。</p></div></aside>
          <section class="evidence-timeline"><div class="panel-heading"><span>RAW LEARNING TRACE</span><strong>{evidenceName()}</strong><p>座標、理由、提示、挖掘與採集決策</p></div><Show when={evidenceEvents().length>0} fallback={<div class="empty-mini"><span>⌖</span><strong>還沒有探索紀錄</strong><p>先完成一輪學生探險，這裡就會出現行為證據。</p><button class="btn outline small" onClick={()=>go(BRIEF)}>前往學生任務</button></div>}><EventList events={evidenceEvents()} /></Show></section>
          <section class="evidence-insights"><div class="panel-heading"><span>QRIО · POSSIBLE SIGNALS</span><strong>候選理解訊號</strong><p>這不是學生能力判定，請參考左側的原始行為。</p></div>
            <For each={[{title:"座標應用",desc:"學生能否將地圖上的選取位置對應到 X / Y 座標？",anchor:"coordinate_selected",goal:"數學 · 座標定位"},{title:"地理推理",desc:"學生的選點理由是否能連結地形、資源與人類活動？",anchor:"reasoning_submitted",goal:"社會 · 地形與生活"},{title:"歷史判斷",desc:"採集與放棄決策是否引用文物特徵或出土線索？",anchor:"collection_decision",goal:"跨科 · 證據推理"}]}>{(sig,idx)=><div class="insight-card"><div class="insight-card-top"><span class="insight-number">0{idx()+1}</span><Tag color={insightStates()[idx()] === "accepted" ? "green" : insightStates()[idx()] === "rejected" ? "warm" : "cream"}>{insightStates()[idx()] === "accepted" ? "老師接受" : insightStates()[idx()] === "rejected" ? "老師拒絕" : insightStates()[idx()] === "edited" ? "老師已修正" : "等待老師確認"}</Tag></div><h3>{sig.title}</h3><p>{sig.desc}</p><div class="insight-link">{sig.goal} · 事件類型 {labels[sig.anchor as EventType]}</div><Show when={evidenceEvents().find(e=>e.type===sig.anchor)}>{ev => <div class="insight-quote">「{ev().details}」</div>}</Show><Show when={evidenceEvents().some(e=>e.type===sig.anchor)} fallback={<small class="no-evidence">目前未找到對應事件；不能推斷學生表現。</small>}><small class="has-evidence">可回溯至 {evidenceEvents().filter(e=>e.type===sig.anchor).length} 筆事件</small></Show><Show when={insightStates()[idx()] === "edited"}><textarea class="field" rows={2} placeholder="老師補充／修改解讀..." value={insightNotes()[idx()] ?? ""} onInput={e=>setInsightNotes(p=>({...p,[idx()]:e.currentTarget.value}))} /></Show><div class="insight-actions"><button onClick={()=>setInsightStates(p=>({...p,[idx()]:"accepted"}))}>✓ 接受</button><button onClick={()=>setInsightStates(p=>({...p,[idx()]:"edited"}))}>✎ 修正</button><button onClick={()=>setInsightStates(p=>({...p,[idx()]:"rejected"}))}>× 拒絕</button></div></div>}</For>
          </section></div>
          <div class="next-move"><div><div class="overline">TEACHER DECISION / NEXT MOVE</div><h2>下一步，交給老師決定。</h2><p>依據原始證據，你可以安排後續練習或延伸任務。這裡只展示選擇，尚不會建立真實任務。</p></div><div class="next-move-actions"><label for="nextmove" class="input-label">後續教學建議</label><select id="nextmove" class="field" value={nextMove()} onChange={e=>setNextMove(e.currentTarget.value)}><option value="">選擇一個 Next Move</option><option value="座標複習">安排座標定位複習</option><option value="線索比較">小組比較文物與考古線索</option><option value="延伸探險">設計下一輪延伸探險</option></select><Show when={nextMove()}><div class="success-note">✓ 已選擇「{nextMove()}」（Demo），未指派真實作業。</div></Show></div></div>
        </div></Show>
    </main>
    <footer class="site-footer"><div><Brand/><span>From teaching intent to meaningful missions.</span></div><span>QRIO · INTEGRATED LEARNING MISSION · PROTOTYPE V1</span><span>© DEMO / NOT A LIVE CLASSROOM SYSTEM</span></footer>
  </div>;
}
