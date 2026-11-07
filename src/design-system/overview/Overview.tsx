/*
 * 鉛筆盒設計系統總覽。全部由 src/design-system 的真實元件組成。
 * 入口：storybook/design-system/index.html（npm run dev 後開 /storybook/design-system/）
 */
import { createSignal, For, type JSX } from "solid-js";
import {
  AnswerGroup,
  AnswerOption,
  AssistantHeader,
  Avatar,
  Brand,
  Button,
  Card,
  CardHeader,
  ChatBubble,
  CheckIcon,
  Chip,
  ChoiceCard,
  ClueCard,
  DotLabel,
  EmptyState,
  EventList,
  FACE_EXPRESSIONS,
  Face,
  Feedback,
  FileChip,
  Highlight,
  Indicator,
  InsightCard,
  JourneyCard,
  LevelSteps,
  Notice,
  ScoreFeedback,
  SectionHeading,
  SegmentedControl,
  Select,
  SiteFooter,
  Stamp,
  Stat,
  StatGroup,
  StepList,
  StudentEntry,
  TextArea,
  TextField,
  Toast,
  TopBar,
  UnitCard,
  UploadArea,
  type AnswerState,
  type Density,
  type FaceExpression,
  type ReviewStatus,
} from "..";

/* ---------- 範例資料 ---------- */

const OPTIONS = [
  { key: "A", text: "食鹽水", right: false, say: "食鹽水是中性，石蕊試紙不會變色。" },
  { key: "B", text: "小蘇打水", right: false, say: "小蘇打水是鹼性，會讓紅色石蕊試紙變藍。" },
  { key: "C", text: "白醋", right: true, say: "白醋是酸性，會讓藍色石蕊試紙變紅。" },
  { key: "D", text: "肥皂水", right: false, say: "肥皂水是鹼性，會讓紅色石蕊試紙變藍。" },
];

const NEUTRALS = [
  { name: "桌面灰", token: "--pc-paper", hex: "#F0F1F2" },
  { name: "書框白", token: "--pc-sheet", hex: "#FFFFFF" },
  { name: "格線", token: "--pc-line", hex: "#DADDE2" },
  { name: "鉛筆灰", token: "--pc-ink-2", hex: "#565B66" },
  { name: "書名黑", token: "--pc-ink", hex: "#1A1C22" },
];

const SWATCHES = [
  { name: "封面藍", token: "--pc-blue", use: "主要按鈕、連結、已完成的進度。整個畫面裡最常被點的顏色。", hex: "#3F598D", second: "深色 #9AB1DF", ratio: "對白 6.9:1" },
  { name: "封面黃", token: "--pc-marker", use: "螢光筆：題目關鍵字、目前所在的關卡。上面的字永遠用書名黑。", hex: "#E1CF8E", second: "深色 #D3BE73", ratio: "只當底色" },
  { name: "封面綠", token: "--pc-leaf-fill", use: "答對、已完成。色塊用 #549C78，文字改用較深的 #32674D。", hex: "#549C78", second: "文字 #32674D", ratio: "文字對白 6.6:1" },
  { name: "珊瑚紅", token: "--pc-coral", use: "答錯、老師批註、獎勵章。色塊用 #D7968E，文字與印章用 #A24A3F。", hex: "#D7968E", second: "文字 #A24A3F", ratio: "文字對白 5.9:1" },
  { name: "琥珀", token: "--pc-amber", use: "提醒與需要關心：未開始、快截止。只出現在教師端。", hex: "#835B21", second: "深色 #D8AE6E", ratio: "對白 6.0:1" },
];

const SUPPORT = [
  { name: "天空藍", token: "--pc-sky", hex: "#79ADC3" },
  { name: "薰衣草", token: "--pc-lilac", hex: "#C1BEDA" },
  { name: "蜜桃", token: "--pc-peach", hex: "#E6CDB7" },
  { name: "薄荷", token: "--pc-mint", hex: "#B5D4BC" },
];

const SCALE = [
  { token: "展示", size: "44 / 36", style: "font:700 36px/1.3 var(--pc-font-text)", sample: "第二單元" },
  { token: "題目", size: "23 / 20", style: "font:400 23px/1.75 var(--pc-font-text)", sample: "哪一杯會讓藍色石蕊試紙變紅？" },
  { token: "標題", size: "22 / 18", style: "font:700 22px/1.4 var(--pc-font-ui)", sample: "本週作業" },
  { token: "內文", size: "18 / 15", style: "font:500 18px/1.75 var(--pc-font-ui)", sample: "白醋是酸性，會讓藍色石蕊試紙變紅。" },
  { token: "輔助", size: "14 / 13", style: "font:500 14px/1.6 var(--pc-font-ui);color:var(--pc-ink-2)", sample: "截止 11/14，還有 5 位同學未完成" },
  { token: "數字", size: "22 / 18", style: "font:800 22px/1.4 var(--pc-font-num);font-variant-numeric:tabular-nums", sample: "78%   24 / 29   1,280 分" },
];

