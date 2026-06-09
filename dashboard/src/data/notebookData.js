// ORION REAL DATA — Dec 2025 – May 2026  |  v3.0

export const orionPipeline = [
  // ── PERIOD: Dec–Feb ───────────────────────────────────────────────────────
  {
    id: 1, period: 'Dec–Feb',
    openedMonth: 'December 2025', closedMonth: 'February 2026', isOpen: false,
    jobTitle: 'Data Engineer (with/without Data Fabric)',
    shortTitle: 'Data Eng',
    openings: 2, experience: '5–7 yrs',
    location: 'Kochi/Coimbatore/Chennai/Mumbai/Pune', workMode: 'Onsite',
    // Profiles: 11 | L1 reject: 4 | L1 passed: 7 | L2 reject: 4 | L2 passed: 3
    // Selected: 1 (dropped – vendor conflict) | Confirmed onboard: 0
    // Status check: openings(2) = Dropped(1) + Unresolved(1) ✓
    profilesShared: 11, l1Reject: 4, l2Reject: 4, zekoReject: 0,
    f2fFinalRound: 0, inProcess: 0, selections: 1,
    status: 'Dropped', notes: 'Selection dropped – vendor conflict (Nirav); net hires = 0',
  },
  {
    id: 2, period: 'Dec–Feb',
    openedMonth: 'December 2025', closedMonth: 'February 2026', isOpen: false,
    jobTitle: 'Sr. Data Engineer / Lead',
    shortTitle: 'Sr. Data Eng/Lead',
    openings: 2, experience: '10+ yrs',
    location: 'Kochi/Coimbatore/Chennai/Mumbai/Pune', workMode: 'Onsite',
    // Profiles: 20 | L1 reject: 7 | L2 reject: 8 | Selected: 2
    // Onboarded: 1 (Rajaraman) | Not onboarded: 1 (Biswarup – C2C→C2H)
    // Status check: openings(2) = Onboarded(1) + Partial(1) ✓
    profilesShared: 20, l1Reject: 7, l2Reject: 8, zekoReject: 0,
    f2fFinalRound: 0, inProcess: 0, selections: 2,
    status: 'Partial Onboard', notes: '1 onboarded (Rajaraman); 1 not onboarded – C2C→C2H change (Biswarup)',
  },

  // ── PERIOD: Mar–May ───────────────────────────────────────────────────────
  {
    id: 3, period: 'Mar–May',
    openedMonth: 'March 2026', closedMonth: 'May 2026', isOpen: false,
    jobTitle: 'Sr. Data Engineer',
    shortTitle: 'Sr. Data Eng',
    openings: 2, experience: '6+ yrs',
    location: 'Remote', workMode: 'Remote',
    // Profiles: 9 | L1 reject: 3 | L2 reject: 2 | Selections: 0
    // Status check: openings(2) = Closed(2) – position changed C2C→C2H ✓
    profilesShared: 9, l1Reject: 3, l2Reject: 2, zekoReject: 0,
    f2fFinalRound: 0, inProcess: 0, selections: 0,
    status: 'Closed', notes: 'Position changed C2C→C2H mid-cycle; no selection made',
  },
  {
    id: 4, period: 'Mar–May',
    openedMonth: 'March 2026', closedMonth: 'May 2026', isOpen: false,
    jobTitle: 'Sr. Data Lead',
    shortTitle: 'Sr. Data Lead',
    openings: 1, experience: '10+ yrs',
    location: 'Remote', workMode: 'Remote',
    // Profiles: 1 | No L1/L2 feedback received
    // Status check: openings(1) = No Update(1) ✓
    profilesShared: 1, l1Reject: 0, l2Reject: 0, zekoReject: 0,
    f2fFinalRound: 0, inProcess: 0, selections: 0,
    status: 'No Update', notes: 'Only 1 profile shared; no client feedback received',
  },
  {
    id: 5, period: 'Mar–May',
    openedMonth: 'March 2026', closedMonth: 'May 2026', isOpen: false,
    jobTitle: 'Lead Full Stack Developer',
    shortTitle: 'Lead Full Stack',
    openings: 1, experience: '8–12 yrs',
    location: 'Remote', workMode: 'Remote',
    // Profiles: 5 | L1 reject: 3 | Position put on hold
    // Status check: openings(1) = On Hold(1) ✓
    profilesShared: 5, l1Reject: 3, l2Reject: 0, zekoReject: 0,
    f2fFinalRound: 0, inProcess: 0, selections: 0,
    status: 'On Hold', notes: 'L1 rejections; position put on hold',
  },
  {
    id: 6, period: 'Mar–May',
    openedMonth: 'March 2026', closedMonth: 'May 2026', isOpen: false,
    jobTitle: 'Solution Architect',
    shortTitle: 'Solution Arch.',
    openings: 1, experience: '8–18 yrs',
    location: 'Kochi/Coimbatore/Chennai/Mumbai/Pune/Hyderabad', workMode: 'Hybrid',
    // Profiles: 7 | L1 reject: 2 | L2 reject: 2 | Position put on hold
    // Status check: openings(1) = On Hold(1) ✓
    profilesShared: 7, l1Reject: 2, l2Reject: 2, zekoReject: 0,
    f2fFinalRound: 0, inProcess: 0, selections: 0,
    status: 'On Hold', notes: 'L1 & L2 rejections; position put on hold',
  },

  // ── PERIOD: May (Open) ────────────────────────────────────────────────────
  {
    id: 7, period: 'May',
    openedMonth: 'May 2026', closedMonth: null, isOpen: true,
    jobTitle: '.Net Full Stack (Manager)',
    shortTitle: '.Net Full Stack',
    openings: 3, experience: '8+ yrs',
    location: 'Hyderabad – Hi-Tech City', workMode: 'Onsite',
    // Profiles: 5 | F2F drive: 2 | L1 select: 1 (RajKumar Kasraveni)
    // Position on hold. inProcess=1 (L1 select progressing), f2f=2
    // Status check: openings(3) = On Hold(3) – all paused ✓
    profilesShared: 5, l1Reject: 0, l2Reject: 0, zekoReject: 0,
    f2fFinalRound: 2, inProcess: 1, selections: 0,
    status: 'On Hold', notes: 'F2F drive: 2; L1 select: 1 (RajKumar Kasraveni); position on hold',
  },
  {
    id: 8, period: 'May',
    openedMonth: 'May 2026', closedMonth: null, isOpen: true,
    jobTitle: 'AI Engineer (SA2)',
    shortTitle: 'AI Engineer',
    openings: 3, experience: '6+ yrs',
    location: 'Hyderabad', workMode: 'Onsite',
    // Profiles: 7 | L1 reject: 1 | In final round: 1 (Hariom) | Feedback pending: 2
    // 3 did not receive interview link → unaccounted/dropped
    // l1Passed = 7-1 = 6; f2f=1 (Hariom in final); inProcess=2 (feedback pending)
    // Status check: openings(3) = Active(3) – still in flight ✓
    profilesShared: 7, l1Reject: 1, l2Reject: 0, zekoReject: 0,
    f2fFinalRound: 1, inProcess: 2, selections: 0,
    status: 'Active', notes: '1 in final round (Hariom); 2 feedback pending; 3 did not receive interview link',
  },
  {
    id: 9, period: 'May',
    openedMonth: 'May 2026', closedMonth: null, isOpen: true,
    jobTitle: 'AI Data Scientist',
    shortTitle: 'AI Data Sci.',
    openings: 3, experience: '6–8 yrs',
    location: 'Hyderabad', workMode: 'Onsite',
    // Profiles: 2 | L1 select: 2 | Position on hold after selects
    // inProcess=2 (L1 selected, awaiting next step)
    // Status check: openings(3) = On Hold(3) – paused post-L1 ✓
    profilesShared: 2, l1Reject: 0, l2Reject: 0, zekoReject: 0,
    f2fFinalRound: 0, inProcess: 2, selections: 0,
    status: 'On Hold', notes: '2 L1 selects; position put on hold',
  },
  {
    id: 10, period: 'May',
    openedMonth: 'May 2026', closedMonth: null, isOpen: true,
    jobTitle: 'Azure Data Engineer',
    shortTitle: 'Azure Data Eng',
    openings: 3, experience: '6–12 yrs',
    location: 'Hyderabad', workMode: 'Onsite',
    // Profiles: 10 | Zeko reject: 3 | Duplicate: 1 | L2 slot pending: 2
    // Usable profiles: 10-1(dup) = 9; Zeko reject: 3; L2 pending: 2; remaining unresolved: 4
    // Status check: openings(3) = On Hold(3) ✓
    profilesShared: 10, l1Reject: 0, l2Reject: 0, zekoReject: 3,
    f2fFinalRound: 0, inProcess: 2, selections: 0,
    status: 'On Hold', notes: '3 Zeko rejects; 1 duplicate profile; 2 awaiting L2 slot; position on hold',
  },
  {
    id: 11, period: 'May',
    openedMonth: 'May 2026', closedMonth: null, isOpen: true,
    jobTitle: 'Cloud Support Engineer',
    shortTitle: 'Cloud Support',
    openings: 7, experience: '6–11 yrs',
    location: 'Hyderabad', workMode: 'Hybrid',
    // No profiles shared yet
    // Status check: openings(7) = Not Started(7) ✓
    profilesShared: 0, l1Reject: 0, l2Reject: 0, zekoReject: 0,
    f2fFinalRound: 0, inProcess: 0, selections: 0,
    status: 'Not Started', notes: 'Profiles not yet shared',
  },
  {
    id: 12, period: 'May',
    openedMonth: 'May 2026', closedMonth: null, isOpen: true,
    jobTitle: 'Deployment Engineer',
    shortTitle: 'Deployment Eng',
    openings: 7, experience: '4–8 yrs',
    location: 'Hyderabad', workMode: 'Hybrid',
    // No profiles shared yet
    // Status check: openings(7) = Not Started(7) ✓
    profilesShared: 0, l1Reject: 0, l2Reject: 0, zekoReject: 0,
    f2fFinalRound: 0, inProcess: 0, selections: 0,
    status: 'Not Started', notes: 'Profiles not yet shared',
  },
  {
    id: 13, period: 'May',
    openedMonth: 'May 2026', closedMonth: null, isOpen: true,
    jobTitle: 'GenAI Lead',
    shortTitle: 'GenAI Lead',
    openings: 3, experience: '8+ yrs',
    location: 'Kochi/Coimbatore/Chennai/Mumbai/Pune', workMode: 'Not Specified',
    // Profiles: 6 | L1 reject: 0 | L2 reject: 1 | In process: 5
    // 6 shared → 0 L1 reject → 6 passed L1 → 1 L2 reject → 5 in process ✓
    // Status check: openings(3) = Active(3) – all in flight ✓
    profilesShared: 6, l1Reject: 0, l2Reject: 1, zekoReject: 0,
    f2fFinalRound: 0, inProcess: 5, selections: 0,
    status: 'Active', notes: '5 in process; strong pipeline',
  },
  {
    id: 14, period: 'May',
    openedMonth: 'May 2026', closedMonth: null, isOpen: true,
    jobTitle: 'GenAI Developer',
    shortTitle: 'GenAI Dev',
    openings: 3, experience: '5–6+ yrs',
    location: 'Kochi/Coimbatore/Chennai/Mumbai/Pune', workMode: 'Not Specified',
    // Profiles: 5 | L1 reject: 0 | L2 reject: 2 | In process: 3
    // 5 → 0 L1 reject → 5 passed L1 → 2 L2 reject → 3 in process ✓
    // Status check: openings(3) = Active(3) ✓
    profilesShared: 5, l1Reject: 0, l2Reject: 2, zekoReject: 0,
    f2fFinalRound: 0, inProcess: 3, selections: 0,
    status: 'Active', notes: '3 in process',
  },
  {
    id: 15, period: 'May',
    openedMonth: 'May 2026', closedMonth: null, isOpen: true,
    jobTitle: 'Sr. Data Engineer with AI',
    shortTitle: 'Sr. DE + AI',
    openings: 3, experience: '5–7+ yrs',
    location: 'Kochi/Coimbatore/Chennai/Mumbai/Pune', workMode: 'Not Specified',
    // Profiles: 5 | L1 reject: 2 | L2 reject: 2 | In process: 1
    // 5 → 2 L1 reject → 3 passed L1 → 2 L2 reject → 1 in process ✓
    // Status check: openings(3) = Active(3) ✓
    profilesShared: 5, l1Reject: 2, l2Reject: 2, zekoReject: 0,
    f2fFinalRound: 0, inProcess: 1, selections: 0,
    status: 'Active', notes: '1 in process',
  },
  {
    id: 16, period: 'May',
    openedMonth: 'May 2026', closedMonth: null, isOpen: true,
    jobTitle: 'Data Lead with AI',
    shortTitle: 'Data Lead + AI',
    openings: 3, experience: '8–12+ yrs',
    location: 'Kochi/Coimbatore/Chennai/Mumbai/Pune', workMode: 'Not Specified',
    // Profiles: 3 | L1 yet to be scheduled
    // inProcess=3 (shared but L1 not yet done)
    // Status check: openings(3) = Active – L1 Pending(3) ✓
    profilesShared: 3, l1Reject: 0, l2Reject: 0, zekoReject: 0,
    f2fFinalRound: 0, inProcess: 3, selections: 0,
    status: 'Active – L1 Pending', notes: 'L1 yet to be scheduled; 3 profiles awaiting evaluation',
  },
  {
    id: 17, period: 'May',
    openedMonth: 'May 2026', closedMonth: null, isOpen: true,
    jobTitle: 'Gen AI Engineer (KPMG)',
    shortTitle: 'GenAI Eng',
    openings: 3, experience: '6+ yrs',
    location: 'Kochi/Coimbatore/Chennai/Mumbai/Pune', workMode: 'Not Specified',
    // No profiles shared yet
    // Status check: openings(3) = Not Started(3) ✓
    profilesShared: 0, l1Reject: 0, l2Reject: 0, zekoReject: 0,
    f2fFinalRound: 0, inProcess: 0, selections: 0,
    status: 'Not Started', notes: 'Profiles not yet shared',
  },
  {
    id: 18, period: 'May',
    openedMonth: 'May 2026', closedMonth: null, isOpen: true,
    jobTitle: 'Gen AI Lead (KPMG)',
    shortTitle: 'GenAI Lead (K)',
    openings: 3, experience: '8+ yrs',
    location: 'Kochi/Coimbatore/Chennai/Mumbai/Pune', workMode: 'Not Specified',
    // No profiles shared yet
    // Status check: openings(3) = Not Started(3) ✓
    profilesShared: 0, l1Reject: 0, l2Reject: 0, zekoReject: 0,
    f2fFinalRound: 0, inProcess: 0, selections: 0,
    status: 'Not Started', notes: 'Profiles not yet shared',
  },
  {
    id: 19, period: 'May',
    openedMonth: 'May 2026', closedMonth: null, isOpen: true,
    jobTitle: 'UI/UX Designer',
    shortTitle: 'UI/UX Designer',
    openings: 4, experience: '8–12+ yrs',
    location: 'Gurgaon/Noida/Coimbatore/Chennai', workMode: 'Onsite',
    // Profiles: 8 | L1 reject: 3 | L1 select: 2 | Position on hold
    // 8 → 3 L1 reject → 5 passed L1 → 2 progressing (inProcess=2) → hold
    // Note: 8 - 3(L1 reject) - 2(inProcess) = 3 unresolved (screened but no result yet)
    // Status check: openings(4) = On Hold(4) ✓
    profilesShared: 8, l1Reject: 3, l2Reject: 0, zekoReject: 0,
    f2fFinalRound: 0, inProcess: 2, selections: 0,
    status: 'On Hold', notes: '2 L1 selected; position on hold (WPP client)',
  },
  {
    id: 20, period: 'May',
    openedMonth: 'May 2026', closedMonth: null, isOpen: false,
    jobTitle: 'Network Engineer (Verizon)',
    shortTitle: 'Network Eng',
    openings: 3, experience: '5+ yrs',
    location: 'Chennai – Ambattur ODC', workMode: 'Onsite',
    // Profiles: 4 | L1 reject: 1 | L2 reject: 3 | Selections: 0
    // 4 → 1 L1 reject → 3 passed L1 → 3 L2 reject → 0 selections ✓
    // Status check: openings(3) = Closed(3) ✓
    profilesShared: 4, l1Reject: 1, l2Reject: 3, zekoReject: 0,
    f2fFinalRound: 0, inProcess: 0, selections: 0,
    status: 'Closed', notes: 'Position closed; immediate joiners only; all L2 rejected',
  },
];

