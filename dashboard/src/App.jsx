// App.jsx — Recruitment Analytics Dashboard
import { useState } from "react";
import { PALETTE } from "./utils/theme";

// Layout
import KPICard from "./components/kpi/KPICard";
import ChartPanel from "./components/layout/ChartPanel";
import SectionHeader from "./components/layout/SectionHeader";

import {demandFlowKPIs, sourcingKPIs,financialKPIs,predictiveKPIs,} from './data/derivedKPIs';

// Charts
import NetOpenLine from "./components/charts/NetOpenLine";
import TimeToFillLine from "./components/charts/TimeToFillLine";
import DomainOpenClosedBar from "./components/charts/DomainOpenClosedBar";
import SourcingChannelBar from "./components/charts/SourcingChannelBar";
import RegionDomainHeatmap from "./components/charts/RegionDomainHeatmap";
import GaugePair from "./components/charts/GaugePair";
import InterviewOfferLine from "./components/charts/InterviewOfferLine";
import DomainHiringShareDonut from "./components/charts/DomainHiringShareDonut";
import ExperienceDemandBar from "./components/charts/ExperienceDemandBar";
import EarlyAttritionBar from "./components/charts/EarlyAttritionBar";
import CandidateFunnel from "./components/charts/CandidateFunnel";
import { CostPerHireBar } from "./components/charts/CostPerHireBar";
import RevenuePerEmployeeLine from "./components/charts/RevenuePerEmployeeLine";
import SalaryTrendBar from "./components/charts/SalaryTrendBar";
import ForecastRegionHeatmap from "./components/charts/ForecastRegionHeatmap";
import DomainDemandProbBar from "./components/charts/DomainDemandProbBar";
import PredictedTTFLine from "./components/charts/PredictedTTFLine";

// ─── Nav sections ───────────────────────────────────────────────────
const NAV = [
  { id: "volume",     label: "Demand & Flow" },
  { id: "sourcing",   label: "Sourcing & Conversion" },
  { id: "financial",  label: "Financials" },
  { id: "predictive", label: "Predictive" },
];

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 16,
};
const grid3 = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 16,
};

