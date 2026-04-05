import { useState } from "react";

const tabs = ["Learning Map", "Watchlist", "Shorting 101", "Stop Losses"];
const sColors = { complete: "#00d4aa", partial: "#ffab40", todo: "#555", new: "#4fc3f7" };

const topics = [
  { cat: "Foundations", color: "#00d4aa", items: [
    { n: "Standard Deviation", s: "complete", d: "1σ = 68% chance stock stays in range. 2σ = 95%. 3σ = 99.7%. The bell curve maps directly to the options chain — your $120 put at 20Δ sits near the edge of 1σ. Quiz: 2/2 ✓" },
    { n: "Expected Move", s: "complete", d: "Formula: Stock Price × IV × √(Days/365). For PLTR July: $137.50 × 64.6% × √(108/365) = ±$48.34. That gives a range of ~$89 to ~$186. Quiz redo still pending." },
    { n: "Delta = ITM%", s: "complete", d: "Tastytrade's ITM% column IS delta. Your $120 put started at 20% ITM (20Δ) and is now 35% — meaning the market now gives it a 35% chance of expiring in the money. You caught my error: 20Δ is near the EDGE of 1σ, not outside it. 16Δ is the exact 1σ boundary." },
    { n: "IVR vs IVx", s: "complete", d: "IVR = where IV sits in its 52-week range (percentile). IVx = raw implied volatility number. PLTR IVR 24 means its current 64% IV is only in the 24th percentile — low for this stock. Compare: the scanner showed IVR 93.9 on another stock = extremely elevated." },
    { n: "Bid vs Ask", s: "todo", d: "How the spread works. Bid = what buyers will pay. Ask = what sellers want. The spread is the market maker's profit. Tight spreads (like PLTR's $0.20) = liquid, easy to trade. Wide spreads = expensive to enter/exit." },
  ]},
  { cat: "Greeks", color: "#4fc3f7", items: [
    { n: "Delta (Deep)", s: "complete", d: "30Δ call = 30% chance of profit if bought, 70% if sold. If you buy and are correct, you make 30¢ on the dollar (assuming gamma/vega/theta constant). Your put moved from 20Δ to 35Δ = it's worth more because probability of ITM increased. Delta is directly related to standard deviation." },
    { n: "Theta Decay", s: "complete", d: "Buying an option = paying theta daily (it costs you). Selling = collecting theta ('being the bank'). The decay curve is NOT linear — it's flat for first 60+ days, then accelerates hard in last 45, goes vertical in last 30. At 108 DTE you lose ~$3/day. At 30 DTE that jumps to ~$6-29/day. Ed says stay above 60 DTE to avoid the steep part." },
    { n: "Gamma", s: "partial", d: "The 'accelerator' of delta. A number (not dollars) that changes how fast delta moves. Can cause a 50Δ to jump to 75Δ on a big price swing. Net gamma = call contracts minus put contracts. Positive GEX means dealers are long gamma = they suppress volatility and the market mean-reverts. Net delta is derived from net gamma. Scanner showed GEX +87.6M on PLTR." },
    { n: "Vega", s: "todo", d: "How much an option's price changes per 1% change in IV. This explains why your friend's MSTR call went UP 9% when the stock was DOWN 3.3% — IV expanded and vega drove the value higher. Key to understanding Black-Scholes." },
    { n: "Rho", s: "todo", d: "How much an option's price changes per 1% change in interest rates. Less critical for short-term but relevant for Ed's macro thesis on TLT (bonds) and Fed rate policy." },
  ]},
  { cat: "Models & Pricing", color: "#ffab40", items: [
    { n: "Black-Scholes", s: "todo", d: "The pricing model behind all options. 5 inputs: stock price, strike price, time to expiration, risk-free interest rate, and implied volatility. You can look up 4 of the 5 — IV is the only unknown, making it the key variable. This is next lesson." },
    { n: "IV Expansion/Crush", s: "partial", d: "Seen in real life: friend's MSTR $175 CALL went up +$119 (+9%) on a day MSTR stock dropped 3.3%. IV expanded (market pricing in more uncertainty) which pumped vega and increased the option value despite the stock moving the wrong direction. After earnings or events, IV often 'crushes' — drops suddenly — destroying option value even if the stock moves your way." },
    { n: "Option Pricing", s: "todo", d: "Options have two parts: intrinsic value (how much it's worth if exercised now) and extrinsic/time value (premium for time + volatility). ATM options have the MOST extrinsic value. Your $120 put is OTM so it's 100% extrinsic — all time value, no intrinsic yet." },
  ]},
  { cat: "Charting", color: "#e040fb", items: [
    { n: "Support & Resistance", s: "complete", d: "True S&R must connect at multiple points — specifically at the top or end of a candle, not the middle. Ed demonstrated on PLTR 3-year weekly chart. Combine with trend lines to form patterns." },
    { n: "Moving Averages", s: "complete", d: "20-day (short-term) and 50-day (medium-term). When MAs are 'inverted' (20 below 50, or price below both) = bearish signal, good for puts. Ed uses these as primary trend indicators." },
    { n: "RSI", s: "complete", d: "Relative Strength Index. PLTR at 44% live = 55% of the market is outperforming it. Bounced off 40% low. The TREND of RSI matters more than the number — watch for it to start climbing consistently. That signals the stock is beginning to turn up." },
    { n: "Volume & A/D", s: "complete", d: "Volume: compare to average, not just 'high or low.' Accumulation/Distribution: the TREND matters more than the number. Use bar display for clearer visual. Yellow bars = below average performance. Length setting: 4.75." },
    { n: "Chart Patterns", s: "todo", d: "Ed's priority list: 1) Descending triangle — powerful downtrend continuation (demonstrated on PLTR). 2) Cup with handle — powerful uptrend signal (NEO showed this). 3) Head & shoulders — most powerful downtrend reversal. Ed: 'Ask Claude to teach you these and memorize them.'" },
    { n: "Candlesticks", s: "todo", d: "Foundation for reading price action. Body shows open/close, wicks show highs/lows. Key patterns: doji (indecision), hammer (reversal), engulfing (strong reversal). Ed recommended Bill O'Neal's books from Investor's Business Daily." },
  ]},
  { cat: "Risk & Strategy", color: "#ff6b6b", items: [
    { n: "30% Rule", s: "complete", d: "Never risk more than 30% of your account on any single position. Ties directly to the 1σ concept — 30% of the time something WILL go against you. Ed's personal max exposure limit. Poker analogy: a pro never loses their 'stake.'" },
    { n: "Stop Losses", s: "partial", d: "Ed says mandatory on every position, even small 3% allocations. His Apple calls just got stopped out (3/31) — proof the system works. Three types: fixed dollar, percentage-based, and stock-price-based. Next Ed session's main topic. See Stop Losses tab for deep dive." },
    { n: "Bracket / OCO Orders", s: "new", d: "The complete exit package: sets BOTH a profit target (limit sell) and stop loss (stop sell) in one order. OCO = One Cancels Other — when one fills, the other auto-cancels. Set it and walk away. In Tastytrade: right-click position → Bracket Order. Three legs: entry (already filled), take profit, stop loss. Both exits run 24/7 as GTC orders. See Stop Losses tab for full setup walkthrough." },
    { n: "Position Sizing", s: "partial", d: "Ed uses 3% allocation per trade. Goal: build a population of ~$200 trades at 20-delta. Small bets, high probability, let the math work over many trades. Your first trade ($635) is larger relative to the $1,000 account — Ed will likely adjust sizing as account grows." },
    { n: "Short Interest", s: "partial", d: "A number representing short positions on a stock. High short interest = accelerates downward moves because more sellers are piling on. Short SQUEEZE = when shorts are forced to buy back (cover), causing the stock to ricochet upward (GameStop example). Important metric for analyzing price action." },
    { n: "Shorting Stocks", s: "new", d: "Borrow shares → sell high → buy back low → return shares → keep difference. UNLIMITED risk if stock goes up. Requires margin (~50% of position). Different from buying puts where your risk is capped. See Shorting 101 tab for full breakdown." },
  ]},
  { cat: "Market Mechanics", color: "#b388ff", items: [
    { n: "Market Makers", s: "complete", d: "Goal: stay 100% delta neutral (equal puts to calls = delta zero). They take the other side of trades when no counterparty exists. They constantly rebalance to maintain neutrality — this process is how they suppress volatility. Platform fees fund this operation. Recent burst of orders forced MMs to buy to catch up → net delta spike of +25." },
    { n: "GEX", s: "partial", d: "Gamma Exposure. Positive GEX = dealers are long gamma = market tends to mean-revert and volatility is suppressed. Explains why big moves sometimes snap back. Scanner showed: Net Gamma +87.6M, Call gamma 271M vs Put gamma -183M, Net Delta +25.5B. This data came from Unusual Whales platform." },
    { n: "Premium Flow", s: "partial", d: "Net premium flow: positive call volume (94K) vs negative put volume (-4K) = currently bullish sentiment. Ed uses call screener fullness as a market direction indicator — when it becomes a 'full page' of calls again, market is turning bullish. Currently thin: only Brazilian ETF, AMD, NEO showing calls." },
  ]},
];

