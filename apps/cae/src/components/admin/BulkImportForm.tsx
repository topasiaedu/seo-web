/**
 * @fileoverview CAE Admin bulk Post import (React island).
 *
 * Lets an Admin paste or upload one Markdown document containing many Posts
 * (frontmatter + body per post, separated by `===NEW POST===`), attach one
 * hero image per parsed post, set Malaysia Time go-live slots (section 4),
 * preview the result, then create every valid Post via `@seo/blog`.
 *
 * Runs entirely as the signed-in Admin (browser Supabase client + cookie
 * session). Categories referenced by name that do not exist yet are created
 * on the fly. Covers may be a `heroImageUrl` in frontmatter or a file uploaded
 * per post in section 3. Publish times come from section 4 only — Markdown
 * `publishAt` is ignored.
 */
import {
  createCategory,
  createPost,
  type Author,
  type BlogSupabaseClient,
  type Category,
  type CreatePostInput,
  type PostStatus,
} from "@seo/blog";
import { createBrowserClient } from "@seo/db";
import { useEffect, useMemo, useState, type ChangeEvent, type JSX } from "react";

import {
  isBulkImportRowReady,
  parseBulkImportDocument,
  POST_DIVIDER_LINE,
  resolveBulkImportRows,
  type BulkImportCategoryLookup,
  type BulkImportStatusIntent,
  type ParsedBulkPost,
} from "../../lib/bulk-import";
import {
  applyCadenceSchedule,
  buildMytIso,
  formatMytPreview,
  isValidDateYmd,
  isValidTimeHm,
  type MytDateTimeParts,
} from "../../lib/bulk-import-schedule";
import { buildBulkImportWriterTemplate } from "../../lib/bulk-import-template";
import { slugifyTitle } from "../../lib/post-slug";
import {
  BLOG_COVER_UPLOAD_HINT,
  uploadBlogCoverImage,
} from "../../lib/storage";
import styles from "./BulkImportForm.module.css";

/** Serializable props for the bulk import island. */
export type BulkImportFormProps = {
  /** CAE brand `sites.id` UUID (`caeSiteConfig.projectId`). */
  siteId: string;
  /** Absolute-from-origin path to the Posts list. */
  postsListHref: string;
  /** Absolute-from-origin base for post edit URLs without trailing slash. */
  postsBaseHref: string;
  /** Site Author profile (byline); required before publishing/scheduling rows. */
  author: Author | null;
  /** Categories available for this site at page load. */
  categories: Category[];
  /** Distinct tags already used on Posts for this site at page load. */
  existingTags: string[];
  /** Slugs already used by Posts on this site at page load. */
  existingSlugs: string[];
};

/** Per-row import progress, tracked separately from the parsed preview data. */
type RowRuntimeStatus = "idle" | "creating" | "created" | "failed";

/** Runtime state for one row during an import run. */
type RowRuntimeState = {
  status: RowRuntimeStatus;
  message: string | null;
  postId: string | null;
};

/** Copy-to-clipboard feedback for the writer template toolbar. */
type TemplateCopyState = "idle" | "copied" | "failed";

/** Cadence helper field state for the current import batch only. */
type CadenceHelperState = {
  startDate: string;
  timeOfDay: string;
  intervalDays: string;
};

/** Resolved go-live intent after merging Markdown status with section 4 UI. */
type EffectivePublishState = {
  statusIntent: BulkImportStatusIntent;
  publishAtIso: string | null;
  scheduleError: string | null;
};

/** Default cadence helper values (empty start date — writer must choose). */
const DEFAULT_CADENCE: CadenceHelperState = {
  startDate: "",
  timeOfDay: "08:00",
  intervalDays: "1",
};

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
 * Narrows public env values to non-empty strings.
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

  const client = createBrowserClient({ url: supabaseUrl, anonKey: supabaseAnonKey });
  return client as BlogSupabaseClient;
}

/**
 * Maps the writer-facing status intent to the stored `posts.status` value.
 *
 * @param intent - Effective status after schedule merge.
 * @returns DB status (`scheduled` maps to `published`, matching Admin's
 *   lazy time-gate model — see `docs/implementation-plan/cae-blog-scheduling.md`).
 */
function mapStatusIntentToStored(intent: BulkImportStatusIntent): PostStatus {
  if (intent === "scheduled") {
    return "published";
  }
  return intent;
}

/**
 * Reads schedule parts for one post, treating blank date or time as unset.
 *
 * @param parts - UI schedule slot, or `undefined` when never set.
 * @returns Parts when both fields are non-empty, otherwise `null`.
 */
function readScheduleParts(parts: MytDateTimeParts | undefined): MytDateTimeParts | null {
  if (parts === undefined) {
    return null;
  }
  const dateYmd = parts.dateYmd.trim();
  const timeHm = parts.timeHm.trim();
  if (dateYmd.length === 0 && timeHm.length === 0) {
    return null;
  }
  if (dateYmd.length === 0 || timeHm.length === 0) {
    return { dateYmd, timeHm };
  }
  return { dateYmd, timeHm };
}

