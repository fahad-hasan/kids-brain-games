# Kids Brain Games

Games for young kids that practise patterns, planning, memory and problem solving.
Plain static files, no build step. Installable as one app (PWA) that works offline.

Live: https://fahad-hasan.github.io/kids-brain-games/

## Games

| Folder | Game | Skills |
|---|---|---|
| `rocket-star-catcher/` | Rocket Star Catcher | Patterns, numbers, planning, memory |
| `block-quest/` | Block Quest | Planning (dig the cheapest tunnel), rules from examples (crafting), cause and effect (water flow) |

## Adding a game

1. Put the game in its own folder, e.g. `block-quest/index.html`. Use `../fonts/` for the shared font, and link `../` for the "All games" button.
2. Add a 600×450 screenshot as `thumbs/<folder>.jpg`.
3. Add an entry to the `GAMES` list in `index.html`.
4. Add the new files to `FILES` in `sw.js` and bump `VERSION` (e.g. `v2`), so installed copies update.

## Run locally

`python3 -m http.server` in this folder, then open http://localhost:8000.
Service workers need HTTPS or localhost.
