// src/data/derivedKPIs.js
import {
  orionPipeline,
  orionPeriodData,
  orionRolesPerPeriod,
} from './notebookData';

// // ─────────────────────────────────────────────
// // Helpers
// // ─────────────────────────────────────────────
const sum  = (arr) => arr.reduce((acc, val) => acc + val, 0);
const avg  = (arr) => (arr.length ? sum(arr) / arr.length : 0);

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

// App.jsx line 213 consumes `totalRejections` — alias of totalRejects
const totalRejections = totalRejects;

// App.jsx line 206 consumes `profileToSelectRate`
const profileToSelectRate = totalProfiles > 0
  ? parseFloat(((totalSelections / totalProfiles) * 100).toFixed(1))
  : 0;

// Role status counts — covers all statuses introduced in v3.0
const totalRoles        = orionPipeline.length;

// App line 153: "Includes pending L1 reviews" — so activeRoles must include l1Pending
const l1PendingRoles    = orionPipeline.filter(d => d.status === 'Active – L1 Pending').length;
const activeRolesOnly   = orionPipeline.filter(d => d.status === 'Active').length;
const activeRoles       = activeRolesOnly + l1PendingRoles;  // combined for KPI card display

const onHoldRoles       = orionPipeline.filter(d => d.status === 'On Hold').length;
const notStartedRoles   = orionPipeline.filter(d => d.status === 'Not Started').length;
const closedHiredRoles  = orionPipeline.filter(d => d.status === 'Partial Onboard').length;
const closedNoHireRoles = orionPipeline.filter(
  d => d.status === 'Closed' || d.status === 'Dropped' || d.status === 'No Update'
).length;
const closedRoles       = closedHiredRoles + closedNoHireRoles;

// Pass rates
const l1PassRate = totalProfiles > 0
  ? parseFloat((((totalProfiles - totalL1Rejects) / totalProfiles) * 100).toFixed(1))
  : 0;

const l1Passed   = totalProfiles - totalL1Rejects;
const l2PassRate = l1Passed > 0
  ? parseFloat((((l1Passed - totalL2Rejects - totalZeko) / l1Passed) * 100).toFixed(1))
  : 0;

// Period-over-period profiles shared growth
// orionPeriodData: 0=Dec–Feb(31), 1=Mar–May(22), 2=May(55)
const p1 = orionPeriodData[0].profilesShared; // Dec–Feb: 31
const p2 = orionPeriodData[1].profilesShared; // Mar–May: 22
const p3 = orionPeriodData[2].profilesShared; // May:     55
const latestPeriodGrowth = p2 > 0
  ? parseFloat((((p3 - p2) / p2) * 100).toFixed(1))
  : 0;

// Closure health — sourced from orionRolesPerPeriod aggregates
const totalRolesClosedHired  = sum(orionRolesPerPeriod.map(d => d.rolesClosedHired));
const totalRolesClosedNoHire = sum(orionRolesPerPeriod.map(d => d.rolesClosedNoHire));
const totalRolesOnHold       = sum(orionRolesPerPeriod.map(d => d.rolesOnHold));
const totalRolesInProcess    = sum(orionRolesPerPeriod.map(d => d.rolesInProcess));
const totalRolesNotStarted   = sum(orionRolesPerPeriod.map(d => d.rolesNotStarted));

// Of all roles that reached a final state, % that resulted in at least 1 hire
const hireSuccessRate = (totalRolesClosedHired + totalRolesClosedNoHire) > 0
  ? parseFloat((
      (totalRolesClosedHired / (totalRolesClosedHired + totalRolesClosedNoHire)) * 100
    ).toFixed(1))
  : 0;

export const orionKPIs = {
  // ── Volumes ────────────────────────────────
  totalRoles,
  totalProfiles,
  totalRejects,
  totalRejections,          // alias — consumed by App.jsx line 213
  totalL1Rejects,
  totalL2Rejects,
  totalZeko,
  totalInProcess,
  totalSelections,

  // ── Role status breakdown ──────────────────
  activeRoles,              // Active + L1 Pending combined — consumed by App.jsx line 153
  activeRolesOnly,          // pure Active only, if needed separately
  l1PendingRoles,
  onHoldRoles,
  notStartedRoles,
  closedHiredRoles,
  closedNoHireRoles,
  closedRoles,

  // ── Pass & conversion rates ────────────────
  l1PassRate,
  l2PassRate,
  profileToSelectRate,      // consumed by App.jsx line 206

  // ── Period growth ──────────────────────────
  latestPeriodGrowth,       // Mar–May → May growth in profiles shared

  // ── Closure health ─────────────────────────
  totalRolesClosedHired,
  totalRolesClosedNoHire,
  totalRolesOnHold,
  totalRolesInProcess,
  totalRolesNotStarted,
  hireSuccessRate,          // % of concluded roles that resulted in a hire
};