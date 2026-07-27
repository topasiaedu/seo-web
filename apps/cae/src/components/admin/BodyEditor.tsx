/**
 * @fileoverview In-place TipTap Body editor for CAE Admin Posts.
 * Visual (WYSIWYG) and Markdown modes share one `body_md` value via a mode pill.
 */

import { Markdown } from "@tiptap/markdown";
import Link from "@tiptap/extension-link";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type MouseEvent,
  type ReactElement,
} from "react";
import styles from "./BodyEditor.module.css";

/**
 * Controlled props for the Admin Body (Post `body_md`) TipTap editor.
 */
export type BodyEditorProps = {
  /**
   * Current Body content as markdown (`body_md`).
   */
  value: string;
  /**
   * Called with the serialized markdown whenever the editor document changes.
   *
   * @param markdown - Updated Body markdown string
   */
  onChange: (markdown: string) => void;
  /**
   * When true, the editor and toolbar are non-interactive.
   */
  disabled?: boolean;
};

/**
 * Editing surface mode: rich Visual (TipTap) or raw Markdown textarea.
 */
export type BodyEditorMode = "visual" | "markdown";

/**
 * Shared TipTap extensions for Body editing (H2/H3, marks, lists, links, markdown I/O).
 */
const BODY_EXTENSIONS = [
  StarterKit.configure({
    heading: {
      levels: [2, 3],
    },
  }),
  Link.configure({
    openOnClick: false,
    autolink: true,
    defaultProtocol: "https",
    HTMLAttributes: {
      rel: "noopener noreferrer",
      target: "_blank",
    },
  }),
  Markdown,
];

/**
 * Reads a previous link href from TipTap mark attributes without unsafe casts.
 *
 * @param editor - Active TipTap editor instance
 * @returns Existing href string, or empty string when unset/invalid
 */
function readLinkHref(editor: Editor): string {
  const attrs = editor.getAttributes("link");
  if (typeof attrs.href === "string") {
    return attrs.href;
  }
  return "";
}

/**
 * Builds CSS class names for a toolbar button, including active state.
 *
 * @param isActive - Whether the corresponding mark/node is active
 * @param extras - Optional extra module class names
 * @returns Space-joined className string
 */
function toolButtonClass(isActive: boolean, ...extras: Array<string | undefined>): string {
  const classes = [styles.toolButton];
  if (isActive) {
    classes.push(styles.toolButtonActive);
  }
  for (const extra of extras) {
    if (typeof extra === "string" && extra.length > 0) {
      classes.push(extra);
    }
  }
  return classes.join(" ");
}

/**
 * In-place Body editor with Visual / Markdown mode pill.
 * Paste raw markdown in Markdown mode, then switch to Visual to see formatted output.
 * Mount from Astro with `client:load`.
 *
 * @param props - Controlled markdown value, change handler, and optional disabled flag
 * @returns Editor island UI
 */
