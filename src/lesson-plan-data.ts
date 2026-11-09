// 課前工作臺的示範資料與規則：週五跨科課（數學座標 × 社會石器時代）。
// 課綱只寫學習階段與條目內容，正式代碼待對照 108 課綱原文後補上。

export type SubjectId = "math" | "social";
export type Source = "教材" | "Qrio 推論" | "上週班級";

export type Subject = { id: SubjectId; name: string; unit: string; teacher: string; keywords: string[]; condition: string; degree: string; placeholder: string };

export const subjects: Subject[] = [
  { id: "math", name: "數學", unit: "座標", teacher: "王老師", keywords: ["座標", "位置", "地圖", "格"],
    condition: "在地圖上", degree: "並在定位錯誤時修正", placeholder: "例如：用座標在地圖上找出指定的地點" },
  { id: "social", name: "社會", unit: "石器時代", teacher: "林老師", keywords: ["石器", "文物", "史前", "遺址", "工具", "年代", "出土"],
    condition: "根據文物線索", degree: "並說明理由", placeholder: "例如：根據文物線索判斷它屬於哪個時代" },
];

export const materials: { subject: SubjectId; name: string }[] = [
  { subject: "math", name: "五年級數學－座標.pdf" },
  { subject: "math", name: "數學教師手冊－座標單元.pdf" },
  { subject: "social", name: "社會－石器時代.pdf" },
  { subject: "social", name: "社會教師手冊－史前文化.pdf" },
];

/* ---------- 108 課綱 ---------- */

export type CurriculumEntry = { id: string; subject: SubjectId; kind: "學習表現" | "學習內容"; text: string; source?: string; core?: boolean };

export const curriculum: CurriculumEntry[] = [
  { id: "cm-1", subject: "math", kind: "學習表現", text: "能用一組數對描述平面上的位置，並依數對找到位置。", source: "課本 p.12–15", core: true },
  { id: "cm-2", subject: "math", kind: "學習內容", text: "平面上的位置：以橫軸、縱軸的數對表示位置。", source: "課本 p.12", core: true },
  { id: "cm-3", subject: "math", kind: "學習內容", text: "方位與距離：描述兩地的相對位置。", source: "教師手冊 p.8" },
  { id: "cs-1", subject: "social", kind: "學習表現", text: "能根據資料與證據，說明人類活動與自然環境的關係。", source: "課本 p.30–33", core: true },
  { id: "cs-2", subject: "social", kind: "學習內容", text: "史前人類的生活方式、工具與居住環境。", source: "課本 p.30", core: true },
  { id: "cs-3", subject: "social", kind: "學習內容", text: "考古發現與判斷年代的方法。", source: "教師手冊 p.21" },
];

/** 老師可以自己搜尋加入的條目（示範用的小範圍目錄） */
export const curriculumCatalog: CurriculumEntry[] = [
  { id: "cm-4", subject: "math", kind: "學習內容", text: "以數對表示格子點的位置。" },
  { id: "cm-5", subject: "math", kind: "學習表現", text: "能在生活情境中運用座標解決問題。" },
  { id: "cs-4", subject: "social", kind: "學習內容", text: "臺灣史前文化的分布與特色。" },
  { id: "cs-5", subject: "social", kind: "學習表現", text: "能比較不同時代人們的生活方式。" },
];

/* ---------- 學習目標的動詞（依 Bloom 分層） ---------- */

export const bloomLevels: { level: string; verbs: string[] }[] = [
  { level: "記憶與理解", verbs: ["說出", "辨認", "舉例"] },
  { level: "應用", verbs: ["使用", "定位", "計算"] },
  { level: "分析", verbs: ["比較", "分類", "找出"] },
  { level: "評鑑", verbs: ["判斷", "檢核", "說明"] },
  { level: "創造", verbs: ["設計", "規劃", "提出"] },
];

export const recommendedVerbs: Record<SubjectId, string[]> = {
  math: ["定位", "使用", "找出", "比較", "判斷"],
  social: ["辨認", "比較", "找出", "判斷", "說明"],
};

