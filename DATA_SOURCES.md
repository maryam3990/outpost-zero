# Data sources and honesty notes
- **NASA DONKI (FLR endpoint)**: https://api.nasa.gov and https://kauai.ccmc.gsfc.nasa.gov/DONKI/ . LIVE mode fetches solar flares of the last 14 days; flare class X/M/C maps to storm level 3/2/1 (none = 0).
- **Archived scenarios** (data.js): Oct-Nov 2003 and May 2024 flare classes from NASA/NOAA records, approximate dates, simplified mapping. Badged ARCHIVED in game.
- **NASA OSDR** (https://osdr.nasa.gov): "Why?" cards link to radiation and plant biology research. Cards give general findings and links, not numbers pulled from OSDR.
- **Not real data**: power budget, dust events, meter formulas, and the Random sky are game simplifications (badged SIMULATED / explained in game).
- Flares are a proxy; true radiation hazard comes mainly from solar energetic particles (SEPs), which a future version could read from DONKI's SEP endpoint.
