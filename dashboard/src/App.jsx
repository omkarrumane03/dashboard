// App.jsx — Recruitment Analytics Dashboard

import { useState, useRef, useEffect } from "react";
import { PALETTE } from "./utils/theme";

import { DateRangeProvider, useDateRange, RANGE_OPTIONS } from "./context/DateRangeContext";
import { formatMonthLabel, MONTH_ABBR } from "./utils/dateRangeUtils";
import { computeOrionKPIs } from "./data/derivedKPIs";

import KPICard       from "./components/kpi/KPICard";
import ChartPanel    from "./components/layout/ChartPanel";
import InfoIcon      from "./components/common/InfoIcon";

import RolesActivityOverview from "./components/charts/RolesActivityOverview";
import RolesLocation         from "./components/charts/RolesLocation";
import ExperienceDemandBar   from "./components/charts/ExperienceDemandBar";
import CandidateFunnel       from "./components/charts/CandidateFunnel";
import RoleStatusBar         from "./components/charts/RoleStatusBar";
import ConfirmedByDimension  from "./components/charts/ConfirmedHire";

import { CHART_PANELS, DASHBOARD_BRANDING } from "./config/dashboardConfig";

const grid = { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 };

const PANEL_COMPONENTS = {
  RoleStatusBar,
  ExperienceDemandBar,
  RolesLocation,
  RolesActivityOverview,
  CandidateFunnel,
  ConfirmedByDimension,
};


// "YYYY-MM" -> "MM/YYYY" for display in the typeable field
function monthToDisplay(month) {
  if (!month) return "";
  const [year, mon] = month.split("-");
  return `${mon}/${year}`;
}

// Accepts "MM/YYYY", "MM-YYYY", or "YYYY-MM" typed by hand -> "YYYY-MM" | null
function parseTypedMonth(text) {
  const trimmed = (text || "").trim();

  let match = trimmed.match(/^(\d{1,2})[\/\-](\d{4})$/);
  if (match) {
    const mon = Number(match[1]);
    const year = Number(match[2]);
    return mon >= 1 && mon <= 12 ? `${year}-${String(mon).padStart(2, "0")}` : null;
  }

  match = trimmed.match(/^(\d{4})-(\d{1,2})$/);
  if (match) {
    const year = Number(match[1]);
    const mon = Number(match[2]);
    return mon >= 1 && mon <= 12 ? `${year}-${String(mon).padStart(2, "0")}` : null;
  }

  return null;
}

