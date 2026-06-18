// // ORION REAL DATA — Dec 2025 – May 2026  |  v4.0 (monthly granularity)

// export const MONTHS = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];

// export const orionPipeline = [
//   // ── PERIOD: Dec–Feb → attributed month: Dec ──────────────────────────────
//   {
//     id: 1, period: 'Dec–Feb', month: 'Dec',
//     opened_month: 'Dec', closed_month: 'Feb',
//     openedMonth: 'December 2025', closedMonth: 'February 2026', isOpen: false,
//     jobTitle: 'Data Engineer (with/without Data Fabric)',
//     shortTitle: 'Data Eng',
//     openings: 2, experience: '5–7 yrs',
//     location: 'Kochi/Coimbatore/Chennai/Mumbai/Pune', workMode: 'Onsite',
//     profilesShared: 11, l1Reject: 4, l2Reject: 4, zekoReject: 0,
//     f2fFinalRound: 0, inProcess: 0, selections: 1,
//     status: 'Dropped', notes: 'Selection dropped – vendor conflict (Nirav); net hires = 0',
//   },
//   {
//     id: 2, period: 'Dec–Feb', month: 'Dec',
//     opened_month: 'Dec', closed_month: 'Feb',
//     openedMonth: 'December 2025', closedMonth: 'February 2026', isOpen: false,
//     jobTitle: 'Sr. Data Engineer / Lead',
//     shortTitle: 'Sr. Data Eng/Lead',
//     openings: 2, experience: '10+ yrs',
//     location: 'Kochi/Coimbatore/Chennai/Mumbai/Pune', workMode: 'Onsite',
//     profilesShared: 20, l1Reject: 7, l2Reject: 8, zekoReject: 0,
//     f2fFinalRound: 0, inProcess: 0, selections: 2,
//     status: 'Partial Onboard', notes: '1 onboarded (Rajaraman); 1 not onboarded – C2C→C2H change (Biswarup)',
//   },

//   // ── PERIOD: Mar–May → attributed month: Mar ──────────────────────────────
//   {
//     id: 3, period: 'Mar–May', month: 'Mar',
//     opened_month: 'Mar', closed_month: 'May',
//     openedMonth: 'March 2026', closedMonth: 'May 2026', isOpen: false,
//     jobTitle: 'Sr. Data Engineer',
//     shortTitle: 'Sr. Data Eng',
//     openings: 2, experience: '6+ yrs',
//     location: 'Remote', workMode: 'Remote',
//     profilesShared: 9, l1Reject: 3, l2Reject: 2, zekoReject: 0,
//     f2fFinalRound: 0, inProcess: 0, selections: 0,
//     status: 'Closed', notes: 'Position changed C2C→C2H mid-cycle; no selection made',
//   },
//   {
//     id: 4, period: 'Mar–May', month: 'Mar',
//     opened_month: 'Mar', closed_month: 'May',
//     openedMonth: 'March 2026', closedMonth: 'May 2026', isOpen: false,
//     jobTitle: 'Sr. Data Lead',
//     shortTitle: 'Sr. Data Lead',
//     openings: 1, experience: '10+ yrs',
//     location: 'Remote', workMode: 'Remote',
//     profilesShared: 1, l1Reject: 0, l2Reject: 0, zekoReject: 0,
//     f2fFinalRound: 0, inProcess: 0, selections: 0,
//     status: 'No Update', notes: 'Only 1 profile shared; no client feedback received',
//   },
//   {
//     id: 5, period: 'Mar–May', month: 'Mar',
//     opened_month: 'Mar', closed_month: 'May',
//     openedMonth: 'March 2026', closedMonth: 'May 2026', isOpen: false,
//     jobTitle: 'Lead Full Stack Developer',
//     shortTitle: 'Lead Full Stack',
//     openings: 1, experience: '8–12 yrs',
//     location: 'Remote', workMode: 'Remote',
//     profilesShared: 5, l1Reject: 3, l2Reject: 0, zekoReject: 0,
//     f2fFinalRound: 0, inProcess: 0, selections: 0,
//     status: 'On Hold', notes: 'L1 rejections; position put on hold',
//   },
//   {
//     id: 6, period: 'Mar–May', month: 'Mar',
//     opened_month: 'Mar', closed_month: 'May',
//     openedMonth: 'March 2026', closedMonth: 'May 2026', isOpen: false,
//     jobTitle: 'Solution Architect',
//     shortTitle: 'Solution Arch.',
//     openings: 1, experience: '8–18 yrs',
//     location: 'Kochi/Coimbatore/Chennai/Mumbai/Pune/Hyderabad', workMode: 'Hybrid',
//     profilesShared: 7, l1Reject: 2, l2Reject: 2, zekoReject: 0,
//     f2fFinalRound: 0, inProcess: 0, selections: 0,
//     status: 'On Hold', notes: 'L1 & L2 rejections; position put on hold',
//   },

