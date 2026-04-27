// ============================================================
// THEME — Color palette, domain/region color maps, chart defaults
// ============================================================

export const PALETTE = {
  bg:        '#0d1117',
  surface:   '#161b22',
  border:    '#21262d',
  accent:    '#58a6ff',
  accentSoft:'#1f3a5f',
  green:     '#3fb950',
  orange:    '#f0883e',
  red:       '#f85149',
  purple:    '#d2a8ff',
  text:      '#e6edf3',
  muted:     '#8b949e',
};

export const DOMAIN_COLORS = {
  'Java':         '#58a6ff',
  'DevOps':       '#3fb950',
  'Data Science': '#f0883e',
  'UI/UX':        '#d2a8ff',
  'Mobile':       '#ffa657',
};

export const SOURCE_COLORS = {
  'LinkedIn':    '#0077b5',
  'Referrals':   '#3fb950',
  'Job Portals': '#f0883e',
  'Direct':      '#d2a8ff',
};

export const CHART_DEFAULTS = {
  margin: { top: 10, right: 20, bottom: 40, left: 50 },
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 11,
};