// ── Derived Orion Period Aggregates ───────────────────────────────────────────
// Aggregated by summing orionPipeline rows per period.
// Dec–Feb  : ids 1–2  | Mar–May: ids 3–6  | May: ids 7–20
// Strict check per period: totalRejects + inProcess + selections + unresolved = profilesShared

export const orionPeriodData = [
  {
    // id 1: shared=11, l1R=4, l2R=4, zeko=0, sel=1, inProc=0
    // id 2: shared=20, l1R=7, l2R=8, zeko=0, sel=2, inProc=0
    // Totals: shared=31, l1R=11, l2R=12, zeko=0, sel=3, inProc=0
    // rejectionCount = l1R+l2R+zeko = 11+12+0 = 23
    period: 'Dec–Feb',
    profilesShared: 31, l1Reject: 11, l2Reject: 12,
    zekoReject: 0, inProcess: 0, selections: 3,
    rejectionCount: 23, roles: 2,
  },
  {
    // id 3: shared=9,  l1R=3, l2R=2, zeko=0, sel=0, inProc=0
    // id 4: shared=1,  l1R=0, l2R=0, zeko=0, sel=0, inProc=0
    // id 5: shared=5,  l1R=3, l2R=0, zeko=0, sel=0, inProc=0
    // id 6: shared=7,  l1R=2, l2R=2, zeko=0, sel=0, inProc=0
    // Totals: shared=22, l1R=8, l2R=4, zeko=0, sel=0, inProc=0
    // rejectionCount = 8+4+0 = 12
    period: 'Mar–May',
    profilesShared: 22, l1Reject: 8, l2Reject: 4,
    zekoReject: 0, inProcess: 0, selections: 0,
    rejectionCount: 12, roles: 4,
  },
  {
    // ids 7–20 (14 roles)
    // shared: 5+7+2+10+0+0+6+5+5+3+0+0+8+4 = 55
    // l1R:    0+1+0+0+0+0+0+0+2+0+0+0+3+1  = 7
    // l2R:    0+0+0+0+0+0+1+2+2+0+0+0+0+3  = 8
    // zeko:   0+0+0+3+0+0+0+0+0+0+0+0+0+0  = 3
    // sel:    0+0+0+0+0+0+0+0+0+0+0+0+0+0  = 0
    // inProc: 1+2+2+2+0+0+5+3+1+3+0+0+2+0  = 21
    // Note: id 7 inProcess corrected to 1 (L1 select: RajKumar); id 9 inProcess=2 (L1 selects)
    // rejectionCount = 7+8+3 = 18
    period: 'May',
    profilesShared: 55, l1Reject: 7, l2Reject: 8,
    zekoReject: 3, inProcess: 21, selections: 0,
    rejectionCount: 18, roles: 14,
  },
];

