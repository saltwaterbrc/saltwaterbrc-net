# Ed's Options Trading Method — What We Know So Far

**Last Updated:** 2026-04-02
**Status:** ~75% mapped — gaps marked with ❓ for Ed to fill in

---

## 1. Macro Read (Top-Down)

Before touching any trade, Ed reads the overall market environment.

- **Risk-On vs Risk-Off (KEY FRAMEWORK — from Ed 4/2/26):**
  - **Risk ON** = market is accepting risk. Bad news can be good ("already priced in"). Bullish sentiment.
  - **Risk OFF** = market is fleeing risk. Good news can be bad ("not enough"). Bearish sentiment.
  - Ed looks at the chart pattern FIRST, then asks: **is the market risk-on or risk-off?**
  - The same news event hits completely differently depending on which mode the market is in
  - Ed's quote: "When I look at a chart, the only other thing I look at is the pattern and then I try to determine is risk on or risk off. If risk is on, bad news could be good. If risk is off, good news could be bad."
  - **Current read (4/2/26):** Risk OFF — Ed expected last night's news wouldn't deliver what the market hoped for

- **Call screener check:** Is the screener a "full page" of calls? → Bullish. Thin? → Cautious. (Currently thin: only Brazilian ETF, AMD, NEO)
- **Market sentiment:** Bear market rally bounce right now — Ed is stepping aside from active trading
- **Macro plays:** TLT short (rates stay high), GLD long (inflation hedge), SLV
- **BlackRock alignment:** Their neutral downgrade on 3/23/26 confirms Ed's caution

~~❓ **Ask Ed:** Does he have a specific checklist or scoring system for macro? Or is it intuition from experience?~~ **PARTIALLY ANSWERED (4/2):** Chart pattern + risk-on/risk-off determination. Two-step process.
❓ **Ask Ed:** "What are the top 3 things you check to determine risk-on vs risk-off?" We can infer call screener fullness, MA alignment, premium flow, and news reaction — but need his specific hierarchy.

---

## 2. Stock Selection

How Ed picks WHICH stock to trade.

