import { useState } from "react";

export default function ThetaDecayQuiz() {
  const [showAnswer, setShowAnswer] = useState(false);
  const [guess, setGuess] = useState(null);

  const W = 680, H = 320, pad = 50;

  // Theta decay curve — accelerates near expiration
  const points = [];
  for (let dte = 108; dte >= 0; dte--) {
    const value = Math.sqrt(dte / 108) * 100; // sqrt decay
    points.push({ dte, value });
  }

  const sx = (dte) => pad + ((108 - dte) / 108) * (W - 2 * pad);
  const sy = (val) => pad + ((100 - val) / 100) * (H - 2 * pad);

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"}${sx(p.dte).toFixed(1)},${sy(p.value).toFixed(1)}`).join(" ");

  // Key zones
  const safeEnd = 60;
  const warningEnd = 45;
  const dangerEnd = 30;

  // Today marker — entered 3/31, today is 4/5 = 5 days in = 103 DTE
  const todayDTE = 103;
  const entryDTE = 108;

  const zones = [
    { start: 108, end: 60, color: "#00d4aa", label: "SAFE ZONE", sublabel: "Slow bleed", opacity: 0.08 },
    { start: 60, end: 45, color: "#ffab40", label: "WARNING", sublabel: "Picking up speed", opacity: 0.1 },
    { start: 45, end: 30, color: "#ff6b6b", label: "ACCELERATION", sublabel: "Theta eating fast", opacity: 0.1 },
    { start: 30, end: 0, color: "#ff1744", label: "CLIFF", sublabel: "Premium melts daily", opacity: 0.15 },
  ];

  const guessOptions = [
    { label: "60 DTE", value: 60 },
    { label: "45 DTE", value: 45 },
    { label: "30 DTE", value: 30 },
    { label: "15 DTE", value: 15 },
  ];

  return (
    <div style={{ background: "#0d1117", color: "#e6edf3", fontFamily: "system-ui, -apple-system, sans-serif", padding: 24, borderRadius: 12, maxWidth: 740 }}>
      <div style={{ fontSize: 20, fontWeight: 700, color: "#e040fb", marginBottom: 4 }}>Theta Decay — Your PLTR $120 PUT</div>
      <div style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>Entry: March 31 (108 DTE) → Expiration: July 17</div>

      <svg width={W} height={H} style={{ display: "block", margin: "0 auto" }}>
        {/* Zone shading */}
        {zones.map((z, i) => (
          <rect key={i} x={sx(z.start)} y={pad} width={sx(z.end) - sx(z.start)} height={H - 2 * pad} fill={z.color} opacity={z.opacity} />
        ))}

        {/* Grid lines */}
        {[108, 90, 75, 60, 45, 30, 15, 0].map(dte => (
          <g key={dte}>
            <line x1={sx(dte)} y1={pad} x2={sx(dte)} y2={H - pad} stroke="#333" strokeWidth={0.5} />
            <text x={sx(dte)} y={H - pad + 16} textAnchor="middle" fill="#666" fontSize={10}>{dte}</text>
          </g>
        ))}

        {/* Y axis labels */}
        {[0, 25, 50, 75, 100].map(v => (
          <text key={v} x={pad - 8} y={sy(v) + 4} textAnchor="end" fill="#666" fontSize={10}>{v}%</text>
        ))}

        {/* Axis labels */}
        <text x={W / 2} y={H - 8} textAnchor="middle" fill="#888" fontSize={11}>Days to Expiration (DTE)</text>
        <text x={12} y={H / 2} textAnchor="middle" fill="#888" fontSize={11} transform={`rotate(-90, 12, ${H / 2})`}>Premium Remaining</text>

        {/* Decay curve */}
        <path d={pathD} fill="none" stroke="#e040fb" strokeWidth={2.5} />

        {/* Entry marker */}
        <line x1={sx(entryDTE)} y1={pad} x2={sx(entryDTE)} y2={H - pad} stroke="#00d4aa" strokeWidth={1.5} strokeDasharray="4,4" />
        <text x={sx(entryDTE) + 4} y={pad + 14} fill="#00d4aa" fontSize={10} fontWeight={700}>ENTRY</text>
        <text x={sx(entryDTE) + 4} y={pad + 26} fill="#00d4aa" fontSize={9}>108 DTE</text>

        {/* Today marker */}
        <line x1={sx(todayDTE)} y1={pad} x2={sx(todayDTE)} y2={H - pad} stroke="#4fc3f7" strokeWidth={1.5} strokeDasharray="4,4" />
        <text x={sx(todayDTE) + 4} y={pad + 42} fill="#4fc3f7" fontSize={10} fontWeight={700}>TODAY</text>
        <text x={sx(todayDTE) + 4} y={pad + 54} fill="#4fc3f7" fontSize={9}>103 DTE</text>

        {/* Dot on curve for today */}
        <circle cx={sx(todayDTE)} cy={sy(Math.sqrt(todayDTE / 108) * 100)} r={5} fill="#4fc3f7" stroke="#0d1117" strokeWidth={2} />

        {/* Zone labels */}
        {zones.map((z, i) => {
          const midX = (sx(z.start) + sx(z.end)) / 2;
          return (
            <g key={`label-${i}`}>
              <text x={midX} y={pad + 14} textAnchor="middle" fill={z.color} fontSize={9} fontWeight={700}>{z.label}</text>
            </g>
          );
        })}

        {/* Show answer markers */}
        {showAnswer && (
          <g>
            <line x1={sx(45)} y1={pad} x2={sx(45)} y2={H - pad} stroke="#ffab40" strokeWidth={2} strokeDasharray="6,3" />
            <text x={sx(45)} y={H - pad - 8} textAnchor="middle" fill="#ffab40" fontSize={11} fontWeight={700}>← 45 DTE</text>
            <text x={sx(45)} y={H - pad - 22} textAnchor="middle" fill="#ffab40" fontSize={10}>Acceleration starts</text>

            <line x1={sx(30)} y1={pad} x2={sx(30)} y2={H - pad} stroke="#ff6b6b" strokeWidth={2} strokeDasharray="6,3" />
            <text x={sx(30) + 4} y={H - pad - 8} textAnchor="middle" fill="#ff6b6b" fontSize={11} fontWeight={700}>30 DTE →</text>
            <text x={sx(30) + 4} y={H - pad - 22} textAnchor="middle" fill="#ff6b6b" fontSize={10}>Falls off a cliff</text>
          </g>
        )}
      </svg>

      {/* Quiz section */}
      <div style={{ background: "#161b22", borderRadius: 10, padding: 16, border: "1px solid #30363d", marginTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
          At what DTE does theta start really accelerating?
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          {guessOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setGuess(opt.value)}
              style={{
                padding: "8px 20px",
                borderRadius: 6,
                border: `1px solid ${guess === opt.value ? "#e040fb" : "#30363d"}`,
                background: guess === opt.value ? "#e040fb22" : "#0d1117",
                color: guess === opt.value ? "#e040fb" : "#888",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: guess === opt.value ? 700 : 400,
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {guess && !showAnswer && (
          <button
            onClick={() => setShowAnswer(true)}
            style={{
              padding: "8px 24px",
              borderRadius: 6,
              border: "1px solid #e040fb",
              background: "#e040fb",
              color: "#fff",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            Check Answer
          </button>
        )}

        {showAnswer && (
          <div style={{ marginTop: 8 }}>
            {guess === 45 ? (
              <div style={{ color: "#00d4aa", fontSize: 14, fontWeight: 700 }}>
                ✓ Correct! 45 DTE is where theta starts accelerating noticeably.
              </div>
            ) : guess === 30 ? (
              <div style={{ color: "#ffab40", fontSize: 14, fontWeight: 700 }}>
                Close! 30 DTE is the cliff — but the acceleration really starts at 45 DTE. 30 is where it gets brutal.
              </div>
            ) : (
              <div style={{ color: "#ff6b6b", fontSize: 14, fontWeight: 700 }}>
                Not quite. 45 DTE is the key number — that's when theta starts picking up speed. By 30 DTE it's a cliff.
              </div>
            )}

            <div style={{ marginTop: 12, padding: 12, background: "#0d1117", borderRadius: 8, fontSize: 13, color: "#ccc", lineHeight: 1.6 }}>
              <div style={{ color: "#e040fb", fontWeight: 700, marginBottom: 4 }}>Where are YOU right now?</div>
              <div>Your PLTR put is at <strong style={{ color: "#4fc3f7" }}>103 DTE</strong> — deep in the safe zone. Theta is barely touching you.</div>
              <div style={{ marginTop: 6 }}>Ed chose July 17 for a reason — it gives you time to be right without theta eating you alive.</div>
              <div style={{ marginTop: 6 }}>If this was a 30 DTE trade, you'd already be losing meaningful premium every day just from time passing.</div>
              <div style={{ marginTop: 12, color: "#ffab40", fontWeight: 700 }}>Rule of thumb: Buy options with 60+ DTE. Theta is gentle there. Under 45, the clock is working hard against you.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
