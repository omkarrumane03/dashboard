export const months =  ['Feb','Mar','Apr','May'];
export const skills =  ['Java','DevOps','Data Science','UI/UX','Mobile'];
export const sources = ['LinkedIn','Referrals','Job Portals','Career Site'];
export const regions = ['Mumbai','Pune','Bangalore','Delhi','Chennai'];

// Chart 1 — Net Open Requirements (Previous 3 Months)
export const netOpenData = [
  { month: 'Feb', netOpen: 220, netClosed: 135 }, 
  { month: 'Mar', netOpen: 230, netClosed: 150 },
  { month: 'Apr', netOpen: 225, netClosed: 145 }, 
  { month: 'May', netOpen: 240, netClosed: 160 },
];

// Chart 2 — Open vs Closed by Skills (Previous 3 Months)
export const skillsMonthly = [
  {
    skill: 'Java',
    monthly: { Feb: { open: 45, closed: 28 }, Mar: { open: 47, closed: 31 }, Apr: { open: 46, closed: 30 }, May: { open: 50, closed: 35 } },
  },
  {
    skill: 'DevOps',
    monthly: { Feb: { open: 48, closed: 30 }, Mar: { open: 50, closed: 33 }, Apr: { open: 49, closed: 32 }, May: { open: 52, closed: 36 } },
  },
  {
    skill: 'Data Science',
    monthly: { Feb: { open: 42, closed: 25 }, Mar: { open: 44, closed: 28 }, Apr: { open: 43, closed: 27 }, May: { open: 46, closed: 31 } },
  },
  {
    skill: 'UI/UX',
    monthly: { Feb: { open: 42, closed: 26 }, Mar: { open: 44, closed: 29 }, Apr: { open: 43, closed: 28 }, May: { open: 46, closed: 30 } },
  },
  {
    skill: 'Mobile',
    monthly: { Feb: { open: 43, closed: 26 }, Mar: { open: 45, closed: 29 }, Apr: { open: 44, closed: 28 }, May: { open: 46, closed: 28 } },
  },
];

// Chart 3 — Open Positions by Region and Skills  (Current Month (May))
export const regionSkillsHeatmap = {
  skills: ['Java', 'DevOps', 'Data Science', 'UI/UX', 'Mobile'],
  regions: ['North America', 'EMEA', 'APAC', 'LATAM', 'India'],
  values: {
    Feb: [ [12, 8, 10, 5, 10],  [15, 10, 8, 5, 10],  [10, 10, 7, 5, 10],  [8, 12, 10, 4, 8],   [9, 9, 10, 6, 9] ],
    Mar: [ [13, 9, 10, 5, 10],  [14, 11, 9, 6, 10],  [11, 10, 8, 5, 10],  [10, 12, 10, 5, 7],  [10, 10, 10, 5, 10] ],
    Apr: [ [12, 10, 9, 5, 10],  [13, 12, 10, 5, 9],  [10, 9, 10, 6, 8],   [9, 11, 11, 4, 8],   [11, 8, 10, 7, 8] ],
    May: [ [15, 10, 10, 5, 10], [16, 12, 8, 6, 10],  [12, 9, 10, 5, 10], [10, 14, 10, 4, 8],   [12, 10, 9, 6, 9]  ]
  }
};

// Chart 4 — Skills-wise Hiring Share (Previous 3 Months) + Current Month (May)
export const hiringShare = [
  { month: 'Feb', skill: 'Java', share: 30 }, 
  { month: 'Feb', skill: 'DevOps', share: 25 }, 
  { month: 'Feb', skill: 'Data Science', share: 20 },
  {month: 'Feb', skill: 'UI/UX', share: 15 },
  {month: 'Feb', skill: 'Mobile', share: 10 },
  { month: 'Mar', skill: 'Java', share: 28 }, 
  { month: 'Mar', skill: 'DevOps', share: 26 }, 
  { month: 'Mar', skill: 'Data Science', share: 22 },
  {month: 'Mar', skill: 'UI/UX', share: 14 },
  {month: 'Mar', skill: 'Mobile', share: 10 },
  { month: 'Apr', skill: 'Java', share: 30 }, 
  { month: 'Apr', skill: 'DevOps', share: 25 }, 
  { month: 'Apr', skill: 'Data Science', share: 20 },
  {month: 'Apr', skill: 'UI/UX', share: 15 },
  {month: 'Apr', skill: 'Mobile', share: 10 },
  { month: 'May', skill: 'Java', share: 32 }, 
  { month: 'May', skill: 'DevOps', share: 24 }, 
  { month: 'May', skill: 'Data Science', share: 21 },
  {month: 'May', skill: 'UI/UX', share: 14 },
  {month: 'May', skill: 'Mobile', share: 9 },
];

