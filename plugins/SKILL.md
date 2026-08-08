# Plugins SKILL — repository plugins guidance

Purpose
- Describe the `plugins/` layout and provide a minimal example plugin scaffold agents can extend.

Where to look
- Plugin entrypoints live under `plugins/<plugin-name>/`.
- Look for `skill.md` or `SKILL.md` inside plugin folders for human-readable intent and `manifest.json` for machine-readable metadata.

Conventions used here
- Each plugin contains:
  - `skill.md` — short human-facing description and usage examples.
  - `manifest.json` — minimal metadata: `id`, `version`, `entry`.
  - `index.js`/`index.ts` — plugin node entry (export a function or object). 

How agents should modify or add plugins
- Preserve existing `skill.md` and `manifest.json` when updating. Add new fields only if discoverable from repo context.
- When scaffolding, create a small runnable example that exports a default function and a README example for using the plugin.

Example paths in this repo
- `plugins/example-plugin/skill.md` — example plugin SKILL
- `plugins/example-plugin/manifest.json` — example manifest
- `plugins/example-plugin/index.js` — example entry
