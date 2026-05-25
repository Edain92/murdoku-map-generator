# Murdoku Studio

> ⚠️ **Disclaimer:** This is an independent, unofficial fan project with no affiliation to, endorsement by, or connection with the creators, publishers, or rights holders of Murdoku. "Murdoku" is a registered trademark of its respective owners. This tool was built for personal use by a fan of logic puzzle games and is shared freely with the community. No copyrighted content from the original game is reproduced here.

> Interactive companion tool for deduction puzzle fans. Build boards, create custom rooms, place suspects, and track logic-based mystery games.

---

## Visual Identity

Murdoku Studio follows a **retro detective · editorial minimalism** aesthetic:
- Serif noir typography (Playfair Display) for the wordmark
- Monospace (Courier) for all UI text — typewriter feel
- Paper-like backgrounds, heavy ink borders, no shadows or gradients
- Restrained color palette: Paper White, Ink Black, Detective Gray, Blood Red, Evidence Green

---

## Features

### Map Setup Phase
- Configure suspect range (e.g. `a-h`), grid size, and number of rooms
- Draw rooms freehand by dragging — supports irregular shapes (L, T, U, etc.)
- Place blocking obstacles: 🟫 Table, 📺 TV, 🪴 Plant
- Place occupiable obstacles (suspects can go on top): 🟥 Rug, 🛋️ Sofa, 💧 Water, 🛏️ Bed
- Save full board configurations — persists across sessions

### Game Phase
- Long press to place suspects — automatically crosses row and column
- Victim marked in Evidence Green
- Red discard marking for clue-based cell elimination
- Validation: no duplicates, no placement on crossed cells
- Erase and restore the board at any point

---

## Color Palette

| Token | Hex | Usage |
|---|---|---|
| Paper White | `#F2F1EE` | Background |
| Ink Black | `#111111` | Text, borders, buttons |
| Detective Gray | `#9A9A96` | Secondary text |
| Blood Red | `#C6453D` | Discard, errors |
| Evidence Green | `#4B7A43` | Victim, confirmations |
| Rug | `#D98B8B` | Obstacle fill |
| Bed | `#D8C79E` | Obstacle fill |
| Water | `#A9C7DF` | Obstacle fill |
| Sofa | `#C9B3D9` | Obstacle fill |

---

## Roadmap

- [ ] Named rooms (e.g. Cubicle 1, Break Room…)
- [ ] Zone rule: within the same room, a crossed row/column can still be occupied
- [ ] Suspect clue markers on specific cells
- [ ] Solution validation and killer detection
- [ ] Board photo detection (AI-assisted grid extraction)
- [ ] Publish to Vercel / itch.io

---

## Tech Stack

- React 18 + Vite
- Zero external UI dependencies
- Modular architecture: constants / utils / hooks / components
- Dual storage: Artifact Storage API (Claude.ai) or localStorage (standalone)

## Getting Started

```bash
npm install
npm run dev
```

Or open `murdoku.jsx` directly as an artifact in [Claude.ai](https://claude.ai).

---

## Contributing

Contributions are welcome! This project is open to anyone who wants to help improve it.

1. **Fork** this repository
2. **Create a branch**: `git checkout -b feature/your-feature`
3. **Commit**: `git commit -m "feat: description"`
4. **Push**: `git push origin feature/your-feature`
5. **Open a Pull Request** against `master`

Bug reports and feature suggestions welcome via [Issues](../../issues).

---

## License

[MIT](LICENSE) — includes trademark notice regarding the Murdoku name.
