import { Image, type ImageProps } from 'expo-image';

export type NewlinImageSource = ImageProps['source'];

export type ImagePrefetchResult = {
  requested: number;
  loaded: number;
  failed: number;
};

const REMOTE_IMAGE_PATTERN = /^https?:\/\//i;
const readyThisSession = new Set<string>();
const inFlight = new Map<string, Promise<boolean>>();

/** Adds a cache-busting version while preserving existing query parameters and fragments. */
export function versionedImageUrl(
  url: string,
  version?: string | number | null,
) {
  if (version === undefined || version === null || version === '') return url;

  const hashIndex = url.indexOf('#');
  const base = hashIndex >= 0 ? url.slice(0, hashIndex) : url;
  const hash = hashIndex >= 0 ? url.slice(hashIndex) : '';
  const separator = base.includes('?') ? '&' : '?';
  return `${base}${separator}v=${encodeURIComponent(String(version))}${hash}`;
}

function collectRemoteUrls(source: NewlinImageSource, result: string[]) {
  if (!source) return;

  if (typeof source === 'string') {
    if (REMOTE_IMAGE_PATTERN.test(source)) result.push(source);
    return;
  }

  if (typeof source === 'number') return;

  if (Array.isArray(source)) {
    source.forEach((item) => collectRemoteUrls(item, result));
    return;
  }

  if (typeof source === 'object') {
    const uri = (source as { uri?: unknown }).uri;
    if (typeof uri === 'string' && REMOTE_IMAGE_PATTERN.test(uri)) {
      result.push(uri);
    }
  }
}

/** Returns unique HTTP(S) URLs from Expo Image sources. Bundled require() assets are ignored. */
export function remoteImageUrls(sources: readonly NewlinImageSource[]): string[] {
  const urls: string[] = [];
  sources.forEach((source) => collectRemoteUrls(source, urls));
  return [...new Set(urls)];
}

/** Stable enough for recyclingKey and resetting error state when a list cell changes product. */
export function imageSourceKey(source: NewlinImageSource): string {
  const urls = remoteImageUrls([source]);
  if (urls.length > 0) return urls.join('|');

  if (typeof source === 'number') return `asset:${source}`;
  if (typeof source === 'string') return source;
  if (!source) return 'no-image';

  try {
    return JSON.stringify(source);
  } catch {
    return String(source);
  }
}

async function prefetchOne(url: string): Promise<boolean> {
  if (readyThisSession.has(url)) return true;

  const existing = inFlight.get(url);
  if (existing) return existing;

  const request = Image.prefetch(url, { cachePolicy: 'memory-disk' })
    .then((loaded) => {
      if (loaded) readyThisSession.add(url);
      return loaded;
    })
    .catch(() => false)
    .finally(() => {
      inFlight.delete(url);
    });

  inFlight.set(url, request);
  return request;
}

/**
 * Warms the same memory + disk cache used by NewlinImage.
 * Requests are de-duplicated and concurrency is capped so image loading does not starve API calls.
 */
export async function prefetchImageSources(
  sources: readonly NewlinImageSource[],
  concurrency = 4,
): Promise<ImagePrefetchResult> {
  const urls = remoteImageUrls(sources);
  if (urls.length === 0) return { requested: 0, loaded: 0, failed: 0 };

  let cursor = 0;
  let loaded = 0;
  const workerCount = Math.max(1, Math.min(concurrency, urls.length));

  const workers = Array.from({ length: workerCount }, async () => {
    while (cursor < urls.length) {
      const index = cursor;
      cursor += 1;
      if (await prefetchOne(urls[index])) loaded += 1;
    }
  });

  await Promise.all(workers);
  return { requested: urls.length, loaded, failed: urls.length - loaded };
}

/** Lets a successfully displayed image skip another prefetch during this app session. */
export function markImageSourceReady(source: NewlinImageSource) {
  remoteImageUrls([source]).forEach((url) => readyThisSession.add(url));
}
