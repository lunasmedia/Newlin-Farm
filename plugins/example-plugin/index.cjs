function run(opts = {}) {
  const mode = opts.env || 'dev';
  return { ok: true, mode, message: `Example plugin ran in ${mode}` };
}

module.exports = { run };
