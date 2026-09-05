import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { View } from 'react-native';

import { imageSourceKey } from '../../lib/image-cache';
import { ImageViewportContext } from './ImageAwareScrollView';
import { NewlinImage, type NewlinImageProps } from './NewlinImage';

export type ViewportAwareImageProps = NewlinImageProps & {
  /** Starts immediately with high priority. Use for the hero and other above-the-fold imagery. */
  critical?: boolean;
  /** Distance outside the visible ScrollView that triggers loading. */
  preloadDistance?: number;
};

/**
 * Loads a component image shortly before its real on-screen frame enters the ScrollView.
 * Measurement uses window coordinates, so it also works when the image is nested in a section.
 */
export function ViewportAwareImage({
  source,
  critical = false,
  preloadDistance = 480,
  onDisplay,
  ...imageProps
}: ViewportAwareImageProps) {
  const viewport = useContext(ImageViewportContext);
  const imageRef = useRef<View>(null);
  const sourceKey = useMemo(() => imageSourceKey(source), [source]);
  const [active, setActive] = useState(critical || !viewport);
  const [visible, setVisible] = useState(critical);
  const [displayed, setDisplayed] = useState(false);

  const checkPosition = useCallback(() => {
    if (critical || !viewport) {
      setActive(true);
      setVisible(true);
      return;
    }

    imageRef.current?.measureInWindow((_x, y, _width, height) => {
      if (height <= 0) return;
      const bounds = viewport.getBounds();
      const imageBottom = y + height;
      const isVisible = imageBottom >= bounds.top && y <= bounds.bottom;
      const isNear =
        imageBottom >= bounds.top - preloadDistance &&
        y <= bounds.bottom + preloadDistance;

      setVisible(isVisible);
      if (isNear) setActive(true);
    });
  }, [critical, preloadDistance, viewport]);

  // Resets tracked state whenever the image's identity/context changes.
  // Computed during render rather than in an effect, per React's
  // "adjusting state when a prop changes" pattern — this is a synchronous
  // reset, not a subscription to an external system.
  const resetKey = `${sourceKey}:${critical ? 1 : 0}:${viewport ? 1 : 0}`;
  const [trackedResetKey, setTrackedResetKey] = useState(resetKey);
  if (trackedResetKey !== resetKey) {
    setTrackedResetKey(resetKey);
    setDisplayed(false);
    setActive(critical || !viewport);
    setVisible(critical);
  }

  useEffect(() => {
    const frame = requestAnimationFrame(checkPosition);
    return () => cancelAnimationFrame(frame);
  }, [checkPosition, resetKey]);

  useEffect(() => {
    if (!viewport || displayed || critical) return;
    return viewport.subscribe(checkPosition);
  }, [checkPosition, critical, displayed, viewport]);

  return (
    <NewlinImage
      {...imageProps}
      ref={imageRef}
      source={active ? source : null}
      visible={visible || critical}
      showErrorState={active}
      onDisplay={() => {
        setDisplayed(true);
        onDisplay?.();
      }}
    />
  );
}