// A single month field that supports BOTH typing (MM/YYYY) and picking from
// an inline calendar-style month grid via the 📅 toggle.
function MonthPickerField({ label, value, onChange }) {
  const [textValue, setTextValue] = useState(() => monthToDisplay(value));
  const [showGrid, setShowGrid] = useState(false);
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 15;
  const maxYear = currentYear + 1;
  const [viewYear, setViewYear] = useState(() => value ? Number(value.split("-")[0]) : currentYear);

  useEffect(() => {
    setTextValue(monthToDisplay(value));
  }, [value]);

  const commitTypedValue = () => {
    if (textValue.trim() === "") {
      onChange("");
      return;
    }
    const parsed = parseTypedMonth(textValue);
    if (parsed) {
      onChange(parsed);
      setTextValue(monthToDisplay(parsed));
    } else {
      // Invalid text — revert to the last valid value rather than silently accepting garbage.
      setTextValue(monthToDisplay(value));
    }
  };

  const toggleGrid = (e) => {
    e.stopPropagation();
    setViewYear(value ? Number(value.split("-")[0]) : currentYear);
    setShowGrid((s) => !s);
  };

  const selectMonth = (monthValue) => {
    onChange(monthValue);
    setTextValue(monthToDisplay(monthValue));
    setShowGrid(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontFamily: "Inter, sans-serif", fontSize: 16, color: PALETTE.muted }}>
        {label}
      </label>
      <div style={{ display: "flex", gap: 6 }}>
        <input
          type="text"
          value={textValue}
          placeholder="MM/YYYY"
          onChange={(e) => setTextValue(e.target.value)}
          onBlur={commitTypedValue}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); commitTypedValue(); } }}
          style={{
            fontFamily: "Inter, sans-serif", fontSize: 14,
            padding: "6px 8px", borderRadius: 6,
            border: `1px solid ${PALETTE.border}`,
            color: PALETTE.text, background: "transparent",
            flex: 1, minWidth: 0,
          }}
        />
        <button
          type="button"
          onClick={toggleGrid}
          title="Pick from calendar"
          style={{
            fontFamily: "Inter, sans-serif", fontSize: 14,
            padding: "6px 10px", borderRadius: 6,
            border: `1px solid ${showGrid ? PALETTE.accent : PALETTE.border}`,
            background: showGrid ? PALETTE.accentSoft : "transparent",
            color: showGrid ? PALETTE.accent : PALETTE.muted,
            cursor: "pointer", flexShrink: 0,
          }}
        >
          📅
        </button>
      </div>

      {showGrid && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            border: `1px solid ${PALETTE.border}`,
            borderRadius: 8, padding: 10,
            display: "flex", flexDirection: "column", gap: 8,
            // background: PALETTE.bg,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button
              onClick={(e) => { e.stopPropagation(); setViewYear((y) => Math.max(minYear, y - 1)); }}
              disabled={viewYear <= minYear}
              style={{
                fontFamily: "Inter, sans-serif", fontSize: 14,
                width: 22, height: 22, borderRadius: 6,
                border: `1px solid ${PALETTE.border}`, background: "transparent",
                color: viewYear <= minYear ? PALETTE.border : PALETTE.muted,
                cursor: viewYear <= minYear ? "not-allowed" : "pointer",
              }}
            >‹</button>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 700, color: PALETTE.text }}>
              {viewYear}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); setViewYear((y) => Math.min(maxYear, y + 1)); }}
              disabled={viewYear >= maxYear}
              style={{
                fontFamily: "Inter, sans-serif", fontSize: 14,
                width: 22, height: 22, borderRadius: 6,
                border: `1px solid ${PALETTE.border}`, background: "transparent",
                color: viewYear >= maxYear ? PALETTE.border : PALETTE.muted,
                cursor: viewYear >= maxYear ? "not-allowed" : "pointer",
              }}
            >›</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4 }}>
            {MONTH_ABBR.map((abbr, i) => {
              const monthValue = `${viewYear}-${String(i + 1).padStart(2, "0")}`;
              const isSelected = value === monthValue;
              return (
                <button
                  key={abbr}
                  onClick={(e) => { e.stopPropagation(); selectMonth(monthValue); }}
                  style={{
                    fontFamily: "Inter, sans-serif", fontSize: 13,
                    padding: "5px 0", borderRadius: 6,
                    border: `1px solid ${PALETTE.border}`,
                    background: isSelected ? PALETTE.accent : "transparent",
                    color: isSelected ? PALETTE.surface : PALETTE.text,
                    cursor: "pointer",
                    fontWeight: isSelected ? 700 : 400,
                  }}
                >
                  {abbr}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function CustomDateRangeControl() {
  const {
    customRange, applyCustomRange, clearCustomRange, customRangeAlert,
  } = useDateRange();

  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(customRange?.startMonth ?? "");
  const [endDate, setEndDate] = useState(customRange?.endMonth ?? "");
  const containerRef = useRef(null);

  // Close the popover on any click outside it, without applying anything.
  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [isOpen]);

  const openPopover = (e) => {
    e.stopPropagation();
    setStartDate(customRange?.startMonth ?? "");
    setEndDate(customRange?.endMonth ?? "");
    setIsOpen(true);
  };

  const handleApply = (e) => {
    e.stopPropagation();
    const applied = applyCustomRange(startDate, endDate);
    if (applied) setIsOpen(false);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  // The X on the active badge: clears the custom range AND reverts the
  // whole dashboard to the "Current Month" preset.
  const handleClear = (e) => {
    e.stopPropagation();
    clearCustomRange();
  };

  const baseButtonStyle = {
    fontFamily: "Inter, sans-serif",
    fontSize: 18,
    letterSpacing: "0.06em",
    padding: "5px 12px",
    borderRadius: 6,
    cursor: "pointer",
    transition: "all 0.15s ease",
    whiteSpace: "nowrap",
  };

  // Active custom range confirmed — show the badge instead of the picker button.
  if (customRange) {
    return (
      <div style={{
        ...baseButtonStyle,
        display: "flex", alignItems: "center", gap: 8,
        border: `1px solid ${PALETTE.accent}`,
        background: PALETTE.accentSoft,
        color: PALETTE.accent,
      }}>
        <span>
          {formatMonthLabel(customRange.startMonth)} – {formatMonthLabel(customRange.endMonth)}
        </span>
        <span
          onClick={handleClear}
          title="Clear custom range — return to Current Month"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 16, height: 16, borderRadius: "50%",
            fontSize: 13, lineHeight: 1,
            cursor: "pointer",
          }}
        >
          ❌
        </span>
      </div>
    );
  }

  // No active custom range — show the "Custom Range" button + popover.
  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <button
        onClick={openPopover}
        style={{
          ...baseButtonStyle,
          display:"inline-flex", alignItems:"center", gap:6,
          border: `1px solid ${isOpen ? PALETTE.accent : PALETTE.border}`,
          background: isOpen ? PALETTE.accentSoft : "transparent",
          color: isOpen ? PALETTE.accent : PALETTE.muted,
        }}
      >
        <InfoIcon text="Set a custom range to view data for a specific period." size={16} />
        <span>Custom Range ▼</span>
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            zIndex: 100,
            background: PALETTE.surface,
            border: `1px solid ${PALETTE.border}`,
            borderRadius: 8,
            padding: 12,
            boxShadow: "0 8px 24px rgba(15,42,34,0.15)",
            display: "flex", flexDirection: "column", gap: 10,
            minWidth: 260,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <MonthPickerField label="Start month" value={startDate} onChange={setStartDate} />
            <MonthPickerField label="End month" value={endDate} onChange={setEndDate} />
          </div>

          {customRangeAlert && (
            <div style={{
              display: "flex", alignItems: "flex-start", gap: 6,
              fontFamily: "Inter, sans-serif", fontSize: 13,
              color: PALETTE.orange,
              background: `${PALETTE.orange}18`,
              borderRadius: 6, padding: "6px 8px",
            }}>
              <span>⚠</span>
              <span>{customRangeAlert}</span>
            </div>
          )}

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button
              onClick={handleCancel}
              style={{
                fontFamily: "Inter, sans-serif", fontSize: 14,
                padding: "4px 10px", borderRadius: 6,
                border: `1px solid ${PALETTE.border}`,
                background: "transparent", color: PALETTE.muted,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={!startDate || !endDate}
              style={{
                fontFamily: "Inter, sans-serif", fontSize: 14,
                padding: "4px 10px", borderRadius: 6,
                border: `1px solid ${PALETTE.accent}`,
                background: PALETTE.accent,
                color: PALETTE.surface,
                cursor: (startDate && endDate) ? "pointer" : "not-allowed",
                opacity: (startDate && endDate) ? 1 : 0.5,
              }}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DateRangeFilter() {
  const { selectedRange, setSelectedRange, customRange } = useDateRange();

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap",
      minWidth: 0,
      justifyContent: "flex-end",  }}>
      <CustomDateRangeControl />
      {RANGE_OPTIONS.map((option) => {
        // A preset only reads as "active" when no custom range is set —
        // once a custom range exists it takes visual precedence, but the
        // preset buttons stay fully clickable. Clicking one clears the
        // custom range (via setSelectedRange) and applies the preset.
        const isActive = selectedRange === option && !customRange;
        return (
          <button
            key={option}
            onClick={() => setSelectedRange(option)}
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 18,
              letterSpacing: "0.06em",
              padding: "5px 12px",
              borderRadius: 6,
              border: `1px solid ${isActive ? PALETTE.accent : PALETTE.border}`,
              background: isActive ? PALETTE.accentSoft : "transparent",
              color: isActive ? PALETTE.accent : PALETTE.muted,
              cursor: "pointer",
              transition: "all 0.15s ease",
              whiteSpace: "nowrap",
            }}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function DataCoverageNotice() {
  const { dataStartsAfterRange, dataBounds } = useDateRange();
  if (!dataStartsAfterRange || !dataBounds.min) return null;

  return (
    <div style={{
      background: `${PALETTE.orange}18`,
      borderBottom: `1px solid ${PALETTE.border}`,
      padding: "6px 32px",
      fontFamily: "Inter, sans-serif",
      fontSize: 18,
      color: PALETTE.orange,
      display: "flex", alignItems: "center", gap: 6,
    }}>
      <span>⚠</span>
      <span>
        Data is only available from <strong>{formatMonthLabel(dataBounds.min)}</strong> to{" "}
        <strong>{formatMonthLabel(dataBounds.max)}</strong> — wider ranges won't show anything beyond that.
      </span>
    </div>
  );
}

function DashboardContent() {
  const { filteredPipeline, selectedRange, customRange } = useDateRange();
  const orionKPIs = computeOrionKPIs(filteredPipeline);
  const { title: brandTitle, badge: brandBadge, logoText: brandLogo } = DASHBOARD_BRANDING;

  return (
    <div style={{
      minHeight: "100vh",
      background: PALETTE.bg,
      color: PALETTE.text,
      fontFamily: "Inter, sans-serif",
    }}>

      {/* ── Top Bar ─────────────────────────────────────────────── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: PALETTE.surface,
        borderBottom: `1px solid ${PALETTE.border}`,
        padding: "0 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        minHeight: 56,
        gap: 16,
        flexWrap:"wrap",
        rowGap:8,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: PALETTE.accent,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 700, color: PALETTE.surface,
          }}>{brandLogo}</div>
          <span style={{fontFamily: "Inter, sans-serif", fontSize: 20, fontWeight: 700, letterSpacing: "0.06em" }}>
            {brandTitle}
          </span>
          <span style={{
            fontSize: 20, padding: "2px 8px",
            background: PALETTE.accentSoft, color: PALETTE.accent,
            borderRadius: 4, letterSpacing: "0.08em", fontWeight: 600,
          }}>{brandBadge}</span>
        </div>

        <DateRangeFilter />
      </header>

      <DataCoverageNotice />

      {/* ── Content ─────────────────────────────────────────────── */}
      <div style={{ display: "flex" }}>
        <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
            <div>

              {/* ── 4-Card KPI Row ─────────────────────────────────────── */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: 16,
                marginBottom: 28,
              }}>

                <KPICard
                  icon="💼"
                  label="Total Managed Roles"
                  value={orionKPIs.totalRoles}
                  accent={PALETTE.accent}
                  info="Count of distinct roles being managed across the selected date range."
                />

                <KPICard
                  icon="📋"
                  label="Total Positions"
                  value={orionKPIs.totalOpenings}
                  accent={PALETTE.accent}
                  info="Sum of individual positions across all roles."
                />

                <KPICard
                  icon="🟢"
                  label="Active Positions"
                  value={orionKPIs.activeOpenings}
                  accent={PALETTE.green}
                  info="Positions currently in process — interviewing, or awaiting."
                />

                <KPICard
                  icon="✅"
                  label="Closed Positions - Hired"
                  value={orionKPIs.filledOpenings}
                  accent={PALETTE.green}
                  info="Positions that were successfully closed with a confirmed hires."
                />

                <KPICard
                  icon="⏳"
                  label="On Hold Positions"
                  value={orionKPIs.onHoldOpenings}
                  accent={PALETTE.orange}
                  info="Positions paused, but not closed or cancelled either."
                />

                <KPICard
                  icon="🏆"
                  label="Hiring Success Rate"
                  value={`${orionKPIs.hireSuccessRate}%`}
                  sub={orionKPIs.hireSuccessRateLabel}
                  accent={PALETTE.green}
                  info="Share of closed positions that ended in a hire."
                />

              </div>

              {/* ── Charts ───────────────────────────────────────── */}
              {(() => {
                const hasData = filteredPipeline && filteredPipeline.length > 0;
                const chartContainerKey = `${selectedRange}-${customRange ? `${customRange.startMonth}_${customRange.endMonth}` : "none"}`;

                const noDataMessage = (
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    height: "100%", 
                    color: PALETTE.muted,
                    fontSize: 20,
                    fontFamily: "Inter, sans-serif"
                  }}>
                    No data for selected range.
                  </div>
                );

                return (
                  <div style={{ ...grid, marginBottom: 16 }} key={chartContainerKey}>
                    {CHART_PANELS.map((panel) => {
                      const PanelComponent = PANEL_COMPONENTS[panel.componentKey];
                      return (
                        <ChartPanel
                          key={panel.id}
                          title={panel.title}
                          subtitle={panel.subtitle}
                          info={panel.info}
                          height={panel.height}
                          span={panel.span}
                        >
                          {hasData ? <PanelComponent /> : noDataMessage}
                        </ChartPanel>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <DateRangeProvider>
      <DashboardContent />
    </DateRangeProvider>
  );
}