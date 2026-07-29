/**
 * @fileoverview Malaysia Time (UTC+8) schedule helpers for Dr Jasmine Admin bulk import.
 *
 * Cadence and per-post go-live times are chosen in the Admin UI (not Markdown).
 * Malaysia has no DST, so a fixed `+08:00` offset is correct year-round.
 */

/** Fixed Malaysia Time offset string used when building ISO timestamps. */
export const MYT_OFFSET = "+08:00";

/** One MYT calendar date + clock time pair (no timezone suffix). */
export type MytDateTimeParts = {
  /** `YYYY-MM-DD` in Malaysia Time. */
  dateYmd: string;
  /** `HH:mm` 24-hour clock in Malaysia Time. */
  timeHm: string;
};

/** Inputs for {@link applyCadenceSchedule}. */
export type ApplyCadenceScheduleOptions = {
  /** Start calendar day for post 1 (`YYYY-MM-DD`, MYT). */
  startDate: string;
  /** Clock time applied to every post (`HH:mm`, MYT). */
  timeOfDay: string;
  /** Days between consecutive posts (≥ 1). */
  intervalDays: number;
  /** Number of posts in the current batch (≥ 0). */
  postCount: number;
};

/** Matches a strict `YYYY-MM-DD` calendar date. */
const DATE_YMD_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Matches a strict `HH:mm` 24-hour time. */
const TIME_HM_PATTERN = /^(\d{2}):(\d{2})$/;

/**
 * Pads a non-negative integer to at least two digits.
 *
 * @param value - Number to pad.
 * @returns Zero-padded string.
 */
function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

/**
 * Validates a `YYYY-MM-DD` string as a real calendar date.
 *
 * @param dateYmd - Candidate date string.
 * @returns `true` when the date is valid.
 */
export function isValidDateYmd(dateYmd: string): boolean {
  if (typeof dateYmd !== "string") {
    return false;
  }
  const match = DATE_YMD_PATTERN.exec(dateYmd.trim());
  if (match === null) {
    return false;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }
  /** Use UTC noon to avoid local DST edge cases when validating the civil date. */
  const probe = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return (
    probe.getUTCFullYear() === year &&
    probe.getUTCMonth() === month - 1 &&
    probe.getUTCDate() === day
  );
}

/**
 * Validates an `HH:mm` 24-hour clock string.
 *
 * @param timeHm - Candidate time string.
 * @returns `true` when hours are 0–23 and minutes are 0–59.
 */
export function isValidTimeHm(timeHm: string): boolean {
  if (typeof timeHm !== "string") {
    return false;
  }
  const match = TIME_HM_PATTERN.exec(timeHm.trim());
  if (match === null) {
    return false;
  }
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
}

/**
 * Builds a UTC ISO-8601 timestamp from a Malaysia Time date and clock time.
 *
 * @param dateYmd - `YYYY-MM-DD` in MYT.
 * @param timeHm - `HH:mm` in MYT.
 * @returns UTC ISO string, or `null` when inputs are invalid.
 */
export function buildMytIso(dateYmd: string, timeHm: string): string | null {
  if (typeof dateYmd !== "string" || typeof timeHm !== "string") {
    throw new TypeError("buildMytIso: dateYmd and timeHm must be strings");
  }
  const trimmedDate = dateYmd.trim();
  const trimmedTime = timeHm.trim();
  if (!isValidDateYmd(trimmedDate) || !isValidTimeHm(trimmedTime)) {
    return null;
  }
  const isoLocalWithOffset = `${trimmedDate}T${trimmedTime}:00${MYT_OFFSET}`;
  const parsedMs = Date.parse(isoLocalWithOffset);
  if (Number.isNaN(parsedMs)) {
    return null;
  }
  return new Date(parsedMs).toISOString();
}

/**
 * Formats MYT date/time parts for Admin preview tables.
 *
 * @param parts - MYT date and time, or `null` when unset.
 * @returns Display string such as `2026-08-05 08:00 MYT`, or an em dash.
 */
export function formatMytPreview(parts: MytDateTimeParts | null): string {
  if (parts === null) {
    return "—";
  }
  if (!isValidDateYmd(parts.dateYmd) || !isValidTimeHm(parts.timeHm)) {
    return "—";
  }
  return `${parts.dateYmd} ${parts.timeHm} MYT`;
}

/**
 * Adds a whole number of calendar days to a `YYYY-MM-DD` date (UTC civil math).
 *
 * @param dateYmd - Base date.
 * @param daysToAdd - Days to add (may be zero).
 * @returns New `YYYY-MM-DD`, or `null` when the base date is invalid.
 */
export function addDaysToDateYmd(dateYmd: string, daysToAdd: number): string | null {
  if (typeof dateYmd !== "string") {
    throw new TypeError("addDaysToDateYmd: dateYmd must be a string");
  }
  if (typeof daysToAdd !== "number" || !Number.isFinite(daysToAdd)) {
    throw new TypeError("addDaysToDateYmd: daysToAdd must be a finite number");
  }
  if (!Number.isInteger(daysToAdd)) {
    throw new TypeError("addDaysToDateYmd: daysToAdd must be an integer");
  }
  if (!isValidDateYmd(dateYmd)) {
    return null;
  }
  const match = DATE_YMD_PATTERN.exec(dateYmd.trim());
  if (match === null) {
    return null;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const utc = new Date(Date.UTC(year, month - 1, day + daysToAdd, 12, 0, 0));
  return `${String(utc.getUTCFullYear())}-${pad2(utc.getUTCMonth() + 1)}-${pad2(utc.getUTCDate())}`;
}

/**
 * Builds ordered MYT date/time slots for a bulk-import batch.
 *
 * Post 1 uses `startDate` + `timeOfDay`. Post *k* is
 * `startDate + (k - 1) * intervalDays` at the same clock time.
 *
 * @param options - Start date, time, interval, and post count.
 * @returns One slot per post, or an empty array when `postCount` is 0.
 * @throws {TypeError} When options are missing or mistyped.
 * @throws {RangeError} When interval/postCount are invalid or dates fail.
 */
export function applyCadenceSchedule(
  options: ApplyCadenceScheduleOptions,
): MytDateTimeParts[] {
  if (options === null || typeof options !== "object") {
    throw new TypeError("applyCadenceSchedule: options must be an object");
  }
  const { startDate, timeOfDay, intervalDays, postCount } = options;
  if (typeof startDate !== "string" || typeof timeOfDay !== "string") {
    throw new TypeError("applyCadenceSchedule: startDate and timeOfDay must be strings");
  }
  if (typeof intervalDays !== "number" || !Number.isInteger(intervalDays) || intervalDays < 1) {
    throw new RangeError("applyCadenceSchedule: intervalDays must be an integer ≥ 1");
  }
  if (typeof postCount !== "number" || !Number.isInteger(postCount) || postCount < 0) {
    throw new RangeError("applyCadenceSchedule: postCount must be an integer ≥ 0");
  }
  if (postCount === 0) {
    return [];
  }
  if (!isValidDateYmd(startDate) || !isValidTimeHm(timeOfDay)) {
    throw new RangeError("applyCadenceSchedule: startDate or timeOfDay is invalid");
  }

  const trimmedTime = timeOfDay.trim();
  const slots: MytDateTimeParts[] = [];
  for (let offset = 0; offset < postCount; offset += 1) {
    const dateYmd = addDaysToDateYmd(startDate.trim(), offset * intervalDays);
    if (dateYmd === null) {
      throw new RangeError("applyCadenceSchedule: failed to compute a slot date");
    }
    slots.push({ dateYmd, timeHm: trimmedTime });
  }
  return slots;
}
