# Murdoku Map Generator

An interactive board generator and game tracker for the **Murdoku** puzzle game, built with React.

## Features

### Setup Phase
- Configure the game with a suspect range (e.g. `a-h`), grid dimensions, and number of rooms
- Draw rooms freehand by dragging over cells — supports irregular shapes (L, T, etc.)
- Place blocking obstacles: 🟫 Table, 📺 TV, 🪴 Plant
- Place occupiable obstacles (suspects can be placed on top): 🟥 Rug, 🛋️ Sofa, 💧 Water, 🛏️ Bed
- Save configurations with full board state (rooms, obstacles, placed suspects) — persists across sessions

### Game Phase
- Place suspects with a long press — automatically crosses out their entire row and column
- Victim marked in green
- Manual cell discard in red (for eliminating cells based on clues)
- Validation: each suspect can only be placed once; cannot be placed on crossed-out cells
- Erase suspects and restore the board to its previous state

## Tech Stack

- React (JSX, hooks)
- No external dependencies
- Persistence via Artifact Storage API

## How to Use

Open `murdoku.jsx` as an artifact in [Claude.ai](https://claude.ai) to play directly in the browser.

## Game Rules (Murdoku)

Murdoku is a logic deduction puzzle. Place each suspect in exactly one cell such that no two suspects share a row or column. Use the clues provided in the book to eliminate possibilities and find the killer.