const watchlist = [
  { name: "Cloudflare Ecosystem", color: "#f48c42", t: ["NET", "FSLY", "AKAM", "ZS", "CRWD", "S", "PANW", "FTNT"] },
  { name: "Big Tech", color: "#4fc3f7", t: ["AAPL", "MSFT", "GOOGL", "AMZN", "META", "NVDA", "TSLA", "AVGO"] },
  { name: "AI / Cloud", color: "#00d4aa", t: ["PLTR ★", "SNOW", "DDOG", "MDB", "AI", "SMCI", "ARM"] },
  { name: "Semiconductors", color: "#e040fb", t: ["AMD", "INTC", "TSM", "QCOM", "MRVL", "MU"] },
  { name: "Cloud / SaaS", color: "#b388ff", t: ["CRM", "NOW", "SHOP", "WDAY", "HUBS", "TTD"] },
  { name: "Ed's Macro", color: "#ff6b6b", t: ["TLT (short)", "GLD (long)", "SLV", "MSTR"] },
];

const Box = ({ children, style }) => (
  <div style={{ background: "#161b22", borderRadius: 8, padding: 16, border: "1px solid #30363d", marginBottom: 14, ...style }}>{children}</div>
);

function LearningMap() {
  const [exp, setExp] = useState(null);
  let total = 0, done = 0;
  topics.forEach(c => c.items.forEach(i => { total++; if (i.s === "complete") done++; }));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#aaa", marginBottom: 6 }}>
        <span>Progress</span><span style={{ color: "#00d4aa", fontWeight: 700 }}>{done}/{total}</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: "#222", marginBottom: 16 }}>
        <div style={{ height: 6, borderRadius: 3, background: "#00d4aa", width: `${(done/total)*100}%` }} />
      </div>

      {topics.map((cat, ci) => (
        <div key={ci} style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: cat.color, marginBottom: 6, borderLeft: `3px solid ${cat.color}`, paddingLeft: 8 }}>
            {cat.cat} <span style={{ fontSize: 11, color: "#555" }}>{cat.items.filter(i => i.s === "complete").length}/{cat.items.length}</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, paddingLeft: 11 }}>
            {cat.items.map((item, ii) => (
              <div key={ii} onClick={() => setExp(exp === `${ci}-${ii}` ? null : `${ci}-${ii}`)} style={{
                padding: "4px 10px", borderRadius: 5, cursor: "pointer", fontSize: 12,
                background: "#0d1117", border: `1px solid ${sColors[item.s]}33`,
                color: sColors[item.s], fontWeight: item.s === "complete" ? 600 : 400,
              }}>
                {item.s === "complete" ? "✓ " : item.s === "new" ? "★ " : ""}{item.n}
              </div>
            ))}
          </div>
          {cat.items.map((item, ii) => exp === `${ci}-${ii}` && (
            <div key={`d${ii}`} style={{ margin: "6px 0 0 11px", padding: 8, background: "#0d1117", borderRadius: 5, borderLeft: `2px solid ${sColors[item.s]}`, fontSize: 11, color: "#aaa" }}>
              {item.d}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function WatchlistTab() {
  return watchlist.map((g, i) => (
    <div key={i} style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: g.color, marginBottom: 6, borderLeft: `3px solid ${g.color}`, paddingLeft: 8 }}>{g.name}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, paddingLeft: 11 }}>
        {g.t.map((t, ti) => (
          <div key={ti} style={{
            padding: "5px 10px", borderRadius: 5, fontSize: 13, fontWeight: 700,
            background: t.includes("★") ? g.color + "22" : "#0d1117",
            color: t.includes("short") ? "#ff6b6b" : t.includes("long") ? "#00d4aa" : g.color,
          }}>{t}</div>
        ))}
      </div>
    </div>
  ));
}