//   // ── PERIOD: May → attributed month: May ──────────────────────────────────
//   {
//     id: 7, period: 'May', month: 'May',
//     opened_month: 'May', closed_month: null,
//     openedMonth: 'May 2026', closedMonth: null, isOpen: true,
//     jobTitle: '.Net Full Stack (Manager)',
//     shortTitle: '.Net Full Stack',
//     openings: 3, experience: '8+ yrs',
//     location: 'Hyderabad – Hi-Tech City', workMode: 'Onsite',
//     profilesShared: 5, l1Reject: 0, l2Reject: 0, zekoReject: 0,
//     f2fFinalRound: 2, inProcess: 1, selections: 0,
//     status: 'On Hold', notes: 'F2F drive: 2; L1 select: 1 (RajKumar Kasraveni); position on hold',
//   },
//   {
//     id: 8, period: 'May', month: 'May',
//     opened_month: 'May', closed_month: null,
//     openedMonth: 'May 2026', closedMonth: null, isOpen: true,
//     jobTitle: 'AI Engineer (SA2)',
//     shortTitle: 'AI Engineer',
//     openings: 3, experience: '6+ yrs',
//     location: 'Hyderabad', workMode: 'Onsite',
//     profilesShared: 7, l1Reject: 1, l2Reject: 0, zekoReject: 0,
//     f2fFinalRound: 1, inProcess: 2, selections: 0,
//     status: 'Active', notes: '1 in final round (Hariom); 2 feedback pending; 3 did not receive interview link',
//   },
//   {
//     id: 9, period: 'May', month: 'May',
//     opened_month: 'May', closed_month: null,
//     openedMonth: 'May 2026', closedMonth: null, isOpen: true,
//     jobTitle: 'AI Data Scientist',
//     shortTitle: 'AI Data Sci.',
//     openings: 3, experience: '6–8 yrs',
//     location: 'Hyderabad', workMode: 'Onsite',
//     profilesShared: 2, l1Reject: 0, l2Reject: 0, zekoReject: 0,
//     f2fFinalRound: 0, inProcess: 2, selections: 0,
//     status: 'On Hold', notes: '2 L1 selects; position put on hold',
//   },
//   {
//     id: 10, period: 'May', month: 'May',
//     opened_month: 'May', closed_month: null,
//     openedMonth: 'May 2026', closedMonth: null, isOpen: true,
//     jobTitle: 'Azure Data Engineer',
//     shortTitle: 'Azure Data Eng',
//     openings: 3, experience: '6–12 yrs',
//     location: 'Hyderabad', workMode: 'Onsite',
//     profilesShared: 10, l1Reject: 0, l2Reject: 0, zekoReject: 3,
//     f2fFinalRound: 0, inProcess: 2, selections: 0,
//     status: 'On Hold', notes: '3 Zeko rejects; 1 duplicate profile; 2 awaiting L2 slot; position on hold',
//   },
//   {
//     id: 11, period: 'May', month: 'May',
//     opened_month: 'May', closed_month: null,
//     openedMonth: 'May 2026', closedMonth: null, isOpen: true,
//     jobTitle: 'Cloud Support Engineer',
//     shortTitle: 'Cloud Support',
//     openings: 7, experience: '6–11 yrs',
//     location: 'Hyderabad', workMode: 'Hybrid',
//     profilesShared: 0, l1Reject: 0, l2Reject: 0, zekoReject: 0,
//     f2fFinalRound: 0, inProcess: 0, selections: 0,
//     status: 'Not Started', notes: 'Profiles not yet shared',
//   },
//   {
//     id: 12, period: 'May', month: 'May',
//     opened_month: 'May', closed_month: null,
//     openedMonth: 'May 2026', closedMonth: null, isOpen: true,
//     jobTitle: 'Deployment Engineer',
//     shortTitle: 'Deployment Eng',
//     openings: 7, experience: '4–8 yrs',
//     location: 'Hyderabad', workMode: 'Hybrid',
//     profilesShared: 0, l1Reject: 0, l2Reject: 0, zekoReject: 0,
//     f2fFinalRound: 0, inProcess: 0, selections: 0,
//     status: 'Not Started', notes: 'Profiles not yet shared',
//   },
//   {
//     id: 13, period: 'May', month: 'May',
//     opened_month: 'May', closed_month: null,
//     openedMonth: 'May 2026', closedMonth: null, isOpen: true,
//     jobTitle: 'GenAI Lead',
//     shortTitle: 'GenAI Lead',
//     openings: 3, experience: '8+ yrs',
//     location: 'Kochi/Coimbatore/Chennai/Mumbai/Pune', workMode: 'Not Specified',
//     profilesShared: 6, l1Reject: 0, l2Reject: 1, zekoReject: 0,
//     f2fFinalRound: 0, inProcess: 5, selections: 0,
//     status: 'Active', notes: '5 in process; strong pipeline',
//   },
//   {
//     id: 14, period: 'May', month: 'May',
//     opened_month: 'May', closed_month: null,
//     openedMonth: 'May 2026', closedMonth: null, isOpen: true,
//     jobTitle: 'GenAI Developer',
//     shortTitle: 'GenAI Dev',
//     openings: 3, experience: '5–6+ yrs',
//     location: 'Kochi/Coimbatore/Chennai/Mumbai/Pune', workMode: 'Not Specified',
//     profilesShared: 5, l1Reject: 0, l2Reject: 2, zekoReject: 0,
//     f2fFinalRound: 0, inProcess: 3, selections: 0,
//     status: 'Active', notes: '3 in process',
//   },
//   {
//     id: 15, period: 'May', month: 'May',
//     opened_month: 'May', closed_month: null,
//     openedMonth: 'May 2026', closedMonth: null, isOpen: true,
//     jobTitle: 'Sr. Data Engineer with AI',
//     shortTitle: 'Sr. DE + AI',
//     openings: 3, experience: '5–7+ yrs',
//     location: 'Kochi/Coimbatore/Chennai/Mumbai/Pune', workMode: 'Not Specified',
//     profilesShared: 5, l1Reject: 2, l2Reject: 2, zekoReject: 0,
//     f2fFinalRound: 0, inProcess: 1, selections: 0,
//     status: 'Active', notes: '1 in process',
//   },
//   {
//     id: 16, period: 'May', month: 'May',
//     opened_month: 'May', closed_month: null,
//     openedMonth: 'May 2026', closedMonth: null, isOpen: true,
//     jobTitle: 'Data Lead with AI',
//     shortTitle: 'Data Lead + AI',
//     openings: 3, experience: '8–12+ yrs',
//     location: 'Kochi/Coimbatore/Chennai/Mumbai/Pune', workMode: 'Not Specified',
//     profilesShared: 3, l1Reject: 0, l2Reject: 0, zekoReject: 0,
//     f2fFinalRound: 0, inProcess: 3, selections: 0,
//     status: 'Active – L1 Pending', notes: 'L1 yet to be scheduled; 3 profiles awaiting evaluation',
//   },
//   {
//     id: 17, period: 'May', month: 'May',
//     opened_month: 'May', closed_month: null,
//     openedMonth: 'May 2026', closedMonth: null, isOpen: true,
//     jobTitle: 'Gen AI Engineer (KPMG)',
//     shortTitle: 'GenAI Eng',
//     openings: 3, experience: '6+ yrs',
//     location: 'Kochi/Coimbatore/Chennai/Mumbai/Pune', workMode: 'Not Specified',
//     profilesShared: 0, l1Reject: 0, l2Reject: 0, zekoReject: 0,
//     f2fFinalRound: 0, inProcess: 0, selections: 0,
//     status: 'Not Started', notes: 'Profiles not yet shared',
//   },
//   {
//     id: 18, period: 'May', month: 'May',
//     opened_month: 'May', closed_month: null,
//     openedMonth: 'May 2026', closedMonth: null, isOpen: true,
//     jobTitle: 'Gen AI Lead (KPMG)',
//     shortTitle: 'GenAI Lead (K)',
//     openings: 3, experience: '8+ yrs',
//     location: 'Kochi/Coimbatore/Chennai/Mumbai/Pune', workMode: 'Not Specified',
//     profilesShared: 0, l1Reject: 0, l2Reject: 0, zekoReject: 0,
//     f2fFinalRound: 0, inProcess: 0, selections: 0,
//     status: 'Not Started', notes: 'Profiles not yet shared',
//   },
//   {
//     id: 19, period: 'May', month: 'May',
//     opened_month: 'May', closed_month: null,
//     openedMonth: 'May 2026', closedMonth: null, isOpen: true,
//     jobTitle: 'UI/UX Designer',
//     shortTitle: 'UI/UX Designer',
//     openings: 4, experience: '8–12+ yrs',
//     location: 'Gurgaon/Noida/Coimbatore/Chennai', workMode: 'Onsite',
//     profilesShared: 8, l1Reject: 3, l2Reject: 0, zekoReject: 0,
//     f2fFinalRound: 0, inProcess: 2, selections: 0,
//     status: 'On Hold', notes: '2 L1 selected; position on hold (WPP client)',
//   },
//   {
//     id: 20, period: 'May', month: 'May',
//     opened_month: 'May', closed_month: null,
//     openedMonth: 'May 2026', closedMonth: null, isOpen: false,
//     jobTitle: 'Network Engineer (Verizon)',
//     shortTitle: 'Network Eng',
//     openings: 3, experience: '5+ yrs',
//     location: 'Chennai – Ambattur ODC', workMode: 'Onsite',
//     profilesShared: 4, l1Reject: 1, l2Reject: 3, zekoReject: 0,
//     f2fFinalRound: 0, inProcess: 0, selections: 0,
//     status: 'Closed', notes: 'Position closed; immediate joiners only; all L2 rejected',
//   },
// ];

