const path = require('path');
const pluginPath = path.join(__dirname, '..', 'plugins', 'example-plugin', 'dist', 'index.js');
try {
  const plugin = require(pluginPath);
  const res = plugin.run({ env: 'ci' });
  if (!res || res.ok !== true) {
    console.error('Plugin test failed: invalid response', res);
    process.exit(2);
  }
  console.log('Plugin tests passed:', res.message || JSON.stringify(res));
  process.exit(0);
} catch (e) {
  console.error('Plugin test runner error:', e && e.stack ? e.stack : e);
  process.exit(1);
}
