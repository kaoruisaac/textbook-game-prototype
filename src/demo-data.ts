export type Terrain = "river" | "plain" | "swamp" | "forest" | "mountain";
export type Phase = "select" | "reason" | "hint" | "discover" | "collect" | "feedback";
export type EventType = "coordinate_selected" | "reasoning_submitted" | "hint_displayed" | "excavation_decision" | "artefact_discovered" | "collection_decision" | "score_updated" | "game_finished";
export type GameEvent = { id: number; type: EventType; label: string; details: string; time: string; coordinate?: string; scoreDelta?: number };
export type Artefact = { name: string; era: string; target: boolean; material: string; clue: string; feedback: string };
export type Site = { x: number; y: number; artefact: Artefact };
export const terrainInfo: Record<Terrain, { name: string; symbol: string; hint: string; caption: string }> = {
  river: { name: "河流", symbol: "≈", caption: "水源與人類活動", hint: "水源可能吸引人類與動物活動；請搭配文物的材質和出土脈絡判斷年代。" },
  plain: { name: "平原", symbol: "✳", caption: "聚落與活動空間", hint: "平坦地形有利於行走與生活，不同年代的人都可能來到這裡。文物年代仍需要其他證據。" },
  swamp: { name: "沼澤", symbol: "≋", caption: "潮濕的低地", hint: "潮濕的環境可能保存某些活動痕跡；也可能使物件的辨識變得困難。" },
  forest: { name: "森林", symbol: "♠", caption: "狩獵與採集", hint: "森林可能提供採集與狩獵資源，但無法只靠地形推定物品屬於哪個時期。" },
  mountain: { name: "高山", symbol: "▲", caption: "石材與地勢", hint: "山地可提供石材，也可能限制行動。請觀察是否有加工痕跡及可信的考古線索。" }
};
export const grid: Terrain[][] = [
  ["forest", "mountain", "forest", "plain", "river"],
  ["plain", "forest", "river", "river", "plain"],
  ["forest", "swamp", "river", "river", "plain"],
  ["forest", "mountain", "river", "plain", "plain"],
  ["mountain", "forest", "swamp", "plain", "plain"],
];
export const sites: Site[] = [
  { x: 3, y: 4, artefact: { name: "打製石片工具", era: "史前石器時代（示範）", target: true, material: "石材", clue: "石片邊緣可見規律的剝片痕跡，附近伴隨其他石屑。", feedback: "加工痕跡與相伴出土物可支持史前石製工具的假設。" } },
  { x: 5, y: 1, artefact: { name: "近代硬幣", era: "近現代（示範）", target: false, material: "金屬", clue: "幣面可辨識近代文字與機器鑄造的規整線條。", feedback: "可辨識的近代字樣是排除石器時代的重要線索。" } },
  { x: 2, y: 5, artefact: { name: "石製刮削器", era: "史前石器時代（示範）", target: true, material: "石材", clue: "石刃有重複修整的邊緣，旁邊伴隨打製石片。", feedback: "規律修整的刃緣及相伴石片，是推測石器製作的依據。" } },
  { x: 1, y: 3, artefact: { name: "工業製鋁罐", era: "現代（示範）", target: false, material: "鋁合金", clue: "薄金屬罐身印有現代商標與條碼。", feedback: "條碼與工業包裝是清楚的現代線索。" } },
  { x: 4, y: 2, artefact: { name: "磨製石斧", era: "史前石器時代（示範）", target: true, material: "石材", clue: "斧身表面經反覆磨平，刃部有明顯人工加工痕。", feedback: "人工磨製痕跡符合部分新石器時代工具特徵，仍需教材與層位佐證。" } },
  { x: 2, y: 2, artefact: { name: "鐵製馬鐙", era: "較晚歷史時期（示範）", target: false, material: "鐵", clue: "形狀與成對騎乘裝具相符，伴隨較晚期的金屬製品。", feedback: "器物用途與伴隨遺物顯示它不屬於本次設定的石器時代目標。" } },
  { x: 4, y: 5, artefact: { name: "石錘", era: "史前石器時代（示範）", target: true, material: "石材", clue: "石塊兩端有重複敲擊的撞痕，附近發現石核。", feedback: "敲擊痕和附近的石核，能支持工具使用或製作的推論。" } },
  { x: 5, y: 3, artefact: { name: "塑膠玩具", era: "現代（示範）", target: false, material: "塑膠", clue: "底部印有現代製造標記與材質代碼。", feedback: "製造標記說明這是近現代製品。" } },
  { x: 1, y: 1, artefact: { name: "石製尖狀器", era: "史前石器時代（示範）", target: true, material: "石材", clue: "尖端兩側有人為敲擊修整留下的石片剝落面。", feedback: "人工剝片面支持石製工具的判讀。" } },
  { x: 5, y: 4, artefact: { name: "玻璃藥瓶", era: "近現代（示範）", target: false, material: "玻璃", clue: "瓶身壓有近代工廠編號與一致的模具接縫。", feedback: "模具接縫與工廠編號，是排除本次史前目標的線索。" } }
];
export const demoFiles = ["五年級數學－座標.pdf", "社會－石器時代.pdf", "跨科素養評量規準.docx"];
export const defaultIntent = "學生這週學過座標與石器時代，希望他們能在專題課中運用這些知識，共同完成一個有趣的挑戰。";
export const defaultGoals = [
  { subject: "數學", title: "使用 X / Y 座標定位、描述與修正位置。", source: "五年級數學－座標.pdf", provenance: "示範教材對應" },
  { subject: "社會", title: "根據地形、史前生活及文物線索提出合理判斷。", source: "社會－石器時代.pdf", provenance: "示範教材對應" },
  { subject: "跨科素養", title: "以觀察與證據支持探索、採集和反思決策。", source: "跨科素養評量規準.docx", provenance: "示範 AI 推論" }
];
export const paths = [
  { id: "water", icon: "≈", name: "水源追蹤者", tagline: "從河流出發，思考人群為何聚集。", color: "blue" },
  { id: "forest", icon: "♠", name: "森林觀察家", tagline: "從資源與食物出發，追尋生活線索。", color: "green" },
  { id: "stone", icon: "▲", name: "石器研究員", tagline: "從石材與工具出發，尋找製作證據。", color: "ochre" }
];
export const demoTimeline: GameEvent[] = [
  { id: 1, type: "coordinate_selected", label: "選擇座標 (3, 4)", details: "找到河流附近的探索位置。", coordinate: "(3, 4)", time: "09:42:04" },
  { id: 2, type: "reasoning_submitted", label: "說明探索原因", details: "河邊有水源，人和動物可能在附近活動。", coordinate: "(3, 4)", time: "09:42:12" },
  { id: 3, type: "hint_displayed", label: "查看地形提示", details: "水源可能吸引人類與動物，年代仍需參考考古脈絡。", time: "09:42:20" },
  { id: 4, type: "excavation_decision", label: "決定挖掘", details: "選擇 Yes；在河流附近挖掘。", time: "09:42:26" },
  { id: 5, type: "artefact_discovered", label: "發現打製石片工具", details: "石片有規律剝片痕跡，旁邊伴隨其他石屑。", time: "09:42:33" },
  { id: 6, type: "collection_decision", label: "決定採集", details: "學生回答：石頭有被敲打過的痕跡。", time: "09:42:39", scoreDelta: 10 }
];
export function getTerrain(x: number, y: number): Terrain { return grid[5 - y]?.[x - 1] ?? "plain"; }
export function getSite(x: number, y: number): Site | undefined { return sites.find(site => site.x === x && site.y === y); }
export function scoreDecision(isTarget: boolean, collect: boolean): number {
  if (collect) return isTarget ? 10 : -5;
  return isTarget ? 0 : 5;
}