// // ── Monthly Period Data ───────────────────────────────────────────────────────
// // Each row = one calendar month.
// // Attribution:
// //   Dec → Dec–Feb roles (ids 1–2): profiles were shared in Dec, activity ran through Feb
// //   Jan, Feb → zero new profiles opened; existing Dec–Feb roles still being evaluated
// //   Mar → Mar–May roles (ids 3–6)
// //   Apr → zero new profiles opened
// //   May → May roles (ids 7–20)
// //
// // profilesShared / rejects reflect the batch shared when the role opened.
// // inProcess reflects state as of May 2026 snapshot.

// export const orionPeriodData = [
//   {
//     period: 'Dec',
//     profilesShared: 31,   // ids 1+2: 11+20
//     l1Reject: 11,         // 4+7
//     l2Reject: 12,         // 4+8
//     zekoReject: 0,
//     inProcess: 0,
//     selections: 3,        // 1+2
//     rejectionCount: 23,   // 11+12+0
//     roles: 2,
//   },
//   {
//     period: 'Jan',
//     profilesShared: 0,
//     l1Reject: 0, l2Reject: 0, zekoReject: 0,
//     inProcess: 0, selections: 0,
//     rejectionCount: 0,
//     roles: 0,
//   },
//   {
//     period: 'Feb',
//     profilesShared: 0,
//     l1Reject: 0, l2Reject: 0, zekoReject: 0,
//     inProcess: 0, selections: 0,
//     rejectionCount: 0,
//     roles: 0,
//   },
//   {
//     period: 'Mar',
//     profilesShared: 22,   // ids 3+4+5+6: 9+1+5+7
//     l1Reject: 8,          // 3+0+3+2
//     l2Reject: 4,          // 2+0+0+2
//     zekoReject: 0,
//     inProcess: 0,
//     selections: 0,
//     rejectionCount: 12,   // 8+4+0
//     roles: 4,
//   },
//   {
//     period: 'Apr',
//     profilesShared: 0,
//     l1Reject: 0, l2Reject: 0, zekoReject: 0,
//     inProcess: 0, selections: 0,
//     rejectionCount: 0,
//     roles: 0,
//   },
//   {
//     period: 'May',
//     profilesShared: 55,   // ids 7–20: 5+7+2+10+0+0+6+5+5+3+0+0+8+4
//     l1Reject: 7,          // 0+1+0+0+0+0+0+0+2+0+0+0+3+1
//     l2Reject: 8,          // 0+0+0+0+0+0+1+2+2+0+0+0+0+3
//     zekoReject: 3,        // id10
//     inProcess: 21,
//     selections: 0,
//     rejectionCount: 18,   // 7+8+3
//     roles: 14,
//   },
// ];

