/**
 * @fileoverview CAE Admin Post create / edit form (React island).
 *
 * Wires TipTap BodyEditor plus FAQ / sources / tags / related widgets.
 * Persists via `@seo/blog` with `site_id` always from props (CAE project id).
 * Cover images upload to Supabase Storage `media/cae/blog/covers/` with URL paste fallback.
 * Slug and reading time are preview-only (derived from title and body).
 */

import {
  createPost,
  deletePost,
  isPostLive,
  isPostScheduled,
  readingTimeMinutesFromMarkdown,
  updatePost,
  type Author,
  type BlogPost,
  type BlogSupabaseClient,
  type Category,
  type CreatePostInput,
  type FaqItem,
  type PostStatus,
  type SourceItem,
  type UpdatePostInput,
} from "@seo/blog";
import { createBrowserClient } from "@seo/db";
import {
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
  type JSX,
} from "react";

import { SLUG_FORMAT_PATTERN, slugifyTitle } from "../../lib/post-slug";
import {
  BLOG_COVER_UPLOAD_HINT,
  uploadBlogCoverImage,
} from "../../lib/storage";
import { BodyEditor } from "./BodyEditor";
import { FaqEditor } from "./FaqEditor";
import { SourcesEditor } from "./SourcesEditor";
import { TagsInput } from "./TagsInput";
import styles from "./PostForm.module.css";

/**
 * Serializable props for the Post create / edit island.
 */
export type PostFormProps = {
  /** `"create"` for new Posts; `"edit"` when `initialPost` is provided. */
  mode: "create" | "edit";
  /** CAE brand `sites.id` UUID (`caeSiteConfig.projectId`). */
  siteId: string;
  /** Absolute-from-origin path to the Posts list (e.g. `/cae/admin/posts`). */
  postsListHref: string;
  /**
   * Absolute-from-origin base for post edit URLs without trailing slash
   * (e.g. `/cae/admin/posts`). Create redirects to `{postsBaseHref}/{id}/edit`.
   */
  postsBaseHref: string;
  /** Site Author profile (byline); may be null until Author Admin is filled. */
  author: Author | null;
  /** Categories available for this site. */
  categories: Category[];
  /**
   * Unique tags already used on Posts for this site (typeahead catalog).
   * Empty array when the site has no tagged Posts yet.
   */
  existingTags: string[];
  /** Existing Post when editing; omit or null for create. */
  initialPost?: BlogPost | null;
  /**
   * When true, slug field is read-only and submit omits slug changes.
   * True after the Post has ever been published (`published_at` set or non-draft status).
   */
  slugLocked: boolean;
};

/**
 * Admin status select value. `"scheduled"` is UI-only; the DB still stores
 * `status = published` with a future `published_at`.
 */
type PublishIntent = "draft" | "published" | "scheduled" | "archived";

/**
 * Internal editable form state (camelCase domain fields).
 */
type PostFormState = {
  slug: string;
  title: string;
  excerpt: string;
  bodyMd: string;
  publishIntent: PublishIntent;
  publishedAtLocal: string;
  keyTakeaway: string;
  faq: FaqItem[];
  sources: SourceItem[];
  heroImageUrl: string;
  heroImageAlt: string;
  categoryId: string;
  tags: string[];
};

/**
 * Maps a stored Post into the Admin publish intent select value.
 *
 * @param post - Existing Post (or null for create defaults).
 * @returns UI intent for the status `<select>`.
 */
function publishIntentFromPost(post: BlogPost | null): PublishIntent {
  if (post === null) {
    return "draft";
  }
  if (post.status === "draft") {
    return "draft";
  }
  if (post.status === "archived") {
    return "archived";
  }
  if (isPostScheduled(post)) {
    return "scheduled";
  }
  return "published";
}

/**
 * Maps Admin publish intent to the stored `posts.status` value.
 *
 * @param intent - UI select value.
 * @returns DB status (`scheduled` → `published`).
 */
function storedStatusFromIntent(intent: PublishIntent): PostStatus {
  if (intent === "scheduled") {
    return "published";
  }
  return intent;
}

/**
 * True when the intent requires Author + Body (go-live or scheduled go-live).
 *
 * @param intent - UI select value.
 * @returns Whether publish validation applies.
 */
