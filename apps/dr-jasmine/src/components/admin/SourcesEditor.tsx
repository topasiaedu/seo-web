/**
 * @fileoverview Controlled sources / citations repeater for the Dr Jasmine Admin Post editor.
 */

import type { SourceItem } from "@seo/blog";
import type { ChangeEvent, ReactElement } from "react";

import "./admin-widgets.css";

/**
 * Props for {@link SourcesEditor}.
 */
export type SourcesEditorProps = {
  /** Current source entries (controlled). */
  value: SourceItem[];
  /** Called with the next sources array after any add / edit / remove. */
  onChange: (next: SourceItem[]) => void;
};

/**
 * Builds a blank source row for the repeater.
 *
 * @returns Empty label with no URL
 */
function createEmptySourceItem(): SourceItem {
  return { label: "" };
}

/**
 * Controlled repeater for Post citation / source items (`label` + optional `url`).
 *
 * Omitting or clearing `url` stores the entry without a URL field (matches {@link SourceItem}).
 *
 * @param props - Controlled value and change handler
 * @returns Sources editor fieldset
 */
export function SourcesEditor(props: SourcesEditorProps): ReactElement {
  const { value, onChange } = props;

  /**
   * Appends one empty source row.
   */
  function handleAdd(): void {
    onChange([...value, createEmptySourceItem()]);
  }

  /**
   * Removes the source row at `index`.
   *
   * @param index - Zero-based row index
   */
  function handleRemove(index: number): void {
    onChange(value.filter((_item, i) => i !== index));
  }

  /**
   * Updates the label on the source row at `index`.
   *
   * @param index - Zero-based row index
   * @param label - New label text
   */
  function handleLabelChange(index: number, label: string): void {
    const next = value.map((item, i) => {
      if (i !== index) {
        return item;
      }
      return { ...item, label };
    });
    onChange(next);
  }

  /**
   * Updates or clears the optional URL on the source row at `index`.
   *
   * Empty / whitespace-only input removes `url` from the item.
   *
   * @param index - Zero-based row index
   * @param rawUrl - Raw input value
   */
  function handleUrlChange(index: number, rawUrl: string): void {
    const trimmed = rawUrl.trim();
    const next = value.map((item, i) => {
      if (i !== index) {
        return item;
      }
      if (trimmed.length === 0) {
        return { label: item.label };
      }
      return { label: item.label, url: trimmed };
    });
    onChange(next);
  }

  return (
    <fieldset className="admin-widget">
      <legend className="admin-widget__legend">Sources</legend>
      <p className="admin-widget__hint">
        Optional citations. URL is optional for each entry.
      </p>

      {value.length === 0 ? (
        <p className="admin-widget__empty">No sources yet.</p>
      ) : (
        <ul className="admin-widget__list">
          {value.map((item, index) => {
            const labelId = `source-label-${String(index)}`;
            const urlId = `source-url-${String(index)}`;
            const urlValue = typeof item.url === "string" ? item.url : "";

            return (
              <li key={labelId} className="admin-widget__row">
                <div className="admin-widget__field">
                  <label className="admin-widget__label" htmlFor={labelId}>
                    Label
                  </label>
                  <input
                    id={labelId}
                    className="admin-widget__input"
                    type="text"
                    value={item.label}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      handleLabelChange(index, event.target.value);
                    }}
                    autoComplete="off"
                  />
                </div>
                <div className="admin-widget__field">
                  <label className="admin-widget__label" htmlFor={urlId}>
                    URL (optional)
                  </label>
                  <input
                    id={urlId}
                    className="admin-widget__input"
                    type="url"
                    value={urlValue}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      handleUrlChange(index, event.target.value);
                    }}
                    placeholder="https://"
                    autoComplete="off"
                  />
                </div>
                <div className="admin-widget__row-actions">
                  <button
                    type="button"
                    className="admin-widget__btn admin-widget__btn--danger"
                    onClick={() => {
                      handleRemove(index);
                    }}
                  >
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <button
        type="button"
        className="admin-widget__btn admin-widget__btn--primary"
        onClick={handleAdd}
      >
        Add source
      </button>
    </fieldset>
  );
}