// // ── Monthly Roles Opened vs Resolved ─────────────────────────────────────────
// // Dec: 2 roles opened (ids 1–2), both resolved by Feb
// // Jan/Feb/Apr: no new roles; 0 across all fields
// // Mar: 4 roles opened (ids 3–6), 2 closed-no-hire, 2 on-hold by May
// // May: 14 roles opened (ids 7–20)

// export const orionRolesPerPeriod = [
//   {
//     period: 'Dec',
//     rolesOpened: 2,
//     rolesClosedHired: 1,    // id2 – Partial Onboard (at least 1 onboarded)
//     rolesClosedNoHire: 1,   // id1 – Dropped (vendor conflict)
//     rolesOnHold: 0,
//     rolesInProcess: 0,
//     rolesNotStarted: 0,
//   },
//   {
//     period: 'Jan',
//     rolesOpened: 0,
//     rolesClosedHired: 0, rolesClosedNoHire: 0,
//     rolesOnHold: 0, rolesInProcess: 0, rolesNotStarted: 0,
//   },
//   {
//     period: 'Feb',
//     rolesOpened: 0,
//     rolesClosedHired: 0, rolesClosedNoHire: 0,
//     rolesOnHold: 0, rolesInProcess: 0, rolesNotStarted: 0,
//   },
//   {
//     period: 'Mar',
//     rolesOpened: 4,
//     rolesClosedHired: 0,
//     rolesClosedNoHire: 2,   // id3 (C2C→C2H), id4 (no update/stalled)
//     rolesOnHold: 2,         // id5, id6
//     rolesInProcess: 0,
//     rolesNotStarted: 0,
//   },
//   {
//     period: 'Apr',
//     rolesOpened: 0,
//     rolesClosedHired: 0, rolesClosedNoHire: 0,
//     rolesOnHold: 0, rolesInProcess: 0, rolesNotStarted: 0,
//   },
//   {
//     period: 'May',
//     rolesOpened: 14,
//     rolesClosedHired: 0,
//     rolesClosedNoHire: 1,   // id20 – Network Engineer
//     rolesOnHold: 4,         // id7, id9, id10, id19
//     rolesInProcess: 5,      // id8, id13, id14, id15, id16
//     rolesNotStarted: 4,     // id11, id12, id17, id18
//   },
// ];

// // ── Candidate Funnel — All 20 roles combined (unchanged) ─────────────────────
// export const orionFunnelData = [
//   { stage: 'Profiles Shared', count: 108 },
//   { stage: 'L1 Passed',       count: 79  },
//   { stage: 'L2 Passed',       count: 55  },
//   { stage: 'F2F / Final',     count: 3   },
//   { stage: 'Selections',      count: 3   },
// ];

// // ── Work Mode Distribution per Month ─────────────────────────────────────────
// // Dec: ids 1,2 → Onsite=2
// // Jan/Feb/Apr: no new roles
// // Mar: ids 3,4,5=Remote, 6=Hybrid → Remote=3, Hybrid=1
// // May: ids 7,8,9,10=Onsite, 11,12=Hybrid, 13–18=Not Specified, 19=Onsite, 20=Onsite
// //      → Onsite=6, Hybrid=2, Not Specified=6

// export const orionWorkModeData = [
//   { period: 'Dec', Onsite: 2, Remote: 0, Hybrid: 0, 'Not Specified': 0 },
//   { period: 'Jan', Onsite: 0, Remote: 0, Hybrid: 0, 'Not Specified': 0 },
//   { period: 'Feb', Onsite: 0, Remote: 0, Hybrid: 0, 'Not Specified': 0 },
//   { period: 'Mar', Onsite: 0, Remote: 3, Hybrid: 1, 'Not Specified': 0 },
//   { period: 'Apr', Onsite: 0, Remote: 0, Hybrid: 0, 'Not Specified': 0 },
//   { period: 'May', Onsite: 6, Remote: 0, Hybrid: 2, 'Not Specified': 6 },
// ];

// // ── Experience Bucket Distribution per Month ──────────────────────────────────
// // Dec:  id1=Senior, id2=Lead
// // Mar:  id3=Senior, id4=Lead, id5=Lead, id6=Lead
// // May:  Junior=3(ids14,15,20), Senior=6(ids8,9,10,11,12,17), Lead=5(ids7,13,16,18,19)

// export const orionExperienceData = [
//   { period: 'Dec', 'Junior (4–6y)': 0, 'Senior (6–10y)': 1, 'Lead (10y+)': 1 },
//   { period: 'Jan', 'Junior (4–6y)': 0, 'Senior (6–10y)': 0, 'Lead (10y+)': 0 },
//   { period: 'Feb', 'Junior (4–6y)': 0, 'Senior (6–10y)': 0, 'Lead (10y+)': 0 },
//   { period: 'Mar', 'Junior (4–6y)': 0, 'Senior (6–10y)': 1, 'Lead (10y+)': 3 },
//   { period: 'Apr', 'Junior (4–6y)': 0, 'Senior (6–10y)': 0, 'Lead (10y+)': 0 },
//   { period: 'May', 'Junior (4–6y)': 3, 'Senior (6–10y)': 6, 'Lead (10y+)': 5 },
// ];

// // ── Location Heatmap ──────────────────────────────────────────────────────────
// export const orionLocationHeatmap = {
//   locations: [
//     'Hyderabad',
//     'Remote',
//     'Kochi/Coimbatore/Chennai/Mumbai/Pune',
//     'Gurgaon/Noida/Coimbatore/Chennai',
//     'Chennai – Ambattur ODC',
//   ],
//   periods: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
//   values: {
//     'Dec': [0,   0,  31, 0, 0],
//     'Jan': [0,   0,   0, 0, 0],
//     'Feb': [0,   0,   0, 0, 0],
//     'Mar': [7,  15,   0, 0, 0],
//     'Apr': [0,   0,   0, 0, 0],
//     'May': [24,  0,  19, 8, 4],
//   },
// };