// ── Orion Roles Opened vs Resolved per Period ─────────────────────────────────
// rolesOpened   = total roles in that period
// rolesResolved = roles with a final outcome (Closed, Dropped, Partial Onboard, Closed-NoHire)
// rolesOnHold   = roles with status 'On Hold'
// rolesInProcess = roles with status 'Active' or 'Active – L1 Pending' or 'Not Started' (still moving)
// Strict check: rolesOpened = rolesResolved + rolesOnHold + rolesInProcess (+ Not Started)
//
// Dec–Feb (2 roles): Dropped=1, Partial Onboard=1 → resolved=2, onHold=0, inProcess=0  ✓ 2=2+0+0
// Mar–May (4 roles): Closed=2(ids3+4→No Update counts as unresolved; id3=Closed,id4=NoUpdate),
//   On Hold=2 (ids 5,6) → resolved=1(id3), onHold=2(ids5,6), noUpdate=1(id4) → as inProcess=1
//   ✓ 4 = 1 + 2 + 1
// May (14 roles): On Hold=5(ids7,9,10,11→NotStarted,12→NotStarted,19)
//   Active=4(ids8,13,14,15), L1Pending=1(id16), NotStarted=2(ids17,18), Closed=1(id20),
//   OnHold proper=3(ids7,9,19) + NotStarted=2(ids11,12) → grouping:
//   resolved=1(Closed:id20), onHold=5(ids7,9,10,19,11,12→6 but 11&12 not started=2+OnHold=3+id10=1→6),
//   inProcess=7(Active ids8,13,14,15 + L1Pending id16 + NotStarted ids17,18)
//   ✓ 14 = 1 + 6 + 7

