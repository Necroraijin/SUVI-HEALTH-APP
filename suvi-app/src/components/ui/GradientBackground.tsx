import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export const GradientBackground: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <View style={styles.container}>
      {/* Base sunset linear gradient */}
      <LinearGradient
        colors={['#fff1ec', '#ffede7', '#ffdbcc']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative ambient glowing meshes */}
      <View style={[styles.glowBlob, styles.blob1]} />
      <View style={[styles.glowBlob, styles.blob2]} />
      <View style={[styles.glowBlob, styles.blob3]} />

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff1ec',
  },
  glowBlob: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.45,
  },
  blob1: {
    top: -height * 0.2,
    left: -width * 0.1,
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: '#ffece5',
  },
  blob2: {
    top: height * 0.3,
    right: -width * 0.2,
    width: width * 0.9,
    height: width * 0.9,
    backgroundColor: '#ffdbcc',
  },
  blob3: {
    bottom: -height * 0.2,
    left: width * 0.1,
    width: width * 0.7,
    height: width * 0.7,
    backgroundColor: '#fceae4',
  },
});