const EVENTS = [
  { id: 1, tag: "座標", title: "選擇座標 (3, 4)", details: "定位於河流地形。" },
  { id: 2, tag: "推理", title: "說明探索原因", details: "這裡有水，古人需要喝水和抓魚，可能會在附近生活。" },
  { id: 3, tag: "挖掘", title: "決定挖掘", details: "選擇在座標 (3, 4) 挖掘。" },
  { id: 4, tag: "採集決策", title: "採集「打製石斧」", details: "表面有敲打的痕跡，像是用石頭做的工具。", delta: 10 },
  { id: 5, tag: "採集決策", title: "採集「青銅鈴」", details: "未補充理由", delta: -5 },
];

const MAPPING: [string, string][] = [
  ["Brand、.topbar、.nav、.demo-badge", "Brand、TopBar、DotLabel"],
  [".site-footer", "SiteFooter"],
  [".btn.primary / .outline / .ghost", "Button variant primary / secondary / quiet"],
  [".btn.large / .small / .full", "Button size lg / sm、block"],
  ["Tag green / cream / warm", "Chip tone leaf / amber / red"],
  ["SectionHeading、.page-top、.panel-heading", "SectionHeading size section / page / panel"],
  [".overline、.eyebrow（全大寫）", "SectionHeading 的 kicker（一般大小寫）"],
  [".field、.input-label、.label-helper", "TextField、TextArea、Select（hint、help、error）"],
  [".upload-area、.file-chip", "UploadArea、FileChip"],
  [".success-note、.publish-success、.inline-note、.sidebar-tip", "Notice tone success / info / neutral"],
  [".builder-step", "StepList"],
  [".journey-card", "JourneyCard"],
  [".path-card", "ChoiceCard"],
  [".chat-bubble、.student-echo、.assistant-head", "ChatBubble from qrio / student、AssistantHeader"],
  [".indicator、.mission-stats、.result-stat-grid", "Indicator、StatGroup"],
  [".hint-card、.evidence-clue", "ClueCard"],
  [".feedback-panel", "ScoreFeedback"],
  ["EventList", "EventList"],
  [".student-entry、.student-avatar", "StudentEntry、Avatar"],
  [".insight-card", "InsightCard"],
  [".empty-state、.empty-mini", "EmptyState"],
];

/* ---------- 版面小元件 ---------- */

function Block(props: { id: string; title: string; desc: string; children: JSX.Element }) {
  return (
    <section class="ov-block" id={props.id} aria-labelledby={`${props.id}-title`}>
      <div class="ov-block__head">
        <h2 id={`${props.id}-title`}>{props.title}</h2>
        <p>{props.desc}</p>
      </div>
      <div class="ov-block__body">{props.children}</div>
    </section>
  );
}

function Specimen(props: { title: string; note?: string; wide?: boolean; children: JSX.Element }) {
  return (
    <div class={`ov-spec${props.wide ? " ov-spec--wide" : ""}`}>
      <div class="ov-spec__head">
        <h3>{props.title}</h3>
        {props.note && <p>{props.note}</p>}
      </div>
      <div class="ov-spec__stage">{props.children}</div>
    </div>
  );
}

/* ---------- 頁面 ---------- */