export const orionRolesPerPeriod = [
  {
    // Dec–Feb (2 roles):
    // id1 = Dropped (selected but vendor conflict → no hire)  → closedNoHire: 1
    // id2 = Partial Onboard (2 selected, 1 onboarded)        → closedHired:  1
    // ✓ 2 = 1 + 1 + 0 + 0 + 0
    period:          'Dec–Feb',
    rolesOpened:     2,
    rolesClosedHired:   1,   // id2 – at least 1 onboarded
    rolesClosedNoHire:  1,   // id1 – selection dropped (vendor conflict)
    rolesOnHold:     0,
    rolesInProcess:  0,
    rolesNotStarted: 0,
  },
  {
    // Mar–May (4 roles):
    // id3 = Closed, C2C→C2H, 0 hires  → closedNoHire: 1
    // id4 = No Update, 0 hires         → closedNoHire: 1
    // id5 = On Hold                    → onHold:       1
    // id6 = On Hold                    → onHold:       1
    // ✓ 4 = 0 + 2 + 2 + 0 + 0
    period:          'Mar–May',
    rolesClosedHired:   0,
    rolesClosedNoHire:  2,   // id3 (C2C→C2H), id4 (no update/stalled-closed)
    rolesOnHold:     2,      // id5, id6
    rolesInProcess:  0,
    rolesNotStarted: 0,
    rolesOpened:     4,
  },
  {
    // May (14 roles):
    // id20 = Closed, 0 hires           → closedNoHire: 1
    // id7  = On Hold                   → onHold:       1
    // id9  = On Hold                   → onHold:       1
    // id10 = On Hold                   → onHold:       1
    // id19 = On Hold                   → onHold:       1
    // id8  = Active (in process)       → inProcess:    1
    // id13 = Active (in process)       → inProcess:    1
    // id14 = Active (in process)       → inProcess:    1
    // id15 = Active (in process)       → inProcess:    1
    // id16 = Active – L1 Pending       → inProcess:    1
    // id11 = Not Started               → notStarted:   1
    // id12 = Not Started               → notStarted:   1
    // id17 = Not Started               → notStarted:   1
    // id18 = Not Started               → notStarted:   1
    // ✓ 14 = 0 + 1 + 4 + 5 + 4
    period:          'May',
    rolesOpened:     14,
    rolesClosedHired:   0,
    rolesClosedNoHire:  1,   // id20 – Network Engineer
    rolesOnHold:     4,      // id7, id9, id10, id19
    rolesInProcess:  5,      // id8, id13, id14, id15, id16
    rolesNotStarted: 4,      // id11, id12, id17, id18
  },
];

