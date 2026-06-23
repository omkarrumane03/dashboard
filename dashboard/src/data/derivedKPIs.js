// // src/data/derivedKPIs.js
// // v5.0 — updated for Jul 2025–Jun 2026 dataset
// //
// // Changes from v4:
// //   • Status filter strings updated: 'Closed-Hired' | 'Closed-No Hire' | 'On Hold' | 'In Process'
// //   • Removed: zekoReject, f2fFinalRound, inProcess KPIs (fields removed from pipeline)
// //   • Period growth now uses getOrionPeriodData() — no more hardcoded table lookups
// //   • latestPeriodGrowth: compares last two months that have profile activity

// import {
//   orionPipeline,
//   getOrionPeriodData,
//   getOrionRolesPerPeriod,
//   MONTHS,
// } from './notebookData';

// const sum = (arr) => arr.reduce((acc, val) => acc + val, 0);

// // ─────────────────────────────────────────────
// // PARAMETERIZED KPI FUNCTION (accepts filtered pipeline)
// // ─────────────────────────────────────────────
// export function computeOrionKPIs(pipeline = orionPipeline) {

//   // ── Pipeline-level counts ──────────────────
//   const totalProfiles   = sum(pipeline.map(d => d.profilesShared));
//   const totalL1Rejects  = sum(pipeline.map(d => d.l1Reject));
//   const totalL2Rejects  = sum(pipeline.map(d => d.l2Reject));
//   const totalRejects    = totalL1Rejects + totalL2Rejects;
//   const totalSelections = sum(pipeline.map(d => d.selections ?? 0));

//   const profileToSelectRate = totalProfiles > 0
//     ? parseFloat(((totalSelections / totalProfiles) * 100).toFixed(1))
//     : 0;

//   // ── Role status counts ─────────────────────
//   const totalRoles        = pipeline.length;
//   const closedHiredRoles  = pipeline.filter(d => d.status === 'Closed-Hired').length;
//   const closedNoHireRoles = pipeline.filter(d => d.status === 'Closed-No Hire').length;
//   const onHoldRoles       = pipeline.filter(d => d.status === 'On Hold').length;
//   const inProcessRoles    = pipeline.filter(d => d.status === 'In Process').length;
//   const closedRoles       = closedHiredRoles + closedNoHireRoles;
//   const activeRoles       = inProcessRoles; // 'active' = currently in process

//   // ── Pass rates ────────────────────────────
//   const l1PassRate = totalProfiles > 0
//     ? parseFloat((((totalProfiles - totalL1Rejects) / totalProfiles) * 100).toFixed(1))
//     : 0;

//   const l1Passed   = totalProfiles - totalL1Rejects;
//   const l2PassRate = l1Passed > 0
//     ? parseFloat((((l1Passed - totalL2Rejects) / l1Passed) * 100).toFixed(1))
//     : 0;

//   // ── Period-level aggregations (auto-derived) ──
//   const periodData    = getOrionPeriodData(pipeline);
//   const rolesPerPeriod = getOrionRolesPerPeriod(pipeline);

//   const totalRolesClosedHired  = sum(rolesPerPeriod.map(d => d.rolesClosedHired));
//   const totalRolesClosedNoHire = sum(rolesPerPeriod.map(d => d.rolesClosedNoHire));
//   const totalRolesOnHold       = sum(rolesPerPeriod.map(d => d.rolesOnHold));
//   const totalRolesInProcess    = sum(rolesPerPeriod.map(d => d.rolesInProcess));

//   const hireSuccessRate = (totalRolesClosedHired + totalRolesClosedNoHire) > 0
//     ? parseFloat((
//         (totalRolesClosedHired / (totalRolesClosedHired + totalRolesClosedNoHire)) * 100
//       ).toFixed(1))
//     : 0;

//   // ── Latest period-over-period profile growth ──
//   // Find the last two months with actual profile activity
//   const activeMonths = periodData.filter(d => d.profilesShared > 0);
//   const prevMonth    = activeMonths[activeMonths.length - 2];
//   const lastMonth    = activeMonths[activeMonths.length - 1];

