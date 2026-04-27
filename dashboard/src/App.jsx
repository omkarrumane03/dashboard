// App.jsx — Recruitment Analytics Dashboard
// Data source: plots.ipynb (numpy.random.seed(42))
// Structure:
//   src/
//     data/notebookData.js       ← all raw numbers
//     utils/theme.js             ← palette + color maps
//     components/
//       kpi/KPICard.jsx
//       layout/ChartPanel.jsx
//       layout/SectionHeader.jsx
//       charts/*.jsx              ← one file per chart

import { useState } from "react";
import { PALETTE } from "./utils/theme";

// Layout
import KPICard from "./components/kpi/KPICard";
import ChartPanel from "./components/layout/ChartPanel";
import SectionHeader from "./components/layout/SectionHeader";

// Charts
import NetOpenLine from "./components/charts/NetOpenLine";
import FulfillmentVelocityBar from "./components/charts/FulfillmentVelocityBar";
import TimeToFillLine from "./components/charts/TimeToFillLine";
import DomainOpenClosedBar from "./components/charts/DomainOpenClosedBar";
import SourcingChannelBar from "./components/charts/SourcingChannelBar";
import RegionDomainHeatmap from "./components/charts/RegionDomainHeatmap";
import GaugePair from "./components/charts/GaugePair";
import InterviewOfferLine from "./components/charts/InterviewOfferLine";
import SkillConcentrationHeatmap from "./components/charts/SkillConcentrationHeatmap";
import DomainHiringShareDonut from "./components/charts/DomainHiringShareDonut";
import AgingBucketsBar from "./components/charts/AgingBucketsBar";
import ExperienceDemandBar from "./components/charts/ExperienceDemandBar";
import SourceEffectivenessBar from "./components/charts/SourceEffectivenessBar";
import EarlyAttritionBar from "./components/charts/EarlyAttritionBar";
import CandidateFunnel from "./components/charts/CandidateFunnel";
import { CostPerHireBar } from "./components/charts/CostPerHireBar";
import RevenuePerEmployeeLine from "./components/charts/RevenuePerEmployeeLine";
import SalaryTrendBar from "./components/charts/SalaryTrendBar";
import ForecastedLoadLine from "./components/charts/ForecastedLoadLine";
import ForecastRegionHeatmap from "./components/charts/ForecastRegionHeatmap";
import DomainDemandProbBar from "./components/charts/DomainDemandProbBar";
import PredictedTTFLine from "./components/charts/PredictedTTFLine";