export const vagueVerbs = ["了解", "知道", "認識", "熟悉", "理解", "體會", "學會"];
const allVerbs = bloomLevels.flatMap(l => l.verbs);

export const bloomOf = (verb: string) => bloomLevels.find(l => l.verbs.includes(verb))?.level ?? "";

/** 句子裡第一個出現的可觀察動詞 */
export function detectVerb(text: string): string | undefined {
  return allVerbs.map(v => [v, text.indexOf(v)] as const).filter(([, i]) => i >= 0).sort((a, b) => a[1] - b[1])[0]?.[0];
}

export const detectVague = (text: string) => vagueVerbs.find(v => text.includes(v));

export const goalReady = (text: string) => text.trim().length >= 6 && !!detectVerb(text) && !detectVague(text);

const templates: Record<SubjectId, Record<string, string[]>> = {
  math: {
    定位: ["輸入 X、Y 座標，在地圖上定位到指定的地點", "依照座標在地圖上定位，並在定位錯誤時修正"],
    使用: ["使用座標描述地圖上兩個地點的位置", "使用座標在地圖上標出自己想去的地點"],
    找出: ["用座標在地圖上找出符合條件的地點", "用座標在地圖上找出至少兩個合理的探索地點"],
    比較: ["比較兩組座標，說出哪個地點離河流比較近", "比較不同座標的位置，找出最適合的地點"],
    判斷: ["判斷一組座標是否對應到想去的地形", "判斷自己輸入的座標是否正確，並在錯誤時修正"],
  },
  social: {
    辨認: ["辨認出土物的材質與加工痕跡", "從文物線索中辨認石器時代的工具"],
    比較: ["比較兩件出土物的材質與加工方式，說出哪一件比較早", "比較不同地形提供的資源，說明史前人類為什麼住在那裡"],
    找出: ["根據地形與資源，找出史前人類可能生活的地點", "從文物線索中找出能判斷年代的證據"],
    判斷: ["根據材質與加工痕跡，判斷出土物是否屬於石器時代", "根據文物線索判斷年代，並說明理由"],
    說明: ["說明史前人類選擇居住地點的原因", "說明自己判斷文物年代的理由"],
  },
};

const fallback: Record<SubjectId, string> = { math: "座標所表示的位置", social: "史前人類的生活與工具" };

const reasons: Record<string, string> = {
  定位: "「定位」看得到學生能不能把座標對應到地圖上的位置。",
  使用: "「使用」看得到學生能不能把座標用在描述位置上。",
  找出: "「找出」需要學生從多個選項中挑選，看得出是否真的會運用所學。",
  比較: "「比較」需要學生同時看兩個以上的對象，屬於分析層次。",
  判斷: "「判斷」需要學生做決定並有依據，屬於評鑑層次。",
  說明: "「說明」看得到學生能不能用自己的話講出理由。",
  辨認: "「辨認」適合確認學生是否認得關鍵特徵，屬於理解層次。",
};

/** 點動詞時，依文字框目前的內容給一句建議 */
export function suggestGoal(subject: SubjectId, verb: string, text: string, variant: number): { text: string; reason: string } {
  const why = reasons[verb] ?? `「${verb}」屬於 Bloom 的${bloomOf(verb)}層次，是看得到的學生行為。`;
  const current = text.trim();
  const options = templates[subject][verb] ?? [verb + fallback[subject]];
  if (!current) return { text: options[variant % options.length], reason: "依這一科勾選的課綱起草。" + why };
  // 有內容時，先挑和老師的字最接近的寫法，再依「換一個」輪替
  const overlap = (option: string) => [...new Set(option)].filter(ch => current.includes(ch)).length;
  const others = options.filter(o => o !== current);
  const ranked = (others.length ? others : options).sort((a, b) => overlap(b) - overlap(a));
  const existing = detectVerb(current);
  const lead = existing && existing !== verb ? `依你寫的內容，把「${existing}」改成「${verb}」。` : "依你寫的內容補成完整的句子。";
  return { text: ranked[variant % ranked.length], reason: lead + why };
}

/* ---------- 引導檢查（右側 Qrio 的固定腳本） ---------- */

