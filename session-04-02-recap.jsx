import { useState } from "react";

const B = ({ children, style }) => (
  <div style={{ background: "#161b22", borderRadius: 10, padding: 16, border: "1px solid #30363d", marginBottom: 12, ...style }}>{children}</div>
);

const sections = [
  "Ed's Method Corrections",
  "Risk-On vs Risk-Off",
  "The 3 IVs Explained",
  "Vega — The Chain",
  "Delta = Dollar Multiplier",
  "CRWV Breakdown",
  "Your Positions Live",
  "Order Safety: BTO vs STO",
];

/* ───── 1: Ed's Method Corrections ───── */
function Section1() {
  return (
    <div>
      <B style={{ borderLeft: "3px solid #ff6b6b" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#ff6b6b", marginBottom: 8 }}>What We Had Wrong</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{ padding: 12, background: "#0d1117", borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: "#ff6b6b", fontWeight: 700, marginBottom: 4 }}>BEFORE (WRONG)</div>
            <div style={{ fontSize: 13, color: "#888" }}>Ed targets <strong style={{ color: "#ff6b6b", textDecoration: "line-through" }}>20Δ</strong> entries</div>
            <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>Low probability, many small OTM bets</div>
          </div>
          <div style={{ padding: 12, background: "#0d1117", borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: "#00d4aa", fontWeight: 700, marginBottom: 4 }}>CORRECTED</div>
            <div style={{ fontSize: 13, color: "#fff" }}>Ed targets <strong style={{ color: "#00d4aa" }}>50Δ (ATM)</strong> entries</div>
            <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>Coin-flip probability, max responsiveness</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
          <div style={{ padding: 12, background: "#0d1117", borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: "#ff6b6b", fontWeight: 700, marginBottom: 4 }}>BEFORE (WRONG)</div>
            <div style={{ fontSize: 13, color: "#888" }}>30% rule = <strong style={{ color: "#ff6b6b", textDecoration: "line-through" }}>target per trade</strong></div>
          </div>
          <div style={{ padding: 12, background: "#0d1117", borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: "#00d4aa", fontWeight: 700, marginBottom: 4 }}>CORRECTED</div>
            <div style={{ fontSize: 13, color: "#fff" }}>30% = <strong style={{ color: "#00d4aa" }}>ceiling</strong>. Target is 1-3%</div>
          </div>
        </div>
      </B>
      <B>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Ed's Actual Sizing on $5K Account</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[
            ["1%", "$50", "#4fc3f7", "Conservative"],
            ["2%", "$100", "#ffab40", "Standard"],
            ["3%", "$150", "#00d4aa", "Max target"],
          ].map(([pct, amt, color, label], i) => (
            <div key={i} style={{ textAlign: "center", padding: 12, background: "#0d1117", borderRadius: 8, borderTop: `3px solid ${color}` }}>
              <div style={{ fontSize: 24, fontWeight: 700, color }}>{pct}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{amt}</div>
              <div style={{ fontSize: 10, color: "#666" }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "#ffab4012", borderRadius: 6, padding: 10, marginTop: 10, fontSize: 11, color: "#aaa" }}>
          <strong style={{ color: "#ffab40" }}>The Problem:</strong> Most option contracts cost $300+. At $5K, even 3% ($150) can't buy a single contract. Need to discuss spreads or other strategies with Ed for small accounts.
        </div>
      </B>
    </div>
  );
}

/* ───── 2: Risk-On vs Risk-Off ───── */
function Section2() {
  return (
    <div>
      <B>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#e040fb", marginBottom: 4 }}>Ed's #1 Macro Filter (NEW — 4/2/26)</div>
        <div style={{ fontSize: 12, color: "#888", marginBottom: 14 }}>
          "When I look at a chart, I look at the pattern and then try to determine is risk on or risk off."
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ padding: 16, background: "#00d4aa0a", borderRadius: 10, border: "1px solid #00d4aa33" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#00d4aa", marginBottom: 8 }}>RISK ON</div>
            <div style={{ fontSize: 12, color: "#aaa", lineHeight: 1.7 }}>Market is hungry for risk. Bullish mood.</div>
            <div style={{ marginTop: 10, padding: 10, background: "#0d1117", borderRadius: 6 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#00d4aa", marginBottom: 4 }}>Bad news → can be GOOD</div>
              <div style={{ fontSize: 11, color: "#666" }}>"Already priced in" — market shrugs it off or buys the dip</div>
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: "#555" }}>
              Signals: full page of calls on screener, MAs stacking up, heavy call premium flow
            </div>
          </div>
          <div style={{ padding: 16, background: "#ff6b6b0a", borderRadius: 10, border: "1px solid #ff6b6b33" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#ff6b6b", marginBottom: 8 }}>RISK OFF</div>
            <div style={{ fontSize: 12, color: "#aaa", lineHeight: 1.7 }}>Market is fleeing risk. Defensive mood.</div>
            <div style={{ marginTop: 10, padding: 10, background: "#0d1117", borderRadius: 6 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#ff6b6b", marginBottom: 4 }}>Good news → can be BAD</div>
              <div style={{ fontSize: 11, color: "#666" }}>"Not enough" — market sells even on positive catalysts</div>
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: "#555" }}>
              Signals: thin call screener, inverted MAs, BlackRock goes neutral, Ed steps aside
            </div>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 12, padding: 10, background: "#ff6b6b11", borderRadius: 6, border: "1px solid #ff6b6b22" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#ff6b6b" }}>CURRENT READ: RISK OFF</div>
          <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>Ed expected last night's news wouldn't deliver. BlackRock confirms caution.</div>
        </div>
      </B>
      <B>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Ed's Decision Flow</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
          {[
            ["Read Chart\nPattern", "#e040fb"],
            ["→", "#333"],
            ["Risk On\nor Off?", "#ffab40"],
            ["→", "#333"],
            ["How Will News\nBe Received?", "#4fc3f7"],
            ["→", "#333"],
            ["Trade or\nSit Out", "#00d4aa"],
          ].map(([label, color], i) => (
            label === "→" ?
              <div key={i} style={{ fontSize: 18, color }}>{label}</div> :
              <div key={i} style={{ padding: "10px 14px", background: "#0d1117", borderRadius: 8, border: `1px solid ${color}33`, fontSize: 11, color, fontWeight: 600, textAlign: "center", whiteSpace: "pre-line", lineHeight: 1.4 }}>{label}</div>
          ))}
        </div>
      </B>
    </div>
  );
}

/* ───── 3: The 3 IVs ───── */
function Section3() {
  return (
    <div>
      <B>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#4fc3f7", marginBottom: 4 }}>Three IV Numbers — Don't Confuse Them</div>
        <div style={{ fontSize: 12, color: "#888", marginBottom: 14 }}>You see different IV numbers on the chart vs Tastytrade. Here's why.</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            ["Chart IV", "96.9%", "#e040fb", "The weather RIGHT NOW", "Blended IV across ALL expirations. Updates real-time. Use when reading the chart trend.", "ThinkorSwim chart panel"],
            ["IVx", "89.6%", "#4fc3f7", "Forecast for YOUR trip", "IV for a SPECIFIC expiration (July 17). Weighted toward ATM options. This is what's baked into YOUR premium.", "Tastytrade chain header"],
            ["IVR", "32.4", "#00d4aa", "Is this normal?", "Where IV sits in the 52-week range (percentile). THE number for deciding if options are cheap or expensive.", "Tastytrade top bar"],
          ].map(([name, val, color, analogy, desc, where], i) => (
            <div key={i} style={{ padding: 14, background: "#0d1117", borderRadius: 10, borderTop: `3px solid ${color}` }}>
              <div style={{ fontSize: 14, fontWeight: 700, color }}>{name}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: "4px 0" }}>{val}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 6 }}>"{analogy}"</div>
              <div style={{ fontSize: 11, color: "#888", lineHeight: 1.6, marginBottom: 6 }}>{desc}</div>
              <div style={{ fontSize: 10, color: "#555", borderTop: "1px solid #222", paddingTop: 4 }}>Where: {where}</div>
            </div>
          ))}
        </div>
      </B>
      <B>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Quick Rule for Buying Options</div>
        <div style={{ display: "flex", gap: 4, alignItems: "stretch" }}>
          {[
            ["< 30", "#00d4aa", "CHEAP", "Buy away"],
            ["30-50", "#4fc3f7", "MODERATE", "Fine with conviction"],
            ["50-70", "#ffab40", "PRICEY", "Be careful"],
            ["70+", "#ff6b6b", "EXPENSIVE", "IV crush danger"],
          ].map(([range, color, label, action], i) => (
            <div key={i} style={{ flex: 1, textAlign: "center", padding: 10, background: "#0d1117", borderRadius: 6, borderBottom: `3px solid ${color}` }}>
              <div style={{ fontSize: 10, color: "#666" }}>IVR</div>
              <div style={{ fontSize: 16, fontWeight: 700, color }}>{range}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color }}>{label}</div>
              <div style={{ fontSize: 10, color: "#888" }}>{action}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 8, fontSize: 12, color: "#00d4aa" }}>
          CRWV IVR 32 = moderate zone. PLTR IVR 17.5 = cheap zone.
        </div>
      </B>
    </div>
  );
}

