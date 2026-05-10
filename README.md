# Mudae Solvers

A collection of interactive probability solvers for the [Mudae](https://discord.com/oauth2/authorize?client_id=289069816589262848) Discord bot's Ouro minigames.

**This is a fan-made project and is not affiliated with, endorsed by, or connected to the official Mudae Discord bot or its development team in any way.**

## Solvers

### Ouro Quest

Find 3 out of 4 hidden purple spheres on a 5x5 grid within 7 clicks. Clicking a purple sphere is free and doesn't count toward your click limit. Each revealed tile shows how many of its neighbors are purple (Minesweeper-style: blue=0, teal=1, green=2, yellow=3, orange=4).

The solver enumerates all valid configurations consistent with your revealed tiles and computes:
- **Probability** — the chance each unrevealed tile contains a purple sphere
- **Expected Value (EV)** — the point value you can expect from clicking each tile

### Ouro Chest

Find 1 hidden red sphere on a 5x5 grid within 5 clicks. Colors indicate the tile's spatial relationship to the red sphere:
- **Orange** — adjacent (including diagonals)
- **Yellow** — on the same diagonal
- **Green** — same row or column
- **Teal** — in the same line (row, column, or diagonal)
- **Blue** — not in any line with the red sphere

## Tech Stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Type check
pnpm typecheck

# Lint
pnpm lint

# Format
pnpm format
```

## License

[MIT](LICENSE) &copy; Shiron
