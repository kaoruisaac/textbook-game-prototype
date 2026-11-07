import type { Artefact, Site } from "./demo-data";

// DEMO curriculum: examples drawn from several archaeological traditions.
// Era labels are pre-reviewed game data, never inferred by the chat mock.
// A real classroom must restrict this catalog to a teacher-approved region and period.
export const artefactCatalog: Artefact[] = [
  { name:"打製石片工具", era:"舊石器時代", target:true, material:"石材", clue:"邊緣有連續敲擊剝片痕，與石核及製作石屑共同出土。", feedback:"規律剝片與石核是判斷石器製作的重要線索。" },
  { name:"石製刮削器", era:"舊石器時代", target:true, material:"石材", clue:"單側刃緣經反覆修整，旁邊有同類石片。", feedback:"修整的刃緣和石片組合支持史前工具的判讀。" },
  { name:"磨製石斧", era:"新石器時代", target:true, material:"石材", clue:"刃部經長期研磨，出自具有史前聚落遺構的地層。", feedback:"磨製石斧常見於部分新石器時代文化，也可能與伐木及開墾有關。" },
  { name:"石錘", era:"石器時代", target:true, material:"石材", clue:"兩端留有集中敲擊痕，周圍伴隨石核與石屑。", feedback:"反覆敲擊痕與伴出石屑可支持製作工具的假設。" },
  { name:"石製尖狀器", era:"舊石器時代", target:true, material:"石材", clue:"尖端兩側有對稱修整留下的人工剝片面。", feedback:"形狀要結合人工加工痕跡與考古脈絡判斷。" },
  { name:"骨針", era:"石器時代", target:true, material:"動物骨", clue:"細長骨器有穿線小孔，與史前生活遺留共同出土。", feedback:"石器時代人們不只使用石頭，也會加工骨頭製作工具。" },
  { name:"骨製魚鉤", era:"石器時代", target:true, material:"動物骨", clue:"骨器彎成鉤狀，與史前魚骨、貝殼和石器共同出土。", feedback:"史前人類可能利用骨製魚鉤捕魚，水邊活動不限於農耕。" },
  { name:"研磨石與石臼", era:"新石器時代", target:true, material:"石材", clue:"兩件石器有反覆摩擦的磨耗，附近找到炭化植物遺存。", feedback:"研磨工具可能與食物加工有關；新石器時代部分地區已發展農耕。" },
  { name:"手製陶罐", era:"新石器時代", target:true, material:"陶土", clue:"器壁不規則、以手工塑形，出自經考古測年的新石器聚落層。", feedback:"陶器並非必然晚於石器時代；部分新石器文化已製陶。" },
  { name:"石製箭鏃", era:"石器時代", target:true, material:"燧石", clue:"石片兩側經細緻修整，伴隨史前獵具與動物骨骸。", feedback:"石製箭鏃可能與狩獵有關；年代仍取決於出土背景。" },
  { name:"黑曜石刃片", era:"石器時代", target:true, material:"黑曜石", clue:"火山玻璃邊緣有人工剝片痕，附近還有石核。", feedback:"黑曜石是天然玻璃，也可被史前人類打製為鋒利工具。" },
  { name:"石製鑽孔器", era:"石器時代", target:true, material:"石材", clue:"尖端反覆磨損，與穿孔骨片及石屑一同發現。", feedback:"鑽孔和研磨都可能是史前加工技術；要看出土脈絡。" },
  { name:"穿孔貝殼飾物", era:"石器時代", target:true, material:"貝殼", clue:"數枚貝殼有規律穿孔，出自史前人類活動層。", feedback:"史前遺物不只有工具；貝殼也可能被做成裝飾品。" },
  { name:"磨製石鋤", era:"新石器時代", target:true, material:"石材", clue:"石刃帶有磨耗，與聚落土層及植物加工工具同時出土。", feedback:"部分新石器聚落會使用石製工具進行土地與植物加工。" },
  { name:"石製鐮刀刃", era:"新石器時代", target:true, material:"燧石", clue:"細長石刃有植物切割磨光痕，來自早期農耕聚落層。", feedback:"部分早期農耕社群以石刃收割；農耕與新石器時代並不矛盾。" },
  { name:"近代硬幣", era:"近現代", target:false, material:"金屬", clue:"硬幣清楚鑄有近代年份與現代貨幣名稱。", feedback:"明確的近代年份能排除本次石器時代目標。" },
  { name:"工業製鋁罐", era:"現代", target:false, material:"鋁合金", clue:"薄金屬罐上印有商品條碼與機器製造批號。", feedback:"條碼與批號表明它是現代工業製品。" },
  { name:"鐵製馬鐙", era:"較晚歷史時期", target:false, material:"鐵", clue:"成對騎乘用鐵具，伴出較晚期的馬具與金屬零件。", feedback:"這組騎乘裝具的類型與出土組合不屬本次石器時代。" },
  { name:"塑膠玩具", era:"現代", target:false, material:"塑膠", clue:"底部有塑料材質碼和現代工廠商標。", feedback:"合成塑膠和工廠標記屬於現代生活線索。" },
  { name:"模製玻璃藥瓶", era:"近現代", target:false, material:"玻璃", clue:"瓶身有一致模具接縫和近代藥廠的壓印編號。", feedback:"工業模製與製造編號指出較晚年代；玻璃本身不足以判斷年代。" },
  { name:"機器製螺絲", era:"近現代", target:false, material:"鋼", clue:"標準化螺紋與工廠規格號碼清晰可見。", feedback:"標準化的機械零件不是這次石器時代任務的目標。" },
  { name:"塑膠瓶蓋", era:"現代", target:false, material:"塑膠", clue:"蓋內印有塑膠回收符號與製造日期。", feedback:"塑膠回收標記與製造日期是明確的現代證據。" },
  { name:"青銅劍", era:"青銅時代", target:false, material:"青銅", clue:"合金劍身與青銅時代墓葬組合共同出土。", feedback:"這件器物的類型和墓葬層位指向青銅時代，不是本次目標。" },
  { name:"近代釉彩瓷盤", era:"近現代", target:false, material:"瓷", clue:"盤底有近代製造年號與工廠標記。", feedback:"判斷依據是製造年號及背景，而不是『陶瓷一定晚於石器時代』。" },
  { name:"電子電路板", era:"現代", target:false, material:"複合材料", clue:"板上有積體電路晶片與現代生產序號。", feedback:"積體電路屬於現代電子技術，不是史前文物。" }
];

export function createExcavationSites(): Site[] {
  const deck = [...artefactCatalog];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck.map((artefact, index) => ({
    x: (index % 5) + 1, y: 5 - Math.floor(index / 5), artefact
  }));
}
