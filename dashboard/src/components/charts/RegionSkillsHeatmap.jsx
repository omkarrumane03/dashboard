// components/charts/JobLocationHeatmap.jsx
import { useState } from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell } from 'recharts';
import { orionPipeline } from '../../data/notebookData';
import { PALETTE } from '../../utils/theme';

// Helper function to truncate long labels
const truncateLabel = (label, maxLength = 12) => {
  if (!label) return '';
  return label.length > maxLength ? `${label.substring(0, maxLength)}...` : label;
};

// Custom X-Axis Tick with native hover tooltip
const CustomXAxisTick = ({ x, y, payload, uniqueRoles }) => {
  const fullLabel = uniqueRoles[payload.value] || '';
  const truncated = truncateLabel(fullLabel, 12); // Adjust length limit here

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
        transform="rotate(-45)"
        style={{ cursor: 'pointer' }}
      >
        <title>{fullLabel}</title> {/* Native hover tooltip */}
        {truncated}
      </text>
    </g>
  );
};

// Custom Y-Axis Tick with native hover tooltip
const CustomYAxisTick = ({ x, y, payload, uniqueLocations }) => {
  const fullLabel = uniqueLocations[payload.value] || '';
  const truncated = truncateLabel(fullLabel, 15); // Adjust length limit here

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={-10}
        y={4}
        textAnchor="end"
        fill={PALETTE.muted}
        fontSize={11}
        fontFamily="'JetBrains Mono', monospace"
        style={{ cursor: 'pointer' }}
      >
        <title>{fullLabel}</title> {/* Native hover tooltip */}
        {truncated}
      </text>
    </g>
  );
};

export default function JobLocationHeatmap() {
  const [selectedPeriod, setSelectedPeriod] = useState('May');
  const periods = ['May', 'Mar–May', 'Dec–Feb'];

  const filteredData = orionPipeline.filter(item => item.period === selectedPeriod);
  
  const uniqueRoles = Array.from(new Set(orionPipeline.map(item => item.jobTitle))).sort();
  const uniqueLocations = Array.from(new Set(orionPipeline.map(item => item.location || 'Remote/Global'))).sort();

  const matrixData = [];
  
  uniqueRoles.forEach((role, xIdx) => {
    uniqueLocations.forEach((loc, yIdx) => {
      const matches = filteredData.filter(item => item.jobTitle === role && (item.location || 'Remote/Global') === loc);
      const totalOpenings = matches.reduce((sum, item) => sum + (parseInt(item.openings, 10) || 0), 0);

      if (totalOpenings > 0) {
        matrixData.push({
          x: xIdx,
          y: yIdx,
          roleName: role,
          locationName: loc,
          openings: totalOpenings,
        });
      }
    });
  });

  const getColor = (value) => {
    if (value >= 5) return '#58a6ff';
    if (value >= 3) return '#1f6feb';
    return '#164e9e';
  };

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const data = payload[0].payload;
    return (
      <div style={{ 
        background: '#0d1117', 
        border: `1px solid ${PALETTE.border}`, 
        borderRadius: 8, 
        padding: '10px 14px', 
        fontFamily: "'JetBrains Mono', monospace", 
        fontSize: 13 
      }}>
        <div style={{ color: PALETTE.muted, marginBottom: 4 }}>Role: <span style={{ color: '#fff', fontWeight: 600 }}>{data.roleName}</span></div>
        <div style={{ color: PALETTE.muted, marginBottom: 4 }}>Location: <span style={{ color: '#fff', fontWeight: 600 }}>{data.locationName}</span></div>
        <div style={{ color: '#58a6ff', marginTop: 6 }}>Openings: <strong>{data.openings}</strong></div>
      </div>
    );
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
      
      {/* Segmented Period Toggle Controls */}
      <div style={{ display: 'flex', gap: 8, paddingBottom: 4 }}>
        {periods.map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            style={{
              padding: '4px 10px',
              borderRadius: 6,
              border: `1px solid ${selectedPeriod === period ? '#58a6ff' : PALETTE.border}`,
              background: selectedPeriod === period ? 'rgba(88, 166, 255, 0.1)' : '#161b22',
              color: selectedPeriod === period ? '#58a6ff' : PALETTE.muted,
              fontSize: 10,
              fontFamily: "'JetBrains Mono', monospace",
              cursor: 'pointer',
              fontWeight: selectedPeriod === period ? 600 : 400,
              transition: 'all 0.2s ease'
            }}
          >
            {period}
          </button>
        ))}
      </div>

      {/* Grid Matrix Visualizer */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 90 }}>
            <XAxis
              type="number"
              dataKey="x"
              domain={[0, uniqueRoles.length - 1]}
              tick={<CustomXAxisTick uniqueRoles={uniqueRoles} />}
              interval={0}
              axisLine={{ stroke: PALETTE.border }}
              tickLine={false}
            />
            <YAxis
              type="number"
              dataKey="y"
              domain={[0, uniqueLocations.length - 1]}
              tick={<CustomYAxisTick uniqueLocations={uniqueLocations} />}
              interval={0}
              axisLine={{ stroke: PALETTE.border }}
              tickLine={false}
              width={130} 
            />
            <ZAxis type="number" dataKey="openings" range={[100, 500]} />
            
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.1)' }} />
            
            <Scatter data={matrixData}>
              {matrixData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getColor(entry.openings)} 
                  stroke={PALETTE.border}
                  strokeWidth={1}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}