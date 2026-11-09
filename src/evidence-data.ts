// 學習證據：學生端記下的探索紀錄（意圖、座標修改、理由、決定），以及從紀錄找出迷思、建議程度的規則。
// 班級資料是示範用的固定情境；「我的示範探索」才是這次在網頁上的操作。
import { getTerrain, terrainInfo } from "./demo-data";

export type Point = { x: number; y: number };
/** draft：輸入框裡改過的座標；confirm：按下確認的座標，answer 是學生看到標記後的回答 */
export type CoordStep = { kind: "draft" | "confirm"; x: number; y: number; answer?: "same" | "fix" };
export type TripArtefact = { name: string; era: string; target: boolean; material: string };
/** 一個探索地點：先點想去的地方（intent），再輸入座標、說明理由、挖掘、判斷文物 */
export type Trip = { intent: Point; coords: CoordStep[]; reason?: string; dig?: boolean; artefact?: TripArtefact; collect?: boolean; collectReason?: string };
export type StudentRecord = { id: string; name: string; trips: Trip[]; live?: boolean };

export type Level = "未達" | "接近" | "達成" | "超越";
export const levels: Level[] = ["未達", "接近", "達成", "超越"];
export type SubjectKey = "math" | "social";

export const evidenceGoals: { id: SubjectKey; name: string; goal: string }[] = [
  { id: "math", name: "數學", goal: "學生能夠用座標在地圖上定位地點，並在定位錯誤時修正" },
  { id: "social", name: "社會", goal: "學生能夠根據文物線索判斷文物是否屬於石器時代，並說明理由" },
];

/** 迷思的短名稱，用在標籤上；完整敘述在課前規劃 */
export const misconceptionLabels: Record<string, { subject: SubjectKey; short: string; text: string }> = {
  "mc-m1": { subject: "math", short: "X、Y 顛倒", text: "把 X、Y 的順序顛倒" },
  "mc-m2": { subject: "math", short: "Y 軸數反", text: "以為 Y 軸是由上往下數" },
  "mc-m3": { subject: "math", short: "差一格", text: "把格子當成格線來數，位置差一格" },
  "mc-m4": { subject: "math", short: "沒對照地圖", text: "輸入座標後不對照地圖就直接行動" },
  "mc-s1": { subject: "social", short: "有陶器就不是石器時代", text: "以為有陶器或農耕痕跡就一定不是石器時代" },
  "mc-s2": { subject: "social", short: "石頭做的就是石器時代", text: "以為所有石頭做的東西都屬於石器時代" },
  "mc-s3": { subject: "social", short: "地形決定年代", text: "以為地形可以直接決定文物的年代" },
  "mc-s4": { subject: "social", short: "只看一個線索", text: "只看一個線索就下判斷" },
};

export const same = (a: Point, b: Point) => a.x === b.x && a.y === b.y;
export const fmt = (p: Point) => `(${p.x}, ${p.y})`;
export const terrainName = (p: Point) => terrainInfo[getTerrain(p.x, p.y)].name;

/** 輸入的座標和想去的地方比，看是哪一種錯 */
function classify(p: Point, intent: Point): "ok" | "mc-m1" | "mc-m2" | "mc-m3" | "other" {
  if (same(p, intent)) return "ok";
  if (p.x === intent.y && p.y === intent.x) return "mc-m1";
  if (p.x === intent.x && p.y === 6 - intent.y) return "mc-m2";
  if (Math.abs(p.x - intent.x) + Math.abs(p.y - intent.y) === 1) return "mc-m3";
  return "other";
}

/** 理由裡用到了哪幾類線索 */
function clueKinds(reason = "") {
  const kinds = new Set<string>();
  if (/石頭|石材|材質|骨|陶|金屬|塑膠|玻璃/.test(reason)) kinds.add("材質");
  if (/痕|敲|磨|修整|加工|孔|手工|捏/.test(reason)) kinds.add("加工");
  if (/一起|出土|地層|聚落|旁邊|伴/.test(reason)) kinds.add("出土");
  if (/年份|條碼|工廠|製造|印/.test(reason)) kinds.add("製造");
  return kinds;
}

export type TripSignals = { mcs: string[]; fixed: boolean; mathOk: boolean; socialOk: boolean; other: boolean };

