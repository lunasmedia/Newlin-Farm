const fs = require('fs');
const path = require('path');

const pluginsDir = path.join(__dirname, '..', 'plugins');
const outDir = path.join(__dirname, '..', 'plugin-packages');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

const pluginNames = fs.readdirSync(pluginsDir).filter(n => fs.statSync(path.join(pluginsDir, n)).isDirectory());

pluginNames.forEach(name => {
  const manifestPath = path.join(pluginsDir, name, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    console.warn(`Skipping ${name}: no manifest.json`);
    return;
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const outPath = path.join(outDir, `${manifest.id || name}-${manifest.version || '0.0.0'}.json`);
  fs.writeFileSync(outPath, JSON.stringify({ manifest, publishedAt: new Date().toISOString() }, null, 2));
  console.log(`Prepared plugin package: ${outPath}`);
});

console.log('Publish step (simulated) complete.');
