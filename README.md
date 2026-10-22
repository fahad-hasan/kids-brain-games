# Kids Brain Games

Games for young kids that practise patterns, planning, memory and problem solving.
Plain static files, no build step. Installable as one app (PWA) that works offline.

Live: https://fahad-hasan.github.io/kids-brain-games/

## Games

| Folder | Game | Skills |
|---|---|---|
| `rocket-star-catcher/` | Rocket Star Catcher | Patterns, numbers, planning, memory |
| `block-quest/` | Block Quest | Gem Mines (route planning), Crafting Hut (rules from examples), Farm Fields (cause and effect), Builder's Yard (3D views), Village Market (multi-step trades, working backwards) |
| `brickville/` | Brickville | Obby Tower (sequencing and timing), Escape Rooms (deduction, number patterns, logic), Tycoon Town (money maths, planning ahead), Colour Switch (timing, thinking steps ahead), Castle Defence (spatial strategy) |
| `flip-find/` | Flip & Find | Memory (4×4 pairs; Easy peek, Normal, Tricky look-alike colours) |
| `clue-club/` | Clue Club | Rule Detective (test ideas to find a hidden rule), Who Did It? (weigh evidence, ignore unreliable witnesses); every puzzle generated fresh, with a per-player list of seen puzzles so nothing repeats |

## Players and scores

`shared/profiles.js` gives every game the same player system (`window.KBG`). Each player's data is kept
separately in this browser's localStorage:

- `KBG.get(game, fallback)` / `KBG.set(game, data)`: the current player's saved progress
- `KBG.record(game, { stars: 12, level: 3 })`: counts a play and keeps each number's best and running total
- `KBG.scores(game)`: `{ plays, best, total, last }` for the menu and scoreboard

## Adding a game

1. Put the game in its own folder, e.g. `block-quest/index.html`. Use `../fonts/` for the shared font, link `../` for the "All games" button, and load `../shared/profiles.js` to save per player.
2. Add a 600×450 screenshot as `thumbs/<folder>.jpg`.
3. Add an entry to the `GAMES` list in `index.html` (with a `stats` function for the card and scoreboard).
4. Add the new files to `FILES` in `sw.js` and bump `VERSION` (e.g. `v2`), so installed copies update.

## Run locally

`python3 -m http.server` in this folder, then open http://localhost:8000.
Service workers need HTTPS or localhost.
