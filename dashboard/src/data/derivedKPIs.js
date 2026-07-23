// src/data/derivedKPIs.js
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
  skillsMonthly,
  orionPipeline,
  orionPeriodData,
  orionRolesPerPeriod,
} from './notebookData';

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const sum  = (arr) => arr.reduce((acc, val) => acc + val, 0);
const avg  = (arr) => (arr.length ? sum(arr) / arr.length : 0);

const allTTFValues = timeToFillData.flatMap(month =>
  Object.entries(month)
    .filter(([key]) => key !== 'month')
    .map(([, value]) => value)
);

// ─────────────────────────────────────────────
// DEMAND & FLOW KPIs  (dummy data)
// ─────────────────────────────────────────────
const peakNetOpenValue  = Math.max(...netOpenData.map(d => d.netOpen));
const peakNetOpenMonth  = netOpenData.find(d => d.netOpen  === peakNetOpenValue)?.month;
const peakNetClosedValue = Math.max(...netOpenData.map(d => d.netClosed));
const peakNetClosedMonth = netOpenData.find(d => d.netClosed === peakNetClosedValue)?.month;

export const demandFlowKPIs = {
  totalOpen:        sum(netOpenData.map(d => d.netOpen)),
  totalClosed:      sum(netOpenData.map(d => d.netClosed)),
  peakNetOpen:      peakNetOpenValue,
  peakNetOpenMonth,
  peakNetClosed:    peakNetClosedValue,
  peakNetClosedMonth,
  avgTimeToFill:    Math.round(avg(allTTFValues)),
};

// ─────────────────────────────────────────────
// SOURCING & CONVERSION KPIs  (dummy data)
// ─────────────────────────────────────────────
const latestOfferMetrics = offerMetricsMonthly[offerMetricsMonthly.length - 1];
const latestFunnel  = candidateFunnelMonthly.filter(d => d.month === 'May');
const funnelApplied = latestFunnel.find(d => d.stage === 'Applied')?.count || 0;
const funnelJoined  = latestFunnel.find(d => d.stage === 'Joined')?.count  || 0;

export const sourcingKPIs = {
  offerAcceptRate:        latestOfferMetrics.acceptRate,
  joiningRate:            latestOfferMetrics.joinRate,
  funnelConversion:       funnelApplied ? ((funnelJoined / funnelApplied) * 100).toFixed(1) : 0,
  avgInterviewOfferRatio: avg(interviewOfferRatio.map(d => d.ratio)).toFixed(1),
};

// ─────────────────────────────────────────────
// FINANCIAL KPIs  (dummy data)
// ─────────────────────────────────────────────
const avgCost    = Math.round(avg(costPerHire.map(d => d.cost)));
const bestMonth  = costPerHire.reduce((best, curr) => curr.cost < best.cost ? curr : best);
const latestSalaries = salaryTrend.filter(d => d.month === 'May');
const topPaid    = latestSalaries.reduce((top, curr) => curr.salary > (top.salary || 0) ? curr : top, {});

export const financialKPIs = {
  avgCostPerHire: avgCost,
  bestMonth,
  topPaidDomain: { domain: topPaid.skill, avgSalary: topPaid.salary },
};

// ─────────────────────────────────────────────
// PREDICTIVE KPIs  (dummy data)
// ─────────────────────────────────────────────
const highestDemand = SkillsDemandProb.reduce((top, curr) =>
  curr.probability > (top.probability || 0) ? curr : top, {}
);
highestDemand.domain = highestDemand.skill;

let hottestRegion = { region: '', domain: '', value: 0 };
Object.entries(forecastRegionSkill.values).forEach(([monthKey, monthMatrix]) => {
  monthMatrix.forEach((skillRow, skillIdx) => {
    skillRow.forEach((value, regionIdx) => {
      if (value > hottestRegion.value) {
        hottestRegion = { region: monthKey, domain: forecastRegionSkill.skills[skillIdx], value };
      }
    });
  });
});

const avgPredictedFillDays = Math.round(
  avg(predictedTTF.forecast.flatMap(month =>
    Object.entries(month).filter(([key]) => key !== 'month').map(([, value]) => value)
  ))
);

const bestPredictedFillMonth = predictedTTF.forecast.map(month => {
  const values = Object.entries(month).filter(([key]) => key !== 'month').map(([, value]) => value);
  return { month: month.month, days: Math.round(avg(values)) };
}).reduce((best, curr) => curr.days < best.days ? curr : best);

export const predictiveKPIs = {
  avgPredictedFillDays,
  bestPredictedFillMonth,
  highestDemand,
  hottestRegion,
};

