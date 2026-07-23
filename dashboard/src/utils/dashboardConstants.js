export const STATUS_ORDER = ['In Process', 'On Hold', 'Closed-Hired', 'Closed-No Hire'];

export const STATUS_COLORS = {
  'In Process': '#38BDF8',
  'On Hold': '#F59E0B',
  'Closed-Hired': '#22C55E',
  'Closed-No Hire': '#EF4444',
};

export const STATUS_TEXT_COLORS = {
  'In Process': '#0369A1',
  'On Hold': '#B45309',
  'Closed-Hired': '#15803D',
  'Closed-No Hire': '#B91C1C',
};

export const EXPERIENCE_BUCKETS = ['Junior', 'Senior', 'Lead'];

export const EXPERIENCE_BUCKET_LABELS = {
  Junior: 'Junior (2–4y)',
  Senior: 'Senior (5–7y)',
  Lead: 'Lead (8y+)',
};

export const EXPERIENCE_BUCKET_COLORS = {
  Junior: '#84CC16',
  Senior: '#14B8A6',
  Lead: '#0F766E',
};

export const EXPERIENCE_BUCKET_TEXT_COLORS = EXPERIENCE_BUCKET_COLORS;

export const EXPERIENCE_BUCKET_TOOLTIP = {
  width: 260,
  height: 160,
  gap: 15,
};

export const LOCATION_BUBBLE_RANGES = [
  { key: '1–4 openings', min: 0, max: 4, color: '#7C3AED' },
  { key: '5–9 openings', min: 5, max: 9, color: '#0D9488' },
  { key: '10+ openings', min: 10, max: Infinity, color: '#0284C7' },
];

export const LOCATION_BUBBLE_TOOLTIP = {
  width: 290,
  height: 220,
  gap: 15,
};
