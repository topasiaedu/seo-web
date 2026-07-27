/**
 * @fileoverview Controlled FAQ repeater for the CAE Admin Post editor.
 */

import type { FaqItem } from "@seo/blog";
import type { ChangeEvent, ReactElement } from "react";

import "./admin-widgets.css";

/**
 * Props for {@link FaqEditor}.
 */
export type FaqEditorProps = {
  /** Current FAQ entries (controlled). */
  value: FaqItem[];
  /** Called with the next FAQ array after any add / edit / remove. */
  onChange: (next: FaqItem[]) => void;
};

/**
 * Builds a blank FAQ row for the repeater.
 *
 * @returns Empty question/answer pair
 */
function createEmptyFaqItem(): FaqItem {
  return { question: "", answer: "" };
}

/**
 * Controlled repeater for Post FAQ items (`question` + `answer`).
 *
 * Parent owns persistence; this widget only mutates the in-memory array via `onChange`.
 *
 * @param props - Controlled value and change handler
 * @returns FAQ editor fieldset
 */
export function FaqEditor(props: FaqEditorProps): ReactElement {
  const { value, onChange } = props;

  /**
   * Appends one empty FAQ row.
   */
  function handleAdd(): void {
    onChange([...value, createEmptyFaqItem()]);
  }

  /**
   * Removes the FAQ row at `index`.
   *
   * @param index - Zero-based row index
   */
  function handleRemove(index: number): void {
    onChange(value.filter((_item, i) => i !== index));
  }

  /**
   * Updates one field on the FAQ row at `index`.
   *
   * @param index - Zero-based row index
   * @param field - Which FaqItem key to update
   * @param fieldValue - New string value
   */
  function handleFieldChange(
    index: number,
    field: keyof FaqItem,
    fieldValue: string,
  ): void {
    const next = value.map((item, i) => {
      if (i !== index) {
        return item;
      }
      return { ...item, [field]: fieldValue };
    });
    onChange(next);
  }

  return (
    <fieldset className="admin-widget">
      <legend className="admin-widget__legend">FAQ</legend>
      <p className="admin-widget__hint">
        Optional questions and answers shown on the public Post.
      </p>

      {value.length === 0 ? (
        <p className="admin-widget__empty">No FAQ items yet.</p>
      ) : (
        <ul className="admin-widget__list">
          {value.map((item, index) => {
            const questionId = `faq-question-${String(index)}`;
            const answerId = `faq-answer-${String(index)}`;

            return (
              <li key={questionId} className="admin-widget__row">
                <div className="admin-widget__field">
                  <label className="admin-widget__label" htmlFor={questionId}>
                    Question
                  </label>
                  <input
                    id={questionId}
                    className="admin-widget__input"
                    type="text"
                    value={item.question}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      handleFieldChange(index, "question", event.target.value);
                    }}
                    autoComplete="off"
                  />
                </div>
                <div className="admin-widget__field">
                  <label className="admin-widget__label" htmlFor={answerId}>
                    Answer
                  </label>
                  <textarea
                    id={answerId}
                    className="admin-widget__textarea"
                    value={item.answer}
                    onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                      handleFieldChange(index, "answer", event.target.value);
                    }}
                    rows={3}
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
        Add FAQ
      </button>
    </fieldset>
  );
}
