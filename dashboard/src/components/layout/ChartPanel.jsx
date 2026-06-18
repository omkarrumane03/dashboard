// components/layout/ChartPanel.jsx
// Reusable card wrapper for all charts

import { PALETTE } from '../../utils/theme';

export default function ChartPanel({ title, subtitle, children, height = 280, span = 1 }) {
  return (
    <div style={{
      background: PALETTE.surface,
      border: `1px solid ${PALETTE.border}`,
      borderRadius: 12,
      padding: '20px 20px 12px',
      gridColumn: span > 1 ? `span ${span}` : undefined,
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      height: 'fit-content',
    }}>
      <div style={{ marginBottom: 8 }}>
        <div style={{
          fontSize: 20,
          fontWeight: 600,
          color: PALETTE.text,
          fontFamily: "Inter, sans-serif",
          letterSpacing: '0.02em',
        }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 18, color: PALETTE.muted, fontFamily: "Inter, sans-serif", marginTop: 2 }}>
            {subtitle}
          </div>
        )}
      </div>
      <div style={{ height, minHeight: height, width: '100%' }}>
        {children}
      </div>
    </div>
  );
}