function ShortingTab() {
  const steps = [
    ["Borrow", "Borrow 100 PLTR shares at $137.50", "#4fc3f7"],
    ["Sell High", "Sell borrowed shares = $13,750 cash", "#00d4aa"],
    ["Wait", "Stock drops to $120", "#ffab40"],
    ["Buy Low", "Buy back 100 shares at $120 = $12,000", "#ff6b6b"],
    ["Profit", "Return shares. Keep $1,750 difference.", "#00d4aa"],
  ];
  const comp = [
    ["Max Loss", "UNLIMITED ⚠️", "$635 (premium)"],
    ["Capital", "~$6,875 margin", "$635"],
    ["Time Decay", "None", "Against you daily"],
    ["Risk", "Unlimited upside risk", "Capped at premium"],
  ];
  return (
    <div>
      <Box>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 10 }}>How Shorting Works</div>
        {steps.map(([label, desc, color], i) => (
          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: 12, background: color + "22", color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i+1}</div>
            <div><span style={{ color, fontWeight: 700, fontSize: 13 }}>{label}</span> <span style={{ fontSize: 12, color: "#aaa" }}>— {desc}</span></div>
          </div>
        ))}
        <div style={{ background: "#ff6b6b12", border: "1px solid #ff6b6b33", borderRadius: 6, padding: 10, marginTop: 10, fontSize: 12, color: "#ccc" }}>
          <strong style={{ color: "#ff6b6b" }}>Danger:</strong> PLTR goes to $200? You lose $6,250. To $300? $16,250. <strong>No cap.</strong> Your put caps loss at $635.
        </div>
      </Box>
      <Box>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Short Stock vs Buy Put (You)</div>
        {comp.map(([m, s, p], i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "6px 0", borderTop: i ? "1px solid #222" : "none", fontSize: 12 }}>
            <span style={{ color: "#888", fontWeight: 600 }}>{m}</span>
            <span style={{ color: s.includes("UNLIMITED") ? "#ff6b6b" : "#888" }}>{s}</span>
            <span style={{ color: "#00d4aa" }}>{p}</span>
          </div>
        ))}
      </Box>
    </div>
  );
}

