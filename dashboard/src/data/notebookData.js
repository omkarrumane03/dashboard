// // ============================================================
// // DATA SOURCE: plots.ipynb — all values extracted verbatim
// // numpy.random.seed(42) — reproducible
// // ============================================================

// export const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
// export const domains = ['Java','DevOps','Data Science','UI/UX','Mobile'];
// export const sources = ['LinkedIn','Referrals','Job Portals','Direct'];
// export const regions = ['Mumbai','Pune','Bangalore','Delhi'];

// // Chart 1 — Net Open Requirements (monthly)
// export const netOpenData = [
//   { month: 'Jan', netOpen: 120, newRoles: 46, closed: 51 },
//   { month: 'Feb', netOpen: 135, newRoles: 59, closed: 50 },
//   { month: 'Mar', netOpen: 150, newRoles: 54, closed: 31 },
//   { month: 'Apr', netOpen: 145, newRoles: 50, closed: 53 },
//   { month: 'May', netOpen: 160, newRoles: 47, closed: 41 },
//   { month: 'Jun', netOpen: 180, newRoles: 46, closed: 35 },
//   { month: 'Jul', netOpen: 175, newRoles: 58, closed: 31 },
//   { month: 'Aug', netOpen: 190, newRoles: 50, closed: 50 },
//   { month: 'Sep', netOpen: 210, newRoles: 50, closed: 30 },
//   { month: 'Oct', netOpen: 205, newRoles: 43, closed: 41 },
//   { month: 'Nov', netOpen: 220, newRoles: 47, closed: 51 },
//   { month: 'Dec', netOpen: 230, newRoles: 42, closed: 41 },
// ];

// // KPI — Open Rate
// export const openRate = 24; // %

// // Chart 4 — Time-to-Fill by Domain (avg days per month)
// export const timeToFillData = [
//   { month:'Jan', Java:36, DevOps:31, 'Data Science':22, 'UI/UX':35, Mobile:20 },
//   { month:'Feb', Java:21, DevOps:20, 'Data Science':21, 'UI/UX':24, Mobile:23 },
//   { month:'Mar', Java:37, DevOps:20, 'Data Science':20, 'UI/UX':38, Mobile:49 },
//   { month:'Apr', Java:35, DevOps:28, 'Data Science':25, 'UI/UX':41, Mobile:47 },
//   { month:'May', Java:47, DevOps:26, 'Data Science':43, 'UI/UX':23, Mobile:22 },
//   { month:'Jun', Java:34, DevOps:26, 'Data Science':39, 'UI/UX':35, Mobile:42 },
//   { month:'Jul', Java:34, DevOps:26, 'Data Science':35, 'UI/UX':37, Mobile:29 },
//   { month:'Aug', Java:43, DevOps:47, 'Data Science':35, 'UI/UX':48, Mobile:37 },
//   { month:'Sep', Java:38, DevOps:26, 'Data Science':45, 'UI/UX':33, Mobile:46 },
//   { month:'Oct', Java:20, DevOps:28, 'Data Science':26, 'UI/UX':22, Mobile:28 },
//   { month:'Nov', Java:26, DevOps:46, 'Data Science':27, 'UI/UX':42, Mobile:37 },
//   { month:'Dec', Java:20, DevOps:34, 'Data Science':49, 'UI/UX':46, Mobile:44 },
// ];

// // Chart 5 — Open vs Closed by Domain
// export const domainSummary = [
//   { domain: 'Java',         open: 489, closed: 356 },
//   { domain: 'DevOps',       open: 476, closed: 393 },
//   { domain: 'Data Science', open: 445, closed: 295 },
//   { domain: 'UI/UX',        open: 438, closed: 356 },
//   { domain: 'Mobile',       open: 427, closed: 409 },
// ];

// // Chart 6 — Sourcing Channel Impact (Sunburst source data)
// export const sourcingData = [
//   { source: 'LinkedIn',    interviews: 550, hires: 193 },
//   { source: 'Referrals',   interviews: 380, hires: 146 },
//   { source: 'Job Portals', interviews: 332, hires: 110 },
//   { source: 'Direct',      interviews: 387, hires: 156 },
// ];

// // Chart 7 — Open Positions by Region and Domain (heatmap)
// export const regionDomainHeatmap = {
//   domains: ['Java','DevOps','Data Science','UI/UX','Mobile'],
//   regions: ['Mumbai','Pune','Bangalore','Delhi'],
//   values: [
//     [89, 32, 40, 38],
//     [39, 90, 56, 87],
//     [75, 49, 82, 87],
//     [86, 46, 82, 82],
//     [73, 76, 66, 94],
//   ],
// };