// Chart 5 — Demand by Experience Level Previous 3 Months + Current Month (May)
export const experienceDemand = [
  { month: 'Feb', level: 'Fresher (0-2)', count: 50 }, { month: 'Feb', level: 'Junior (3-7)', count: 70 },
  { month: 'Feb', level: 'Mid (7-12)', count: 60 },    { month: 'Feb', level: 'Senior (12+)', count: 40 },
  { month: 'Mar', level: 'Fresher (0-2)', count: 55 }, { month: 'Mar', level: 'Junior (3-7)', count: 75 },
  { month: 'Mar', level: 'Mid (7-12)', count: 60 },    { month: 'Mar', level: 'Senior (12+)', count: 40 },
  { month: 'Apr', level: 'Fresher (0-2)', count: 50 }, { month: 'Apr', level: 'Junior (3-7)', count: 70 },
  { month: 'Apr', level: 'Mid (7-12)', count: 65 },    { month: 'Apr', level: 'Senior (12+)', count: 40 },
  { month: 'May', level: 'Fresher (0-2)', count: 60 }, { month: 'May', level: 'Junior (3-7)', count: 80 },
  { month: 'May', level: 'Mid (7-12)', count: 60 },    { month: 'May', level: 'Senior (12+)', count: 40 },
];

// Chart 6 — Time-to-Fill by Skills (avg days per month) (Previous 3 Months)
export const timeToFillData = [
  { month:'Feb', Java:21, DevOps:20, 'Data Science':21, 'UI/UX':24, Mobile:23 }, 
  { month:'Mar', Java:37, DevOps:20, 'Data Science':20, 'UI/UX':38, Mobile:49 },
  { month:'Apr', Java:35, DevOps:28, 'Data Science':25, 'UI/UX':41, Mobile:47 }, 
  { month:'May', Java:30, DevOps:25, 'Data Science':22, 'UI/UX':35, Mobile:40 },
];

// Chart 7 — Sourcing Channel Impact (Sunburst source data) (Previous 3 Months)
export const sourcingData = [
  { month: 'Feb', source: 'LinkedIn', interviews: 180, hires: 60 },      { month: 'Feb', source: 'Referrals', interviews: 120, hires: 40 },
  { month: 'Feb', source: 'Job Portals', interviews: 110, hires: 35 },   { month: 'Feb', source: 'Career Site', interviews: 115, hires: 38 },
  { month: 'Mar', source: 'LinkedIn', interviews: 200, hires: 65 },      { month: 'Mar', source: 'Referrals', interviews: 130, hires: 45 },
  { month: 'Mar', source: 'Job Portals', interviews: 125, hires: 40 },   { month: 'Mar', source: 'Career Site', interviews: 130, hires: 42 },
  { month: 'Apr', source: 'LinkedIn', interviews: 190, hires: 62 },      { month: 'Apr', source: 'Referrals', interviews: 125, hires: 43 },
  { month: 'Apr', source: 'Job Portals', interviews: 120, hires: 38 },   { month: 'Apr', source: 'Career Site', interviews: 125, hires: 40 },
  { month: 'May', source: 'LinkedIn', interviews: 220, hires: 75 },      { month: 'May', source: 'Referrals', interviews: 150, hires: 55 },
  { month: 'May', source: 'Job Portals', interviews: 130, hires: 45 },   { month: 'May', source: 'Career Site', interviews: 140, hires: 50 },
];

// Chart 8 — Offer Acceptance & Joining Rate (Previous 3 Months)
export const offerMetricsMonthly = [
  { month: 'Feb', acceptRate: 85, joinRate: 82 }, { month: 'Mar', acceptRate: 87, joinRate: 84 },
  { month: 'Apr', acceptRate: 87, joinRate: 84 }, { month: 'May', acceptRate: 88, joinRate: 86 },
];

// Chart 9 — Candidate Funnel (Previous 3 Months)
export const candidateFunnelMonthly = [
  { month: 'Feb', stage: 'Applied',   count: 2000 },  { month: 'Feb', stage: 'Screening', count: 1000 },
  { month: 'Feb', stage: 'Technical', count: 500 },   { month: 'Feb', stage: 'Offer',     count: 400 },
  { month: 'Feb', stage: 'Joined',    count: 320 },   { month: 'Mar', stage: 'Applied',   count: 2200 },
  { month: 'Mar', stage: 'Screening', count: 1100 },  { month: 'Mar', stage: 'Technical', count: 550 },
  { month: 'Mar', stage: 'Offer',     count: 450 },   { month: 'Mar', stage: 'Joined',    count: 360 },
  { month: 'Apr', stage: 'Applied',   count: 2850 },  { month: 'Apr', stage: 'Screening', count: 1420 },
  { month: 'Apr', stage: 'Technical', count: 680 },   { month: 'Apr', stage: 'Offer',     count: 510 },
  { month: 'Apr', stage: 'Joined',    count:410 },    { month: 'May', stage: 'Applied',   count: 6500 },
  { month: 'May', stage: 'Screening', count:3200 },   { month: 'May', stage:'Technical',  count:1600 },
  { month: 'May', stage: 'Offer',     count:1200 },   { month: 'May', stage: 'Joined',    count:950 },
];

