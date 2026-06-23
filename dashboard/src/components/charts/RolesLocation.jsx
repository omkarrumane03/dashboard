// components/charts/RolesLocation.jsx
import { useState, useMemo } from 'react';
import {
  ResponsiveContainer, ScatterChart, Scatter,
  XAxis, YAxis, ZAxis, Tooltip, Cell,
} from 'recharts';
import { useDateRange } from '../../context/DateRangeContext';
import { PALETTE } from '../../utils/theme';

const truncateLabel = (label, maxLength = 12) => {
  if (!label) return '';
  return label.length > maxLength ? `${label.substring(0, maxLength)}...` : label;
};

const CustomXAxisTick = ({ x, y, payload, uniqueRoles }) => {
  const fullLabel = uniqueRoles[payload.value] || '';
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={10} textAnchor="end" fill={PALETTE.muted} fontSize={13}
        fontFamily="'Inter', sans-serif" transform="rotate(-45)" style={{ cursor: 'pointer' }}>
        <title>{fullLabel}</title>
        {truncateLabel(fullLabel, 12)}
      </text>
    </g>
  );
};

const CustomYAxisTick = ({ x, y, payload, uniqueLocations }) => {
  const fullLabel = uniqueLocations[payload.value] || '';
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={-10} y={4} textAnchor="end" fill={PALETTE.muted} fontSize={13}
        fontFamily="'Inter', sans-serif" style={{ cursor: 'pointer' }}>
        <title>{fullLabel}</title>
        {truncateLabel(fullLabel, 15)}
      </text>
    </g>
  );
};

const getColor = (value) => {
  if (value >= 5) return '#58a6ff';
  if (value >= 3) return '#1f6feb';
  return '#164e9e';
};

export default function RolesLocation() {
  const { filteredPipeline } = useDateRange();

  const availableMonths = useMemo(() => {
    const seen = new Set(); const months = [];
    filteredPipeline.forEach(r => {
      if (!seen.has(r.month)) { seen.add(r.month); months.push(r.month); }
    });
    return months;
  }, [filteredPipeline]);

  const [selectedPeriod, setSelectedPeriod] = useState(null);

  const activePeriod = useMemo(() => {
    if (selectedPeriod && availableMonths.includes(selectedPeriod)) return selectedPeriod;
    return availableMonths[availableMonths.length - 1] ?? null;
  }, [selectedPeriod, availableMonths]);

  const filteredData = useMemo(() =>
    filteredPipeline.filter(item => item.month === activePeriod),
  [filteredPipeline, activePeriod]);

  const uniqueRoles = useMemo(() =>
    Array.from(new Set(filteredPipeline.map(item => item.jobTitle))).sort(),
  [filteredPipeline]);

  // Use locationGroup — 'Multi-location' consolidates comma-separated locations
  const uniqueLocations = useMemo(() =>
    Array.from(new Set(filteredPipeline.map(item => item.locationGroup || 'Remote'))).sort(),
  [filteredPipeline]);

  const matrixData = useMemo(() => {
    const data = [];
    uniqueRoles.forEach((role, xIdx) => {
      uniqueLocations.forEach((loc, yIdx) => {
        const matches = filteredData.filter(
          item => item.jobTitle === role && (item.locationGroup || 'Remote') === loc
        );
        const totalOpenings = matches.reduce((sum, item) => sum + (parseInt(item.openings, 10) || 0), 0);
        if (totalOpenings > 0)
          data.push({ x: xIdx, y: yIdx, roleName: role, locationName: loc, openings: totalOpenings });
      });
    });
    return data;
  }, [filteredData, uniqueRoles, uniqueLocations]);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div style={{ background: '#0d1117', border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '10px 14px', fontFamily: "Inter, sans-serif", fontSize: 13 }}>
        <div style={{ color: PALETTE.muted, marginBottom: 4 }}>
          Role: <span style={{ color: '#fff', fontWeight: 600 }}>{d.roleName}</span>
        </div>
        <div style={{ color: PALETTE.muted, marginBottom: 4 }}>
          Location: <span style={{ color: '#fff', fontWeight: 600 }}>{d.locationName}</span>
        </div>
        <div style={{ color: '#58a6ff', marginTop: 6 }}>
          Openings: <strong>{d.openings}</strong>
        </div>
      </div>
    );
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {matrixData.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: PALETTE.muted, fontFamily: "Inter, sans-serif", fontSize: 13, border: `1px dashed ${PALETTE.border}`, borderRadius: 8 }}>
          No roles opened in {activePeriod}
        </div>
      ) : (
        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 90 }}>
              <XAxis type="number" dataKey="x"
                domain={[0, uniqueRoles.length - 1]}
                tick={<CustomXAxisTick uniqueRoles={uniqueRoles} />}
                interval={0} axisLine={{ stroke: PALETTE.border }} tickLine={false}
              />
              <YAxis type="number" dataKey="y"
                domain={[0, uniqueLocations.length - 1]}
                tick={<CustomYAxisTick uniqueLocations={uniqueLocations} />}
                interval={0} axisLine={{ stroke: PALETTE.border }} tickLine={false} width={130}
              />
              <ZAxis type="number" dataKey="openings" range={[100, 500]} />
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.1)' }} />
              <Scatter data={matrixData}>
                {matrixData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.openings)} stroke={PALETTE.border} strokeWidth={1} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}