/* ───── 4: Vega Chain ───── */
function Section4() {
  return (
    <div>
      <B>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#ffab40", marginBottom: 4 }}>Vega — The Volatility Chain</div>
        <div style={{ fontSize: 12, color: "#888", marginBottom: 14 }}>Vega is NOT the premium. It's how much the premium CHANGES when IV moves.</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
          {[
            ["Demand /\nFear", "#ff6b6b", "People buying options"],
            ["→", null, null],
            ["IV\nMoves", "#e040fb", "Uncertainty priced in"],
            ["→", null, null],
            ["Vega\nConverts", "#ffab40", "Translates to dollars"],
            ["→", null, null],
            ["Your\nP/L", "#00d4aa", "Money in or out"],
          ].map(([label, color, sub], i) => (
            !color ?
              <div key={i} style={{ fontSize: 20, color: "#333" }}>{label}</div> :
              <div key={i} style={{ padding: "10px 12px", background: "#0d1117", borderRadius: 8, border: `1px solid ${color}33`, textAlign: "center", minWidth: 90 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color, whiteSpace: "pre-line", lineHeight: 1.3 }}>{label}</div>
                <div style={{ fontSize: 9, color: "#666", marginTop: 3 }}>{sub}</div>
              </div>
          ))}
        </div>
      </B>
      <B>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Vega in Dollars — CRWV Example</div>
        <div style={{ padding: 14, background: "#0d1117", borderRadius: 8, marginBottom: 10 }}>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>CRWV $72.5 PUT — Vega: -15.60</div>
          <div style={{ fontSize: 13, color: "#fff", lineHeight: 1.8 }}>
            IV drops 1% → option loses <strong style={{ color: "#ff6b6b" }}>$15.60</strong><br/>
            IV drops 5% → option loses <strong style={{ color: "#ff6b6b" }}>$78.00</strong><br/>
            IV rises 5% → option gains <strong style={{ color: "#00d4aa" }}>$78.00</strong>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div style={{ padding: 10, background: "#ff6b6b0a", borderRadius: 6, border: "1px solid #ff6b6b22" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#ff6b6b", marginBottom: 4 }}>IV Crush (bad for buyers)</div>
            <div style={{ fontSize: 11, color: "#888" }}>Stock moves your way but IV drops. Delta gains get eaten by vega losses. You were RIGHT but still lost money.</div>
          </div>
          <div style={{ padding: 10, background: "#00d4aa0a", borderRadius: 6, border: "1px solid #00d4aa22" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#00d4aa", marginBottom: 4 }}>IV Expansion (good for buyers)</div>
            <div style={{ fontSize: 11, color: "#888" }}>Uncertainty rises, IV climbs. Vega pushes your option value UP on top of any delta gains. Double win.</div>
          </div>
        </div>
      </B>
    </div>
  );
}

/* ───── 5: Delta Dollar Multiplier ───── */
function Section5() {
  const W = 600, pad = 50;
  const deltas = [
    { d: 20, label: "20Δ", gain: 0.20, color: "#555", desc: "Your PLTR entry" },
    { d: 29, label: "29Δ", gain: 0.29, color: "#ffab40", desc: "Your PLTR now" },
    { d: 50, label: "50Δ", gain: 0.50, color: "#00d4aa", desc: "Ed's preference" },
    { d: 75, label: "75Δ", gain: 0.75, color: "#4fc3f7", desc: "Deep ITM" },
  ];
  const maxGain = 0.80;
  const barW = W - 2 * pad;

  return (
    <div>
      <B style={{ borderLeft: "3px solid #00d4aa" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
          Delta = "How much does my option move when the stock moves $1?"
        </div>
        <div style={{ fontSize: 12, color: "#888" }}>That's it. It's a multiplier. Brandon marked this explanation important.</div>
      </B>
      <B>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 10 }}>If PLTR Drops $1, Your Put Gains:</div>
        {deltas.map((d, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
              <span style={{ color: d.color, fontWeight: 700 }}>{d.label} — {d.desc}</span>
              <span style={{ color: "#fff", fontWeight: 700 }}>${d.gain.toFixed(2)} /share (${(d.gain * 100).toFixed(0)} /contract)</span>
            </div>
            <div style={{ height: 20, borderRadius: 4, background: "#222", position: "relative", overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 4, background: d.color, width: `${(d.gain / maxGain) * 100}%`, opacity: 0.8 }} />
            </div>
          </div>
        ))}
        <div style={{ textAlign: "center", marginTop: 10, fontSize: 12, color: "#888" }}>
          Ed at 50Δ gets <strong style={{ color: "#00d4aa" }}>72% more</strong> per dollar than you at 29Δ
        </div>
      </B>
      <B>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Puts vs Calls — Direction Rule</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{ padding: 12, background: "#0d1117", borderRadius: 8, textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#ff6b6b", marginBottom: 6 }}>PUTS (You)</div>
            <div style={{ fontSize: 12, color: "#aaa" }}>Stock ↑ = Put ↓</div>
            <div style={{ fontSize: 12, color: "#aaa" }}>Stock ↓ = Put ↑</div>
            <div style={{ fontSize: 10, color: "#666", marginTop: 4 }}>Delta works in REVERSE to stock</div>
          </div>
          <div style={{ padding: 12, background: "#0d1117", borderRadius: 8, textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#00d4aa", marginBottom: 6 }}>CALLS</div>
            <div style={{ fontSize: 12, color: "#aaa" }}>Stock ↑ = Call ↑</div>
            <div style={{ fontSize: 12, color: "#aaa" }}>Stock ↓ = Call ↓</div>
            <div style={{ fontSize: 10, color: "#666", marginTop: 4 }}>Delta works WITH the stock</div>
          </div>
        </div>
      </B>
    </div>
  );
}

/* ───── 6: CRWV Breakdown ───── */
function Section6() {
  return (
    <div>
      <B>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>CRWV — CoreWeave</div>
            <div style={{ fontSize: 12, color: "#888" }}>AI GPU Cloud Infrastructure · NASDAQ · IPO: March 28, 2025</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#00d4aa" }}>$80.59</div>
            <div style={{ fontSize: 11, color: "#00d4aa" }}>+2.74% today</div>
          </div>
        </div>
        <div style={{ fontSize: 12, color: "#aaa", lineHeight: 1.6, marginBottom: 10 }}>
          The "landlord" of AI computing. 250K+ GPUs, 32 data centers. Powers OpenAI, Microsoft, Meta. Revenue: $5.1B (+168% YoY). But still losing money, massive debt, 22.6% short interest, and insiders dumping $32M+ in March.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
          {[
            ["IPO Price", "$40", "#888"], ["Peak", "$153", "#4fc3f7"], ["Now", "$80.59", "#ffab40"], ["From Peak", "-47%", "#ff6b6b"],
            ["Rev Growth", "+168%", "#00d4aa"], ["EPS", "-$0.89", "#ff6b6b"], ["Short %", "22.6%", "#ff6b6b"], ["Analysts", "Buy $121", "#4fc3f7"],
          ].map(([l, v, c], i) => (
            <div key={i} style={{ padding: 8, background: "#0d1117", borderRadius: 6, textAlign: "center" }}>
              <div style={{ fontSize: 9, color: "#666" }}>{l}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: c }}>{v}</div>
            </div>
          ))}
        </div>
      </B>
      <B>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Go Maz Screener Verdict</div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
          <div style={{ padding: "6px 14px", background: "#ff6b6b22", borderRadius: 6, fontSize: 14, fontWeight: 700, color: "#ff6b6b" }}>PUTS</div>
          <div style={{ padding: "6px 14px", background: "#00d4aa22", borderRadius: 6, fontSize: 14, fontWeight: 700, color: "#00d4aa" }}>Score: 75%</div>
          <div style={{ padding: "6px 14px", background: "#4fc3f722", borderRadius: 6, fontSize: 14, fontWeight: 700, color: "#4fc3f7" }}>Strong Setup</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
          {[
            ["IV Rank", "PASS", "#00d4aa"], ["Chart Pattern", "PASS", "#00d4aa"], ["Volume", "PASS", "#00d4aa"],
            ["MA Aligned", "PASS", "#00d4aa"], ["Near S/R", "FAIL", "#ff6b6b"], ["Unusual Activity", "FAIL", "#ff6b6b"],
          ].map(([rule, result, color], i) => (
            <div key={i} style={{ padding: 6, background: "#0d1117", borderRadius: 4, display: "flex", justifyContent: "space-between", fontSize: 11 }}>
              <span style={{ color: "#888" }}>{rule}</span>
              <span style={{ color, fontWeight: 700 }}>{result}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: "#888" }}>
          Pattern: <strong style={{ color: "#ff6b6b" }}>Bear Flag</strong> · Support: $74 · Resistance: $88.11 · GEX: +50.6M (positive)
        </div>
      </B>
      <B>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 8 }}>50Δ Put Options — Ed's Zone</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            ["$72.5 PUT", "49% ITM", "$10.60", "18% of acct", "#4fc3f7"],
            ["$75 PUT", "52% ITM", "$11.80", "20% of acct", "#00d4aa"],
          ].map(([strike, itm, cost, pct, color], i) => (
            <div key={i} style={{ padding: 12, background: "#0d1117", borderRadius: 8, borderLeft: `3px solid ${color}` }}>
              <div style={{ fontSize: 14, fontWeight: 700, color }}>{strike}</div>
              <div style={{ fontSize: 12, color: "#aaa" }}>{itm} · Ask: {cost} · {pct}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "#666", marginTop: 6 }}>Both above Ed's 3% target but under 30% ceiling. IVR 32 = moderate, not peak.</div>
      </B>
    </div>
  );
}

/* ───── 7: Positions Live ───── */
function Section7() {
  return (
    <div>
      <B>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 10 }}>Account Snapshot — April 2, 2026</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
          {[
            ["Net Liq", "$970.88", "#fff"], ["Cash", "$363.88", "#888"], ["Option BP", "$5,363.88", "#00d4aa"], ["P/L YTD", "-$28.00", "#ff6b6b"],
          ].map(([l, v, c], i) => (
            <div key={i} style={{ textAlign: "center", padding: 10, background: "#0d1117", borderRadius: 6 }}>
              <div style={{ fontSize: 10, color: "#888" }}>{l}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: c }}>{v}</div>
            </div>
          ))}
        </div>
      </B>
      <B style={{ borderLeft: "3px solid #ffab40" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>PLTR $120 PUT — Jul 17</div>
            <div style={{ fontSize: 11, color: "#4fc3f7" }}>LONG · 106 DTE · Bought at $6.35</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#ff6b6b" }}>-$28</div>
            <div style={{ fontSize: 11, color: "#ff6b6b" }}>-4.4%</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6 }}>
          {[
            ["Price Now", "$146.88", "#ffab40"], ["Put Bid", "$6.00", "#ff6b6b"], ["ITM%", "29Δ", "#ffab40"], ["IVR", "17.5", "#4fc3f7"],
          ].map(([l, v, c], i) => (
            <div key={i} style={{ textAlign: "center", padding: 8, background: "#0d1117", borderRadius: 4 }}>
              <div style={{ fontSize: 9, color: "#666" }}>{l}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: c }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: "#888" }}>
          Was +$240 last session. PLTR rallied $9.38 and IV compressed (IVR 24 → 17.5). Delta and vega both worked against you. Still 106 DTE — plenty of time if the thesis plays out.
        </div>
      </B>
      <B>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 6 }}>What Changed Since 3/31</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[
            ["PLTR Price", "$137.50 → $146.88", "+$9.38", "#ff6b6b", "Bad for your put"],
            ["IVR", "24 → 17.5", "-6.5 pts", "#ff6b6b", "IV compressed (vega hurt)"],
            ["ITM%", "35% → 29%", "-6 pts", "#ffab40", "Moving away from ATM"],
          ].map(([label, change, delta, color, impact], i) => (
            <div key={i} style={{ padding: 10, background: "#0d1117", borderRadius: 6 }}>
              <div style={{ fontSize: 11, color: "#888" }}>{label}</div>
              <div style={{ fontSize: 12, color: "#aaa", margin: "2px 0" }}>{change}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color }}>{delta}</div>
              <div style={{ fontSize: 10, color: "#666", marginTop: 2 }}>{impact}</div>
            </div>
          ))}
        </div>
      </B>
    </div>
  );
}