//   const latestPeriodGrowth = prevMonth?.profilesShared > 0
//     ? parseFloat((
//         ((lastMonth.profilesShared - prevMonth.profilesShared) / prevMonth.profilesShared) * 100
//       ).toFixed(1))
//     : 0;

//   // ── Effort-per-hire ───────────────────────
//   // Profiles shared per 1 selection (across closed-hired roles only)
//   const hiredPipeline   = pipeline.filter(d => d.status === 'Closed-Hired');
//   const hiredProfiles   = sum(hiredPipeline.map(d => d.profilesShared));
//   const hiredSelections = sum(hiredPipeline.map(d => d.selections ?? 0));
//   const effortPerHire   = hiredSelections > 0
//     ? parseFloat((hiredProfiles / hiredSelections).toFixed(1))
//     : null;

//   return {
//     // Totals
//     totalRoles,
//     totalProfiles,
//     totalL1Rejects,
//     totalL2Rejects,
//     totalRejects,
//     totalSelections,

//     // Role status
//     activeRoles,
//     inProcessRoles,
//     onHoldRoles,
//     closedHiredRoles,
//     closedNoHireRoles,
//     closedRoles,

//     // Rates
//     l1PassRate,
//     l2PassRate,
//     profileToSelectRate,
//     hireSuccessRate,
//     effortPerHire,

//     // Period aggregates
//     totalRolesClosedHired,
//     totalRolesClosedNoHire,
//     totalRolesOnHold,
//     totalRolesInProcess,
//     latestPeriodGrowth,
//   };
// }

// // ─────────────────────────────────────────────
// // STATIC EXPORT (backward compat — full dataset)
// // ─────────────────────────────────────────────
// export const orionKPIs = computeOrionKPIs(orionPipeline);
// src/data/derivedKPIs.js
// v5.0 — updated for Jul 2025–Jun 2026 dataset
//
// Changes from v4:
//   • Status filter strings updated: 'Closed-Hired' | 'Closed-No Hire' | 'On Hold' | 'In Process'
//   • Removed: zekoReject, f2fFinalRound, inProcess KPIs (fields removed from pipeline)
//   • Period growth now uses getOrionPeriodData() — no more hardcoded table lookups
//   • latestPeriodGrowth: compares last two months that have profile activity

import {
  orionPipeline,
  getOrionPeriodData,
  getOrionRolesPerPeriod,
  MONTHS,
} from './notebookData';

const sum = (arr) => arr.reduce((acc, val) => acc + val, 0);

