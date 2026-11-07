import { For, Show } from "solid-js";
import { grid, terrainInfo } from "./demo-data";
import "./expedition-map.css";

type Point = { x: number; y: number };
/** 地圖只負責顯示：位置由學生輸入的 X / Y 座標決定，不能點擊選點。 */
type Props = {
  /** 目前定位（輸入中的預覽，或已確認的座標） */
  location: Point | null;
  /** 已探索（做過挖掘決定）的格子，格式 "x,y" */
  visited: string[];
  /** 已挖掘的格子，格式 "x,y" */
  excavated: string[];
};

const cells = grid.flatMap((row, r) => row.map((terrain, c) => ({ terrain, x: c + 1, y: 5 - r, cx: c * 100 + 50, cy: r * 100 + 50 })));
/** The landscape and the selectable cells use the same 500 × 500 coordinate space. */
export default function ExpeditionMap(props: Props) {
  return <div class="expedition-atlas">
    <div class="atlas-heading"><span>FIELD MAP <b>01</b></span><span>史前河谷 · 探索區域</span><span class="atlas-north">N ↑</span></div>
    <div class="atlas-coordinate-layout">
      <div class="atlas-axis-name">Y ↑</div>
      <div class="atlas-axis atlas-top"><For each={[1, 2, 3, 4, 5]}>{n => <span>{n}</span>}</For></div>
      <div class="atlas-axis atlas-left"><For each={[5, 4, 3, 2, 1]}>{n => <span>{n}</span>}</For></div>
      <div class="atlas-surface">
        <img class="atlas-background" src="/maps/river-valley-atlas.png" alt="" aria-hidden="true" draggable={false} />

        <div class="atlas-grid" role="group" aria-label="史前河谷座標地圖，X 由左至右、Y 由下至上，範圍皆為 1 到 5">
          <For each={cells}>{cell => {
            const active = () => props.location?.x === cell.x && props.location?.y === cell.y;
            const seen = () => props.visited.includes(`${cell.x},${cell.y}`);
            const dug = () => props.excavated.includes(`${cell.x},${cell.y}`);
            return <div class={`atlas-cell${active() ? " is-selected" : ""}${seen() ? " is-explored" : ""}${dug() ? " is-excavated" : ""}`} role="img" aria-label={`座標 ${cell.x}, ${cell.y}，${terrainInfo[cell.terrain].name}${active() ? "，目前定位" : ""}${dug() ? "，已挖掘" : seen() ? "，已探索" : ""}`}>
              <Show when={active()}><span class="atlas-coordinate-mark" aria-hidden="true">{cell.x}, {cell.y}</span></Show>
              <Show when={seen()}><span class="atlas-explored-mark" aria-hidden="true">{dug() ? "⛏" : "✓"}</span></Show>
            </div>;
          }}</For>
        </div>
      </div>
      <div class="atlas-axis atlas-right"><For each={[5, 4, 3, 2, 1]}>{n => <span>{n}</span>}</For></div>
      <div class="atlas-axis atlas-bottom"><For each={[1, 2, 3, 4, 5]}>{n => <span>{n}</span>}</For></div><span class="atlas-x-direction">X →</span>
    </div>
    <div class="atlas-caption"><span>觀察地形，想想人類可能在哪裡生活。</span><span>探索示意圖 · 非真實遺址</span></div>
  </div>;
}
