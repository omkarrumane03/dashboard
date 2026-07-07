import React, { createContext, useContext, useState, useMemo } from "react";
import { orionPipeline } from "../data/notebookData";
import {getCurrentMonth, getCustomMonthBounds, getDateRange, filterPipelineByRange, getEarliestMonth,} from "../utils/dateRangeUtils";

const DateRangeContext = createContext(null);

export const RANGE_OPTIONS = [
  "Present Month",
  "Last 3 Months",
  "Last 6 Months",
  "Last 9 Months",
  "Last 12 Months",
];

export function DateRangeProvider({ children }) {
  // FIXED: Changed initial state to "Present Month" so refreshes always start here
  const [selectedRange, setSelectedRange] = useState("Present Month");
  const [customMonth, setCustomMonth] = useState(null);
  const currentMonth = getCurrentMonth();
  const customMonthBounds = useMemo(() => getCustomMonthBounds(), [currentMonth]);

  function confirmCustomMonth(month) {
    setCustomMonth(month);
    setSelectedRange("Present Month");
  }

  function clearCustomMonth() {
    setCustomMonth(null);
    setSelectedRange("Present Month");
  }

  const anchorMonth = customMonth ?? currentMonth;
  const earliestMonth = useMemo(() => getEarliestMonth(orionPipeline), []);

  const range = useMemo(
    () => getDateRange(selectedRange, anchorMonth),
    [selectedRange, anchorMonth]
  );

  const dataStartsAfterRange = Boolean(
    earliestMonth && range.startMonth && range.startMonth < earliestMonth
  );

  const filteredPipeline = useMemo(() => {
    return filterPipelineByRange(orionPipeline, range);
  }, [range]);

  return (
    <DateRangeContext.Provider value={{
      selectedRange,
      setSelectedRange,
      customMonth,          
      confirmCustomMonth,   
      clearCustomMonth,     
      customMonthBounds,    
      filteredPipeline,
      rangeOptions: RANGE_OPTIONS,
      currentMonth,         
      anchorMonth,          
      earliestMonth,        
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