// ─────────────────────────────────────────────
// PARAMETERIZED KPI FUNCTION (accepts filtered pipeline)
// ─────────────────────────────────────────────
export function computeOrionKPIs(pipeline = orionPipeline) {

  // ── Pipeline-level counts ──────────────────
  const totalProfiles   = sum(pipeline.map(d => d.profilesShared));
  const totalL1Rejects  = sum(pipeline.map(d => d.l1Reject));
  const totalL2Rejects  = sum(pipeline.map(d => d.l2Reject));
  const totalRejects    = totalL1Rejects + totalL2Rejects;
  const totalSelections = sum(pipeline.map(d => d.selections ?? 0));

  const profileToSelectRate = totalProfiles > 0
    ? parseFloat(((totalSelections / totalProfiles) * 100).toFixed(1))
    : 0;

  // ── Role status counts ─────────────────────
  const totalRoles        = pipeline.length;
  const closedHiredRoles  = pipeline.filter(d => d.status === 'Closed-Hired').length;
  const closedNoHireRoles = pipeline.filter(d => d.status === 'Closed-No Hire').length;
  const onHoldRoles       = pipeline.filter(d => d.status === 'On Hold').length;
  const inProcessRoles    = pipeline.filter(d => d.status === 'In Process').length;
  const closedRoles       = closedHiredRoles + closedNoHireRoles;
  const activeRoles       = inProcessRoles; // 'active' = currently in process

  // ── Openings-level KPIs ───────────────────────────────────────────
  const totalOpenings   = sum(pipeline.map(d => d.openings || 0));
  const filledOpenings  = sum(pipeline.map(d => d.selections ?? 0));
  const openOpenings    = sum(pipeline.filter(d => d.isOpen).map(d => d.openings || 0));
  const onHoldOpenings  = sum(pipeline.filter(d => d.status === 'On Hold').map(d => d.openings || 0));


  // ── Pass rates ────────────────────────────
  const l1PassRate = totalProfiles > 0
    ? parseFloat((((totalProfiles - totalL1Rejects) / totalProfiles) * 100).toFixed(1))
    : 0;

  const l1Passed   = totalProfiles - totalL1Rejects;
  const l2PassRate = l1Passed > 0
    ? parseFloat((((l1Passed - totalL2Rejects) / l1Passed) * 100).toFixed(1))
    : 0;

  // ── Period-level aggregations (auto-derived) ──
  const periodData    = getOrionPeriodData(pipeline);
  const rolesPerPeriod = getOrionRolesPerPeriod(pipeline);

  const totalRolesClosedHired  = sum(rolesPerPeriod.map(d => d.rolesClosedHired));
  const totalRolesClosedNoHire = sum(rolesPerPeriod.map(d => d.rolesClosedNoHire));
  const totalRolesOnHold       = sum(rolesPerPeriod.map(d => d.rolesOnHold));
  const totalRolesInProcess    = sum(rolesPerPeriod.map(d => d.rolesInProcess));

  const hireSuccessRate = (totalRolesClosedHired + totalRolesClosedNoHire) > 0
    ? parseFloat((
        (totalRolesClosedHired / (totalRolesClosedHired + totalRolesClosedNoHire)) * 100
      ).toFixed(1))
    : 0;

  // ── Latest period-over-period profile growth ──
  // Find the last two months with actual profile activity
  const activeMonths = periodData.filter(d => d.profilesShared > 0);
  const prevMonth    = activeMonths[activeMonths.length - 2];
  const lastMonth    = activeMonths[activeMonths.length - 1];

  const latestPeriodGrowth = prevMonth?.profilesShared > 0
    ? parseFloat((
        ((lastMonth.profilesShared - prevMonth.profilesShared) / prevMonth.profilesShared) * 100
      ).toFixed(1))
    : 0;

  // ── Effort-per-hire ───────────────────────
  // Profiles shared per 1 selection (across closed-hired roles only)
  const hiredPipeline   = pipeline.filter(d => d.status === 'Closed-Hired');
  const hiredProfiles   = sum(hiredPipeline.map(d => d.profilesShared));
  const hiredSelections = sum(hiredPipeline.map(d => d.selections ?? 0));
  const effortPerHire   = hiredSelections > 0
    ? parseFloat((hiredProfiles / hiredSelections).toFixed(1))
    : null;

  return {
    // Totals
    totalRoles,
    totalProfiles,
    totalL1Rejects,
    totalL2Rejects,
    totalRejects,
    totalSelections,

    // Role status
    activeRoles,
    inProcessRoles,
    onHoldRoles,
    closedHiredRoles,
    closedNoHireRoles,
    closedRoles,

    // Openings Status
    totalOpenings,
    filledOpenings,
    openOpenings,
    onHoldOpenings,

    // Rates
    l1PassRate,
    l2PassRate,
    profileToSelectRate,
    hireSuccessRate,
    effortPerHire,

    // Period aggregates
    totalRolesClosedHired,
    totalRolesClosedNoHire,
    totalRolesOnHold,
    totalRolesInProcess,
    latestPeriodGrowth,
  };
}

// ─────────────────────────────────────────────
// STATIC EXPORT (backward compat — full dataset)
// ─────────────────────────────────────────────
export const orionKPIs = computeOrionKPIs(orionPipeline);