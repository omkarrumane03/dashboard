import React, { createContext, useContext, useState, useMemo } from "react";
import { orionPipeline } from "../data/notebookData";
import { getMaxMonth, getDateRange, filterPipelineByRange } from "../utils/dateRangeUtils";

const DateRangeContext = createContext(null);

export const RANGE_OPTIONS = [
  "Latest Month",
  "Last 3 Months",
  "Last 6 Months",
  "Last 9 Months",
  "Last 12 Months",
];

export function DateRangeProvider({ children }) {
  const [selectedRange, setSelectedRange] = useState("Last 12 Months");

  // Derived once from dataset — stable, no dependency on current date
  const maxMonth = useMemo(() => getMaxMonth(orionPipeline), []);

  const filteredPipeline = useMemo(() => {
    const range = getDateRange(selectedRange, maxMonth);  // anchor = Max_Month
    return filterPipelineByRange(orionPipeline, range);   // no fallback needed
  }, [selectedRange, maxMonth]);

  return (
    <DateRangeContext.Provider value={{
      selectedRange,
      setSelectedRange,
      filteredPipeline,
      rangeOptions: RANGE_OPTIONS,
      maxMonth,   // expose for chart axis labels if needed
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