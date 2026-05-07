// src/data/derivedKPIs.js
// Dynamic KPI calculations aligned with notebookData.js and App.jsx

import {
  netOpenData,
  timeToFillData,
  offerMetricsMonthly,
  candidateFunnelMonthly,
  interviewOfferRatio,
  costPerHire,
  salaryTrend,
  SkillsDemandProb,
  forecastRegionSkill,
  predictedTTF,
} from './notebookData';

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const sum = (arr) => arr.reduce((acc, val) => acc + val, 0);
const avg = (arr) => (arr.length ? sum(arr) / arr.length : 0);

// Flatten time-to-fill values across all domains/months for historical avg
const allTTFValues = timeToFillData.flatMap(month =>
  Object.entries(month)
    .filter(([key]) => key !== 'month')
    .map(([, value]) => value)
);

// ─────────────────────────────────────────────
// DEMAND & FLOW KPIs
// ─────────────────────────────────────────────
const peakNetOpenValue = Math.max(...netOpenData.map(d => d.netOpen));
const peakNetOpenMonth = netOpenData.find(d => d.netOpen === peakNetOpenValue)?.month;

const peakNetClosedValue = Math.max(...netOpenData.map(d => d.netClosed));
const peakNetClosedMonth = netOpenData.find(d => d.netClosed === peakNetClosedValue)?.month;

export const demandFlowKPIs = {
  totalOpen: sum(netOpenData.map(d => d.netOpen)),
  totalClosed: sum(netOpenData.map(d => d.netClosed)),
  
  peakNetOpen: peakNetOpenValue,
  peakNetOpenMonth,

  peakNetClosed: peakNetClosedValue,
  peakNetClosedMonth,

  avgTimeToFill: Math.round(avg(allTTFValues)),
};

// ─────────────────────────────────────────────
// SOURCING & CONVERSION KPIs
// ─────────────────────────────────────────────
// Get latest month metrics
const latestOfferMetrics = offerMetricsMonthly[offerMetricsMonthly.length - 1];

// Calculate funnel conversion for the latest month (May)
const latestFunnel = candidateFunnelMonthly.filter(d => d.month === 'May');
const funnelApplied = latestFunnel.find(d => d.stage === 'Applied')?.count || 0;
const funnelJoined = latestFunnel.find(d => d.stage === 'Joined')?.count || 0;

export const sourcingKPIs = {
  offerAcceptRate: latestOfferMetrics.acceptRate,
  joiningRate: latestOfferMetrics.joinRate,

  funnelConversion: funnelApplied ? ((funnelJoined / funnelApplied) * 100).toFixed(1) : 0,
  avgInterviewOfferRatio: avg(interviewOfferRatio.map(d => d.ratio)).toFixed(1),
};

// ─────────────────────────────────────────────
// FINANCIAL KPIs
// ─────────────────────────────────────────────
const avgCost = Math.round(avg(costPerHire.map(d => d.cost)));
const bestMonth = costPerHire.reduce((best, curr) =>
  curr.cost < best.cost ? curr : best
);

// Find top paid skill in the latest month
const latestSalaries = salaryTrend.filter(d => d.month === 'May');
const topPaid = latestSalaries.reduce((top, curr) =>
  curr.salary > (top.salary || 0) ? curr : top
, {});

export const financialKPIs = {
  avgCostPerHire: avgCost,
  bestMonth,
  topPaidDomain: {
    domain: topPaid.skill,
    avgSalary: topPaid.salary
  },
};

// ─────────────────────────────────────────────
// PREDICTIVE KPIs
// ─────────────────────────────────────────────
const highestDemand = SkillsDemandProb.reduce((top, curr) =>
  curr.probability > (top.probability || 0) ? curr : top
, {});

// Map highestDemand skill name to 'domain' for App.jsx compatibility
highestDemand.domain = highestDemand.skill;

let hottestRegion = {
  region: '',
  domain: '',
  value: 0,
};

// Iterate through Jun_F forecast (first month of forecast)
// const forecastValues = forecastRegionSkill.values.Jun_F;
// forecastValues.forEach((row, skillIndex) => {
//   row.forEach((value, regionIndex) => {
//     if (value > hottestRegion.value) {
//       hottestRegion = {
//         region: forecastRegionSkill.regions[regionIndex],
//         domain: forecastRegionSkill.skills[skillIndex],
//         value,
//       };
//     }
//   });
// });

const avgPredictedFillDays = Math.round(
  avg(predictedTTF.forecast.flatMap(month => 
    Object.entries(month)
      .filter(([key]) => key !== 'month')
      .map(([, value]) => value)
  ))
);

const bestPredictedFillMonth = predictedTTF.forecast.map(month => {
  const values = Object.entries(month)
    .filter(([key]) => key !== 'month')
    .map(([, value]) => value);
  return {
    month: month.month,
    days: Math.round(avg(values))
  };
}).reduce((best, curr) => (curr.days < best.days ? curr : best));

export const predictiveKPIs = {
  avgPredictedFillDays,
  bestPredictedFillMonth,
  highestDemand,
  hottestRegion,
};