export function BodyEditor(props: BodyEditorProps): ReactElement {
  const { value, onChange, disabled = false } = props;
  const modeGroupId = useId();
  const [mode, setMode] = useState<BodyEditorMode>("visual");

  /**
   * Last markdown string emitted via `onChange` (or applied from `value`).
   * Prevents feedback loops when the parent echoes the same markdown back.
   */
  const lastSyncedMarkdownRef = useRef<string>(value);

  /**
   * Stable onChange ref so TipTap `onUpdate` always calls the latest handler.
   */
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const editor = useEditor(
    {
      extensions: BODY_EXTENSIONS,
      content: value,
      contentType: "markdown",
      editable: !disabled && mode === "visual",
      immediatelyRender: false,
      shouldRerenderOnTransaction: true,
      editorProps: {
        attributes: {
          class: "tiptap",
          "aria-label": "Post body",
        },
      },
      onUpdate: ({ editor: currentEditor }) => {
        const markdown = currentEditor.getMarkdown();
        lastSyncedMarkdownRef.current = markdown;
        onChangeRef.current(markdown);
      },
    },
    [],
  );

  /**
   * Apply external `value` updates into TipTap when they differ from local state.
   */
  useEffect(() => {
    if (editor === null) {
      return;
    }
    if (value === lastSyncedMarkdownRef.current) {
      return;
    }
    const currentMarkdown = editor.getMarkdown();
    if (value === currentMarkdown) {
      lastSyncedMarkdownRef.current = value;
      return;
    }
    editor.commands.setContent(value, { contentType: "markdown" });
    lastSyncedMarkdownRef.current = value;
  }, [editor, value]);

  /**
   * Keep TipTap editable only in Visual mode and when not disabled.
   */
  useEffect(() => {
    if (editor === null) {
      return;
    }
    editor.setEditable(!disabled && mode === "visual");
  }, [editor, disabled, mode]);

  /**
   * Switches between Visual and Markdown, syncing TipTap from the shared markdown value.
   *
   * @param nextMode - Target editing mode
   */
  const handleModeChange = useCallback(
    (nextMode: BodyEditorMode) => {
      if (nextMode === mode) {
        return;
      }

      if (nextMode === "visual" && editor !== null) {
        editor.commands.setContent(value, { contentType: "markdown" });
        lastSyncedMarkdownRef.current = value;
      }

      if (nextMode === "markdown" && editor !== null) {
        const fromEditor = editor.getMarkdown();
        if (fromEditor !== value) {
          lastSyncedMarkdownRef.current = fromEditor;
          onChangeRef.current(fromEditor);
        }
      }

      setMode(nextMode);
    },
    [editor, mode, value],
  );

  /**
   * Updates markdown from the raw textarea in Markdown mode.
   *
   * @param event - Textarea change event
   */
  function handleMarkdownTextareaChange(event: ChangeEvent<HTMLTextAreaElement>): void {
    const next = event.target.value;
    lastSyncedMarkdownRef.current = next;
    onChange(next);
  }

  /**
   * Prompts for a URL and toggles the link mark on the current selection.
   */
  const handleLinkClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      if (editor === null || disabled || mode !== "visual") {
        return;
      }

      const previousUrl = readLinkHref(editor);
      const nextUrl = window.prompt("Link URL", previousUrl);
      if (nextUrl === null) {
        return;
      }

      const trimmed = nextUrl.trim();
      if (trimmed.length === 0) {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
        return;
      }

      editor.chain().focus().extendMarkRange("link").setLink({ href: trimmed }).run();
    },
    [disabled, editor, mode],
  );

  const rootClassName = disabled
    ? `${styles.root} ${styles.rootDisabled}`
    : styles.root;

  const visualSelected = mode === "visual";
  const markdownSelected = mode === "markdown";

  return (
    <div className={rootClassName}>
      <div className={styles.modeBar}>
        <div
          className={styles.modePill}
          role="group"
          aria-label="Body editor mode"
          id={modeGroupId}
        >
          <button
            type="button"
            className={
              visualSelected
                ? `${styles.modePillButton} ${styles.modePillButtonActive}`
                : styles.modePillButton
            }
            disabled={disabled}
            aria-pressed={visualSelected}
            onClick={() => {
              handleModeChange("visual");
            }}
          >
            Visual
          </button>
          <button
            type="button"
            className={
              markdownSelected
                ? `${styles.modePillButton} ${styles.modePillButtonActive}`
                : styles.modePillButton
            }
            disabled={disabled}
            aria-pressed={markdownSelected}
            onClick={() => {
              handleModeChange("markdown");
            }}
          >
            Markdown
          </button>
        </div>
        <p className={styles.modeHint}>
          {markdownSelected
            ? "Paste or edit markdown here, then switch to Visual to see formatting."
            : "Use the toolbar, or switch to Markdown to paste a full draft."}
        </p>
      </div>

      {visualSelected ? (
        <>
          <div className={styles.toolbar} role="toolbar" aria-label="Body formatting">
            <div className={styles.toolbarGroup}>
              <button
                type="button"
                className={toolButtonClass(
                  editor !== null && editor.isActive("heading", { level: 2 }),
                )}
                disabled={disabled || editor === null}
                aria-pressed={editor !== null && editor.isActive("heading", { level: 2 })}
                aria-label="Heading 2"
                onClick={() => {
                  if (editor === null) {
                    return;
                  }
                  editor.chain().focus().toggleHeading({ level: 2 }).run();
                }}
              >
                H2
              </button>
              <button
                type="button"
                className={toolButtonClass(
                  editor !== null && editor.isActive("heading", { level: 3 }),
                )}
                disabled={disabled || editor === null}
                aria-pressed={editor !== null && editor.isActive("heading", { level: 3 })}
                aria-label="Heading 3"
                onClick={() => {
                  if (editor === null) {
                    return;
                  }
                  editor.chain().focus().toggleHeading({ level: 3 }).run();
                }}
              >
                H3
              </button>
            </div>

            <div className={styles.toolbarDivider} aria-hidden="true" />

            <div className={styles.toolbarGroup}>
              <button
                type="button"
                className={toolButtonClass(
                  editor !== null && editor.isActive("bold"),
                  styles.toolButtonBold,
                )}
                disabled={disabled || editor === null}
                aria-pressed={editor !== null && editor.isActive("bold")}
                aria-label="Bold"
                onClick={() => {
                  if (editor === null) {
                    return;
                  }
                  editor.chain().focus().toggleBold().run();
                }}
              >
                B
              </button>
              <button
                type="button"
                className={toolButtonClass(
                  editor !== null && editor.isActive("italic"),
                  styles.toolButtonItalic,
                )}
                disabled={disabled || editor === null}
                aria-pressed={editor !== null && editor.isActive("italic")}
                aria-label="Italic"
                onClick={() => {
                  if (editor === null) {
                    return;
                  }
                  editor.chain().focus().toggleItalic().run();
                }}
              >
                I
              </button>
              <button
                type="button"
                className={toolButtonClass(
                  editor !== null && editor.isActive("link"),
                )}
                disabled={disabled || editor === null}
                aria-pressed={editor !== null && editor.isActive("link")}
                aria-label="Link"
                onClick={handleLinkClick}
              >
                Link
              </button>
              <button
                type="button"
                className={toolButtonClass(
                  editor !== null && editor.isActive("code"),
                  styles.toolButtonCode,
                )}
                disabled={disabled || editor === null}
                aria-pressed={editor !== null && editor.isActive("code")}
                aria-label="Inline code"
                onClick={() => {
                  if (editor === null) {
                    return;
                  }
                  editor.chain().focus().toggleCode().run();
                }}
              >
                {"</>"}
              </button>
            </div>

            <div className={styles.toolbarDivider} aria-hidden="true" />

            <div className={styles.toolbarGroup}>
              <button
                type="button"
                className={toolButtonClass(
                  editor !== null && editor.isActive("bulletList"),
                )}
                disabled={disabled || editor === null}
                aria-pressed={editor !== null && editor.isActive("bulletList")}
                aria-label="Bullet list"
                onClick={() => {
                  if (editor === null) {
                    return;
                  }
                  editor.chain().focus().toggleBulletList().run();
                }}
              >
                • List
              </button>
              <button
                type="button"
                className={toolButtonClass(
                  editor !== null && editor.isActive("orderedList"),
                )}
                disabled={disabled || editor === null}
                aria-pressed={editor !== null && editor.isActive("orderedList")}
                aria-label="Ordered list"
                onClick={() => {
                  if (editor === null) {
                    return;
                  }
                  editor.chain().focus().toggleOrderedList().run();
                }}
              >
                1. List
              </button>
            </div>
          </div>

          <div className={styles.content}>
            <EditorContent editor={editor} />
          </div>
        </>
      ) : (
        <label className={styles.markdownPanel}>
          <span className={styles.markdownLabel}>Markdown source</span>
          <textarea
            className={styles.markdownTextarea}
            value={value}
            disabled={disabled}
            spellCheck={false}
            aria-label="Post body markdown"
            placeholder={"## Heading\n\nPaste your markdown draft here…"}
            onChange={handleMarkdownTextareaChange}
          />
        </label>
      )}
    </div>
  );
}

export default BodyEditor;
