// App.jsx — Recruitment Analytics Dashboard
import { useState } from "react";
import { PALETTE } from "./utils/theme";

// Layout
import KPICard from "./components/kpi/KPICard";
import ChartPanel from "./components/layout/ChartPanel";
import SectionHeader from "./components/layout/SectionHeader";

import {
  demandFlowKPIs,
  sourcingKPIs,
  financialKPIs,
  predictiveKPIs,
  hiringTrendKPIs,
} from './data/derivedKPIs';

// ── Demand & Hiring ──────────────────────────────────────────────────
import NetOpenLine          from "./components/charts/NetOpenLine";
import TimeToFillLine       from "./components/charts/TimeToFillLine";
import SkillOpenClosedShare from "./components/charts/SkillOpenClosedShare";
import RegionDomainHeatmap  from "./components/charts/RegionSkillsHeatmap";
import ExperienceDemandBar  from "./components/charts/ExperienceDemandBar";
import HiresClosureCombo    from "./components/charts/HiresClosureCombo";
import MoMHireGrowthBar     from "./components/charts/MomHireGrowthBar";
import SkillHireCountBar    from "./components/charts/SkillHireCountBar";

// ── Sourcing, Conversion & Financials ────────────────────────────────
import SourcingChannelWithRatio from "./components/charts/SourcingChannelWithRatio";
import GaugePair                from "./components/charts/GaugePair";
import CandidateFunnel          from "./components/charts/CandidateFunnel";
import { CostPerHireBar }       from "./components/charts/CostPerHireBar";
import SalaryTrendBar           from "./components/charts/SalaryTrendBar";

// ── Predictive & Forecast ────────────────────────────────────────────
import ForecastRegionHeatmap from "./components/charts/ForecastRegionHeatmap";
import DomainDemandProbBar   from "./components/charts/SkillsDemandProbBar";
import PredictedTTFLine      from "./components/charts/PredictedTTFLine";

