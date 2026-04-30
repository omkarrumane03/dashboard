
// src/data/derivedKPIs.js
// Dynamic KPI calculations for all ACTIVE KPI cards in App.jsx

import {
  netOpenData,
  timeToFillData,
  offerMetrics,
  earlyAttrition,
  candidateFunnel,
  interviewOfferRatio,
  costPerHire,
  revenuePerEmployee,
  salaryTrend,
  domainDemandProb,
  forecastRegionDomain,
  predictedTTF,
} from './notebookData';

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const sum = (arr) => arr.reduce((acc, val) => acc + val, 0);
const avg = (arr) => (arr.length ? sum(arr) / arr.length : 0);

// Flatten time-to-fill values across all domains/months
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

export const demandFlowKPIs = {
  peakNetOpen: peakNetOpenValue,
  peakNetOpenMonth,

  totalNewRoles: sum(netOpenData.map(d => d.newRoles)),

  totalClosed: sum(netOpenData.map(d => d.closed)),

  avgTimeToFill: Math.round(avg(allTTFValues)),
};

// ─────────────────────────────────────────────
// SOURCING & CONVERSION KPIs
// ─────────────────────────────────────────────
const totalAttrition = sum(earlyAttrition.map(d => d.count));
const peakAttritionValue = Math.max(...earlyAttrition.map(d => d.count));
const peakAttritionMonth = earlyAttrition.find(d => d.count === peakAttritionValue)?.month;

const funnelApplied = candidateFunnel[0]?.count || 0;
const funnelJoined = candidateFunnel[candidateFunnel.length - 1]?.count || 0;

export const sourcingKPIs = {
  offerAcceptRate: offerMetrics.acceptRate,

  joiningRate: offerMetrics.joinRate,

  totalAttrition,

  peakAttrition: peakAttritionValue,
  peakAttritionMonth,

  funnelConversion: ((funnelJoined / funnelApplied) * 100).toFixed(1),

  avgInterviewOfferRatio: avg(interviewOfferRatio.map(d => d.ratio)).toFixed(1),
  // Add these two lines:
  funnelApplied,
  funnelJoined,
};

// ─────────────────────────────────────────────
// FINANCIAL KPIs
// ─────────────────────────────────────────────
const avgCost = Math.round(avg(costPerHire.map(d => d.cost)));
const bestMonth = costPerHire.reduce((best, curr) =>
  curr.cost < best.cost ? curr : best
);

const topPaidDomain = salaryTrend.reduce((top, curr) =>
  curr.avgSalary > top.avgSalary ? curr : top
);

const avgRevenue = Math.round(avg(revenuePerEmployee.map(d => d.revenue)));
const minRevenue = Math.min(...revenuePerEmployee.map(d => d.revenue));
const maxRevenue = Math.max(...revenuePerEmployee.map(d => d.revenue));

export const financialKPIs = {
  avgCostPerHire: avgCost,

  bestMonth,

  topPaidDomain,

  avgRevenuePerEmployee: avgRevenue,
  minRevenuePerEmployee: minRevenue,
  maxRevenuePerEmployee: maxRevenue,
};

// ─────────────────────────────────────────────
// PREDICTIVE KPIs
// ─────────────────────────────────────────────
const highestDemand = domainDemandProb.reduce((top, curr) =>
  curr.probability > top.probability ? curr : top
);

let hottestRegion = {
  region: '',
  domain: '',
  value: 0,
};

forecastRegionDomain.values.forEach((row, domainIndex) => {
  row.forEach((value, regionIndex) => {
    if (value > hottestRegion.value) {
      hottestRegion = {
        region: forecastRegionDomain.regions[regionIndex],
        domain: forecastRegionDomain.domains[domainIndex],
        value,
      };
    }
  });
});

// FIX: Map over predictedTTF.forecast instead of predictedTTF
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