// // ── Position Status Summary (unchanged — all 20 roles) ───────────────────────
// export const orionStatusData = [
//   { status: 'Active',               count: 4  },
//   { status: 'Active – L1 Pending',  count: 1  },
//   { status: 'On Hold',              count: 6  },
//   { status: 'Not Started',          count: 4  },
//   { status: 'Partial Onboard',      count: 1  },
//   { status: 'Dropped',              count: 1  },
//   { status: 'Closed',               count: 2  },
//   { status: 'No Update',            count: 1  },
// ];

// // ── Month-over-Month Profile Growth ──────────────────────────────────────────
// export const orionPeriodGrowth = [
//   { period: 'Dec → Jan', growth: -100.0 },
//   { period: 'Jan → Feb', growth: 0      },
//   { period: 'Feb → Mar', growth: null   },   // 0 → 22: new activity, % undefined
//   { period: 'Mar → Apr', growth: -100.0 },
//   { period: 'Apr → May', growth: null   },   // 0 → 55: new activity, % undefined
// ]

// ORION REAL DATA — Dec 2025 – May 2026  |  v4.1 (openedMonth as YYYY-MM)
//
// Monthly attribution rule:
//   Each role is attributed to its openedMonth (the month hiring activity began).
//   'Dec–Feb' roles → 'Dec'  (opened December 2025, active through Feb)
//   'Mar–May' roles → 'Mar'  (opened March 2026, active through May)
//   'May'     roles → 'May'  (opened May 2026, still active)
//
// openedMonth is now in "YYYY-MM" format to match dateRangeUtils filter logic.
// month field (short label e.g. 'Dec') is preserved for chart display.

export const MONTHS = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];

// Maps short month label → YYYY-MM (for orionRolesPerPeriod)
export const MONTH_TO_YYYY_MM = {
  'Dec': '2025-12',
  'Jan': '2026-01',
  'Feb': '2026-02',
  'Mar': '2026-03',
  'Apr': '2026-04',
  'May': '2026-05',
};