/**
 * Merges Markdown status with section 4 MYT schedule UI.
 *
 * A future UI go-live time schedules the post (overrides draft/published).
 * Archived rows keep archived and ignore schedule times. Markdown `publishAt`
 * is never used.
 *
 * @param entry - Parsed row.
 * @param scheduleParts - Per-post MYT date/time from section 4, if any.
 * @returns Effective status, UTC ISO go-live, and optional schedule error.
 */
function resolveEffectivePublish(
  entry: ParsedBulkPost,
  scheduleParts: MytDateTimeParts | undefined,
): EffectivePublishState {
  if (entry.statusIntent === "archived") {
    return {
      statusIntent: "archived",
      publishAtIso: null,
      scheduleError: null,
    };
  }

  const parts = readScheduleParts(scheduleParts);
  if (parts !== null) {
    if (!isValidDateYmd(parts.dateYmd) || !isValidTimeHm(parts.timeHm)) {
      return {
        statusIntent: entry.statusIntent,
        publishAtIso: null,
        scheduleError: "Go-live date/time in section 4 is incomplete or invalid.",
      };
    }
    const publishAtIso = buildMytIso(parts.dateYmd, parts.timeHm);
    if (publishAtIso === null) {
      return {
        statusIntent: entry.statusIntent,
        publishAtIso: null,
        scheduleError: "Go-live date/time in section 4 could not be read.",
      };
    }
    if (Date.parse(publishAtIso) <= Date.now()) {
      return {
        statusIntent: "scheduled",
        publishAtIso,
        scheduleError: "Go-live time in section 4 must be in the future (Malaysia Time).",
      };
    }
    return {
      statusIntent: "scheduled",
      publishAtIso,
      scheduleError: null,
    };
  }

  if (entry.statusIntent === "scheduled") {
    return {
      statusIntent: "scheduled",
      publishAtIso: null,
      scheduleError: "Set a go-live date and time in section 4 (Malaysia Time).",
    };
  }

  return {
    statusIntent: entry.statusIntent,
    publishAtIso: null,
    scheduleError: null,
  };
}

/**
 * Builds the `createPost` payload for one resolved row.
 *
 * @param siteId - Brand `sites.id` UUID.
 * @param author - Site Author (byline); `null` when not yet configured.
 * @param entry - Parsed + resolved row.
 * @param categoryId - Resolved category id, or `null`.
 * @param heroImageUrl - Resolved hero image URL, or `null`.
 * @param effective - Merged status + go-live from section 4.
 * @returns Create payload for `@seo/blog` `createPost`.
 */
function buildCreatePostInput(
  siteId: string,
  author: Author | null,
  entry: ParsedBulkPost,
  categoryId: string | null,
  heroImageUrl: string | null,
  effective: EffectivePublishState,
): CreatePostInput {
  return {
    siteId,
    slug: entry.slug,
    title: entry.title,
    excerpt: entry.excerpt,
    bodyMd: entry.bodyMd,
    status: mapStatusIntentToStored(effective.statusIntent),
    publishedAt: effective.publishAtIso,
    authorId: author?.id ?? null,
    heroImageUrl,
    heroImageAlt: entry.heroImageAlt,
    /** Same as hero — share cards / social previews reuse the cover. */
    ogImageUrl: heroImageUrl,
    keyTakeaway: entry.keyTakeaway,
    faq: entry.faq,
    sources: entry.sources,
    categoryId,
    tags: entry.tags,
    /** Empty = fall back to Title / Summary on public pages (NOT NULL in DB). */
    seoTitle: "",
    seoDescription: "",
    relatedPostIds: [],
  };
}

/**
 * Reads every `File` in a `FileList` into an array (skips null slots).
 *
 * @param fileList - Raw `<input type="file">` file list, or `null`.
 * @returns Files in list order.
 */
function readFileListEntries(fileList: FileList | null): File[] {
  if (fileList === null) {
    return [];
  }
  const files: File[] = [];
  for (let position = 0; position < fileList.length; position += 1) {
    const file = fileList.item(position);
    if (file !== null) {
      files.push(file);
    }
  }
  return files;
}

/**
 * Human-readable label for effective publish intent (after section 4 merge).
 *
 * @param intent - Effective status intent.
 * @returns Display label matching the Admin Post form's status options.
 */
function formatStatusIntentLabel(intent: BulkImportStatusIntent): string {
  switch (intent) {
    case "scheduled":
      return "Scheduled";
    case "published":
      return "Published";
    case "archived":
      return "Archived";
    default:
      return "Draft";
  }
}

/**
 * Formats a row's category for the preview table.
 *
 * @param entry - Resolved row.
 * @returns Category name (marked "(new)" when it will be created), or an em dash.
 */
function formatCategoryPreview(entry: ParsedBulkPost): string {
  if (entry.categoryName === null) {
    return "—";
  }
  return entry.categoryAction === "create" ? `${entry.categoryName} (new)` : entry.categoryName;
}

/**
 * Formats a row's hero image source for the preview table.
 *
 * @param entry - Parsed row.
 * @param attachedFile - Per-post file from section 3, if any.
 * @returns "URL", the attached filename, or an em dash.
 */
