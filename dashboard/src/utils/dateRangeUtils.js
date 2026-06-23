/**
 * Returns start and end month strings based on selected range option.
 * Month format matches notebookData.js: "YYYY-MM"
 */
export function getDateRange(option) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed

  const toMonthStr = (year, month) => {
    const m = ((month % 12) + 12) % 12;
    const y = year + Math.floor(month / 12);
    return `${y}-${String(m + 1).padStart(2, "0")}`;
  };

  const endMonth = toMonthStr(currentYear, currentMonth);

  let startMonth;

  switch (option) {
    case "Current Month":
      startMonth = endMonth;
      break;
    case "Last 3 Months":
      startMonth = toMonthStr(currentYear, currentMonth - 2);
      break;
    case "Last 6 Months":
      startMonth = toMonthStr(currentYear, currentMonth - 5);
      break;
    case "Last 9 Months":
      startMonth = toMonthStr(currentYear, currentMonth - 8);
      break;
    case "Last 12 Months":
      startMonth = toMonthStr(currentYear, currentMonth - 11);
      break;
      startMonth = endMonth;
  }

  return { startMonth, endMonth };
}

/**
 * Filters the orionPipeline array by the given date range.
 * Each entry in pipeline has an `openedMonth` field in "YYYY-MM" format.
 */
export function filterPipelineByRange(pipeline, { startMonth, endMonth }) {
  if (!pipeline || !pipeline.length) return [];

  return pipeline.filter((entry) => {
    const month = entry.openedMonth;
    return month >= startMonth && month <= endMonth;
  });
}