// ─── Nav sections ───────────────────────────────────────────────────
const NAV = [
  { id: "volume",     label: "Volume & Flow" },
  { id: "efficiency", label: "Efficiency" },
  { id: "sourcing",   label: "Sourcing" },
  { id: "domain",     label: "Domain & Skill" },
  { id: "quality",    label: "Quality" },
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
            fontSize: 14, fontWeight: 700, color: "#000",
          }}>AD</div>
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.06em" }}>
            ANALYTICAL DASHBOARD
          </span>
          <span style={{
            fontSize: 10, padding: "2px 8px",
            background: PALETTE.accentSoft, color: PALETTE.accent,
            borderRadius: 4, letterSpacing: "0.08em",
          }}>-</span>
        </div>
        <div style={{ fontSize: 10, color: PALETTE.muted }}>
          seed(42) · FY 2024
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
                fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
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

          {/* ══ VOLUME & FLOW ═══════════════════════════════════════ */}
          {active === "volume" && (
            <div>
              <SectionHeader number={1} title="Volume & Flow"
                description="Monthly open requirement trends, fulfillment velocity, and open rate KPI" />

              {/* KPI Row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
                <KPICard icon="📋" label="Open Rate" value="24%" sub="Current open positions %" accent={PALETTE.orange} />
                <KPICard icon="📈" label="Peak Net Open" value="230" sub="Dec — highest this year" />
                <KPICard icon="🔁" label="Total New Roles" value="592" sub="Across all 12 months" accent={PALETTE.green} />
                <KPICard icon="✅" label="Total Closed" value="505" sub="Across all 12 months" accent={PALETTE.purple} />
              </div>

              <div style={grid}>
                <ChartPanel title="1. Net Open Requirements" subtitle="Cumulative open positions by month" height={260}>
                  <NetOpenLine />
                </ChartPanel>
                <ChartPanel title="2. Fulfillment Velocity" subtitle="New roles opened vs closed each month" height={260}>
                  <FulfillmentVelocityBar />
                </ChartPanel>
              </div>
            </div>
          )}

          {/* ══ EFFICIENCY ══════════════════════════════════════════ */}
          {active === "efficiency" && (
            <div>
              <SectionHeader number={2} title="Efficiency"
                description="Time-to-fill trends, offer acceptance rates, and interview-to-offer ratios" />

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
                <KPICard icon="⏱️" label="Avg Time-to-Fill" value="33d" sub="All domains avg" accent={PALETTE.orange} />
                <KPICard icon="🎯" label="Offer Accept Rate" value="87%" sub="450 / 520 offers" accent={PALETTE.green} />
                <KPICard icon="🚀" label="Joining Rate" value="84%" sub="380 / 450 accepted" accent={PALETTE.accent} />
                <KPICard icon="📊" label="Avg I→O Ratio" value="3.8:1" sub="Interviews per offer" accent={PALETTE.purple} />
              </div>

              <div style={grid}>
                <ChartPanel title="4. Time-to-Fill by Domain" subtitle="Avg days to fill a role, per domain per month" height={280}>
                  <TimeToFillLine />
                </ChartPanel>
                <ChartPanel title="8. Offer Acceptance & Joining Rate" subtitle="Gauges: accepted/offered · joined/accepted" height={280}>
                  <GaugePair />
                </ChartPanel>
              </div>
              <div style={{ ...grid, marginTop: 16 }}>
                <ChartPanel title="9. Interview-to-Offer Ratio" subtitle="Step line — ratio of interviews conducted per offer made" height={240}>
                  <InterviewOfferLine />
                </ChartPanel>
                <ChartPanel title="12. Aging Buckets" subtitle="Open roles by days-open bucket (0–30, 31–60, 61–90, 90+)" height={240}>
                  <AgingBucketsBar />
                </ChartPanel>
              </div>
            </div>
          )}

          {/* ══ SOURCING ════════════════════════════════════════════ */}
          {active === "sourcing" && (
            <div>
              <SectionHeader number={3} title="Sourcing"
                description="Channel performance, interview volumes, conversion rates, and hire counts" />

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
                <KPICard icon="🔗" label="LinkedIn Hires" value="193" sub="550 interviews → 35% conv." accent={PALETTE.accent} />
                <KPICard icon="🤝" label="Referral Hires" value="146" sub="380 interviews → 38% conv." accent={PALETTE.green} />
                <KPICard icon="📰" label="Portal Hires" value="110" sub="332 interviews → 33% conv." accent={PALETTE.orange} />
                <KPICard icon="📬" label="Direct Hires" value="156" sub="387 interviews → 40% conv." accent={PALETTE.purple} />
              </div>

              <div style={grid}>
                <ChartPanel title="6. Sourcing Channel Impact" subtitle="Interviews vs Hires per source channel" height={280}>
                  <SourcingChannelBar />
                </ChartPanel>
                <ChartPanel title="13. Source Effectiveness" subtitle="Total successful hires ranked by channel" height={280}>
                  <SourceEffectivenessBar />
                </ChartPanel>
              </div>
            </div>
          )}

          {/* ══ DOMAIN & SKILL ══════════════════════════════════════ */}
          {active === "domain" && (
            <div>
              <SectionHeader number={4} title="Domain & Skill"
                description="Open vs closed by domain, region heatmap, hiring share, experience demand, and skill concentration" />

              <div style={grid}>
                <ChartPanel title="5. Open vs Closed Jobs by Domain" subtitle="Grouped bars — open (full) vs closed (faded)" height={260}>
                  <DomainOpenClosedBar />
                </ChartPanel>
                <ChartPanel title="11. Domain-wise Hiring Share" subtitle="Donut — % of total closures per domain" height={260}>
                  <DomainHiringShareDonut />
                </ChartPanel>
              </div>

              <div style={{ marginTop: 16 }}>
                <ChartPanel title="7. Open Positions by Region & Domain" subtitle="Heatmap — number of open positions (current)" height={240} span={2}>
                  <RegionDomainHeatmap />
                </ChartPanel>
              </div>

              <div style={{ ...grid, marginTop: 16 }}>
                <ChartPanel title="10. Skill Concentration Heatmap" subtitle="Demand level (30–70) per domain per month" height={240}>
                  <SkillConcentrationHeatmap />
                </ChartPanel>
                <ChartPanel title="12. Demand by Experience Level" subtitle="Job count across Fresher / Junior / Mid / Senior" height={240}>
                  <ExperienceDemandBar />
                </ChartPanel>
              </div>
            </div>
          )}

          {/* ══ QUALITY ═════════════════════════════════════════════ */}
          {active === "quality" && (
            <div>
              <SectionHeader number={5} title="Quality"
                description="Early attrition (within 90 days), candidate funnel drop-off at every stage" />

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 }}>
                <KPICard icon="⚠️" label="Total Attrition" value="388" sub="Sum across 12 months" accent={PALETTE.red} />
                <KPICard icon="📉" label="Peak Attrition" value="46" sub="April — highest month" accent={PALETTE.orange} />
                <KPICard icon="🔽" label="Funnel Conversion" value="14.4%" sub="Applied → Joined (410/2850)" accent={PALETTE.green} />
              </div>

              <div style={grid}>
                <ChartPanel title="14. Early Attrition by Month" subtitle="Count of departures within first 90 days · orange = below avg · red = above avg" height={280}>
                  <EarlyAttritionBar />
                </ChartPanel>
                <ChartPanel title="15. Candidate Funnel — Drop-off at Every Stage" subtitle="Applied → Screening → Tech Interview → Offer → Joined" height={280}>
                  <CandidateFunnel />
                </ChartPanel>
              </div>
            </div>
          )}

          {/* ══ FINANCIALS ══════════════════════════════════════════ */}
          {active === "financial" && (
            <div>
              <SectionHeader number={6} title="Financials"
                description="Cost per hire, revenue per employee, and domain salary benchmarks" />

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
                <KPICard icon="💰" label="Avg Cost/Hire" value="$4.4K" sub="Across Q1–Q4" accent={PALETTE.orange} />
                <KPICard icon="📊" label="Best Quarter" value="Q4" sub="$4,100 per hire" accent={PALETTE.green} />
                <KPICard icon="🏆" label="Top Paid Domain" value="Data Sci" sub="$115K avg salary" accent={PALETTE.accent} />
                <KPICard icon="📈" label="Avg Rev/FTE" value="$20M" sub="Monthly range $15–24M" accent={PALETTE.purple} />
              </div>

              <div style={grid3}>
                <ChartPanel title="16. Cost Per Hire" subtitle="Q1–Q4 · green = below avg · red = above avg" height={260}>
                  <CostPerHireBar />
                </ChartPanel>
                <ChartPanel title="17. Revenue per Employee" subtitle="Monthly revenue contribution per FTE ($M)" height={260}>
                  <RevenuePerEmployeeLine />
                </ChartPanel>
                <ChartPanel title="18. Salary Trend Analysis" subtitle="Avg salary ($K) by domain" height={260}>
                  <SalaryTrendBar />
                </ChartPanel>
              </div>
            </div>
          )}

          {/* ══ PREDICTIVE ══════════════════════════════════════════ */}
          {active === "predictive" && (
            <div>
              <SectionHeader number={7} title="Predictive"
                description="Forecasted hiring load, regional openings, domain demand probabilities, and predicted time-to-fill" />

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 }}>
                <KPICard icon="🔮" label="Highest Demand" value="Data Sci" sub="91% probability" accent={PALETTE.accent} />
                <KPICard icon="📍" label="Hot Region" value="Delhi" sub="Mobile: 113 forecast openings" accent={PALETTE.orange} />
                <KPICard icon="⏳" label="Forecast Load Peak" value="Oct" sub="200 predicted roles" accent={PALETTE.purple} />
              </div>

              <div style={grid}>
                <ChartPanel title="19. Forecasted Hiring Load" subtitle="Predicted hiring volume across months (area chart)" height={260}>
                  <ForecastedLoadLine />
                </ChartPanel>
                <ChartPanel title="21. Forecasted Domain Demand Probability" subtitle="Probability of high demand per domain — next 6 months" height={260}>
                  <DomainDemandProbBar />
                </ChartPanel>
              </div>

              <div style={{ marginTop: 16 }}>
                <ChartPanel title="20. Forecasted Openings by Region & Domain" subtitle="Next 6 months — viridis scale · values = projected open positions" height={240}>
                  <ForecastRegionHeatmap />
                </ChartPanel>
              </div>

              <div style={{ marginTop: 16 }}>
                <ChartPanel title="21. Predicted Time-to-Fill by Domain" subtitle="Solid = historical · ★ months = forecast (dashed) · all 5 domains" height={300}>
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