function isPublishLikeIntent(intent: PublishIntent): boolean {
  return intent === "published" || intent === "scheduled";
}

/**
 * Narrows unknown env values to non-empty strings.
 *
 * @param value - Candidate env value.
 * @returns Trimmed string or `undefined`.
 */
function readPublicEnv(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * Builds an authenticated browser client typed for `@seo/blog` helpers.
 *
 * @returns Blog-scoped Supabase browser client.
 */
function createAdminBlogClient(): BlogSupabaseClient {
  const supabaseUrl = readPublicEnv(import.meta.env.PUBLIC_SUPABASE_URL);
  const supabaseAnonKey = readPublicEnv(import.meta.env.PUBLIC_SUPABASE_ANON_KEY);
  if (supabaseUrl === undefined || supabaseAnonKey === undefined) {
    throw new Error(
      "Supabase is not configured. Set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  const client = createBrowserClient({
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
  });

  return client as BlogSupabaseClient;
}

/**
 * Formats an ISO timestamp for a `datetime-local` input (local timezone).
 *
 * @param iso - ISO-8601 timestamp or null.
 * @returns `YYYY-MM-DDTHH:mm` or empty string.
 */
function toDatetimeLocalValue(iso: string | null): string {
  if (iso === null || iso.trim().length === 0) {
    return "";
  }

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (value: number): string => String(value).padStart(2, "0");
  return [
    `${String(date.getFullYear())}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`,
  ].join("");
}

/**
 * Parses a `datetime-local` value into an ISO-8601 UTC string.
 *
 * @param localValue - Value from a datetime-local input.
 * @returns ISO string, or null when empty / invalid.
 */
function fromDatetimeLocalValue(localValue: string): string | null {
  const trimmed = localValue.trim();
  if (trimmed.length === 0) {
    return null;
  }

  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

/**
 * Formats an ISO timestamp for read-only display.
 *
 * @param iso - ISO-8601 timestamp.
 * @returns Locale string, or em dash when invalid.
 */
function formatDisplayDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Builds the post-save success message from the saved Post.
 *
 * Published + future go-live reads as scheduled; published + past/now reads as
 * live. Draft and archived keep the existing neutral confirmation tone.
 *
 * @param post - Post returned from create or update.
 * @returns User-facing confirmation string.
 */
function formatSaveSuccessMessage(post: BlogPost): string {
  if (post.status === "draft") {
    return "Post saved.";
  }
  if (post.status === "archived") {
    return "Post saved.";
  }
  if (post.status === "published") {
    if (isPostScheduled(post)) {
      const when =
        post.publishedAt !== null
          ? formatDisplayDateTime(post.publishedAt)
          : "the selected time";
      return `Scheduled for ${when}.`;
    }
    if (isPostLive(post)) {
      return "Published.";
    }
    return "Published.";
  }
  return "Post saved.";
}

/**
 * Maps a {@link BlogPost} (or empty create defaults) into form state.
 *
 * @param post - Existing post or null for create.
 * @returns Initial form state.
 */
function buildInitialState(post: BlogPost | null): PostFormState {
  if (post === null) {
    return {
      slug: "",
      title: "",
      excerpt: "",
      bodyMd: "",
      publishIntent: "draft",
      publishedAtLocal: "",
      keyTakeaway: "",
      faq: [],
      sources: [],
      heroImageUrl: "",
      heroImageAlt: "",
      categoryId: "",
      tags: [],
    };
  }

  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    bodyMd: post.bodyMd,
    publishIntent: publishIntentFromPost(post),
    publishedAtLocal: toDatetimeLocalValue(post.publishedAt),
    keyTakeaway: post.keyTakeaway ?? "",
    faq: post.faq,
    sources: post.sources,
    heroImageUrl: post.heroImageUrl ?? "",
    heroImageAlt: post.heroImageAlt ?? "",
    categoryId: post.categoryId ?? "",
    tags: post.tags,
  };
}

/**
 * Converts unknown errors into a short user-facing message.
 *
 * @param error - Caught value.
 * @returns Safe message string.
 */
function toErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }
  return "Something went wrong. Please try again.";
}

