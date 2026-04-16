import { useCallback, useRef } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

interface ScrollTracker {
  lastIndex: number;
  timeout: NodeJS.Timeout | null;
}

interface ScrollAnalyticsConfig<T = unknown> {
  itemWidth: number;
  analyticsHandler: (index: number, item: T) => void;
  data: T[];
  getAnalyticsData?: (data: T[], index: number) => T;
}

/**
 * Hook for managing scroll analytics tracking with debouncing support.
 *
 * Provides utilities to create scroll event handlers that track user scroll behavior
 * and trigger analytics events with debouncing to avoid excessive event firing.
 *
 * @returns {Object} Object containing scroll handler factory and cleanup function
 * @returns {Function} createScrollHandler - Factory function to create scroll event handlers
 * @returns {Function} createScrollHandler.key - Unique identifier for the scroll tracker instance
 * @returns {Function} createScrollHandler.config - Configuration object for scroll analytics
 * @returns {Function} cleanup - Function to clean up all active timeouts and trackers
 *
 * @example
 * const { createScrollHandler, cleanup } = useScrollAnalytics();
 * const scrollHandler = createScrollHandler('carousel', {
 *   itemWidth: 300,
 *   data: items,
 *   analyticsHandler: (index, data) => trackEvent(data),
 *   getAnalyticsData: (data, index) => data[index]
 * });
 *
 * useEffect(() => cleanup, [cleanup]);
 */

export const useScrollAnalytics = () => {
  const scrollTrackers = useRef<Map<string, ScrollTracker>>(new Map());

  const createScrollHandler = useCallback(
    <T = unknown>(key: string, config: ScrollAnalyticsConfig<T>) =>
      (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / config.itemWidth);

        // Get or create tracker for this scroll component
        let tracker = scrollTrackers.current.get(key);
        if (!tracker) {
          tracker = { lastIndex: -1, timeout: null };
          scrollTrackers.current.set(key, tracker);
        }

        // Clear existing timeout
        if (tracker.timeout) {
          clearTimeout(tracker.timeout);
        }

        // Set new timeout for analytics
        tracker.timeout = setTimeout(() => {
          if (index >= 0 && index !== tracker.lastIndex && config.data?.[index]) {
            tracker.lastIndex = index;
            const analyticsData = config.getAnalyticsData
              ? config.getAnalyticsData(config.data, index)
              : config.data[index];
            config.analyticsHandler(index, analyticsData);
          }
        }, 150); // Debounce delay
      },
    []
  );

  const cleanup = useCallback(() => {
    scrollTrackers.current.forEach((tracker) => {
      if (tracker.timeout) {
        clearTimeout(tracker.timeout);
      }
    });
    scrollTrackers.current.clear();
  }, []);

  return {
    createScrollHandler,
    cleanup
  };
};
