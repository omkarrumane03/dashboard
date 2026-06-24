// App.jsx — Recruitment Analytics Dashboard
import { useState } from "react";
import { PALETTE } from "./utils/theme";

// Context
import { DateRangeProvider, useDateRange, RANGE_OPTIONS } from "./context/DateRangeContext";
import { computeOrionKPIs } from "./data/derivedKPIs";

// Layout
import KPICard       from "./components/kpi/KPICard";
import ChartPanel    from "./components/layout/ChartPanel";
import SectionHeader from "./components/layout/SectionHeader";

// ── Demand & Hiring ──────────────────────────────────────────────────
import RolesActivityOverview            from "./components/charts/RolesActivityOverview";
import RolesLocation                    from "./components/charts/RolesLocation";
import ExperienceDemandBar              from "./components/charts/ExperienceDemandBar";
import CandidateFunnel                  from "./components/charts/CandidateFunnel";
import RoleStatusBar                    from "./components/charts/RoleStatusBar";
import TimeToFill                       from "./components/charts/TimeToFill";
import ReasonBreakdown                  from "./components/charts/ReasonBreakdown";

const grid = { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 };

// ── Filter Bar Component ─────────────────────────────────────────────
function DateRangeFilter() {
  const { selectedRange, setSelectedRange } = useDateRange();

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 6,
    }}>
      {RANGE_OPTIONS.map((option) => {
        const isActive = selectedRange === option;
        return (
          <button
            key={option}
            onClick={() => setSelectedRange(option)}
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 15,
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

// ── Dashboard Content (consumes context) ────────────────────────────
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
        {/* Left — Logo & Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: PALETTE.accent,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 700, color: "#000",
          }}>AD</div>
          <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.06em" }}>
            ANALYTICAL DASHBOARD
          </span>
          <span style={{
            fontSize: 20, padding: "2px 8px",
            background: PALETTE.accentSoft, color: PALETTE.accent,
            borderRadius: 4, letterSpacing: "0.08em", fontWeight: 600,
          }}>ORION</span>
        </div>

        {/* Center — Date Range Filter */}
        <DateRangeFilter/>

        {/* Right — FY Label */}
        <div style={{ fontSize: 20, color: PALETTE.muted, flexShrink: 0 }}>FY 2026</div>
      </header>

      {/* ── Content ─────────────────────────────────────────────── */}
      <div style={{ display: "flex" }}>
        <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>

          {/* ══ DEMAND & HIRING ══════════════════════════════════════ */}
          {active === "demand" && (
            <div>

              {/* ── Role KPIs — 6 cards ──────────────────────────── */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 16, marginBottom: 20 }}>
                <KPICard
                  icon="💼"
                  label="Total Managed Roles"
                  value={orionKPIs.totalRoles}
                  accent={PALETTE.accent}
                />
                <KPICard
                  icon="🟢"
                  label="Active Roles"
                  value={orionKPIs.activeRoles}
                  accent={PALETTE.green}
                />
                <KPICard
                  icon="🎉"
                  label="Roles Closed - Hired"
                  value={orionKPIs.closedHiredRoles}
                  accent={PALETTE.orange}
                />
                <KPICard
                  icon="🔴"
                  label="Roles Closed - No Hire"
                  value={orionKPIs.closedNoHireRoles}
                  accent={PALETTE.red ?? '#F85149'}
                />
                <KPICard
                  icon="⏳"
                  label="Roles On Hold"
                  value={orionKPIs.onHoldRoles}
                  accent={PALETTE.blue}
                />
                <KPICard
                  icon="🏆"
                  label="Hire Success Rate"
                  value={`${orionKPIs.hireSuccessRate}%`}
                  sub={orionKPIs.hireSuccessRateLabel}
                  accent={PALETTE.green}
                />
              </div>

              {/* ── Openings KPIs — 5 cards ──────────────────────── */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 20 }}>
                <KPICard
                  icon="📋"
                  label="Total Openings"
                  value={orionKPIs.totalOpenings}
                  accent={PALETTE.accent}
                />
                <KPICard
                  icon="✅"
                  label="Filled Openings (Hire)"
                  value={orionKPIs.filledOpenings}
                  accent={PALETTE.green}
                />
                <KPICard
                  icon="🔓"
                  label="Active Openings"
                  value={orionKPIs.activeOpenings}
                  accent={PALETTE.purple}
                />
                <KPICard
                  icon="⏳"
                  label="On Hold Openings"
                  value={orionKPIs.onHoldOpenings}
                  accent={PALETTE.orange}
                />
                <KPICard
                  icon="🚫"
                  label="Closed Openings (No Hire)"
                  value={orionKPIs.closedNoHireOpenings}
                  accent={PALETTE.red ?? '#F85149'}
                />
              </div>

              {/* ── Charts ───────────────────────────────────────── */}
              <div style={{ ...grid, marginBottom: 16 }}>
                <ChartPanel title="1. Roles & Openings Activity"
                  subtitle="Stacked bars = openings by status per month · line = new roles opened that month · hover for avg openings per role & hire rate." height={350} span={2}>
                  <RolesActivityOverview />
                </ChartPanel>

                <ChartPanel title="2. Role Openings by Status"
                  subtitle="Toggle month · bar length = openings · colour = status · hover for full breakdown." height={400} span={2} >
                  <RoleStatusBar />
                </ChartPanel>

                <ChartPanel title="3. Candidate Funnel"
                  subtitle="Tracks cumulative candidate metrics and step-by-step drop-off rates." height={350}>
                  <CandidateFunnel />
                </ChartPanel>

                <ChartPanel title="4. Hiring Demand by Experience Level"
                  subtitle="Role count across Junior / Senior / Lead buckets per period." height={350} >
                  <ExperienceDemandBar />
                </ChartPanel>

                <ChartPanel title="5. Reason Breakdown"
                  subtitle="Analyzes the reasons for role closures, including hires and no-hire outcomes." height={350} >
                  <ReasonBreakdown />
                </ChartPanel>

                <ChartPanel title="6. Openings by Role & Location"
                  subtitle="Maps openings across role-location intersections for the selected period." height={350} >
                  <RolesLocation />
                </ChartPanel>

              </div>

            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ── Root App wrapped with Provider ───────────────────────────────────
export default function App() {
  return (
    <DateRangeProvider>
      <DashboardContent />
    </DateRangeProvider>
  );
}