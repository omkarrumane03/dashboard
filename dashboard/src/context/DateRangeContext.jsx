import React, { createContext, useContext, useState, useMemo } from "react";
import { orionPipeline } from "../data/notebookData";
import { getDateRange, filterPipelineByRange } from "../utils/dateRangeUtils";

const DateRangeContext = createContext(null);

export const RANGE_OPTIONS = [
  "Current Month",
  "Last 3 Months",
  "Last 6 Months",
  "Last 9 Months",
  "Last 12 Months",
  // "Last 2 Years",
];

export function DateRangeProvider({ children }) {
  const [selectedRange, setSelectedRange] = useState("Current Month");

  const filteredPipeline = useMemo(() => {
    const range = getDateRange(selectedRange);
    const filtered = filterPipelineByRange(orionPipeline, range);

    // Fallback: if no data matches current range, return full dataset
    return filtered.length > 0 ? filtered : orionPipeline;
  }, [selectedRange]);

  const value = {
    selectedRange,
    setSelectedRange,
    filteredPipeline,
    rangeOptions: RANGE_OPTIONS,
  };

  return (
    <DateRangeContext.Provider value={value}>
      {children}
    </DateRangeContext.Provider>
  );
}

export function useDateRange() {
  const context = useContext(DateRangeContext);
  if (!context) {
    throw new Error("useDateRange must be used within a DateRangeProvider");
  }
  return context;
}