function formatImagePreview(entry: ParsedBulkPost, attachedFile: File | undefined): string {
  if (entry.heroImageUrl !== null) {
    return "URL (in markdown)";
  }
  if (attachedFile !== undefined) {
    return attachedFile.name;
  }
  return "—";
}

/**
 * Builds the full list of blocking issues shown for a row (parse errors, slug
 * conflicts, and section 4 schedule problems).
 *
 * @param entry - Resolved row.
 * @param effective - Merged publish state for the row.
 * @returns Issue strings; empty when the row is ready to import.
 */
function collectRowIssues(entry: ParsedBulkPost, effective: EffectivePublishState): string[] {
  const issues = [...entry.errors];
  if (entry.slugConflict === "duplicate") {
    issues.push("Duplicate slug elsewhere in this batch.");
  }
  if (entry.slugConflict === "existing") {
    issues.push("A Post with this slug already exists — will be skipped.");
  }
  if (effective.scheduleError !== null) {
    issues.push(effective.scheduleError);
  }
  return issues;
}

/**
 * Whether a row can be imported after schedule merge.
 *
 * @param entry - Resolved row.
 * @param effective - Merged publish state.
 * @returns `true` when parse/slug/schedule checks all pass.
 */
function isRowReadyWithSchedule(
  entry: ParsedBulkPost,
  effective: EffectivePublishState,
): boolean {
  return isBulkImportRowReady(entry) && effective.scheduleError === null;
}

/**
 * Parses the cadence interval field into an integer ≥ 1.
 *
 * @param raw - Interval days string from the helper input.
 * @returns Integer ≥ 1, or `null` when invalid.
 */
function parseIntervalDays(raw: string): number | null {
  const trimmed = raw.trim();
  if (trimmed.length === 0) {
    return null;
  }
  const parsed = Number(trimmed);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return null;
  }
  return parsed;
}

/**
 * Bulk Post import form for CAE Admin.
 *
 * @param props - Site scope, lookups, and Author for byline assignment.
 * @returns Form island UI.
 */
