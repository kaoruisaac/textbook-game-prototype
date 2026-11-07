import { splitProps, type JSX } from "solid-js";
import { cx } from "../../utils";
import "./TextField.css";

interface FieldFrameProps {
  id: string;
  label: string;
  /** 標籤旁的小字，例如「已放入 3 份示範教材」 */
  hint?: string;
  /** 欄位下方的說明 */
  help?: string;
  /** 有值時顯示錯誤樣式並取代說明文字。要寫出哪裡錯、怎麼改。 */
  error?: string;
  class?: string;
  children: JSX.Element;
}

function FieldFrame(props: FieldFrameProps) {
  return (
    <div class={cx("pc-field", props.error && "pc-field--error", props.class)}>
      <label class="pc-field__label" for={props.id}>
        {props.label}
        {props.hint && <span class="pc-field__hint">{props.hint}</span>}
      </label>
      {props.children}
      {(props.error || props.help) && (
        <span id={`${props.id}-message`} class="pc-field__message" role={props.error ? "alert" : undefined}>
          {props.error ?? props.help}
        </span>
      )}
    </div>
  );
}

const describedBy = (id: string, error?: string, help?: string) => (error || help ? `${id}-message` : undefined);

export interface TextFieldProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  hint?: string;
  help?: string;
  error?: string;
  /** 代碼類欄位（班級代碼）用數字字體並加寬字距 */
  code?: boolean;
}

export function TextField(props: TextFieldProps) {
  const [local, rest] = splitProps(props, ["id", "label", "hint", "help", "error", "code", "class"]);
  return (
    <FieldFrame id={local.id} label={local.label} hint={local.hint} help={local.help} error={local.error} class={local.class}>
      <input
        id={local.id}
        class={cx("pc-field__control", local.code && "pc-field__control--code")}
        aria-invalid={local.error ? "true" : undefined}
        aria-describedby={describedBy(local.id, local.error, local.help)}
        {...rest}
      />
    </FieldFrame>
  );
}

export interface TextAreaProps extends JSX.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: string;
  hint?: string;
  help?: string;
  error?: string;
}

export function TextArea(props: TextAreaProps) {
  const [local, rest] = splitProps(props, ["id", "label", "hint", "help", "error", "class"]);
  return (
    <FieldFrame id={local.id} label={local.label} hint={local.hint} help={local.help} error={local.error} class={local.class}>
      <textarea
        id={local.id}
        class="pc-field__control pc-field__control--area"
        aria-invalid={local.error ? "true" : undefined}
        aria-describedby={describedBy(local.id, local.error, local.help)}
        {...rest}
      />
    </FieldFrame>
  );
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<JSX.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  id: string;
  label: string;
  options: SelectOption[];
  /** 未選擇時顯示的文字 */
  placeholder?: string;
  hint?: string;
  help?: string;
  error?: string;
}

export function Select(props: SelectProps) {
  const [local, rest] = splitProps(props, ["id", "label", "options", "placeholder", "hint", "help", "error", "class"]);
  return (
    <FieldFrame id={local.id} label={local.label} hint={local.hint} help={local.help} error={local.error} class={local.class}>
      <select
        id={local.id}
        class="pc-field__control pc-field__control--select"
        aria-invalid={local.error ? "true" : undefined}
        aria-describedby={describedBy(local.id, local.error, local.help)}
        {...rest}
      >
        {local.placeholder && <option value="">{local.placeholder}</option>}
        {local.options.map((o) => (
          <option value={o.value}>{o.label}</option>
        ))}
      </select>
    </FieldFrame>
  );
}
