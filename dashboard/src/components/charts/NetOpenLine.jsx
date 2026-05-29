// components/charts/NetOpenLine.jsx — Chart 1: Net Open Requirements
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { netOpenData } from '../../data/notebookData';
import { PALETTE } from '../../utils/theme';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  
  const netOpen = payload.find(p => p.dataKey === 'netOpen')?.value;
  const netClosed = payload.find(p => p.dataKey === 'netClosed')?.value;
  const backlog = netOpen && netClosed ? netOpen - netClosed : null;

  return (
    <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '10px 14px', fontFamily: "'JetBrains Mono', monospace", fontSize: 13}}>
      <div style={{ color: PALETTE.muted, marginBottom: 6 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <strong>{p.value}</strong>
        </div>
      ))}
      {backlog !== null && (
        <div style={{ color: PALETTE.orange, marginTop: 6, fontSize: 12 }}>
          Open Backlog: <strong>{backlog}</strong>
        </div>
      )}
    </div>
  );
};

export default function NetOpenLine() {
  // Find min and max for better Y-axis scaling
  const allValues = netOpenData.flatMap(d => [d.netOpen, d.netClosed]);
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);
  const padding = (maxVal - minVal) * 0.15;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={netOpenData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <defs>
          <linearGradient id="gradientOpen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={PALETTE.accent} stopOpacity={0.3} />
            <stop offset="95%" stopColor={PALETTE.accent} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradientClosed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={PALETTE.secondary} stopOpacity={0.2} />
            <stop offset="95%" stopColor={PALETTE.secondary} stopOpacity={0} />
          </linearGradient>
        </defs>
        
        <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} />
        <XAxis 
          dataKey="month" 
          tick={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }} 
          axisLine={{ stroke: PALETTE.border }} 
          tickLine={false} 
        />
        <YAxis 
          domain={[Math.max(0, minVal - padding), maxVal + padding]}
          tick={{ fill: PALETTE.muted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }} 
          axisLine={false} 
          tickLine={false} 
        />
        <Tooltip content={<CustomTooltip />} />
        
        {/* Area for Net Closed (rendered first, so it appears behind) */}
        <Area 
          type="monotone" 
          dataKey="netClosed" 
          name="Net Closed" 
          stroke={PALETTE.secondary} 
          strokeWidth={2.5}
          fill="url(#gradientClosed)"
          dot={{ fill: PALETTE.secondary, r: 3 }} 
          activeDot={{ r: 5 }}
        />
        
        {/* Area for Net Open (rendered last, so it appears on top) */}
        <Area 
          type="monotone" 
          dataKey="netOpen" 
          name="Net Open" 
          stroke={PALETTE.accent} 
          strokeWidth={2.5}
          fill="url(#gradientOpen)"
          dot={{ fill: PALETTE.accent, r: 3 }} 
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
