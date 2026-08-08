# Example Plugin SKILL

Purpose
- Minimal example plugin to demonstrate structure and usage for AI scaffolding.

Usage
- The plugin exports a function from `index.js`. Consumers can `require` or `import` the entry and call it.

Example

```js
const plugin = require('./plugins/example-plugin');
plugin.run({ env: 'dev' });
```
