import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import { orionPipeline } from "../data/notebookData";
import {
  getCurrentMonth,
  getDateRange,
  filterPipelineByRange,
  getDataBounds,
  hasDataInRange,
  formatMonthLabel,
} from "../utils/dateRangeUtils";

const DateRangeContext = createContext(null);

export const RANGE_OPTIONS = [
  "Current Month",
  "Last 3 Months",
  "Last 6 Months",
  "Last 9 Months",
  "Last 12 Months",
];

export function DateRangeProvider({ children }) {
  const [selectedRange, setSelectedRangeState] = useState("Current Month");

  // The custom range is a fully independent filter: { startMonth, endMonth } | null.
  // It is never combined with selectedRange — whichever one was set most
  // recently is the one driving filteredPipeline.
  const [customRange, setCustomRange] = useState(null);
  const [customRangeAlert, setCustomRangeAlert] = useState(null);

  const currentMonth = getCurrentMonth();

  // Real, data-driven bounds (not a hardcoded UI range) so alerts can quote
  // the exact dates data is available for.
  const dataBounds = useMemo(() => getDataBounds(orionPipeline), []);

  // Picking one of the standard preset buttons always clears any active
  // custom range — the two controls are disconnected from one another.
  function setSelectedRange(option) {
    setCustomRange(null);
    setCustomRangeAlert(null);
    setSelectedRangeState(option);
  }

  // Validates a manually typed start/end month against the real dataset.
  // Returns true/false so the caller (the popover UI) knows whether to close.
  const applyCustomRange = useCallback((startMonth, endMonth) => {
    if (!startMonth || !endMonth) {
      setCustomRangeAlert("Please provide both a start and end month.");
      return false;
    }
    if (startMonth > endMonth) {
      setCustomRangeAlert("Start month must be on or before the end month.");
      return false;
    }

    const candidateRange = { startMonth, endMonth };

    if (!hasDataInRange(orionPipeline, candidateRange)) {
      const { min, max } = dataBounds;
      setCustomRangeAlert(
        min && max
          ? `Data is only available from ${formatMonthLabel(min)} to ${formatMonthLabel(max)}.`
          : "No data is available for this dataset."
      );
      return false;
    }

    setCustomRangeAlert(null);
    setCustomRange(candidateRange);
    return true;
  }, [dataBounds]);

  // Cancel (X): clear the custom range entirely and revert the dashboard
  // to the "Current Month" preset.
  function clearCustomRange() {
    setCustomRange(null);
    setCustomRangeAlert(null);
    setSelectedRangeState("Current Month");
  }

  // Whichever filter is active drives the range — custom range, when set,
  // completely overrides the preset buttons rather than combining with them.
  const range = useMemo(() => {
    if (customRange) return customRange;
    return getDateRange(selectedRange, currentMonth);
  }, [customRange, selectedRange, currentMonth]);

  const dataStartsAfterRange = Boolean(
    dataBounds.min && range.startMonth && range.startMonth < dataBounds.min
  );

  const filteredPipeline = useMemo(() => {
    return filterPipelineByRange(orionPipeline, range);
  }, [range]);

  return (
    <DateRangeContext.Provider value={{
      selectedRange,
      setSelectedRange,
      customRange,
      applyCustomRange,
      clearCustomRange,
      customRangeAlert,
      dataBounds,
      filteredPipeline,
      rangeOptions: RANGE_OPTIONS,
      currentMonth,
      dataStartsAfterRange,
    }}>
      {children}
    </DateRangeContext.Provider>
  );
}

export function useDateRange() {
  const context = useContext(DateRangeContext);
  if (!context) throw new Error("useDateRange must be used within a DateRangeProvider");
  return context;
}