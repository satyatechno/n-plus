import React from 'react';
import { View } from 'react-native';

import { useTranslation } from 'react-i18next';

import CustomText from '@src/views/atoms/CustomText';
import CustomSwitch from '@src/views/atoms/CustomSwitch';
import { fontSize } from '@src/config/styleConsts';
import { fonts } from '@src/config/fonts';
import { NotificationSectionProps } from '@src/models/main/MyAccount/NotificationSettings';
import SeeAllButton from '@src/views/molecules/SeeAllButton';

/**
 * NotificationSection is a React functional component that renders a section
 * for managing notification settings.
 *
 * This component displays a title, a toggle switch to enable or disable all
 * notifications, and a list of individual notification types with their
 * toggle statuses. It also includes an option to view all notification types
 * if there are more than a specified number.
 *
 * @param {string} title - The title of the notification section.
 * @param {boolean} allEnabled - Indicates whether all notifications are enabled.
 * @param {Function} onToggleAll - Callback function to toggle all notifications.
 * @param {{id: string, title: string}[]} types - Array of notification types with titles and ids.
 * @param {boolean[]} statuses - Array of boolean values representing the toggle status of each notification type.
 * @param {Function} onToggle - Callback function to toggle the status of a specific notification type by index.
 * @param {Function} onPressViewAll - Callback function to handle the action of pressing the "View All" button.
 * @param {Object} styles - The style object for the component.
 *
 * @returns {JSX.Element} The rendered notification section component.
 */
const NotificationSection: React.FC<NotificationSectionProps> = ({
  title,
  allEnabled,
  onToggleAll,
  types,
  onToggle,
  onPressViewAll,
  styles
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.flatListContentContainer}>
      <View style={styles.titleRow}>
        <CustomText
          size={fontSize['2xl']}
          weight="R"
          fontFamily={fonts.notoSerifExtraCondensed}
          textStyles={styles.sectionTitle}
        >
          {title}
        </CustomText>
        <CustomSwitch value={allEnabled} onToggle={onToggleAll} />
      </View>

      {types.slice(0, 6).map((item, index) => (
        <View key={item.id} style={styles.itemContainer}>
          <CustomText
            weight="Boo"
            fontFamily={fonts.franklinGothicURW}
            textStyles={styles.itemText}
          >
            {item.title}
          </CustomText>

          <CustomSwitch value={item.isSubscribed} onToggle={() => onToggle(index)} />
        </View>
      ))}

      {types.length > 0 && (
        <SeeAllButton
          text={t('screens.notificationSettings.text.viewAll')}
          onPress={onPressViewAll}
          buttonStyle={styles.viewAllContainer}
        />
      )}
    </View>
  );
};

export default NotificationSection;
