# Murdoku Map Generator

> ⚠️ **Disclaimer:** This is an independent, unofficial fan project with no affiliation to, endorsement by, or connection with the creators, publishers, or rights holders of Murdoku. "Murdoku" is a registered trademark of its respective owners. This tool was built for personal use by a fan of logic puzzle games and is shared freely with the community. No copyrighted content from the original game is reproduced here.

An interactive board builder and game tracker for logic deduction puzzles inspired by **Murdoku**-style grid games, built with React.

---

## Features

### Setup Phase
- Configure the game with a suspect range (e.g. `a-h`), grid dimensions, and number of rooms
- Draw rooms freehand by dragging over cells — supports irregular shapes (L, T, U, etc.)
- Place blocking obstacles: 🟫 Table, 📺 TV, 🪴 Plant
- Place occupiable obstacles (suspects can be placed on top): 🟥 Rug, 🛋️ Sofa, 💧 Water, 🛏️ Bed
- Save full configurations with board state (rooms, obstacles, placed pieces) — persists across sessions

### Game Phase
- Place suspects with a long press — automatically crosses out their entire row and column
- Victim marked in green
- Manual cell discard in red (for eliminating cells based on clues)
- Validation: each suspect can only be placed once; cannot be placed on already crossed cells
- Erase suspects and restore the board to its previous state

---

## Roadmap

The following features are planned and open for contribution:

- [ ] Named rooms (e.g. Cubicle 1, Break Room, Boss's Office…)
- [ ] Zone rule: within the same room, a crossed row/column can still be occupied by another suspect
- [ ] Suspect clue markers printed on specific cells
- [ ] Solution validation and killer detection
- [ ] Board detection from photo (AI-assisted grid extraction)
- [ ] Improved mobile UX and accessibility

---

## Tech Stack

- React (JSX, hooks)
- No external dependencies
- Persistence via Artifact Storage API (Claude.ai)

## How to Use

Open `murdoku.jsx` as an artifact in [Claude.ai](https://claude.ai/public/artifacts/83285fc4-3e65-4e02-baca-5835edfcff90) to run it directly in the browser. No build step required.

---

## Contributing

Contributions are welcome and appreciated! This project is open to anyone who wants to help improve it.

### How to contribute

1. **Fork** this repository
2. **Create a branch** for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit** your changes with a clear message:
   ```bash
   git commit -m "feat: add room naming support"
   ```
4. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request** against the `master` branch with a description of what you changed and why.

### Guidelines

- Keep PRs focused — one feature or fix per PR
- Comment your code where the logic isn't immediately obvious
- If you're picking up an item from the Roadmap, mention it in the PR description
- Bug reports and feature suggestions are also welcome via [Issues](../../issues)

### Good first issues

If you're new to the project, look for items tagged `good first issue` in the Issues tab. The Roadmap section above is also a great starting point.

---

## License

This project is released under the [MIT License](LICENSE). You are free to use, modify, and distribute it, provided the original disclaimer regarding the Murdoku trademark is retained.