export type GoalCheck = { question: string; ok: boolean; result: string };

export function checkGoal(subject: Subject, text: string): GoalCheck[] {
  const verb = detectVerb(text);
  const vague = detectVague(text);
  const keyword = subject.keywords.find(k => text.includes(k));
  const hasCondition = /在|根據|依|從|用/.test(text.replace(verb ?? "", ""));
  const hasDegree = /並|正確|至少|理由|修正|兩個|三個/.test(text);
  const recs = recommendedVerbs[subject.id].slice(0, 3).join("、");
  return [
    { question: "學生要做的動作是什麼？", ok: !!verb && !vague,
      result: vague ? `「${vague}」看不到學生的行為，建議換成「${recs}」這類動詞。` : verb ? `「${verb}」看得到學生的動作，屬於 Bloom 的${bloomOf(verb)}層次。` : `還沒有看到動詞，可以從「${recs}」選一個。` },
    { question: "要學的內容是什麼？", ok: !!keyword,
      result: keyword ? `有寫到這堂課的內容「${keyword}」。` : `還沒寫到這堂課的內容，例如「${subject.keywords[0]}」。` },
    { question: "在什麼條件下做？", ok: hasCondition,
      result: hasCondition ? "有說明學生在什麼條件下做。" : `可以補上條件，例如「${subject.condition}」。` },
    { question: "做到什麼程度算會了？", ok: hasDegree,
      result: hasDegree ? "有寫出要做到的程度。" : `可以補上程度，例如「${subject.degree}」。` },
  ];
}

export function rewriteGoal(subject: Subject, text: string): string {
  if (checkGoal(subject, text).every(c => c.ok)) return text.trim();
  const verb = detectVerb(text) && !detectVague(text) ? detectVerb(text)! : recommendedVerbs[subject.id][0];
  const options = templates[subject.id][verb];
  return options ? options[options.length - 1] : `${subject.condition}${verb}${fallback[subject.id]}，${subject.degree}`;
}

/* ---------- 知識點與迷思 ---------- */

export type Misconception = { id: string; text: string; source: Source; behavior: string; response: string };
export type KnowledgePoint = { id: string; subject: SubjectId; text: string; misconceptions: Misconception[] };

export const knowledgePoints: KnowledgePoint[] = [
  { id: "kp-m1", subject: "math", text: "座標用 (X, Y) 表示，先讀橫軸再讀縱軸。", misconceptions: [
    { id: "mc-m1", text: "把 X、Y 的順序顛倒", source: "教材", behavior: "想去河邊 (4, 2)，卻輸入 (2, 4)，挖到森林。", response: "標記落在別的地形，學生要自己對照地圖發現。" },
    { id: "mc-m2", text: "以為 Y 軸是由上往下數", source: "上週班級", behavior: "輸入的 Y 越大，以為地點越往下，常定位到上下相反的位置。", response: "標記出現在上下顛倒的位置。" },
  ] },
  { id: "kp-m2", subject: "math", text: "數座標時數的是格線上的點，不是格子。", misconceptions: [
    { id: "mc-m3", text: "把格子當成格線來數，位置差一格", source: "Qrio 推論", behavior: "定位標記常落在想去地點的隔壁一格。", response: "地形描述和學生的預期不同。" },
  ] },
  { id: "kp-m3", subject: "math", text: "可以用座標描述、檢查並修正位置。", misconceptions: [
    { id: "mc-m4", text: "輸入座標後不對照地圖就直接行動", source: "Qrio 推論", behavior: "輸入座標後沒看地圖就挖掘，挖錯也沒有發現。", response: "必須先在地圖上確認標記，才能開始挖掘。" },
  ] },
  { id: "kp-s1", subject: "social", text: "石器時代的人以石器為主要工具，晚期也開始農耕與製陶。", misconceptions: [
    { id: "mc-s1", text: "以為有陶器或農耕痕跡就一定不是石器時代", source: "教材", behavior: "留下新石器時代的陶片，理由寫「有陶器所以比較晚」。", response: "年代揭示時說明新石器時代已經開始製陶。" },
    { id: "mc-s2", text: "以為所有石頭做的東西都屬於石器時代", source: "上週班級", behavior: "採集近代的石磨，理由只寫「是石頭做的」。", response: "回饋指出加工方式與年代的差別。" },
  ] },
  { id: "kp-s2", subject: "social", text: "人類選擇居住地點，和水源、食物與石材等資源有關。", misconceptions: [
    { id: "mc-s3", text: "以為地形可以直接決定文物的年代", source: "Qrio 推論", behavior: "選點理由寫「河邊一定有石器時代的東西」。", response: "地形回饋只談生活需求，年代要靠出土物判斷。" },
  ] },
  { id: "kp-s3", subject: "social", text: "判斷年代需要材質、加工痕跡與出土脈絡等多項證據。", misconceptions: [
    { id: "mc-s4", text: "只看一個線索就下判斷", source: "教材", behavior: "判斷理由只提到材質，沒有提到加工痕跡。", response: "文物卡同時列出材質與加工痕跡。" },
  ] },
];

