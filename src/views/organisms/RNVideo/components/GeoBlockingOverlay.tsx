import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocationStore } from '@src/zustand/locationStore';

const GeoBlockingOverlay = () => {
  const { permissionDenied, openSettings } = useLocationStore();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: 'https://www.shutterstock.com/image-vector/location-map-forbidden-sign-no-600nw-2640824369.jpg'
        }}
        style={{ height: 50, width: 50 }}
      />
      <Text style={{ color: 'black' }}>
        {permissionDenied
          ? t('screens.videos.text.enableLocationPermission')
          : t('screens.videos.text.videoNotAvailable')}
      </Text>
      {permissionDenied && (
        <Text style={{ color: 'blue' }} onPress={() => openSettings()}>
          Open Settings
        </Text>
      )}
    </View>
  );
};

export default GeoBlockingOverlay;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  }
});