// ─────────────────────────────────────────────
// HIRING TREND KPIs  (dummy data)
// ─────────────────────────────────────────────
const monthlyHires = (() => {
  const months = [...new Set(candidateFunnelMonthly.map(d => d.month))];
  return months.map(month => ({
    month,
    count: candidateFunnelMonthly.find(d => d.month === month && d.stage === 'Joined')?.count ?? 0,
  }));
})();

const totalHires      = sum(monthlyHires.map(d => d.count));
const peakHireMonth   = monthlyHires.reduce((best, curr) => curr.count > best.count ? curr : best);
const latestHires     = monthlyHires[monthlyHires.length - 1];
const prevHires       = monthlyHires[monthlyHires.length - 2];
const latestMoMGrowth = prevHires.count
  ? parseFloat((((latestHires.count - prevHires.count) / prevHires.count) * 100).toFixed(1))
  : 0;

const closureRates    = netOpenData.map(d => (d.netClosed / d.netOpen) * 100);
const avgClosureRate  = parseFloat(avg(closureRates).toFixed(1));
const bestClosureMonth = netOpenData.reduce((best, curr) => {
  const rate     = (curr.netClosed / curr.netOpen) * 100;
  const bestRate = (best.netClosed / best.netOpen) * 100;
  return rate > bestRate ? curr : best;
});

const skillTotalHires = skillsMonthly.map(({ skill, monthly }) => ({
  skill,
  total: sum(Object.values(monthly).map(m => m.closed)),
}));
const topHiredSkill = skillTotalHires.reduce((best, curr) => curr.total > best.total ? curr : best);

export const hiringTrendKPIs = {
  totalHires,
  peakHireMonth:   { month: peakHireMonth.month, count: peakHireMonth.count },
  latestMoMGrowth,
  avgClosureRate,
  bestClosureMonth: {
    month: bestClosureMonth.month,
    rate:  parseFloat(((bestClosureMonth.netClosed / bestClosureMonth.netOpen) * 100).toFixed(1)),
  },
  topHiredSkill,
};

// ─────────────────────────────────────────────
// ORION REAL KPIs
// ─────────────────────────────────────────────
const totalProfiles  = sum(orionPipeline.map(d => d.profilesShared));
const totalL1Rejects = sum(orionPipeline.map(d => d.l1Reject));
const totalL2Rejects = sum(orionPipeline.map(d => d.l2Reject));
const totalZeko      = sum(orionPipeline.map(d => d.zekoReject));
const totalRejects   = totalL1Rejects + totalL2Rejects + totalZeko;
const totalInProcess = sum(orionPipeline.map(d => d.inProcess));
const totalSelections = sum(orionPipeline.map(d => d.selections));

const onHoldRoles    = orionPipeline.filter(d => d.status === 'On Hold').length;
const activeRoles    = orionPipeline.filter(d => d.status === 'Active').length;
const closedRoles    = orionPipeline.filter(d => d.status === 'Closed' || d.status === 'Dropped').length;
const totalRoles     = orionPipeline.length;

// L1 pass rate = profiles that passed L1 / total profiles shared (excluding zero-profile roles)
const rolesWithProfiles = orionPipeline.filter(d => d.profilesShared > 0);
const l1PassRate = totalProfiles > 0
  ? parseFloat((((totalProfiles - totalL1Rejects) / totalProfiles) * 100).toFixed(1))
  : 0;

const l1Passed   = totalProfiles - totalL1Rejects;
const l2PassRate = l1Passed > 0
  ? parseFloat((((l1Passed - totalL2Rejects - totalZeko) / l1Passed) * 100).toFixed(1))
  : 0;

// Period-over-period profiles shared growth (Mar–May vs Dec–Feb)
const p1 = orionPeriodData[0].profilesShared; // Dec–Feb: 31
const p2 = orionPeriodData[1].profilesShared; // Mar–May: 22
const p3 = orionPeriodData[2].profilesShared; // May:     62
const latestPeriodGrowth = p2 > 0
  ? parseFloat((((p3 - p2) / p2) * 100).toFixed(1))
  : 0;

export const orionKPIs = {
  totalRoles,
  totalProfiles,
  totalRejects,
  totalL1Rejects,
  totalL2Rejects,
  totalZeko,
  totalInProcess,
  totalSelections,
  onHoldRoles,
  activeRoles,
  closedRoles,
  l1PassRate,
  l2PassRate,
  latestPeriodGrowth,   // Mar–May → May growth in profiles shared
};