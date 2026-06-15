// src/data/derivedKPIs.js
import {
  orionPipeline,
  orionPeriodData,
  orionRolesPerPeriod,
} from './notebookData';

const sum = (arr) => arr.reduce((acc, val) => acc + val, 0);

// ─────────────────────────────────────────────
// ORION REAL KPIs
// ─────────────────────────────────────────────
const totalProfiles   = sum(orionPipeline.map(d => d.profilesShared));
const totalL1Rejects  = sum(orionPipeline.map(d => d.l1Reject));
const totalL2Rejects  = sum(orionPipeline.map(d => d.l2Reject));
const totalZeko       = sum(orionPipeline.map(d => d.zekoReject));
const totalRejects    = totalL1Rejects + totalL2Rejects + totalZeko;
const totalInProcess  = sum(orionPipeline.map(d => d.inProcess));
const totalSelections = sum(orionPipeline.map(d => d.selections));

const totalRejections = totalRejects;

const profileToSelectRate = totalProfiles > 0
  ? parseFloat(((totalSelections / totalProfiles) * 100).toFixed(1))
  : 0;

const totalRoles        = orionPipeline.length;
const l1PendingRoles    = orionPipeline.filter(d => d.status === 'Active – L1 Pending').length;
const activeRolesOnly   = orionPipeline.filter(d => d.status === 'Active').length;
const activeRoles       = activeRolesOnly + l1PendingRoles;
const onHoldRoles       = orionPipeline.filter(d => d.status === 'On Hold').length;
const notStartedRoles   = orionPipeline.filter(d => d.status === 'Not Started').length;
const closedHiredRoles  = orionPipeline.filter(d => d.status === 'Partial Onboard').length;
const closedNoHireRoles = orionPipeline.filter(
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

// Month-over-month growth: Dec (31) → Mar (22) → May (55)
// Using .find() instead of index-based access now that data is monthly
const decRow = orionPeriodData.find(d => d.period === 'Dec');
const marRow = orionPeriodData.find(d => d.period === 'Mar');
const mayRow = orionPeriodData.find(d => d.period === 'May');

const p1 = decRow?.profilesShared ?? 0;  // Dec: 31
const p2 = marRow?.profilesShared ?? 0;  // Mar: 22
const p3 = mayRow?.profilesShared ?? 0;  // May: 55

const latestPeriodGrowth = p2 > 0
  ? parseFloat((((p3 - p2) / p2) * 100).toFixed(1))
  : 0;

const totalRolesClosedHired  = sum(orionRolesPerPeriod.map(d => d.rolesClosedHired));
const totalRolesClosedNoHire = sum(orionRolesPerPeriod.map(d => d.rolesClosedNoHire));
const totalRolesOnHold       = sum(orionRolesPerPeriod.map(d => d.rolesOnHold));
const totalRolesInProcess    = sum(orionRolesPerPeriod.map(d => d.rolesInProcess));
const totalRolesNotStarted   = sum(orionRolesPerPeriod.map(d => d.rolesNotStarted));

const hireSuccessRate = (totalRolesClosedHired + totalRolesClosedNoHire) > 0
  ? parseFloat((
      (totalRolesClosedHired / (totalRolesClosedHired + totalRolesClosedNoHire)) * 100
    ).toFixed(1))
  : 0;

export const orionKPIs = {
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