/**
 * @fileoverview Controlled string-tag chip input for the Dr Jasmine Admin Post editor.
 *
 * Draft field doubles as a search: typing filters existing site tags so Admins
 * can reuse the canonical spelling instead of inventing near-duplicates.
 */

import type {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  ReactElement,
} from "react";
import { useEffect, useId, useMemo, useRef, useState } from "react";

import "./admin-widgets.css";

/** Max autocomplete suggestions shown under the draft field. */
const SUGGESTION_LIMIT = 8;

/**
 * Props for {@link TagsInput}.
 */
export type TagsInputProps = {
  /** Current tag strings (controlled). */
  value: string[];
  /** Called with the next tags array after add / remove. */
  onChange: (next: string[]) => void;
  /**
   * Unique tags already used on other Posts for this site.
   * Used for typeahead suggestions; may be empty on a fresh site.
   */
  existingTags?: string[];
};

/**
 * Normalizes a candidate tag: trim and collapse internal whitespace.
 *
 * @param raw - Raw input text
 * @returns Normalized tag, or empty string if nothing remains
 */
function normalizeTag(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}

/**
 * Deduplicates tags case-insensitively, keeping the first spelling seen.
 *
 * @param tags - Raw tag lists (e.g. flattened from all Posts).
 * @returns Sorted unique tags with stable first-seen casing.
 */
export function collectUniqueTags(tags: readonly string[]): string[] {
  if (!Array.isArray(tags)) {
    return [];
  }

  const byLower = new Map<string, string>();
  for (const raw of tags) {
    if (typeof raw !== "string") {
      continue;
    }
    const tag = normalizeTag(raw);
    if (tag.length === 0) {
      continue;
    }
    const key = tag.toLowerCase();
    if (!byLower.has(key)) {
      byLower.set(key, tag);
    }
  }

  return Array.from(byLower.values()).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" }),
  );
}

/**
 * Filters existing tags by draft query: prefix matches first, then contains.
 * Excludes tags already on the current Post.
 *
 * @param query - Current draft text (unnormalized OK).
 * @param catalog - Site-wide unique tags.
 * @param selected - Tags already on this Post.
 * @param limit - Max suggestions to return.
 * @returns Ranked suggestion list.
 */
function filterTagSuggestions(
  query: string,
  catalog: readonly string[],
  selected: readonly string[],
  limit: number,
): string[] {
  const trimmed = query.trim();
  if (trimmed.length === 0 || !Array.isArray(catalog) || catalog.length === 0) {
    return [];
  }
  if (typeof limit !== "number" || !Number.isFinite(limit) || limit <= 0) {
    return [];
  }

  const needle = trimmed.toLowerCase();
  const selectedLower = new Set(
    selected
      .filter((tag): tag is string => typeof tag === "string")
      .map((tag) => tag.toLowerCase()),
  );

  const prefix: string[] = [];
  const contains: string[] = [];

  for (const tag of catalog) {
    if (typeof tag !== "string" || tag.length === 0) {
      continue;
    }
    const lower = tag.toLowerCase();
    if (selectedLower.has(lower)) {
      continue;
    }
    if (lower.startsWith(needle)) {
      prefix.push(tag);
      continue;
    }
    if (lower.includes(needle)) {
      contains.push(tag);
    }
  }

  return [...prefix, ...contains].slice(0, Math.floor(limit));
}

/**
 * Controlled add/remove chip input for Post tags (`string[]`).
 *
 * Adds via the Add button, Enter, or picking a suggestion. Duplicate tags
 * (case-insensitive) are ignored. Uses a div (not a nested form) so it can sit
 * inside PostForm safely.
 *
 * @param props - Controlled value, change handler, and optional site tag catalog
 * @returns Tags input fieldset
 */
