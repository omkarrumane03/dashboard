import { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { hiringShare } from '../../data/notebookData';
import { DOMAIN_COLORS, PALETTE } from '../../utils/theme';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: '#0d1117',
        border: `1px solid ${PALETTE.border}`,
        borderRadius: 8,
        padding: '8px 12px',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 13,
      }}
    >
      <div style={{ color: DOMAIN_COLORS[payload[0].name] }}>
        {payload[0].name}
      </div>
      <div style={{ color: PALETTE.text }}>
        <strong>{payload[0].value}%</strong>
      </div>
    </div>
  );
};

const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, share }) => {
  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={13}
      fontFamily="'JetBrains Mono', monospace"
      fontWeight={600}
    >
      {share}%
    </text>
  );
};

export default function DomainHiringShareDonut() {
  const [selectedDomain, setSelectedDomain] = useState(null);

  const filteredData = useMemo(() => {
    if (!selectedDomain) return hiringShare;
    return hiringShare.filter((item) => item.domain === selectedDomain);
  }, [selectedDomain]);

  const handleSelection = (domain) => {
    setSelectedDomain((prev) => (prev === domain ? null : domain));
  };

  const CustomLegend = () => {
    return (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 12,
          marginTop: 12,
        }}
      >
        {hiringShare.map((entry) => {
          const isActive = selectedDomain === entry.domain;
          const isDimmed = selectedDomain && !isActive;

          return (
            <button
              key={entry.domain}
              onClick={() => handleSelection(entry.domain)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: isActive ? PALETTE.border : 'transparent',
                border: `1px solid ${isActive ? DOMAIN_COLORS[entry.domain] : PALETTE.border}`,
                borderRadius: 8,
                padding: '4px 8px',
                cursor: 'pointer',
                opacity: isDimmed ? 0.45 : 1,
                transition: 'all 0.25s ease',
                color: PALETTE.muted,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: DOMAIN_COLORS[entry.domain],
                  display: 'inline-block',
                }}
              />
              {entry.domain}
            </button>
          );
        })}

        {selectedDomain && (
          <button
            onClick={() => setSelectedDomain(null)}
            style={{
              background: '#111827',
              border: `1px solid ${PALETTE.border}`,
              borderRadius: 8,
              padding: '4px 10px',
              cursor: 'pointer',
              color: '#fff',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
            }}
          >
            Show All
          </button>
        )}
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={filteredData}
          dataKey="share"
          nameKey="domain"
          cx="50%"
          cy="45%"
          innerRadius="45%"
          outerRadius={selectedDomain ? '78%' : '72%'}
          paddingAngle={selectedDomain ? 0 : 2}
          labelLine={false}
          label={(props) =>
            renderLabel({
              ...props,
              share: props.payload.share,
            })
          }
          animationDuration={500}
          onClick={(data) => handleSelection(data.domain)}
        >
          {filteredData.map((d) => (
            <Cell
              key={d.domain}
              fill={DOMAIN_COLORS[d.domain]}
              stroke={selectedDomain === d.domain ? '#ffffff' : 'none'}
              strokeWidth={selectedDomain === d.domain ? 2 : 0}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </Pie>

        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
      </PieChart>
    </ResponsiveContainer>
  );
}