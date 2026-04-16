import React from 'react';
import {
  View,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StyleSheet,
  TouchableOpacity,
  BackHandler
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ExclusiveItem } from '@src/models/main/Videos/Videos';
import { useTheme } from '@src/hooks/useTheme';
import { Cross } from '@src/assets/icons';
import { isIos } from '@src/utils/platformCheck';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { spacing } from '@src/config/styleConsts';
import RNVideoPlayer from '../RNVideo';

type Props = {
  data: ExclusiveItem[];
  selectedIndex: number;
  screenHeight: number;
  activeIndex: number;
  onMomentumScrollEnd: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  setReelMode?: (value: boolean) => void;
  analyticsContentType?: string;
  analyticsScreenName?: string;
  analyticsOrganism?: string;
};

const ReelModeScreen: React.FC<Props> = ({
  data,
  selectedIndex,
  screenHeight,
  activeIndex,
  onMomentumScrollEnd,
  setReelMode,
  analyticsContentType,
  analyticsScreenName,
  analyticsOrganism
}) => {
  const [theme] = useTheme();
  const insets = useSafeAreaInsets();

  // usable screen height after removing bottom nav height for android
  const usableHeight = isIos ? screenHeight : screenHeight - insets.bottom;

  const onClose = () => {
    setReelMode?.(false);
  };

  React.useEffect(() => {
    const onBackPress = () => {
      if (setReelMode) {
        setReelMode(false);
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => {
      subscription.remove();
    };
  }, [setReelMode]);

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.reelBackground,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          elevation: 9999,
          paddingBottom: isIos ? 0 : insets.bottom
        },
        closeButton: {
          position: 'absolute',
          top: isIos ? actuatedNormalizeVertical(30) : actuatedNormalizeVertical(10),
          left: actuatedNormalize(spacing.xs),
          zIndex: 1000,
          width: actuatedNormalize(spacing['4xl']),
          height: actuatedNormalizeVertical(spacing['4xl']),
          justifyContent: 'center',
          alignItems: 'center'
        }
      }),
    [theme, insets.bottom]
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Cross color={theme.iconIconographyActiveState} />
      </TouchableOpacity>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        initialScrollIndex={Math.min(selectedIndex, Math.max(data.length - 1, 0))}
        initialNumToRender={10}
        pagingEnabled
        decelerationRate="fast"
        snapToInterval={usableHeight}
        snapToAlignment="start"
        disableIntervalMomentum
        scrollEventThrottle={16}
        bounces
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
        windowSize={3}
        maxToRenderPerBatch={1}
        onMomentumScrollEnd={onMomentumScrollEnd}
        getItemLayout={(_, index) => ({
          length: usableHeight,
          offset: usableHeight * index,
          index
        })}
        renderItem={({ item, index }) => (
          <View style={{ height: usableHeight }}>
            <RNVideoPlayer
              videoUrl={item.videoUrl ?? ''}
              thumbnail={item?.image ?? ''}
              adLanguage="es"
              keys={index}
              activeVideoIndex={activeIndex}
              initialSeekTime={0}
              autoStart={true}
              reelMode
              analyticsContentType={analyticsContentType}
              analyticsScreenName={analyticsScreenName}
              analyticsOrganism={analyticsOrganism}
              data={{ Video: { title: item.title } }}
            />
          </View>
        )}
      />
    </View>
  );
};

export default ReelModeScreen;
