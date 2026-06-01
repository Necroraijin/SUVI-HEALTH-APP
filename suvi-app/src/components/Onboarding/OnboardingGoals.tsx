import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard } from '../ui/GlassCard';
import { GradientBackground } from '../ui/GradientBackground';

interface OnboardingGoalsProps {
  currentGoal: 'medication' | 'fitness' | 'weight-loss' | 'weight-gain';
  onSelect: (goal: 'medication' | 'fitness' | 'weight-loss' | 'weight-gain') => void;
  onNext: () => void;
  onBack: () => void;
}

export const OnboardingGoals: React.FC<OnboardingGoalsProps> = ({
  currentGoal,
  onSelect,
  onNext,
  onBack,
}) => {
  const goalsList = [
    {
      id: 'medication',
      title: 'Medication Adherence',
      desc: 'Keep consistency with Metformin/Metoprolol schedules, set smart alarms, and log reports.',
      icon: '💊',
    },
    {
      id: 'weight-loss',
      title: 'Healthy Weight Loss',
      desc: 'Build balanced calorie budgets, customize nutrition/diet plans, and monitor steps.',
      icon: '🥗',
    },
    {
      id: 'weight-gain',
      title: 'Stamina & Muscle Gain',
      desc: 'Create active workout plans, log meals, track calories, and build dynamic strength.',
      icon: '💪',
    },
    {
      id: 'fitness',
      title: 'All-Round Health & Wellness',
      desc: 'Log daily water, track cycle phases (Luteal/Follicular), monitor heart rate, and sync device data.',
      icon: '🌸',
    },
  ] as const;

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Companion Goals</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.questionText}>What shall we focus on first?</Text>
          <Text style={styles.subtext}>
            Suvi adapts her proactive recommendations, dashboards, and daily chats to match your chosen focus.
          </Text>

          <View style={styles.optionsContainer}>
            {goalsList.map((g) => {
              const isSelected = currentGoal === g.id;
              return (
                <TouchableOpacity
                  key={g.id}
                  activeOpacity={0.9}
                  onPress={() => onSelect(g.id)}
                  style={[styles.optionCard, isSelected && styles.selectedOption]}
                >
                  <View style={styles.optionIconContainer}>
                    <Text style={styles.optionIcon}>{g.icon}</Text>
                  </View>
                  <View style={styles.optionTextContainer}>
                    <Text style={[styles.optionTitle, isSelected && styles.selectedText]}>
                      {g.title}
                    </Text>
                    <Text style={[styles.optionDesc, isSelected && styles.selectedTextDim]}>
                      {g.desc}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.button} onPress={onNext} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingBottom: 24,
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
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.55)',
    shadowColor: '#954921',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  selectedOption: {
    backgroundColor: '#954921',
    borderColor: '#954921',
    shadowColor: '#954921',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  optionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionIcon: {
    fontSize: 22,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#221a16',
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 13,
    color: '#54433b',
    lineHeight: 18,
  },
  selectedText: {
    color: '#ffffff',
  },
  selectedTextDim: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  footer: {
    paddingHorizontal: 24,
  },
  button: {
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
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