export function analyzeTrip(trip: Trip): TripSignals {
  const out: TripSignals = { mcs: [], fixed: false, mathOk: false, socialOk: false, other: false };
  const confirms = trip.coords.filter(c => c.kind === "confirm");
  const last = confirms[confirms.length - 1];
  if (last) {
    const wrong = trip.coords.map(c => classify(c, trip.intent)).find(k => k !== "ok");
    if (!wrong) out.mathOk = true;
    else {
      if (wrong === "other") out.other = true; else out.mcs.push(wrong);
      if (same(last, trip.intent)) out.fixed = true;
      else if (last.answer === "same") out.mcs.push("mc-m4");
    }
  }
  if (trip.reason && /一定/.test(trip.reason)) out.mcs.push("mc-s3");
  if (trip.artefact && trip.collect !== undefined) {
    const a = trip.artefact, reason = trip.collectReason ?? "";
    const right = trip.collect === a.target;
    if (a.target && !trip.collect && /陶/.test(a.name + reason)) out.mcs.push("mc-s1");
    else if (!a.target && trip.collect && /石/.test(a.material) && /石頭|石材/.test(reason)) out.mcs.push("mc-s2");
    else if (right && trip.collect && clueKinds(reason).size <= 1) out.mcs.push("mc-s4");
    else if (right) out.socialOk = true;
  }
  return out;
}

export type StudentSummary = { mcs: Record<string, { count: number; fixed: number }>; levels: Record<SubjectKey, Level | null>; unresolved: number; other: { trip: number; intent: Point; typed: Point }[] };

export function summarize(record: StudentRecord): StudentSummary {
  const mcs: StudentSummary["mcs"] = {};
  const other: StudentSummary["other"] = [];
  let mathTrips = 0, wrongTrips = 0, fixedTrips = 0, unnoticed = 0, decisions = 0, right = 0, rich = 0;
  record.trips.forEach((trip, i) => {
    const s = analyzeTrip(trip);
    s.mcs.forEach(id => {
      const entry = (mcs[id] ??= { count: 0, fixed: 0 });
      entry.count++;
      if (s.fixed && id !== "mc-m4" && misconceptionLabels[id].subject === "math") entry.fixed++;
    });
    if (s.other) {
      const typed = trip.coords.find(c => classify(c, trip.intent) === "other");
      if (typed) other.push({ trip: i, intent: trip.intent, typed });
    }
    if (trip.coords.some(c => c.kind === "confirm")) {
      mathTrips++;
      if (!s.mathOk) wrongTrips++;
      if (s.fixed) fixedTrips++;
      if (s.mcs.includes("mc-m4")) unnoticed++;
    }
    if (trip.artefact && trip.collect !== undefined) {
      decisions++;
      if (trip.collect === trip.artefact.target) { right++; if (clueKinds(trip.collectReason).size >= 2) rich++; }
    }
  });
  const math: Level | null = !mathTrips ? null : !wrongTrips ? (mathTrips >= 3 ? "超越" : "達成") : !unnoticed ? "達成" : fixedTrips ? "接近" : "未達";
  const social: Level | null = !decisions ? null : right === decisions ? (rich === decisions && decisions >= 2 ? "超越" : "達成") : right ? "接近" : "未達";
  const unresolved = Object.values(mcs).reduce((n, m) => n + (m.count - m.fixed), 0);
  return { mcs, levels: { math, social }, unresolved, other };
}

/* ---------- 示範班級 ---------- */

const A: Record<string, TripArtefact> = {
  flake: { name: "打製石片工具", era: "舊石器時代", target: true, material: "石材" },
  scraper: { name: "石製刮削器", era: "舊石器時代", target: true, material: "石材" },
  axe: { name: "磨製石斧", era: "新石器時代", target: true, material: "石材" },
  pot: { name: "手製陶罐", era: "新石器時代", target: true, material: "陶土" },
  quern: { name: "近代石磨", era: "近現代", target: false, material: "石材" },
  coin: { name: "近代硬幣", era: "近現代", target: false, material: "金屬" },
  needle: { name: "骨針", era: "石器時代", target: true, material: "動物骨" },
};

/** 數學：想去哪裡、輸入了什麼。c=確認後說是這裡，f=確認後要修改，d=輸入框裡改過 */
const M: Record<string, [Point, string]> = {
  ok: [{ x: 4, y: 2 }, "c4,2"],
  ok2: [{ x: 3, y: 3 }, "c3,3"],
  ok3: [{ x: 5, y: 4 }, "c5,4"],
  swapFix: [{ x: 4, y: 1 }, "f1,4 c4,1"],
  swapDraft: [{ x: 5, y: 2 }, "d2,5 c5,2"],
  swapMiss: [{ x: 5, y: 3 }, "c3,5"],
  flipFix: [{ x: 2, y: 4 }, "f2,2 c2,4"],
  flipMiss: [{ x: 3, y: 4 }, "c3,2"],
  offFix: [{ x: 4, y: 3 }, "f4,4 c4,3"],
  offMiss: [{ x: 2, y: 3 }, "c2,4"],
  other: [{ x: 1, y: 1 }, "c3,4"],
};