export const orionPipeline = [
  // ── PERIOD: Dec–Feb → attributed month: Dec ──────────────────────────────
  {
    id: 1, period: 'Dec–Feb', month: 'Dec',
    opened_month: 'Dec', closed_month: 'Feb',
    openedMonth: '2025-12', closedMonth: '2026-02', isOpen: false,
    jobTitle: 'Data Engineer (with/without Data Fabric)',
    shortTitle: 'Data Eng',
    openings: 2, experience: '5–7 yrs',
    location: 'Kochi/Coimbatore/Chennai/Mumbai/Pune', workMode: 'Onsite',
    profilesShared: 11, l1Reject: 4, l2Reject: 4, zekoReject: 0,
    f2fFinalRound: 0, inProcess: 0, selections: 1,
    status: 'Dropped', notes: 'Selection dropped – vendor conflict (Nirav); net hires = 0',
  },
  {
    id: 2, period: 'Dec–Feb', month: 'Dec',
    opened_month: 'Dec', closed_month: 'Feb',
    openedMonth: '2025-12', closedMonth: '2026-02', isOpen: false,
    jobTitle: 'Sr. Data Engineer / Lead',
    shortTitle: 'Sr. Data Eng/Lead',
    openings: 2, experience: '10+ yrs',
    location: 'Kochi/Coimbatore/Chennai/Mumbai/Pune', workMode: 'Onsite',
    profilesShared: 20, l1Reject: 7, l2Reject: 8, zekoReject: 0,
    f2fFinalRound: 0, inProcess: 0, selections: 2,
    status: 'Partial Onboard', notes: '1 onboarded (Rajaraman); 1 not onboarded – C2C→C2H change (Biswarup)',
  },

  // ── PERIOD: Mar–May → attributed month: Mar ──────────────────────────────
  {
    id: 3, period: 'Mar–May', month: 'Mar',
    opened_month: 'Mar', closed_month: 'May',
    openedMonth: '2026-03', closedMonth: '2026-05', isOpen: false,
    jobTitle: 'Sr. Data Engineer',
    shortTitle: 'Sr. Data Eng',
    openings: 2, experience: '6+ yrs',
    location: 'Remote', workMode: 'Remote',
    profilesShared: 9, l1Reject: 3, l2Reject: 2, zekoReject: 0,
    f2fFinalRound: 0, inProcess: 0, selections: 0,
    status: 'Closed', notes: 'Position changed C2C→C2H mid-cycle; no selection made',
  },
  {
    id: 4, period: 'Mar–May', month: 'Mar',
    opened_month: 'Mar', closed_month: 'May',
    openedMonth: '2026-03', closedMonth: '2026-05', isOpen: false,
    jobTitle: 'Sr. Data Lead',
    shortTitle: 'Sr. Data Lead',
    openings: 1, experience: '10+ yrs',
    location: 'Remote', workMode: 'Remote',
    profilesShared: 1, l1Reject: 0, l2Reject: 0, zekoReject: 0,
    f2fFinalRound: 0, inProcess: 0, selections: 0,
    status: 'No Update', notes: 'Only 1 profile shared; no client feedback received',
  },
  {
    id: 5, period: 'Mar–May', month: 'Mar',
    opened_month: 'Mar', closed_month: 'May',
    openedMonth: '2026-03', closedMonth: '2026-05', isOpen: false,
    jobTitle: 'Lead Full Stack Developer',
    shortTitle: 'Lead Full Stack',
    openings: 1, experience: '8–12 yrs',
    location: 'Remote', workMode: 'Remote',
    profilesShared: 5, l1Reject: 3, l2Reject: 0, zekoReject: 0,
    f2fFinalRound: 0, inProcess: 0, selections: 0,
    status: 'On Hold', notes: 'L1 rejections; position put on hold',
  },
  {
    id: 6, period: 'Mar–May', month: 'Mar',
    opened_month: 'Mar', closed_month: 'May',
    openedMonth: '2026-03', closedMonth: '2026-05', isOpen: false,
    jobTitle: 'Solution Architect',
    shortTitle: 'Solution Arch.',
    openings: 1, experience: '8–18 yrs',
    location: 'Kochi/Coimbatore/Chennai/Mumbai/Pune/Hyderabad', workMode: 'Hybrid',
    profilesShared: 7, l1Reject: 2, l2Reject: 2, zekoReject: 0,
    f2fFinalRound: 0, inProcess: 0, selections: 0,
    status: 'On Hold', notes: 'L1 & L2 rejections; position put on hold',
  },

  // ── PERIOD: May → attributed month: May ──────────────────────────────────
  {
    id: 7, period: 'May', month: 'May',
    opened_month: 'May', closed_month: null,
    openedMonth: '2026-05', closedMonth: null, isOpen: true,
    jobTitle: '.Net Full Stack (Manager)',
    shortTitle: '.Net Full Stack',
    openings: 3, experience: '8+ yrs',
    location: 'Hyderabad – Hi-Tech City', workMode: 'Onsite',
    profilesShared: 5, l1Reject: 0, l2Reject: 0, zekoReject: 0,
    f2fFinalRound: 2, inProcess: 1, selections: 0,
    status: 'On Hold', notes: 'F2F drive: 2; L1 select: 1 (RajKumar Kasraveni); position on hold',
  },
  {
    id: 8, period: 'May', month: 'May',
    opened_month: 'May', closed_month: null,
    openedMonth: '2026-05', closedMonth: null, isOpen: true,
    jobTitle: 'AI Engineer (SA2)',
    shortTitle: 'AI Engineer',
    openings: 3, experience: '6+ yrs',
    location: 'Hyderabad', workMode: 'Onsite',
    profilesShared: 7, l1Reject: 1, l2Reject: 0, zekoReject: 0,
    f2fFinalRound: 1, inProcess: 2, selections: 0,
    status: 'Active', notes: '1 in final round (Hariom); 2 feedback pending; 3 did not receive interview link',
  },
  {
    id: 9, period: 'May', month: 'May',
    opened_month: 'May', closed_month: null,
    openedMonth: '2026-05', closedMonth: null, isOpen: true,
    jobTitle: 'AI Data Scientist',
    shortTitle: 'AI Data Sci.',
    openings: 3, experience: '6–8 yrs',
    location: 'Hyderabad', workMode: 'Onsite',
    profilesShared: 2, l1Reject: 0, l2Reject: 0, zekoReject: 0,
    f2fFinalRound: 0, inProcess: 2, selections: 0,
    status: 'On Hold', notes: '2 L1 selects; position put on hold',
  },
  {
    id: 10, period: 'May', month: 'May',
    opened_month: 'May', closed_month: null,
    openedMonth: '2026-05', closedMonth: null, isOpen: true,
    jobTitle: 'Azure Data Engineer',
    shortTitle: 'Azure Data Eng',
    openings: 3, experience: '6–12 yrs',
    location: 'Hyderabad', workMode: 'Onsite',
    profilesShared: 10, l1Reject: 0, l2Reject: 0, zekoReject: 3,
    f2fFinalRound: 0, inProcess: 2, selections: 0,
    status: 'On Hold', notes: '3 Zeko rejects; 1 duplicate profile; 2 awaiting L2 slot; position on hold',
  },
  {
    id: 11, period: 'May', month: 'May',
    opened_month: 'May', closed_month: null,
    openedMonth: '2026-05', closedMonth: null, isOpen: true,
    jobTitle: 'Cloud Support Engineer',
    shortTitle: 'Cloud Support',
    openings: 7, experience: '6–11 yrs',
    location: 'Hyderabad', workMode: 'Hybrid',
    profilesShared: 0, l1Reject: 0, l2Reject: 0, zekoReject: 0,
    f2fFinalRound: 0, inProcess: 0, selections: 0,
    status: 'Not Started', notes: 'Profiles not yet shared',
  },
  {
    id: 12, period: 'May', month: 'May',
    opened_month: 'May', closed_month: null,
    openedMonth: '2026-05', closedMonth: null, isOpen: true,
    jobTitle: 'Deployment Engineer',
    shortTitle: 'Deployment Eng',
    openings: 7, experience: '4–8 yrs',
    location: 'Hyderabad', workMode: 'Hybrid',
    profilesShared: 0, l1Reject: 0, l2Reject: 0, zekoReject: 0,
    f2fFinalRound: 0, inProcess: 0, selections: 0,
    status: 'Not Started', notes: 'Profiles not yet shared',
  },
  {
    id: 13, period: 'May', month: 'May',
    opened_month: 'May', closed_month: null,
    openedMonth: '2026-05', closedMonth: null, isOpen: true,
    jobTitle: 'GenAI Lead',
    shortTitle: 'GenAI Lead',
    openings: 3, experience: '8+ yrs',
    location: 'Kochi/Coimbatore/Chennai/Mumbai/Pune', workMode: 'Not Specified',
    profilesShared: 6, l1Reject: 0, l2Reject: 1, zekoReject: 0,
    f2fFinalRound: 0, inProcess: 5, selections: 0,
    status: 'Active', notes: '5 in process; strong pipeline',
  },
  {
    id: 14, period: 'May', month: 'May',
    opened_month: 'May', closed_month: null,
    openedMonth: '2026-05', closedMonth: null, isOpen: true,
    jobTitle: 'GenAI Developer',
    shortTitle: 'GenAI Dev',
    openings: 3, experience: '5–6+ yrs',
    location: 'Kochi/Coimbatore/Chennai/Mumbai/Pune', workMode: 'Not Specified',
    profilesShared: 5, l1Reject: 0, l2Reject: 2, zekoReject: 0,
    f2fFinalRound: 0, inProcess: 3, selections: 0,
    status: 'Active', notes: '3 in process',
  },
  {
    id: 15, period: 'May', month: 'May',
    opened_month: 'May', closed_month: null,
    openedMonth: '2026-05', closedMonth: null, isOpen: true,
    jobTitle: 'Sr. Data Engineer with AI',
    shortTitle: 'Sr. DE + AI',
    openings: 3, experience: '5–7+ yrs',
    location: 'Kochi/Coimbatore/Chennai/Mumbai/Pune', workMode: 'Not Specified',
    profilesShared: 5, l1Reject: 2, l2Reject: 2, zekoReject: 0,
    f2fFinalRound: 0, inProcess: 1, selections: 0,
    status: 'Active', notes: '1 in process',
  },
  {
    id: 16, period: 'May', month: 'May',
    opened_month: 'May', closed_month: null,
    openedMonth: '2026-05', closedMonth: null, isOpen: true,
    jobTitle: 'Lead Data Engineer',
    shortTitle: 'Lead Data Eng',
    openings: 3, experience: '10+ yrs',
    location: 'Kochi/Coimbatore/Chennai/Mumbai/Pune', workMode: 'Not Specified',
    profilesShared: 3, l1Reject: 0, l2Reject: 0, zekoReject: 0,
    f2fFinalRound: 0, inProcess: 3, selections: 0,
    status: 'Active – L1 Pending', notes: '3 in process awaiting L1',
  },
  {
    id: 17, period: 'May', month: 'May',
    opened_month: 'May', closed_month: null,
    openedMonth: '2026-05', closedMonth: null, isOpen: true,
    jobTitle: 'Data Engineer',
    shortTitle: 'Data Eng (May)',
    openings: 3, experience: '4–8 yrs',
    location: 'Gurgaon/Noida/Coimbatore/Chennai', workMode: 'Not Specified',
    profilesShared: 0, l1Reject: 0, l2Reject: 0, zekoReject: 0,
    f2fFinalRound: 0, inProcess: 0, selections: 0,
    status: 'Not Started', notes: 'Profiles not yet shared',
  },
  {
    id: 18, period: 'May', month: 'May',
    opened_month: 'May', closed_month: null,
    openedMonth: '2026-05', closedMonth: null, isOpen: true,
    jobTitle: 'Lead DevOps Engineer',
    shortTitle: 'Lead DevOps',
    openings: 3, experience: '10+ yrs',
    location: 'Chennai – Ambattur ODC', workMode: 'Not Specified',
    profilesShared: 0, l1Reject: 0, l2Reject: 0, zekoReject: 0,
    f2fFinalRound: 0, inProcess: 0, selections: 0,
    status: 'Not Started', notes: 'Profiles not yet shared',
  },
  {
    id: 19, period: 'May', month: 'May',
    opened_month: 'May', closed_month: null,
    openedMonth: '2026-05', closedMonth: null, isOpen: true,
    jobTitle: 'Lead AI/ML Engineer',
    shortTitle: 'Lead AI/ML',
    openings: 3, experience: '8+ yrs',
    location: 'Hyderabad', workMode: 'Onsite',
    profilesShared: 8, l1Reject: 3, l2Reject: 0, zekoReject: 0,
    f2fFinalRound: 0, inProcess: 5, selections: 0,
    status: 'On Hold', notes: '5 in process; position on hold pending budget confirmation',
  },
  {
    id: 20, period: 'May', month: 'May',
    opened_month: 'May', closed_month: null,
    openedMonth: '2026-05', closedMonth: null, isOpen: false,
    jobTitle: 'Network Engineer',
    shortTitle: 'Network Eng',
    openings: 1, experience: '4–6 yrs',
    location: 'Hyderabad', workMode: 'Onsite',
    profilesShared: 4, l1Reject: 1, l2Reject: 3, zekoReject: 0,
    f2fFinalRound: 0, inProcess: 0, selections: 0,
    status: 'Closed', notes: 'All profiles rejected; position closed with no hire',
  },
];

