// components/layout/SectionHeader.jsx
import { PALETTE } from '../../utils/theme';

export default function SectionHeader({ number, title, description }) {
  return (
    <div style={{ marginBottom: 16, paddingTop: 8 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          color: PALETTE.accent,
          opacity: 0.7,
          letterSpacing: '0.12em',
        }}>
          {String(number).padStart(2, '0')}
        </span>
        <h2 style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 16,
          fontWeight: 700,
          color: PALETTE.text,
          margin: 0,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}>
          {title}
        </h2>
      </div>
      {description && (
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          color: PALETTE.muted,
          margin: '4px 0 0 0',
        }}>
          {description}
        </p>
      )}
    </div>
  );
}
