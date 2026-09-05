// Regenerates src/lib/newlin-api.types.generated.ts from the admin's
// published JSON Schema contract (GET /api/v1/schema in Newlin-Farm-Admin),
// so this app's API types can't silently drift from what the admin actually
// returns — a renamed/removed field shows up as a TypeScript error the next
// time this runs, instead of a runtime surprise.
//
// Run manually whenever the admin's public catalogue shape changes:
//   npm run sync-api-types
// Optionally point it at a specific admin instance:
//   NEWLIN_ADMIN_URL=https://newlin-farm-admin.lunasmedia.chatgpt.site npm run sync-api-types

const fs = require('fs');
const path = require('path');
const { compile } = require('json-schema-to-typescript');

const OUTPUT_PATH = path.join(__dirname, '..', 'src', 'lib', 'newlin-api.types.generated.ts');

function readAdminUrlFromEnvFile() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) return undefined;
  const match = fs
    .readFileSync(envPath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.startsWith('EXPO_PUBLIC_NEWLIN_API_URL='));
  return match ? match.slice('EXPO_PUBLIC_NEWLIN_API_URL='.length).trim() : undefined;
}

async function main() {
  const adminUrl = process.env.NEWLIN_ADMIN_URL || readAdminUrlFromEnvFile();
  if (!adminUrl) {
    console.error(
      'No admin URL found. Set NEWLIN_ADMIN_URL, or EXPO_PUBLIC_NEWLIN_API_URL in .env.'
    );
    process.exit(1);
  }

  const schemaUrl = `${adminUrl.replace(/\/$/, '')}/api/v1/schema`;
  console.log(`Fetching contract from ${schemaUrl} ...`);

  const response = await fetch(schemaUrl);
  if (!response.ok) {
    console.error(`Failed to fetch schema (${response.status}) from ${schemaUrl}`);
    process.exit(1);
  }
  const { version, schema } = await response.json();

  const ts = await compile(schema, 'CatalogResponse', {
    bannerComment: '',
    additionalProperties: false,
    style: { singleQuote: true },
  });

  // Deliberately no fetch URL or timestamp here — this banner must come out
  // byte-identical regardless of which admin instance (local dev vs. the
  // deployed one) or when it was regenerated from, otherwise CI's "is the
  // checked-in file stale" diff check (see .github/workflows/ci.yml) would
  // fail on every run even with zero real schema drift. git blame already
  // covers "when"; the contract version below covers "against what".
  const banner = `// GENERATED FILE — do not edit by hand.
// Regenerate with \`npm run sync-api-types\`.
// Source: GET /api/v1/schema on Newlin-Farm-Admin.
// Contract version: ${version}

`;

  fs.writeFileSync(OUTPUT_PATH, banner + ts);
  console.log(`Wrote ${path.relative(process.cwd(), OUTPUT_PATH)}`);
}

main().catch((error) => {
  console.error('sync-api-types failed:', error);
  process.exit(1);
});
