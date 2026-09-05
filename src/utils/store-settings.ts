// The catalogue API's `settings` field is typed as an open record (see
// newlin-api.types.generated.ts) since it's just whatever key/value rows
// exist in the admin's store_settings table — this gives every consumer a
// single typed, defaulted view of it instead of each screen re-guessing
// field names and fallback values. Defaults here intentionally mirror the
// admin's own `defaultSettings` (lib/models.ts) so a not-yet-loaded or
// unreachable catalogue still behaves like a freshly set-up store rather
// than a broken one (e.g. no minimum order, not "totally free delivery").
export type StoreSettings = {
  storeName: string;
  deliveryPostcodes: string;
  freeDeliveryThresholdPence: number;
  minimumOrderPence: number;
  supportEmail: string;
  announcement: string;
};

const DEFAULTS: StoreSettings = {
  storeName: 'Newlin Farm',
  deliveryPostcodes: '',
  freeDeliveryThresholdPence: 4000,
  minimumOrderPence: 0,
  supportEmail: '',
  announcement: '',
};

export function normalizeStoreSettings(raw: Record<string, unknown>): StoreSettings {
  return {
    storeName: typeof raw.storeName === 'string' && raw.storeName ? raw.storeName : DEFAULTS.storeName,
    deliveryPostcodes: typeof raw.deliveryPostcodes === 'string' ? raw.deliveryPostcodes : DEFAULTS.deliveryPostcodes,
    freeDeliveryThresholdPence:
      typeof raw.freeDeliveryThresholdPence === 'number' ? raw.freeDeliveryThresholdPence : DEFAULTS.freeDeliveryThresholdPence,
    minimumOrderPence: typeof raw.minimumOrderPence === 'number' ? raw.minimumOrderPence : DEFAULTS.minimumOrderPence,
    supportEmail: typeof raw.supportEmail === 'string' ? raw.supportEmail : DEFAULTS.supportEmail,
    announcement: typeof raw.announcement === 'string' ? raw.announcement : DEFAULTS.announcement,
  };
}

// UK outward-code coverage check for a free-text address line like
// "London, E5 0NP" against the admin's comma-separated `deliveryPostcodes`
// (e.g. "E5, E8, N16") — matches on the outward code prefix so "E5 0NP"
// matches an "E5" coverage entry.
export function isPostcodeCovered(addressText: string, deliveryPostcodes: string): boolean {
  const coverage = deliveryPostcodes
    .split(',')
    .map((code) => code.trim().toUpperCase())
    .filter(Boolean);
  if (!coverage.length) return true; // No configured coverage list — don't block on an empty admin setting.

  const match = addressText.toUpperCase().match(/[A-Z]{1,2}\d[A-Z\d]?/);
  if (!match) return true; // No recognisable postcode typed yet — nothing to validate against.

  const outwardCode = match[0];
  return coverage.some((code) => outwardCode.startsWith(code));
}