export function Overview() {
  const [mode, setMode] = createSignal<"light" | "dark">("light");
  const [density, setDensity] = createSignal<Density>("student");
  const [picked, setPicked] = createSignal("C");
  const [reminded, setReminded] = createSignal(false);
  const [nav, setNav] = createSignal<"builder" | "student" | "evidence">("builder");
  const [step, setStep] = createSignal(1);
  const [path, setPath] = createSignal("river");
  const [files, setFiles] = createSignal(["五上社會_史前文化.pdf", "數學_座標與方位.docx", "自然_地形與水資源.pdf"]);
  const [code, setCode] = createSignal("K7Q2MP");
  const [insight, setInsight] = createSignal<ReviewStatus>("pending");
  const [student, setStudent] = createSignal("yu");

  const applyMode = (value: "light" | "dark") => {
    setMode(value);
    if (value === "dark") document.documentElement.setAttribute("data-mode", "dark");
    else document.documentElement.removeAttribute("data-mode");
  };

  const answerState = (key: string): AnswerState => {
    if (picked() !== key) return "idle";
    return OPTIONS.find((o) => o.key === key)!.right ? "right" : "wrong";
  };
  const pickedOption = () => OPTIONS.find((o) => o.key === picked())!;

  const sections = [
    ["principles", "原則"],
    ["color", "色彩"],
    ["type", "字體"],
    ["shape", "形狀"],
    ["faces", "符號臉"],
    ["basics", "基礎元件"],
    ["shell", "介面框架"],
    ["learning", "學習與遊戲"],
    ["evidence", "學習證據"],
    ["mapping", "對照表"],
  ];

  return (
    <div class="ov" lang="zh-Hant-TW">
      <header class="ov-top">
        <div class="ov-top__row">
          <div class="ov-top__title">
            <Brand />
            <span class="ov-top__name">鉛筆盒設計系統</span>
          </div>
          <div class="ov-top__controls">
            <SegmentedControl
              label="色彩模式"
              size="sm"
              value={mode()}
              onChange={applyMode}
              options={[
                { value: "light", label: "淺色" },
                { value: "dark", label: "深色" },
              ]}
            />
            <SegmentedControl
              label="元件密度"
              size="sm"
              value={density()}
              onChange={setDensity}
              options={[
                { value: "student", label: "學生端" },
                { value: "teacher", label: "教師端" },
              ]}
            />
          </div>
        </div>
        <nav class="ov-toc" aria-label="總覽目錄">
          <For each={sections}>{([id, label]) => <a href={`#${id}`}>{label}</a>}</For>
        </nav>
      </header>

      <main class="ov-main">
        {/* 開場：同一份教材的兩端 */}
        <section class="ov-hero" aria-labelledby="ov-hero-title">
          <div class="ov-hero__copy">
            <h1 id="ov-hero-title">
              像課本一樣可信，
              <br />
              像遊戲一樣好按。
            </h1>
            <p>
              鉛筆盒是 Textbook Gaming 給 K12 老師與學生共用的介面語言。顏色取自課本封面，飽和度壓到和 Qrio 原型相同的沉穩範圍；內容用宋體、介面用圓體；圓潤來自形狀與按壓的手感，不靠卡通圖案。
            </p>
            <dl class="ov-hero__legend">
              <div>
                <dt>學生端</dt>
                <dd>字大、按鈕有 3px 厚度、一次只做一件事</dd>
              </div>
              <div>
                <dt>教師端</dt>
                <dd>同一組顏色與圓角，密度更高、厚度降到 1px</dd>
              </div>
            </dl>
          </div>

          <div class="ov-hero__stage">
            <Card density="student" aria-label="學生端範例：闖關題目">
              <CardHeader aside="學生端">
                <Chip tone="blue">自然 五上</Chip>
                <Chip>水溶液的性質</Chip>
              </CardHeader>
              <LevelSteps total={8} current={3} />
              <p class="ov-question">
                小明把四杯水溶液滴在藍色石蕊試紙上，哪一杯會讓試紙<Highlight draw>變紅</Highlight>？
              </p>
              <AnswerGroup label="選項">
                <For each={OPTIONS}>
                  {(o) => (
                    <AnswerOption keyLabel={o.key} state={answerState(o.key)} onClick={() => setPicked(o.key)}>
                      {o.text}
                    </AnswerOption>
                  )}
                </For>
              </AnswerGroup>
              <Feedback tone={pickedOption().right ? "right" : "wrong"}>{pickedOption().say}</Feedback>
              <div class="ov-row ov-row--end">
                <Button>下一題</Button>
              </div>
            </Card>

            <Card density="teacher" aria-label="教師端範例：班級進度">
              <CardHeader aside="教師端">
                <div>
                  <h3 class="ov-card-title">五年二班</h3>
                  <p class="ov-card-sub">水溶液的性質，截止 11/14</p>
                </div>
              </CardHeader>
              <Stat label="完成人數" value="24" suffix="/ 29" progress={83} />
              <Stat label="平均答對率" value="78" suffix="%" progress={78} tone="leaf" />
              <div class="ov-note">
                <span class="ov-note__label">最多人答錯</span>
                <p class="ov-note__q">第 5 題：紅色石蕊試紙遇到肥皂水會變成什麼顏色？</p>
                <Chip tone="red">答對率 41%</Chip>
              </div>
              <div class="ov-note">
                <span class="ov-note__label">還沒完成的 5 位同學</span>
                <ul class="ov-roster">
                  <li>
                    <span class="ov-roster__who">
                      <Face expression="notStarted" size={26} />
                      陳O安
                    </span>
                    <Chip tone="amber">未開始</Chip>
                  </li>
                  <li>
                    <span class="ov-roster__who">
                      <Face expression="notStarted" size={26} />
                      林O妤
                    </span>
                    <Chip tone="amber">未開始</Chip>
                  </li>
                  <li>
                    <span class="ov-roster__who">
                      <Face expression="thinking" size={26} />
                      王O宇
                    </span>
                    <Chip tone="blue">進行中 3 / 8</Chip>
                  </li>
                </ul>
              </div>
              <Button
                block
                variant={reminded() ? "done" : "primary"}
                icon={reminded() ? <CheckIcon /> : undefined}
                onClick={() => setReminded(true)}
              >
                {reminded() ? "已提醒 5 位同學" : "提醒這 5 位同學"}
              </Button>
            </Card>
          </div>
        </section>

        <Block id="principles" title="設計原則" desc="做決定時回頭看這五條。">
          <ul class="ov-principles">
            <li>
              <h3>內容用宋，介面用圓</h3>
              <p>題目、課文、章節名用宋體，像課本和考卷上的印刷字，學生一眼就知道「這是要讀的」。按鈕、導覽、數字用圓體。</p>
            </li>
            <li>
              <h3>越大的東西越圓</h3>
              <p>圓角跟著層級走：標籤 6、輸入框 10、按鈕 14、卡片 22。不讓每個元件都一樣圓，畫面才有主次。</p>
            </li>
            <li>
              <h3>能按的東西有厚度</h3>
              <p>按鈕、選項、可點的卡片底部有一道實色厚度，按下去會沉。遊戲感來自手感，不靠插圖。</p>
            </li>
            <li>
              <h3>螢光筆只畫重點</h3>
              <p>黃色只標兩件事：題目裡的關鍵字，和「你現在在這裡」。不當背景、不當裝飾。</p>
            </li>
            <li>
              <h3>對錯不只靠顏色</h3>
              <p>答對答錯同時用顏色、圖示和一句說明表達。色弱的學生看得懂，投影到教室大螢幕也看得懂。</p>
            </li>
            <li>
              <h3>AI 的解讀交給老師決定</h3>
              <p>Qrio 整理出的目標與學習訊號都標明來源，並由老師接受、修正或拒絕。介面不替老師下結論。</p>
            </li>
          </ul>
        </Block>

        <Block id="color" title="色彩" desc="顏色取自課本封面：白色書框裡放一塊色塊。飽和度壓到 25–40%，與 Qrio 原型的鼠尾草綠同一個沉穩範圍。文字色對白色都在 4.5:1 以上。">
          <div>
            <div class="ov-ramp" aria-hidden="true">
              <For each={NEUTRALS}>{(n) => <div style={{ background: `var(${n.token})` }} />}</For>
            </div>
            <div class="ov-ramp-labels">
              <For each={NEUTRALS}>
                {(n) => (
                  <span>
                    {n.name}
                    <small>{n.hex}</small>
                  </span>
                )}
              </For>
            </div>
          </div>
          <div class="ov-swatches">
            <For each={SWATCHES}>
              {(s) => (
                <div class="ov-sw">
                  <div class="ov-sw__chip" style={{ background: `var(${s.token})` }} />
                  <div>
                    <h3>
                      {s.name} <code>{s.token}</code>
                    </h3>
                    <p>{s.use}</p>
                  </div>
                  <div class="ov-sw__hex">
                    {s.hex}
                    <br />
                    <em>{s.second}</em>
                    <br />
                    <em>{s.ratio}</em>
                  </div>
                </div>
              )}
            </For>
          </div>
          <div>
            <h3 class="ov-sub">
              輔助色<small>插畫、科目色塊、圖表分類用。顏色淺，不放小字。</small>
            </h3>
            <div class="ov-support">
              <For each={SUPPORT}>
                {(s) => (
                  <div>
                    <i style={{ background: `var(${s.token})` }} />
                    {s.name}
                    <small>{s.hex}</small>
                  </div>
                )}
              </For>
            </div>
          </div>
          <div>
            <h3 class="ov-sub">
              組合範例：單元卡<small>白色書框加一塊主色，輔助色只做圖形點綴。科目與顏色的對應待確認。</small>
            </h3>
            <div class="ov-grid-3">
              <UnitCard subject="國語" grade="五上" unit="第三課 走進大自然" tone="blue" />
              <UnitCard subject="數學" grade="五上" unit="第四單元 分數的加減" tone="yellow" />
              <UnitCard subject="自然" grade="五上" unit="第二單元 水溶液的性質" tone="green" />
            </div>
          </div>
        </Block>

        <Block id="type" title="字體" desc="兩套中文字各有角色，英文與數字交給 Nunito，讓分數和百分比對齊。">
          <div class="ov-grid-2">
            <div class="ov-type">
              <span class="ov-type__big" style={{ "font-family": "var(--pc-font-text)" }}>
                水溶液
              </span>
              <strong>思源宋體（Noto Serif TC），內容字</strong>
              <p>題目、課文、章節名、獎勵章。宋體是書本和考卷的字，讀長段文字時比圓體穩定。</p>
            </div>
            <div class="ov-type">
              <span class="ov-type__big" style={{ "font-family": "var(--pc-font-ui)", "font-weight": 700 }}>
                下一題
              </span>
              <strong>Chiron GoRound TC，介面字</strong>
              <p>按鈕、導覽、標籤、說明。筆畫末端是圓的，跟元件的圓角是同一種語氣。</p>
            </div>
          </div>
          <ul class="ov-scale">
            <For each={SCALE}>
              {(row) => (
                <li>
                  <span class="ov-scale__tok">{row.token}</span>
                  <span class="ov-scale__size pc-num">{row.size}</span>
                  <span class="ov-scale__sample" style={row.style}>
                    {row.sample}
                  </span>
                </li>
              )}
            </For>
          </ul>
          <p class="ov-footnote">字級寫法為「學生端 / 教師端」，單位 px。中文內文行高 1.75。</p>
        </Block>

        <Block id="shape" title="圓角、厚度與間距" desc="圓潤來自這三組數字。容器裡的元件圓角要比容器小，看起來才像放進去。">
          <div class="ov-radii">
            <For
              each={[
                ["--pc-r-xs", "6", "標籤", 44, 28],
                ["--pc-r-sm", "10", "輸入框", 72, 40],
                ["--pc-r-md", "14", "按鈕、選項", 96, 52],
                ["--pc-r-lg", "22", "卡片、面板", 132, 84],
                ["--pc-r-pill", "全圓", "進度條", 96, 14],
              ] as const}
            >
              {([token, value, use, w, h]) => (
                <div class="ov-radius">
                  <div style={{ width: `${w}px`, height: `${h}px`, "border-radius": `var(${token})` }} />
                  <b>{value}</b>
                  {use}
                </div>
              )}
            </For>
          </div>
          <div class="ov-grid-2">
            <div class="ov-thick pc-density-student">
              <Button>開始闖關</Button>
              <p>
                <b>學生端 3px</b>：按下時整顆往下沉，平板上手指也按得準。可點區域至少 52px。
              </p>
            </div>
            <div class="ov-thick pc-density-teacher">
              <Button>指派給全班</Button>
              <p>
                <b>教師端 1px</b>：保留一點立體感，但不搶資訊的注意力。可點區域至少 40px。
              </p>
            </div>
          </div>
          <div class="ov-spacing" aria-label="間距刻度">
            <For each={[4, 8, 12, 16, 24, 32, 48, 72]}>
              {(n) => (
                <span>
                  <i style={{ width: `${n}px`, height: `${n}px` }} />
                  {n}
                </span>
              )}
            </For>
          </div>
        </Block>

        <Block id="faces" title="符號臉" desc="用標點和數學符號拼成的表情圓。當學生頭像、作答狀態和空白頁插圖。表情只靠符號，不畫五官。">
          <ul class="ov-faces">
            <For each={Object.entries(FACE_EXPRESSIONS) as [FaceExpression, (typeof FACE_EXPRESSIONS)[FaceExpression]][]}>
              {([key, spec]) => (
                <li>
                  <Face expression={key} size={64} />
                  <b>{spec.name}</b>
                  <span>{spec.when}</span>
                </li>
              )}
            </For>
          </ul>
          <div class="ov-sizes">
            <For each={[26, 36, 52, 72, 120]}>
              {(n, i) => (
                <div>
                  <Face expression="right" size={n} />
                  <b class="pc-num">{n}</b>
                  {["名單", "留言、通知", "作答回饋", "個人頁", "結果頁"][i()]}
                </div>
              )}
            </For>
          </div>
          <EmptyState
            title="這個班級還沒有作業"
            description="從課本單元挑一關指派給五年二班，學生登入後就會看到。"
            action={
              <div class="pc-density-teacher">
                <Button>指派第一份作業</Button>
              </div>
            }
          />
        </Block>

        <div class={`pc-density-${density()}`}>
          <Block id="basics" title="基礎元件" desc="切換頁首的「學生端／教師端」看兩種密度。">
            <div class="ov-specs">
              <Specimen title="Button" note="primary、secondary、quiet、done；size sm、md、lg">
                <div class="ov-row">
                  <Button>送出答案</Button>
                  <Button variant="secondary">看提示</Button>
                  <Button variant="quiet">跳過這題</Button>
                </div>
                <div class="ov-row">
                  <Button size="lg">開始 120 秒探索</Button>
                  <Button size="sm" variant="secondary">
                    選擇檔案
                  </Button>
                  <Button variant="done" icon={<CheckIcon />}>
                    已發布
                  </Button>
                </div>
              </Specimen>
              <Specimen title="Chip" note="科目、單元、狀態">
                <div class="ov-row">
                  <Chip tone="blue">數學 七上</Chip>
                  <Chip>一元一次方程式</Chip>
                  <Chip tone="leaf" dot>
                    教師已確認
                  </Chip>
                  <Chip tone="amber" dot>
                    示範教材對應
                  </Chip>
                  <Chip tone="red" dot>
                    示範 AI 推論
                  </Chip>
                </div>
              </Specimen>
              <Specimen title="TextField、TextArea、Select" note="hint 在標籤旁，error 取代 help">
                <TextField id="ov-code" label="班級代碼" code value={code()} onInput={(e) => setCode(e.currentTarget.value)} error={code() === "K7Q2MP" ? "找不到班級 K7Q2MP，請再對一次老師給的 6 碼代碼。" : undefined} />
                <TextArea id="ov-intent" label="用一句話描述你的教學意圖" hint="會和教材一起交給 Qrio" rows={3} value="讓學生用座標與地形線索，推理石器時代人類的生活方式。" />
                <Select
                  id="ov-next"
                  label="後續教學建議"
                  placeholder="選擇一個下一步"
                  options={[
                    { value: "coord", label: "安排座標定位複習" },
                    { value: "compare", label: "小組比較文物與考古線索" },
                    { value: "extend", label: "設計下一輪延伸探險" },
                  ]}
                />
              </Specimen>
              <Specimen title="Notice" note="success、info、warning、neutral">
                <Notice>示範教學脈絡已準備好。接著請確認 Qrio 整理的學習目標。</Notice>
                <Notice tone="info">這裡展示的是預設情境，不會解析你選的教材。</Notice>
                <Notice tone="warning">還有 2 個學習目標沒有確認，確認後才能設計 Mission。</Notice>
                <Notice tone="neutral" title="Qrio 的提醒">
                  <p>任務的好壞，從清楚的教學目標開始。所有 AI 解讀都交由老師確認。</p>
                </Notice>
                <Notice title="Mission 已發布">
                  <p>學生連結已準備好。這是前端示範，不會建立真實班級任務。</p>
                  <TextField id="ov-share" label="學生連結" readonly value="https://qrio.example/mission/demo" />
                </Notice>
              </Specimen>
              <Specimen title="Toast">
                <Toast message="已提醒 5 位同學" actionLabel="復原" />
              </Specimen>
              <Specimen title="Stat、LevelSteps、SegmentedControl">
                <Stat label="完成人數" value="24" suffix="/ 29" progress={83} />
                <LevelSteps total={6} current={5} caption="正在第 5 關：移項" />
                <SegmentedControl
                  label="檢視方式"
                  value="class"
                  onChange={() => {}}
                  options={[
                    { value: "class", label: "全班" },
                    { value: "group", label: "小組" },
                    { value: "student", label: "個人" },
                  ]}
                />
              </Specimen>
              <Specimen title="StepList" note="真正有順序的流程才用數字">
                <StepList
                  label="建立 Mission 的步驟"
                  current={step()}
                  onSelect={setStep}
                  steps={[
                    { title: "教學起點", description: "教材與一句意圖" },
                    { title: "對齊學習目標", description: "來源與教師確認" },
                    { title: "設計 Mission", description: "路徑、檢查點、發布" },
                  ]}
                />
              </Specimen>
              <Specimen title="UploadArea、FileChip">
                <UploadArea
                  id="ov-upload"
                  title="加入教材文件"
                  description="可選多個 PDF、DOCX。示範只記錄檔名，不會讀取或上傳檔案內容。"
                  multiple
                  accept=".pdf,.doc,.docx,.txt"
                  onFiles={(list) => setFiles((prev) => [...prev, ...list.map((f) => f.name)])}
                />
                <div class="ov-row">
                  <For each={files()}>
                    {(name, i) => (
                      <FileChip
                        name={name}
                        note={i() < 3 ? "示範" : undefined}
                        onRemove={i() >= 3 ? () => setFiles((prev) => prev.filter((_, idx) => idx !== i())) : undefined}
                      />
                    )}
                  </For>
                </div>
              </Specimen>
            </div>
          </Block>

          <Block id="shell" title="介面框架" desc="整理自目前 Qrio 原型的頁首、頁尾與標題。標題上方的位置說明改用一般大小寫，不再全大寫。">
            <div class="ov-shell">
              <TopBar
                items={[
                  { value: "builder", label: "教師工作台" },
                  { value: "student", label: "學生體驗" },
                  { value: "evidence", label: "學習證據" },
                ]}
                current={nav()}
                onNavigate={setNav}
                status={<DotLabel>互動示範</DotLabel>}
              />
              <div class="ov-shell__body">
                <SectionHeading
                  size="page"
                  kicker="教師工作台"
                  title="把教材變成一場學習任務。"
                  description="三個步驟，從教學意圖走到學生可以參與的探索。"
                  aside={<Chip tone="red">示範模式</Chip>}
                />
                <SectionHeading size="section" kicker="步驟 2：對齊學習目標" title="老師，這是你想教的嗎？" description="這些是依示範教材整理的學習目標。你可以修改內容，再確認設計方向。" />
                <SectionHeading size="panel" kicker="原始學習紀錄" title="小宇的示範紀錄" description="座標、理由、提示、挖掘與採集決策" />
              </div>
              <SiteFooter tagline="從教學意圖，到有意義的任務。" meta={["Qrio 整合學習任務 原型 v0.3", "示範用，不是真實班級系統"]} />
            </div>
          </Block>

          <Block id="learning" title="學習與遊戲" desc="學生端的題目、選擇、對話與回饋。">
            <div class="ov-specs">
              <Specimen title="JourneyCard" note="整張可點，底部說明會去哪" wide>
                <div class="ov-grid-3">
                  <JourneyCard step={1} role="老師" icon="▤" title="建立 Mission" description="整合教材、確認學習目標，設計共同挑戰與多條路徑。" actionLabel="開啟任務設計" onClick={() => {}} />
                  <JourneyCard step={2} role="學生" icon="✧" title="展開探索" description="學生用座標找地點、解釋原因，再依文物線索做決定。" actionLabel="開始探險" onClick={() => {}} />
                  <JourneyCard step={3} role="老師" icon="◎" title="看見學習證據" description="保留推理與選擇，讓老師決定接下來的教學行動。" actionLabel="查看學習證據" onClick={() => {}} />
                </div>
              </Specimen>
              <Specimen title="ChoiceCard" note="一組只選一張" wide>
                <div class="ov-grid-3">
                  <ChoiceCard tone="sky" icon="≈" title="沿著河流" description="水源吸引人類與動物，從河邊開始找線索。" footnote="探索路徑：河流" selected={path() === "river"} onSelect={() => setPath("river")} />
                  <ChoiceCard tone="green" icon="♠" title="走進森林" description="狩獵與採集的資源，可能留下工具的痕跡。" footnote="探索路徑：森林" selected={path() === "forest"} onSelect={() => setPath("forest")} />
                  <ChoiceCard tone="lilac" icon="▲" title="登上高山" description="山地提供石材，觀察是否有加工的痕跡。" footnote="探索路徑：高山" selected={path() === "mountain"} onSelect={() => setPath("mountain")} />
                </div>
              </Specimen>
              <Specimen title="AnswerOption、Feedback">
                <AnswerGroup label="範例選項" columns={1}>
                  <AnswerOption keyLabel="A" state="right">
                    白醋
                  </AnswerOption>
                  <AnswerOption keyLabel="B" state="wrong">
                    肥皂水
                  </AnswerOption>
                  <AnswerOption keyLabel="C">食鹽水</AnswerOption>
                </AnswerGroup>
                <Feedback tone="wrong">肥皂水是鹼性，會讓紅色石蕊試紙變藍。</Feedback>
              </Specimen>
              <Specimen title="AssistantHeader、ChatBubble">
                <AssistantHeader name="Qrio 探險助手" description="示範回應，不是即時 AI" />
                <ChatBubble>
                  <p>
                    你選擇了<b>河流</b>。想像石器時代的人來到這裡，他們可能會做什麼？
                  </p>
                </ChatBubble>
                <ChatBubble from="student">
                  <p>這裡有水，古人需要喝水和抓魚，可能會在附近生活。</p>
                </ChatBubble>
              </Specimen>
              <Specimen title="Indicator、StatGroup">
                <div class="ov-row">
                  <Indicator label="分數" value="20" />
                  <Indicator label="剩餘時間" value="00:21" urgent />
                </div>
                <StatGroup
                  items={[
                    { value: "02:00", label: "探索時間" },
                    { value: "5 × 5", label: "座標地圖" },
                    { value: "3", label: "探索路徑" },
                  ]}
                />
              </Specimen>
              <Specimen title="ClueCard、ScoreFeedback">
                <ClueCard label="地形觀察" title="河流">
                  <p>水源可能吸引人類與動物活動。請搭配文物的材質和出土脈絡判斷年代。</p>
                </ClueCard>
                <ScoreFeedback delta={10} title="探索已記錄" summary="目前總分 20，已探索 3 格" action={<Button block>繼續尋找線索</Button>}>
                  這件出土物的示範年代是「舊石器時代」。表面敲打的痕跡是打製石器的特徵。
                </ScoreFeedback>
              </Specimen>
              <Specimen title="Highlight、Stamp">
                <p class="ov-question">
                  哪一種地形最可能找到<Highlight>打製石器</Highlight>？
                </p>
                <div class="ov-row">
                  <Stamp text="全對" />
                  <Stamp text="進步" size="sm" />
                </div>
              </Specimen>
            </div>
          </Block>

          <Block id="evidence" title="學習證據" desc="教師端檢視學生的原始紀錄，並決定是否採用 Qrio 的解讀。">
            <div class="ov-evidence">
              <Card>
                <SectionHeading size="panel" kicker="學生探索紀錄" title="選一位學生" />
                <div class="ov-stack-sm">
                  <StudentEntry avatar={<Avatar text="宇" color="green" />} name="小宇（示範紀錄）" meta="7 筆紀錄，+10 分" current={student() === "yu"} onClick={() => setStudent("yu")} />
                  <StudentEntry avatar={<Avatar text="安" color="peach" />} name="小安（示範紀錄）" meta="3 筆紀錄，推理中" current={student() === "an"} onClick={() => setStudent("an")} />
                  <StudentEntry avatar={<Face expression="default" size={36} />} name="我的示範探索" meta="還沒有紀錄" current={student() === "me"} onClick={() => setStudent("me")} />
                </div>
              </Card>
              <Card>
                <SectionHeading size="panel" kicker="原始學習紀錄" title="小宇的示範紀錄" description="座標、理由、提示、挖掘與採集決策" />
                <EventList items={EVENTS} />
              </Card>
              <InsightCard
                title="地理推理"
                description="學生的選點理由是否能連結地形、資源與人類活動？"
                goal="社會：地形與生活"
                quote="這裡有水，古人需要喝水和抓魚，可能會在附近生活。"
                evidenceCount={2}
                status={insight()}
                onDecide={setInsight}
              >
                {insight() === "edited" && <TextArea id="ov-insight-note" label="老師的修正" rows={2} placeholder="補充或修改這則解讀" />}
              </InsightCard>
            </div>
          </Block>
        </div>

        <Block id="mapping" title="對照表" desc="把 src/App.tsx 換成設計系統時，原本的 class 對應到哪個元件。">
          <div class="ov-table-wrap">
            <table class="ov-table">
              <thead>
                <tr>
                  <th scope="col">目前介面</th>
                  <th scope="col">設計系統元件</th>
                </tr>
              </thead>
              <tbody>
                <For each={MAPPING}>
                  {([from, to]) => (
                    <tr>
                      <td>
                        <code>{from}</code>
                      </td>
                      <td>{to}</td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
          <p class="ov-footnote">地圖格子（.map-grid、.tile）、地形圖例與首頁插畫屬於 Stone Age Explorer 的遊戲內容，沒有放進設計系統，換色時只需要改用 tokens。</p>
        </Block>
      </main>
    </div>
  );
}
