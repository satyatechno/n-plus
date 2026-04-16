/**
 * Live Buffer Configuration
 *
 * Optimized buffer settings for live streaming with react-native-video.
 * These settings prioritize smooth playback over low latency.
 */

/**
 * Buffer configuration optimized for live streaming
 * - Larger buffers to prevent interruptions
 * - Live edge offset for stability
 * - Higher retry count for network resilience
 */
export const LIVE_BUFFER_CONFIG = {
  minBufferMs: 1500, // 20 seconds minimum buffer
  maxBufferMs: 5000, // 50 seconds maximum buffer
  bufferForPlaybackMs: 500, // Start playback quickly after 1.5s of buffer
  bufferForPlaybackAfterRebufferMs: 1000, // Resume faster after rebuffer with 3s
  backBufferDurationMs: 0, // No need to keep back buffer for live
  maxHeapAllocationPercent: 0.5,
  minBackBufferMemoryReservePercent: 0.1,
  minBufferMemoryReservePercent: 0.1,
  cacheSizeMB: 0, // Disable caching for live streams
  live: {
    targetOffsetMs: 2000, // Stay 4 seconds behind live edge for stability
    minOffsetMs: 1000, // Min 2 seconds behind
    maxOffsetMs: 5000, // Max 10 seconds behind before catching up
    minPlaybackSpeed: 0.9, // Slow down to catch up if too far ahead
    maxPlaybackSpeed: 1.04 // Speed up slightly to catch up if behind
  }
};

/**
 * Retry count for live streams
 * Higher than default (3) to handle network fluctuations
 */
export const LIVE_MIN_LOAD_RETRY_COUNT = 10;

/**
 * iOS specific settings for live streaming
 */
export const LIVE_IOS_CONFIG = {
  /** Buffer duration for iOS (seconds) */
  preferredForwardBufferDuration: 2,
  /** Don't wait to minimize stalling for faster start */
  automaticallyWaitsToMinimizeStalling: false
};