export const defaultSelected = ["mc-m1", "mc-m2", "mc-s1", "mc-s2"];

/* ---------- 挑戰提案（在專題主題之下） ---------- */

export type Challenge = { id: string; name: string; desc: string; playable: boolean };

export function proposeChallenges(theme: string): Challenge[] {
  const t = theme.trim();
  if (!t) return [
    { id: "c-1", name: "考古探險家", desc: "用座標選地點挖掘，再依文物線索決定要不要採集。", playable: true },
    { id: "c-2", name: "史前聚落選址", desc: "用座標替部落選三個落腳處，說明水源與資源的取捨。", playable: false },
    { id: "c-3", name: "博物館策展人", desc: "依線索把出土物排進展櫃，並用座標標出出土地點。", playable: false },
  ];
  if (t.includes("野外求生")) return [
    { id: "c-1", name: "求生營地考古隊", desc: "在求生營地附近用座標探勘，判斷挖到的東西屬於哪個時代、能不能幫助生存。", playable: true },
    { id: "c-2", name: "迷路的探險隊", desc: "用座標回報營地位置，並學石器時代的人從地形找水源與石材。", playable: false },
    { id: "c-3", name: "史前求生指南", desc: "從出土工具推論史前人怎麼求生，再用座標標出求生資源的位置。", playable: false },
  ];
  return [
    { id: "c-1", name: `${t}考古隊`, desc: `在「${t}」的情境中用座標探勘，再依文物線索判斷年代。`, playable: true },
    { id: "c-2", name: `${t}資源地圖`, desc: `用座標標出「${t}」需要的資源，並說明史前人類怎麼取得。`, playable: false },
    { id: "c-3", name: `${t}時光任務`, desc: `回到石器時代完成「${t}」的任務，用座標與線索做決定。`, playable: false },
  ];
}

/* ---------- 試玩與發布 ---------- */

export const selfChecks = [
  "以學生身分完整玩過一次",
  "故意輸入顛倒的座標，確認會看到後果",
  "採集一件非石器時代的文物，確認回饋合理",
  "在平板或手機尺寸操作過",
];

export type FeedbackKind = "我喜歡" | "我好奇" | "建議";
export type Feedback = { id: number; author: string; kind: FeedbackKind; text: string; status: "open" | "adopted" | "kept" };

export const defaultFeedback: Feedback[] = [
  { id: 1, author: "王老師", kind: "我喜歡", text: "輸入錯座標就會挖到別的地形，這個後果很直接，學生會自己想回去檢查。", status: "open" },
  { id: 2, author: "王老師", kind: "建議", text: "地圖格線的數字太小，五年級的學生可能看不出 Y 軸是從下往上數。", status: "open" },
  { id: 3, author: "陳老師", kind: "我好奇", text: "如果學生連續挖到非石器時代的東西，會不會很挫折？第二次的提示可以更明顯嗎？", status: "open" },
];

export const defaultReviewers = [
  { name: "王老師", note: "共備 · 已試玩" },
  { name: "陳老師", note: "自然 · 已試玩" },
  { name: "張老師", note: "五年級導師 · 已邀請" },
];
