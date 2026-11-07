import { Show } from "solid-js";
import "./Upload.css";

export interface UploadAreaProps {
  id: string;
  title: string;
  /** 說明接受的格式，以及檔案會被怎麼處理 */
  description: string;
  buttonLabel?: string;
  accept?: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
}

/** 上傳區：虛線框，點按鈕選檔。 */
export function UploadArea(props: UploadAreaProps) {
  return (
    <div class="pc-upload">
      <span class="pc-upload__icon" aria-hidden="true">↥</span>
      <strong class="pc-upload__title">{props.title}</strong>
      <p class="pc-upload__desc">{props.description}</p>
      <label class="pc-upload__button" for={props.id}>
        {props.buttonLabel ?? "選擇檔案"}
      </label>
      <input
        id={props.id}
        class="pc-visually-hidden"
        type="file"
        accept={props.accept}
        multiple={props.multiple}
        onChange={(e) => props.onFiles(Array.from(e.currentTarget.files ?? []))}
      />
    </div>
  );
}

export interface FileChipProps {
  name: string;
  /** 例如「示範」 */
  note?: string;
  onRemove?: () => void;
}

export function FileChip(props: FileChipProps) {
  return (
    <span class="pc-file">
      <span class="pc-file__icon" aria-hidden="true">▤</span>
      <span class="pc-file__name">{props.name}</span>
      <Show when={props.note}>
        <span class="pc-file__note">{props.note}</span>
      </Show>
      <Show when={props.onRemove}>
        <button type="button" class="pc-file__remove" aria-label={`移除 ${props.name}`} onClick={() => props.onRemove?.()}>
          ×
        </button>
      </Show>
    </span>
  );
}
