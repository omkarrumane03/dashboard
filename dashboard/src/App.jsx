// App.jsx — Recruitment Analytics Dashboard

import { useState, useRef, useEffect } from "react";
import { PALETTE } from "./utils/theme";

import { DateRangeProvider, useDateRange, RANGE_OPTIONS } from "./context/DateRangeContext";
import { formatMonthLabel, MONTH_ABBR } from "./utils/dateRangeUtils";
import { computeOrionKPIs } from "./data/derivedKPIs";

import KPICard       from "./components/kpi/KPICard";
import ChartPanel    from "./components/layout/ChartPanel";
import SectionHeader from "./components/layout/SectionHeader";

import RolesActivityOverview from "./components/charts/RolesActivityOverview";
import RolesLocation         from "./components/charts/RolesLocation";
import ExperienceDemandBar   from "./components/charts/ExperienceDemandBar";
import CandidateFunnel       from "./components/charts/CandidateFunnel";
import RoleStatusBar         from "./components/charts/RoleStatusBar";
import ConfirmedByDimension  from "./components/charts/ConfirmedHire";

const grid = { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 };


function CustomMonthControl() {
  const {
    customMonth, confirmCustomMonth, clearCustomMonth,
    customMonthBounds, currentMonth,
  } = useDateRange();

  const [isOpen, setIsOpen] = useState(false);
  const [pendingValue, setPendingValue] = useState(customMonth ?? "");
  const [viewYear, setViewYear] = useState(() =>
    Number((customMonth ?? currentMonth).split("-")[0])
  );
  const containerRef = useRef(null);

  const minYear = Number(customMonthBounds.min.split("-")[0]);
  const maxYear = Number(customMonthBounds.max.split("-")[0]);

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
    const base = customMonth ?? currentMonth;
    setPendingValue(customMonth ?? "");
    setViewYear(Number(base.split("-")[0]));
    setIsOpen(true);
  };

  const handleApply = (e) => {
    e.stopPropagation();
    if (!pendingValue) return;
    confirmCustomMonth(pendingValue);
    setIsOpen(false);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setPendingValue(customMonth ?? "");
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    clearCustomMonth();
  };

  const goPrevYear = (e) => {
    e.stopPropagation();
    setViewYear((y) => Math.max(minYear, y - 1));
  };

  const goNextYear = (e) => {
    e.stopPropagation();
    setViewYear((y) => Math.min(maxYear, y + 1));
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

  // Active anchor confirmed — show the badge instead of the picker button.
  if (customMonth) {
    return (
      <div style={{
        ...baseButtonStyle,
        display: "flex", alignItems: "center", gap: 8,
        border: `1px solid ${PALETTE.accent}`,
        background: PALETTE.accentSoft,
        color: PALETTE.accent,
      }}>
        <span>Base: {formatMonthLabel(customMonth)}</span>
        <span
          onClick={handleClear}
          title="Exit custom month — return to today"
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

  // No active anchor — show the "Custom Month" button + popover.
  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <button
        onClick={openPopover}
        style={{
          ...baseButtonStyle,
          border: `1px solid ${isOpen ? PALETTE.accent : PALETTE.border}`,
          background: isOpen ? PALETTE.accentSoft : "transparent",
          color: isOpen ? PALETTE.accent : PALETTE.muted,
        }}
      >
        Custom MM/YYYY ▼
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
            minWidth: 240,
          }}
        >
          <label style={{ fontSize: 14, color: PALETTE.muted, fontFamily: "Inter, sans-serif" }}>
            Pick a MM/YYYY — it becomes the Base for every range below.
          </label>

          {/* Year header with paging arrows, clamped to customMonthBounds */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button
              onClick={goPrevYear}
              disabled={viewYear <= minYear}
              style={{
                fontFamily: "Inter, sans-serif", fontSize: 16,
                width: 26, height: 26, borderRadius: 6,
                border: `1px solid ${PALETTE.border}`,
                background: "transparent",
                color: viewYear <= minYear ? PALETTE.border : PALETTE.muted,
                cursor: viewYear <= minYear ? "not-allowed" : "pointer",
              }}
            >
              ‹
            </button>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 16, fontWeight: 700, color: PALETTE.text }}>
              {viewYear}
            </span>
            <button
              onClick={goNextYear}
              disabled={viewYear >= maxYear}
              style={{
                fontFamily: "Inter, sans-serif", fontSize: 16,
                width: 26, height: 26, borderRadius: 6,
                border: `1px solid ${PALETTE.border}`,
                background: "transparent",
                color: viewYear >= maxYear ? PALETTE.border : PALETTE.muted,
                cursor: viewYear >= maxYear ? "not-allowed" : "pointer",
              }}
            >
              ›
            </button>
          </div>

          {/* 3x4 month grid for the year in view */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
            {MONTH_ABBR.map((abbr, i) => {
              const monthValue = `${viewYear}-${String(i + 1).padStart(2, "0")}`;
              const isOutOfBounds = monthValue < customMonthBounds.min || monthValue > customMonthBounds.max;
              const isSelected = pendingValue === monthValue;
              const isRealCurrent = monthValue === currentMonth;

              return (
                <button
                  key={abbr}
                  disabled={isOutOfBounds}
                  onClick={(e) => { e.stopPropagation(); setPendingValue(monthValue); }}
                  style={{
                    fontFamily: "Inter, sans-serif", fontSize: 14,
                    padding: "6px 0", borderRadius: 6,
                    border: isRealCurrent && !isSelected
                      ? `1px solid ${PALETTE.accent}`
                      : `1px solid ${PALETTE.border}`,
                    background: isSelected ? PALETTE.accent : "transparent",
                    color: isOutOfBounds
                      ? PALETTE.border
                      : isSelected ? PALETTE.surface : PALETTE.text,
                    cursor: isOutOfBounds ? "not-allowed" : "pointer",
                    fontWeight: isSelected ? 700 : 400,
                    opacity: isOutOfBounds ? 0.4 : 1,
                    transition: "all 0.1s ease",
                  }}
                >
                  {abbr}
                </button>
              );
            })}
          </div>

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
              disabled={!pendingValue}
              style={{
                fontFamily: "Inter, sans-serif", fontSize: 14,
                padding: "4px 10px", borderRadius: 6,
                border: `1px solid ${PALETTE.accent}`,
                background: PALETTE.accent,
                color: PALETTE.surface,
                cursor: pendingValue ? "pointer" : "not-allowed",
                opacity: pendingValue ? 1 : 0.5,
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
  const { selectedRange, setSelectedRange } = useDateRange();

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <CustomMonthControl />
      {RANGE_OPTIONS.map((option) => {
        const isActive = selectedRange === option;
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
  const { dataStartsAfterRange, earliestMonth } = useDateRange();
  if (!dataStartsAfterRange || !earliestMonth) return null;

  return (
    <div style={{
      background: `${PALETTE.orange}18`,
      borderBottom: `1px solid ${PALETTE.border}`,
      padding: "6px 32px",
      fontFamily: "Inter, sans-serif",
      fontSize: 14,
      color: PALETTE.orange,
      display: "flex", alignItems: "center", gap: 6,
    }}>
      <span>⚠</span>
      <span>
        Data is only available from <strong>{formatMonthLabel(earliestMonth)}</strong> onward —
        wider ranges won't show anything beyond that.
      </span>
    </div>
  );
}

function DashboardContent() {
  const [active, setActive] = useState("demand");
  const { filteredPipeline } = useDateRange();
  const orionKPIs = computeOrionKPIs(filteredPipeline);

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
        height: 56,
        gap: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: PALETTE.accent,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 700, color: PALETTE.surface,
          }}> HD </div>
          <span style={{fontFamily: "Inter, sans-serif", fontSize: 20, fontWeight: 700, letterSpacing: "0.06em" }}>
            HIRING DASHBOARD
          </span>
          <span style={{
            fontSize: 20, padding: "2px 8px",
            background: PALETTE.accentSoft, color: PALETTE.accent,
            borderRadius: 4, letterSpacing: "0.08em", fontWeight: 600,
          }}>ORION</span>
        </div>

        <DateRangeFilter />
        {/* <div style={{ fontSize: 20, color: PALETTE.muted, flexShrink: 0 }}>FY 2026</div> */}
      </header>

      <DataCoverageNotice />

      {/* ── Content ─────────────────────────────────────────────── */}
      <div style={{ display: "flex" }}>
        <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>

          {active === "demand" && (
            <div>

              {/* ── 4-Card KPI Row ─────────────────────────────────────── */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
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
              <div style={{ ...grid, marginBottom: 16 }}>

                <ChartPanel
                  title="1. Roles by Status"
                  subtitle={'Bar length reflects number of positions.'}
                  info="Breaks down every role by its current status."
                  height={450} span={2} >
                  <RoleStatusBar />
                </ChartPanel>

                <ChartPanel
                  title="2. Hiring Demand by Experience Level"
                  subtitle={'Hover to see the specific roles.'}
                  info="Number of roles per month, split by required experience level."
                  height={326} >
                  <ExperienceDemandBar />
                </ChartPanel>

                <ChartPanel
                  title="3. Roles by Location"
                  subtitle={'Hover to see the specific roles.'}
                  info="Number of roles per month, split by location."
                  height={326} >
                  <RolesLocation />
                </ChartPanel>

                <ChartPanel
                  title="4. Hiring Activity Overview"
                  subtitle={'Hover for average positions per role and hire rate.'}
                  info="Monthly view of hiring activity: stacked bars show positions by status, the line shows roles opened that month."
                  height={400} span={2} >
                  <RolesActivityOverview />
                </ChartPanel>

                <ChartPanel
                  title="5. Candidate Selection Funnel"
                  subtitle="Hover to see pass rate."
                  info="Tracks candidates as they move through the pipeline."
                  height={300} >
                  <CandidateFunnel />
                </ChartPanel>

                <ChartPanel
                  title="6. Confirmed Hires"
                  subtitle='Hover to see specifications.'
                  info="Breaks down confirmed hires by role, location, and experience level."
                  height={300} >
                  <ConfirmedByDimension />
                </ChartPanel>

              </div>
            </div>
          )}
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