// ── Period-level Aggregations ─────────────────────────────────────────────────
export const orionPeriodData = [
  {
    period: 'Dec',
    profilesShared: 31,
    l1Reject: 11,
    l2Reject: 12,
    zekoReject: 0,
    inProcess: 0,
    selections: 3,
    rejectionCount: 23,
    roles: 2,
  },
  {
    period: 'Jan',
    profilesShared: 0,
    l1Reject: 0, l2Reject: 0, zekoReject: 0,
    inProcess: 0, selections: 0,
    rejectionCount: 0,
    roles: 0,
  },
  {
    period: 'Feb',
    profilesShared: 0,
    l1Reject: 0, l2Reject: 0, zekoReject: 0,
    inProcess: 0, selections: 0,
    rejectionCount: 0,
    roles: 0,
  },
  {
    period: 'Mar',
    profilesShared: 22,
    l1Reject: 8,
    l2Reject: 4,
    zekoReject: 0,
    inProcess: 0,
    selections: 0,
    rejectionCount: 12,
    roles: 4,
  },
  {
    period: 'Apr',
    profilesShared: 0,
    l1Reject: 0, l2Reject: 0, zekoReject: 0,
    inProcess: 0, selections: 0,
    rejectionCount: 0,
    roles: 0,
  },
  {
    period: 'May',
    profilesShared: 55,
    l1Reject: 7,
    l2Reject: 8,
    zekoReject: 3,
    inProcess: 21,
    selections: 0,
    rejectionCount: 18,
    roles: 14,
  },
];