// // Chart 8 — Offer Acceptance & Joining Rate
// export const offerMetrics = {
//   accepted: 450, offered: 520, joined: 380,
//   acceptRate: 87, joinRate: 84,
// };

// // Chart 9 — Interview-to-Offer Ratio (monthly, step line)
// export const interviewOfferRatio = [
//   { month:'Jan', ratio:4 }, { month:'Feb', ratio:3 }, { month:'Mar', ratio:5 },
//   { month:'Apr', ratio:4 }, { month:'May', ratio:3 }, { month:'Jun', ratio:2 },
//   { month:'Jul', ratio:4 }, { month:'Aug', ratio:3 }, { month:'Sep', ratio:5 },
//   { month:'Oct', ratio:4 }, { month:'Nov', ratio:3 }, { month:'Dec', ratio:4 },
// ];

// // Chart 10 — Skill Concentration Heatmap (demand level)
// export const skillConcentration = [
//   { month:'Jan',  Java:65, DevOps:69, 'Data Science':66, 'UI/UX':31, Mobile:57 },
//   { month:'Feb',  Java:35, DevOps:64, 'Data Science':57, 'UI/UX':61, Mobile:64 },
//   { month:'Mar',  Java:55, DevOps:34, 'Data Science':30, 'UI/UX':45, Mobile:58 },
//   { month:'Apr',  Java:44, DevOps:44, 'Data Science':61, 'UI/UX':62, Mobile:66 },
//   { month:'May',  Java:69, DevOps:61, 'Data Science':46, 'UI/UX':67, Mobile:62 },
//   { month:'Jun',  Java:53, DevOps:44, 'Data Science':63, 'UI/UX':54, Mobile:62 },
//   { month:'Jul',  Java:30, DevOps:51, 'Data Science':45, 'UI/UX':47, Mobile:60 },
//   { month:'Aug',  Java:30, DevOps:49, 'Data Science':58, 'UI/UX':65, Mobile:61 },
//   { month:'Sep',  Java:46, DevOps:62, 'Data Science':32, 'UI/UX':50, Mobile:31 },
//   { month:'Oct',  Java:34, DevOps:32, 'Data Science':62, 'UI/UX':46, Mobile:68 },
//   { month:'Nov',  Java:38, DevOps:38, 'Data Science':30, 'UI/UX':51, Mobile:54 },
//   { month:'Dec',  Java:52, DevOps:61, 'Data Science':64, 'UI/UX':56, Mobile:65 },
// ];

// // Chart 11 — Domain-wise Hiring Share (donut)
// export const hiringShare = [
//   { domain:'Java',         share:30 },
//   { domain:'DevOps',       share:25 },
//   { domain:'Data Science', share:20 },
//   { domain:'UI/UX',        share:15 },
//   { domain:'Mobile',       share:10 },
// ];

// // Chart 12 (first) — Aging Buckets
// export const agingBuckets = [
//   { bucket:'0–30',  count:40 },
//   { bucket:'31–60', count:30 },
//   { bucket:'61–90', count:20 },
//   { bucket:'90+',   count:10 },
// ];

// // Chart 12 (second) — Demand by Experience Level
// export const experienceDemand = [
//   { level:'Fresher (0–2)', count:50 },
//   { level:'Junior (3–7)',  count:100 },
//   { level:'Mid (8–10)',    count:150 },
//   { level:'Senior (11–15)',count:80 },
// ];

// // Chart 13 — Source Effectiveness (hires per channel)
// export const sourceEffectiveness = [
//   { source:'LinkedIn',    hires:450 },
//   { source:'Referrals',   hires:300 },
//   { source:'Job Portals', hires:200 },
//   { source:'Direct',      hires:100 },
// ];

// // Chart 14 — Early Attrition by Month
// export const earlyAttrition = [
//   { month:'Jan', count:16 }, { month:'Feb', count:30 }, { month:'Mar', count:28 },
//   { month:'Apr', count:46 }, { month:'May', count:32 }, { month:'Jun', count:31 },
//   { month:'Jul', count:25 }, { month:'Aug', count:33 }, { month:'Sep', count:31 },
//   { month:'Oct', count:41 }, { month:'Nov', count:41 }, { month:'Dec', count:34 },
// ];

