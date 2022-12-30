# game-clock

## TODO:

- Room lifecycle: remove empty and old rooms
- Player mode: big tile for one player.
- Flexible player tile layout (see `projects/client/src/Grid.ts`).
- Settings config
- Menu, new game form at `/`.

## Project Setup

1. Install dependencies

```sh
npm install
```

2. Copy `template.env` to `.env` in the same directory, and modify if necessary (likely no changes needed for a local dev setup).

### Compile and Hot-Reload for Development

```sh
npm run dev
```

Or separately:

- Build and watch TypeScript: `npm run watch`.
- Start front-end Vue development server (Vite): `npm run dev-client`.
- Start Express development server: `npm run dev-server`.

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).
