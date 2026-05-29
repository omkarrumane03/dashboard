// components/charts/GaugePair.jsx — Chart 8: Offer Acceptance & Joining Rate (Refactored)
// Now shows current month values (large KPI) + 4-month sparkline trend
import { useMemo } from 'react';
import { offerMetricsMonthly } from '../../data/notebookData';
import { PALETTE } from '../../utils/theme';

function Sparkline({ data, color, width = 120, height = 32 }) {
  if (!data || data.length < 2) return null;

  const padding = 4;
  const graphWidth = width - 2 * padding;
  const graphHeight = height - 2 * padding;

  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const range = maxVal - minVal || 1;

  const points = data.map((val, i) => {
    const x = padding + (i / (data.length - 1)) * graphWidth;
    const y = padding + graphHeight - ((val - minVal) / range) * graphHeight;
    return [x, y];
  });

  const pathData = points
    .map((point, i) => `${i === 0 ? 'M' : 'L'} ${point[0]},${point[1]}`)
    .join(' ');

  return (
    <svg width={width} height={height} style={{ marginTop: 6 }}>
      {/* Filled area under curve */}
      <defs>
        <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`${pathData} L ${points[points.length - 1][0]},${padding + graphHeight} L ${points[0][0]},${padding + graphHeight} Z`}
        fill={`url(#grad-${color})`}
      />
      {/* Line */}
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Plot points */}
      {points.map((point, i) => (
        <circle
          key={i}
          cx={point[0]}
          cy={point[1]}
          r={i === data.length - 1 ? 3 : 1.5}
          fill={i === data.length - 1 ? color : PALETTE.border}
          opacity={i === data.length - 1 ? 1 : 0.6}
        />
      ))}
    </svg>
  );
}

function KPICard({ value, label, sparklineData, color }) {
  const trend = sparklineData && sparklineData.length > 1 
    ? sparklineData[sparklineData.length - 1] - sparklineData[0]
    : 0;
  const trendDirection = trend > 0 ? '↑' : trend < 0 ? '↓' : '→';
  const trendColor = trend > 0 ? PALETTE.green : trend < 0 ? PALETTE.red : PALETTE.muted;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      flex: 1,
      padding: '20px',
      backgroundColor: PALETTE.background,
      borderRadius: 8,
      border: `1px solid ${PALETTE.border}`,
    }}>
      {/* Large current value */}
      <div style={{
        fontSize: 56,
        fontWeight: 700,
        color,
        fontFamily: "'JetBrains Mono', monospace",
        lineHeight: 1,
        marginBottom: 4,
      }}>
        {value}%
      </div>
      
      {/* Label */}
      <div style={{
        fontSize: 12,
        color: PALETTE.muted,
        fontFamily: "'JetBrains Mono', monospace",
        textAlign: 'center',
        marginBottom: 8,
      }}>
        {label}
      </div>
      
      {/* Sparkline (4-month trend) */}
      <Sparkline data={sparklineData} color={color} width={120} height={32} />
      
      {/* Trend badge */}
      {sparklineData && sparklineData.length > 1 && (
        <div style={{
          fontSize: 10,
          color: trendColor,
          fontFamily: "'JetBrains Mono', monospace",
          marginTop: 8,
          letterSpacing: 0.5,
        }}>
          {trendDirection} {Math.abs(trend)}% from Feb
        </div>
      )}
    </div>
  );
}

export default function GaugePair() {
  const metrics = useMemo(() => {
    const acceptRates = offerMetricsMonthly.map(d => d.acceptRate);
    const joinRates = offerMetricsMonthly.map(d => d.joinRate);
    const currentMonth = offerMetricsMonthly[offerMetricsMonthly.length - 1];
    
    return { 
      acceptRates, 
      joinRates, 
      currentAccept: currentMonth.acceptRate,
      currentJoin: currentMonth.joinRate,
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12 }}>
      {/* KPI Cards Container */}
      <div style={{ display: 'flex', gap: 12, flex: 1 }}>
        <KPICard
          value={metrics.currentAccept}
          label="Offer Acceptance Rate (May)"
          sparklineData={metrics.acceptRates}
          color={PALETTE.accent}
        />
        <KPICard
          value={metrics.currentJoin}
          label="Joining Rate (May)"
          sparklineData={metrics.joinRates}
          color={PALETTE.green}
        />
      </div>
    </div>
  );
}