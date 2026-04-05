import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";

const generateDecayData = () => {
  const data = [];
  const initialValue = 6.35;
  const totalDays = 120;

  for (let dte = totalDays; dte >= 0; dte--) {
    const timeRatio = Math.sqrt(dte / totalDays);
    const timeValue = initialValue * timeRatio;
    const dayNumber = totalDays - dte;

    // Daily theta (how much value lost per day)
    const nextTimeRatio = dte > 0 ? Math.sqrt((dte - 1) / totalDays) : 0;
    const dailyTheta = initialValue * timeRatio - initialValue * nextTimeRatio;

    data.push({
      dayNumber,
      dte,
      timeValue: Math.round(timeValue * 100) / 100,
      dailyTheta: Math.round(dailyTheta * 100) / 100,
      totalValue: Math.round((timeValue) * 100) / 100,
    });
  }
  return data;
};

const data = generateDecayData();

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div
        style={{
          background: "#1a1a2e",
          border: "1px solid #444",
          borderRadius: 8,
          padding: "12px 16px",
          color: "#e0e0e0",
          fontSize: 13,
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 4, color: "#00d4aa" }}>
          Day {d.dayNumber} — {d.dte} DTE
        </div>
        <div>Time Value: <span style={{ color: "#4fc3f7" }}>${d.timeValue.toFixed(2)}</span></div>
        <div>Daily Theta: <span style={{ color: "#ff6b6b" }}>-${d.dailyTheta.toFixed(2)}</span></div>
        <div style={{ marginTop: 4, fontSize: 11, color: "#888" }}>
          {d.dte > 90
            ? "Slow decay zone — theta is gentle"
            : d.dte > 45
            ? "Moderate decay — picking up speed"
            : d.dte > 21
            ? "Acceleration zone — theta getting aggressive"
            : "Danger zone — rapid decay"}
        </div>
      </div>
    );
  }
  return null;
};

