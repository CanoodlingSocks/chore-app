import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const LoadingSpinner = ({ size = 'small', color = '#0000ff' }) => (
  <View style={[styles.container, styles.horizontal]}>
    <ActivityIndicator size={typeof size === 'number' ? size : (size === 'large' ? 'large' : 'small')} color={color} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingSpinner;

