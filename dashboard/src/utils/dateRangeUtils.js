export function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function getCustomMonthBounds() {
  const currentYear = Number(getCurrentMonth().split("-")[0]);
  return {
    min: "2020-01",
    max: `${currentYear + 1}-12`,
  };
}

export function getEarliestMonth(pipeline) {
  if (!pipeline?.length) return null;
  return pipeline.reduce((min, entry) =>
    entry.openedMonth < min ? entry.openedMonth : min,
    pipeline[0].openedMonth
  );
}

export function getLatestMonth(pipeline) {
  if (!pipeline?.length) return null;
  return pipeline.reduce((max, entry) =>
    entry.openedMonth > max ? entry.openedMonth : max,
    pipeline[0].openedMonth
  );
}

// The real, data-driven bounds of the dataset — used to power the
// "Data is only available from X to Y" alert with exact values,
// rather than a hardcoded UI range.
export function getDataBounds(pipeline) {
  return {
    min: getEarliestMonth(pipeline),
    max: getLatestMonth(pipeline),
  };
}

export function isValidMonthString(month) {
  return typeof month === "string" && /^\d{4}-\d{2}$/.test(month);
}

export const MONTH_ABBR = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function formatMonthLabel(month) {
  if (!month || typeof month !== "string") return month;
  const [year, mon] = month.split("-");
  const monIndex = Number(mon) - 1;
  if (!year || monIndex < 0 || monIndex > 11 || Number.isNaN(monIndex)) return month;
  return `${MONTH_ABBR[monIndex]}-${year}`;
}


// Shifts a "YYYY-MM" string by `delta` months (negative = backwards).
function shiftMonth(month, delta) {
  const [year, mon] = month.split("-").map(Number);
  const total = (mon - 1) + delta;           // 0-indexed
  const newY  = year + Math.floor(total / 12);
  const newM  = ((total % 12) + 12) % 12 + 1;
  return `${newY}-${String(newM).padStart(2, "0")}`;
}

export function getDateRange(option, anchorMonth) {
  if (!anchorMonth) return { startMonth: null, endMonth: null };

  const endMonth = anchorMonth;
  const monthsBack = {
    "Current Month"   : 0,
    "Last 3 Months"  : 2,
    "Last 6 Months"  : 5,
    "Last 9 Months"  : 8,
    "Last 12 Months" : 11,
  }[option] ?? 11;

  return { startMonth: shiftMonth(anchorMonth, -monthsBack), endMonth };
}

export function filterPipelineByRange(pipeline, { startMonth, endMonth }) {
  if (!pipeline?.length || !startMonth || !endMonth) return pipeline ?? [];
  return pipeline.filter(({ openedMonth }) =>
    openedMonth >= startMonth && openedMonth <= endMonth
  );
}

// True if the dataset has at least one record inside [startMonth, endMonth].
export function hasDataInRange(pipeline, range) {
  return filterPipelineByRange(pipeline, range).length > 0;
}