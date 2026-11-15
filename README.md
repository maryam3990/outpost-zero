# Outpost Zero: Run a Moon Base (NASA Space Apps)
Browser game for kids 7-12. Split 8 power per sol across Life support, Grow lights, Shielding and Science over 14 sols.
Three meters: Air, Radiation dose, Science. Every choice costs another (no safe option). Ghost preview shows tomorrow's result.

## Run
Open `index.html` in any browser (no install, no account). Live mode needs internet; otherwise it falls back to archive.
Or: `python3 -m http.server` then visit http://localhost:8000

## Modes
- Real sky (LIVE): last 14 days of flares from NASA DONKI become the daily storm level.
- Halloween 2003 / May 2024 (ARCHIVED): real flare classes mapped to storm levels.
- Random sky (SIMULATED): for practice and replayability.

## Files
index.html, style.css, game.js (logic), data.js (archived data), DATA_SOURCES.md
Replace `DEMO_KEY` in game.js with your own free key from https://api.nasa.gov if rate-limited.
