export function run(opts: { env?: string } = {}) {
  const mode = opts.env || 'dev';
  return { ok: true, mode, message: `Example plugin (TS) ran in ${mode}` };
}

export default { run };
