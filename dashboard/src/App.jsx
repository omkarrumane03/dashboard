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
import NetOpenLine                      from "./components/charts/NetOpenLine";
import RejectionBreakdown               from "./components/charts/RejectionBreakdown";
import RolesLocation                    from "./components/charts/RolesLocation";
import ExperienceDemandBar              from "./components/charts/ExperienceDemandBar";
import CandidateFunnel                  from "./components/charts/CandidateFunnel";
import RoleStatusBar                    from "./components/charts/RoleStatusBar";
import ProfilesSharedvsRejectionRates   from "./components/charts/ProfilesSharedvsRejectionRates";

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
              {/* <SectionHeader
                // number={1}
                title="Demand & Hiring"
                description="Pipeline activity, rejection trends, work mode shifts, and experience demand — Orion Data."
              /> */}

              {/* 5 KPIs */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
                <KPICard
                  icon="💼" label="Total Managed Roles"
                  value={orionKPIs.totalRoles}
                  // sub="Dec 2025 - May 2026"
                  accent={PALETTE.accent}
                />
                <KPICard
                  icon="🟢"
                  label="Active Roles"
                  value={orionKPIs.activeRoles}
                  // sub={`${orionKPIs.activeRolesOnly} active · ${orionKPIs.l1PendingRoles} L1 pending`}
                  accent={PALETTE.green}
                />
                <KPICard
                  icon="🎉"
                  label="Roles Closed - Hired"
                  value={orionKPIs.closedHiredRoles}
                  // sub="Closed with successful hire"
                  accent={PALETTE.green}
                />
                <KPICard
                  icon="🔴"
                  label="Roles Closed - No Hire"
                  value={orionKPIs.closedNoHireRoles}
                  // sub={`${orionKPIs.closedHiredRoles} closed with hire`}
                  accent={PALETTE.red ?? '#F85149'}
                />
              </div>

              {/* 4 KPIs */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 }}>
                <KPICard
                  icon="🚀"
                  label="Not Started"
                  value={orionKPIs.notStartedRoles}
                  // sub="Profiles yet to be shared"
                  accent="#6e7681"
                />
                <KPICard
                  icon="⏳"
                  label="Roles On Hold"
                  value={orionKPIs.onHoldRoles}
                  // sub="Paused by client"
                  accent={PALETTE.orange}
                />
                {/* <KPICard
                  icon="🎯"
                  label="L1 Pass Rate"
                  value={`${orionKPIs.l1PassRate}%`}
                  // sub="Profiles clearing L1 round"
                  accent={PALETTE.green}
                />
                <KPICard
                  icon="🎯"
                  label="L2 Pass Rate"
                  value={`${orionKPIs.l2PassRate}%`}
                  // sub="Profiles clearing L2 round"
                  accent={PALETTE.accent}
                /> */}
                <KPICard
                  icon="🏆"
                  label="Hire Success Rate"
                  value={`${orionKPIs.hireSuccessRate}%`}
                  // sub="Concluded roles with a hire"
                  accent={PALETTE.green}
                />
              </div>

              {/* Charts */}
              <div style={{ ...grid, marginBottom: 16 }}>
                <ChartPanel title="1. Roles Activity Over Time"
                  subtitle="Tracks how roles opened, resolved, went on hold, or remained in process across each hiring period." height={280} span ={2}>
                  <NetOpenLine />
                </ChartPanel>

                <ChartPanel title="2. Openings by Role & Location"
                  subtitle="Maps openings across role-location intersections for the selected period." height={280} span ={2}>
                  <RolesLocation />
                </ChartPanel>

                <ChartPanel title="3. Hiring Demand by Experience Level"
                  subtitle="Role count across Junior / Senior / Lead buckets per period" height={280} span ={2}>
                  <ExperienceDemandBar />
                </ChartPanel>

                <ChartPanel title="4. Profiles Shared & Rejection Rate"
                  subtitle="Overlays submission volume with overall rejections across periods." height={280} span ={2}>
                  <ProfilesSharedvsRejectionRates />
                </ChartPanel>

                <ChartPanel title="5. Candidate Funnel"
                  subtitle="Tracks cumulative candidate metrics and step-by-step drop-off rates." height={280} span ={2}>
                  <CandidateFunnel />
                </ChartPanel>

                <ChartPanel title="6. Rejection Breakdown by Role & Period"
                  subtitle="Toggle: By Role (grouped) · By Period (stacked % breakdown)" height={280} span ={2}>
                  <RejectionBreakdown />
                </ChartPanel>

                <ChartPanel
                  title="7. Role Openings by Status"
                  subtitle="Toggle month · bar length = openings · colour = status · hover for full breakdown"
                  height={560} span ={2}>
                  {/* style={{ gridColumn: '1 / -1' }} */}
                  <RoleStatusBar />
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