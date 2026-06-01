import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BreathingOrb } from '../ui/BreathingOrb';
import { GlassCard } from '../ui/GlassCard';
import { GradientBackground } from '../ui/GradientBackground';

interface OnboardingWelcomeProps {
  onNext: () => void;
}

export const OnboardingWelcome: React.FC<OnboardingWelcomeProps> = ({ onNext }) => {
  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.flexSpacer} />

        {/* Animated breathing avatar */}
        <View style={styles.avatarContainer}>
          <BreathingOrb type="blue" size={200} />
        </View>

        {/* Introduction Panel */}
        <GlassCard style={styles.introCard}>
          <Text style={styles.title}>Hi, I'm Suvi.</Text>
          <Text style={styles.subtitle}>
            I'm here to help you feel better — not just track you.
          </Text>
        </GlassCard>

        <View style={styles.flexSpacer} />

        {/* Let's Begin Button */}
        <TouchableOpacity style={styles.button} onPress={onNext} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Let's begin</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </GradientBackground>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  flexSpacer: {
    flex: 1,
  },
  avatarContainer: {
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  introCard: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    paddingVertical: 24,
  },
  title: {
    fontFamily: 'System',
    fontSize: 34,
    fontWeight: '600',
    color: '#00696f',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: 'System',
    fontSize: 18,
    color: '#54433b',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 8,
  },
  button: {
    width: '100%',
    maxWidth: 360,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#00dbe7',
    justifyContent: 'center',
    alignItems: 'center',
    // Button shadows
    shadowColor: '#00dbe7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonText: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '600',
    color: '#002022',
  },
});
