interface IconProps {
  size?: number;
  class?: string;
}

export function CheckIcon(props: IconProps) {
  return (
    <svg class={props.class} width={props.size ?? 20} height={props.size ?? 20} viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10.5l4 4 8-9" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none" />
    </svg>
  );
}

export function CrossIcon(props: IconProps) {
  return (
    <svg class={props.class} width={props.size ?? 20} height={props.size ?? 20} viewBox="0 0 20 20" aria-hidden="true">
      <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" fill="none" />
    </svg>
  );
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <svg class={props.class} width={props.size ?? 22} height={props.size ?? 22} viewBox="0 0 22 22" aria-hidden="true">
      <circle cx="11" cy="11" r="10" fill="currentColor" />
      <path d="M6.5 11.5l3 3 6-7" stroke="var(--pc-sheet)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
    </svg>
  );
}

export function CrossCircleIcon(props: IconProps) {
  return (
    <svg class={props.class} width={props.size ?? 22} height={props.size ?? 22} viewBox="0 0 22 22" aria-hidden="true">
      <circle cx="11" cy="11" r="10" fill="currentColor" />
      <path d="M7.5 7.5l7 7M14.5 7.5l-7 7" stroke="var(--pc-sheet)" stroke-width="2.2" stroke-linecap="round" fill="none" />
    </svg>
  );
}
