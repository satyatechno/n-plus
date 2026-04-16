import { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '@src/hooks/useTheme';
import { RootStackParamList } from '@src/navigation/types';

/**
 * Custom hook for managing the talent listing view model
 *
 * This hook provides all the necessary state, data, and handlers for the talent listing screen.
 * It manages navigation, theme, translations, and static talent data (to be replaced with API data).
 *
 * @returns {Object} An object containing:
 * @returns {Function} t - Translation function from react-i18next
 * @returns {Object} theme - Current theme object from useTheme hook
 * @returns {Function} goBack - Navigation function to go back to previous screen
 * @returns {Array} chipsTopic - Array of topic chips with title and slug properties
 * @returns {Array} nPlusTalentData - Array of talent data objects with id, title, and image properties
 * @returns {Function} onProgramsTogglePress - Callback for programs toggle press (to be implemented)
 * @returns {Function} onBookmarkPress - Callback for bookmark press (to be implemented)
 *
 */
const useTalentListingViewModel = () => {
  const { t } = useTranslation();
  const [theme] = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  //TODO: using static data for testing and will be replaced with API data in future
  const nPlusTalentData = [
    {
      id: '1',
      title: 'Enrique Acevedo',
      image: ''
    },
    {
      id: '2',
      title: 'Carlos Hurtado',
      image:
        'https://media.istockphoto.com/id/1354169883/photo/focus-on-female-podcaster-live-streaming-show.jpg?s=1024x1024&w=is&k=20&c=k-I0bEVasdK5VVzp3lA-OMqoLR5GBm-c0qHR-IXozsA='
    },
    {
      id: '3',
      title: 'Dolores Beatriz',

      image:
        'https://media.istockphoto.com/id/1394183500/photo/anchorman-reporting-live-news-in-a-city-at-night-news-coverage-by-professional-handsome.jpg?s=1024x1024&w=is&k=20&c=4d4RfglAvME-qTvB3oZGhM1GjJ2KKjHE2UbvvAYpeec='
    },
    {
      id: '4',
      title: 'Carlos Alberto',
      image:
        'https://t4.ftcdn.net/jpg/03/28/64/79/240_F_328647963_YJv65B4l16eHiIq447qjuVdZmmrGb920.jpg'
    }
  ];

  const goBack = () => {
    navigation.goBack();
  };

  const chipsTopic = [
    { title: 'N+', slug: 'noticieros' },
    { title: 'N+ Foro', slug: 'foro_tv' }
  ];

  const onProgramsTogglePress = useCallback(() => {
    //todo: implement toggle functionality
  }, []);

  const onBookmarkPress = useCallback(() => {
    //todo: implement bookmark functionality
  }, []);

  return {
    t,
    theme,
    goBack,
    chipsTopic,
    nPlusTalentData,
    onProgramsTogglePress,
    onBookmarkPress
  };
};

export default useTalentListingViewModel;