// ── Candidate Funnel — All 20 roles combined ──────────────────────────────────
// Stage flow (strict top-down arithmetic):
//   Profiles Shared : 31 + 22 + 55 = 108
//   L1 Passed       : 108 - (11+8+7)[l1Rejects] - 3[zekoReject] = 108 - 26 - 3 = 79
//   L2 Passed       : 79  - (12+4+8)[l2Rejects] = 79 - 24 = 55
//   F2F / Final     : counted from pipeline rows = 0+0+0+0+0+0+2+1+0+0+0+0+0+0+0+0+0+0+0+0 = 3
//   Selections      : 1+2 = 3 (Dec–Feb only; May = 0)

export const orionFunnelData = [
  { stage: 'Profiles Shared', count: 108 },
  { stage: 'L1 Passed',       count: 79  },
  { stage: 'L2 Passed',       count: 55  },
  { stage: 'F2F / Final',     count: 3   },
  { stage: 'Selections',      count: 3   },
];

// ── Work Mode Distribution per Period ────────────────────────────────────────
// Derived from orionPipeline workMode per period (role count, not openings):
// Dec–Feb : id1=Onsite, id2=Onsite → Onsite=2
// Mar–May : id3=Remote, id4=Remote, id5=Remote, id6=Hybrid → Remote=3, Hybrid=1
// May     : id7=Onsite, id8=Onsite, id9=Onsite, id10=Onsite,
//           id11=Hybrid, id12=Hybrid, id13=Not Specified, id14=Not Specified,
//           id15=Not Specified, id16=Not Specified, id17=Not Specified, id18=Not Specified,
//           id19=Onsite, id20=Onsite → Onsite=6, Hybrid=2, NotSpecified=6

