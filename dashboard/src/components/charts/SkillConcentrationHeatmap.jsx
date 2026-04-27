// components/charts/SkillConcentrationHeatmap.jsx — Chart 10: Skill Concentration Heatmap
import { skillConcentration, domains, months } from '../../data/notebookData';
import { PALETTE } from '../../utils/theme';

function valueToColor(v) {
  const t = (v - 30) / (70 - 30);
  const r = Math.round(15 + t * (88 - 15));
  const g = Math.round(27 + t * (166 - 27));
  const b = Math.round(34 + t * (255 - 34));
  return `rgb(${r},${g},${b})`;
}

// export default function SkillConcentrationHeatmap() {
//   // Build lookup
//   const lookup = {};
//   skillConcentration.forEach(r => {
//     lookup[`${r.month}_${r.Domain}`] = r.Demand;
//   });
//   // Updated lookup to match your notebookData.js structure

//   const cellW = 36;
//   const cellH = 34;
//   const labelW = 90;
//   const headerH = 28;
//   const totalW = labelW + months.length * cellW;
//   const totalH = headerH + domains.length * cellH;

//   return (
//     <div style={{ width: '100%', height: '100%', overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//       <svg viewBox={`0 0 ${totalW} ${totalH}`} style={{ width: '100%', maxHeight: '100%', fontFamily: "'JetBrains Mono', monospace" }}>
//         {months.map((m, ci) => (
//           <text key={m} x={labelW + ci * cellW + cellW / 2} y={headerH - 6}
//             textAnchor="middle" fill={PALETTE.muted} fontSize={8}>{m}</text>
//         ))}
//         {domains.map((d, ri) => (
//           <g key={d}>
//             <text x={labelW - 4} y={headerH + ri * cellH + cellH / 2 + 3}
//               textAnchor="end" fill={PALETTE.muted} fontSize={8}>{d}</text>
//             {months.map((m, ci) => {
//               const v = lookup[`${m}_${d}`] ?? 0;
//               return (
//                 <g key={m}>
//                   <rect
//                     x={labelW + ci * cellW + 1} y={headerH + ri * cellH + 1}
//                     width={cellW - 2} height={cellH - 2}
//                     fill={valueToColor(v)} rx={3}
//                   />
//                   <text
//                     x={labelW + ci * cellW + cellW / 2}
//                     y={headerH + ri * cellH + cellH / 2 + 3}
//                     textAnchor="middle" fill="#fff" fontSize={8} fontWeight={600}>
//                     {v}
//                   </text>
//                 </g>
//               );
//             })}
//           </g>
//         ))}
//       </svg>
//     </div>
//   );
// }
export default function SkillConcentrationHeatmap() {
  // 1. Only use months that exist in your data
  const activeMonths = skillConcentration.map(r => r.month);

  const lookup = {};
  skillConcentration.forEach(r => {
    domains.forEach(d => {
      lookup[`${r.month}_${d}`] = r[d];
    });
  });

  const cellW = 36;
  const cellH = 34;
  const labelW = 90;
  const headerH = 28;
  // 2. Base the total width on activeMonths.length
  const totalW = labelW + activeMonths.length * cellW;
  const totalH = headerH + domains.length * cellH;

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox={`0 0 ${totalW} ${totalH}`} style={{ width: '100%', maxHeight: '100%', fontFamily: "'JetBrains Mono', monospace" }}>
        {/* Render Month Headers */}
        {activeMonths.map((m, ci) => (
          <text 
            key={m} 
            x={labelW + ci * cellW + cellW / 2} 
            y={headerH - 6}
            textAnchor="middle" 
            fill={PALETTE.muted} 
            fontSize={8}
          >
            {m}
          </text>
        ))}

        {/* Render Domain Rows and Heatmap Cells */}
        {domains.map((d, ri) => (
          <g key={d}>
            <text 
              x={labelW - 4} 
              y={headerH + ri * cellH + cellH / 2 + 3}
              textAnchor="end" 
              fill={PALETTE.muted} 
              fontSize={8}
            >
              {d}
            </text>
            {activeMonths.map((m, ci) => {
              const v = lookup[`${m}_${d}`] ?? 0;
              return (
                <g key={`${m}-${d}`}>
                  <rect
                    x={labelW + ci * cellW + 1} 
                    y={headerH + ri * cellH + 1}
                    width={cellW - 2} 
                    height={cellH - 2}
                    fill={valueToColor(v)} 
                    rx={3}
                  />
                  <text
                    x={labelW + ci * cellW + cellW / 2}
                    y={headerH + ri * cellH + cellH / 2 + 3}
                    textAnchor="middle" 
                    fill="#fff" 
                    fontSize={8} 
                    fontWeight={600}
                  >
                    {v}
                  </text>
                </g>
              );
            })}
          </g>
        ))}
      </svg>
    </div>
  );}