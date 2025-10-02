# Agent Instructions

## Project Overview

Hexmeld is a turn-based puzzle game played on a hexagonal grid. It is designed as a web app that can be played offline and with no external dependencies.

## Development

- This game includes PWA features for enhanced functionality, but the core game must always remain fully playable offline using just the `index.html` file in a modern web browser, with no external dependencies. Ancillary features like the instructions page may be unavailable in this mode, but the game itself must work.
- Whenever you make changes to this repository, increment the `GAME_VERSION` constant in `index.html` so the displayed version is updated.
- Game should stay fairly simple and easy to maintain.

- Keep these instructions in mind for future updates as well.
