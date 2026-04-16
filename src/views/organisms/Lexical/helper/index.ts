import { Alert, Linking } from 'react-native';

import { useTranslation } from 'react-i18next';

export function getYouTubeVideoId(url: string) {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)([a-zA-Z0-9_-]{11})(?:[?&]|$)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

const modifyInstagramUrl = (url: string): string => {
  const regex = /^https:\/\/www\.instagram\.com\/p\/([a-zA-Z0-9-_]+)(?:\/|\?)?/;
  const match = url.match(regex);
  return match ? `https://www.instagram.com/p/${match[1]}/embed/captioned/` : url;
};

function convertToSpotifyEmbed(url: string) {
  // Check if it's already an embed URL
  if (url.includes('/embed/')) {
    return url;
  }

  // Regular expression to match different types of Spotify URLs (albums, tracks, playlists, episodes, etc.)
  const regex =
    /https:\/\/open\.spotify\.com\/(album|track|playlist|artist|episode)\/([a-zA-Z0-9]+)(\?highlight=spotify:track:[a-zA-Z0-9]+)?/;

  const match = url.match(regex);

  if (match) {
    const type = match[1]; // album, track, playlist, artist, or episode
    const id = match[2]; // the Spotify ID

    // Return the embedded URL format
    return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
  } else {
    // If the URL doesn't match the expected format, try to extract from other Spotify URL formats
    const alternativeRegex = /https:\/\/open\.spotify\.com\/([^/]+)\/([a-zA-Z0-9]+)/;
    const altMatch = url.match(alternativeRegex);

    if (altMatch) {
      const type = altMatch[1];
      const id = altMatch[2];
      return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
    }

    // If the URL doesn't match the expected format
    return 'Invalid Spotify URL';
  }
}

function convertToFacebookEmbed(url: string) {
  // Facebook doesn't have a direct embed URL like Instagram
  // We'll create a custom HTML wrapper that can display Facebook content
  // This will be handled specially in the WebView component
  return url;
}

export function getEmbedUrl(platform: string, webUrl: string) {
  let url = '';

  switch (platform.toLowerCase()) {
    case 'instagram':
      url = modifyInstagramUrl(webUrl);
      break;
    case 'spotify':
      url = convertToSpotifyEmbed(webUrl);
      break;
    case 'facebook':
      url = convertToFacebookEmbed(webUrl);
      break;
    case 'none':
      return (url = webUrl);
    default:
      return (url = webUrl);
  }
  return url;
}

export const handleUrlPress = async (url: string) => {
  const supported = await Linking.canOpenURL(url);
  const { t } = useTranslation();
  if (supported) {
    await Linking.openURL(url);
  } else {
    Alert.alert(t('screens.login.text.somethingWentWrong'));
  }
};