// Chart 10 — Interview-to-Offer Ratio (monthly, step line) (Previous 3 Months)
export const interviewOfferRatio = [
    { month: 'Feb', ratio: 3 }, { month: 'Mar', ratio: 4 }, 
    { month: 'Apr', ratio: 4 }, { month: 'May', ratio: 4 },
];

// Chart 11 — Cost Per Hire by Months (Previous 3 Months)
export const costPerHire = [
  { month:'Feb', cost:4100 }, { month:'Mar', cost:4700 }, 
  { month:'Apr', cost:4300 }, { month:'May', cost:4500 },
];

// Chart 12 — Salary Trend by Skills (Previous 3 Months)
export const salaryTrend = [
  { month: 'Feb', skill: 'Java', salary: 82 },          { month: 'Feb', skill: 'DevOps', salary: 92 },
  { month: 'Feb', skill: 'Data Science', salary: 110 }, { month: 'Feb', skill: 'UI/UX', salary: 78 },
  { month: 'Feb', skill: 'Mobile', salary: 88 },        { month: 'Mar', skill: 'Java', salary: 84 },
  { month: 'Mar', skill: 'DevOps', salary: 94 },        { month: 'Mar', skill: 'Data Science', salary: 112 },
  { month: 'Mar', skill: 'UI/UX', salary: 79 },         { month: 'Mar', skill: 'Mobile', salary: 89 },
  { month: 'Apr', skill: 'Java', salary: 85 },          { month: 'Apr', skill: 'DevOps', salary: 95 },
  { month: 'Apr', skill: 'Data Science', salary: 115 }, { month: 'Apr', skill: 'UI/UX', salary: 80 },
  { month: 'Apr', skill: 'Mobile', salary: 90 },        { month: 'May', skill: 'Java', salary: 88 },
  { month: 'May', skill: 'DevOps', salary: 98 },        { month: 'May', skill: 'Data Science', salary: 120 },
  { month: 'May', skill: 'UI/UX', salary: 82 },         { month: 'May', skill: 'Mobile', salary: 92 },
];

// Chart 13 — Forecasted Job Openings by Region & Skills  (Future Month (June-July-August))
// Values = df_region_skill * 1.2 rounded
export const forecastRegionSkill = {
  skills,
  regions,
  // values: [ [60, 24, 36, 30, 42],[24, 66, 48, 72, 54],[54, 36, 60, 66, 48],[72, 30, 54, 60, 42],[48, 42, 36, 78, 60] ],
  values: {
    Jun_F: [ [7, 3, 8, 6, 5],[7, 8, 7, 4, 5],[6, 9, 8, 4, 8],[3, 5, 8, 8, 6],[8, 1, 9, 3, 2] ],
    Jul_F: [ [8, 9, 4, 4, 5],[6, 8, 6, 4, 8],[5, 5, 9, 4, 7],[3, 5, 9, 8, 6],[8, 1, 9, 3, 2] ],
    Aug_F: [ [8, 3, 8, 6, 5],[5, 8, 7, 4, 5],[4, 9, 9, 4,	8],[3,	5, 8, 8, 6],[8, 9, 7, 3, 2] ],  
   }
};

// Chart 14 — Forecasted Skills Demand Probability (Future Month (June-July-August))
export const SkillsDemandProb = [
  {month: 'Jun_F', skill:'Java',         probability:0.68 }, {month: 'Jun_F', skill:'DevOps',       probability:0.82 },
  {month: 'Jun_F', skill:'Data Science', probability:0.91 }, {month: 'Jun_F', skill:'UI/UX',        probability:0.55 },
  {month: 'Jun_F', skill:'Mobile',       probability:0.73 }, 
  {month: 'Jul_F', skill:'Java',         probability:0.69 }, {month: 'Jul_F', skill:'DevOps',       probability:0.83 }, 
  {month: 'Jul_F', skill:'Data Science', probability:0.92 }, {month: 'Jul_F', skill:'UI/UX',        probability:0.56 }, 
  {month: 'Jul_F', skill:'Mobile',       probability:0.74 },
  {month: 'Aug_F', skill:'Java',         probability:0.70 }, {month: 'Aug_F', skill:'DevOps',       probability:0.84 },
  {month: 'Aug_F', skill:'Data Science', probability:0.93 }, {month: 'Aug_F', skill:'UI/UX',        probability:0.57 },
  {month: 'Aug_F', skill:'Mobile',       probability:0.75 },
];

// Chart 15 (Predicted TTF) — Historical + Forecast dashed (Future Month (June-July-August))
export const predictedTTF = {
  historical: timeToFillData,
  forecast: [
    { month:'Jun_F', Java:28, DevOps:32, 'Data Science':33, 'UI/UX':37, Mobile:35 },
    { month:'Jul_F', Java:29, DevOps:31, 'Data Science':34, 'UI/UX':36, Mobile:34 },
    { month:'Aug_F', Java:30, DevOps:33, 'Data Science':35, 'UI/UX':38, Mobile:36 },
  ],
};