/**
 * Empty-string → null helper for optional URL / text fields.
 *
 * @param value - Raw form string.
 * @returns Trimmed string or null.
 */
function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Field-linked validation result for the Post form.
 */
type PostFormValidationError = {
  /** User-facing summary message. */
  message: string;
  /** DOM id of the primary field to highlight and scroll into view. */
  fieldId: string;
};

/**
 * Validates required fields before create / update.
 *
 * @param state - Current form state.
 * @param author - Site Author (required when publishing).
 * @returns Field-linked error, or null when valid.
 */
function validateBeforeSave(
  state: PostFormState,
  author: Author | null,
): PostFormValidationError | null {
  if (state.title.trim().length === 0) {
    return { message: "Title is required.", fieldId: "post-title" };
  }
  if (state.slug.trim().length === 0) {
    return { message: "Slug is required.", fieldId: "post-slug" };
  }
  if (!SLUG_FORMAT_PATTERN.test(state.slug.trim())) {
    return {
      message: "Slug must be lowercase letters, numbers, and hyphens only.",
      fieldId: "post-slug",
    };
  }
  if (isPublishLikeIntent(state.publishIntent) && author === null) {
    return {
      message: "Set up the site Author profile before publishing.",
      fieldId: "post-author",
    };
  }
  if (isPublishLikeIntent(state.publishIntent) && state.bodyMd.trim().length === 0) {
    return {
      message: "Body is required before publishing.",
      fieldId: "post-body",
    };
  }
  if (state.publishIntent === "scheduled") {
    if (state.publishedAtLocal.trim().length === 0) {
      return {
        message: "Publish at is required when status is Scheduled.",
        fieldId: "post-published-at",
      };
    }
    const goLive = fromDatetimeLocalValue(state.publishedAtLocal);
    if (goLive === null) {
      return {
        message: "Publish at is invalid.",
        fieldId: "post-published-at",
      };
    }
    if (Date.parse(goLive) <= Date.now()) {
      return {
        message: "Publish at must be in the future for Scheduled posts.",
        fieldId: "post-published-at",
      };
    }
  }
  return null;
}

/**
 * Scrolls the first invalid field into view when present in the document.
 *
 * @param fieldId - Element id to focus/scroll.
 */
function scrollFieldIntoView(fieldId: string): void {
  const element = document.getElementById(fieldId);
  if (element === null) {
    return;
  }
  element.scrollIntoView({ behavior: "smooth", block: "center" });
  if (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement ||
    element instanceof HTMLButtonElement
  ) {
    element.focus({ preventScroll: true });
  }
}

/**
 * Full Post create / edit form for CAE Admin.
 *
 * @param props - Mode, site scope, lookups, and optional initial Post.
 * @returns Form island UI.
 */
