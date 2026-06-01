import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

interface BreathingOrbProps {
  size?: number;
  type?: 'blue' | 'sunset';
  isThinking?: boolean;
}

export const BreathingOrb: React.FC<BreathingOrbProps> = ({
  size = 180,
  type = 'sunset',
  isThinking = false,
}) => {
  const coreScale = useSharedValue(1);
  const aura1Scale = useSharedValue(1);
  const aura2Scale = useSharedValue(1);
  const aura1Opacity = useSharedValue(0.5);
  const aura2Opacity = useSharedValue(0.3);

  // Set up animations
  useEffect(() => {
    // Core breathing loop
    const duration = isThinking ? 1000 : 3000;
    coreScale.value = withRepeat(
      withTiming(isThinking ? 1.06 : 1.05, {
        duration,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      true
    );

    // Aura 1 breathing loop
    aura1Scale.value = withRepeat(
      withTiming(isThinking ? 1.25 : 1.2, {
        duration,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      true
    );
    aura1Opacity.value = withRepeat(
      withTiming(isThinking ? 0.7 : 0.6, {
        duration,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      true
    );

    // Aura 2 breathing loop (offset in delay)
    aura2Scale.value = withDelay(
      300,
      withRepeat(
        withTiming(isThinking ? 1.45 : 1.35, {
          duration,
          easing: Easing.inOut(Easing.quad),
        }),
        -1,
        true
      )
    );
    aura2Opacity.value = withDelay(
      300,
      withRepeat(
        withTiming(isThinking ? 0.5 : 0.4, {
          duration,
          easing: Easing.inOut(Easing.quad),
        }),
        -1,
        true
      )
    );
  }, [isThinking]);

  // Animated styles
  const animatedCoreStyle = useAnimatedStyle(() => ({
    transform: [{ scale: coreScale.value }],
  }));

  const animatedAura1Style = useAnimatedStyle(() => ({
    transform: [{ scale: aura1Scale.value }],
    opacity: aura1Opacity.value,
  }));

  const animatedAura2Style = useAnimatedStyle(() => ({
    transform: [{ scale: aura2Scale.value }],
    opacity: aura2Opacity.value,
  }));

  // Define gradients based on blue vs sunset
  const coreColors: [string, string, string] =
    type === 'blue'
      ? ['#e1fdff', '#00f2ff', '#00696f'] // Welcome blue gradient
      : ['#FFD2A8', '#ff9d6e', '#954921']; // Warm sunset gradient

  const aura1Colors: [string, string] =
    type === 'blue'
      ? ['rgba(0, 219, 231, 0.25)', 'transparent']
      : ['rgba(255, 157, 110, 0.25)', 'transparent'];

  const aura2Colors: [string, string] =
    type === 'blue'
      ? ['rgba(0, 242, 255, 0.15)', 'transparent']
      : ['rgba(236, 178, 255, 0.15)', 'transparent'];

  return (
    <View style={[styles.container, { width: size * 1.5, height: size * 1.5 }]}>
      {/* Outer Diffused Glow 2 */}
      <Animated.View
        style={[
          styles.aura,
          { width: size, height: size, borderRadius: size / 2 },
          animatedAura2Style,
        ]}
      >
        <LinearGradient colors={aura2Colors} style={StyleSheet.absoluteFill} />
      </Animated.View>

      {/* Outer Diffused Glow 1 */}
      <Animated.View
        style={[
          styles.aura,
          { width: size, height: size, borderRadius: size / 2 },
          animatedAura1Style,
        ]}
      >
        <LinearGradient colors={aura1Colors} style={StyleSheet.absoluteFill} />
      </Animated.View>

      {/* Solid Core */}
      <Animated.View
        style={[
          styles.core,
          { width: size * 0.75, height: size * 0.75, borderRadius: (size * 0.75) / 2 },
          animatedCoreStyle,
          type === 'sunset' ? styles.sunsetShadow : styles.blueShadow,
        ]}
      >
        <LinearGradient
          colors={coreColors}
          start={{ x: 0.2, y: 0.2 }}
          end={{ x: 0.8, y: 0.8 }}
          style={StyleSheet.absoluteFill}
        />
        {/* Shimmer light layer */}
        <View style={styles.shimmer} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  aura: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  core: {
    position: 'absolute',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  shimmer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    opacity: 0.5,
  },
  sunsetShadow: {
    shadowColor: '#954921',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  blueShadow: {
    shadowColor: '#00696f',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
});