function StopLossTab() {
  const types = [
    ["Fixed Dollar", "#4fc3f7", "\"Sell if put drops to $3.17\""],
    ["Percentage", "#ffab40", "\"Sell if option loses 50%\""],
    ["Stock Price", "#00d4aa", "\"Sell put if PLTR > $150\""],
  ];
  const stopSteps = [
    "Positions tab → find PLTR put",
    "Right-click → Create Closing Order",
    "Change order type: Limit → Stop",
    "Set stop price (e.g., $3.18 = 50%)",
    "Time-in-Force → GTC (stays active)",
    "Review & Send",
  ];
  const bracketSteps = [
    "Open a NEW order or go to Positions → right-click PLTR put",
    "Select 'Bracket Order' (or '#' icon in order bar)",
    "Three legs appear: Entry (your buy), Profit Target (limit sell), Stop Loss (stop sell)",
    "Set Profit Target: Limit price = $9.53 (your +50% exit)",
    "Set Stop Loss: Stop price = $3.18 (your -50% floor)",
    "Both legs are OCO — when one fills, the other cancels automatically",
    "Time-in-Force → GTC on both legs",
    "Review & Send — now you have BOTH exits working 24/7",
  ];
  const [showBracket, setShowBracket] = useState(false);
  return (
    <div>
      <Box>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 6 }}>What is a Stop Loss?</div>
        <p style={{ fontSize: 12, color: "#aaa", lineHeight: 1.7, margin: 0 }}>
          Pre-set order that automatically sells at a price you choose. Removes emotion.
          Ed: <strong style={{ color: "#ff6b6b" }}>mandatory on every position.</strong>
        </p>
      </Box>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
        {types.map(([t, c, d], i) => (
          <Box key={i} style={{ borderLeft: `3px solid ${c}`, marginBottom: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: c, marginBottom: 4 }}>{t}</div>
            <div style={{ fontSize: 11, color: "#aaa" }}>{d}</div>
          </Box>
        ))}
      </div>
      <Box>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Your PLTR $120 PUT Example</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
          <div style={{ textAlign: "center", padding: 10, background: "#0d1117", borderRadius: 6 }}>
            <div style={{ fontSize: 11, color: "#888" }}>Entry</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#4fc3f7" }}>$6.35</div>
          </div>
          <div style={{ textAlign: "center", padding: 10, background: "#0d1117", borderRadius: 6 }}>
            <div style={{ fontSize: 11, color: "#888" }}>Stop Loss (-50%)</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#ff6b6b" }}>$3.18</div>
          </div>
          <div style={{ textAlign: "center", padding: 10, background: "#0d1117", borderRadius: 6 }}>
            <div style={{ fontSize: 11, color: "#888" }}>Profit Target (+50%)</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#00d4aa" }}>$9.53</div>
          </div>
        </div>
        <div style={{ fontSize: 11, color: "#666", marginBottom: 8 }}>Current value: ~$8.75 — already near your +50% target. Discuss exit strategy with Ed.</div>
        <div style={{ background: "#00d4aa12", borderRadius: 5, padding: 8, fontSize: 11, color: "#aaa" }}>
          <strong style={{ color: "#00d4aa" }}>Risk/Reward Ratio:</strong> Risking $3.17 to make $3.18 = roughly 1:1 R/R. Ed will help you dial this in — many pros aim for 2:1 or 3:1 (risk less to gain more). You could tighten the stop to -30% ($4.45) for a better ratio.
        </div>
      </Box>
      <Box>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Setting a Simple Stop Loss in Tastytrade</div>
        {stopSteps.map((s, i) => (
          <div key={i} style={{ fontSize: 12, color: "#aaa", marginBottom: 5 }}>
            <span style={{ color: "#4fc3f7", fontWeight: 700 }}>{i+1}.</span> {s}
          </div>
        ))}
        <div style={{ background: "#ffab4012", borderRadius: 5, padding: 8, marginTop: 8, fontSize: 11, color: "#aaa" }}>
          <strong style={{ color: "#ffab40" }}>Note:</strong> Options spreads widen off-hours. Some use alerts instead of hard stops. Ask Ed.
        </div>
      </Box>
      <Box style={{ border: "1px solid #4fc3f755" }}>
        <div onClick={() => setShowBracket(!showBracket)} style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#4fc3f7", marginBottom: 2 }}>Bracket Order (OCO) — The Full Package</div>
            <div style={{ fontSize: 11, color: "#888" }}>Sets BOTH your profit target AND stop loss in one order. When one fills, the other auto-cancels.</div>
          </div>
          <span style={{ color: "#4fc3f7", fontSize: 18 }}>{showBracket ? "−" : "+"}</span>
        </div>
        {showBracket && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 12, color: "#aaa", lineHeight: 1.7, marginBottom: 12 }}>
              A <strong style={{ color: "#fff" }}>bracket order</strong> wraps your position with two exits: a limit order at your profit target and a stop order at your max loss.
              They're linked as an <strong style={{ color: "#4fc3f7" }}>OCO (One Cancels Other)</strong> — the moment one fills, the platform kills the other automatically.
              This means you set it and walk away. No watching the screen, no emotion, no missed exits.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
              <div style={{ textAlign: "center", padding: 10, background: "#0d1117", borderRadius: 6, border: "1px solid #4fc3f733" }}>
                <div style={{ fontSize: 10, color: "#888" }}>LEG 1: Entry</div>
                <div style={{ fontSize: 11, color: "#4fc3f7", fontWeight: 700 }}>BUY PUT</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>$6.35</div>
                <div style={{ fontSize: 10, color: "#555" }}>Already filled</div>
              </div>
              <div style={{ textAlign: "center", padding: 10, background: "#0d1117", borderRadius: 6, border: "1px solid #00d4aa33" }}>
                <div style={{ fontSize: 10, color: "#888" }}>LEG 2: Take Profit</div>
                <div style={{ fontSize: 11, color: "#00d4aa", fontWeight: 700 }}>SELL LIMIT</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>$9.53</div>
                <div style={{ fontSize: 10, color: "#555" }}>Auto-sells at +50%</div>
              </div>
              <div style={{ textAlign: "center", padding: 10, background: "#0d1117", borderRadius: 6, border: "1px solid #ff6b6b33" }}>
                <div style={{ fontSize: 10, color: "#888" }}>LEG 3: Stop Loss</div>
                <div style={{ fontSize: 11, color: "#ff6b6b", fontWeight: 700 }}>SELL STOP</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>$3.18</div>
                <div style={{ fontSize: 10, color: "#555" }}>Auto-sells at -50%</div>
              </div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Setting a Bracket in Tastytrade</div>
            {bracketSteps.map((s, i) => (
              <div key={i} style={{ fontSize: 12, color: "#aaa", marginBottom: 5 }}>
                <span style={{ color: "#4fc3f7", fontWeight: 700 }}>{i+1}.</span> {s}
              </div>
            ))}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
              <div style={{ background: "#00d4aa12", borderRadius: 5, padding: 8, fontSize: 11, color: "#aaa" }}>
                <strong style={{ color: "#00d4aa" }}>Why use a bracket:</strong> Removes the need to watch the position. You have a plan for both outcomes BEFORE either happens. Ed's Apple calls got stopped out on 3/31 — his bracket handled it automatically while he was busy.
              </div>
              <div style={{ background: "#ff6b6b12", borderRadius: 5, padding: 8, fontSize: 11, color: "#aaa" }}>
                <strong style={{ color: "#ff6b6b" }}>Watch out for:</strong> Options brackets can trigger during wide spread periods (pre-market, low volume). Some traders use a bracket on the STOCK PRICE as a mental trigger instead — then manually close the option. Ask Ed which he prefers.
              </div>
            </div>
          </div>
        )}
      </Box>
    </div>
  );
}

export default function Dashboard() {
  const [tab, setTab] = useState(0);
  return (
    <div style={{ background: "#0d1117", color: "#e0e0e0", minHeight: "100vh", padding: 20, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: "0 0 2px" }}>Go Maz — Options Trading Dashboard</h1>
        <p style={{ fontSize: 12, color: "#555", margin: "0 0 16px" }}>Brandon + Ed · March 31, 2026</p>
        <div style={{ display: "flex", gap: 2, borderBottom: "1px solid #222", marginBottom: 18 }}>
          {tabs.map((t, i) => (
            <button key={i} onClick={() => setTab(i)} style={{
              padding: "8px 14px", border: "none", background: "none", cursor: "pointer", fontSize: 12,
              borderBottom: tab === i ? "2px solid #4fc3f7" : "2px solid transparent",
              color: tab === i ? "#fff" : "#555", fontWeight: tab === i ? 700 : 400,
            }}>{t}</button>
          ))}
        </div>
        {tab === 0 && <LearningMap />}
        {tab === 1 && <WatchlistTab />}
        {tab === 2 && <ShortingTab />}
        {tab === 3 && <StopLossTab />}
      </div>
    </div>
  );
}
