/*
 * 介面框架：從目前的 Qrio 介面（src/App.tsx 的 Brand、.topbar、.nav、.demo-badge、.site-footer）整理出來。
 */
import { For, type JSX } from "solid-js";
import { cx } from "../../utils";
import "./Shell.css";

/* ---------- 品牌 ---------- */

export interface BrandProps {
  size?: "md" | "sm";
  /** 品牌名稱下方的產品名，預設「Textbook Gaming」 */
  product?: string;
}

export function Brand(props: BrandProps) {
  return (
    <span class={cx("pc-brand", props.size === "sm" && "pc-brand--sm")}>
      <img class="pc-brand__logo" src="/brand/qrio-logo.svg" alt="Qrio" width="128" height="42" />
      <span class="pc-brand__product">{props.product ?? "Textbook Gaming"}</span>
    </span>
  );
}

/* ---------- 頂部導覽 ---------- */

export interface NavItem<T extends string> {
  value: T;
  label: string;
}

export interface TopBarProps<T extends string> {
  items: NavItem<T>[];
  current?: T;
  onNavigate: (value: T) => void;
  onBrandClick?: () => void;
  /** 右側的狀態，例如 <DotLabel>互動示範</DotLabel> */
  status?: JSX.Element;
}

export function TopBar<T extends string>(props: TopBarProps<T>) {
  return (
    <header class="pc-topbar">
      <div class="pc-topbar__inner">
        <button type="button" class="pc-topbar__brand" onClick={() => props.onBrandClick?.()} aria-label="返回首頁">
          <Brand />
        </button>
        <nav class="pc-nav" aria-label="主要導覽">
          <For each={props.items}>
            {(item) => (
              <button
                type="button"
                class="pc-nav__item"
                aria-current={props.current === item.value ? "page" : undefined}
                onClick={() => props.onNavigate(item.value)}
              >
                {item.label}
              </button>
            )}
          </For>
        </nav>
        {props.status}
      </div>
    </header>
  );
}

/* ---------- 圓點標示 ---------- */

export interface DotLabelProps {
  tone?: "leaf" | "blue" | "amber";
  children: JSX.Element;
}

/** 圓點標示：一小段狀態說明，例如頂部的「互動示範」。 */
export function DotLabel(props: DotLabelProps) {
  return (
    <span class={cx("pc-dotlabel", `pc-dotlabel--${props.tone ?? "leaf"}`)}>
      <span class="pc-dotlabel__dot" aria-hidden="true" />
      {props.children}
    </span>
  );
}

/* ---------- 頁尾 ---------- */

export interface SiteFooterProps {
  tagline?: string;
  /** 右側的小字，每一項一段 */
  meta?: string[];
}

export function SiteFooter(props: SiteFooterProps) {
  return (
    <footer class="pc-sitefooter">
      <div class="pc-sitefooter__brand">
        <Brand size="sm" />
        {props.tagline && <span>{props.tagline}</span>}
      </div>
      <For each={props.meta ?? []}>{(item) => <span class="pc-sitefooter__meta">{item}</span>}</For>
    </footer>
  );
}