// ── Monthly Roles Opened vs Resolved ─────────────────────────────────────────
// month field added in "YYYY-MM" format for NetOpenLine filter matching
export const orionRolesPerPeriod = [
  {
    period: 'Dec', month: '2025-12',
    rolesOpened: 2,
    rolesClosedHired: 1,
    rolesClosedNoHire: 1,
    rolesOnHold: 0,
    rolesInProcess: 0,
    rolesNotStarted: 0,
  },
  {
    period: 'Jan', month: '2026-01',
    rolesOpened: 0,
    rolesClosedHired: 0, rolesClosedNoHire: 0,
    rolesOnHold: 0, rolesInProcess: 0, rolesNotStarted: 0,
  },
  {
    period: 'Feb', month: '2026-02',
    rolesOpened: 0,
    rolesClosedHired: 0, rolesClosedNoHire: 0,
    rolesOnHold: 0, rolesInProcess: 0, rolesNotStarted: 0,
  },
  {
    period: 'Mar', month: '2026-03',
    rolesOpened: 4,
    rolesClosedHired: 0,
    rolesClosedNoHire: 2,
    rolesOnHold: 2,
    rolesInProcess: 0,
    rolesNotStarted: 0,
  },
  {
    period: 'Apr', month: '2026-04',
    rolesOpened: 0,
    rolesClosedHired: 0, rolesClosedNoHire: 0,
    rolesOnHold: 0, rolesInProcess: 0, rolesNotStarted: 0,
  },
  {
    period: 'May', month: '2026-05',
    rolesOpened: 14,
    rolesClosedHired: 0,
    rolesClosedNoHire: 1,
    rolesOnHold: 4,
    rolesInProcess: 5,
    rolesNotStarted: 4,
  },
];

// ── Candidate Funnel ──────────────────────────────────────────────────────────
export const orionFunnelData = [
  { stage: 'Profiles Shared', count: 108 },
  { stage: 'L1 Passed',       count: 79  },
  { stage: 'L2 Passed',       count: 55  },
  { stage: 'F2F / Final',     count: 3   },
  { stage: 'Selections',      count: 3   },
];

// ── Work Mode Distribution per Month ─────────────────────────────────────────
export const orionWorkModeData = [
  { period: 'Dec', Onsite: 2, Remote: 0, Hybrid: 0, 'Not Specified': 0 },
  { period: 'Jan', Onsite: 0, Remote: 0, Hybrid: 0, 'Not Specified': 0 },
  { period: 'Feb', Onsite: 0, Remote: 0, Hybrid: 0, 'Not Specified': 0 },
  { period: 'Mar', Onsite: 0, Remote: 3, Hybrid: 1, 'Not Specified': 0 },
  { period: 'Apr', Onsite: 0, Remote: 0, Hybrid: 0, 'Not Specified': 0 },
  { period: 'May', Onsite: 6, Remote: 0, Hybrid: 2, 'Not Specified': 6 },
];

// ── Experience Bucket Distribution per Month ──────────────────────────────────
export const orionExperienceData = [
  { period: 'Dec', 'Junior (4–6y)': 0, 'Senior (6–10y)': 1, 'Lead (10y+)': 1 },
  { period: 'Jan', 'Junior (4–6y)': 0, 'Senior (6–10y)': 0, 'Lead (10y+)': 0 },
  { period: 'Feb', 'Junior (4–6y)': 0, 'Senior (6–10y)': 0, 'Lead (10y+)': 0 },
  { period: 'Mar', 'Junior (4–6y)': 0, 'Senior (6–10y)': 1, 'Lead (10y+)': 3 },
  { period: 'Apr', 'Junior (4–6y)': 0, 'Senior (6–10y)': 0, 'Lead (10y+)': 0 },
  { period: 'May', 'Junior (4–6y)': 3, 'Senior (6–10y)': 6, 'Lead (10y+)': 5 },
];

// ── Location Heatmap ──────────────────────────────────────────────────────────
export const orionLocationHeatmap = {
  locations: [
    'Hyderabad',
    'Remote',
    'Kochi/Coimbatore/Chennai/Mumbai/Pune',
    'Gurgaon/Noida/Coimbatore/Chennai',
    'Chennai – Ambattur ODC',
  ],
  periods: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
  values: {
    'Dec': [0,   0,  31, 0, 0],
    'Jan': [0,   0,   0, 0, 0],
    'Feb': [0,   0,   0, 0, 0],
    'Mar': [7,  15,   0, 0, 0],
    'Apr': [0,   0,   0, 0, 0],
    'May': [24,  0,  19, 8, 4],
  },
};

// ── Position Status Summary ───────────────────────────────────────────────────
export const orionStatusData = [
  { status: 'Active',               count: 4  },
  { status: 'Active – L1 Pending',  count: 1  },
  { status: 'On Hold',              count: 6  },
  { status: 'Not Started',          count: 4  },
  { status: 'Partial Onboard',      count: 1  },
  { status: 'Dropped',              count: 1  },
  { status: 'Closed',               count: 2  },
  { status: 'No Update',            count: 1  },
];

// ── Month-over-Month Profile Growth ──────────────────────────────────────────
export const orionPeriodGrowth = [
  { period: 'Dec → Jan', growth: -100.0 },
  { period: 'Jan → Feb', growth: 0      },
  { period: 'Feb → Mar', growth: null   },
  { period: 'Mar → Apr', growth: -100.0 },
  { period: 'Apr → May', growth: null   },
];