export function BulkImportForm(props: BulkImportFormProps): JSX.Element {
  const {
    siteId,
    postsListHref,
    postsBaseHref,
    author,
    categories,
    existingTags,
    existingSlugs,
  } = props;

  if (typeof siteId !== "string" || siteId.trim().length === 0) {
    throw new Error("BulkImportForm requires a non-empty siteId.");
  }

  const [rawText, setRawText] = useState("");
  /** Hero image file keyed by 1-based post index from the parsed document. */
  const [heroImagesByIndex, setHeroImagesByIndex] = useState<Record<number, File>>({});
  /** Per-post MYT go-live slots keyed by 1-based post index (current batch only). */
  const [scheduleByIndex, setScheduleByIndex] = useState<Record<number, MytDateTimeParts>>({});
  const [cadence, setCadence] = useState<CadenceHelperState>(DEFAULT_CADENCE);
  const [cadenceError, setCadenceError] = useState<string | null>(null);
  const [knownCategories, setKnownCategories] = useState<Category[]>(categories);
  const [knownSlugs, setKnownSlugs] = useState<Set<string>>(() => new Set(existingSlugs));
  const [rowStates, setRowStates] = useState<Record<number, RowRuntimeState>>({});
  const [isImporting, setIsImporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [summary, setSummary] = useState<{ created: number; failed: number } | null>(null);
  const [templateCopyState, setTemplateCopyState] = useState<TemplateCopyState>("idle");

  /**
   * Writer/LLM template with live category + tag lists from this Admin page load
   * (and any categories created during the current import session).
   */
  const writerTemplate = useMemo(
    () =>
      buildBulkImportWriterTemplate({
        categories: knownCategories.map((category) => category.name),
        tags: existingTags,
      }),
    [knownCategories, existingTags],
  );

  const categoryLookups: BulkImportCategoryLookup[] = useMemo(
    () => knownCategories.map((category) => ({ id: category.id, name: category.name })),
    [knownCategories],
  );

  const rows = useMemo(() => {
    const parsed = parseBulkImportDocument(rawText);
    return resolveBulkImportRows(parsed, {
      categories: categoryLookups,
      existingSlugs: knownSlugs,
    });
  }, [rawText, categoryLookups, knownSlugs]);

  /**
   * Drops hero uploads and schedule slots for indexes that no longer exist
   * after the Markdown document changes (new batch / edited paste).
   */
  useEffect(() => {
    const validIndexes = new Set(rows.map((entry) => entry.index));
    setHeroImagesByIndex((previous) => {
      let changed = false;
      const next: Record<number, File> = {};
      for (const [key, file] of Object.entries(previous)) {
        const index = Number(key);
        if (validIndexes.has(index)) {
          next[index] = file;
        } else {
          changed = true;
        }
      }
      return changed ? next : previous;
    });
    setScheduleByIndex((previous) => {
      let changed = false;
      const next: Record<number, MytDateTimeParts> = {};
      for (const [key, parts] of Object.entries(previous)) {
        const index = Number(key);
        if (validIndexes.has(index)) {
          next[index] = parts;
        } else {
          changed = true;
        }
      }
      return changed ? next : previous;
    });
  }, [rows]);

  const effectiveByIndex = useMemo(() => {
    const map = new Map<number, EffectivePublishState>();
    for (const entry of rows) {
      map.set(entry.index, resolveEffectivePublish(entry, scheduleByIndex[entry.index]));
    }
    return map;
  }, [rows, scheduleByIndex]);

  const readyRows = useMemo(() => {
    return rows.filter((entry) => {
      const effective = effectiveByIndex.get(entry.index);
      if (effective === undefined) {
        return false;
      }
      return isRowReadyWithSchedule(entry, effective);
    });
  }, [rows, effectiveByIndex]);

  const blockedCount = rows.length - readyRows.length;
  const busy = isImporting;
  const postsWithCoverCount = rows.filter(
    (entry) => entry.heroImageUrl !== null || heroImagesByIndex[entry.index] !== undefined,
  ).length;
  const postsWithScheduleCount = rows.filter((entry) => {
    const parts = readScheduleParts(scheduleByIndex[entry.index]);
    return parts !== null && isValidDateYmd(parts.dateYmd) && isValidTimeHm(parts.timeHm);
  }).length;

  /**
   * Copies the annotated writer template to the clipboard (for LLMs or external editors).
   */
  async function handleCopyTemplate(): Promise<void> {
    setTemplateCopyState("idle");
    try {
      await navigator.clipboard.writeText(writerTemplate);
      setTemplateCopyState("copied");
      window.setTimeout(() => {
        setTemplateCopyState("idle");
      }, 2500);
    } catch {
      setTemplateCopyState("failed");
    }
  }

  /**
   * Downloads the annotated writer template as a `.md` file (handy to attach in
   * ChatGPT / Gemini, or to hand to a human writer).
   */
  function handleDownloadTemplate(): void {
    const blob = new Blob([writerTemplate], {
      type: "text/markdown;charset=utf-8",
    });
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = "cae-bulk-import-template.md";
    anchor.rel = "noopener";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(objectUrl);
  }

  /**
   * Appends the text of one or more uploaded Markdown files to the document,
   * joined with the post divider so file uploads and pasted text behave the same way.
   *
   * @param fileList - Files selected from the Markdown file input.
   */
  async function handleMarkdownFilesSelected(fileList: FileList | null): Promise<void> {
    const files = readFileListEntries(fileList);
    if (files.length === 0) {
      return;
    }

    setErrorMessage(null);
    try {
      const texts = await Promise.all(files.map((file) => file.text()));
      const appended = texts
        .map((text) => text.trim())
        .filter((text) => text.length > 0)
        .join(`\n\n${POST_DIVIDER_LINE}\n\n`);

      if (appended.length === 0) {
        return;
      }

      setRawText((previous) => {
        const previousTrimmed = previous.trim();
        if (previousTrimmed.length === 0) {
          return appended;
        }
        return `${previousTrimmed}\n\n${POST_DIVIDER_LINE}\n\n${appended}`;
      });
    } catch (error) {
      setErrorMessage(toErrorMessage(error));
    }
  }

  /**
   * Assigns a hero image file to one parsed post (by 1-based index).
   *
   * @param postIndex - Post index from the parsed document.
   * @param file - Selected image, or `null` to clear.
   */
  function handleHeroImageForPost(postIndex: number, file: File | null): void {
    setHeroImagesByIndex((previous) => {
      if (file === null) {
        if (previous[postIndex] === undefined) {
          return previous;
        }
        const next = { ...previous };
        delete next[postIndex];
        return next;
      }
      return { ...previous, [postIndex]: file };
    });
  }

  /**
   * Updates one field of a per-post MYT schedule slot.
   *
   * @param postIndex - 1-based post index.
   * @param field - Which part to update.
   * @param value - New date or time string.
   */
  function handleScheduleFieldChange(
    postIndex: number,
    field: keyof MytDateTimeParts,
    value: string,
  ): void {
    setScheduleByIndex((previous) => {
      const existing = previous[postIndex] ?? { dateYmd: "", timeHm: "" };
      const nextParts: MytDateTimeParts = {
        dateYmd: field === "dateYmd" ? value : existing.dateYmd,
        timeHm: field === "timeHm" ? value : existing.timeHm,
      };
      if (nextParts.dateYmd.trim().length === 0 && nextParts.timeHm.trim().length === 0) {
        if (previous[postIndex] === undefined) {
          return previous;
        }
        const next = { ...previous };
        delete next[postIndex];
        return next;
      }
      return { ...previous, [postIndex]: nextParts };
    });
  }

  /**
   * Clears the MYT schedule slot for one post.
   *
   * @param postIndex - 1-based post index.
   */
  function handleClearScheduleForPost(postIndex: number): void {
    setScheduleByIndex((previous) => {
      if (previous[postIndex] === undefined) {
        return previous;
      }
      const next = { ...previous };
      delete next[postIndex];
      return next;
    });
  }

  /**
   * Applies the cadence helper to every post in the current batch (document order).
   */
  function handleApplyCadence(): void {
    setCadenceError(null);
    if (rows.length === 0) {
      setCadenceError("Add Markdown content in section 2 before applying a cadence.");
      return;
    }
    if (!isValidDateYmd(cadence.startDate)) {
      setCadenceError("Choose a valid start date for post 1.");
      return;
    }
    if (!isValidTimeHm(cadence.timeOfDay)) {
      setCadenceError("Enter a valid time of day (HH:mm, Malaysia Time).");
      return;
    }
    const intervalDays = parseIntervalDays(cadence.intervalDays);
    if (intervalDays === null) {
      setCadenceError("Interval must be a whole number of days (1 or more).");
      return;
    }

    try {
      const slots = applyCadenceSchedule({
        startDate: cadence.startDate.trim(),
        timeOfDay: cadence.timeOfDay.trim(),
        intervalDays,
        postCount: rows.length,
      });
      const next: Record<number, MytDateTimeParts> = {};
      rows.forEach((entry, orderIndex) => {
        const slot = slots[orderIndex];
        if (slot !== undefined) {
          next[entry.index] = slot;
        }
      });
      setScheduleByIndex(next);
    } catch (error) {
      setCadenceError(toErrorMessage(error));
    }
  }

  /**
   * Creates every ready row in sequence, resolving categories and hero image
   * uploads per row. Go-live times come from section 4 only.
   */
  async function handleImportAll(): Promise<void> {
    if (readyRows.length === 0) {
      return;
    }

    setIsImporting(true);
    setErrorMessage(null);
    setSummary(null);

    let client: BlogSupabaseClient;
    try {
      client = createAdminBlogClient();
    } catch (error) {
      setErrorMessage(toErrorMessage(error));
      setIsImporting(false);
      return;
    }

    const categoryIdByLowerName = new Map<string, string>(
      knownCategories.map((category) => [category.name.trim().toLowerCase(), category.id]),
    );
    const createdCategories: Category[] = [];
    const createdSlugs: string[] = [];
    let createdCount = 0;
    let failedCount = 0;

    for (const entry of readyRows) {
      setRowStates((previous) => ({
        ...previous,
        [entry.index]: { status: "creating", message: null, postId: null },
      }));

      try {
        let categoryId: string | null = null;
        if (entry.categoryName !== null) {
          const lowerName = entry.categoryName.trim().toLowerCase();
          const cachedId = categoryIdByLowerName.get(lowerName);
          if (cachedId !== undefined) {
            categoryId = cachedId;
          } else {
            const created = await createCategory(client, siteId, {
              slug: slugifyTitle(entry.categoryName),
              name: entry.categoryName,
            });
            categoryIdByLowerName.set(lowerName, created.id);
            createdCategories.push(created);
            categoryId = created.id;
          }
        }

        let heroImageUrl = entry.heroImageUrl;
        const attachedFile = heroImagesByIndex[entry.index];
        if (attachedFile !== undefined) {
          heroImageUrl = await uploadBlogCoverImage(client, attachedFile);
        }

        const effective =
          effectiveByIndex.get(entry.index) ??
          resolveEffectivePublish(entry, scheduleByIndex[entry.index]);
        if (effective.scheduleError !== null) {
          throw new Error(effective.scheduleError);
        }

        const input = buildCreatePostInput(
          siteId,
          author,
          entry,
          categoryId,
          heroImageUrl,
          effective,
        );
        const created = await createPost(client, input);
        createdSlugs.push(created.slug);
        createdCount += 1;
        setRowStates((previous) => ({
          ...previous,
          [entry.index]: { status: "created", message: null, postId: created.id },
        }));
      } catch (error) {
        failedCount += 1;
        setRowStates((previous) => ({
          ...previous,
          [entry.index]: { status: "failed", message: toErrorMessage(error), postId: null },
        }));
      }
    }

    if (createdCategories.length > 0) {
      setKnownCategories((previous) => [...previous, ...createdCategories]);
    }
    if (createdSlugs.length > 0) {
      setKnownSlugs((previous) => {
        const next = new Set(previous);
        for (const slug of createdSlugs) {
          next.add(slug);
        }
        return next;
      });
    }

    setSummary({ created: createdCount, failed: failedCount });
    setIsImporting(false);
  }

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div>
          <h1 className="admin-page__title">Bulk import posts</h1>
          <p className="admin-page__lede">
            Paste or upload one Markdown document with many Posts. Set go-live
            times in Malaysia Time, preview what will be created, then import
            everything in one pass.
          </p>
        </div>
        <a className="admin-link" href={postsListHref}>
          ← All posts
        </a>
      </header>

      {author === null ? (
        <p className="admin-message admin-message--error" role="alert">
          No site Author yet — Published and Scheduled rows will still import,
          but the byline will be empty until you set one up under Author.
        </p>
      ) : null}

      {errorMessage !== null ? (
        <p className="admin-message admin-message--error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <section className="admin-card">
        <div className={styles.templateHeader}>
          <h2 className="admin-card__title">1. Writer template</h2>
          <div className={styles.templateActions}>
            <button
              type="button"
              className="admin-btn admin-btn--small"
              disabled={busy}
              onClick={() => {
                void handleCopyTemplate();
              }}
            >
              {templateCopyState === "copied"
                ? "Copied!"
                : templateCopyState === "failed"
                  ? "Copy failed"
                  : "Copy template"}
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--small"
              disabled={busy}
              onClick={() => {
                handleDownloadTemplate();
              }}
            >
              Download .md
            </button>
          </div>
        </div>
        <p className={styles.instructions}>
          Copy or download the template, then paste/attach it in ChatGPT, Gemini,
          or Claude. The file includes this site&apos;s current categories and
          tags so the AI can reuse them. Ask for a plain{" "}
          <code>bulk-import-posts.md</code> file (download preferred) — not a
          chat explanation and not a pretty rendered article. Posts are separated
          by <code>{POST_DIVIDER_LINE}</code>. Go-live dates are set here in Admin
          section 4 — not in the Markdown.
        </p>
        <details className={styles.templateDetails}>
          <summary className={styles.templateSummary}>Quick field guide</summary>
          <p className={styles.instructions}>
            Required: <code>title</code>, and a body long enough for a{" "}
            <strong>5–15 minute</strong> read (~1,000–3,000 words). Optional:{" "}
            <code>excerpt</code>, <code>category</code>, <code>tags</code>,{" "}
            <code>keyTakeaway</code>, <code>heroImageUrl</code>,{" "}
            <code>heroImageAlt</code>, <code>faq</code>, <code>sources</code>,{" "}
            <code>status</code> (<code>draft</code> | <code>published</code> |{" "}
            <code>archived</code>). Set publish times in section 4 (Malaysia
            Time) after hero images.
          </p>
        </details>
      </section>

      <section className="admin-card">
        <h2 className="admin-card__title">2. Add your content</h2>

        <div className="admin-field">
          <span className="admin-field__label">Upload Markdown file(s)</span>
          <div className={styles.fileRow}>
            <input
              className={styles.fileInput}
              type="file"
              accept=".md,.markdown,text/markdown,text/plain"
              multiple
              disabled={busy}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                void handleMarkdownFilesSelected(event.target.files);
                event.target.value = "";
              }}
            />
          </div>
          <p className="admin-field__hint">
            Uploaded files are appended below, separated automatically by{" "}
            <code>{POST_DIVIDER_LINE}</code>.
          </p>
        </div>

        <div className="admin-field">
          <label className="admin-field__label" htmlFor="bulk-import-text">
            Or paste / edit the document directly
          </label>
          <textarea
            id="bulk-import-text"
            className={styles.textarea}
            value={rawText}
            disabled={busy}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
              setRawText(event.target.value);
            }}
            spellCheck={false}
            placeholder={`Paste your filled template here.\n\nEach post: --- frontmatter --- then Markdown body.\nSeparate posts with ${POST_DIVIDER_LINE} on its own line.`}
          />
        </div>

        {rows.length > 0 ? (
          <p className={styles.summaryLine}>
            <strong>{rows.length}</strong> post{rows.length === 1 ? "" : "s"} detected from
            this document. Upload a cover for each one in section 3, then set
            go-live times in section 4.
          </p>
        ) : null}
      </section>

      <section className="admin-card">
        <h2 className="admin-card__title">3. Hero images</h2>
        <p className={styles.instructions} role="note">
          {BLOG_COVER_UPLOAD_HINT}
        </p>
        {rows.length === 0 ? (
          <p className="admin-empty">
            Add Markdown content in section 2 first. Once posts are detected, one
            upload slot appears here for each post.
          </p>
        ) : (
          <>
            <p className={styles.instructions}>
              <strong>{rows.length}</strong> post{rows.length === 1 ? "" : "s"} found — upload
              one cover image per post below ({postsWithCoverCount} of {rows.length} have a
              cover so far). Covers already set via <code>heroImageUrl</code> in the
              Markdown do not need a file. Images are optional but recommended.
            </p>
            <ul className={styles.heroSlotList}>
              {rows.map((entry) => {
                const attached = heroImagesByIndex[entry.index];
                const hasUrl = entry.heroImageUrl !== null;
                const inputId = `bulk-hero-${String(entry.index)}`;
                return (
                  <li key={entry.index} className={styles.heroSlot}>
                    <div className={styles.heroSlotMeta}>
                      <span className={styles.heroSlotIndex}>Post {entry.index}</span>
                      <span className={styles.heroSlotTitle}>
                        {entry.title.length > 0 ? entry.title : "(missing title)"}
                      </span>
                      {hasUrl ? (
                        <span className={`${styles.pill} ${styles.pillReady}`}>
                          URL in markdown
                        </span>
                      ) : attached !== undefined ? (
                        <span className={`${styles.pill} ${styles.pillReady}`}>Attached</span>
                      ) : (
                        <span className={`${styles.pill} ${styles.pillCreating}`}>No image</span>
                      )}
                    </div>
                    {hasUrl ? (
                      <p className="admin-field__hint">
                        Using <code>heroImageUrl</code> from the Markdown. You can still
                        attach a file below to replace it on import.
                      </p>
                    ) : null}
                    <div className={styles.fileRow}>
                      <label className="admin-field__label" htmlFor={inputId}>
                        Cover image
                      </label>
                      <input
                        id={inputId}
                        className={styles.fileInput}
                        type="file"
                        accept="image/*"
                        disabled={busy}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                          const list = event.target.files;
                          const file =
                            list !== null && list.length > 0 ? list.item(0) : null;
                          handleHeroImageForPost(entry.index, file);
                          event.target.value = "";
                        }}
                      />
                      {attached !== undefined ? (
                        <>
                          <span className={styles.heroSlotFilename}>{attached.name}</span>
                          <button
                            type="button"
                            className="admin-btn admin-btn--small"
                            disabled={busy}
                            onClick={() => {
                              handleHeroImageForPost(entry.index, null);
                            }}
                          >
                            Remove
                          </button>
                        </>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </section>

      <section className="admin-card">
        <h2 className="admin-card__title">4. Publish schedule</h2>
        {rows.length === 0 ? (
          <p className="admin-empty">
            Add Markdown content in section 2 first. Once posts are detected, you
            can set Malaysia Time go-live slots here.
          </p>
        ) : (
          <>
            <p className={styles.instructions}>
              Times are Malaysia Time (UTC+8). Cadence applies only to this import
              batch. A future go-live time schedules the post on import
              ({postsWithScheduleCount} of {rows.length} have a time so far).
            </p>

            <div className={styles.cadencePanel}>
              <h3 className={styles.cadenceTitle}>Cadence helper</h3>
              <p className="admin-field__hint">
                Choose when post 1 goes live, then how many days between each
                following post at the same clock time. Click Apply to write
                times onto every post in this batch.
              </p>
              <div className={styles.cadenceFields}>
                <div className="admin-field">
                  <label className="admin-field__label" htmlFor="bulk-cadence-start">
                    Start date (post 1)
                  </label>
                  <input
                    id="bulk-cadence-start"
                    className={styles.scheduleInput}
                    type="date"
                    value={cadence.startDate}
                    disabled={busy}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      setCadenceError(null);
                      setCadence((previous) => ({
                        ...previous,
                        startDate: event.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="admin-field">
                  <label className="admin-field__label" htmlFor="bulk-cadence-time">
                    Time of day (MYT)
                  </label>
                  <input
                    id="bulk-cadence-time"
                    className={styles.scheduleInput}
                    type="time"
                    value={cadence.timeOfDay}
                    disabled={busy}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      setCadenceError(null);
                      setCadence((previous) => ({
                        ...previous,
                        timeOfDay: event.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="admin-field">
                  <label className="admin-field__label" htmlFor="bulk-cadence-interval">
                    Every N days
                  </label>
                  <input
                    id="bulk-cadence-interval"
                    className={styles.scheduleInput}
                    type="number"
                    min={1}
                    step={1}
                    value={cadence.intervalDays}
                    disabled={busy}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      setCadenceError(null);
                      setCadence((previous) => ({
                        ...previous,
                        intervalDays: event.target.value,
                      }));
                    }}
                  />
                </div>
                <div className={styles.cadenceApplyWrap}>
                  <button
                    type="button"
                    className="admin-btn admin-btn--primary"
                    disabled={busy}
                    onClick={handleApplyCadence}
                  >
                    Apply to all posts
                  </button>
                </div>
              </div>
              {cadenceError !== null ? (
                <p className="admin-message admin-message--error" role="alert">
                  {cadenceError}
                </p>
              ) : null}
            </div>

            <ul className={styles.heroSlotList}>
              {rows.map((entry) => {
                const parts = scheduleByIndex[entry.index] ?? { dateYmd: "", timeHm: "" };
                const dateId = `bulk-schedule-date-${String(entry.index)}`;
                const timeId = `bulk-schedule-time-${String(entry.index)}`;
                const effective = effectiveByIndex.get(entry.index);
                const hasValidSlot =
                  isValidDateYmd(parts.dateYmd) && isValidTimeHm(parts.timeHm);
                return (
                  <li key={entry.index} className={styles.heroSlot}>
                    <div className={styles.heroSlotMeta}>
                      <span className={styles.heroSlotIndex}>Post {entry.index}</span>
                      <span className={styles.heroSlotTitle}>
                        {entry.title.length > 0 ? entry.title : "(missing title)"}
                      </span>
                      {hasValidSlot ? (
                        <span className={`${styles.pill} ${styles.pillReady}`}>
                          {formatMytPreview({
                            dateYmd: parts.dateYmd,
                            timeHm: parts.timeHm,
                          })}
                        </span>
                      ) : (
                        <span className={`${styles.pill} ${styles.pillCreating}`}>No time</span>
                      )}
                    </div>
                    <div className={styles.scheduleRow}>
                      <div className="admin-field">
                        <label className="admin-field__label" htmlFor={dateId}>
                          Date (MYT)
                        </label>
                        <input
                          id={dateId}
                          className={styles.scheduleInput}
                          type="date"
                          value={parts.dateYmd}
                          disabled={busy}
                          onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            handleScheduleFieldChange(entry.index, "dateYmd", event.target.value);
                          }}
                        />
                      </div>
                      <div className="admin-field">
                        <label className="admin-field__label" htmlFor={timeId}>
                          Time (MYT)
                        </label>
                        <input
                          id={timeId}
                          className={styles.scheduleInput}
                          type="time"
                          value={parts.timeHm}
                          disabled={busy}
                          onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            handleScheduleFieldChange(entry.index, "timeHm", event.target.value);
                          }}
                        />
                      </div>
                      {scheduleByIndex[entry.index] !== undefined ? (
                        <button
                          type="button"
                          className="admin-btn admin-btn--small"
                          disabled={busy}
                          onClick={() => {
                            handleClearScheduleForPost(entry.index);
                          }}
                        >
                          Clear
                        </button>
                      ) : null}
                    </div>
                    {effective?.scheduleError !== null && effective?.scheduleError !== undefined ? (
                      <p className={styles.issueItem}>{effective.scheduleError}</p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </section>

      <section className="admin-card">
        <h2 className="admin-card__title">5. Preview &amp; import</h2>

        {rows.length === 0 ? (
          <p className="admin-empty">
            Nothing parsed yet. Upload or paste a document above to see a
            preview here.
          </p>
        ) : (
          <>
            <p className={styles.summaryLine}>
              <strong>{rows.length}</strong> post{rows.length === 1 ? "" : "s"} found —{" "}
              <strong>{readyRows.length}</strong> ready to import
              {blockedCount > 0 ? (
                <>
                  {" "}
                  · <strong>{blockedCount}</strong> blocked (fix and re-check above)
                </>
              ) : null}
              .
            </p>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Title</th>
                    <th scope="col">Slug</th>
                    <th scope="col">Category</th>
                    <th scope="col">Tags</th>
                    <th scope="col">Status</th>
                    <th scope="col">Publish at</th>
                    <th scope="col">Image</th>
                    <th scope="col">Issues / result</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((entry) => {
                    const effective =
                      effectiveByIndex.get(entry.index) ??
                      resolveEffectivePublish(entry, scheduleByIndex[entry.index]);
                    const issues = collectRowIssues(entry, effective);
                    const ready = isRowReadyWithSchedule(entry, effective);
                    const runtime = rowStates[entry.index];
                    const scheduleParts = readScheduleParts(scheduleByIndex[entry.index]);
                    return (
                      <tr
                        key={entry.index}
                        className={!ready ? styles.rowInvalid : undefined}
                      >
                        <td>{entry.index}</td>
                        <td className={styles.titleCell}>
                          {entry.title.length > 0 ? entry.title : "(missing title)"}
                        </td>
                        <td className={styles.slugCell}>{entry.slug || "—"}</td>
                        <td>{formatCategoryPreview(entry)}</td>
                        <td>{entry.tags.length > 0 ? entry.tags.join(", ") : "—"}</td>
                        <td>{formatStatusIntentLabel(effective.statusIntent)}</td>
                        <td>{formatMytPreview(scheduleParts)}</td>
                        <td>{formatImagePreview(entry, heroImagesByIndex[entry.index])}</td>
                        <td>
                          {runtime !== undefined ? (
                            <span
                              className={`${styles.pill} ${
                                runtime.status === "created"
                                  ? styles.pillCreated
                                  : runtime.status === "failed"
                                    ? styles.pillFailed
                                    : styles.pillCreating
                              }`}
                            >
                              {runtime.status === "creating"
                                ? "Creating…"
                                : runtime.status === "created"
                                  ? "Created"
                                  : "Failed"}
                            </span>
                          ) : issues.length > 0 ? (
                            <ul className={styles.issueList}>
                              {issues.map((issue) => (
                                <li key={issue} className={styles.issueItem}>
                                  {issue}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className={`${styles.pill} ${styles.pillReady}`}>Ready</span>
                          )}
                          {runtime?.status === "failed" && runtime.message !== null ? (
                            <p className={styles.issueItem}>{runtime.message}</p>
                          ) : null}
                          {runtime?.status === "created" && runtime.postId !== null ? (
                            <p>
                              <a
                                className="admin-link"
                                href={`${postsBaseHref}/${runtime.postId}/edit`}
                              >
                                Edit
                              </a>
                            </p>
                          ) : null}
                          {entry.notes.length > 0 ? (
                            <ul className={styles.issueList}>
                              {entry.notes.map((note) => (
                                <li key={note} className={styles.noteItem}>
                                  {note}
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      <div className={`admin-actions admin-actions--sticky ${styles.actions}`}>
        <button
          type="button"
          className="admin-btn admin-btn--primary"
          disabled={busy || readyRows.length === 0}
          onClick={() => {
            void handleImportAll();
          }}
        >
          {isImporting
            ? "Importing…"
            : `Import ${String(readyRows.length)} post${readyRows.length === 1 ? "" : "s"}`}
        </button>

        {summary !== null ? (
          <p className={styles.summaryLine}>
            Done — <strong>{summary.created}</strong> created
            {summary.failed > 0 ? (
              <>
                , <strong>{summary.failed}</strong> failed
              </>
            ) : null}
            .{" "}
            <a className="admin-link" href={postsListHref}>
              View posts
            </a>
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default BulkImportForm;
