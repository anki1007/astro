Planetary Aspect Terminal: guide for new users

The suite is a single HTML file holding seven terminals and a home screen. The Deck (◎) is the home screen: it shows the live sky wheel, upcoming events and a card for each terminal. Switch terminals from the top bar, with Alt+0–7, or with [ and ]. Ctrl/⌘ K opens a search box to jump anywhere. Setups saves a terminal’s inputs so you can reuse them.

These are research tools that encode published texts. Where a terminal has been tested against market data, its note on evidence is included below. Read those notes before acting on any output.

T1 · Aspects (⚹)
The Mars–Jupiter 60° project. It lists every planetary aspect in a chosen month, with D1 (rāśi) and D9 (navāṁśa) charts. For each aspect it shows which planet wins the Drashta–Drashya (aspecting vs. aspected planet) contest and the declination phase, and draws an impact calendar. It can also run an event study of any planet pair against any index.
Source: no single book. It is an original aspect-analysis framework using standard Vedic conventions.

T2 · Tezi-Mandi (◈)
A rulebook engine for tezi (bullish) and mandi (bearish) calls. It covers twelve bodies, 36 aspect classes, shelter-sign lordship, and Shadbala and nakshatra layers, across ten views running from a monthly ledger down to intraday. An optional mode reads the D9 chart as primary.
Source: Pt. Motilal Nagar, Vyapar Ratna.
Evidence: a 2010–2026 backtest of whether planetary latitude changes aspect impact on NIFTY and the S&P found no effect.

T3 · Money Matters (❖)
A forecast built from fourteen weighted “lanes” (separate rule families), each scored daily. They include navāṁśa Table 29, significators, aspects, trends, the Sarvatobhadra chakra, heliacal states, eclipses and ingresses. It includes a backtest and a weight optimiser, and defaults to New York / NASDAQ.
Source: Vedic Astrology in Money Matters (518 pp, 14 chapters). The author isn’t recorded in my notes, so check the title page.
Evidence: its own 40-year NASDAQ fit averages a monthly correlation of about +0.07. Rolling out-of-sample, that drops to about +0.01, which is essentially noise.

T4 · McWhirter (☊)
Tracks McWhirter’s business cycle driven by the North Node, shown on a dial with its upcoming sign changes. It also covers lunations on the NYSE chart and daily turning points, all drawn against the Dow.
Source: Louise McWhirter, Astrology and Stock Market Forecasting (1938).

T5 · Helio (☼)
Covers space weather (geomagnetic storms, the solar cycle and NOAA’s 27-day outlook), graded by strength of evidence and measured against your indices. It only scores channels with measurable effects. Planetary gravity, lunar phase and galactic-motion ideas are deliberately excluded.
Sources: data from GFZ Potsdam (Kp/Ap indices), SILSO (sunspot numbers) and NOAA SWPC. The research base includes Krivelyova & Robotti (2003, Federal Reserve Bank of Atlanta) on lower stock returns after geomagnetic storms.

T6 · Attri 101 (✶)
Produces dated triggers from 101 astrological combinations, key-date reversals and a monthly Nifty outlook, and includes a backtest you can run in the terminal. It uses the tropical zodiac and works from the Nifty natal chart of 3 July 1990.
Source: Krishna Attri, 101 Astro Combination for Nifty Prediction (Attri Forecast Co., 2017). It also includes rules the author quotes from Butaney, Ghose, Bayer and others.
Evidence: on 2007–2026 NIFTY data the combined score performs about the same as the base rate, meaning no better than chance. Most single rules are indistinguishable from chance, and the author’s claimed hit rates were not reproduced.

T7 · Ashtakavarga (❋)
The whole Ashtakavarga system from the book:

	•	Tables: the Prastāra, Bhinna and Sarva tables, including both reductions (trikoṇa and ekādhipatya).
	•	Chakra plate: the Sarvacañcacakra, with transits and animation.
	•	Transits and timing: kakṣyā (sub-sign) transit ephemeris, āyus (longevity) and daśā timing.
	•	Market tab: a standalone view that needs no birth chart.

Positions come from Swiss Ephemeris with the Lahiri ayanāṁśa. The engine checks itself against the book’s worked examples (57 checks).
Source: C. S. Patel & C. A. S. Aiyar, Ashtakavarga (1957). Every rule is cited to chapter, verse and page.
Evidence: it has no backtest and no grading model. The market tab shows only the book’s own parameters: bindus, BAV (bindus per planet), SAV (total bindus), kakṣyā bindus and the aggregate transit score. The book wrote its readings for natal charts, so in transit-only mode they are shown for reference only.
