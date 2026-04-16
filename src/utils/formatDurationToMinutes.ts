/**
 * Format a duration in seconds to minutes.
 *
 * - If total duration < 60 sec → returns seconds
 * - If the remaining seconds ≤ 31 → returns minutes
 * - If the remaining seconds > 31 → returns minutes + 1
 *
 * @param {number} seconds - duration in seconds
 * @returns {number} duration in minutes or seconds
 */

export const formatDurationToMinutes = (seconds: number, onlyNumber?: boolean) => {
  if (seconds < 60) {
    return onlyNumber ? 1 : 1 + ' min';
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (remainingSeconds <= 31) {
    return onlyNumber ? minutes : minutes + ' min';
  } else {
    return onlyNumber ? minutes + 1 : minutes + 1 + ' min';
  }
};
