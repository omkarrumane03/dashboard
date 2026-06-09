// App.jsx — Recruitment Analytics Dashboard
import { useState } from "react";
import { PALETTE } from "./utils/theme";

// Layout
import KPICard      from "./components/kpi/KPICard";
import ChartPanel   from "./components/layout/ChartPanel";
import SectionHeader from "./components/layout/SectionHeader";

import {
  demandFlowKPIs,
  sourcingKPIs,
  hiringTrendKPIs,
  orionKPIs,
} from './data/derivedKPIs';

// ── Demand & Hiring ──────────────────────────────────────────────────
import NetOpenLine          from "./components/charts/NetOpenLine";
import SkillOpenClosedShare from "./components/charts/SkillOpenClosedShare"; // now: Profiles vs Rejects
import RegionDomainHeatmap  from "./components/charts/RegionSkillsHeatmap";  // now: Location × Period
import ExperienceDemandBar  from "./components/charts/ExperienceDemandBar";  // now: real exp buckets
import HiresClosureCombo    from "./components/charts/HiresClosureCombo";    // now: Profiles + Reject Rate
import CandidateFunnel       from "./components/charts/CandidateFunnel";        // now: real stages
// ─── Nav ─────────────────────────────────────────────────────────────
// const NAV = [
//   { id: "demand",     label: "Demand & Hiring"       },
// ];

const grid = { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 };

export default function App() {
  const [active, setActive] = useState("demand");

  return (
    <div style={{
      minHeight: "100vh",
      background: PALETTE.bg,
      color: PALETTE.text,
      fontFamily: "'JetBrains Mono', monospace",
    }}>

      {/* ── Top Bar ─────────────────────────────────────────────── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: PALETTE.surface,
        borderBottom: `1px solid ${PALETTE.border}`,
        padding: "0 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 56,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
            fontSize: 13, padding: "2px 8px",
            background: PALETTE.accentSoft, color: PALETTE.accent,
            borderRadius: 4, letterSpacing: "0.08em",
          }}>ORION · Dec 2025 - May 2026</span>
        </div>
        <div style={{ fontSize: 18, color: PALETTE.muted }}>FY 2026</div>
      </header>

      {/* ── Side Nav + Content ───────────────────────────────────── */}
      <div style={{ display: "flex" }}>
        {/* <nav style={{
          position: "sticky", top: 56, height: "calc(100vh - 56px)",
          width: 180, flexShrink: 0,
          background: PALETTE.surface,
          borderRight: `1px solid ${PALETTE.border}`,
          padding: "20px 0", overflowY: "auto",
        }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => setActive(n.id)} style={{
              width: "100%", textAlign: "left", padding: "10px 20px",
              background: active === n.id ? PALETTE.accentSoft : "transparent",
              border: "none",
              borderLeft: active === n.id ? `2px solid ${PALETTE.accent}` : "2px solid transparent",
              color: active === n.id ? PALETTE.accent : PALETTE.muted,
              fontSize: 13, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace",
              cursor: "pointer", letterSpacing: "0.04em", transition: "all 0.15s",
            }}>
              {n.label}
            </button>
          ))}
        </nav> */}

        <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>

          {/* ══ DEMAND & HIRING ══════════════════════════════════════ */}
          {active === "demand" && (
            <div>
              <SectionHeader number={1} title="Demand & Hiring"
                description="Pipeline activity, rejection trends, work mode shifts, and experience demand — Orion Data." />

              {/* 5 KPIs */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 20 }}>
                <KPICard
                  icon="💼"
                  label="Total Managed Roles"
                  value={orionKPIs.totalRoles}
                  sub="Dec 2025 – May 2026"
                  accent={PALETTE.accent}
                />
                <KPICard
                  icon="🟢"
                  label="Active Roles"
                  value={orionKPIs.activeRoles}
                  sub={`${orionKPIs.activeRolesOnly} active · ${orionKPIs.l1PendingRoles} L1 pending`}
                  accent={PALETTE.green}
                />
                <KPICard
                  icon="🎉"
                  label="Roles Closed – Hired"
                  value={orionKPIs.closedHiredRoles}
                  sub="Closed with successful hire"
                  accent={PALETTE.green}
                />
                
                <KPICard
                  icon="🔴"
                  label="Roles Closed – No Hire"
                  value={orionKPIs.closedNoHireRoles}
                  sub={`${orionKPIs.closedHiredRoles} closed with hire`}
                  accent={PALETTE.red ?? '#F85149'}
                />  
                <KPICard
                  icon="⏳"
                  label="Roles On Hold"
                  value={orionKPIs.onHoldRoles}
                  sub="Paused by client"
                  accent={PALETTE.orange}
                />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}> 
                <KPICard
                  icon="🚀"
                  label="Not Started"
                  value={orionKPIs.notStartedRoles}
                  sub="Profiles yet to be shared"
                  accent="#6e7681"
                />  
                <KPICard
                  icon="🎯"
                  label="L1 Pass Rate"
                  value={`${orionKPIs.l1PassRate}%`}
                  sub="Profiles clearing L1 round"
                  accent={PALETTE.green}
                />
                <KPICard
                  icon="🎯"
                  label="L2 Pass Rate"
                  value={`${orionKPIs.l2PassRate}%`}
                  sub="Profiles clearing L2 round"
                  accent={PALETTE.accent}
                />
                <KPICard
                  icon="🏆"
                  label="Hire Success Rate"
                  value={`${orionKPIs.hireSuccessRate}%`}
                  sub="Concluded roles with a hire"
                  accent={PALETTE.green}
                />
              
              </div>

              <div style={{ ...grid, marginBottom: 16 }}>
                <ChartPanel title="1. Roles Activity Over Time"
                  subtitle="Tracks how roles opened, resolved, went on hold, or remained in process across each hiring period." height={280}>
                  <NetOpenLine />
                </ChartPanel>

                <ChartPanel title="2. Openings by Role & Location"
                  subtitle="Maps openings across role–location intersections for the selected period." height={280}>
                  <RegionDomainHeatmap />
                </ChartPanel>

                <ChartPanel title="3. Hiring Demand by Experience Level"
                  subtitle="Role count across Junior / Senior / Lead buckets per period" height={280}>
                  <ExperienceDemandBar />
                </ChartPanel>

                <ChartPanel title="4. Profiles Shared & Rejection - Hire Rate"
                  subtitle="Overlays submission volume with overall rejections - hires across periods." height={280}>
                  <HiresClosureCombo />
                </ChartPanel>

                <ChartPanel title="5. Candidate Funnel"
                  subtitle="Tracks cumulative candidate metrics and step-by-step drop-off rates." height={280}>
                  <CandidateFunnel />
                </ChartPanel>

                <ChartPanel title="6. Rejection Breakdown by Role & Period"
                  subtitle="Toggle: By Role (grouped) · By Period (stacked % breakdown)" height={280}>
                  <SkillOpenClosedShare />
                </ChartPanel>

              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}