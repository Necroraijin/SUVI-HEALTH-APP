import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { useSuvi } from '@/context/SuviStateContext';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BreathingOrb } from '@/components/ui/BreathingOrb';
import { GlassCard } from '@/components/ui/GlassCard';

const STEPS = [
  { label: 'Reading document...', duration: 1500 },
  { label: 'Extracting text with OCR...', duration: 1200 },
  { label: 'Analyzing conditions & medications...', duration: 1800 },
  { label: 'Building medication schedule...', duration: 1000 },
  { label: 'Analysis complete!', duration: 800 },
];

export default function AIProcessingScreen() {
  const router = useRouter();
  const { addDocument } = useSuvi();
  const [currentStep, setCurrentStep] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let stepIndex = 0;

    const advanceStep = () => {
      if (stepIndex >= STEPS.length) {
        // Processing done — add a mock document and navigate to results
        addDocument({
          title: 'Blood Work Panel — June 2026',
          category: 'lab-report',
          summary: 'HbA1c: 6.8% (slightly elevated). Fasting glucose: 118 mg/dL. LDL cholesterol improved by 8%.',
          extractedMeds: ['Metformin 500mg — Twice daily', 'Metoprolol 25mg — Once daily'],
        });

        setTimeout(() => {
          router.replace('/(screens)/report-analysis');
        }, 300);
        return;
      }

      setCurrentStep(stepIndex);

      // Animate progress bar
      Animated.timing(progressAnim, {
        toValue: ((stepIndex + 1) / STEPS.length) * 100,
        duration: STEPS[stepIndex].duration,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: false,
      }).start();

      stepIndex++;
      setTimeout(advanceStep, STEPS[stepIndex - 1].duration);
    };

    advanceStep();
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <GradientBackground>
      <View style={styles.container}>
        {/* Breathing orb in thinking mode */}
        <View style={styles.orbContainer}>
          <BreathingOrb type="sunset" size={200} isThinking={true} />
        </View>

        {/* Status text */}
        <Text style={styles.title}>Suvi AI Analyzing</Text>
        <Text style={styles.subtitle}>
          Extracting medical data from your document...
        </Text>

        {/* Steps progress */}
        <GlassCard style={styles.stepsCard}>
          {STEPS.map((step, idx) => {
            const isActive = idx === currentStep;
            const isDone = idx < currentStep;
            return (
              <View key={idx} style={styles.stepRow}>
                <View style={[
                  styles.stepIndicator,
                  isDone && styles.stepDone,
                  isActive && styles.stepActive,
                ]}>
                  <Text style={styles.stepIndicatorText}>
                    {isDone ? '✓' : isActive ? '●' : '○'}
                  </Text>
                </View>
                <Text style={[
                  styles.stepLabel,
                  isDone && styles.stepLabelDone,
                  isActive && styles.stepLabelActive,
                ]}>
                  {step.label}
                </Text>
              </View>
            );
          })}
        </GlassCard>

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
          </View>
          <Text style={styles.progressText}>
            {Math.round(((currentStep + 1) / STEPS.length) * 100)}%
          </Text>
        </View>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  orbContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24, fontFamily: 'BodoniModa-SemiBold', color: '#954921',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15, fontFamily: 'Lexend', color: '#87736a',
    textAlign: 'center', marginBottom: 32, lineHeight: 22,
  },
  stepsCard: {
    width: '100%',
    padding: 20,
    gap: 14,
    marginBottom: 28,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepIndicator: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center', alignItems: 'center',
  },
  stepDone: {
    backgroundColor: '#00696f',
    borderColor: '#00696f',
  },
  stepActive: {
    backgroundColor: '#954921',
    borderColor: '#954921',
  },
  stepIndicatorText: {
    fontSize: 12, color: '#ffffff', fontFamily: 'Lexend-Bold',
  },
  stepLabel: {
    fontSize: 14, fontFamily: 'Lexend', color: '#87736a',
  },
  stepLabelDone: {
    color: '#00696f',
    textDecorationLine: 'line-through',
  },
  stepLabelActive: {
    color: '#954921',
    fontFamily: 'Lexend-SemiBold',
  },
  progressContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressTrack: {
    flex: 1, height: 8, borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%', borderRadius: 4,
    backgroundColor: '#954921',
  },
  progressText: {
    fontSize: 14, fontFamily: 'Lexend-SemiBold', color: '#954921',
    minWidth: 40, textAlign: 'right',
  },
});
