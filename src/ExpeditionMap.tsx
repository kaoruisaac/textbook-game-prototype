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
const river = "M 514 -24 C 472 3 478 26 450 50 S 373 100 350 150 C 330 190 278 194 250 250 S 256 315 250 350 S 273 416 250 450";
const westBranch = "M 350 150 C 310 133 276 120 250 150 S 219 218 250 250";
const eastBranch = "M 350 150 C 369 181 383 219 350 250 S 283 264 250 250";

/** The landscape and the selectable cells use the same 500 × 500 coordinate space. */
export default function ExpeditionMap(props: Props) {
  return <div class="expedition-atlas">
    <div class="atlas-heading"><span>FIELD MAP <b>01</b></span><span>史前河谷 · 探索區域</span><span class="atlas-north">N ↑</span></div>
    <div class="atlas-coordinate-layout">
      <div class="atlas-axis-name">Y ↑</div>
      <div class="atlas-axis atlas-top"><For each={[1, 2, 3, 4, 5]}>{n => <span>{n}</span>}</For></div>
      <div class="atlas-axis atlas-left"><For each={[5, 4, 3, 2, 1]}>{n => <span>{n}</span>}</For></div>
      <div class="atlas-surface">
        <svg class="atlas-landscape" viewBox="0 0 500 500" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <pattern id="atlas-grain" width="19" height="23" patternUnits="userSpaceOnUse"><circle cx="3" cy="6" r=".65" fill="#496c4b" opacity=".16"/><circle cx="15" cy="17" r=".6" fill="#fffdf2" opacity=".6"/></pattern>
            <symbol id="atlas-tree" viewBox="0 0 26 40"><path d="M13 26v12" stroke="#61795b" stroke-width="2"/><path d="M13 1C6 6 1 15 3 23c2 9 18 10 21 0C26 15 20 6 13 1" fill="#61896b"/><path d="M13 4C9 11 8 22 13 29" fill="none" stroke="#a5b99a" stroke-width="1.3"/></symbol>
            <symbol id="atlas-peak" viewBox="0 0 60 60"><path d="M3 51 29 5 57 51Z" fill="#8d9c8c" stroke="#758977" stroke-width="1.2" stroke-linejoin="round"/><path d="m29 5 6 46h22Z" fill="#738a7c"/><path d="m29 5-9 16 9-4 7 6Z" fill="#edf0df"/><path d="M3 51h54" stroke="#bec5ab" stroke-width="3"/></symbol>
            <symbol id="atlas-reeds" viewBox="0 0 30 25"><path d="M7 23V10M15 23V3M23 23V8M7 18l-5-6m13 4 5-7m3 8 5-5" fill="none" stroke="#7c9163" stroke-width="1.6" stroke-linecap="round"/><path d="M13 4V1m8 8V5M5 11V7" stroke="#a69258" stroke-width="3" stroke-linecap="round"/></symbol>
          </defs>
          <rect width="500" height="500" fill="#dce4bc"/>
          <path d="M300 0H500V500H282c-27-35-23-65 4-103s49-47 24-79-36-83-10-119-33-67-19-107S310 38 300 0" fill="#ebe3bc"/>
          <path d="M0 89C48 61 81 81 100 117S84 177 56 191 21 203 0 188Z" fill="#eae2ba"/>
          <path d="M0 0H100C127 37 74 79 98 108s101-30 105-3S142 190 92 178 44 107 0 128Z" fill="#b9cda3"/>
          <path d="M0 195c38-33 90-16 100 25s-38 59-13 98S44 394 0 381Z" fill="#b5c99f"/>
          <path d="M94 392c36-24 107-3 110 36s-42 70-102 72H79c29-35-22-67 15-108" fill="#bed0a3"/>
          <path d="M189 0c47 19 80 9 95 43s-17 56-58 39-55-51-37-82" fill="#b8cba3"/>
          <For each={cells.filter(c => c.terrain === "mountain")}>{c => <g transform={`translate(${c.cx - 48} ${c.cy - 43})`}>
            <path d="M-8 67C-12 28 3-5 40-3s62 32 60 65-39 40-65 33S-6 92-8 67Z" fill="#ccd4b7"/>
            <path d="M-2 65C-6 28 15 7 39 7S88 37 88 63 59 91 34 84 1 87-2 65Z" fill="none" stroke="#aebd9e" stroke-width="1"/>
            <use href="#atlas-peak" x="0" y="29" width="47" height="47"/><use href="#atlas-peak" x="25" y="0" width="61" height="65"/><use href="#atlas-peak" x="51" y="35" width="43" height="43"/>
          </g>}</For>
          <For each={cells.filter(c => c.terrain === "swamp")}>{c => <g transform={`translate(${c.cx} ${c.cy})`}>
            <path d="M-42-15C-22-47 21-36 39-13S35 32 3 36-59 13-42-15" fill="#bacba5"/>
            <path d="M-32 3q15-11 30 0t29 0M-21 18q14-8 30 0M-19-16q12-7 25 0" fill="none" stroke="#94b5a0" stroke-width="3" stroke-linecap="round"/>
            <use href="#atlas-reeds" x="-33" y="-22" width="28" height="25"/><use href="#atlas-reeds" x="8" y="3" width="27" height="25"/>
          </g>}</For>
          <g fill="none" stroke-linecap="round" stroke-linejoin="round">
            <For each={[river, westBranch, eastBranch]}>{(d, i) => <>
              <path d={d} stroke="#f5edce" stroke-width={i() === 0 ? 50 : 34}/>
              <path d={d} stroke="#94bdbe" stroke-width={i() === 0 ? 39 : 25}/>
              <path d={d} stroke="#b7d7d1" stroke-width={i() === 0 ? 26 : 14}/>
              <path d={d} stroke="#e9f2e8" stroke-width="1.6" stroke-dasharray="12 27 3 38"/>
            </>}</For>
          </g>
          <For each={cells.filter(c => c.terrain === "forest")}>{c => <g transform={`translate(${c.cx - 40} ${c.cy - 39})`}>
            <ellipse cx="40" cy="47" rx="41" ry="30" fill="#a4bf94" opacity=".6"/>
            <For each={[[5, 8, 26], [35, 0, 29], [53, 18, 25], [19, 26, 30], [43, 36, 24]]}>{([x,y,w]) => <use href="#atlas-tree" x={x} y={y} width={w} height={w * 1.54}/>}</For>
          </g>}</For>
          <For each={cells.filter(c => c.terrain === "plain")}>{c => <g transform={`translate(${c.cx} ${c.cy})`} fill="none" stroke="#baad79" stroke-width="1.2" stroke-linecap="round">
            <path d="m-16-6 3-5 3 5m17 12 3-6 4 5M-4 22l3-6 3 5m12-39 3-4 3 4M-27 14l3-4 3 4"/>
          </g>}</For>
          <rect width="500" height="500" fill="url(#atlas-grain)"/>
          <g class="atlas-place-names"><text x="83" y="193">西側林地</text><text x="393" y="328">河 畔 平 原</text><text x="355" y="78" transform="rotate(-37 355 78)">河 谷</text></g>
        </svg>
        <div class="atlas-grid" role="group" aria-label="史前河谷座標地圖，X 由左至右、Y 由下至上，範圍皆為 1 到 5">
          <For each={cells}>{cell => {
            const active = () => props.location?.x === cell.x && props.location?.y === cell.y;
            const seen = () => props.visited.includes(`${cell.x},${cell.y}`);
            const dug = () => props.excavated.includes(`${cell.x},${cell.y}`);
            return <div class={`atlas-cell${active() ? " is-selected" : ""}${seen() ? " is-explored" : ""}${dug() ? " is-excavated" : ""}`} role="img" aria-label={`座標 ${cell.x}, ${cell.y}，${terrainInfo[cell.terrain].name}${active() ? "，目前定位" : ""}${dug() ? "，已挖掘" : seen() ? "，已探索" : ""}`}>
              <Show when={active()}><span class="atlas-location-pin" aria-hidden="true"><span/></span></Show>
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
