import type { Phase } from "./demo-data";

export type TutorContext = "brief" | Phase | "result";
export type TutorOrigin = "typed" | "suggested";
export type TutorMessage = { id: number; role: "student" | "tutor"; text: string; origin?: TutorOrigin };

const questions: Record<TutorContext, string[]> = {
  brief: ["我該怎麼開始？", "怎麼輸入 X / Y 座標？", "石器時代的人怎麼生活？"],
  select: ["怎麼輸入 X / Y 座標？", "地圖上的符號是什麼？", "下一步要做什麼？"],
  reason: ["我不知道怎麼回答", "為什麼古人會選這種地形？", "下一步要做什麼？"],
  hint: ["我該怎麼決定要不要挖？", "地形會決定出土物嗎？", "下一步要做什麼？"],
  discover: ["我找到的是什麼？", "怎麼觀察文物線索？", "下一步要做什麼？"],
  collect: ["Collect 和 Leave 是什麼？", "怎麼判斷是不是石器時代？", "會怎麼計分？"],
  feedback: ["這次我學到了什麼？", "為什麼有加分或扣分？", "下一步要做什麼？"],
  result: ["分數代表我學得好嗎？", "老師能看到哪些紀錄？", "我還能再玩一次嗎？"]
};

const nextStep: Record<TutorContext, string> = {
  brief: "先選擇一條探索路徑，再按「開始 120 秒探索」。",
  select: "先在右側操作區輸入 1～5 的 X、Y 整數，觀察地圖定位，然後按「確認定位」。",
  reason: "先想像古人可能在這個環境做哪些活動，例如找水、覓食、製作工具；寫下自己的推測就好，沒有標準答案。",
  hint: "看看 Qrio 對你想法的回應，再決定「開始挖掘」或「先不挖掘」。",
  discover: "先閱讀出土物的材質與線索，再按「我要做出判斷」。",
  collect: "比較材質、加工痕與出土背景，寫下理由後再選 Collect 或 Leave；助教不會直接公布答案。",
  feedback: "讀完這次的年代回饋，按「探索下一個座標」繼續。",
  result: "可以回看本輪足跡，或交給老師在學習證據頁討論，也可以重新探索。"
};
export function tutorSuggestions(context: TutorContext): string[] { return questions[context]; }

export function tutorGreeting(context: TutorContext): string {
  return "我是 Qrio 學習助教。你可以隨時提問；我會幫你理解題目和下一步，但會把觀察與決定留給你。\n\n" + nextStep[context];
}

export function tutorReply(raw: string, context: TutorContext): string {
  const text = raw.toLowerCase().replace(/\s+/g, "");
  if (/(直接.{0,5}(告訴|告诉|給|给).*答案|正確答案|正确答案|答案是什麼|答案是什么|幫我選|帮我选)/.test(text)) {
    return "我不會替你選正確答案。你可以先說說看：這件物品的材質、加工痕或出土背景，哪一項最能支持你的想法？";
  }
  if (context === "discover" && /(找到|發現|发现|這是什麼|这是什么)/.test(text)) {
    return "你已經找到一項出土物。先閱讀物品名稱、材質與出土線索；不需要立刻猜答案，可以先說出你觀察到什麼。";
  }
  if (context === "feedback" && /(學到|学到|反思|收穫|收获)/.test(text)) {
    return "回頭想想這次判斷依靠了哪些線索。你可以比較自己的理由和回饋，下一個地點試試不同的觀察方法。";
  }
  if (context === "result" && /(再玩|重玩|再探索|再一次)/.test(text)) {
    return "可以按「重新選擇路徑」再開始一局；也可以先到學習證據頁，看看你剛剛問過什麼、做過哪些判斷。";
  }
  if (/(下一步|接下來|怎麼開始|怎么开始|如何開始|如何开始|不會|不会|不知道|卡住|幫忙|帮忙|操作|任務|任务|要做什麼|要做什么)/.test(text)) {
    return nextStep[context] + " 你也可以點下方的引導問題繼續問我。";
  }
  if (/(座標|坐标|地圖|地图|定位|格子|x\/y|xy|x軸|y軸|x轴|y轴)/.test(text)) {
    return "X 表示左右方向，Y 表示上下方向；兩個數字都在 1～5 之間。先輸入 X、Y，再看看地圖的定位標記。地圖本身不能點擊挖掘。";
  }
  if (/(地形|河流|森林|平原|高山|山地|沼澤|沼泽|古人|人類|人类|生活|農耕|农耕|狩獵|狩猎)/.test(text)) {
    return "不同地形可能提供不同資源，例如水源、石材或食物，但任何地形都可能留下人類活動的痕跡。試著用「我猜想……因為……」寫下你的想法，沒有地形選擇的標準對錯。";
  }
  if (/(挖掘|要不要挖|開始挖|开始挖|鏟|铲)/.test(text)) {
    return "挖掘位置只會由你輸入並確認的座標決定。請先說說為什麼對這個位置好奇，再決定是否挖掘；每個未探索座標挖掘都會找到一件物品。";
  }
  if (/(文物|石器|陶器|年代|考古|線索|线索|材質|材质|collect|leave|採集|采集|收集|判斷|判断|出土)/.test(text)) {
    return "辨認文物不能只看是不是石頭或陶器。可以先找三種證據：材質與製法、加工痕跡、出土背景。石器時代也包含某些農耕與陶器文化；先判斷再選 Collect 或 Leave，我不會劇透這件物品的答案。";
  }
  if (/(分數|分数|得分|扣分|加分|計分|计分)/.test(text)) {
    return "目前 Demo 的規則是：正確採集石器時代物品 +10，錯採其他年代 −5，Leave 為 0 分。分數是遊戲回饋，不等於你的學習能力；老師更重視你的理由。";
  }
  if (/(老師|老师|紀錄|记录|證據|证据|學習|学习)/.test(text)) {
    return "老師可以看到你的座標、推理、採集決定，以及你向助教提出的問題與我回應的內容；這些是討論學習歷程的線索，不是直接判定你會不會的分數。";
  }
  if (/(提示|提醒|建議|建议)/.test(text)) return nextStep[context];
  return "這個問題暫時超出石器時代探險的助教範圍。我可以協助座標、地形想像、挖掘操作和文物線索；現在這一步是：" + nextStep[context];
}
