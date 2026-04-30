// components/charts/InterviewOfferLine.jsx — Chart 9: Interview-to-Offer Ratio (step line)
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
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
      <LineChart data={interviewOfferRatio} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} />
        <XAxis dataKey="month" tick={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }} axisLine={{ stroke: PALETTE.border }} tickLine={false} />
        <YAxis domain={[0, 6]} tick={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={4} stroke={PALETTE.orange} strokeDasharray="4 4" opacity={0.6} />
        <Line type="stepAfter" dataKey="ratio" name="Ratio" stroke={PALETTE.orange} strokeWidth={2.5} dot={{ fill: PALETTE.orange, r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
