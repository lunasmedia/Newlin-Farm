# Template Expo App

This workspace contains a minimal Expo-managed React Native project skeleton.

Quick start

1. Install dependencies

```bash
npm install
```

2. Start the development server

```bash
npm start
# or
npx expo start
```

3. Open on device/emulator

```bash
npm run android
npm run ios
```

Project layout

- `app.json` / `eas.json` — Expo config and EAS Build config
- `package.json` — dependencies & scripts
- `assets/` — icons, splash image, and other static assets
- `scripts/` — repo automation (plugin publishing, test running)
- `src/app/` — `expo-router` routes only, file-based routing; every file here is a route
  - `src/app/api/` — server API routes (`+api.ts`); requires expo-router v3+ (SDK 50+) to actually run — not yet functional on the current expo-router 2.0.15 / SDK 49 setup, kept as scaffolding
- `src/components/` — reusable UI (`Hello.tsx`, …)
- `src/screens/` — screen bodies rendered by route files
- `src/server/` — server-only helpers used by `src/app/api`
- `src/utils/` — standalone helpers with colocated tests
- `src/hooks/` — reusable hooks (`use-theme.ts`, …)
- `src/constants.ts`, `src/theme.ts` — shared constants and theme

This repository includes a TypeScript + `expo-router` scaffold. The `src/app/` directory follows file-based routing used by `expo-router` (`main` in `package.json` points at `expo-router/entry`).

Notes on running

- Install dependencies:

```bash
npm install
```

- Start the dev server (uses `expo` from `node_modules`):

```bash
npm start
# or
npx expo start
```


Project routes (expo-router)

- `src/app/` follows file-based routing. Key routes added by the scaffold:
	- `src/app/(tabs)/index.tsx` — Home tab with links to other routes
	- `src/app/profile.tsx` — Profile screen (reads `id` query param)
	- `src/app/settings.tsx` — Settings screen that opens a modal
	- `src/app/(modal)/login.tsx` — Login modal presented with modal presentation

Deep links

- App scheme is `templateexpo://` (see `app.json`). Example deep link to profile:

```text
templateexpo://profile?id=42
```

Plugins

- Plugin scaffolding lives under `plugins/`. See `plugins/SKILL.md` for agent guidance and `plugins/example-plugin/` for a minimal example plugin (manifest, `skill.md`, and `index.js`).

Troubleshooting: EMFILE "too many open files"

If you encounter `Error: EMFILE: too many open files, watch` when starting the dev server on macOS, use the provided startup script:

```bash
bash dev.sh
```

This script will:
- Increase the file descriptor limit for the session
- Clear Metro caches
- Start with optimized settings (single worker, reset cache)

Or manually:

```bash
ulimit -n 4096
npm start --reset-cache
```

To make the limit permanent, add to `~/.zshrc`:

```bash
ulimit -n 4096
```

`````