export default function App() {
  const [active, setActive] = useState("volume");

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
        <div style={{ fontSize: 25, color: PALETTE.muted }}>
            FY 2026
        </div>
      </header>

      {/* ── Side Nav + Content ───────────────────────────────────── */}
      <div style={{ display: "flex" }}>
        {/* Side nav */}
        <nav style={{
          position: "sticky", top: 56, height: "calc(100vh - 56px)",
          width: 180, flexShrink: 0,
          background: PALETTE.surface,
          borderRight: `1px solid ${PALETTE.border}`,
          padding: "20px 0",
          overflowY: "auto",
        }}>
          {NAV.map(n => (
            <button
              key={n.id}
              onClick={() => setActive(n.id)}
              style={{
                width: "100%", textAlign: "left",
                padding: "10px 20px",
                background: active === n.id ? PALETTE.accentSoft : "transparent",
                border: "none",
                borderLeft: active === n.id ? `2px solid ${PALETTE.accent}` : "2px solid transparent",
                color: active === n.id ? PALETTE.accent : PALETTE.muted,
                fontSize: 15, fontWeight:800, fontFamily: "'JetBrains Mono', monospace",
                cursor: "pointer", letterSpacing: "0.04em",
                transition: "all 0.15s",
              }}
            >
              {n.label}
            </button>
          ))}
        </nav>

        {/* Main content */}
        <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>

          {/* ══ Demand & FLOW ═══════════════════════════════════════ */}
          {active === "volume" && (
            <div>
              <SectionHeader number={1} title="Demand & Flow"
                description="Open positions, hiring velocity, and fulfillment trends." />

              {/* KPI Row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 }}>
                <KPICard icon="📈" label="Peak Net Open" value={demandFlowKPIs.peakNetOpen} sub={`${demandFlowKPIs.peakNetOpenMonth} — highest this year`}/>
                <KPICard icon="✅" label="Total Closed" value={demandFlowKPIs.totalClosed} sub="Across all 6 months" accent={PALETTE.purple} />
                <KPICard icon="⏱️" label="Avg Time-to-Fill" value={`${demandFlowKPIs.avgTimeToFill}d`} sub="All domains avg" accent={PALETTE.orange}/>
              </div>

              <div style={{...grid, marginBottom: 16 }}>
                <ChartPanel title="1. Net Open Requirements" subtitle="Cumulative open positions by month" height={260}>
                  <NetOpenLine />
                </ChartPanel>
                <ChartPanel title="2. Open vs Closed Jobs by Domain" subtitle="Grouped bars — open (full) vs closed (faded)" height={260}>
                  <DomainOpenClosedBar />
                </ChartPanel>
                <ChartPanel title="3. Open Positions by Region & Domain" subtitle="Heatmap — number of open positions (current)" height={260}>
                  <RegionDomainHeatmap />
                </ChartPanel>
                <ChartPanel title="4. Domain-wise Hiring Share" subtitle="Donut — % of total closures per domain" height={260}>
                  <DomainHiringShareDonut />
                </ChartPanel>
                <ChartPanel title="5. Demand by Experience Level" subtitle="Job count across Fresher / Junior / Mid / Senior" height={260}>
                  <ExperienceDemandBar />
                </ChartPanel>
                <ChartPanel title="6. Time-to-Fill by Domain" subtitle="Avg days to fill a role, per domain per month" height={260}>
                  <TimeToFillLine />
                </ChartPanel>
              </div>
            </div>
          )}

          {/* ══ SOURCING ════════════════════════════════════════════ */}
          {active === "sourcing" && (
            <div>
              <SectionHeader number={2} title="Sourcing & Conversion"
                description="Source performance, funnel efficiency, and hire quality." />

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
                <KPICard icon="🎯" label="Offer Accept Rate" value={`${sourcingKPIs.offerAcceptRate}%`} sub="450 / 520 offers" accent={PALETTE.green} />
                <KPICard icon="🚀" label="Joining Rate" value={`${sourcingKPIs.joiningRate}%`} sub="380 / 450 accepted" accent={PALETTE.accent}/>
                <KPICard icon="⚠️" label="Total Attrition" value={sourcingKPIs.totalAttrition} sub="Sum across 6 months" accent={PALETTE.red}/>
                <KPICard icon="📉" label="Peak Attrition" value={sourcingKPIs.peakAttrition} sub={`${sourcingKPIs.peakAttritionMonth} — highest month`} accent={PALETTE.orange}/>
              </div>

              <div style={{...grid, marginBottom: 16 }}>
                <ChartPanel title="7. Sourcing Channel Impact" subtitle="Interviews vs Hires per source channel" height={260}>
                  <SourcingChannelBar />
                </ChartPanel>
                <ChartPanel title="8. Offer Acceptance & Joining Rate" subtitle="Gauges: accepted/offered · joined/accepted" height={260}>
                  <GaugePair />
                </ChartPanel>
                <ChartPanel title="9. Early Attrition by Month" subtitle="Count of departures within first 90 days · orange = below avg · red = above avg" height={260}>
                  <EarlyAttritionBar />
                </ChartPanel>
                <ChartPanel title="10. Candidate Funnel — Drop-off at Every Stage" subtitle="Applied → Screening → Tech Interview → Offer → Joined" height={260}>
                  <CandidateFunnel />
                </ChartPanel>
                <ChartPanel title="11. Interview-to-Offer Ratio" subtitle="Step line — ratio of interviews conducted per offer made" height={260} span={2}>
                  <InterviewOfferLine />
                </ChartPanel>
              </div>
            </div>
          )}

          {/* ══ FINANCIALS ══════════════════════════════════════════ */}
          {active === "financial" && (
            <div>
              <SectionHeader number={3} title="Financials"
                description="Cost per hire, revenue per employee, and domain salary benchmarks" />

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
                <KPICard icon="💰" label="Avg Cost/Hire" value={`$${(financialKPIs.avgCostPerHire / 1000).toFixed(1)}K`} sub="Across Quarters" accent={PALETTE.orange}/>
                <KPICard icon="📊" label="Best Month" value={financialKPIs.bestMonth.month} sub={`$${financialKPIs.bestMonth.cost.toLocaleString()} per hire`} accent={PALETTE.green} />
                <KPICard icon="🏆" label="Top Paid Domain" value={financialKPIs.topPaidDomain.domain} sub={`$${financialKPIs.topPaidDomain.avgSalary}K avg salary`} accent={PALETTE.accent} />
                <KPICard icon="📈" label="Avg Rev/FTE" value={`$${financialKPIs.avgRevenuePerEmployee}M`} sub={`Monthly range $${financialKPIs.minRevenuePerEmployee}-${financialKPIs.maxRevenuePerEmployee}M`} accent={PALETTE.purple}  />
              </div>

              <div style={{...grid, marginBottom: 16 }}>
                <ChartPanel title="12. Cost Per Hire" subtitle="Nov-Apr · green = below avg · red = above avg" height={260}>
                  <CostPerHireBar />
                </ChartPanel>
                <ChartPanel title="13. Salary Trend Analysis" subtitle="Avg salary ($K) by domain" height={260}>
                  <SalaryTrendBar />
                </ChartPanel>
                <ChartPanel title="14. Revenue per Employee" subtitle="Monthly revenue contribution per FTE ($M)" height={260} span={2}>
                  <RevenuePerEmployeeLine />
                </ChartPanel>
              </div>
            </div>
          )}

          {/* ══ PREDICTIVE ══════════════════════════════════════════ */}
          {active === "predictive" && (
            <div>
              <SectionHeader number={4} title="Predictive"
                description="Forecasted regional openings, domain demand probabilities, and predicted time-to-fill" />

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 }}>
                <KPICard icon="⏳" label="Predicted Fill Days" value={`${predictiveKPIs.avgPredictedFillDays}d`} sub={`Best: ${predictiveKPIs.bestPredictedFillMonth.month} (${predictiveKPIs.bestPredictedFillMonth.days}d)`} accent={PALETTE.green}/>
                <KPICard icon="🔮" label="Highest Demand" value={predictiveKPIs.highestDemand.domain} sub={`${Math.round(predictiveKPIs.highestDemand.probability * 100)}% probability`} accent={PALETTE.accent}/>
                <KPICard icon="📍" label="Hot Region" value={predictiveKPIs.hottestRegion.region} sub={`${predictiveKPIs.hottestRegion.domain}: ${predictiveKPIs.hottestRegion.value} forecast openings`} accent={PALETTE.orange}  />
              </div>

              <div style={{...grid, marginBottom: 16 }}>
                <ChartPanel title="15. Forecasted Openings by Region & Domain" subtitle="Next 6 months — viridis scale · values = projected open positions" height={260}>
                  <ForecastRegionHeatmap />
                </ChartPanel>
                <ChartPanel title="16. Forecasted Domain Demand Probability" subtitle="Probability of high demand per domain — next 6 months" height={260}>
                  <DomainDemandProbBar />
                </ChartPanel>
                <ChartPanel title="17. Predicted Time-to-Fill by Domain" subtitle="Solid = historical · ★ months = forecast (dashed) · all 5 domains" height={260} span={2}>
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
