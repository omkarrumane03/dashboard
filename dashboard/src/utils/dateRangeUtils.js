/**
 * Returns the maximum "YYYY-MM" month present in the pipeline dataset.
 * This becomes the anchor (Max_Month) for all filter calculations.
 */
export function getMaxMonth(pipeline) {
  if (!pipeline?.length) return null;
  return pipeline.reduce((max, entry) =>
    entry.openedMonth > max ? entry.openedMonth : max,
    pipeline[0].openedMonth
  );
}

/**
 * Shifts a "YYYY-MM" string by `delta` months (negative = backwards).
 */
function shiftMonth(maxMonth, delta) {
  const [year, month] = maxMonth.split("-").map(Number);
  const total = (month - 1) + delta;           // 0-indexed
  const newY  = year + Math.floor(total / 12);
  const newM  = ((total % 12) + 12) % 12 + 1;
  return `${newY}-${String(newM).padStart(2, "0")}`;
}

export function getDateRange(option, maxMonth) {
  if (!maxMonth) return { startMonth: null, endMonth: null };

  const endMonth = maxMonth;
  const monthsBack = {
    "Latest Month"  : 0,
    "Last 3 Months"  : 2,
    "Last 6 Months"  : 5,
    "Last 9 Months"  : 8,
    "Last 12 Months" : 11,
  }[option] ?? 11;

  return { startMonth: shiftMonth(maxMonth, -monthsBack), endMonth };
}

/**
 * Filters pipeline entries whose openedMonth falls within [startMonth, endMonth].
 */
export function filterPipelineByRange(pipeline, { startMonth, endMonth }) {
  if (!pipeline?.length || !startMonth || !endMonth) return pipeline ?? [];
  return pipeline.filter(({ openedMonth }) =>
    openedMonth >= startMonth && openedMonth <= endMonth
  );
}