// // Chart 15 — Candidate Funnel
// export const candidateFunnel = [
//   { stage:'Applied',            count:2850 },
//   { stage:'Screening',          count:1420 },
//   { stage:'Technical Interview',count:680  },
//   { stage:'Offer',              count:510  },
//   { stage:'Joined',             count:410  },
// ];

// // Chart 16 — Cost Per Hire by Quarter
// export const costPerHire = [
//   { quarter:'Q1', cost:4500 },
//   { quarter:'Q2', cost:4200 },
//   { quarter:'Q3', cost:4800 },
//   { quarter:'Q4', cost:4100 },
// ];

// // Chart 17 — Revenue per Employee (monthly, random 15-25)
// export const revenuePerEmployee = [
//   { month:'Jan', revenue:21 }, { month:'Feb', revenue:18 }, { month:'Mar', revenue:23 },
//   { month:'Apr', revenue:16 }, { month:'May', revenue:24 }, { month:'Jun', revenue:19 },
//   { month:'Jul', revenue:22 }, { month:'Aug', revenue:17 }, { month:'Sep', revenue:20 },
//   { month:'Oct', revenue:15 }, { month:'Nov', revenue:22 }, { month:'Dec', revenue:24 },
// ];

// // Chart 18 — Salary Trend by Domain
// export const salaryTrend = [
//   { domain:'Java',         avgSalary:85 },
//   { domain:'DevOps',       avgSalary:95 },
//   { domain:'Data Science', avgSalary:115 },
//   { domain:'UI/UX',        avgSalary:80 },
//   { domain:'Mobile',       avgSalary:90 },
// ];

// // Chart 19 — Forecasted Hiring Load
// export const forecastedLoad = [
//   { month:'Jan', load:120 }, { month:'Feb', load:145 }, { month:'Mar', load:178 },
//   { month:'Apr', load:162 }, { month:'May', load:195 }, { month:'Jun', load:183 },
//   { month:'Jul', load:170 }, { month:'Aug', load:155 }, { month:'Sep', load:188 },
//   { month:'Oct', load:200 }, { month:'Nov', load:175 }, { month:'Dec', load:160 },
// ];

// // Chart 20 — Forecasted Job Openings by Region & Domain (next 6 months)
// // Values = df_region_domain * 1.2 rounded
// export const forecastRegionDomain = {
//   domains: ['Java','DevOps','Data Science','UI/UX','Mobile'],
//   regions: ['Mumbai','Pune','Bangalore','Delhi'],
//   values: [
//     [107, 38, 48, 46],
//     [47, 108, 67, 104],
//     [90, 59, 98, 104],
//     [103, 55, 98, 98],
//     [88, 91, 79, 113],
//   ],
// };

// // Chart 21 — Forecasted Domain Demand Probability
// export const domainDemandProb = [
//   { domain:'Java',         probability:0.68 },
//   { domain:'DevOps',       probability:0.82 },
//   { domain:'Data Science', probability:0.91 },
//   { domain:'UI/UX',        probability:0.55 },
//   { domain:'Mobile',       probability:0.73 },
// ];

// // Chart 21 (Predicted TTF) — Historical + Forecast dashed
// export const predictedTTF = {
//   historical: timeToFillData,
//   forecast: [
//     { month:'Jan_F', Java:28, DevOps:32, 'Data Science':33, 'UI/UX':37, Mobile:35 },
//     { month:'Feb_F', Java:29, DevOps:31, 'Data Science':34, 'UI/UX':36, Mobile:34 },
//     { month:'Mar_F', Java:30, DevOps:33, 'Data Science':35, 'UI/UX':38, Mobile:36 },
//     { month:'Apr_F', Java:31, DevOps:30, 'Data Science':36, 'UI/UX':35, Mobile:37 },
//     { month:'May_F', Java:29, DevOps:34, 'Data Science':32, 'UI/UX':39, Mobile:33 },
//     { month:'Jun_F', Java:32, DevOps:29, 'Data Science':37, 'UI/UX':36, Mobile:38 },
//   ],
// };
// ============================================================
// DATA SOURCE: plots.ipynb — all values extracted verbatim
// numpy.random.seed(42) — reproducible
// ============================================================

export const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export const domains = ['Java','DevOps','Data Science','UI/UX','Mobile'];
export const sources = ['LinkedIn','Referrals','Job Portals','Direct'];
export const regions = ['Mumbai','Pune','Bangalore','Delhi'];

