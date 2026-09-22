/**
 * Date utilities with strict Local Timezone safety.
 * Standard `new Date("YYYY-MM-DD")` parses as UTC midnight, which causes off-by-one errors
 * in timezones behind UTC (such as UTC-5, UTC-7, UTC-8) or date mismatch in Asian timezones.
 */

/**
 * Parse "YYYY-MM-DD" into a local midnight Date object (local 00:00:00.000)
 */
export function parseLocalDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  const parts = dateStr.split('-').map(Number);
  if (parts.length < 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) {
    return new Date(dateStr);
  }
  return new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0);
}

/**
 * Format Date object into "YYYY-MM-DD" string based on LOCAL time (not UTC)
 */
export function formatLocalISODate(d: Date): string {
  if (isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Get current system date in "YYYY-MM-DD" format in user's local timezone
 */
export function getTodayLocalISODate(): string {
  return formatLocalISODate(new Date());
}

/**
 * Calculate precise calendar age (years, months, days)
 * Robust against month-end differences (e.g. birth on 31st, target on Feb 28 / Mar 1)
 */
export function calculateCalendarAge(birth: Date, target: Date): { years: number; months: number; days: number } {
  let years = target.getFullYear() - birth.getFullYear();
  let months = target.getMonth() - birth.getMonth();
  let days = target.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    // Number of days in the month immediately preceding targetDate
    const daysInPrevMonth = new Date(target.getFullYear(), target.getMonth(), 0).getDate();
    // Cap birth day to the previous month's maximum days if birth date was on 29, 30 or 31
    const adjustedBirthDay = Math.min(birth.getDate(), daysInPrevMonth);
    days = target.getDate() + (daysInPrevMonth - adjustedBirthDay);
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return {
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days)
  };
}
