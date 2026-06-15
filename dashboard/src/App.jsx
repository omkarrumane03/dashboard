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
import RejectionBreakdown from "./components/charts/RejectionBreakdown"; 
import RolesLocation  from "./components/charts/RegionSkillsHeatmap";  
import ExperienceDemandBar  from "./components/charts/ExperienceDemandBar";   
import CandidateFunnel       from "./components/charts/CandidateFunnel";        
import RoleStatusBar    from "./components/charts/RoleStatusBar";
import ProfilesSharedvsRejectionRates from "./components/charts/ProfilesSharedvsRejectionRates";

const grid = { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 };

export default function App() {
  const [active, setActive] = useState("demand");
  const [selectedMonth, setSelectedMonth] = useState(null);
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

        <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>

          {/* ══ DEMAND & HIRING ══════════════════════════════════════ */}
          {active === "demand" && (
            <div>
              <SectionHeader number={1} title="Demand & Hiring"
                description="Pipeline activity, rejection trends, work mode shifts, and experience demand — Orion Data." />

              {/* 5 KPIs */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 20 }}>
                <KPICard
                  icon="💼" label="Total Managed Roles"
                  value={orionKPIs.totalRoles}
                  sub="Dec 2025 - May 2026"
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
                  subtitle="Maps openings across role-location intersections for the selected period." height={280}>
                  <RolesLocation />
                </ChartPanel>

                <ChartPanel title="3. Hiring Demand by Experience Level"
                  subtitle="Role count across Junior / Senior / Lead buckets per period" height={280}>
                  <ExperienceDemandBar />
                </ChartPanel>

                <ChartPanel title="4. Profiles Shared & Rejection - Hire Rate"
                  subtitle="Overlays submission volume with overall rejections - hires across periods." height={280}>
                  <ProfilesSharedvsRejectionRates />
                </ChartPanel>

                <ChartPanel title="5. Candidate Funnel"
                  subtitle="Tracks cumulative candidate metrics and step-by-step drop-off rates." height={280}>
                  <CandidateFunnel />
                </ChartPanel>

                <ChartPanel title="6. Rejection Breakdown by Role & Period"
                  subtitle="Toggle: By Role (grouped) · By Period (stacked % breakdown)" height={280}>
                  <RejectionBreakdown />
                </ChartPanel>

                <ChartPanel
                  title="7. Role Openings by Status"
                  subtitle="Toggle month · bar length = openings · colour = status · hover for full breakdown"
                  height={560}
                  style={{ gridColumn: '1 / -1' }}>
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