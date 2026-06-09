// // components/charts/SkillOpenClosedShare.jsx
// // Remapped to Orion: Profiles Shared vs L1/L2/Zeko Rejects per role
// // Toggle: "By Role" (grouped bars) | "By Period" (stacked % rejection share)
// import { useState, useMemo } from 'react';
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid,
//   Tooltip, Legend, ResponsiveContainer, Cell,
// } from 'recharts';
// import { orionPipeline } from '../../data/notebookData';
// import { PALETTE } from '../../utils/theme';

// const PERIODS       = ['Dec–Feb', 'Mar–May', 'May'];
// const PERIOD_COLORS = { 'Dec–Feb': '#D2A8FF', 'Mar–May': '#3BC9A0', 'May': '#58A6FF' };

// const CustomTooltip = ({ active, payload, label }) => {
//   if (!active || !payload?.length) return null;
//   return (
//     <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '8px 12px', fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
//       <div style={{ color: PALETTE.muted, marginBottom: 4 }}>{label}</div>
//       {payload.map(p => (
//         <div key={p.dataKey} style={{ color: p.color ?? p.fill }}>
//           {p.name ?? p.dataKey}: <strong>{p.value}</strong>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default function SkillOpenClosedShare() {
//   const [view,            setView]           = useState('role');
//   const [selectedPeriods, setSelectedPeriods] = useState(new Set(['Dec–Feb', 'Mar–May', 'May']));

//   // By Role view — one bar group per role (filtered by selected periods)
//   const roleData = useMemo(() => {
//     return orionPipeline
//       .filter(r => selectedPeriods.has(r.period) && r.profilesShared > 0)
//       .map(r => ({
//         role:             r.shortTitle,
//         'Profiles Shared': r.profilesShared,
//         'L1 Reject':       r.l1Reject,
//         'L2 Reject':       r.l2Reject,
//         'Zeko Reject':     r.zekoReject,
//         period:            r.period,
//       }));
//   }, [selectedPeriods]);

//   // By Period view — stacked % breakdown of rejection types per period
//   const periodData = useMemo(() => {
//     return PERIODS.filter(p => selectedPeriods.has(p)).map(p => {
//       const rows     = orionPipeline.filter(r => r.period === p);
//       const shared   = rows.reduce((s, r) => s + r.profilesShared, 0);
//       const l1       = rows.reduce((s, r) => s + r.l1Reject,       0);
//       const l2       = rows.reduce((s, r) => s + r.l2Reject,       0);
//       const zeko     = rows.reduce((s, r) => s + r.zekoReject,      0);
//       const passed   = shared - l1 - l2 - zeko;
//       return {
//         period:   p,
//         'L1 Reject':   shared > 0 ? parseFloat(((l1   / shared) * 100).toFixed(1)) : 0,
//         'L2 Reject':   shared > 0 ? parseFloat(((l2   / shared) * 100).toFixed(1)) : 0,
//         'Zeko Reject': shared > 0 ? parseFloat(((zeko / shared) * 100).toFixed(1)) : 0,
//         'Passed':      shared > 0 ? parseFloat(((passed / shared) * 100).toFixed(1)) : 0,
//       };
//     });
//   }, [selectedPeriods]);

//   const toggle = (p) => {
//     setSelectedPeriods(prev => {
//       const next = new Set(prev);
//       if (next.has(p) && next.size === 1) return next;
//       next.has(p) ? next.delete(p) : next.add(p);
//       return next;
//     });
//   };

//   return (
//     <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
//       {/* Controls */}
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, paddingRight: 4 }}>
//         <div style={{ display: 'flex', gap: 4 }}>
//           {[{ key: 'role', label: 'By Role' }, { key: 'period', label: 'By Period %' }].map(({ key, label }) => (
//             <button key={key} onClick={() => setView(key)} style={{
//               padding: '4px 12px', borderRadius: 6, fontSize: 11,
//               fontFamily: "'JetBrains Mono', monospace",
//               border: `1px solid ${view === key ? PALETTE.accent : PALETTE.border}`,
//               background: view === key ? PALETTE.accentSoft : 'transparent',
//               color: view === key ? PALETTE.accent : PALETTE.muted,
//               cursor: 'pointer', transition: 'all 0.15s',
//             }}>{label}</button>
//           ))}
//         </div>
//         <div style={{ display: 'flex', gap: 4 }}>
//           {PERIODS.map(p => {
//             const active = selectedPeriods.has(p);
//             return (
//               <button key={p} onClick={() => toggle(p)} style={{
//                 padding: '3px 10px', borderRadius: 6, fontSize: 11,
//                 fontFamily: "'JetBrains Mono', monospace",
//                 border: `1px solid ${active ? PERIOD_COLORS[p] : PALETTE.border}`,
//                 background: active ? PERIOD_COLORS[p] : 'transparent',
//                 color: active ? '#fff' : PALETTE.muted,
//                 cursor: 'pointer', transition: 'all 0.2s',
//               }}>{p}</button>
//             );
//           })}
//         </div>
//       </div>

