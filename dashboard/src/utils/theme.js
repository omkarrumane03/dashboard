// THEME — Color palette, domain/region color maps, chart defaults

export const PALETTE = {
  bg:         '#F0FAF5', // pale mint canvas
  surface:    '#FFFFFF', // clean white card elevation
  border:     '#D3EDE0', // mint-tinted border, not generic grey
  accent:     '#0D9488', // teal-600, distinct hue from "green" below
  accentSoft: '#CCFBEF', // light teal/mint tint
  green:      '#15803D', // true green-700, kept separate from teal accent
  orange:     '#C2410C', // orange-700
  red:        '#B91C1C', // red-700
  purple:     '#7E22CE', // purple-700
  text:       '#0F2A22', // near-black w/ mint undertone, AAA
  muted:      '#4B6358', // mint-grey-green, AA (~4.9:1)
};


export const CHART_DEFAULTS = {
  margin: { top: 10, right: 20, bottom: 40, left: 50 },
  fontFamily: "Inter, sans-serif",
  fontSize: 14,
};
