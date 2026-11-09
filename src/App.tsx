import LearningAssistant from "./LearningAssistant";
import MapWorkspace from "./MapWorkspace";
import { StudentEntry, StudentCover, StudentTrail, StudentHeader, ViewSwitcher, StudentPanelPager } from "./StudentExperience";
import type { StudentIdentity } from "./StudentExperience";
import ExpeditionMap from "./ExpeditionMap";
import { LessonPlanner } from "./LessonPlanner";
import { EvidenceWorkbench } from "./EvidenceWorkbench";
import type { CoordStep, Point, StudentRecord, Trip } from "./evidence-data";
import { createEffect, createMemo, createSignal, For, onCleanup, Show } from "solid-js";
import { getTerrain, grid, scoreDecision, terrainInfo } from "./demo-data";
import { createExcavationSites } from "./archaeology-catalog";
import { respondToStudentReason } from "./reasoning-feedback";
import { tutorReply } from "./student-tutor";
import type { TutorContext, TutorMessage, TutorOrigin } from "./student-tutor";
import type { EventType, GameEvent, Phase, Site } from "./demo-data";

const HOME = "/";
const BUILDER = "/teacher/builder";
const BRIEF = "/mission/demo";
const EXPLORE = "/mission/demo/explore";
const RESULT = "/mission/demo/result";
const EVIDENCE = "/teacher/evidence/demo";
const routeNames: Record<string, string> = { [HOME]: "總覽", [BUILDER]: "Mission Builder", [BRIEF]: "學生任務", [EXPLORE]: "探索中", [RESULT]: "探索結果", [EVIDENCE]: "Evidence Studio" };

