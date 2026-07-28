/**
 * @fileoverview GHL-style local-time date parsing shared by workshop countdown.
 * Ported from GHL capture custom-code (`webinarDate = "2026 Aug 4 8:00 PM"`, local time).
 */

/**
 * Parses GHL-style date strings such as `"2026 Aug 4 8:00 PM"` as local time.
 *
 * @param raw - Date string from capture or `workshopCopy.countdownTarget`
 * @returns Epoch ms, or `NaN` when unparseable
 */
export function parseGhlDate(raw: string): number {
  if (typeof raw !== "string" || raw.trim().length === 0) {
    return Number.NaN;
  }

  const parts = raw.trim().split(/\s+/);
  if (parts.length < 3) {
    return Number.NaN;
  }

  const yearPart = parts[0];
  const monthStr = parts[1];
  const dayPart = parts[2];
  if (
    typeof yearPart !== "string" ||
    typeof monthStr !== "string" ||
    typeof dayPart !== "string"
  ) {
    return Number.NaN;
  }

  const year = Number.parseInt(yearPart, 10);
  const day = Number.parseInt(dayPart, 10);

  const months: Readonly<Record<string, number>> = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  const month = months[monthStr];
  if (month === undefined || Number.isNaN(year) || Number.isNaN(day)) {
    return Number.NaN;
  }

  let hours = 0;
  let minutes = 0;
  const timeToken = parts[3];
  const meridiemToken = parts[4];

  if (typeof timeToken === "string" && typeof meridiemToken === "string") {
    const timeParts = timeToken.split(":");
    const hourRaw = timeParts[0];
    const minuteRaw = timeParts[1] ?? "0";
    if (typeof hourRaw !== "string") {
      return Number.NaN;
    }
    hours = Number.parseInt(hourRaw, 10);
    minutes = Number.parseInt(minuteRaw, 10);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return Number.NaN;
    }

    const meridiem = meridiemToken.toUpperCase();
    if (meridiem === "PM" && hours < 12) {
      hours += 12;
    }
    if (meridiem === "AM" && hours === 12) {
      hours = 0;
    }
  }

  return new Date(year, month, day, hours, minutes, 0, 0).getTime();
}
