// components/charts/InterviewOfferLine.jsx — Chart 10: Interview-to-Offer Ratio (Lollipop Chart)
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { interviewOfferRatio } from '../../data/notebookData';
import { PALETTE } from '../../utils/theme';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '8px 12px', fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
      <div style={{ color: PALETTE.muted }}>{label}</div>
      <div style={{ color: PALETTE.orange }}>Ratio: <strong>{payload[0].value}:1</strong></div>
    </div>
  );
};

export default function InterviewOfferLine() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={interviewOfferRatio} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} vertical={false} />
        <XAxis 
          dataKey="month" 
          tick={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }} 
          axisLine={{ stroke: PALETTE.border }} 
          tickLine={false} 
        />
        <YAxis 
          domain={[0, 6]} 
          tick={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }} 
          axisLine={false} 
          tickLine={false} 
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine 
          y={4} 
          stroke={PALETTE.orange} 
          strokeDasharray="4 4" 
          opacity={0.6}
          label={{
            value: 'Target',
            position: 'insideTopRight',
            offset: -5,
            fill: PALETTE.orange,
            fontSize: 11,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        />
        <Bar 
          dataKey="ratio" 
          name="Ratio" 
          fill={PALETTE.orange}
          barSize={16}
          radius={[8, 8, 0, 0]}
          isAnimationActive={false}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
