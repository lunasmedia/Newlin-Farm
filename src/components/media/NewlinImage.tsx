import { Ionicons } from '@expo/vector-icons';
import { Image, type ImageProps } from 'expo-image';
import { forwardRef, useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import {
  imageSourceKey,
  markImageSourceReady,
  type NewlinImageSource,
} from '../../lib/image-cache';

type CachePolicy = NonNullable<ImageProps['cachePolicy']>;
type LoadPriority = NonNullable<ImageProps['priority']>;

export type NewlinImageProps = Omit<
  ImageProps,
  | 'source'
  | 'style'
  | 'cachePolicy'
  | 'priority'
  | 'recyclingKey'
  | 'onError'
  | 'onDisplay'
> & {
  source: NewlinImageSource;
  /** Sets the frame size, aspect ratio and border radius, just like the old Image style. */
  style?: ImageProps['style'];
  /** Optional styles applied only to the bitmap inside the frame. */
  imageStyle?: ImageProps['style'];
  /** Use true for items reported visible by FlatList. Visible images receive high priority. */
  visible?: boolean;
  /** Usually the product/category ID. Prevents recycled cells showing an earlier image. */
  imageKey?: string;
  cachePolicy?: CachePolicy;
  priority?: LoadPriority;
  backgroundColor?: string;
  retryOnError?: boolean;
  /** Set false while a viewport-aware image is intentionally waiting to start. */
  showErrorState?: boolean;
  onDisplay?: ImageProps['onDisplay'];
  onLoadError?: (message: string) => void;
};

export const NewlinImage = forwardRef<View, NewlinImageProps>(function NewlinImage(
  {
    source,
    style,
    imageStyle,
    visible = false,
    imageKey,
    cachePolicy = 'memory-disk',
    priority,
    backgroundColor = '#F4EFE1',
    retryOnError = true,
    showErrorState = true,
    contentFit = 'cover',
    placeholderContentFit,
    transition = 140,
    accessibilityLabel,
    onDisplay,
    onLoadError,
    ...imageProps
  },
  forwardedRef,
) {
  const sourceKey = useMemo(() => imageSourceKey(source), [source]);
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(!source);

  useEffect(() => {
    setAttempt(0);
    setFailed(!source);
    // sourceKey is stable even when callers create a new { uri } object during render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceKey]);

  const recyclingKey = `${imageKey ?? sourceKey}:${attempt}`;
  const frameStyle = style as StyleProp<ViewStyle>;

  return (
    <View
      ref={forwardedRef}
      collapsable={false}
      style={[styles.frame, frameStyle, { backgroundColor }]}
    >
      {!failed && source ? (
        <Image
          {...imageProps}
          key={recyclingKey}
          source={source}
          style={[StyleSheet.absoluteFill, imageStyle]}
          contentFit={contentFit}
          placeholderContentFit={placeholderContentFit ?? contentFit}
          cachePolicy={cachePolicy}
          priority={priority ?? (visible ? 'high' : 'normal')}
          loading={visible ? 'eager' : 'lazy'}
          recyclingKey={recyclingKey}
          transition={transition}
          accessibilityLabel={accessibilityLabel}
          onDisplay={() => {
            markImageSourceReady(source);
            onDisplay?.();
          }}
          onError={(event) => {
            setFailed(true);
            onLoadError?.(event.error);
          }}
        />
      ) : null}

      {failed && showErrorState ? (
        <Pressable
          accessibilityRole={retryOnError && source ? 'button' : 'image'}
          accessibilityLabel={
            retryOnError && source
              ? `Retry loading ${accessibilityLabel ?? 'image'}`
              : accessibilityLabel ?? 'Image unavailable'
          }
          disabled={!retryOnError || !source}
          onPress={() => {
            setAttempt((value) => value + 1);
            setFailed(false);
          }}
          style={styles.errorState}
        >
          <Ionicons
            name={retryOnError && source ? 'refresh-outline' : 'image-outline'}
            size={22}
            color="#75715F"
          />
        </Pressable>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  frame: {
    overflow: 'hidden',
  },
  errorState: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
