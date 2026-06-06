import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassCard } from '@/components/ui/GlassCard';

export default function OnboardingFirstGoalScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    goal: string;
    name: string;
    age: string;
    weight: string;
    gender: string;
  }>();

  const goalType = params.goal || 'medication';

  // State configurations based on goal
  const [stepsGoal, setStepsGoal] = useState('8000');
  const [targetWeight, setTargetWeight] = useState(goalType === 'weight-loss' ? '70' : '80');
  const [dosageFrequency, setDosageFrequency] = useState('2'); // Twice daily default

  const handleNext = () => {
    // Navigate to final onboarding step: medical sync
    router.push({
      pathname: '/(onboarding)/medical',
      params: {
        goal: params.goal,
        name: params.name,
        age: params.age,
        weight: params.weight,
        gender: params.gender,
        stepsGoal,
        targetWeight,
        dosageFrequency,
      },
    });
  };

  const renderGoalForm = () => {
    switch (goalType) {
      case 'medication':
        return (
          <GlassCard style={styles.formCard}>
            <Text style={styles.formTitle}>💊 Medication Consistency Baseline</Text>
            <Text style={styles.formDesc}>
              Configure your daily dosing regimen for blood sugar or cardiovascular regulation.
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>EXPECTED DAILY DOSAGE COUNT</Text>
              <View style={styles.dosageRow}>
                {['1', '2', '3'].map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={[styles.dosageBtn, dosageFrequency === num && styles.dosageBtnActive]}
                    onPress={() => setDosageFrequency(num)}
                  >
                    <Text style={[styles.dosageText, dosageFrequency === num && styles.dosageTextActive]}>
                      {num} Dose{num !== '1' ? 's' : ''} / Day
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </GlassCard>
        );

      case 'fitness':
        return (
          <GlassCard style={styles.formCard}>
            <Text style={styles.formTitle}>🏃 Steps Activity Target</Text>
            <Text style={styles.formDesc}>
              Select your initial active walking goal. Suvi adapts this dynamically.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>DAILY STEPS GOAL</Text>
              <View style={styles.dosageRow}>
                {['5000', '8000', '10000'].map((steps) => (
                  <TouchableOpacity
                    key={steps}
                    style={[styles.dosageBtn, stepsGoal === steps && styles.dosageBtnActive]}
                    onPress={() => setStepsGoal(steps)}
                  >
                    <Text style={[styles.dosageText, stepsGoal === steps && styles.dosageTextActive]}>
                      {parseInt(steps)/1000}k Steps
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </GlassCard>
        );

      case 'weight-loss':
      case 'weight-gain':
        return (
          <GlassCard style={styles.formCard}>
            <Text style={styles.formTitle}>⚖️ Body Mass & Weight Goal</Text>
            <Text style={styles.formDesc}>
              Enter your target weight objective. Suvi will configure your daily calorie budget.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>TARGET BODY WEIGHT (KG)</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.weightInput}
                  keyboardType="numeric"
                  value={targetWeight}
                  onChangeText={setTargetWeight}
                  maxLength={3}
                />
                <Text style={styles.unitText}>kg</Text>
              </View>
            </View>
          </GlassCard>
        );

      default:
        return null;
    }
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Goal Setup</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.questionText}>Customize your target.</Text>
          <Text style={styles.subtext}>
            Enter details so Suvi can prepare customized guidelines and trackers thresholds matching your focus areas.
          </Text>

          {renderGoalForm()}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.continueBtn} onPress={handleNext}>
            <Text style={styles.continueBtnText}>Set baseline & continue →</Text>
          </TouchableOpacity>
        </View>

      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 44,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  backButtonText: {
    fontSize: 20,
    color: '#954921',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#954921',
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  questionText: {
    fontSize: 26,
    fontWeight: '600',
    color: '#221a16',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 15,
    color: '#54433b',
    lineHeight: 22,
    marginBottom: 24,
  },
  formCard: {
    padding: 20,
    gap: 16,
  },
  formTitle: {
    fontSize: 16,
    fontFamily: 'Lexend-SemiBold',
    color: '#221a16',
  },
  formDesc: {
    fontSize: 13,
    fontFamily: 'Lexend',
    color: '#87736a',
    lineHeight: 18,
    marginBottom: 8,
  },
  inputGroup: {
    gap: 10,
  },
  label: {
    fontSize: 10,
    fontFamily: 'Lexend-SemiBold',
    color: '#87736a',
    letterSpacing: 0.5,
  },
  dosageRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dosageBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dosageBtnActive: {
    backgroundColor: '#954921',
    borderColor: '#954921',
  },
  dosageText: {
    fontSize: 12,
    fontFamily: 'Lexend-Medium',
    color: '#87736a',
  },
  dosageTextActive: {
    color: '#ffffff',
    fontFamily: 'Lexend-SemiBold',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  weightInput: {
    width: 80,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    fontSize: 18,
    fontFamily: 'Lexend-Bold',
    color: '#221a16',
    textAlign: 'center',
  },
  unitText: {
    fontSize: 16,
    fontFamily: 'Lexend-Medium',
    color: '#87736a',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  continueBtn: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    backgroundColor: '#954921',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#954921',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  continueBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
