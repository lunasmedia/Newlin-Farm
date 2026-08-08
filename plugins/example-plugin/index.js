try {
  // Prefer compiled output if available
  module.exports = require('./dist/index.js');
} catch (e) {
  // Fallback to bundled commonjs entry
  module.exports = require('./index.cjs');
}
