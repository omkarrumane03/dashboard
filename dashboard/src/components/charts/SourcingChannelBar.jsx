import { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { sourcingData } from '../../data/notebookData';
import { PALETTE } from '../../utils/theme';

const sourceColors = {
  'LinkedIn': '#4A90E2',
  'Referrals': '#7ED321',
  'Job Portals': '#F5A623',
  'Career Site': '#BD10E0',
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  const convRate = ((data.hires / data.interviews) * 100).toFixed(1);
  const hiresPerInt = (data.hires / data.interviews).toFixed(2);

  return (
    <div style={{
      background: '#0d1117',
      border: `1px solid ${PALETTE.border}`,
      borderRadius: 8,
      padding: '10px 14px',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 12,
    }}>
      <div style={{ color: sourceColors[data.source] || PALETTE.accent, marginBottom: 6 }}>
        <strong>{data.source}</strong>
      </div>
      <div style={{ color: PALETTE.text }}>Interviews: <strong>{data.interviews}</strong></div>
      <div style={{ color: PALETTE.text }}>Hires: <strong>{data.hires}</strong></div>
      <div style={{ color: PALETTE.orange, marginTop: 6 }}>
        Conversion Rate: <strong>{convRate}%</strong>
      </div>
      <div style={{ color: PALETTE.muted, fontSize: 11 }}>
        {hiresPerInt} hires per interview
      </div>
    </div>
  );
};

export default function SourcingChannelBar() {
  const chartData = useMemo(() => {
    // Aggregate by source across all months (Feb–May)
    const aggregated = sourcingData.reduce((acc, curr) => {
      const existing = acc.find(item => item.source === curr.source);
      if (existing) {
        existing.interviews += curr.interviews;
        existing.hires += curr.hires;
      } else {
        acc.push({
          source: curr.source,
          interviews: curr.interviews,
          hires: curr.hires,
        });
      }
      return acc;
    }, []);

    return aggregated.sort((a, b) => a.interviews - b.interviews);
  }, []);

  // Find max value for reference line
  const maxVal = useMemo(() => {
    return Math.max(...chartData.map(d => Math.max(d.interviews, d.hires)));
  }, [chartData]);

  // Render dot with size proportional to interview volume
  const renderDot = (props) => {
    const { cx, cy, payload, fill } = props;
    const radius = 3 + (payload.interviews / Math.max(...chartData.map(d => d.interviews))) * 8;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill={fill}
        opacity={0.75}
        style={{ cursor: 'pointer' }}
      />
    );
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Title */}
      <div style={{
        textAlign: 'center',
        marginBottom: 2,
        fontSize: 13,
        color: PALETTE.text,
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 600,
      }}>
        Sourcing Channel Efficiency
      </div>

      {/* Subtitle */}
      <div style={{
        textAlign: 'center',
        fontSize: 11,
        color: PALETTE.muted,
        fontFamily: "'JetBrains Mono', monospace",
        marginBottom: 8,
      }}>
        Above the diagonal = efficient conversion | Bubble size = interview volume
      </div>

      {/* Chart */}
      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, bottom: 40, left: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.border} />

            <XAxis
              type="number"
              dataKey="interviews"
              name="Interviews"
              stroke={PALETTE.muted}
              tick={{ fill: PALETTE.muted, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}
              label={{
                value: 'Total Interviews (Feb–May)',
                position: 'insideBottomRight',
                offset: -15,
                fill: PALETTE.muted,
                fontSize: 11,
              }}
              domain={[0, maxVal]}
            />

            <YAxis
              type="number"
              dataKey="hires"
              name="Hires"
              stroke={PALETTE.muted}
              tick={{ fill: PALETTE.muted, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}
              label={{
                value: 'Total Hires (Feb–May)',
                angle: -90,
                position: 'insideLeft',
                fill: PALETTE.muted,
                fontSize: 11,
              }}
              domain={[0, maxVal]}
            />

            {/* Perfect conversion reference line (y = x) */}
            <ReferenceLine
              segment={[
                { x: 0, y: 0 },
                { x: maxVal, y: maxVal },
              ]}
              stroke={PALETTE.muted}
              strokeDasharray="6 4"
              opacity={0.3}
              strokeWidth={1}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Plot each source as a scatter set */}
            {Object.entries(sourceColors).map(([source, color]) => (
              <Scatter
                key={source}
                name={source}
                data={chartData.filter(d => d.source === source)}
                fill={color}
                shape={(props) => renderDot({ ...props, fill: color })}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 16,
        marginTop: 12,
      }}>
        {Object.entries(sourceColors).map(([source, color]) => (
          <div key={source} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: color,
              }}
            />
            <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: PALETTE.text }}>
              {source}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}