# io

`io` is a canvas rendering and game engine template for building browser-based `.io` style multiplayer experiences (for example, games inspired by Agar.io). It provides a reusable foundation for camera control, entity updates, world rendering, input handling, and UI layering so you can focus on game-specific mechanics.

## Project Vision

The goal of `io` is to serve as a practical starter engine for fast iteration on top-down, real-time action games in the browser. It is designed to be:

- Modular: core systems are split into focused engine files.
- Extendable: new entities, rules, and rendering behaviors can be added without rewriting the base loop.
- Input-flexible: keyboard/mouse and gamepad controls are supported.
- Friendly to prototyping: ideal for experimenting with movement, collisions, camera behavior, and game feel.

## Important Stability Note

This project is intentionally evolving and should be considered experimental.

It is expected to be subject to major changes in the near or far future, including architecture updates, API reshaping, file organization changes, and gameplay system refactors.

## Core Capabilities

- Canvas-based render pipeline for 2D real-time gameplay.
- Engine loop components for timing, updates, and draw passes.
- Camera and viewport primitives for world-to-screen behavior.
- Entity-driven model for players, enemies, and map elements.
- Utility math and transform helpers for movement and spatial logic.
- Input abstraction for multiple control methods.
- Built-in gamepad support for analog and button-based interaction.

## Technology Stack

- Angular (application shell, structure, and development workflow)
- TypeScript (engine and gameplay code)
- HTML Canvas (render output)
- Vitest (unit testing)

## High-Level Structure

Key folders in `src/app/viewport/core/` include:

- `engine/` and engine primitives for update/render orchestration
- `application/` interfaces for app-level contracts
- `input/` for keyboard, mouse, and gamepad definitions
- `ui/` for in-canvas or engine-adjacent UI utilities
- Entity and world modules such as player, enemy, map, camera, and renderer

This separation allows gameplay systems to evolve independently while keeping the rendering and loop infrastructure reusable.

## Getting Started

### Prerequisites

- Node.js (current LTS recommended)
- npm

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm start
```

Then open `http://localhost:4200/`.

### Build for production

```bash
npm run build
```

### Run tests

```bash
npm test
```

## Why Use This Template

Use `io` if you want to:

- Prototype an Agar.io-like experience quickly.
- Build custom movement/combat/consumption mechanics on a clean base.
- Experiment with camera scale, world bounds, and responsive controls.
- Support gamepad input alongside desktop controls from the start.

## Current Scope

`io` is currently positioned as an engine template and experimentation sandbox, not a finalized framework. You should expect to tailor systems to your game and potentially adjust to breaking changes as the project matures.

## Contributing and Experimentation

Contributions, experiments, and refactors are welcome. If you are extending core behavior, prefer small, isolated changes so systems can continue evolving without tightly coupling gameplay code to current internals.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for full details.
