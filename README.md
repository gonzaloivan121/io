# io

`io` is an experimental browser-based game-engine template for .io-style experiences built with Angular and a custom 2D canvas engine. The current version includes a viewport-driven game loop, entity simulation, camera follow, input handling, UI overlays, and a network layer scaffold for future multiplayer work.

## What the project includes

The codebase now reflects a more complete prototype than a simple starter app:

- A canvas-based viewport rendered through an Angular component.
- A custom engine loop with renderer, timing, screen, cursor, and event utilities.
- Core gameplay objects such as players, enemies, points, and a game map.
- Camera and transform systems for world navigation and follow behavior.
- Keyboard, mouse, gamepad, and touch-style input support.
- Pause, restart, fullscreen, and in-game UI controls.
- A network subsystem with client/server abstractions and payload types for future multiplayer integration.

## Current project status

This project is intentionally experimental and should be considered a living prototype. The architecture, APIs, and file organization may change significantly in the near or far future as the engine evolves.

## Architecture overview

The project is organized around a modular engine structure:

- `src/app/components/viewport/viewport.component.ts` wires the canvas to the engine.
- `src/app/core/application/io.application.ts` drives the gameplay loop and scene updates.
- `src/app/core/engine/` contains the renderer, time, events, screen, cursor, and engine orchestration.
- `src/app/core/input/` handles keyboard, mouse, gamepad, and virtual joystick input.
- `src/app/core/network/` provides client/server scaffolding for future networked play.
- `src/app/core/ui/` contains UI helpers and multiple visual themes.

## Gameplay and controls

The current application already supports:

- Pause/resume through the UI and keyboard shortcuts.
- Restarting the session from the pause state.
- Fullscreen toggling.
- Gamepad connection and button input handling.
- Mobile-friendly virtual joystick behavior through the input layer.

Common controls in the current build include:

- `Esc` to pause or resume.
- `R` to restart while paused.
- `F` to toggle fullscreen.
- Gamepad buttons and axes are handled by the engine input system.

## Technology stack

- Angular 22 for the application shell and component structure.
- TypeScript for the engine and gameplay systems.
- HTML Canvas for real-time rendering.
- Vitest for unit testing.

## Getting started

### Prerequisites

- Node.js (LTS recommended)
- npm

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm start
```

Then open `http://localhost:4200/`.

### Build the project

```bash
npm run build
```

### Run tests

```bash
npm test
```

## Why this project exists

`io` is intended as a reusable foundation for prototyping .io-style mechanics such as movement, growth, collisions, camera behavior, and interaction loops without starting from scratch each time.

It is especially useful for experimenting with:

- Arcade-style survival gameplay.
- Camera and viewport behavior.
- Input abstraction across keyboard, mouse, and gamepad.
- A future multiplayer architecture.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for full details.
