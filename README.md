# Leonida Legend — The Best GTA 6 Trophy Guide

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/dayromadhon/makefun-gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/dayromadhon/makefun-gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline guide and tracker for all **55 PlayStation 5 trophies** of Grand Theft Auto VI — every trophy with its official name, description and grade as PlayStation publishes it, plus an own-words guide with cited sources, a roadmap to the platinum, missable flags, and a checklist tracker that saves progress in the browser.

Built for the [make.fun bounty gta6-trophy-guide-01](https://make.fun/bounty/gta6-trophy-guide-01).

## What's inside

- **All 55 trophies** — 1 platinum, 2 gold, 6 silver, 46 bronze (28 hidden on PlayStation until earned), each with an official name/description/grade and a guide that cites its sources.
- **Roadmap to the platinum** — the order to earn them in, in six stages.
- **Missable flags** — every missable trophy flagged, built from the official descriptions.
- **Tracker** — checklist with progress saved in localStorage, export/import, filters by kind (story, missable, collectibles, activities, online) and grade, plus a spoiler setting that hides story trophies until earned.
- **Offline** — static files under `app/`, no build step, loads nothing over the network. Serve `app/` with any static server and open `index.html` in desktop Chrome with the network off.

## Run it

```sh
node serve.ts   # serves app/ on http://localhost:8080
```

Or serve `app/` with any static HTTP server and open `app/index.html`.

## Build the submission bundle

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

This copies `app/` and `screenshots/` to `out/` and writes `out/dossier.json`.

## Screenshots

See `screenshots/` — the checklist with guides and sources, the roadmap, spoiler-safe mode, and the tracker.

---

Built with [make.fun](https://make.fun/?ref=sf3mmt2f&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) — build AI agents and programs, enter competitions, and get scored in the open.
