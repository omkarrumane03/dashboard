// components/kpi/KPICard.jsx
// A single KPI tile — icon, label, value, optional sub-label

import { PALETTE } from '../../utils/theme';

export default function KPICard({ icon, label, value, sub, accent, trend }) {
  const color = accent || PALETTE.accent;
  return (
    <div style={{
      background: PALETTE.surface,
      border: `1px solid ${PALETTE.border}`,
      borderRadius: 14,
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Top glow strip */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: color, borderRadius: '12px 12px 0 0',
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span style={{ fontSize: 16, color: PALETTE.muted, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "Inter, sans-serif", fontWeight: 900 }}>
          {label}
        </span>
      </div>

      <div style={{ fontSize: 34, fontWeight: 700, color: PALETTE.text, lineHeight: 1.1, fontFamily: "Inter, sans-serif" }}>
        {value}
      </div>

      {sub && (
        <div style={{ fontSize: 20, color: PALETTE.muted, fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
          {sub}
        </div>
      )}

      {trend !== undefined && (
        <div style={{
          fontSize: 15, fontFamily: "Inter, sans-serif",
          color: trend >= 0 ? PALETTE.green : PALETTE.red,
        }}>
          {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
        </div>
      )}
    </div>
  );
}