function Brand() {
  return <div class="brand">
    <img class="brand-logo" src="/brand/qrio-logo.svg" alt="Qrio" width="128" height="42" />
    <span class="brand-product">Textbook Gaming</span>
  </div>;
}
export default function App() {
  const knownRoutes = [HOME, BUILDER, BRIEF, EXPLORE, RESULT, EVIDENCE];
  const [route, setRoute] = createSignal(knownRoutes.includes(window.location.pathname) ? window.location.pathname : HOME);
  const [missionGoal] = createSignal("在 120 秒內探索史前地形，運用座標與文物線索，為探險隊找出值得保存的歷史證據。");
  const [published, setPublished] = createSignal(false);
  const [playing, setPlaying] = createSignal(false);
  /* 學生先在地圖上點想去的地方，再輸入座標；每個地點的操作都記在 trips，給學習證據使用 */
  const [intent, setIntent] = createSignal<Point | null>(null);
  const [trips, setTrips] = createSignal<Trip[]>([]);
  const [score, setScore] = createSignal(0);
  const [events, setEvents] = createSignal<GameEvent[]>([]);
  const [visited, setVisited] = createSignal<string[]>([]);
  const [excavated, setExcavated] = createSignal<string[]>([]);
  const [excavationSites, setExcavationSites] = createSignal<Site[]>(createExcavationSites());
  const [phase, setPhase] = createSignal<Phase>("intent");
  const [selected, setSelected] = createSignal<{ x: number; y: number } | null>(null);
  const [inputX, setInputX] = createSignal("");
  const [inputY, setInputY] = createSignal("");
  const [coordError, setCoordError] = createSignal("");
  const [reason, setReason] = createSignal("");
  const [reasonFeedback, setReasonFeedback] = createSignal("");
  const [collectReason, setCollectReason] = createSignal("");
  const [feedback, setFeedback] = createSignal("");
  const [lastDelta, setLastDelta] = createSignal(0);
  /* 老師在課前工作臺試玩時，學生端放在 iframe 裡，網址帶 ?preview=teacher */
  const teacherPreview = new URLSearchParams(window.location.search).get("preview") === "teacher";
  const [studentIdentity, setStudentIdentity] = createSignal<StudentIdentity | null>(teacherPreview ? { name: "老師試玩", classroom: "五年 3 班" } : null);
  const [studentReturnRoute, setStudentReturnRoute] = createSignal(BRIEF);
  const [tutorOpen, setTutorOpen] = createSignal(false);
  const [tutorDraft, setTutorDraft] = createSignal("");
  const [tutorMessages, setTutorMessages] = createSignal<TutorMessage[]>([]);
  const appIsStudent = createMemo(() => [BRIEF, EXPLORE, RESULT].includes(route()));
  createEffect(() => {
    document.documentElement.classList.toggle("student-viewport", appIsStudent());
    if (appIsStudent()) setStudentReturnRoute(route());
  });
  onCleanup(() => document.documentElement.classList.remove("student-viewport"));
  const tutorContext = createMemo<TutorContext>(() => route() === BRIEF ? "brief" : route() === RESULT ? "result" : phase());
  createEffect(() => { if (route() === EXPLORE && phase() !== "select") setTutorOpen(true); });
  const lastSite = createMemo(() => selected() ? excavationSites().find(site => site.x === selected()!.x && site.y === selected()!.y) : undefined);
  const selectedTerrain = createMemo(() => selected() ? terrainInfo[getTerrain(selected()!.x, selected()!.y)] : null);
  const coordinatePreview = createMemo(() => {
    if (!inputX().trim() || !inputY().trim()) return null;
    const x = Number(inputX()), y = Number(inputY());
    return Number.isInteger(x) && Number.isInteger(y) && x >= 1 && x <= 5 && y >= 1 && y <= 5 ? { x, y } : null;
  });
  const previewTerrain = createMemo(() => coordinatePreview() ? terrainInfo[getTerrain(coordinatePreview()!.x, coordinatePreview()!.y)] : null);
  const mapLocation = createMemo(() => phase() === "intent" ? null : phase() === "select" ? coordinatePreview() : selected());
  const intentTerrain = createMemo(() => intent() ? terrainInfo[getTerrain(intent()!.x, intent()!.y)] : null);
  const updateTrip = (fn: (trip: Trip) => Trip) => setTrips(prev => prev.length ? [...prev.slice(0, -1), fn(prev[prev.length - 1])] : prev);
  /* 輸入框裡的座標停住 0.8 秒才記一筆，避免把只改到一半的組合（例如只改了 X）當成學生的嘗試 */
  createEffect(() => {
    const p = coordinatePreview();
    if (phase() !== "select" || !p) return;
    const timer = window.setTimeout(() => {
      const trip = trips()[trips().length - 1];
      const last = trip?.coords[trip.coords.length - 1];
      if (!trip || (last && last.x === p.x && last.y === p.y)) return;
      updateTrip(t => ({ ...t, coords: [...t.coords, { kind: "draft", x: p.x, y: p.y }] }));
      if (last) record("coordinate_draft", "修改座標 (" + last.x + ", " + last.y + ") → (" + p.x + ", " + p.y + ")", "還沒確認前改了輸入的座標。", "(" + p.x + ", " + p.y + ")");
    }, 800);
    onCleanup(() => window.clearTimeout(timer));
  });
  /** 給學習證據的本次紀錄 */
  const liveRecord = createMemo<StudentRecord | null>(() => trips().length && studentIdentity() ? { id: "live", name: studentIdentity()!.name, trips: trips(), live: true } : null);
  const record = (type: EventType, label: string, details: string, coordinate?: string, scoreDelta?: number) => {
    const date = new Date();
    setEvents(prev => [...prev, { id: prev.length + 1, type, label, details, coordinate, scoreDelta, time: date.toLocaleTimeString("zh-TW", { hour12: false }) }]);
  };
  function askTutor(text: string, origin: TutorOrigin) {
    if (!appIsStudent() || !text.trim()) return;
    const question = text.trim();
    const context = tutorContext();
    const answer = tutorReply(question, context);
    const coordinate = selected() ?? coordinatePreview();
    const location = coordinate ? "(" + coordinate.x + ", " + coordinate.y + ")" : undefined;
    const stamp = routeNames[route()] + " / " + context;
    setTutorMessages(prev => [...prev,
      { id: prev.length + 1, role: "student", text: question, origin },
      { id: prev.length + 2, role: "tutor", text: answer }
    ]);
    record("tutor_student_message", "向學習助教提問 · " + (origin === "suggested" ? "引導問題" : "自由輸入") + " · " + stamp, question, location);
    record("tutor_reply", "助教固定腳本回覆 · " + stamp, answer, location);
    setTutorDraft("");
  }
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
    setPlaying(false);
    record("game_finished", "完成探索", "探索了 " + visited().length + " 個地點，總分 " + score() + " 分。");
    go(RESULT);
  }
  function startGame() {
    setScore(0); setEvents(prev => prev.filter(event => event.type === "tutor_student_message" || event.type === "tutor_reply")); setVisited([]); setExcavated([]); setSelected(null); setInputX(""); setInputY(""); setExcavationSites(createExcavationSites());
    setPhase("intent"); setIntent(null); setTrips([]); setReason(""); setReasonFeedback(""); setFeedback(""); setCoordError("");
    setPlaying(true);
    setTutorOpen(true);
    go(EXPLORE);
  }
  function pickIntent(point: Point) {
    if (phase() !== "intent" && phase() !== "select") return;
    if (visited().includes(point.x + "," + point.y)) { setCoordError("這個地方已經探索過，換一個地方。"); return; }
    const first = phase() === "intent";
    setIntent(point); setCoordError("");
    record("intent_selected", "想去" + terrainInfo[getTerrain(point.x, point.y)].name, first ? "在地圖上點選想探索的地方。" : "改選想去的地方。", "(" + point.x + ", " + point.y + ")");
    if (first) setTrips(prev => [...prev, { intent: point, coords: [] }]);
    else updateTrip(t => ({ ...t, intent: point }));
    setPhase("select");
  }
  function confirmCoordinate() {
    const loc = coordinatePreview();
    if (!loc) { setCoordError("請輸入有效座標：X、Y 都必須是 1～5 的整數。"); return; }
    if (visited().includes(loc.x + "," + loc.y)) { setCoordError("這個座標已探索過，請輸入其他位置。"); return; }
    setSelected(loc);
    setReason(""); setReasonFeedback(""); setCoordError("");
    /* 剛好和最後一次輸入相同的草稿，改記成確認 */
    updateTrip(t => {
      const last = t.coords[t.coords.length - 1];
      const coords: CoordStep[] = last && last.kind === "draft" && last.x === loc.x && last.y === loc.y ? t.coords.slice(0, -1) : t.coords;
      return { ...t, coords: [...coords, { kind: "confirm", x: loc.x, y: loc.y }] };
    });
    record("coordinate_selected", "輸入座標 (" + loc.x + ", " + loc.y + ")", "依輸入座標定位於" + previewTerrain()!.name + "地形。", "(" + loc.x + ", " + loc.y + ")");
    setPhase("check");
  }
  /** 學生看過標記後回答：是不是想去的地方 */
  function checkLocation(isHere: boolean) {
    const loc = selected()!;
    updateTrip(t => ({ ...t, coords: t.coords.map((c, i) => i === t.coords.length - 1 ? { ...c, answer: isHere ? "same" : "fix" } : c) }));
    record("coordinate_checked", isHere ? "確認標記就是想去的地方" : "發現標記不對，修改座標", "標記在 (" + loc.x + ", " + loc.y + ")" + selectedTerrain()!.name + "。", "(" + loc.x + ", " + loc.y + ")");
    if (isHere) { setPhase("reason"); return; }
    setSelected(null);
    setPhase("select");
  }
  function submitReason() {
    if (!reason().trim()) return;
    const loc = selected()!;
    record("reasoning_submitted", "說明探索原因", reason().trim(), "(" + loc.x + ", " + loc.y + ")");
    updateTrip(t => ({ ...t, reason: reason().trim() }));
    const response = respondToStudentReason(reason().trim(), getTerrain(loc.x, loc.y));
    setReasonFeedback(response);
    record("reasoning_feedback", "Qrio 回應學生的地形想像", response, "(" + loc.x + ", " + loc.y + ")");
    record("hint_displayed", "查看" + selectedTerrain()!.name + "線索", selectedTerrain()!.hint);
    setPhase("hint");
  }
  function decideDig(dig: boolean) {
    const loc = selected()!;
    record("excavation_decision", dig ? "決定挖掘" : "決定不挖掘", dig ? "選擇在座標 (" + loc.x + ", " + loc.y + ") 挖掘。" : "保留體力，改找下一個地點。");
    setVisited(v => [...v, loc.x + "," + loc.y]);
    updateTrip(t => ({ ...t, dig }));
    if (dig) setExcavated(v => [...v, loc.x + "," + loc.y]);
    if (!dig) { setFeedback("這次選擇暫不挖掘。決策已留在探索紀錄中。"); setLastDelta(0); setPhase("feedback"); return; }
    const discovered = lastSite()!.artefact;
    record("artefact_discovered", "發現「" + discovered.name + "」", discovered.clue);
    updateTrip(t => ({ ...t, artefact: { name: discovered.name, era: discovered.era, target: discovered.target, material: discovered.material } }));
    setCollectReason(""); setPhase("discover");
  }
  function decideCollect(collect: boolean) {
    const a = lastSite()!.artefact;
    const delta = scoreDecision(a.target, collect);
    setScore(v => v + delta);
    setLastDelta(delta);
    record("collection_decision", collect ? "採集「" + a.name + "」" : "留下「" + a.name + "」", (collect ? "Collect" : "Leave") + "；" + (collectReason().trim() || "未補充理由"), undefined, delta);
    record("score_updated", "本次得分 " + (delta > 0 ? "+" : "") + delta, "依預設文物資料與固定規則計分。");
    updateTrip(t => ({ ...t, collect, collectReason: collectReason().trim() || undefined }));
    setFeedback("這件出土物的示範年代是「" + a.era + "」。" + a.feedback + (collect ? "你選擇了採集。" : "你選擇留下，這次不加減分。"));
    setPhase("feedback");
  }
  function nextTile() { setSelected(null); setIntent(null); setInputX(""); setInputY(""); setReason(""); setReasonFeedback(""); setCollectReason(""); setPhase("intent"); }
  const shareUrl = () => window.location.origin + BRIEF;
  const studentCount = () => visited().length;
  return <div class={"app " + (appIsStudent() ? "student-mode" : "") + (route() === EXPLORE && studentIdentity() && playing() ? " immersive-game" : "")}>
    <Show when={!appIsStudent() && route() !== BUILDER && route() !== EVIDENCE}><header class="topbar">
      <div class="topbar-inner"><button class="brand-button" onClick={() => go(HOME)} aria-label="返回首頁"><Brand /></button>
        <nav class="nav" aria-label="主要導覽">
          <button class={route() === BUILDER ? "active" : ""} onClick={() => go(BUILDER)}>課程規劃</button>
          <button class={route() === EVIDENCE ? "active" : ""} onClick={() => go(EVIDENCE)}>學習證據</button>
        </nav>
        <span class="demo-badge"><span class="live-dot" /> INTERACTIVE DEMO</span>
      </div>
    </header></Show>
    <Show when={appIsStudent()}><StudentHeader identity={studentIdentity()} stage={!studentIdentity() ? 0 : route() === BRIEF ? 1 : route() === EXPLORE ? 2 : 3} /></Show>
    <Show when={!teacherPreview}><ViewSwitcher stage={appIsStudent() ? "student" : route() === EVIDENCE ? "evidence" : "planning"} onStudent={() => go(studentReturnRoute())} onTeacher={() => go(BUILDER)} onEvidence={() => go(EVIDENCE)} /></Show>
    <main class="main">
      <Show when={appIsStudent() && !studentIdentity()}><StudentEntry onJoin={identity => { setStudentIdentity(identity); go(BRIEF); }} /></Show>
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
            <button class="journey-card" onClick={() => go(BUILDER)}><span class="journey-number">01 / TEACHER</span><span class="journey-icon">▤</span><h3>建立 Mission</h3><p>整合教材、確認學習目標，設計跨科的共同挑戰。</p><span class="journey-link">開啟 Builder ↗</span></button>
            <button class="journey-card" onClick={() => go(BRIEF)}><span class="journey-number">02 / STUDENT</span><span class="journey-icon">✧</span><h3>展開探索</h3><p>學生用座標找地點、解釋原因，再依文物線索做決定。</p><span class="journey-link">開始探險 ↗</span></button>
            <button class="journey-card" onClick={() => go(EVIDENCE)}><span class="journey-number">03 / EVIDENCE</span><span class="journey-icon">◎</span><h3>看見學習證據</h3><p>保留推理與選擇，讓老師決定接下來的教學行動。</p><span class="journey-link">查看 Evidence ↗</span></button>
          </div>
        </section>
      </Show>
      <Show when={route() === BUILDER}>
        <LessonPlanner
          published={published()} onPublish={() => setPublished(true)} onStudent={() => go(BRIEF)} onHome={() => go(HOME)} shareUrl={shareUrl()} />
      </Show>
      <Show when={route() === BRIEF && studentIdentity()}><StudentCover identity={studentIdentity()!} goal={missionGoal()} onStart={startGame} /></Show>
      <Show when={route() === EXPLORE && studentIdentity()}>
        <Show when={playing()} fallback={<div class="empty-state"><h2>還沒開始這次探險</h2><p>先看今日任務，準備好再出發。</p><button class="btn primary" onClick={() => go(BRIEF)}>查看今日任務 →</button></div>}>
          <MapWorkspace chatOpen={tutorOpen()} onChatOpen={setTutorOpen} goal={missionGoal()} score={score()} explored={studentCount()}
            x={inputX()} y={inputY()} onX={setInputX} onY={setInputY} error={coordError()} stage={phase() === "intent" ? "intent" : phase() === "select" ? "select" : "busy"}
            location={mapLocation() ? terrainInfo[getTerrain(mapLocation()!.x,mapLocation()!.y)].name : ""} onLocate={confirmCoordinate}
            onExit={() => { setPlaying(false); go(BRIEF); }} onFinish={finishGame}
            map={<ExpeditionMap location={mapLocation()} intent={intent()} onPick={phase() === "intent" || phase() === "select" ? pickIntent : undefined} visited={visited()} excavated={excavated()} />}
            chat={
            <LearningAssistant context={tutorContext()} messages={tutorMessages()} draft={tutorDraft()} onDraft={setTutorDraft} onAsk={askTutor} task={<div class="assistant-activity">
              <StudentPanelPager resetKey={phase() + String(!!selected())}>
                <Show when={phase()==="intent"}><div class="chat-bubble"><p>先觀察地形，在地圖上點一個你想去探索的地方。</p></div></Show>
                <Show when={phase()==="select"}><div class="chat-bubble"><p>你想去的是這片<b>{intentTerrain()?.name}</b>。它的座標是多少？在下方輸入 X、Y。</p></div><p class="assistant-note">想換地方，再點一次地圖。</p></Show>
                <Show when={phase()==="check"}><div class="chat-bubble"><p>標記落在 <b>({selected()?.x}, {selected()?.y})</b>，是<b>{selectedTerrain()?.name}</b>。這是你想去的地方嗎？</p></div><div class="decision-actions"><button class="btn outline" onClick={()=>checkLocation(false)}>不是，我要修改</button><button class="btn primary" onClick={()=>checkLocation(true)}>是，就在這裡</button></div></Show>
                <Show when={phase()==="reason"}><div class="chat-bubble"><span>✦ QRIO · THINK FIRST</span><p>這裡是<b>{selectedTerrain()?.name}</b>。你猜古人可能在這裡做什麼？為什麼？</p></div><div class="assistant-question"><label class="input-label" for="reason">說出你的推理</label><textarea id="reason" class="field" rows={5} value={reason()} placeholder="例如：這裡可能有水源，人類需要水和食物……" onInput={e=>setReason(e.currentTarget.value)} /><button class="btn primary full" disabled={!reason().trim()} onClick={submitReason}>送出我的想法 →</button></div></Show>
                <Show when={phase()==="hint"}><div class="student-echo"><span>你的想法</span><p>{reason()}</p></div><div class="chat-bubble"><span>✦ QRIO · 回應你的想像（示範）</span><p>{reasonFeedback()}</p></div><h3 class="assistant-question-title">你準備好在這裡挖掘了嗎？</h3><div class="decision-actions"><button class="btn outline" onClick={()=>decideDig(false)}>先不挖掘</button><button class="btn primary" onClick={()=>decideDig(true)}>開始挖掘 ↗</button></div></Show>
                <Show when={phase()==="discover"}><div class="artefact-card"><div class="artefact-image"><span>⌁</span><small>ARTEFACT / {selected()?.x},{selected()?.y}</small></div><div class="artefact-copy"><span>找到一項文物</span><h3>{lastSite()?.artefact.name}</h3><p>材質：{lastSite()?.artefact.material}</p><p>{lastSite()?.artefact.clue}</p></div></div><div class="chat-bubble"><span>✦ QRIO</span><p>它可能屬於石器時代嗎？請根據線索決定要採集或留下。</p></div><button class="btn primary full" onClick={()=>setPhase("collect")}>我要做出判斷 →</button></Show>
                <Show when={phase()==="collect"}><div class="chat-bubble"><span>✦ QRIO · YOUR DECISION</span><p>看過「{lastSite()?.artefact.name}」的材質與線索後，你會怎麼做？</p></div><div class="evidence-clue"><strong>文物線索</strong><p>{lastSite()?.artefact.clue}</p></div><label class="input-label" for="collect-reason">你的判斷理由（選填）</label><textarea id="collect-reason" class="field" rows={3} value={collectReason()} onInput={e=>setCollectReason(e.currentTarget.value)} placeholder="我會選擇這樣做，因為……" /><div class="decision-actions"><button class="btn outline" onClick={()=>decideCollect(false)}>留下</button><button class="btn primary" onClick={()=>decideCollect(true)}>採集</button></div></Show>
                <Show when={phase()==="feedback"}><div class="feedback-panel"><div class={"feedback-score "+(lastDelta()<0?"loss":"")}><span>本次獲得</span><strong>{lastDelta()>0?"+":""}{lastDelta()}</strong><small>分</small></div><h3>探索已記錄！</h3><p>{feedback()}</p><div class="feedback-rule">目前總分 <b>{score()}</b> · 已探索 <b>{studentCount()}</b> 格</div><button class="btn primary full" onClick={nextTile}>繼續尋找線索 →</button></div></Show>
              </StudentPanelPager>
            </div>} />
            }
          />
        </Show>
      </Show>
      <Show when={route()===RESULT && studentIdentity()}><StudentTrail identity={studentIdentity()!} score={score()} visited={visited().length} events={events()} onReplay={() => go(BRIEF)} onChangeStudent={() => { setStudentIdentity(null); setEvents([]); setTrips([]); setVisited([]); setScore(0); setPlaying(false); go(BRIEF); }} /></Show>
      <Show when={route()===EVIDENCE}><EvidenceWorkbench live={liveRecord()} onHome={() => go(HOME)} /></Show>
    </main>
  </div>;
}
