// components/charts/GaugePair.jsx — Chart 8: Offer Acceptance & Joining Rate
import { offerMetrics } from '../../data/notebookData';
import { PALETTE } from '../../utils/theme';

function Gauge({ value, label, sub, color }) {
  const radius = 52;
  const strokeW = 12;
  const circumference = Math.PI * radius; // half circle
  const filled = (value / 100) * circumference;
  const cx = 80, cy = 72;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
      <svg width={160} height={100} viewBox="0 0 160 90">
        {/* Background arc */}
        <path
          d={`M ${cx - radius},${cy} A ${radius},${radius} 0 0 1 ${cx + radius},${cy}`}
          fill="none" stroke={PALETTE.border} strokeWidth={strokeW} strokeLinecap="round"
        />
        {/* Filled arc */}
        <path
          d={`M ${cx - radius},${cy} A ${radius},${radius} 0 0 1 ${cx + radius},${cy}`}
          fill="none" stroke={color} strokeWidth={strokeW} strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference}`}
        />
        {/* Value */}
        <text x={cx} y={cy - 8} textAnchor="middle" fill={PALETTE.text}
          fontSize={24} fontWeight={700} fontFamily="'JetBrains Mono', monospace">
          {value}%
        </text>
        {/* Red threshold line at 90 */}
        {label === 'Offer Acceptance Rate' && (() => {
          const angle = Math.PI * (1 - 90 / 100);
          const tx = cx + radius * Math.cos(angle);
          const ty = cy - radius * Math.sin(angle);
          return <circle cx={tx} cy={ty} r={4} fill={PALETTE.red} />;
        })()}
      </svg>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: PALETTE.text, textAlign: 'center' }}>{label}</div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: PALETTE.muted, marginTop: 2 }}>{sub}</div>
    </div>
  );
}

export default function GaugePair() {
  const { accepted, offered, joined, acceptRate, joinRate } = offerMetrics;
  return (
    <div style={{ display: 'flex', height: '100%', alignItems: 'center', gap: 8 }}>
      <Gauge value={acceptRate} label="Offer Acceptance Rate" sub={`${accepted} / ${offered} offers`} color={PALETTE.accent} />
      <div style={{ width: 1, height: 80, background: PALETTE.border }} />
      <Gauge value={joinRate}   label="Joining Rate"           sub={`${joined} / ${accepted} accepted`} color={PALETTE.green} />
    </div>
  );
}