/** 社會：找到什麼、怎麼決定、理由 */
const S: Record<string, [TripArtefact, boolean, string]> = {
  good: [A.flake, true, "邊緣有敲擊的痕跡，旁邊還有石屑"],
  axe: [A.axe, true, "刃部有磨過的痕跡，又在聚落的地層裡"],
  potGood: [A.pot, true, "是手工捏的，而且在新石器聚落層出土"],
  needle: [A.needle, true, "骨頭上有穿線的孔，和其他石器一起出土"],
  coin: [A.coin, false, "上面有年份，是近代做的"],
  one: [A.scraper, true, "是石頭做的"],
  pot: [A.pot, false, "有陶器所以比較晚"],
  quern: [A.quern, true, "是石頭做的"],
};

const R = { ok: "河邊有水，古人可能在這裡生活", forest: "森林可以打獵和找食物", sure: "河邊一定有石器時代的東西", stone: "山上有很多石頭可以做工具" };

const roster: [string, string][] = [
  ["小宇", "swapFix:good:ok|ok:pot:ok|ok2:coin:forest"],
  ["小安", "flipMiss:one:sure|flipMiss:quern:ok"],
  ["子晴", "ok:good:ok|ok2:axe:forest|ok3:potGood:stone"],
  ["宥廷", "flipFix:pot:ok|ok:good:ok|ok2:coin:ok"],
  ["品妍", "swapDraft:one:ok|ok:coin:forest|ok2:good:ok"],
  ["柏翰", "flipMiss:quern:sure|flipMiss:pot:ok|swapMiss:one:ok"],
  ["語彤", "ok:axe:ok|offFix:good:forest|ok2:coin:ok"],
  ["承恩", "swapMiss:pot:sure|ok:one:ok|ok2:quern:ok"],
  ["芊妤", "ok:good:ok|ok2:needle:ok|ok3:axe:forest"],
  ["冠廷", "flipFix:one:ok|ok:pot:ok|ok2:good:ok"],
  ["思妤", "offMiss:good:ok|ok:coin:stone|ok2:one:ok"],
  ["宇恩", "other:quern:ok|ok:good:ok|ok2:pot:ok"],
  ["可欣", "ok:potGood:ok|ok2:good:forest|ok3:coin:ok"],
  ["昱辰", "flipMiss:good:ok|flipFix:one:sure|ok:coin:ok"],
  ["詠晴", "swapFix:axe:ok|ok:good:ok|ok2:coin:ok"],
  ["家豪", "flipMiss:quern:ok|ok:pot:ok"],
  ["若晞", "ok:one:ok|ok2:good:ok|ok3:coin:ok"],
  ["彥廷", "offFix:pot:forest|ok:good:ok|ok2:axe:ok"],
  ["芷涵", "swapDraft:good:ok|ok:potGood:ok|ok2:needle:ok"],
  ["宸睿", "flipFix:coin:ok|ok:one:ok|ok2:good:stone"],
  ["予樂", "offMiss:one:sure|ok:quern:ok|ok2:good:ok"],
  ["書瑜", "ok:good:ok|ok2:pot:ok|ok3:axe:ok"],
  ["浩宇", "other:good:ok|flipMiss:one:ok|ok:coin:ok"],
  ["沛晴", "ok:axe:forest|ok2:coin:ok|ok3:good:ok"],
  ["睿哲", "swapFix:one:ok|ok:good:ok|ok2:pot:ok"],
  ["欣妍", "flipFix:good:ok|ok:coin:ok|ok2:axe:ok"],
];

function buildTrip(spec: string): Trip {
  const [m, s, r] = spec.split(":");
  const [intent, coords] = M[m];
  const steps: CoordStep[] = coords.split(" ").map(token => {
    const [x, y] = token.slice(1).split(",").map(Number);
    const kind = token[0] === "d" ? "draft" : "confirm";
    return { kind, x, y, answer: token[0] === "c" ? "same" : token[0] === "f" ? "fix" : undefined };
  });
  const [artefact, collect, collectReason] = S[s];
  return { intent, coords: steps, reason: R[r as keyof typeof R], dig: true, artefact, collect, collectReason };
}

export const classRecords: StudentRecord[] = roster.map(([name, spec], i) => ({ id: "s" + (i + 1), name, trips: spec.split("|").map(buildTrip) }));