// Chart 1 — Net Open Requirements (monthly)
export const netOpenData = [
  { month: 'Dec', netOpen: 230, newRoles: 42, closed: 41 },
  { month: 'Jan', netOpen: 120, newRoles: 46, closed: 51 },
  { month: 'Feb', netOpen: 135, newRoles: 59, closed: 50 },
  { month: 'Mar', netOpen: 150, newRoles: 54, closed: 31 },
  { month: 'Apr', netOpen: 145, newRoles: 50, closed: 53 },
  { month: 'May', netOpen: 160, newRoles: 47, closed: 41 },
];

// KPI — Open Rate
export const openRate = 24; // %

// Chart 4 — Time-to-Fill by Domain (avg days per month)
export const timeToFillData = [
  { month:'Dec', Java:20, DevOps:34, 'Data Science':49, 'UI/UX':46, Mobile:44 },
  { month:'Jan', Java:36, DevOps:31, 'Data Science':22, 'UI/UX':35, Mobile:20 },
  { month:'Feb', Java:21, DevOps:20, 'Data Science':21, 'UI/UX':24, Mobile:23 },
  { month:'Mar', Java:37, DevOps:20, 'Data Science':20, 'UI/UX':38, Mobile:49 },
  { month:'Apr', Java:35, DevOps:28, 'Data Science':25, 'UI/UX':41, Mobile:47 },
  { month:'May', Java:47, DevOps:26, 'Data Science':43, 'UI/UX':23, Mobile:22 },
];

// Chart 5 — Open vs Closed by Domain
export const domainSummary = [
  { domain: 'Java',         open: 489, closed: 356 },
  { domain: 'DevOps',       open: 476, closed: 393 },
  { domain: 'Data Science', open: 445, closed: 295 },
  { domain: 'UI/UX',        open: 438, closed: 356 },
  { domain: 'Mobile',       open: 427, closed: 409 },
];

// Chart 6 — Sourcing Channel Impact (Sunburst source data)
export const sourcingData = [
  { source: 'LinkedIn',    interviews: 550, hires: 193 },
  { source: 'Referrals',   interviews: 380, hires: 146 },
  { source: 'Job Portals', interviews: 332, hires: 110 },
  { source: 'Career Site', interviews: 387, hires: 156 },
];

// Chart 7 — Open Positions by Region and Domain (heatmap)
export const regionDomainHeatmap = {
  domains: ['Java','DevOps','Data Science','UI/UX','Mobile'],
  regions: ['Mumbai','Pune','Bangalore','Delhi','Chennai'],
  values: [
    [89, 32, 40, 38, 75],
    [39, 90, 56, 87, 49],
    [75, 49, 82, 87, 66],
    [86, 46, 82, 82, 82],
    [73, 76, 66, 94, 82],
  ],
};

// Chart 8 — Offer Acceptance & Joining Rate
export const offerMetrics = {
  accepted: 450, offered: 520, joined: 380,
  acceptRate: 87, joinRate: 84,
};

// Chart 9 — Interview-to-Offer Ratio (monthly, step line)
export const interviewOfferRatio = [
  { month:'Dec', ratio:4 }, { month:'Jan', ratio:4 }, { month:'Feb', ratio:3 }, 
  { month:'Mar', ratio:5 }, { month:'Apr', ratio:4 }, { month:'May', ratio:3 },
];

// Chart 10 — Skill Concentration Heatmap (demand level)
export const skillConcentration = [
  { month:'Dec',  Java:52, DevOps:61, 'Data Science':64, 'UI/UX':56, Mobile:65 },
  { month:'Jan',  Java:65, DevOps:69, 'Data Science':66, 'UI/UX':31, Mobile:57 },
  { month:'Feb',  Java:35, DevOps:64, 'Data Science':57, 'UI/UX':61, Mobile:64 },
  { month:'Mar',  Java:55, DevOps:34, 'Data Science':30, 'UI/UX':45, Mobile:58 },
  { month:'Apr',  Java:44, DevOps:44, 'Data Science':61, 'UI/UX':62, Mobile:66 },
  { month:'May',  Java:69, DevOps:61, 'Data Science':46, 'UI/UX':67, Mobile:62 },
];

// Chart 11 — Domain-wise Hiring Share (donut)
export const hiringShare = [
  { domain:'Java',         share:30 },
  { domain:'DevOps',       share:25 },
  { domain:'Data Science', share:20 },
  { domain:'UI/UX',        share:15 },
  { domain:'Mobile',       share:10 },
];

