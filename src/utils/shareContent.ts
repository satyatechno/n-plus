import { Share } from 'react-native';

import Config from 'react-native-config';

interface ShareContentParams {
  fullPath: string;
}

/**
 * Global utility method to share content by full path
 * Automatically constructs the full URL using WEBSITE_BASE_URL and shares it
 *
 * @param params - Object containing the fullPath to share
 * @returns Promise from Share.share
 */
export const shareContent = async (params: ShareContentParams): Promise<void> => {
  const { fullPath } = params;

  if (!fullPath) {
    return;
  }

  const fullUrl = Config.WEBSITE_BASE_URL + fullPath;

  await Share.share({
    message: fullUrl
  });
};