/* ───── 8: BTO vs STO ───── */
function Section8() {
  return (
    <div>
      <B style={{ border: "1px solid #ff6b6b55" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#ff6b6b", marginBottom: 4 }}>Order Safety — BTO vs STO</div>
        <div style={{ fontSize: 12, color: "#888", marginBottom: 14 }}>We caught a wrong order type today. This is critical to check EVERY time.</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ padding: 16, background: "#00d4aa0a", borderRadius: 10, border: "2px solid #00d4aa55" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#00d4aa", marginBottom: 8 }}>BTO</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Buy To Open</div>
            <div style={{ fontSize: 12, color: "#aaa", lineHeight: 1.6 }}>
              You're BUYING a put.<br/>
              Order shows: <strong style={{ color: "#00d4aa" }}>+1</strong><br/>
              You PAY a debit.<br/>
              Max loss = premium paid.<br/>
              <strong>This is what you do.</strong>
            </div>
            <div style={{ marginTop: 10, padding: 8, background: "#0d1117", borderRadius: 6, textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "#888" }}>CRWV $72.5 PUT BTO</div>
              <div style={{ fontSize: 11, color: "#888" }}>Cost: $1,060 · Max Loss: $1,060</div>
            </div>
          </div>
          <div style={{ padding: 16, background: "#ff6b6b0a", borderRadius: 10, border: "2px solid #ff6b6b55" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#ff6b6b", marginBottom: 8 }}>STO</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Sell To Open</div>
            <div style={{ fontSize: 12, color: "#aaa", lineHeight: 1.6 }}>
              You're SELLING a put.<br/>
              Order shows: <strong style={{ color: "#ff6b6b" }}>-1</strong><br/>
              You COLLECT a credit.<br/>
              Max loss = massive.<br/>
              <strong style={{ color: "#ff6b6b" }}>NOT what you do.</strong>
            </div>
            <div style={{ marginTop: 10, padding: 8, background: "#0d1117", borderRadius: 6, textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "#888" }}>CRWV $72.5 PUT STO</div>
              <div style={{ fontSize: 11, color: "#ff6b6b" }}>Credit: $1,000 · Max Loss: $6,250</div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 12, padding: 10, background: "#ff6b6b11", borderRadius: 6, textAlign: "center", fontSize: 13, color: "#ff6b6b", fontWeight: 700 }}>
          Before EVERY order: Check for +1 (BTO) not -1 (STO)
        </div>
      </B>
      <B>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Pre-Trade Checklist</div>
        {[
          ["Chart pattern confirms direction?", "#e040fb"],
          ["Risk-on or risk-off?", "#ffab40"],
          ["IVR check — am I buying cheap or expensive?", "#00d4aa"],
          ["Strike near 50Δ (Ed's zone)?", "#4fc3f7"],
          ["DTE above 60 days?", "#4fc3f7"],
          ["Size within 1-3% of account?", "#ffab40"],
          ["Order is BTO (+1), NOT STO (-1)?", "#ff6b6b"],
          ["Bracket order set (profit target + stop loss)?", "#00d4aa"],
        ].map(([step, color], i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 5 }}>
            <div style={{ width: 22, height: 22, borderRadius: 4, background: `${color}22`, color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
            <div style={{ fontSize: 12, color: "#aaa" }}>{step}</div>
          </div>
        ))}
      </B>
    </div>
  );
}

const sectionComponents = [Section1, Section2, Section3, Section4, Section5, Section6, Section7, Section8];

export default function SessionRecap() {
  const [sec, setSec] = useState(0);
  const Comp = sectionComponents[sec];
  return (
    <div style={{ background: "#0d1117", color: "#e0e0e0", minHeight: "100vh", padding: 20, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: 0 }}>Session Recap — April 2, 2026</h1>
          <span style={{ fontSize: 12, color: "#555" }}>{sec + 1} of {sections.length}</span>
        </div>
        <div style={{ height: 4, borderRadius: 2, background: "#222", marginBottom: 8 }}>
          <div style={{ height: 4, borderRadius: 2, background: "#e040fb", width: `${((sec + 1) / sections.length) * 100}%`, transition: "width 0.3s" }} />
        </div>
        <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginBottom: 14 }}>
          {sections.map((t, i) => (
            <button key={i} onClick={() => setSec(i)} style={{
              padding: "4px 10px", borderRadius: 4, border: "none", cursor: "pointer", fontSize: 11,
              background: sec === i ? "#e040fb" : "#161b22", color: sec === i ? "#000" : "#666",
              fontWeight: sec === i ? 700 : 400,
            }}>{i + 1}. {t}</button>
          ))}
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 14, borderLeft: "4px solid #e040fb", paddingLeft: 12 }}>
          {sections[sec]}
        </div>
        <Comp />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, paddingTop: 12, borderTop: "1px solid #222" }}>
          <button onClick={() => setSec(Math.max(0, sec - 1))} disabled={sec === 0} style={{
            padding: "8px 20px", borderRadius: 6, border: "1px solid #30363d", background: "#161b22", color: sec === 0 ? "#333" : "#aaa", cursor: sec === 0 ? "default" : "pointer", fontSize: 12,
          }}>← Previous</button>
          <button onClick={() => setSec(Math.min(sections.length - 1, sec + 1))} disabled={sec === sections.length - 1} style={{
            padding: "8px 20px", borderRadius: 6, border: "none", background: sec === sections.length - 1 ? "#333" : "#e040fb", color: sec === sections.length - 1 ? "#666" : "#000", cursor: sec === sections.length - 1 ? "default" : "pointer", fontSize: 12, fontWeight: 700,
          }}>Next →</button>
        </div>
      </div>
    </div>
  );
}
