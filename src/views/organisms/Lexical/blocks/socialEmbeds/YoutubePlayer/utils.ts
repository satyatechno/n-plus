/**
 * deep compares two values for the "playlist prop"
 *
 * @param lastPlayList - The previous playlist value
 * @param playList - The current playlist value
 * @returns true if the two are equal
 */

const deepComparePlayList = (
  lastPlayList: string | string[] | undefined,
  playList: string | string[] | undefined
): boolean => {
  if (lastPlayList === playList) {
    return true;
  }

  if (Array.isArray(lastPlayList) && Array.isArray(playList)) {
    return lastPlayList.join('') === playList.join('');
  }

  return false;
};

export { deepComparePlayList };
