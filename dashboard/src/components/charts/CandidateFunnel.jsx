// components/charts/CandidateFunnel.jsx — Chart 15: Candidate Funnel
import { candidateFunnel } from '../../data/notebookData';
import { PALETTE } from '../../utils/theme';

const STAGE_COLORS = ['#58a6ff', '#3fb950', '#f0883e', '#d2a8ff', '#ffa657'];

export default function CandidateFunnel() {
  const max = candidateFunnel[0].count;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6, padding: '0 8px' }}>
      {candidateFunnel.map((d, i) => {
        const pct = (d.count / max) * 100;
        const dropPct = i > 0
          ? (((candidateFunnel[i - 1].count - d.count) / candidateFunnel[i - 1].count) * 100).toFixed(0)
          : null;

        return (
          <div key={d.stage}>
            {dropPct && (
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: PALETTE.red, marginBottom: 2, textAlign: 'center' }}>
                ▼ {dropPct}% drop-off
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 120, fontSize: 13, color: PALETTE.muted, fontFamily: "'JetBrains Mono', monospace", textAlign: 'right', flexShrink: 0 }}>
                {d.stage}
              </div>
              <div style={{ flex: 1, position: 'relative', height: 28 }}>
                <div style={{
                  position: 'absolute', left: `${(100 - pct) / 2}%`,
                  width: `${pct}%`, height: '100%',
                  background: STAGE_COLORS[i],
                  borderRadius: 4,
                  opacity: 0.85,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: '#fff' }}>
                    {d.count.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
