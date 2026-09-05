import {
  createContext,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewProps,
} from 'react-native';

type ViewportBounds = {
  top: number;
  bottom: number;
};

type VisibilityListener = () => void;

type ImageViewportContextValue = {
  getBounds: () => ViewportBounds;
  subscribe: (listener: VisibilityListener) => () => void;
};

export const ImageViewportContext =
  createContext<ImageViewportContextValue | null>(null);

export type ImageAwareScrollViewProps = ScrollViewProps & {
  children?: ReactNode;
};

/**
 * Drop-in ScrollView replacement that tells viewport-aware images when to measure.
 * It does not place scroll position in React state, so the whole screen is not rerendered.
 */
export const ImageAwareScrollView = forwardRef<
  ScrollView,
  ImageAwareScrollViewProps
>(function ImageAwareScrollView(
  {
    children,
    onScroll,
    onLayout,
    onContentSizeChange,
    scrollEventThrottle = 64,
    ...scrollViewProps
  },
  forwardedRef,
) {
  const scrollViewRef = useRef<ScrollView>(null);
  const viewportRef = useRef<View>(null);
  const listenersRef = useRef(new Set<VisibilityListener>());
  const boundsRef = useRef<ViewportBounds>({
    top: 0,
    bottom: Dimensions.get('window').height,
  });

  useImperativeHandle(forwardedRef, () => scrollViewRef.current as ScrollView);

  const notify = useCallback(() => {
    listenersRef.current.forEach((listener) => listener());
  }, []);

  const measureViewport = useCallback(() => {
    viewportRef.current?.measureInWindow((_x, y, _width, height) => {
      boundsRef.current = { top: y, bottom: y + height };
      notify();
    });
  }, [notify]);

  const subscribe = useCallback((listener: VisibilityListener) => {
    listenersRef.current.add(listener);
    const frame = requestAnimationFrame(listener);

    return () => {
      cancelAnimationFrame(frame);
      listenersRef.current.delete(listener);
    };
  }, []);

  const contextValue = useMemo<ImageViewportContextValue>(
    () => ({
      getBounds: () => boundsRef.current,
      subscribe,
    }),
    [subscribe],
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', measureViewport);
    return () => subscription.remove();
  }, [measureViewport]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      onScroll?.(event);
      notify();
    },
    [notify, onScroll],
  );

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      onLayout?.(event);
      measureViewport();
    },
    [measureViewport, onLayout],
  );

  return (
    <ImageViewportContext.Provider value={contextValue}>
      <View
        ref={viewportRef}
        collapsable={false}
        style={styles.viewport}
        onLayout={handleLayout}
      >
        <ScrollView
          {...scrollViewProps}
          ref={scrollViewRef}
          scrollEventThrottle={scrollEventThrottle}
          onScroll={handleScroll}
          onContentSizeChange={(width, height) => {
            onContentSizeChange?.(width, height);
            notify();
          }}
        >
          {children}
        </ScrollView>
      </View>
    </ImageViewportContext.Provider>
  );
});

const styles = StyleSheet.create({
  viewport: {
    flex: 1,
  },
});
