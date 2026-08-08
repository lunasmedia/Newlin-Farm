const plugin = require('../dist/index.js');

test('example plugin run returns ok and message', () => {
  const res = plugin.run({ env: 'test' });
  expect(res).toBeDefined();
  expect(res.ok).toBe(true);
  expect(res.message).toMatch(/ran in test/i);
});