//       {/* Chart */}
//       <div style={{ flex: 1 }}>
//         <ResponsiveContainer width="100%" height="100%">
//           {view === 'role' ? (
//             <BarChart data={roleData} barGap={2} barCategoryGap="15%"
//               margin={{ top: 6, right: 10, left: -10, bottom: 0 }}>
//               <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} vertical={false} />
//               <XAxis dataKey="role" tick={{ fill: PALETTE.muted, fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} axisLine={{ stroke: PALETTE.border }} tickLine={false} interval={0} angle={-20} textAnchor="end" height={40} />
//               <YAxis tick={{ fill: PALETTE.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
//               <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
//               <Legend verticalAlign="top" height={28} formatter={k => <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>{k}</span>} />
//               <Bar dataKey="Profiles Shared" fill={PALETTE.accent}  fillOpacity={0.9} radius={[3,3,0,0]} />
//               <Bar dataKey="L1 Reject"       fill={PALETTE.orange}  fillOpacity={0.85} radius={[3,3,0,0]} />
//               <Bar dataKey="L2 Reject"       fill={PALETTE.red ?? '#F85149'} fillOpacity={0.8} radius={[3,3,0,0]} />
//               <Bar dataKey="Zeko Reject"     fill={PALETTE.purple ?? '#D2A8FF'} fillOpacity={0.8} radius={[3,3,0,0]} />
//             </BarChart>
//           ) : (
//             <BarChart data={periodData} barCategoryGap="35%"
//               margin={{ top: 6, right: 10, left: -10, bottom: 0 }}>
//               <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} vertical={false} />
//               <XAxis dataKey="period" tick={{ fill: PALETTE.muted, fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }} axisLine={{ stroke: PALETTE.border }} tickLine={false} />
//               <YAxis tickFormatter={v => `${v}%`} tick={{ fill: PALETTE.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
//               <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
//               <Legend verticalAlign="top" height={28} formatter={k => <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>{k}</span>} />
//               <Bar dataKey="L1 Reject"   stackId="a" fill={PALETTE.orange}               fillOpacity={0.85} />
//               <Bar dataKey="L2 Reject"   stackId="a" fill={PALETTE.red ?? '#F85149'}     fillOpacity={0.8} />
//               <Bar dataKey="Zeko Reject" stackId="a" fill={PALETTE.purple ?? '#D2A8FF'}  fillOpacity={0.8} />
//               <Bar dataKey="Passed"      stackId="a" fill={PALETTE.green}                fillOpacity={0.75} radius={[3,3,0,0]} />
//             </BarChart>
//           )}
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }
// components/charts/SkillOpenClosedShare.jsx
// Remapped to Orion: Profiles Shared vs L1/L2/Zeko Rejects per role
// Toggle: "By Role" (grouped bars) | "By Period" (stacked % rejection share)
import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { orionPipeline } from '../../data/notebookData';
import { PALETTE } from '../../utils/theme';

const PERIODS       = ['Dec–Feb', 'Mar–May', 'May'];
const PERIOD_COLORS = { 'Dec–Feb': '#D2A8FF', 'Mar–May': '#3BC9A0', 'May': '#58A6FF' };

// Helper function to handle string truncation
const truncateLabel = (label, maxLength = 11) => {
  if (!label) return '';
  return label.length > maxLength ? `${label.substring(0, maxLength)}...` : label;
};

// Custom X-Axis Component with native tooltip integration
const CustomXAxisTick = ({ x, y, payload }) => {
  const fullLabel = payload.value || '';
  const truncated = truncateLabel(fullLabel, 11); // Clamps character limit cleanly

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={10}
        textAnchor="end"
        fill={PALETTE.muted}
        fontSize={10}
        fontFamily="'JetBrains Mono', monospace"
        transform="rotate(-30)"
        style={{ cursor: 'pointer' }}
      >
        <title>{fullLabel}</title> {/* Native hover tooltip */}
        {truncated}
      </text>
    </g>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '8px 12px', fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
      <div style={{ color: PALETTE.muted, marginBottom: 4 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.color ?? p.fill }}>
          {p.name ?? p.dataKey}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  );
};