// ─── Nav ─────────────────────────────────────────────────────────────
const NAV = [
  { id: "demand",     label: "Demand & Hiring" },
  { id: "sourcing",   label: "Sourcing & Financials" },
  { id: "predictive", label: "Predictive" },
];

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
            fontSize: 15, padding: "2px 8px",
            background: PALETTE.accentSoft, color: PALETTE.accent,
            borderRadius: 4, letterSpacing: "0.08em",
          }}>-</span>
        </div>
        <div style={{ fontSize: 25, color: PALETTE.muted }}>FY 2026</div>
      </header>

      {/* ── Side Nav + Content ───────────────────────────────────── */}
      <div style={{ display: "flex" }}>
        <nav style={{
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
              fontSize: 15, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace",
              cursor: "pointer", letterSpacing: "0.04em", transition: "all 0.15s",
            }}>
              {n.label}
            </button>
          ))}
        </nav>

        <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>

          {/* ══ DEMAND & HIRING ══════════════════════════════════════ */}
          {active === "demand" && (
            <div>
              <SectionHeader number={1} title="Demand & Hiring"
                description="Open positions, fulfillment trends, hire volumes, and month-over-month growth." />

              {/* 5 KPIs — most signal-dense from both former sections */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 20 }}>
                <KPICard icon="✅" label="Total Open"
                  value={demandFlowKPIs.totalOpen}
                  sub="Till now" accent={PALETTE.purple} />
                <KPICard icon="✅" label="Total Closed"
                  value={demandFlowKPIs.totalClosed}
                  sub="Till now" accent={PALETTE.purple} />
                <KPICard icon="👥" label="Total Hires"
                  value={hiringTrendKPIs.totalHires}
                  sub="Across all months" accent={PALETTE.green} />
                <KPICard icon="📈" label="Latest MoM Growth"
                  value={`${hiringTrendKPIs.latestMoMGrowth > 0 ? '+' : ''}${hiringTrendKPIs.latestMoMGrowth}%`}
                  sub="Apr → May change"
                  accent={hiringTrendKPIs.latestMoMGrowth >= 0 ? PALETTE.green : PALETTE.orange} />
                <KPICard icon="⏱️" label="Avg Time-to-Fill"
                  value={`${demandFlowKPIs.avgTimeToFill}d`}
                  sub="All skills avg till now" accent={PALETTE.orange} />
              </div>

              <div style={{ ...grid, marginBottom: 16 }}>
                <ChartPanel title="1. Net Open v Net Closed"
                  subtitle="Cumulative open/closed positions by month" height={260}>
                  <NetOpenLine />
                </ChartPanel>

                <ChartPanel title="2. Skill Open/Closed & Hiring Share"
                  subtitle="Toggle — absolute open/closed counts · or % share of closures per skill" height={260}>
                  <SkillOpenClosedShare />
                </ChartPanel>

                <ChartPanel title="3. Open Positions by Location & Skill"
                  subtitle="Heatmap — number of open positions by month" height={260}>
                  <RegionDomainHeatmap />
                </ChartPanel>

                <ChartPanel title="4. Demand by Experience Level"
                  subtitle="Job count across Fresher / Junior / Mid / Senior by month" height={260}>
                  <ExperienceDemandBar />
                </ChartPanel>

                <ChartPanel title="5. Time-to-Fill by Skill"
                  subtitle="Avg days to fill a role, per skill per month" height={260}>
                  <TimeToFillLine />
                </ChartPanel>

                <ChartPanel title="6. Hires Over Time & Closure Rate"
                  subtitle="Area = monthly hires (left) · dashed line = closure rate % (right) · orange = averages" height={260}>
                  <HiresClosureCombo />
                </ChartPanel>

                <ChartPanel title="7. MoM Hire Growth"
                  subtitle="Month-over-month % change — green = growth · orange = decline" height={260}>
                  <MoMHireGrowthBar />
                </ChartPanel>

                {/* <ChartPanel title="8. Skill-wise Hire Count"
                  subtitle="Closed positions per skill — toggle months to compare" height={260}>
                  <SkillHireCountBar />
                </ChartPanel> */}
              </div>
            </div>
          )}

          {/* ══ SOURCING, CONVERSION & FINANCIALS ════════════════════ */}
          {active === "sourcing" && (
            <div>
              <SectionHeader number={2} title="Sourcing & Financials"
                description="Pipeline efficiency, offer outcomes, cost per hire, and salary benchmarks." />

              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 20 }}>
                <KPICard icon="🎯" label="Offer Accept Rate"
                  value={`${sourcingKPIs.offerAcceptRate}%`}
                  sub="450 / 520 offers" accent={PALETTE.green} />
                <KPICard icon="🚀" label="Joining Rate"
                  value={`${sourcingKPIs.joiningRate}%`}
                  sub="380 / 450 accepted" accent={PALETTE.accent} />
                <KPICard icon="💰" label="Avg Cost/Hire"
                  value={`$${(financialKPIs.avgCostPerHire / 1000).toFixed(1)}K`}
                  sub="Till now" accent={PALETTE.orange} />
                <KPICard icon="📊" label="Best Cost Month"
                  value={financialKPIs.bestMonth.month}
                  sub={`$${financialKPIs.bestMonth.cost.toLocaleString()} per hire`} accent={PALETTE.green} />
                <KPICard icon="🏆" label="Top Paid Skill"
                  value={financialKPIs.topPaidDomain.domain}
                  sub={`$${financialKPIs.topPaidDomain.avgSalary}K avg salary`} accent={PALETTE.accent} />
              </div>

              <div style={{ ...grid, marginBottom: 16 }}>
                <ChartPanel title="9. Sourcing Channel Impact & Interview/Offer Ratio"
                  subtitle="Bars = interviews vs hires per source · dashed line = interview-to-offer ratio (right axis)" height={260} span={2}>
                  <SourcingChannelWithRatio />
                </ChartPanel>

                <ChartPanel title="10. Offer Acceptance & Joining Rate"
                  subtitle="Gauges: accepted/offered · joined/accepted" height={260}>
                  <GaugePair />
                </ChartPanel>

                <ChartPanel title="11. Candidate Funnel — Drop-off at Every Stage"
                  subtitle="Applied → Screening → Tech Interview → Offer → Joined" height={260}>
                  <CandidateFunnel />
                </ChartPanel>

                <ChartPanel title="12. Cost Per Hire"
                  subtitle="Feb-May · green = below avg · red = above avg" height={260}>
                  <CostPerHireBar />
                </ChartPanel>

                <ChartPanel title="13. Salary Trend Analysis"
                  subtitle="Avg salary ($K) by skill" height={260}>
                  <SalaryTrendBar />
                </ChartPanel>
              </div>
            </div>
          )}

          {/* ══ PREDICTIVE ════════════════════════════════ */}
          {active === "predictive" && (
            <div>
              <SectionHeader number={3} title="Predictive"
                description="Predictive regional openings, domain demand probabilities, and predicted time-to-fill." />

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 }}>
                <KPICard icon="⏳" label="Predicted Fill Days"
                  value={`${predictiveKPIs.avgPredictedFillDays}d`}
                  sub={`Best: ${predictiveKPIs.bestPredictedFillMonth.month} (${predictiveKPIs.bestPredictedFillMonth.days}d)`}
                  accent={PALETTE.green} />
                <KPICard icon="🔮" label="Predicted Highest Demand"
                  value={predictiveKPIs.highestDemand.domain}
                  sub={`${Math.round(predictiveKPIs.highestDemand.probability * 100)}% probability`}
                  accent={PALETTE.accent} />
                <KPICard icon="📍" label="Predicted Hot Region"
                  value={predictiveKPIs.hottestRegion.region || "—"}
                  sub={predictiveKPIs.hottestRegion.region
                    ? `${predictiveKPIs.hottestRegion.domain}: ${predictiveKPIs.hottestRegion.value} forecast openings`
                    : "See heatmap below"}
                  accent={PALETTE.orange} />
              </div>

              <div style={{ ...grid, marginBottom: 16 }}>
                <ChartPanel title="14. Predicted Openings by Region & Domain"
                  subtitle="Next 3 months — viridis scale · values = projected open positions" height={260}>
                  <ForecastRegionHeatmap />
                </ChartPanel>

                <ChartPanel title="15. Predicted Domain Demand Probability"
                  subtitle="Probability of high demand per domain — next 3 months" height={260}>
                  <DomainDemandProbBar />
                </ChartPanel>

                <ChartPanel title="16. Predicted Time-to-Fill by Skill"
                  subtitle="Solid = historical · ★ months = forecast (dashed) · all 5 skills" height={260} span={2}>
                  <PredictedTTFLine />
                </ChartPanel>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}