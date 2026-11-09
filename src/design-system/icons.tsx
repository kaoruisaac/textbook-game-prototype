/*
 * 圖示：全部使用 Lucide（https://lucide.dev），與 Qrio 產品一致。
 * 元件與頁面從這裡匯入，不直接寫 SVG 或用文字符號（✓ × ＋ ✦）當圖示。
 * 每個圖示個別匯入，打包時只會帶進用到的圖示。
 */
import Check from "lucide-solid/icons/check";
import CircleCheck from "lucide-solid/icons/circle-check";
import CircleX from "lucide-solid/icons/circle-x";
import X from "lucide-solid/icons/x";

export { default as ArrowLeft } from "lucide-solid/icons/arrow-left";
export { default as ArrowRight } from "lucide-solid/icons/arrow-right";
export { default as ChevronDown } from "lucide-solid/icons/chevron-down";
export { default as ChevronRight } from "lucide-solid/icons/chevron-right";
export { default as CircleCheckBig } from "lucide-solid/icons/circle-check-big";
export { default as Crosshair } from "lucide-solid/icons/crosshair";
export { default as Gem } from "lucide-solid/icons/gem";
export { default as LayoutGrid } from "lucide-solid/icons/layout-grid";
export { default as MapPin } from "lucide-solid/icons/map-pin";
export { default as MessageSquare } from "lucide-solid/icons/message-square";
export { default as Pencil } from "lucide-solid/icons/pencil";
export { default as Shovel } from "lucide-solid/icons/shovel";
export { default as CircleHelp } from "lucide-solid/icons/circle-question-mark";
export { default as FilePlus } from "lucide-solid/icons/file-plus";
export { default as Heart } from "lucide-solid/icons/heart";
export { default as Info } from "lucide-solid/icons/info";
export { default as Lightbulb } from "lucide-solid/icons/lightbulb";
export { default as ListChecks } from "lucide-solid/icons/list-checks";
export { default as LoaderCircle } from "lucide-solid/icons/loader-circle";
export { default as Maximize2 } from "lucide-solid/icons/maximize-2";
export { default as MessagesSquare } from "lucide-solid/icons/messages-square";
export { default as Minimize2 } from "lucide-solid/icons/minimize-2";
export { default as Play } from "lucide-solid/icons/play";
export { default as Plus } from "lucide-solid/icons/plus";
export { default as RotateCcw } from "lucide-solid/icons/rotate-ccw";
export { default as Search } from "lucide-solid/icons/search";
export { default as Send } from "lucide-solid/icons/send";
export { default as Sparkles } from "lucide-solid/icons/sparkles";
export { default as TriangleAlert } from "lucide-solid/icons/triangle-exclamation-point";
export { default as UserPlus } from "lucide-solid/icons/user-plus";
export { Check, CircleCheck, CircleX, X };

interface IconProps {
  size?: number;
  class?: string;
}

/* 舊名稱保留給既有元件使用 */
export const CheckIcon = (props: IconProps) => <Check size={props.size ?? 20} class={props.class} strokeWidth={2.4} aria-hidden="true" />;
export const CrossIcon = (props: IconProps) => <X size={props.size ?? 20} class={props.class} strokeWidth={2.4} aria-hidden="true" />;
export const CheckCircleIcon = (props: IconProps) => <CircleCheck size={props.size ?? 22} class={props.class} aria-hidden="true" />;
export const CrossCircleIcon = (props: IconProps) => <CircleX size={props.size ?? 22} class={props.class} aria-hidden="true" />;