export const orionWorkModeData = [
  { period: 'Dec–Feb', Onsite: 2, Remote: 0, Hybrid: 0, 'Not Specified': 0 },
  { period: 'Mar–May', Onsite: 0, Remote: 3, Hybrid: 1, 'Not Specified': 0 },
  { period: 'May',     Onsite: 6, Remote: 0, Hybrid: 2, 'Not Specified': 6 },
];

// ── Experience Bucket Distribution per Period (role count) ───────────────────
// Buckets: Junior (4–6y) | Senior (6–10y) | Lead (10y+)
// Dec–Feb:
//   id1 5–7y   → Senior(6–10y): 1
//   id2 10+y   → Lead(10y+):    1
// Mar–May:
//   id3 6+y    → Senior(6–10y): 1
//   id4 10+y   → Lead(10y+):    1
//   id5 8–12y  → Lead(10y+):    1  (8+ crosses senior/lead; 8–12 spans both; classified Lead as 8+ ≥ typical lead threshold)
//   id6 8–18y  → Lead(10y+):    1
// May:
//   id7  8+y   → Lead(10y+)
//   id8  6+y   → Senior(6–10y)
//   id9  6–8y  → Senior(6–10y)
//   id10 6–12y → Senior(6–10y)
//   id11 6–11y → Senior(6–10y)
//   id12 4–8y  → Junior(4–6y) + Senior(6–10y) → classified Senior (mid-range 4–8 = Senior)
//   id13 8+y   → Lead(10y+)
//   id14 5–6+y → Junior(4–6y)
//   id15 5–7+y → Junior(4–6y)
//   id16 8–12+y→ Lead(10y+)
//   id17 6+y   → Senior(6–10y)
//   id18 8+y   → Lead(10y+)
//   id19 8–12+y→ Lead(10y+)
//   id20 5+y   → Junior(4–6y)
// May counts: Junior=3(ids14,15,20), Senior=6(ids8,9,10,11,12,17), Lead=5(ids7,13,16,18,19)
// ✓ 3+6+5 = 14 roles ✓