// Chart 12 (first) — Aging Buckets
export const agingBuckets = [
  { bucket:'0-30',  count:40 },
  { bucket:'31-60', count:30 },
  { bucket:'61-90', count:20 },
  { bucket:'90+',   count:10 },
];

// Chart 12 (second) — Demand by Experience Level
export const experienceDemand = [
  { level:'Fresher (0-2)', count:50 },
  { level:'Junior (3-7)',  count:100 },
  { level:'Mid (8-10)',    count:150 },
  { level:'Senior (11-15)',count:80 },
];

// Chart 13 — Source Effectiveness (hires per channel)
export const sourceEffectiveness = [
  { source:'LinkedIn',    hires:450 },
  { source:'Referrals',   hires:300 },
  { source:'Job Portals', hires:200 },
  { source:'Career Site', hires:100 },
];

// Chart 14 — Early Attrition by Month
export const earlyAttrition = [
  { month:'Dec', count:34 }, { month:'Jan', count:16 }, { month:'Feb', count:30 }, 
  { month:'Mar', count:28 }, { month:'Apr', count:46 }, { month:'May', count:32 },  
];

// Chart 15 — Candidate Funnel
export const candidateFunnel = [
  { stage:'Applied',            count:2850 },
  { stage:'Screening',          count:1420 },
  { stage:'Technical Interview',count:680  },
  { stage:'Offer',              count:510  },
  { stage:'Joined',             count:410  },
];

// Chart 16 — Cost Per Hire by Quarter
export const costPerHire = [
  { quarter:'Q1', cost:4500 },
  { quarter:'Q2', cost:4200 },
  { quarter:'Q3', cost:4800 },
  { quarter:'Q4', cost:4100 },
];

// Chart 17 — Revenue per Employee (monthly, random 15-25)
export const revenuePerEmployee = [
  { month:'Dec', revenue:24 }, { month:'Jan', revenue:21 }, { month:'Feb', revenue:18 }, 
  { month:'Mar', revenue:23 }, { month:'Apr', revenue:16 }, { month:'May', revenue:24 },
];

// Chart 18 — Salary Trend by Domain
export const salaryTrend = [
  { domain:'Java',         avgSalary:85 },
  { domain:'DevOps',       avgSalary:95 },
  { domain:'Data Science', avgSalary:115 },
  { domain:'UI/UX',        avgSalary:80 },
  { domain:'Mobile',       avgSalary:90 },
];

// Chart 19 — Forecasted Hiring Load
export const forecastedLoad = [
  { month:'Dec', load:160 }, { month:'Jan', load:120 }, { month:'Feb', load:145 }, 
  { month:'Mar', load:178 }, { month:'Apr', load:162 }, { month:'May', load:195 },
];

// Chart 20 — Forecasted Job Openings by Region & Domain (next 6 months)
// Values = df_region_domain * 1.2 rounded
export const forecastRegionDomain = {
  domains: ['Java','DevOps','Data Science','UI/UX','Mobile'],
  regions: ['Mumbai','Pune','Bangalore','Delhi','Chennai'],
  values: [
    [107, 38, 48, 46, 55],
    [47, 108, 67, 104, 85],
    [90, 59, 98, 104, 78],
    [103, 55, 98, 98, 66],
    [88, 91, 79, 113, 82],
  ],
};

// Chart 21 — Forecasted Domain Demand Probability
export const domainDemandProb = [
  { domain:'Java',         probability:0.68 },
  { domain:'DevOps',       probability:0.82 },
  { domain:'Data Science', probability:0.91 },
  { domain:'UI/UX',        probability:0.55 },
  { domain:'Mobile',       probability:0.73 },
];

// Chart 21 (Predicted TTF) — Historical + Forecast dashed
export const predictedTTF = {
  historical: timeToFillData,
  forecast: [
    { month:'Jun_F', Java:28, DevOps:32, 'Data Science':33, 'UI/UX':37, Mobile:35 },
    { month:'Jul_F', Java:29, DevOps:31, 'Data Science':34, 'UI/UX':36, Mobile:34 },
    { month:'Aug_F', Java:30, DevOps:33, 'Data Science':35, 'UI/UX':38, Mobile:36 },
    { month:'Sep_F', Java:31, DevOps:30, 'Data Science':36, 'UI/UX':35, Mobile:37 },
    { month:'Oct_F', Java:29, DevOps:34, 'Data Science':32, 'UI/UX':39, Mobile:33 },
    { month:'Nov_F', Java:32, DevOps:29, 'Data Science':37, 'UI/UX':36, Mobile:38 },
  ],
};