export default function ThetaDecay() {
  const [view, setView] = useState("value");
  const currentDTE = 108;
  const currentDay = 120 - currentDTE;

  const currentPoint = data.find((d) => d.dte === currentDTE);
  const day30Point = data.find((d) => d.dte === 30);
  const day45Point = data.find((d) => d.dte === 45);

  return (
    <div
      style={{
        background: "#0d1117",
        color: "#e0e0e0",
        minHeight: "100vh",
        padding: "24px",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            marginBottom: 4,
            color: "#fff",
          }}
        >
          Theta Decay Curve — PLTR $120 PUT
        </h1>
        <p style={{ color: "#888", fontSize: 14, marginBottom: 20 }}>
          Bought at $6.35 · Jul 17, 2026 · 120 days at entry
        </p>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <button
            onClick={() => setView("value")}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              background: view === "value" ? "#4fc3f7" : "#222",
              color: view === "value" ? "#000" : "#aaa",
            }}
          >
            Time Value Decay
          </button>
          <button
            onClick={() => setView("theta")}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              background: view === "theta" ? "#ff6b6b" : "#222",
              color: view === "theta" ? "#000" : "#aaa",
            }}
          >
            Daily Theta ($)
          </button>
        </div>

        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            {view === "value" ? (
              <AreaChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                <defs>
                  <linearGradient id="valueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4fc3f7" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#4fc3f7" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis
                  dataKey="dayNumber"
                  stroke="#555"
                  tick={{ fill: "#888", fontSize: 11 }}
                  label={{ value: "Days Since Entry", position: "insideBottom", offset: -5, fill: "#888", fontSize: 12 }}
                />
                <YAxis
                  stroke="#555"
                  tick={{ fill: "#888", fontSize: 11 }}
                  label={{ value: "Time Value ($)", angle: -90, position: "insideLeft", offset: 10, fill: "#888", fontSize: 12 }}
                  domain={[0, 7]}
                />
                <Tooltip content={<CustomTooltip />} />

                {/* Zones */}
                <ReferenceLine x={75} stroke="#ffab40" strokeDasharray="5 5" strokeOpacity={0.5} />
                <ReferenceLine x={90} stroke="#ff6b6b" strokeDasharray="5 5" strokeOpacity={0.5} />

                <Area
                  type="monotone"
                  dataKey="timeValue"
                  stroke="#4fc3f7"
                  strokeWidth={2.5}
                  fill="url(#valueGrad)"
                />

                {currentPoint && (
                  <ReferenceDot
                    x={currentDay}
                    y={currentPoint.timeValue}
                    r={7}
                    fill="#00d4aa"
                    stroke="#fff"
                    strokeWidth={2}
                  />
                )}

                <ReferenceLine
                  x={currentDay}
                  stroke="#00d4aa"
                  strokeDasharray="4 4"
                  label={{
                    value: `YOU ARE HERE (${currentDTE} DTE)`,
                    position: "top",
                    fill: "#00d4aa",
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                />
              </AreaChart>
            ) : (
              <AreaChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                <defs>
                  <linearGradient id="thetaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff6b6b" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#ff6b6b" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis
                  dataKey="dayNumber"
                  stroke="#555"
                  tick={{ fill: "#888", fontSize: 11 }}
                  label={{ value: "Days Since Entry", position: "insideBottom", offset: -5, fill: "#888", fontSize: 12 }}
                />
                <YAxis
                  stroke="#555"
                  tick={{ fill: "#888", fontSize: 11 }}
                  label={{ value: "Daily Theta Loss ($)", angle: -90, position: "insideLeft", offset: 10, fill: "#888", fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />

                <ReferenceLine x={75} stroke="#ffab40" strokeDasharray="5 5" strokeOpacity={0.5} />
                <ReferenceLine x={90} stroke="#ff6b6b" strokeDasharray="5 5" strokeOpacity={0.5} />

                <Area
                  type="monotone"
                  dataKey="dailyTheta"
                  stroke="#ff6b6b"
                  strokeWidth={2.5}
                  fill="url(#thetaGrad)"
                />

                <ReferenceLine
                  x={currentDay}
                  stroke="#00d4aa"
                  strokeDasharray="4 4"
                  label={{
                    value: `YOU (${currentDTE} DTE)`,
                    position: "top",
                    fill: "#00d4aa",
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Key numbers */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
            marginTop: 24,
          }}
        >
          <div
            style={{
              background: "#161b22",
              borderRadius: 8,
              padding: 16,
              borderLeft: "3px solid #00d4aa",
            }}
          >
            <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: 1 }}>
              Now (108 DTE)
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#00d4aa" }}>
              -$0.03/day
            </div>
            <div style={{ fontSize: 12, color: "#666" }}>Barely bleeding</div>
          </div>
          <div
            style={{
              background: "#161b22",
              borderRadius: 8,
              padding: 16,
              borderLeft: "3px solid #ffab40",
            }}
          >
            <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: 1 }}>
              At 45 DTE
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#ffab40" }}>
              -$0.05/day
            </div>
            <div style={{ fontSize: 12, color: "#666" }}>Picking up speed</div>
          </div>
          <div
            style={{
              background: "#161b22",
              borderRadius: 8,
              padding: 16,
              borderLeft: "3px solid #ff6b6b",
            }}
          >
            <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: 1 }}>
              Last 30 Days
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#ff6b6b" }}>
              -$0.06→$0.29
            </div>
            <div style={{ fontSize: 12, color: "#666" }}>Decay goes vertical</div>
          </div>
        </div>

        {/* Takeaway */}
        <div
          style={{
            background: "#161b22",
            borderRadius: 8,
            padding: 20,
            marginTop: 20,
            border: "1px solid #30363d",
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: "#fff" }}>
            What this means for your PLTR $120 PUT
          </h3>
          <div style={{ fontSize: 13, lineHeight: 1.7, color: "#b0b0b0" }}>
            <p style={{ margin: "0 0 8px 0" }}>
              At <strong style={{ color: "#00d4aa" }}>108 DTE</strong>, you're in the flat part of the curve. Theta is barely touching you —
              maybe $3/day on a $875 position. Time is on your side right now.
            </p>
            <p style={{ margin: "0 0 8px 0" }}>
              The curve gets steep around <strong style={{ color: "#ffab40" }}>45 DTE (early June)</strong>.
              That's when theta starts eating faster. By <strong style={{ color: "#ff6b6b" }}>30 DTE (mid June)</strong>,
              decay accelerates hard.
            </p>
            <p style={{ margin: 0 }}>
              This is why long options (like yours) benefit from early exits if the thesis plays out —
              take profits before theta gets aggressive. Sellers love the last 45 days. Buyers should respect it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
