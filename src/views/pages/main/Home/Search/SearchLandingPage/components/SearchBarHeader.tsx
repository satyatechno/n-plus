import React from 'react';
import { Animated, View, ViewStyle, TextStyle, StyleSheet } from 'react-native';

import { FormProvider, UseFormReturn } from 'react-hook-form';

import CustomHeader from '@src/views/molecules/CustomHeader';
import ControlledTextInput from '@src/views/organisms/ControlledTextInput';
import { MicrophoneIcon, CrossIcon } from '@src/assets/icons';
import { AppTheme } from '@src/themes/theme';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { spacing } from '@src/config/styleConsts';
import SkeletonLoader from '@src/views/atoms/SkeletonLoader';

export type SearchBarHeaderStyles = {
  topBar: ViewStyle;
  headerStyle: ViewStyle;
  searchBar: TextStyle | ViewStyle;
  rightIcon: ViewStyle | TextStyle;
};

type SearchFormValues = {
  searchText: string;
};

type Props = {
  theme: AppTheme;
  styles: SearchBarHeaderStyles;
  t: (key: string) => string;
  methods: UseFormReturn<SearchFormValues>;
  isSearchBar: boolean;
  setIsSearchBar: (v: boolean) => void;
  goBack: () => void;
  _startRecognizing: () => void;
  widthAnim: Animated.Value;
  onSubmitSearch: (query: string) => void;
  isSearchDropdownVisible: boolean;
  hideMic?: boolean;
  children?: React.ReactNode;
  onSearchBarTap?: () => void;
  onCloseSearchBar?: () => void;
};

const SearchBarHeader = ({
  theme,
  styles,
  t,
  methods,
  isSearchBar,
  setIsSearchBar,
  goBack,
  _startRecognizing,
  widthAnim,
  onSubmitSearch,
  isSearchDropdownVisible,
  hideMic,
  children,
  onSearchBarTap,
  onCloseSearchBar
}: Props) => (
  <View style={styles.topBar}>
    {!isSearchBar ? (
      <>
        <CustomHeader onPress={goBack} headerStyle={styles.headerStyle} />
        <FormProvider {...methods}>
          <Animated.View style={{ width: widthAnim }}>
            <ControlledTextInput
              name="searchText"
              setFormError={() => {}}
              onPress={() => {
                onSearchBarTap?.();
                setIsSearchBar(true);
              }}
              placeholder={t('screens.search.title')}
              placeholderTextColor={theme.labelsTextLabelPlace}
              textInputStyles={styles.searchBar}
              label={''}
            />
          </Animated.View>
        </FormProvider>
        {children}

        {!hideMic ? (
          <CustomHeader
            onPress={_startRecognizing}
            headerStyle={styles.headerStyle}
            iconComponent={<MicrophoneIcon fill={theme.greyButtonSecondaryOutline} />}
          />
        ) : (
          <SkeletonLoader
            height={actuatedNormalizeVertical(34)}
            width="10%"
            style={{ borderRadius: 12 }}
          ></SkeletonLoader>
        )}
      </>
    ) : (
      <FormProvider {...methods}>
        <Animated.View style={{ width: widthAnim }}>
          <ControlledTextInput
            name="searchText"
            setFormError={() => {}}
            value={methods.getValues('searchText') ?? ''}
            placeholder={t('screens.search.title')}
            placeholderTextColor={theme.labelsTextLabelPlace}
            textInputStyles={StyleSheet.flatten([
              styles.searchBar,
              {
                paddingRight: isSearchBar ? actuatedNormalize(spacing['4xl']) : 0,
                borderBottomRightRadius: isSearchBar && isSearchDropdownVisible ? 0 : undefined,
                borderBottomLeftRadius: isSearchBar && isSearchDropdownVisible ? 0 : undefined
              }
            ])}
            label={''}
            autoFocus
            returnKeyType="search"
            enablesReturnKeyAutomatically
            onSubmitEditing={() => {
              const search = (methods.getValues('searchText') ?? '').trim();
              if (!search) return;
              onSubmitSearch(search);
            }}
            rightIcon={
              (methods.watch('searchText')?.length ?? 0) > 0 ? (
                <CrossIcon
                  width={actuatedNormalize(12)}
                  height={actuatedNormalizeVertical(22)}
                  stroke={theme.greyButtonSecondaryOutline}
                />
              ) : undefined
            }
            rightIconStyle={styles.rightIcon}
            onRightIconPress={() => {
              onCloseSearchBar?.();
              methods.setValue('searchText', '');
            }}
          />
        </Animated.View>
        {children}
      </FormProvider>
    )}
  </View>
);

export default SearchBarHeader;