export function PostForm(props: PostFormProps): JSX.Element {
  const {
    mode,
    siteId,
    postsListHref,
    postsBaseHref,
    author,
    categories,
    existingTags,
    initialPost = null,
    slugLocked: slugLockedProp,
  } = props;

  if (typeof siteId !== "string" || siteId.trim().length === 0) {
    throw new Error("PostForm requires a non-empty siteId.");
  }
  if (typeof postsListHref !== "string" || postsListHref.trim().length === 0) {
    throw new Error("PostForm requires postsListHref.");
  }
  if (typeof postsBaseHref !== "string" || postsBaseHref.trim().length === 0) {
    throw new Error("PostForm requires postsBaseHref.");
  }
  if (mode !== "create" && mode !== "edit") {
    throw new Error('PostForm mode must be "create" or "edit".');
  }
  if (mode === "edit" && (initialPost === null || initialPost === undefined)) {
    throw new Error('PostForm mode "edit" requires initialPost.');
  }

  const postId = initialPost?.id ?? null;

  const [state, setState] = useState<PostFormState>(() =>
    buildInitialState(initialPost ?? null),
  );
  const [slugLocked, setSlugLocked] = useState<boolean>(slugLockedProp);
  const [updatedAtDisplay, setUpdatedAtDisplay] = useState<string | null>(
    initialPost?.updatedAt ?? null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const authorAdminHref = postsListHref.replace(/\/posts\/?$/, "/author");

  /** Reading time preview — always derived from Body (~200 wpm). */
  const autoReadingMinutes = useMemo(
    () => readingTimeMinutesFromMarkdown(state.bodyMd),
    [state.bodyMd],
  );

  /**
   * Patches one or more form fields.
   *
   * @param patch - Partial state update.
   */
  function patchState(patch: Partial<PostFormState>): void {
    setState((previous) => ({ ...previous, ...patch }));
  }

  /**
   * Handles title changes and keeps the slug preview in sync while unlocked.
   *
   * @param event - Title input change event.
   */
  function handleTitleChange(event: ChangeEvent<HTMLInputElement>): void {
    const title = event.target.value;
    if (!slugLocked) {
      patchState({ title, slug: slugifyTitle(title) });
      return;
    }
    patchState({ title });
  }

  /**
   * Updates publish intent. Published = go live now (no date picker).
   * Scheduled shows / keeps the go-live datetime field.
   *
   * @param event - Status select change event.
   */
  function handleStatusChange(event: ChangeEvent<HTMLSelectElement>): void {
    const nextIntent = event.target.value;
    if (
      nextIntent !== "draft" &&
      nextIntent !== "published" &&
      nextIntent !== "scheduled" &&
      nextIntent !== "archived"
    ) {
      setErrorMessage("Invalid status selected.");
      return;
    }

    if (nextIntent === "published") {
      patchState({
        publishIntent: nextIntent,
        publishedAtLocal: toDatetimeLocalValue(new Date().toISOString()),
      });
      return;
    }

    if (
      nextIntent === "scheduled" &&
      state.publishedAtLocal.trim().length === 0
    ) {
      patchState({
        publishIntent: nextIntent,
        publishedAtLocal: "",
      });
      return;
    }

    patchState({ publishIntent: nextIntent });
  }

  /**
   * Resolves `published_at` for the current intent before save.
   *
   * - Published → keep an already-past go-live time; otherwise stamp now.
   * - Scheduled → value from the datetime picker (validated as future).
   * - Draft / Archived → keep picker value when set, otherwise null.
   *
   * @returns ISO timestamp or null.
   */
  function resolvePublishedAtForSave(): string | null {
    if (state.publishIntent === "published") {
      const existing = fromDatetimeLocalValue(state.publishedAtLocal);
      if (existing !== null && Date.parse(existing) <= Date.now()) {
        return existing;
      }
      return new Date().toISOString();
    }
    if (state.publishIntent === "scheduled") {
      return fromDatetimeLocalValue(state.publishedAtLocal);
    }
    return fromDatetimeLocalValue(state.publishedAtLocal);
  }

  /**
   * Uploads a cover image and writes the public URL into the hero field.
   * OG image reuses the same hero URL on save (no separate upload).
   *
   * @param file - Selected image file (or null).
   */
  async function handleCoverUpload(file: File | null): Promise<void> {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (file === null) {
      return;
    }

    setIsUploadingHero(true);

    try {
      const client = createAdminBlogClient();
      const publicUrl = await uploadBlogCoverImage(client, file);
      patchState({ heroImageUrl: publicUrl });
      setSuccessMessage("Hero image uploaded.");
    } catch (error) {
      setErrorMessage(toErrorMessage(error));
    } finally {
      setIsUploadingHero(false);
    }
  }

  /**
   * Shared editorial fields for create and update payloads.
   *
   * @returns Partial update fields derived from form state.
   */
  function buildEditorialFields(): UpdatePostInput {
    return {
      title: state.title.trim(),
      excerpt: state.excerpt.trim(),
      bodyMd: state.bodyMd,
      status: storedStatusFromIntent(state.publishIntent),
      publishedAt: resolvePublishedAtForSave(),
      authorId: author?.id ?? null,
      readingTimeMinutes: autoReadingMinutes,
      heroImageUrl: emptyToNull(state.heroImageUrl),
      heroImageAlt: emptyToNull(state.heroImageAlt),
      /** Same as hero — share cards / social previews reuse the cover. */
      ogImageUrl: emptyToNull(state.heroImageUrl),
      keyTakeaway: emptyToNull(state.keyTakeaway),
      faq: state.faq,
      sources: state.sources,
      categoryId: emptyToNull(state.categoryId),
      tags: state.tags,
      /** Empty = fall back to Title / Summary on public pages (NOT NULL in DB). */
      seoTitle: "",
      seoDescription: "",
      /** Related posts are auto-picked from the same category on the public site. */
      relatedPostIds: [],
    };
  }

  /**
   * Builds a create payload (always includes slug + siteId).
   *
   * @returns Domain create input for `@seo/blog`.
   */
  function buildCreatePayload(): CreatePostInput {
    return {
      siteId,
      slug: state.slug.trim(),
      ...buildEditorialFields(),
      title: state.title.trim(),
    };
  }

  /**
   * Builds an update payload; omits slug when locked after first publish.
   *
   * @param includeSlug - When false, slug is not sent.
   * @returns Domain update input for `@seo/blog`.
   */
  function buildUpdatePayload(includeSlug: boolean): UpdatePostInput {
    const fields = buildEditorialFields();
    if (includeSlug) {
      return { ...fields, slug: state.slug.trim() };
    }
    return fields;
  }

  /**
   * Creates or updates the Post, then redirects (create) or shows success (edit).
   *
   * @param event - Form submit event.
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setFieldErrors({});

    const validationError = validateBeforeSave(state, author);
    if (validationError !== null) {
      setErrorMessage(validationError.message);
      setFieldErrors({ [validationError.fieldId]: validationError.message });
      scrollFieldIntoView(validationError.fieldId);
      return;
    }

    /**
     * Slug lock on submit: never send a changed slug when locked.
     * Also reject if locked and the field somehow differs from the initial slug.
     */
    if (slugLocked && mode === "edit" && initialPost !== null) {
      if (state.slug.trim() !== initialPost.slug) {
        const slugLockMessage =
          "Slug is locked because this Post has been published. Revert the slug to save.";
        setErrorMessage(slugLockMessage);
        setFieldErrors({ "post-slug": slugLockMessage });
        scrollFieldIntoView("post-slug");
        return;
      }
    }

    setIsSaving(true);
    try {
      const client = createAdminBlogClient();

      if (mode === "create") {
        const created = await createPost(client, buildCreatePayload());
        window.location.assign(`${postsBaseHref}/${created.id}/edit`);
        return;
      }

      if (postId === null) {
        throw new Error("Missing post id for update.");
      }

      const updated = await updatePost(
        client,
        siteId,
        postId,
        buildUpdatePayload(!slugLocked),
      );

      if (updated.status === "published" || updated.publishedAt !== null) {
        setSlugLocked(true);
      }

      setSuccessMessage(formatSaveSuccessMessage(updated));
      setUpdatedAtDisplay(updated.updatedAt);
      patchState({
        slug: updated.slug,
        title: updated.title,
        excerpt: updated.excerpt,
        bodyMd: updated.bodyMd,
        publishIntent: publishIntentFromPost(updated),
        publishedAtLocal: toDatetimeLocalValue(updated.publishedAt),
        keyTakeaway: updated.keyTakeaway ?? "",
        faq: updated.faq,
        sources: updated.sources,
        heroImageUrl: updated.heroImageUrl ?? "",
        heroImageAlt: updated.heroImageAlt ?? "",
        categoryId: updated.categoryId ?? "",
        tags: updated.tags,
      });
    } catch (error) {
      setErrorMessage(toErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  /**
   * Sets status to archived and saves immediately (edit mode only).
   */
  async function handleArchive(): Promise<void> {
    if (mode !== "edit" || postId === null || initialPost === null) {
      return;
    }

    const confirmed = window.confirm(
      [
        "Archive this Post?",
        `Title: ${initialPost.title}`,
        "It will leave the public blog until you publish it again.",
      ].join("\n"),
    );
    if (!confirmed) {
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setFieldErrors({});
    setIsSaving(true);

    try {
      const client = createAdminBlogClient();
      const updated = await updatePost(client, siteId, postId, {
        status: "archived",
      });
      patchState({ publishIntent: publishIntentFromPost(updated) });
      setSlugLocked(true);
      setSuccessMessage("Post archived.");
    } catch (error) {
      setErrorMessage(toErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  /**
   * Hard-deletes the Post after confirmation (edit mode only).
   */
  async function handleDelete(): Promise<void> {
    if (mode !== "edit" || postId === null || initialPost === null) {
      return;
    }

    const confirmed = window.confirm(
      [
        "Permanently delete this Post?",
        `Title: ${initialPost.title}`,
        "This cannot be undone (distinct from Archive).",
      ].join("\n"),
    );

    if (!confirmed) {
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsDeleting(true);

    try {
      const client = createAdminBlogClient();
      await deletePost(client, siteId, postId);
      window.location.assign(postsListHref);
    } catch (error) {
      setErrorMessage(toErrorMessage(error));
      setIsDeleting(false);
    }
  }

  const busy = isSaving || isDeleting || isUploadingHero;
  const pageHeading = mode === "create" ? "New post" : "Edit post";
  const authorLabel =
    author === null
      ? "No site Author yet — create one under Author before publishing."
      : `${author.name} (site Author)`;

  /**
   * Returns invalid CSS class when the field has an error.
   *
   * @param fieldId - Field id used in `fieldErrors`.
   * @param baseClass - Base input/select/textarea class from CSS modules.
   * @param invalidClass - Invalid modifier class from CSS modules.
   * @returns Combined className string.
   */
  function inputClass(
    fieldId: string,
    baseClass: string | undefined,
    invalidClass: string | undefined,
  ): string {
    const base = typeof baseClass === "string" ? baseClass : "";
    const invalid = typeof invalidClass === "string" ? invalidClass : "";
    if (fieldErrors[fieldId] !== undefined && invalid.length > 0) {
      return [base, invalid].filter((part) => part.length > 0).join(" ");
    }
    return base;
  }

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{pageHeading}</h1>
          <p className={styles.lede}>
            Create and manage a CAE Post. Slug and reading time are generated
            automatically from the title and body.
          </p>
        </div>
        <a className={styles.backLink} href={postsListHref}>
          ← All posts
        </a>
      </header>

      {errorMessage !== null ? (
        <p className={`${styles.message} ${styles.messageError}`} role="alert">
          {errorMessage}
        </p>
      ) : null}

      {successMessage !== null ? (
        <p className={`${styles.message} ${styles.messageSuccess}`} role="status">
          {successMessage}
        </p>
      ) : null}

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.layout}>
          <div className={styles.mainColumn}>
            <section className={styles.section} aria-labelledby="post-basics-heading">
              <h2 id="post-basics-heading" className={styles.sectionTitle}>
                Basics
              </h2>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="post-title">
                  Title
                </label>
                <input
                  id="post-title"
                  className={inputClass(
                    "post-title",
                    styles.input,
                    styles.inputInvalid,
                  )}
                  type="text"
                  value={state.title}
                  disabled={busy}
                  onChange={handleTitleChange}
                  autoComplete="off"
                  required
                  aria-invalid={fieldErrors["post-title"] !== undefined}
                  aria-describedby={
                    fieldErrors["post-title"] !== undefined
                      ? "post-title-error"
                      : undefined
                  }
                />
                {fieldErrors["post-title"] !== undefined ? (
                  <p id="post-title-error" className={styles.fieldError}>
                    {fieldErrors["post-title"]}
                  </p>
                ) : null}
              </div>

              <div className={styles.field}>
                <span className={styles.label} id="post-slug-label">
                  Slug
                </span>
                <p
                  id="post-slug"
                  className={
                    fieldErrors["post-slug"] !== undefined
                      ? `${styles.previewValue} ${styles.previewValueInvalid}`
                      : styles.previewValue
                  }
                  aria-labelledby="post-slug-label"
                  aria-invalid={fieldErrors["post-slug"] !== undefined}
                  aria-describedby={
                    fieldErrors["post-slug"] !== undefined
                      ? "post-slug-error post-slug-hint"
                      : "post-slug-hint"
                  }
                >
                  {state.slug.trim().length > 0 ? state.slug : "—"}
                </p>
                {fieldErrors["post-slug"] !== undefined ? (
                  <p id="post-slug-error" className={styles.fieldError}>
                    {fieldErrors["post-slug"]}
                  </p>
                ) : null}
                <p id="post-slug-hint" className={styles.hint}>
                  {slugLocked
                    ? "Locked after first publish."
                    : "Auto-generated from the title."}
                </p>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="post-excerpt">
                  Summary
                </label>
                <textarea
                  id="post-excerpt"
                  className={styles.textarea}
                  value={state.excerpt}
                  disabled={busy}
                  onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                    patchState({ excerpt: event.target.value });
                  }}
                  rows={3}
                />
              </div>
            </section>

            <section
              className={styles.section}
              aria-labelledby="post-body-heading"
              id="post-body"
            >
              <h2 id="post-body-heading" className={styles.sectionTitle}>
                Body
              </h2>
              <p className={styles.sectionHint}>
                In-place rich editor. Content is stored as markdown (`body_md`).
              </p>
              {fieldErrors["post-body"] !== undefined ? (
                <p className={styles.fieldError} role="alert">
                  {fieldErrors["post-body"]}
                </p>
              ) : null}
              <BodyEditor
                value={state.bodyMd}
                disabled={busy}
                onChange={(markdown: string) => {
                  patchState({ bodyMd: markdown });
                }}
              />

              <div className={styles.field}>
                <label className={styles.label} htmlFor="post-key-takeaway">
                  Key takeaway
                </label>
                <textarea
                  id="post-key-takeaway"
                  className={styles.textarea}
                  value={state.keyTakeaway}
                  disabled={busy}
                  onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                    patchState({ keyTakeaway: event.target.value });
                  }}
                  rows={3}
                />
              </div>
            </section>

            <section className={styles.section} aria-labelledby="post-images-heading">
              <h2 id="post-images-heading" className={styles.sectionTitle}>
                Images
              </h2>
              <p className={styles.sectionHint}>
                Upload to Supabase Storage (`media/cae/blog/covers/`) or paste a
                URL. This image is also used for social / share previews (OG).
              </p>
              <p className={styles.sectionHint} role="note">
                {BLOG_COVER_UPLOAD_HINT}
              </p>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="post-hero-url">
                  Hero image URL
                </label>
                <input
                  id="post-hero-url"
                  className={styles.input}
                  type="url"
                  value={state.heroImageUrl}
                  disabled={busy}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    patchState({ heroImageUrl: event.target.value });
                  }}
                  placeholder="https://"
                  autoComplete="off"
                />
                <div className={styles.fileRow}>
                  <input
                    className={styles.fileInput}
                    type="file"
                    accept="image/*"
                    disabled={busy}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      const list = event.target.files;
                      const file =
                        list !== null && list.length > 0 ? list.item(0) : null;
                      void handleCoverUpload(file);
                      event.target.value = "";
                    }}
                  />
                  {isUploadingHero ? (
                    <span className={styles.hint}>Uploading…</span>
                  ) : null}
                </div>
                {state.heroImageUrl.trim().length > 0 ? (
                  <img
                    className={styles.imagePreview}
                    src={state.heroImageUrl}
                    alt={
                      state.heroImageAlt.trim().length > 0
                        ? state.heroImageAlt
                        : "Hero preview"
                    }
                  />
                ) : null}
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="post-hero-alt">
                  Hero image description
                </label>
                <input
                  id="post-hero-alt"
                  className={styles.input}
                  type="text"
                  value={state.heroImageAlt}
                  disabled={busy}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    patchState({ heroImageAlt: event.target.value });
                  }}
                  autoComplete="off"
                />
              </div>
            </section>

            <TagsInput
              value={state.tags}
              existingTags={existingTags}
              onChange={(next: string[]) => {
                patchState({ tags: next });
              }}
            />

            <FaqEditor
              value={state.faq}
              onChange={(next: FaqItem[]) => {
                patchState({ faq: next });
              }}
            />

            <SourcesEditor
              value={state.sources}
              onChange={(next: SourceItem[]) => {
                patchState({ sources: next });
              }}
            />
          </div>

          <aside className={styles.sidebar} aria-label="Publish settings">
            <section className={styles.section} aria-labelledby="post-publish-heading">
              <h2 id="post-publish-heading" className={styles.sectionTitle}>
                Publish
              </h2>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="post-status">
                  Status
                </label>
                <select
                  id="post-status"
                  className={styles.select}
                  value={state.publishIntent}
                  disabled={busy}
                  onChange={handleStatusChange}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="archived">Archived</option>
                </select>
                <p className={styles.hint}>
                  {state.publishIntent === "published"
                    ? "Goes live on the public blog immediately."
                    : state.publishIntent === "scheduled"
                      ? "Approved to go live at the Publish at time below."
                      : state.publishIntent === "archived"
                        ? "Hidden from the public blog."
                        : "Not visible on the public blog."}
                </p>
              </div>

              {state.publishIntent === "scheduled" ? (
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="post-published-at">
                    Publish at
                  </label>
                  <input
                    id="post-published-at"
                    className={inputClass(
                      "post-published-at",
                      styles.input,
                      styles.inputInvalid,
                    )}
                    type="datetime-local"
                    value={state.publishedAtLocal}
                    disabled={busy}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      patchState({ publishedAtLocal: event.target.value });
                    }}
                    aria-invalid={fieldErrors["post-published-at"] !== undefined}
                    aria-describedby={
                      fieldErrors["post-published-at"] !== undefined
                        ? "post-published-at-error post-published-at-hint"
                        : "post-published-at-hint"
                    }
                  />
                  {fieldErrors["post-published-at"] !== undefined ? (
                    <p id="post-published-at-error" className={styles.fieldError}>
                      {fieldErrors["post-published-at"]}
                    </p>
                  ) : null}
                  <p id="post-published-at-hint" className={styles.hint}>
                    Local time; stored as UTC. Must be in the future.
                  </p>
                </div>
              ) : null}

              {state.publishIntent === "published" &&
              state.publishedAtLocal.trim().length > 0 ? (
                <p className={styles.metaLine}>
                  Live since{" "}
                  {formatDisplayDateTime(
                    fromDatetimeLocalValue(state.publishedAtLocal) ??
                      new Date().toISOString(),
                  )}
                </p>
              ) : null}

              {updatedAtDisplay !== null ? (
                <p className={styles.metaLine}>
                  Updated {formatDisplayDateTime(updatedAtDisplay)}
                </p>
              ) : null}

              <div className={styles.field} id="post-author">
                <span className={styles.label}>Author</span>
                <p className={styles.metaLine}>{authorLabel}</p>
                {fieldErrors["post-author"] !== undefined ? (
                  <p className={styles.fieldError} role="alert">
                    {fieldErrors["post-author"]}
                  </p>
                ) : null}
                <p className={styles.hint}>
                  Byline comes from the site Author profile.{" "}
                  <a className={styles.backLink} href={authorAdminHref}>
                    Edit Author
                  </a>
                </p>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="post-category">
                  Category
                </label>
                <select
                  id="post-category"
                  className={styles.select}
                  value={state.categoryId}
                  disabled={busy}
                  onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                    patchState({ categoryId: event.target.value });
                  }}
                >
                  <option value="">No category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <span className={styles.label} id="post-reading-time-label">
                  Reading time
                </span>
                <p
                  id="post-reading-time"
                  className={styles.previewValue}
                  aria-labelledby="post-reading-time-label"
                  aria-describedby="post-reading-time-hint"
                >
                  {`${String(autoReadingMinutes)} min`}
                </p>
                <p id="post-reading-time-hint" className={styles.hint}>
                  Auto estimate from Body (~200 wpm).
                </p>
              </div>
            </section>
          </aside>
        </div>

        <div className={styles.actions}>
          <button
            type="submit"
            className={`${styles.btn} ${styles.btnPrimary}`}
            disabled={busy}
          >
            {isSaving ? "Saving…" : "Save post"}
          </button>

          {mode === "edit" && state.publishIntent !== "archived" ? (
            <button
              type="button"
              className={styles.btn}
              disabled={busy}
              onClick={() => {
                void handleArchive();
              }}
            >
              Archive
            </button>
          ) : null}

          {mode === "edit" ? (
            <button
              type="button"
              className={`${styles.btn} ${styles.btnDanger}`}
              disabled={busy}
              onClick={() => {
                void handleDelete();
              }}
            >
              {isDeleting ? "Deleting…" : "Delete permanently"}
            </button>
          ) : null}
        </div>
      </form>
    </div>
  );
}

export default PostForm;
