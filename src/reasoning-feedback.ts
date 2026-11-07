import type { Terrain } from "./demo-data";

// Deterministic, locally scripted dialogue adaptation. NOT a live language model.
// Acknowledge the student's hypothesis without judging the terrain as correct/incorrect.
const terrainAngles: Record<Terrain, string> = {
  river: "河邊可能方便取水、捕魚，也可能發展聚落；但不同時代的人都會接近水。",
  plain: "平坦的地方可能便於紮營、行走、種植作物或建立聚落。",
  swamp: "濕地附近有植物與動物資源，有些潮濕環境也可能保存人類活動痕跡。",
  forest: "森林能提供野生動植物、木材和庇護，但生活方式會隨時代與地區改變。",
  mountain: "山區可能有石材、獵物或通行路線，也會面臨交通與氣候的挑戰。"
};
const themes = [
  { words: /水|河|魚|喝|飲|灌溉/, text: "你想到水與生活的關係。水源可能支持捕魚、飲用或後來的耕作。" },
  { words: /農|耕|種|田|作物|穀|糧/, text: "你想到種植與食物。部分新石器時代文化已有農耕，所以農業不等於石器時代以後。" },
  { words: /獵|動物|野獸|捕/, text: "你想到動物與狩獵。史前人群可能循著動物活動留下工具或食物殘留。" },
  { words: /住|家|村|聚落|營|休息/, text: "你想到居住與聚落。不同地形有不同的居住優勢與挑戰。" },
  { words: /石|岩|工具|製造|斧|磨/, text: "你想到原料與製作活動。石材來源、剝片和磨製痕跡都值得觀察。" }
];
export function respondToStudentReason(reason: string, terrain: Terrain): string {
  const cleaned = reason.trim().replace(/\s+/g, " ");
  const echo = cleaned.length > 72 ? cleaned.slice(0, 72) + "…" : cleaned;
  const theme = themes.find(t => t.words.test(cleaned));
  return `你想像「${echo}」。我們先把這當作一個值得調查的假設，不急著判斷對錯。${theme?.text ?? terrainAngles[terrain]} 即使挖到物品，仍要看製作痕跡、年代與出土脈絡才能判斷是不是石器時代。你想實際試著挖掘看看嗎？`;
}
