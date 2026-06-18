// src/data/derivedKPIs.js
import {
  orionPipeline,
  orionPeriodData,
  orionRolesPerPeriod,
} from './notebookData';

const sum = (arr) => arr.reduce((acc, val) => acc + val, 0);

// ─────────────────────────────────────────────
// PARAMETERIZED KPI FUNCTION (accepts filtered pipeline)
// ─────────────────────────────────────────────
export function computeOrionKPIs(pipeline = orionPipeline) {
  const totalProfiles   = sum(pipeline.map(d => d.profilesShared));
  const totalL1Rejects  = sum(pipeline.map(d => d.l1Reject));
  const totalL2Rejects  = sum(pipeline.map(d => d.l2Reject));
  const totalZeko       = sum(pipeline.map(d => d.zekoReject));
  const totalRejects    = totalL1Rejects + totalL2Rejects + totalZeko;
  const totalInProcess  = sum(pipeline.map(d => d.inProcess));
  const totalSelections = sum(pipeline.map(d => d.selections));
  const totalRejections = totalRejects;

  const profileToSelectRate = totalProfiles > 0
    ? parseFloat(((totalSelections / totalProfiles) * 100).toFixed(1))
    : 0;

  const totalRoles        = pipeline.length;
  const l1PendingRoles    = pipeline.filter(d => d.status === 'Active – L1 Pending').length;
  const activeRolesOnly   = pipeline.filter(d => d.status === 'Active').length;
  const activeRoles       = activeRolesOnly + l1PendingRoles;
  const onHoldRoles       = pipeline.filter(d => d.status === 'On Hold').length;
  const notStartedRoles   = pipeline.filter(d => d.status === 'Not Started').length;
  const closedHiredRoles  = pipeline.filter(d => d.status === 'Partial Onboard').length;
  const closedNoHireRoles = pipeline.filter(
    d => d.status === 'Closed' || d.status === 'Dropped' || d.status === 'No Update'
  ).length;
  const closedRoles = closedHiredRoles + closedNoHireRoles;

  const l1PassRate = totalProfiles > 0
    ? parseFloat((((totalProfiles - totalL1Rejects) / totalProfiles) * 100).toFixed(1))
    : 0;

  const l1Passed   = totalProfiles - totalL1Rejects;
  const l2PassRate = l1Passed > 0
    ? parseFloat((((l1Passed - totalL2Rejects - totalZeko) / l1Passed) * 100).toFixed(1))
    : 0;

  // Period-level aggregations from orionRolesPerPeriod
  // Filter by openedMonth if available, else use full dataset
  const periodData = orionRolesPerPeriod;

  const totalRolesClosedHired  = sum(periodData.map(d => d.rolesClosedHired));
  const totalRolesClosedNoHire = sum(periodData.map(d => d.rolesClosedNoHire));
  const totalRolesOnHold       = sum(periodData.map(d => d.rolesOnHold));
  const totalRolesInProcess    = sum(periodData.map(d => d.rolesInProcess));
  const totalRolesNotStarted   = sum(periodData.map(d => d.rolesNotStarted));

  const hireSuccessRate = (totalRolesClosedHired + totalRolesClosedNoHire) > 0
    ? parseFloat((
        (totalRolesClosedHired / (totalRolesClosedHired + totalRolesClosedNoHire)) * 100
      ).toFixed(1))
    : 0;

  // Month-over-month growth
  const decRow = orionPeriodData.find(d => d.period === 'Dec');
  const marRow = orionPeriodData.find(d => d.period === 'Mar');
  const mayRow = orionPeriodData.find(d => d.period === 'May');

  const p1 = decRow?.profilesShared ?? 0;
  const p2 = marRow?.profilesShared ?? 0;
  const p3 = mayRow?.profilesShared ?? 0;

  const latestPeriodGrowth = p2 > 0
    ? parseFloat((((p3 - p2) / p2) * 100).toFixed(1))
    : 0;

  return {
    totalRoles, totalProfiles, totalRejects, totalRejections,
    totalL1Rejects, totalL2Rejects, totalZeko, totalInProcess, totalSelections,
    activeRoles, activeRolesOnly, l1PendingRoles, onHoldRoles, notStartedRoles,
    closedHiredRoles, closedNoHireRoles, closedRoles,
    l1PassRate, l2PassRate, profileToSelectRate,
    latestPeriodGrowth,
    totalRolesClosedHired, totalRolesClosedNoHire, totalRolesOnHold,
    totalRolesInProcess, totalRolesNotStarted,
    hireSuccessRate,
  };
}

// ─────────────────────────────────────────────
// STATIC EXPORT (backward compat — full dataset)
// ─────────────────────────────────────────────
export const orionKPIs = computeOrionKPIs(orionPipeline);