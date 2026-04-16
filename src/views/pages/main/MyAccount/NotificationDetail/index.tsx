import React from 'react';
import { View, FlatList } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import CustomHeader from '@src/views/molecules/CustomHeader';
import CustomText from '@src/views/atoms/CustomText';
import CustomSwitch from '@src/views/atoms/CustomSwitch';
import ConsentFooter from '@src/views/organisms/ConsentFooter';
import { fontSize } from '@src/config/styleConsts';
import { fonts } from '@src/config/fonts';
import { useNotificationDetailsViewModel } from '@src/viewModels/main/MyAccount/NotificationDetail/useNotificationDetailViewModel';
import { themeStyles } from '@src/views/pages/main/MyAccount/NotificationSetting/styles';

const NotificationDetails: React.FC = () => {
  const { theme, data, onToggle, toggleValue, onToggleAll, sectionTitle, type, goBack } =
    useNotificationDetailsViewModel();

  const styles = themeStyles(theme);

  const renderItem = ({
    item,
    index
  }: {
    item: { id: string; title: string; isSubscribed: boolean };
    index: number;
  }) => {
    const isLastItem = index === data.length - 1;

    return (
      <View style={[styles.itemContainer, isLastItem && { borderBottomWidth: 0 }]} key={item.id}>
        <CustomText weight="Boo" fontFamily={fonts.franklinGothicURW} textStyles={styles.itemText}>
          {item.title}
        </CustomText>

        <CustomSwitch value={item.isSubscribed} onToggle={() => onToggle(type, index)} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        onPress={goBack}
        headerText={sectionTitle}
        headerTextFontFamily={fonts.franklinGothicURW}
      />

      <View style={styles.contentContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.flatListContentContainer}>
            <View style={styles.titleRow}>
              <CustomText
                size={fontSize['2xl']}
                weight="R"
                fontFamily={fonts.notoSerifExtraCondensed}
                textStyles={styles.sectionTitle}
              >
                {sectionTitle}
              </CustomText>
              <CustomSwitch value={toggleValue} onToggle={onToggleAll} />
            </View>

            <FlatList
              data={data}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              bounces={false}
            />
          </View>
        </View>
        <ConsentFooter />
      </View>
    </SafeAreaView>
  );
};

export default NotificationDetails;