- Uses charting to identify setups on specific stocks
- Watches Unusual Whales scanner for unusual activity (GEX, premium flow, net gamma)
- Focuses on liquid names with tight bid/ask spreads (like PLTR's $0.20 spread)
- Sector awareness — currently watching cybersecurity as a thematic play

❓ **Ask Ed:** Does he have a screener filter or watchlist rotation? How does he narrow from "the whole market" to a specific stock?

---

## 3. Charting Analysis (Direction)

Ed charts BEFORE looking at the options chain. This determines bullish vs bearish.

**Indicators he uses (confirmed):**

| Indicator | What He Looks For |
|-----------|-------------------|
| Support & Resistance | Multiple candle top/bottom connections on weekly chart |
| Moving Averages (20/50) | Inverted (20 below 50) = bearish. Price below both = strong bearish |
| RSI | Trend direction matters more than the number. PLTR at 44% |
| Volume & A/D | Compare to average. A/D trend > raw number. Bar display, length 4.75 |

**Chart patterns he prioritizes:**

1. **Descending triangle** — downtrend continuation (demonstrated on PLTR)
2. **Cup with handle** — uptrend signal (NEO example)
3. **Head & shoulders** — most powerful reversal signal

❓ **Ask Ed:** Does he use any specific timeframe hierarchy? (e.g., weekly for trend, daily for entry?) How many indicators need to agree before he enters?

---

## 4. Options Chain Entry Criteria

Once direction is confirmed via charting, Ed goes to the chain.

**What we know:**

| Parameter | Ed's Target | Reason |
|-----------|-------------|--------|
| Delta (ITM%) | **~50Δ (ATM)** | Near the money, ~50% chance of expiring ITM. Maximum responsiveness to price movement. Higher cost but higher probability of profit. |
| DTE | **60+ days minimum** | Stay above the theta decay cliff. Avoids the steep part of the curve |
| IVR | Checks percentile rank | Wants context — is IV high or low for THIS stock? |
| Trade size | **~$200 per trade** | Build a population of small bets |
| Bid/Ask spread | Tight preferred | Tight = liquid, easy entry/exit. Wide = expensive |

**What this looks like in practice:**
> Find a stock with a clear chart setup → Go to the options chain → Find the ~50Δ (ATM) strike with 60+ DTE → Check IVR for context → Size to 1-3% of account → Enter

❓ **Ask Ed:** Does he have a specific IVR threshold? (e.g., only buy when IVR < 30? Only sell when IVR > 50?)
❓ **Ask Ed:** How does he decide between calls vs puts beyond chart direction? Any Greek-specific filters?
❓ **Ask Ed:** Does he look at open interest or volume on specific strikes?

---

## 5. Risk Management (Before Entry)

Ed sets risk parameters BEFORE entering the trade.

**Confirmed rules:**

- **1% / 2% / 3% per trade:** Ed sizes trades at 1%, 2%, or 3% of total account assets. On a $5K account: $50 / $100 / $150 per trade. This creates a challenge on small accounts since most option contracts cost $300+.
- **30% Rule:** Never risk more than 30% of account on a single position — this is the CEILING, not the target. Ties to 1σ = 30% of the time it goes against you.
- **Mandatory stop loss:** Every position, no exceptions. Even 3% allocations
- **Bracket/OCO order:** Set both profit target and stop loss at entry. When one fills, the other cancels

**Ed's proof it works:** His Apple calls got stopped out on 3/31. The system handled it automatically while he was busy. No emotion, no missed exit.

❓ **Ask Ed:** What's his standard stop loss percentage? (We used -50% as an example)
❓ **Ask Ed:** What's his standard profit target? (We used +50% as an example)
❓ **Ask Ed:** Does he target a specific risk/reward ratio? (1:1? 2:1? 3:1?)
❓ **Ask Ed:** How does he handle 1-3% sizing on a small account where contracts cost $300+? Does he use spreads? Weeklies? Or accept higher % until the account grows?

---

## 6. Position Management (While In Trade)

What Ed does between entry and exit.

**What we know:**

- Monitors delta/ITM% movement — if it's climbing toward 50Δ, the trade is working
- Watches IVR changes — IV expansion helps buyers, IV crush hurts
- Stays aware of theta burn rate — safe above 60 DTE, danger below 45
- Checks scanner for changes in GEX/flow that might invalidate the thesis

**What we don't know:**

❓ **Ask Ed:** Does he ever roll positions? (e.g., roll out to a later expiration to avoid theta?)
❓ **Ask Ed:** Does he scale in (add to winners) or scale out (sell partial positions)?
❓ **Ask Ed:** Does he adjust stop losses as the trade moves in his favor? (trailing stop?)
❓ **Ask Ed:** At what point does he manually exit vs let the bracket handle it?

---

## 7. Exit Process

How Ed closes trades.

**Automated exits (bracket order):**

- **Profit target hit** → Limit sell triggers, stop loss auto-cancels
- **Stop loss hit** → Stop sell triggers, profit target auto-cancels
- Example: Ed's AAPL calls → stop triggered → automatic exit → no manual intervention needed

**Manual exits (situations we need to clarify):**

❓ **Ask Ed:** Does he ever exit early based on changing macro conditions?
❓ **Ask Ed:** Does he exit if the chart pattern breaks/invalidates?
❓ **Ask Ed:** What about time-based exits? (e.g., close at 45 DTE regardless to avoid theta cliff?)
❓ **Ask Ed:** If a trade hits +30% but not the full target, does he ever take partial profits?

---

## 8. Ed's Philosophy (Overarching)

The mental framework behind the method.

- **"Be the casino, not the gambler"** — Sized trades at 1-3% of account, near ATM (50Δ) for real probability of profit
- **Poker analogy:** A pro never loses their stake. Risk management > being right on direction
- **Population-based thinking:** Any single trade can lose. Over 30-50 trades at 20Δ, the math works
- **Remove emotion:** Bracket orders, stop losses, and rules do the work. No watching screens and panicking
- **Know when to sit out:** Bear market rally? Step aside. Don't force trades in bad environments

---

## Summary: The Method at a Glance

```
MACRO READ → is the environment favorable?
    ↓ yes
STOCK SELECTION → scanner + watchlist → pick a name
    ↓
CHART IT → S&R, MAs, RSI, Volume → determine direction
    ↓ clear setup
OPTIONS CHAIN → find 20Δ strike, 60+ DTE, check IVR
    ↓
SIZE IT → ~3% of account (~$200 target)
    ↓
SET BRACKET → profit target + stop loss → OCO
    ↓
WALK AWAY → let the system work
    ↓
EXIT → bracket handles it, or manual override if thesis changes
```

---

## Questions for Next Ed Session

1. IVR entry threshold — what number does he look for?
2. Standard stop loss and profit target percentages
3. Risk/reward ratio target
4. Rolling positions — does he do it? When?
5. Scaling in/out — partial profits or all-or-nothing?
6. Time-based exits — does he close before theta cliff?
7. How many indicators need to agree before entry?
8. Stock selection process — screener filters?
9. Manual exit triggers — what makes him override the bracket?
10. Trailing stops — does he adjust as trade moves in his favor?
