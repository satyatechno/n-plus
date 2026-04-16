import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { GeoblockWarning } from '@src/assets/images';

/**
 * GeoblockWarningScreen
 *
 * Full-area overlay shown inside the live stream player when the user's IP
 * is detected as geo-restricted via the TVSS `verifyAuth` endpoint.
 *
 * - Uses a **local asset** (`warning-geoblock.webp`) so it displays correctly
 *   even when network connectivity is limited.
 * - Designed to fill the player container completely (use inside a positioned parent).
 */
const GeoblockWarningScreen = () => (
  <View style={styles.container}>
    <Image source={GeoblockWarning} style={styles.image} resizeMode="contain" />
  </View>
);

export default GeoblockWarningScreen;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },
  image: {
    width: '100%',
    height: '100%'
  }
});
