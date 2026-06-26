// src/data/derivedKPIs.js
// v6.0
//
// Changes from v5:
//   • filledOpenings   → selections from Closed-Hired roles only (excludes backouts)
//   • activeOpenings   → openings where status === 'In Process' (replaces broken d.isOpen)
//   • onHoldOpenings   → openings where status === 'On Hold' (unchanged, now explicit)
//   • closedNoHireOpenings → NEW: openings where status === 'Closed-No Hire'
//   • hireSuccessRate  → filledOpenings ÷ totalOpenings (openings-level, not role-level)
//   • hireSuccessRateDenominator exported for sub-label display in KPI card

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
  const activeRoles       = inProcessRoles; // active = currently in process

  // ── Openings-level KPIs ───────────────────
  // Total openings across all roles in the filtered pipeline
  const totalOpenings = sum(pipeline.map(d => d.openings || 0));

  // Filled = selections from Closed-Hired roles only (confirmed hires, excludes backouts)
  const filledOpenings = sum(
    pipeline.filter(d => d.status === 'Closed-Hired').map(d => d.finalConfirmed ?? 0)
  );

  // Active = openings currently In Process
  const activeOpenings = sum(
    pipeline.filter(d => d.status === 'In Process').map(d => d.openings || 0)
  );

  // On Hold = openings paused for any reason
  const onHoldOpenings = sum(
    pipeline.filter(d => d.status === 'On Hold').map(d => d.openings || 0)
  );

  // Closed No Hire = openings closed without a successful hire
  const closedNoHireOpenings = sum(
    pipeline.filter(d => d.status === 'Closed-No Hire').map(d => d.openings || 0)
  );

  // ── Hire Success Rate (openings-level) ────
  // Filled Openings ÷ Total Openings
  const hireSuccessRate = totalOpenings > 0
    ? parseFloat(((filledOpenings / totalOpenings) * 100).toFixed(1))
    : 0;

  // Sub-label string for KPI card e.g. "42% · 18 of 43 openings"
  const hireSuccessRateLabel = `${filledOpenings} of ${totalOpenings} openings`;

  // ── Pass rates ────────────────────────────
  const l1PassRate = totalProfiles > 0
    ? parseFloat((((totalProfiles - totalL1Rejects) / totalProfiles) * 100).toFixed(1))
    : 0;

  const l1Passed   = totalProfiles - totalL1Rejects;
  const l2PassRate = l1Passed > 0
    ? parseFloat((((l1Passed - totalL2Rejects) / l1Passed) * 100).toFixed(1))
    : 0;

  // ── Period-level aggregations (auto-derived) ──
  const periodData     = getOrionPeriodData(pipeline);
  const rolesPerPeriod = getOrionRolesPerPeriod(pipeline);

  const totalRolesClosedHired  = sum(rolesPerPeriod.map(d => d.rolesClosedHired));
  const totalRolesClosedNoHire = sum(rolesPerPeriod.map(d => d.rolesClosedNoHire));
  const totalRolesOnHold       = sum(rolesPerPeriod.map(d => d.rolesOnHold));
  const totalRolesInProcess    = sum(rolesPerPeriod.map(d => d.rolesInProcess));

  // ── Latest period-over-period profile growth ──
  const activeMonthsData = periodData.filter(d => d.profilesShared > 0);
  const prevMonth        = activeMonthsData[activeMonthsData.length - 2];
  const lastMonth        = activeMonthsData[activeMonthsData.length - 1];

  const latestPeriodGrowth = prevMonth?.profilesShared > 0
    ? parseFloat((
        ((lastMonth.profilesShared - prevMonth.profilesShared) / prevMonth.profilesShared) * 100
      ).toFixed(1))
    : 0;

  // ── Effort-per-hire ───────────────────────
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

    // Openings status
    totalOpenings,
    filledOpenings,
    activeOpenings,
    onHoldOpenings,
    closedNoHireOpenings,

    // Rates
    l1PassRate,
    l2PassRate,
    profileToSelectRate,
    hireSuccessRate,
    hireSuccessRateLabel,
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