export function TagsInput(props: TagsInputProps): ReactElement {
  const { value, onChange, existingTags = [] } = props;
  const [draft, setDraft] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLFieldSetElement | null>(null);
  const listboxId = useId();

  const catalog = useMemo(
    () => collectUniqueTags(existingTags),
    [existingTags],
  );

  const suggestions = useMemo(
    () => filterTagSuggestions(draft, catalog, value, SUGGESTION_LIMIT),
    [draft, catalog, value],
  );

  const showSuggestions = isOpen && suggestions.length > 0;

  /**
   * Keep the highlighted suggestion in range when the filtered list shrinks.
   */
  useEffect(() => {
    if (suggestions.length === 0) {
      setActiveIndex(-1);
      return;
    }
    setActiveIndex((previous) => {
      if (previous < 0) {
        return 0;
      }
      if (previous >= suggestions.length) {
        return suggestions.length - 1;
      }
      return previous;
    });
  }, [suggestions]);

  /**
   * Close the suggestion list when clicking outside this widget.
   */
  useEffect(() => {
    /**
     * @param event - Document pointer event
     */
    function handlePointerDown(event: PointerEvent): void {
      const root = rootRef.current;
      const target = event.target;
      if (root === null || !(target instanceof Node)) {
        return;
      }
      if (!root.contains(target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  /**
   * Appends a tag if non-empty and not already selected (case-insensitive).
   * Prefer the catalog spelling when a case-insensitive match exists.
   *
   * @param raw - Tag text to add
   */
  function addTag(raw: string): void {
    const tag = normalizeTag(raw);
    if (tag.length === 0) {
      return;
    }

    const alreadyExists = value.some(
      (existing) => existing.toLowerCase() === tag.toLowerCase(),
    );
    if (alreadyExists) {
      setDraft("");
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    const canonical =
      catalog.find((existing) => existing.toLowerCase() === tag.toLowerCase()) ??
      tag;

    onChange([...value, canonical]);
    setDraft("");
    setIsOpen(false);
    setActiveIndex(-1);
  }

  /**
   * Attempts to append the current draft as a new tag.
   */
  function tryAddDraft(): void {
    if (showSuggestions && activeIndex >= 0 && activeIndex < suggestions.length) {
      const picked = suggestions[activeIndex];
      if (typeof picked === "string") {
        addTag(picked);
        return;
      }
    }
    addTag(draft);
  }

  /**
   * Removes the tag at `index`.
   *
   * @param index - Zero-based tag index
   */
  function handleRemove(index: number): void {
    onChange(value.filter((_tag, i) => i !== index));
  }

  /**
   * Keyboard: navigate suggestions, commit with Enter, dismiss with Escape.
   *
   * @param event - Keyboard event from the input
   */
  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "Escape") {
      if (isOpen) {
        event.preventDefault();
        setIsOpen(false);
        setActiveIndex(-1);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      if (suggestions.length === 0) {
        return;
      }
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((previous) => {
        if (previous < 0) {
          return 0;
        }
        return Math.min(previous + 1, suggestions.length - 1);
      });
      return;
    }

    if (event.key === "ArrowUp") {
      if (suggestions.length === 0) {
        return;
      }
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((previous) => {
        if (previous <= 0) {
          return suggestions.length - 1;
        }
        return previous - 1;
      });
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      tryAddDraft();
    }
  }

  /**
   * Selects a suggestion via pointer without blurring before click registers.
   *
   * @param event - Mouse event on a suggestion button
   * @param tag - Suggested tag string
   */
  function handleSuggestionMouseDown(
    event: MouseEvent<HTMLButtonElement>,
    tag: string,
  ): void {
    event.preventDefault();
    addTag(tag);
  }

  const activeOptionId =
    showSuggestions && activeIndex >= 0
      ? `${listboxId}-option-${String(activeIndex)}`
      : undefined;

  return (
    <fieldset ref={rootRef} className="admin-widget">
      <legend className="admin-widget__legend">Tags</legend>
      <p className="admin-widget__hint">
        Optional keywords. Type to search existing tags, or press Enter / Add to
        create a new one.
      </p>

      {value.length > 0 ? (
        <ul className="admin-widget__tags" aria-label="Current tags">
          {value.map((tag, index) => {
            const key = `tag-${String(index)}-${tag}`;
            return (
              <li key={key} className="admin-widget__tag">
                <span>{tag}</span>
                <button
                  type="button"
                  className="admin-widget__tag-remove"
                  aria-label={`Remove tag ${tag}`}
                  onClick={() => {
                    handleRemove(index);
                  }}
                >
                  ×
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="admin-widget__empty">No tags yet.</p>
      )}

      <div className="admin-widget__tag-form">
        <label className="admin-widget__label" htmlFor="admin-tags-draft">
          Search or add tag
        </label>
        <div className="admin-widget__combobox">
          <input
            id="admin-tags-draft"
            className="admin-widget__input"
            type="text"
            role="combobox"
            value={draft}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setDraft(event.target.value);
              setIsOpen(true);
            }}
            onFocus={() => {
              setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            aria-autocomplete="list"
            aria-expanded={showSuggestions}
            aria-controls={listboxId}
            aria-activedescendant={activeOptionId}
          />
          {showSuggestions ? (
            <ul
              id={listboxId}
              className="admin-widget__suggestions"
              role="listbox"
              aria-label="Existing tags"
            >
              {suggestions.map((tag, index) => {
                const isActive = index === activeIndex;
                return (
                  <li key={tag} role="presentation">
                    <button
                      type="button"
                      id={`${listboxId}-option-${String(index)}`}
                      className={
                        isActive
                          ? "admin-widget__suggestion admin-widget__suggestion--active"
                          : "admin-widget__suggestion"
                      }
                      role="option"
                      aria-selected={isActive}
                      onMouseDown={(event) => {
                        handleSuggestionMouseDown(event, tag);
                      }}
                      onMouseEnter={() => {
                        setActiveIndex(index);
                      }}
                    >
                      {tag}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
        <button
          type="button"
          className="admin-widget__btn admin-widget__btn--primary"
          onClick={tryAddDraft}
        >
          Add
        </button>
      </div>
    </fieldset>
  );
}