export const orionExperienceData = [
  { period: 'Dec–Feb', 'Junior (4–6y)': 0, 'Senior (6–10y)': 1, 'Lead (10y+)': 1 },
  { period: 'Mar–May', 'Junior (4–6y)': 0, 'Senior (6–10y)': 1, 'Lead (10y+)': 3 },
  { period: 'May',     'Junior (4–6y)': 3, 'Senior (6–10y)': 6, 'Lead (10y+)': 5 },
];

// ── Location Heatmap (profiles shared by location × period) ──────────────────
// Dec–Feb: all profiles → Kochi/etc = 11+20 = 31
// Mar–May: Remote = 9+1+5 = 15 | Kochi/etc/Hyd = 7 (id6)
//   id6 is Kochi/…/Hyderabad → nearest bucket = Kochi/Coimbatore/Chennai/Mumbai/Pune
// May:
//   Hyderabad (ids 7,8,9,10): 5+7+2+10 = 24
//   Hyderabad Hybrid (ids 11,12): 0+0 = 0
//   Bangalore: 0 (id10 corrected to Hyderabad per xlsx – KPMG GDC Hyderabad)
//   Kochi/etc (ids 13,14,15,16,17,18): 6+5+5+3+0+0 = 19
//   Gurgaon/etc (id19): 8
//   Chennai-Ambattur (id20): 4

export const orionLocationHeatmap = {
  locations: [
    'Hyderabad',
    'Remote',
    'Kochi/Coimbatore/Chennai/Mumbai/Pune',
    'Gurgaon/Noida/Coimbatore/Chennai',
    'Chennai – Ambattur ODC',
  ],
  periods: ['Dec–Feb', 'Mar–May', 'May'],
  values: {
    'Dec–Feb': [0,   0,  31, 0, 0],
    'Mar–May': [7,  15,   0, 0, 0],
    'May':     [24,  0,  19, 8, 4],
  },
};

// ── Position Status Summary ───────────────────────────────────────────────────
// Derived from orionPipeline.status counts (all 20 roles):
// Active              : ids 8, 13, 14, 15           = 4
// Active – L1 Pending : id 16                        = 1
// On Hold             : ids 5, 6, 7, 9, 10, 19      = 6
// Not Started         : ids 11, 12, 17, 18           = 4
// Partial Onboard     : id 2                         = 1
// Dropped             : id 1                         = 1
// Closed (no hire)    : id 3                         = 1
// No Update           : id 4                         = 1
// Closed              : id 20                        = 1
// ✓ Total = 4+1+6+4+1+1+1+1+1 = 20 ✓

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

// ── Period-over-Period Profile Growth ─────────────────────────────────────────
export const orionPeriodGrowth = [
  { period: 'Dec–Feb → Mar–May', growth: parseFloat((((22 - 31) / 31) * 100).toFixed(1)) },  // –29.0%
  { period: 'Mar–May → May',     growth: parseFloat((((55 - 22) / 22) * 100).toFixed(1)) },  // +150.0%
];