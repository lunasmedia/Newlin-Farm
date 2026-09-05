import { useEffect, useState } from 'react';

import {
  prefetchImageSources,
  remoteImageUrls,
  type NewlinImageSource,
} from '../lib/image-cache';

export type CriticalImagePreloadOptions = {
  enabled?: boolean;
  /** Never hold a loading/splash state indefinitely because of one bad image URL. */
  timeoutMs?: number;
};

/**
 * Preloads hero/category imagery before revealing a screen or while catalogue data is prepared.
 * Returns true when all requests finish or the safety timeout is reached.
 */
export function useCriticalImagePreload(
  sources: readonly NewlinImageSource[],
  { enabled = true, timeoutMs = 1200 }: CriticalImagePreloadOptions = {},
) {
  const urls = remoteImageUrls(sources);
  const signature = urls.join('\n');
  const [readySignature, setReadySignature] = useState<string | null>(null);

  useEffect(() => {
    // Already covered by the hook's own return expression below — no
    // async work needed, so nothing to set up here.
    if (!enabled || urls.length === 0) return;

    let cancelled = false;

    const timeout = setTimeout(() => {
      if (!cancelled) setReadySignature(signature);
    }, timeoutMs);

    void prefetchImageSources(urls).then(() => {
      if (cancelled) return;
      clearTimeout(timeout);
      setReadySignature(signature);
    });

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
    // signature changes only when a URL changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, signature, timeoutMs]);

  return !enabled || urls.length === 0 || readySignature === signature;
}
