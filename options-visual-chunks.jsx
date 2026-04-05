import { useState } from "react";

const B = ({ children, style }) => (
  <div style={{ background: "#161b22", borderRadius: 10, padding: 16, border: "1px solid #30363d", marginBottom: 12, ...style }}>{children}</div>
);

const chunkTitles = [
  "Standard Deviation & Expected Move",
  "Delta = ITM%",
  "IVR vs IVx — Context",
  "The Greeks",
  "Charting Fundamentals",
  "Market Makers & Flow",
  "Risk Management",
  "Shorting vs Buying Puts",
  "Your Position Now",
  "Macro View + BlackRock",
];

/* ───── CHUNK 1: Standard Deviation & Expected Move ───── */
function Chunk1() {
  const bellPoints = [];
  for (let x = -4; x <= 4; x += 0.1) {
    const y = Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
    bellPoints.push({ x, y });
  }
  const maxY = 0.4;
  const W = 700, H = 260, pad = 40;
  const sx = (x) => pad + ((x + 4) / 8) * (W - 2 * pad);
  const sy = (y) => H - pad - (y / maxY) * (H - 2 * pad);
  const pathD = bellPoints.map((p, i) => `${i === 0 ? "M" : "L"}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join(" ");

  const sigma1L = sx(-1), sigma1R = sx(1), sigma2L = sx(-2), sigma2R = sx(2);
  const fillPath1 = bellPoints.filter(p => p.x >= -1 && p.x <= 1);
  const fill1D = `M${sx(-1).toFixed(1)},${sy(0).toFixed(1)} ` + fillPath1.map(p => `L${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join(" ") + ` L${sx(1).toFixed(1)},${sy(0).toFixed(1)} Z`;
  const fillPath2a = bellPoints.filter(p => p.x >= -2 && p.x < -1);
  const fill2aD = `M${sx(-2).toFixed(1)},${sy(0).toFixed(1)} ` + fillPath2a.map(p => `L${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join(" ") + ` L${sx(-1).toFixed(1)},${sy(0).toFixed(1)} Z`;
  const fillPath2b = bellPoints.filter(p => p.x > 1 && p.x <= 2);
  const fill2bD = `M${sx(1).toFixed(1)},${sy(0).toFixed(1)} ` + fillPath2b.map(p => `L${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join(" ") + ` L${sx(2).toFixed(1)},${sy(0).toFixed(1)} Z`;

  const pltrNow = 137.50, em = 48.34;
  const low1 = pltrNow - em, high1 = pltrNow + em;
  const strike = 120;
  const barW = W - 2 * pad;
  const rangeMin = 70, rangeMax = 210;
  const toBarX = (v) => pad + ((v - rangeMin) / (rangeMax - rangeMin)) * barW;

  return (
    <div>
      <B>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#00d4aa", marginBottom: 4 }}>The Bell Curve = Your Options Chain</div>
        <div style={{ fontSize: 12, color: "#888", marginBottom: 12 }}>Every stock's price movement follows a probability distribution. Standard deviation tells you where the boundaries are.</div>
        <svg width={W} height={H} style={{ display: "block", margin: "0 auto" }}>
          <path d={fill1D} fill="#00d4aa" opacity={0.25} />
          <path d={fill2aD} fill="#4fc3f7" opacity={0.15} />
          <path d={fill2bD} fill="#4fc3f7" opacity={0.15} />
          <path d={pathD} fill="none" stroke="#00d4aa" strokeWidth={2.5} />
          <line x1={sx(0)} y1={sy(0)} x2={sx(0)} y2={sy(maxY)} stroke="#555" strokeDasharray="4,4" />
          {[-1, 1].map(v => <line key={v} x1={sx(v)} y1={sy(0)} x2={sx(v)} y2={sy(0.24)} stroke="#00d4aa" strokeDasharray="3,3" opacity={0.6} />)}
          {[-2, 2].map(v => <line key={v} x1={sx(v)} y1={sy(0)} x2={sx(v)} y2={sy(0.054)} stroke="#4fc3f7" strokeDasharray="3,3" opacity={0.6} />)}
          <text x={sx(0)} y={H - 8} textAnchor="middle" fill="#888" fontSize={11}>PLTR $137.50</text>
          <text x={sx(-1)} y={H - 8} textAnchor="middle" fill="#00d4aa" fontSize={10}>-1σ</text>
          <text x={sx(1)} y={H - 8} textAnchor="middle" fill="#00d4aa" fontSize={10}>+1σ</text>
          <text x={sx(-2)} y={H - 8} textAnchor="middle" fill="#4fc3f7" fontSize={10}>-2σ</text>
          <text x={sx(2)} y={H - 8} textAnchor="middle" fill="#4fc3f7" fontSize={10}>+2σ</text>
          <text x={sx(0)} y={sy(0.2)} textAnchor="middle" fill="#00d4aa" fontSize={13} fontWeight={700}>68%</text>
          <text x={sx(-1.5)} y={sy(0.08)} textAnchor="middle" fill="#4fc3f7" fontSize={10}>13.5%</text>
          <text x={sx(1.5)} y={sy(0.08)} textAnchor="middle" fill="#4fc3f7" fontSize={10}>13.5%</text>
          {/* $120 put marker */}
          <line x1={sx(-1.15)} y1={sy(0)} x2={sx(-1.15)} y2={sy(0.21)} stroke="#ff6b6b" strokeWidth={2} />
          <text x={sx(-1.15)} y={sy(0.22)} textAnchor="middle" fill="#ff6b6b" fontSize={10} fontWeight={700}>$120 PUT</text>
          <text x={sx(-1.15)} y={sy(0.26)} textAnchor="middle" fill="#ff6b6b" fontSize={9}>20Δ at entry</text>
          {/* 16Δ boundary label */}
          <text x={sx(-1)} y={sy(0.28)} textAnchor="middle" fill="#888" fontSize={8}>← 16Δ = exact 1σ</text>
        </svg>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
          {[["1σ = 68%", "#00d4aa", "Stock stays within ±$48"], ["2σ = 95%", "#4fc3f7", "Stock stays within ±$97"], ["3σ = 99.7%", "#ffab40", "Almost never breached"]].map(([t, c, d], i) => (
            <div key={i} style={{ textAlign: "center", padding: 8, background: "#0d1117", borderRadius: 6 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: c }}>{t}</div>
              <div style={{ fontSize: 10, color: "#666" }}>{d}</div>
            </div>
          ))}
        </div>
      </B>
      <B>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#ffab40", marginBottom: 4 }}>Expected Move Formula</div>
        <div style={{ textAlign: "center", padding: 14, background: "#0d1117", borderRadius: 8, marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>FORMULA</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Stock Price × IV × √(DTE / 365)</div>
          <div style={{ fontSize: 13, color: "#ffab40", marginTop: 6 }}>$137.50 × 64.6% × √(108/365) = <strong style={{ fontSize: 18 }}>±$48.34</strong></div>
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 8 }}>PLTR Expected Range by July 17</div>
        <svg width={W} height={80} style={{ display: "block", margin: "0 auto" }}>
          <rect x={toBarX(rangeMin)} y={30} width={barW} height={20} rx={4} fill="#222" />
          <rect x={toBarX(low1)} y={30} width={toBarX(high1) - toBarX(low1)} height={20} rx={4} fill="#00d4aa33" stroke="#00d4aa" strokeWidth={1} />
          <line x1={toBarX(pltrNow)} y1={25} x2={toBarX(pltrNow)} y2={55} stroke="#fff" strokeWidth={2} />
          <line x1={toBarX(strike)} y1={20} x2={toBarX(strike)} y2={58} stroke="#ff6b6b" strokeWidth={2} strokeDasharray="4,3" />
          <circle cx={toBarX(strike)} cy={40} r={5} fill="#ff6b6b" />
          <text x={toBarX(low1)} y={22} textAnchor="middle" fill="#00d4aa" fontSize={11} fontWeight={700}>${low1.toFixed(0)}</text>
          <text x={toBarX(pltrNow)} y={22} textAnchor="middle" fill="#fff" fontSize={11} fontWeight={700}>${pltrNow}</text>
          <text x={toBarX(high1)} y={22} textAnchor="middle" fill="#00d4aa" fontSize={11} fontWeight={700}>${high1.toFixed(0)}</text>
          <text x={toBarX(strike)} y={72} textAnchor="middle" fill="#ff6b6b" fontSize={11} fontWeight={700}>$120 PUT</text>
          <text x={toBarX(low1 - 5)} y={45} textAnchor="end" fill="#888" fontSize={9}>Profitable zone →</text>
        </svg>
        <div style={{ fontSize: 11, color: "#666", textAlign: "center", marginTop: 4 }}>Your $120 put profits if PLTR drops below $120. It's inside the 1σ range — a ~20% probability bet at entry.</div>
      </B>
    </div>
  );
}

/* ───── CHUNK 2: Delta = ITM% ───── */
function Chunk2() {
  const W = 700, H = 200, pad = 50;
  const deltaStops = [
    { d: 0, label: "0Δ", desc: "0% chance ITM", color: "#555" },
    { d: 16, label: "16Δ", desc: "1σ boundary", color: "#4fc3f7" },
    { d: 20, label: "20Δ", desc: "YOUR ENTRY", color: "#ffab40", highlight: true },
    { d: 35, label: "35Δ", desc: "YOU NOW", color: "#00d4aa", highlight: true },
    { d: 50, label: "50Δ", desc: "ATM (coin flip)", color: "#fff" },
    { d: 100, label: "100Δ", desc: "100% ITM", color: "#555" },
  ];
  const toX = (d) => pad + (d / 100) * (W - 2 * pad);

  return (
    <div>
      <B>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#4fc3f7", marginBottom: 4 }}>Delta IS ITM% — Same Number, Different Label</div>
        <div style={{ fontSize: 12, color: "#888", marginBottom: 14 }}>In Tastytrade, the "ITM%" column is delta. It tells you the probability your option expires in the money.</div>
        <svg width={W} height={H} style={{ display: "block", margin: "0 auto" }}>
          {/* Track */}
          <rect x={pad} y={80} width={W - 2 * pad} height={8} rx={4} fill="#222" />
          {/* Progress fill from 20 to 35 */}
          <rect x={toX(20)} y={80} width={toX(35) - toX(20)} height={8} rx={4} fill="#00d4aa" />
          {/* Arrow */}
          <defs><marker id="arw" markerWidth={8} markerHeight={8} refX={4} refY={4} orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#00d4aa" /></marker></defs>
          <line x1={toX(20)} y1={68} x2={toX(33)} y2={68} stroke="#00d4aa" strokeWidth={2} markerEnd="url(#arw)" />
          <text x={(toX(20) + toX(35)) / 2} y={62} textAnchor="middle" fill="#00d4aa" fontSize={11} fontWeight={700}>+15Δ gain = +$240</text>
          {/* Stops */}
          {deltaStops.map((s, i) => (
            <g key={i}>
              <line x1={toX(s.d)} y1={75} x2={toX(s.d)} y2={95} stroke={s.color} strokeWidth={s.highlight ? 3 : 1} />
              <circle cx={toX(s.d)} cy={84} r={s.highlight ? 6 : 3} fill={s.color} />
              <text x={toX(s.d)} y={112} textAnchor="middle" fill={s.color} fontSize={12} fontWeight={700}>{s.label}</text>
              <text x={toX(s.d)} y={126} textAnchor="middle" fill={s.color === "#555" ? "#444" : s.color} fontSize={9}>{s.desc}</text>
            </g>
          ))}
          {/* Labels */}
          <text x={pad} y={150} fill="#888" fontSize={10}>Deep OTM</text>
          <text x={W - pad} y={150} textAnchor="end" fill="#888" fontSize={10}>Deep ITM</text>
          <text x={toX(50)} y={150} textAnchor="middle" fill="#666" fontSize={10}>At The Money</text>
        </svg>
      </B>
      <B>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Delta as a Dollar Multiplier</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{ padding: 14, background: "#0d1117", borderRadius: 8, borderLeft: "3px solid #ffab40" }}>
            <div style={{ fontSize: 11, color: "#888" }}>At Entry (20Δ)</div>
            <div style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>PLTR drops $1 →</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#ffab40" }}>+$0.20</div>
            <div style={{ fontSize: 10, color: "#666" }}>per share ($20 per contract)</div>
          </div>
          <div style={{ padding: 14, background: "#0d1117", borderRadius: 8, borderLeft: "3px solid #00d4aa" }}>
            <div style={{ fontSize: 11, color: "#888" }}>Now (35Δ)</div>
            <div style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>PLTR drops $1 →</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#00d4aa" }}>+$0.35</div>
            <div style={{ fontSize: 10, color: "#666" }}>per share ($35 per contract)</div>
          </div>
        </div>
        <div style={{ fontSize: 11, color: "#888", marginTop: 8, textAlign: "center" }}>Your option is now 75% more responsive to price movement in your favor</div>
      </B>
    </div>
  );
}

/* ───── CHUNK 3: IVR vs IVx ───── */
function Chunk3() {
  const W = 700, H = 130, pad = 50;
  const barTop = 40, barH = 30;
  const toX = (v) => pad + (v / 100) * (W - 2 * pad);

  return (
    <div>
      <B>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#e040fb", marginBottom: 4 }}>IVR vs IVx — The Thermometer</div>
        <div style={{ fontSize: 12, color: "#888", marginBottom: 14 }}>IVx is the raw temperature. IVR tells you if that temperature is normal for THIS stock.</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          <div style={{ padding: 14, background: "#0d1117", borderRadius: 8, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#888" }}>IVx (Raw IV)</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#e040fb" }}>64.6%</div>
            <div style={{ fontSize: 11, color: "#666" }}>Sounds high... but is it?</div>
          </div>
          <div style={{ padding: 14, background: "#0d1117", borderRadius: 8, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#888" }}>IVR (Percentile Rank)</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#4fc3f7" }}>24</div>
            <div style={{ fontSize: 11, color: "#666" }}>Actually LOW for PLTR!</div>
          </div>
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 6 }}>PLTR IVR — Where 64% IV sits in the 52-week range</div>
        <svg width={W} height={H} style={{ display: "block", margin: "0 auto" }}>
          <defs>
            <linearGradient id="ivrGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00d4aa" /><stop offset="50%" stopColor="#ffab40" /><stop offset="100%" stopColor="#ff6b6b" />
            </linearGradient>
          </defs>
          <rect x={pad} y={barTop} width={W - 2 * pad} height={barH} rx={6} fill="url(#ivrGrad)" opacity={0.3} />
          <rect x={pad} y={barTop} width={(24 / 100) * (W - 2 * pad)} height={barH} rx={6} fill="#4fc3f7" opacity={0.6} />
          {/* PLTR marker */}
          <line x1={toX(24)} y1={barTop - 5} x2={toX(24)} y2={barTop + barH + 5} stroke="#4fc3f7" strokeWidth={3} />
          <text x={toX(24)} y={barTop - 10} textAnchor="middle" fill="#4fc3f7" fontSize={12} fontWeight={700}>PLTR: 24</text>
          {/* Scanner stock marker */}
          <line x1={toX(93.9)} y1={barTop - 5} x2={toX(93.9)} y2={barTop + barH + 5} stroke="#ff6b6b" strokeWidth={3} />
          <text x={toX(93.9)} y={barTop - 10} textAnchor="middle" fill="#ff6b6b" fontSize={12} fontWeight={700}>Scanner: 93.9</text>
          {/* Labels */}
          <text x={pad} y={barTop + barH + 20} fill="#00d4aa" fontSize={10}>0 = IV at 52wk LOW</text>
          <text x={toX(50)} y={barTop + barH + 20} textAnchor="middle" fill="#ffab40" fontSize={10}>50 = Middle</text>
          <text x={W - pad} y={barTop + barH + 20} textAnchor="end" fill="#ff6b6b" fontSize={10}>100 = IV at 52wk HIGH</text>
          <text x={pad} y={barTop + barH + 36} fill="#888" fontSize={10}>Cheap options (good for buyers)</text>
          <text x={W - pad} y={barTop + barH + 36} textAnchor="end" fill="#888" fontSize={10}>Expensive options (good for sellers)</text>
        </svg>
      </B>
      <B style={{ borderLeft: "3px solid #00d4aa" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#00d4aa", marginBottom: 4 }}>What This Means for You</div>
        <div style={{ fontSize: 12, color: "#aaa", lineHeight: 1.7 }}>You BOUGHT your put when IVR was low = options were relatively cheap for PLTR. If IV expands from here (market gets more uncertain), vega will push your option value UP on top of any delta gains. You're in a good spot as a buyer.</div>
      </B>
    </div>
  );
}

/* ───── CHUNK 4: The Greeks ───── */
function Chunk4() {
  const W = 700, H = 180, pad = 50;
  // Theta decay curve points
  const thetaPts = [];
  for (let dte = 120; dte >= 0; dte -= 1) {
    const tv = Math.pow(dte / 120, 0.55) * 100;
    thetaPts.push({ dte, tv });
  }
  const toX = (dte) => pad + ((120 - dte) / 120) * (W - 2 * pad);
  const toY = (tv) => pad + ((100 - tv) / 100) * (H - 2 * pad);
  const tPath = thetaPts.map((p, i) => `${i === 0 ? "M" : "L"}${toX(p.dte).toFixed(1)},${toY(p.tv).toFixed(1)}`).join(" ");

  return (
    <div>
      <B>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#4fc3f7", marginBottom: 10 }}>The Greeks — Your Option's Vital Signs</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
          {[
            ["Δ Delta", "#00d4aa", "35", "Speed", "How much option moves per $1 stock move", "Your put gains $0.35 when PLTR drops $1"],
            ["Θ Theta", "#ff6b6b", "-$3/day", "Decay", "Daily cost of holding (time erosion)", "You pay ~$3/day at 108 DTE — manageable"],
            ["Γ Gamma", "#e040fb", "Accel", "Acceleration", "How fast delta changes on big moves", "Can make 50Δ jump to 75Δ on a spike"],
          ].map(([name, color, val, role, desc, yours], i) => (
            <div key={i} style={{ padding: 12, background: "#0d1117", borderRadius: 8, borderTop: `3px solid ${color}` }}>
              <div style={{ fontSize: 14, fontWeight: 700, color }}>{name}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: "4px 0" }}>{val}</div>
              <div style={{ fontSize: 10, color: "#888", fontWeight: 700, marginBottom: 4 }}>{role}</div>
              <div style={{ fontSize: 10, color: "#666" }}>{desc}</div>
              <div style={{ fontSize: 10, color, marginTop: 6, borderTop: "1px solid #222", paddingTop: 4 }}>{yours}</div>
            </div>
          ))}
        </div>
      </B>
      <B>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#ff6b6b", marginBottom: 4 }}>Theta Decay Curve — Time Is Money (Literally)</div>
        <div style={{ fontSize: 11, color: "#888", marginBottom: 8 }}>The curve is NOT linear. It's flat early, then goes vertical in the last 30 days.</div>
        <svg width={W} height={H} style={{ display: "block", margin: "0 auto" }}>
          {/* Danger zone */}
          <rect x={toX(45)} y={pad} width={toX(0) - toX(45)} height={H - 2 * pad} fill="#ff6b6b" opacity={0.07} rx={4} />
          <rect x={toX(30)} y={pad} width={toX(0) - toX(30)} height={H - 2 * pad} fill="#ff6b6b" opacity={0.07} rx={4} />
          <text x={toX(15)} y={pad + 14} textAnchor="middle" fill="#ff6b6b" fontSize={9} fontWeight={700}>DANGER ZONE</text>
          {/* Safe zone */}
          <rect x={pad} y={pad} width={toX(60) - pad} height={H - 2 * pad} fill="#00d4aa" opacity={0.05} rx={4} />
          <text x={toX(100)} y={pad + 14} textAnchor="middle" fill="#00d4aa" fontSize={9} fontWeight={700}>SAFE ZONE</text>
          {/* Curve */}
          <path d={tPath} fill="none" stroke="#ff6b6b" strokeWidth={2.5} />
          {/* You are here */}
          <circle cx={toX(108)} cy={toY(Math.pow(108 / 120, 0.55) * 100)} r={7} fill="#4fc3f7" stroke="#fff" strokeWidth={2} />
          <text x={toX(108) + 12} y={toY(Math.pow(108 / 120, 0.55) * 100) + 4} fill="#4fc3f7" fontSize={11} fontWeight={700}>YOU: 108 DTE</text>
          {/* X labels */}
          {[120, 90, 60, 45, 30, 15, 0].map(d => (
            <text key={d} x={toX(d)} y={H - 8} textAnchor="middle" fill="#666" fontSize={9}>{d}</text>
          ))}
          <text x={W / 2} y={H} textAnchor="middle" fill="#888" fontSize={10}>Days to Expiration →</text>
          <text x={pad - 5} y={pad + 4} textAnchor="end" fill="#888" fontSize={9}>100%</text>
          <text x={pad - 5} y={H - pad} textAnchor="end" fill="#888" fontSize={9}>0%</text>
        </svg>
        <div style={{ fontSize: 11, color: "#888", textAlign: "center", marginTop: 4 }}>Ed says: stay above 60 DTE to avoid the steep part of the curve</div>
      </B>
      <B>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#e040fb", marginBottom: 6 }}>Still to Learn</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div style={{ padding: 10, background: "#0d1117", borderRadius: 6, border: "1px solid #333" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#ffab40" }}>Vega (ν)</div>
            <div style={{ fontSize: 11, color: "#888" }}>IV sensitivity. Explains why friend's MSTR call went UP 9% when stock dropped 3.3%</div>
          </div>
          <div style={{ padding: 10, background: "#0d1117", borderRadius: 6, border: "1px solid #333" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#ffab40" }}>Rho (ρ)</div>
            <div style={{ fontSize: 11, color: "#888" }}>Interest rate sensitivity. Ties to Ed's TLT thesis and Fed rate policy</div>
          </div>
        </div>
      </B>
    </div>
  );
}

/* ───── CHUNK 5: Charting Fundamentals ───── */
function Chunk5() {
  return (
    <div>
      <B>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#e040fb", marginBottom: 10 }}>Ed's Charting Toolkit — 4 Indicators</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            ["Support & Resistance", "#00d4aa", "complete", "Connect multiple candle tops/bottoms — NOT through the middle. Forms the floor and ceiling of price movement.", "PLTR 3-year weekly chart", "━━━━━ S&R lines must touch\n          multiple candle endpoints"],
            ["Moving Averages", "#4fc3f7", "complete", "20-day (fast) and 50-day (slow). When 20 crosses BELOW 50 = bearish 'death cross.' Price below both = strong bearish signal.", "20MA below 50MA = bearish", "📉 20MA ╲\n          ─── 50MA ──── inverted = puts"],
            ["RSI", "#ffab40", "complete", "Relative Strength Index. PLTR at 44% = 55% of market outperforming it. Watch the TREND, not just the number.", "Bounced off 40% low", "📊 RSI Trend ↗ = stock turning\n          RSI Trend ↘ = stock weakening"],
            ["Volume & A/D", "#e040fb", "complete", "Compare volume to its AVERAGE. Accumulation/Distribution: trend > number. Bar display, length 4.75.", "Yellow bars = below avg", "📊 Volume vs Avg matters\n          not raw volume alone"],
          ].map(([name, color, status, desc, note, visual], i) => (
            <div key={i} style={{ padding: 14, background: "#0d1117", borderRadius: 8, borderLeft: `3px solid ${color}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color }}>{name}</div>
                <div style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "#00d4aa22", color: "#00d4aa" }}>✓ learned</div>
              </div>
              <div style={{ fontSize: 11, color: "#aaa", lineHeight: 1.6, marginBottom: 6 }}>{desc}</div>
              <div style={{ fontSize: 10, color: "#666", fontStyle: "italic" }}>{note}</div>
            </div>
          ))}
        </div>
      </B>
      <B>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#ffab40", marginBottom: 8 }}>Still to Learn — Ed's Priority Patterns</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[
            ["Descending Triangle", "#ff6b6b", "Downtrend continuation", "Flat support + falling resistance → breakdown. Ed showed on PLTR."],
            ["Cup with Handle", "#00d4aa", "Uptrend signal", "U-shape recovery + small dip → breakout. NEO showed this pattern."],
            ["Head & Shoulders", "#4fc3f7", "Most powerful reversal", "Three peaks, middle highest → strong downtrend reversal signal."],
          ].map(([name, color, type, desc], i) => (
            <div key={i} style={{ padding: 12, background: "#0d1117", borderRadius: 8, borderTop: `3px solid ${color}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color }}>{name}</div>
              <div style={{ fontSize: 10, color: "#888", marginBottom: 4 }}>{type}</div>
              <div style={{ fontSize: 10, color: "#666" }}>{desc}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "#888", marginTop: 8 }}>Ed: "Ask Claude to teach you these and memorize them."</div>
      </B>
    </div>
  );
}

/* ───── CHUNK 6: Market Makers & Flow ───── */
function Chunk6() {
  const W = 700;
  return (
    <div>
      <B>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#b388ff", marginBottom: 10 }}>How Market Makers Work</div>
        <div style={{ position: "relative", padding: "0 20px" }}>
          {/* Flow diagram */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            {[
              ["You Buy\nPLTR Put", "#4fc3f7"],
              ["No Natural\nSeller?", "#ffab40"],
              ["Market Maker\nTakes Other Side", "#b388ff"],
              ["MM Rebalances\nto Stay Neutral", "#00d4aa"],
              ["Volatility\nSuppressed", "#00d4aa"],
            ].map(([label, color], i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 100, textAlign: "center", padding: "12px 6px", background: "#0d1117", borderRadius: 8, border: `1px solid ${color}44`, fontSize: 11, color, fontWeight: 600, whiteSpace: "pre-line", lineHeight: 1.4 }}>
                  {label}
                </div>
                {i < 4 && <div style={{ fontSize: 18, color: "#444" }}>→</div>}
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: "center", padding: 10, background: "#b388ff11", borderRadius: 6, fontSize: 12, color: "#aaa" }}>
          <strong style={{ color: "#b388ff" }}>Goal:</strong> 100% delta neutral. Equal puts to calls = delta zero. They profit from the spread, not direction.
        </div>
      </B>
      <B>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 8 }}>PLTR Flow Data (from Unusual Whales Scanner)</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
          {[
            ["Net Gamma", "+87.6M", "#00d4aa", "Dealers LONG gamma = volatility suppressed, mean-reverting"],
            ["Call Gamma", "271M", "#4fc3f7", "Bullish flow outweighs bearish"],
            ["Put Gamma", "-183M", "#ff6b6b", "Put volume present but smaller"],
          ].map(([label, val, color, desc], i) => (
            <div key={i} style={{ padding: 12, background: "#0d1117", borderRadius: 8, textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "#888" }}>{label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color }}>{val}</div>
              <div style={{ fontSize: 9, color: "#666", marginTop: 4 }}>{desc}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div style={{ padding: 10, background: "#0d1117", borderRadius: 6 }}>
            <div style={{ fontSize: 11, color: "#888" }}>Net Delta</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#4fc3f7" }}>+25.5B</div>
            <div style={{ fontSize: 10, color: "#666" }}>Burst of orders forced MMs to buy to catch up</div>
          </div>
          <div style={{ padding: 10, background: "#0d1117", borderRadius: 6 }}>
            <div style={{ fontSize: 11, color: "#888" }}>Premium Flow</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#00d4aa" }}>Calls 94K vs Puts -4K</div>
            <div style={{ fontSize: 10, color: "#666" }}>Currently bullish sentiment but call screener is thin</div>
          </div>
        </div>
      </B>
      <B style={{ borderLeft: "3px solid #ffab40" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#ffab40", marginBottom: 4 }}>Ed's Signal</div>
        <div style={{ fontSize: 12, color: "#aaa" }}>When the call screener becomes a "full page" of calls again = market turning bullish. Right now it's thin (Brazilian ETF, AMD, NEO only).</div>
      </B>
    </div>
  );
}

/* ───── CHUNK 7: Risk Management ───── */
function Chunk7() {
  const W = 700, pad = 50;
  const acct = 1000;
  const rules = [
    { pct: 30, label: "30% Rule Max", color: "#ff6b6b", val: 300 },
    { pct: 63.5, label: "Your PLTR Put", color: "#ffab40", val: 635 },
    { pct: 3, label: "Ed's Target", color: "#00d4aa", val: 30 },
  ];

  return (
    <div>
      <B>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#ff6b6b", marginBottom: 10 }}>The Rules That Keep You Alive</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
          {[
            ["30% Rule", "#ff6b6b", "Max 30% of account on one trade", "1σ = 30% of the time it goes against you. Ed's hard limit."],
            ["3% Target", "#00d4aa", "Ed's ideal per-trade allocation", "Many small ~$200 bets at 20Δ. Let probability work over many trades."],
            ["Stop Losses", "#4fc3f7", "Mandatory on EVERY position", "Ed's AAPL calls stopped out 3/31. System worked as designed."],
          ].map(([name, color, sub, desc], i) => (
            <div key={i} style={{ padding: 14, background: "#0d1117", borderRadius: 8, borderTop: `3px solid ${color}` }}>
              <div style={{ fontSize: 14, fontWeight: 700, color }}>{name}</div>
              <div style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>{sub}</div>
              <div style={{ fontSize: 10, color: "#666", marginTop: 6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </B>
      <B>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Your Account Allocation</div>
        <div style={{ marginBottom: 8 }}>
          {rules.map((r, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                <span style={{ color: r.color, fontWeight: 700 }}>{r.label}</span>
                <span style={{ color: "#888" }}>${r.val} ({r.pct}%)</span>
              </div>
              <div style={{ height: 16, borderRadius: 4, background: "#222", position: "relative", overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 4, background: r.color, width: `${r.pct}%`, opacity: 0.7 }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: "#ffab4012", borderRadius: 6, padding: 10, fontSize: 11, color: "#aaa" }}>
          <strong style={{ color: "#ffab40" }}>Note:</strong> Your $635 trade = 63.5% of the $1,000 account. That's above Ed's 30% rule, but it's your first trade on a small account. As the account grows, sizing should move toward 3% per position.
        </div>
      </B>
      <B>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#4fc3f7", marginBottom: 8 }}>Bracket Order — The Complete Exit</div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, padding: 10 }}>
          {[
            ["TAKE PROFIT", "$9.53", "#00d4aa", "Limit Sell", "+50%"],
            ["YOUR ENTRY", "$6.35", "#4fc3f7", "Bought Put", "Cost basis"],
            ["STOP LOSS", "$3.18", "#ff6b6b", "Stop Sell", "-50%"],
          ].map(([label, price, color, type, pct], i) => (
            <div key={i} style={{ textAlign: "center", padding: 14, background: "#0d1117", borderRadius: 8, border: `1px solid ${color}33`, flex: 1 }}>
              <div style={{ fontSize: 9, color: "#888", fontWeight: 700 }}>{label}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color }}>{price}</div>
              <div style={{ fontSize: 10, color: "#666" }}>{type}</div>
              <div style={{ fontSize: 10, color, marginTop: 4 }}>{pct}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", fontSize: 11, color: "#888", marginTop: 6 }}>OCO: when one fills, the other auto-cancels. Set it and walk away.</div>
      </B>
    </div>
  );
}

/* ───── CHUNK 8: Shorting vs Buying Puts ───── */
function Chunk8() {
  const rows = [
    ["How it works", "Borrow → Sell → Buy back → Return", "Buy put contract → Sell to close", "#fff"],
    ["Max Loss", "UNLIMITED ∞", "$635 (your premium)", "#ff6b6b"],
    ["Capital Needed", "~$6,875 (50% margin)", "$635", "#ffab40"],
    ["If PLTR → $200", "-$6,250", "-$635", "#ff6b6b"],
    ["If PLTR → $300", "-$16,250", "-$635", "#ff6b6b"],
    ["If PLTR → $100", "+$3,750", "+$1,365", "#00d4aa"],
    ["Time Decay", "None (no expiry)", "Against you daily", "#4fc3f7"],
    ["Complexity", "Margin account required", "Any account", "#888"],
  ];
  return (
    <div>
      <B>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#ff6b6b", marginBottom: 4 }}>Short Stock vs Buy Put — Side by Side</div>
        <div style={{ fontSize: 12, color: "#888", marginBottom: 12 }}>You almost accidentally placed a -100 share short order today. Here's why that would have been dangerous.</div>
        <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid #30363d" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 2fr 2fr", background: "#0d1117", padding: "8px 12px", borderBottom: "1px solid #30363d" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#888" }}>METRIC</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#ff6b6b", textAlign: "center" }}>SHORT 100 SHARES</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#00d4aa", textAlign: "center" }}>BUY PUT (YOU)</span>
          </div>
          {rows.map(([metric, short, put, color], i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1.5fr 2fr 2fr", padding: "8px 12px", borderBottom: i < rows.length - 1 ? "1px solid #1a1f26" : "none", background: i % 2 ? "#0d1117" : "transparent" }}>
              <span style={{ fontSize: 11, color: "#888" }}>{metric}</span>
              <span style={{ fontSize: 11, color: short.includes("UNLIMITED") || short.includes("-$") ? "#ff6b6b" : "#aaa", textAlign: "center", fontWeight: short.includes("UNLIMITED") ? 700 : 400 }}>{short}</span>
              <span style={{ fontSize: 11, color: put.includes("+") ? "#00d4aa" : "#aaa", textAlign: "center" }}>{put}</span>
            </div>
          ))}
        </div>
      </B>
      <B>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Risk Visualization: What Happens if PLTR Goes UP</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, justifyContent: "center", padding: "10px 0" }}>
          {[
            ["$150", 625, 635], ["$175", 3750, 635], ["$200", 6250, 635], ["$250", 11250, 635], ["$300", 16250, 635],
          ].map(([price, shortLoss, putLoss], i) => {
            const maxH = 120;
            const sH = Math.min((shortLoss / 16250) * maxH, maxH);
            const pH = (putLoss / 16250) * maxH;
            return (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: maxH, marginBottom: 4 }}>
                  <div style={{ width: 24, height: sH, background: "#ff6b6b", borderRadius: "4px 4px 0 0", position: "relative" }}>
                    <div style={{ position: "absolute", top: -16, left: "50%", transform: "translateX(-50%)", fontSize: 8, color: "#ff6b6b", whiteSpace: "nowrap" }}>${(shortLoss / 1000).toFixed(1)}K</div>
                  </div>
                  <div style={{ width: 24, height: Math.max(pH, 4), background: "#00d4aa", borderRadius: "4px 4px 0 0" }} />
                </div>
                <div style={{ fontSize: 10, color: "#888" }}>PLTR {price}</div>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 12, height: 12, borderRadius: 2, background: "#ff6b6b" }} /><span style={{ fontSize: 11, color: "#888" }}>Short Stock Loss</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 12, height: 12, borderRadius: 2, background: "#00d4aa" }} /><span style={{ fontSize: 11, color: "#888" }}>Put Loss (capped at $635)</span></div>
        </div>
      </B>
    </div>
  );
}

/* ───── CHUNK 9: Your Position Now ───── */
function Chunk9() {
  return (
    <div>
      <B style={{ border: "1px solid #4fc3f755" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>PLTR $120 PUT — July 17, 2026</div>
            <div style={{ fontSize: 12, color: "#4fc3f7" }}>LONG (bought) · 108 DTE remaining</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#00d4aa" }}>+$240</div>
            <div style={{ fontSize: 12, color: "#00d4aa" }}>+38% P/L</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
          {[
            ["Entry", "$6.35", "#4fc3f7"], ["Current", "~$8.75", "#00d4aa"], ["Cash", "$363.88", "#888"], ["Net Liq", "$1,238.88", "#00d4aa"],
          ].map(([l, v, c], i) => (
            <div key={i} style={{ textAlign: "center", padding: 10, background: "#0d1117", borderRadius: 6 }}>
              <div style={{ fontSize: 10, color: "#888" }}>{l}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: c }}>{v}</div>
            </div>
          ))}
        </div>
      </B>
      <B>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Position Health Dashboard</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[
            ["Delta (ITM%)", "35Δ", "#00d4aa", "Up from 20Δ ✓", "35% chance of expiring ITM"],
            ["Theta Burn", "~$3/day", "#ffab40", "108 DTE = safe zone", "Accelerates below 60 DTE"],
            ["IVR", "24", "#4fc3f7", "Low = cheap entry ✓", "Room for IV expansion"],
            ["DTE", "108 days", "#00d4aa", "Well above 60 DTE ✓", "Safe from theta cliff"],
            ["Profit Target", "$9.53 (+50%)", "#00d4aa", "Currently at ~$8.75", "Almost there — talk to Ed"],
            ["Stop Loss", "$3.18 (-50%)", "#ff6b6b", "Not yet set!", "Set bracket order ASAP"],
          ].map(([label, val, color, status, desc], i) => (
            <div key={i} style={{ padding: 12, background: "#0d1117", borderRadius: 8, borderLeft: `3px solid ${color}` }}>
              <div style={{ fontSize: 11, color: "#888" }}>{label}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color, margin: "2px 0" }}>{val}</div>
              <div style={{ fontSize: 10, color: status.includes("✓") ? "#00d4aa" : status.includes("!") ? "#ff6b6b" : "#888" }}>{status}</div>
              <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>{desc}</div>
            </div>
          ))}
        </div>
      </B>
      <B>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Account Math Proof (Why This is LONG, Not Short)</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
          {[
            ["$1,000", "Starting", "#888"],
            ["−", "", "#888"],
            ["$635", "Put Cost", "#ff6b6b"],
            ["=", "", "#888"],
            ["$365", "Cash Left", "#ffab40"],
            ["+", "", "#888"],
            ["$875", "Put Value", "#00d4aa"],
            ["=", "", "#888"],
            ["$1,240", "Net Liq", "#00d4aa"],
          ].map(([val, label, color], i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: val.length <= 1 ? 18 : 20, fontWeight: 700, color }}>{val}</div>
              {label && <div style={{ fontSize: 9, color: "#666" }}>{label}</div>}
            </div>
          ))}
        </div>
      </B>
    </div>
  );
}

/* ───── CHUNK 10: Macro View + BlackRock ───── */
function Chunk10() {
  const alignments = [
    ["Go neutral on equities", "Stepping aside from trading", "#ff6b6b"],
    ["Buy gold for inflation hedge", "Long GLD and SLV", "#ffab40"],
    ["Short equity exposure", "Brandon's PLTR put is bearish", "#4fc3f7"],
    ["Inflation risk rising", "TLT short (rates higher longer)", "#e040fb"],
    ["Thematic investing", "Focus on cybersecurity (NET)", "#00d4aa"],
    ["Oil could hit $150/barrel", "Energy disruption = market pressure", "#ff6b6b"],
  ];

  return (
    <div>
      <B>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#ff6b6b", marginBottom: 4 }}>The Big Picture — Why Ed Is Stepping Aside</div>
        <div style={{ fontSize: 12, color: "#888", marginBottom: 12 }}>BlackRock (world's largest asset manager, $10T+) just confirmed Ed's exact thesis.</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          <div style={{ padding: 14, background: "#0d1117", borderRadius: 8, borderTop: "3px solid #ff6b6b" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#ff6b6b", marginBottom: 4 }}>BlackRock's Warning (3/26)</div>
            <div style={{ fontSize: 11, color: "#aaa", lineHeight: 1.6 }}>
              Wei Li: Equities mispricing energy risk. Moved to neutral.<br />
              Kapito: GDP hit up to 2pts. Oil could hit $150 even after ceasefire.<br />
              Strategy: Thematic investing, not broad market bets.
            </div>
          </div>
          <div style={{ padding: 14, background: "#0d1117", borderRadius: 8, borderTop: "3px solid #ffab40" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#ffab40", marginBottom: 4 }}>Ed's View (3/31)</div>
            <div style={{ fontSize: 11, color: "#aaa", lineHeight: 1.6 }}>
              Bear market rally bounce — not a real recovery.<br />
              Call screener thin = low conviction.<br />
              AAPL calls stopped out today. Sitting on sidelines.<br />
              Focus: GLD long, TLT short, selective puts.
            </div>
          </div>
        </div>
      </B>
      <B>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 10 }}>BlackRock ↔ Ed Alignment</div>
        {alignments.map(([blackrock, ed, color], i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 8, alignItems: "center", marginBottom: 6 }}>
            <div style={{ padding: "6px 10px", background: "#0d1117", borderRadius: 6, fontSize: 11, color: "#aaa", textAlign: "right" }}>{blackrock}</div>
            <div style={{ width: 30, height: 30, borderRadius: 15, background: `${color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color, flexShrink: 0 }}>↔</div>
            <div style={{ padding: "6px 10px", background: "#0d1117", borderRadius: 6, fontSize: 11, color, fontWeight: 600 }}>{ed}</div>
          </div>
        ))}
      </B>
      <B>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#00d4aa", marginBottom: 8 }}>Cloudflare (NET) — The Bright Spot</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6 }}>
          {[
            ["Price", "$206.34", "#fff"], ["Rev Growth", "+34% YoY", "#00d4aa"], ["EPS Beat", "+64.7%", "#00d4aa"], ["Analyst", "Buy $237", "#4fc3f7"],
            ["Beta", "2.03", "#ffab40"], ["Earnings", "May 7", "#e040fb"], ["IVR to Watch", "Pre-earnings", "#ff6b6b"], ["Sector", "Cyber ↑", "#00d4aa"],
          ].map(([l, v, c], i) => (
            <div key={i} style={{ padding: 8, background: "#0d1117", borderRadius: 6, textAlign: "center" }}>
              <div style={{ fontSize: 9, color: "#666" }}>{l}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: c }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "#888", marginTop: 8 }}>Even in a cautious macro environment, stocks with real earnings growth (like NET) may outperform. Watch IVR heading into May 7 earnings.</div>
      </B>
    </div>
  );
}

const chunks = [Chunk1, Chunk2, Chunk3, Chunk4, Chunk5, Chunk6, Chunk7, Chunk8, Chunk9, Chunk10];

export default function VisualChunks() {
  const [chunk, setChunk] = useState(0);
  const Comp = chunks[chunk];
  return (
    <div style={{ background: "#0d1117", color: "#e0e0e0", minHeight: "100vh", padding: 20, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: 0 }}>Go Maz — Visual Learning Chunks</h1>
          <span style={{ fontSize: 12, color: "#555" }}>Chunk {chunk + 1} of {chunks.length}</span>
        </div>
        {/* Progress */}
        <div style={{ height: 4, borderRadius: 2, background: "#222", marginBottom: 8 }}>
          <div style={{ height: 4, borderRadius: 2, background: "#4fc3f7", width: `${((chunk + 1) / chunks.length) * 100}%`, transition: "width 0.3s" }} />
        </div>
        {/* Chunk selector */}
        <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginBottom: 14 }}>
          {chunkTitles.map((t, i) => (
            <button key={i} onClick={() => setChunk(i)} style={{
              padding: "4px 10px", borderRadius: 4, border: "none", cursor: "pointer", fontSize: 11,
              background: chunk === i ? "#4fc3f7" : "#161b22", color: chunk === i ? "#000" : "#666",
              fontWeight: chunk === i ? 700 : 400,
            }}>{i + 1}. {t}</button>
          ))}
        </div>
        {/* Title */}
        <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 14, borderLeft: "4px solid #4fc3f7", paddingLeft: 12 }}>
          {chunkTitles[chunk]}
        </div>
        {/* Content */}
        <Comp />
        {/* Nav */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, paddingTop: 12, borderTop: "1px solid #222" }}>
          <button onClick={() => setChunk(Math.max(0, chunk - 1))} disabled={chunk === 0} style={{
            padding: "8px 20px", borderRadius: 6, border: "1px solid #30363d", background: "#161b22", color: chunk === 0 ? "#333" : "#aaa", cursor: chunk === 0 ? "default" : "pointer", fontSize: 12,
          }}>← Previous</button>
          <button onClick={() => setChunk(Math.min(chunks.length - 1, chunk + 1))} disabled={chunk === chunks.length - 1} style={{
            padding: "8px 20px", borderRadius: 6, border: "none", background: chunk === chunks.length - 1 ? "#333" : "#4fc3f7", color: chunk === chunks.length - 1 ? "#666" : "#000", cursor: chunk === chunks.length - 1 ? "default" : "pointer", fontSize: 12, fontWeight: 700,
          }}>Next Chunk →</button>
        </div>
      </div>
    </div>
  );
}