export default function SkillOpenClosedShare() {
  const [view,            setView]           = useState('role');
  const [selectedPeriods, setSelectedPeriods] = useState(new Set(['Dec–Feb', 'Mar–May', 'May']));

  // By Role view — one bar group per role (filtered by selected periods)
  const roleData = useMemo(() => {
    return orionPipeline
      .filter(r => selectedPeriods.has(r.period) && r.profilesShared > 0)
      .map(r => ({
        role:             r.shortTitle,
        'Profiles Shared': r.profilesShared,
        'L1 Reject':       r.l1Reject,
        'L2 Reject':       r.l2Reject,
        // 'Zeko Reject':     r.zekoReject,
        period:            r.period,
      }));
  }, [selectedPeriods]);

  // By Period view — stacked % breakdown of rejection types per period
  const periodData = useMemo(() => {
    return PERIODS.filter(p => selectedPeriods.has(p)).map(p => {
      const rows     = orionPipeline.filter(r => r.period === p);
      const shared   = rows.reduce((s, r) => s + r.profilesShared, 0);
      const l1       = rows.reduce((s, r) => s + r.l1Reject,       0);
      const l2       = rows.reduce((s, r) => s + r.l2Reject,       0);
      // const zeko     = rows.reduce((s, r) => s + r.zekoReject,      0);
      const passed   = shared - l1 - l2 ;
      return {
        period:   p,
        'L1 Reject':   shared > 0 ? parseFloat(((l1   / shared) * 100).toFixed(1)) : 0,
        'L2 Reject':   shared > 0 ? parseFloat(((l2   / shared) * 100).toFixed(1)) : 0,
        // 'Zeko Reject': shared > 0 ? parseFloat(((zeko / shared) * 100).toFixed(1)) : 0,
        'Passed':      shared > 0 ? parseFloat(((passed / shared) * 100).toFixed(1)) : 0,
      };
    });
  }, [selectedPeriods]);

  const toggle = (p) => {
    setSelectedPeriods(prev => {
      const next = new Set(prev);
      if (next.has(p) && next.size === 1) return next;
      next.has(p) ? next.delete(p) : next.add(p);
      return next;
    });
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, paddingRight: 4 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {[{ key: 'role', label: 'By Role' }, { key: 'period', label: 'By Period %' }].map(({ key, label }) => (
            <button key={key} onClick={() => setView(key)} style={{
              padding: '4px 12px', borderRadius: 6, fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace",
              border: `1px solid ${view === key ? PALETTE.accent : PALETTE.border}`,
              background: view === key ? PALETTE.accentSoft : 'transparent',
              color: view === key ? PALETTE.accent : PALETTE.muted,
              cursor: 'pointer', transition: 'all 0.15s',
            }}>{label}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {PERIODS.map(p => {
            const active = selectedPeriods.has(p);
            return (
              <button key={p} onClick={() => toggle(p)} style={{
                padding: '3px 10px', borderRadius: 6, fontSize: 11,
                fontFamily: "'JetBrains Mono', monospace",
                border: `1px solid ${active ? PERIOD_COLORS[p] : PALETTE.border}`,
                background: active ? PERIOD_COLORS[p] : 'transparent',
                color: active ? '#fff' : PALETTE.muted,
                cursor: 'pointer', transition: 'all 0.2s',
              }}>{p}</button>
            );
          })}
        </div>
      </div>

      {/* Chart */}
      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          {view === 'role' ? (
            <BarChart data={roleData} barGap={2} barCategoryGap="15%"
              margin={{ top: 6, right: 10, left: -10, bottom: 15 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} vertical={false} />
              
              {/* Injected custom XAxis Tick Renderer with rotation and hover text support */}
              <XAxis 
                dataKey="role" 
                tick={<CustomXAxisTick />} 
                axisLine={{ stroke: PALETTE.border }} 
                tickLine={false} 
                interval={0} 
                height={50} 
              />
              
              <YAxis tick={{ fill: PALETTE.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Legend verticalAlign="top" height={28} formatter={k => <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>{k}</span>} />
              <Bar dataKey="Profiles Shared" fill={PALETTE.accent}  fillOpacity={0.9} radius={[3,3,0,0]} />
              <Bar dataKey="L1 Reject"       fill={PALETTE.orange}  fillOpacity={0.85} radius={[3,3,0,0]} />
              <Bar dataKey="L2 Reject"       fill={PALETTE.red ?? '#F85149'} fillOpacity={0.8} radius={[3,3,0,0]} />
              {/* <Bar dataKey="Zeko Reject"     fill={PALETTE.purple ?? '#D2A8FF'} fillOpacity={0.8} radius={[3,3,0,0]} /> */}
            </BarChart>
          ) : (
            <BarChart data={periodData} barCategoryGap="35%"
              margin={{ top: 6, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} vertical={false} />
              <XAxis dataKey="period" tick={{ fill: PALETTE.muted, fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }} axisLine={{ stroke: PALETTE.border }} tickLine={false} />
              <YAxis tickFormatter={v => `${v}%`} tick={{ fill: PALETTE.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Legend verticalAlign="top" height={28} formatter={k => <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>{k}</span>} />
              <Bar dataKey="L1 Reject"   stackId="a" fill={PALETTE.orange}               fillOpacity={0.85} />
              <Bar dataKey="L2 Reject"   stackId="a" fill={PALETTE.red ?? '#F85149'}     fillOpacity={0.8} />
              {/* <Bar dataKey="Zeko Reject" stackId="a" fill={PALETTE.purple ?? '#D2A8FF'}  fillOpacity={0.8} /> */}
              <Bar dataKey="Passed"      stackId="a" fill={PALETTE.green}                fillOpacity={0.75} radius={[3,3,0,0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}