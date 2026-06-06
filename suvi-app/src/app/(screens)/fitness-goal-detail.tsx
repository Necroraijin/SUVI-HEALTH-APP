import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSuvi } from '@/context/SuviStateContext';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';

export default function FitnessGoalDetailScreen() {
  const router = useRouter();
  const { state } = useSuvi();

  const currentSteps = state.watchData.steps;
  const targetSteps = state.watchData.stepsGoal;
  const progressPercent = Math.min(100, Math.round((currentSteps / targetSteps) * 100));

  // Cycle-aware exercise advice if female profile
  const isFemale = state.profile.gender === 'female';
  const cycleDay = state.menstrualCycleDay;
  
  let recoveryAdvice = 'Focus on cardiovascular endurance. 20-30 min evening walk recommended.';
  if (isFemale) {
    if (cycleDay >= 1 && cycleDay <= 5) {
      recoveryAdvice = '🩸 Menstrual Phase: Keep it light. Yoga, light stretching, and gentle walks are optimal.';
    } else if (cycleDay >= 6 && cycleDay <= 13) {
      recoveryAdvice = '⚡ Follicular Phase: Energy spike! Excellent time for higher-intensity cardio, HIIT, and running.';
    } else if (cycleDay === 14) {
      recoveryAdvice = '🌸 Ovulation Phase: Maximum strength. Perfect for strength personal records (PRs) or aerobics.';
    } else {
      recoveryAdvice = '🧘 Luteal Phase: Recovery focus. Lighter weights, pilates, hikes, and swimming match metabolic demands.';
    }
  }

  const mockWorkouts = [
    { id: '1', type: 'Evening Walk', duration: '22 min', calories: '110 kcal', date: 'Today' },
    { id: '2', type: 'Stretching & Mobility', duration: '15 min', calories: '45 kcal', date: 'Yesterday' },
    { id: '3', type: 'Gentle Cardio', duration: '20 min', calories: '130 kcal', date: '3 days ago' },
  ];

  return (
    <GradientBackground>
      <View style={styles.container}>
        <ScreenHeader title="Fitness Goal Detail" onBack={() => router.back()} />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Steps Progress Card */}
          <GlassCard style={styles.stepsCard}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.stepsTitle}>Daily Steps Tracker</Text>
                <Text style={styles.stepsDesc}>
                  {currentSteps.toLocaleString()} of {targetSteps.toLocaleString()} steps
                </Text>
              </View>
              <Text style={styles.stepsPercent}>{progressPercent}%</Text>
            </View>
            
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${progressPercent}%` }]} />
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statCol}>
                <Text style={styles.statVal}>1.8 km</Text>
                <Text style={styles.statLabel}>Distance</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statCol}>
                <Text style={styles.statVal}>120 kcal</Text>
                <Text style={styles.statLabel}>Active Burn</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statCol}>
                <Text style={styles.statVal}>18 min</Text>
                <Text style={styles.statLabel}>Active Time</Text>
              </View>
            </View>
          </GlassCard>

          {/* Recovery Triage / Guidance Card */}
          <Text style={styles.sectionTitle}>Recovery Guidance</Text>
          <GlassCard style={styles.guidanceCard}>
            <View style={styles.guidanceHeader}>
              <Text style={styles.guidanceIcon}>🧘</Text>
              <Text style={styles.guidanceTitle}>Suvi Adaptive Recommendation</Text>
            </View>
            <Text style={styles.guidanceBody}>{recoveryAdvice}</Text>
          </GlassCard>

          {/* Workout Logs List */}
          <Text style={styles.sectionTitle}>Recent Workouts</Text>
          <View style={styles.workoutList}>
            {mockWorkouts.map((workout) => (
              <GlassCard key={workout.id} style={styles.workoutCard}>
                <View style={styles.workoutLeft}>
                  <View style={styles.workoutIconBox}>
                    <Text style={styles.workoutIcon}>💪</Text>
                  </View>
                  <View>
                    <Text style={styles.workoutName}>{workout.type}</Text>
                    <Text style={styles.workoutDate}>{workout.date} • {workout.duration}</Text>
                  </View>
                </View>
                <Text style={styles.workoutCalories}>{workout.calories}</Text>
              </GlassCard>
            ))}
          </View>
          
        </ScrollView>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
  },
  stepsCard: {
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepsTitle: {
    fontSize: 15,
    fontFamily: 'Lexend-SemiBold',
    color: '#221a16',
  },
  stepsDesc: {
    fontSize: 12,
    fontFamily: 'Lexend',
    color: '#87736a',
  },
  stepsPercent: {
    fontSize: 22,
    fontFamily: 'Lexend-Bold',
    color: '#954921',
  },
  barTrack: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 18,
  },
  barFill: {
    height: '100%',
    backgroundColor: '#954921',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statCol: {
    alignItems: 'center',
    gap: 2,
  },
  statVal: {
    fontSize: 15,
    fontFamily: 'Lexend-Bold',
    color: '#221a16',
  },
  statLabel: {
    fontSize: 10,
    fontFamily: 'Lexend',
    color: '#87736a',
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(149, 73, 33, 0.15)',
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Lexend-SemiBold',
    color: '#954921',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    paddingLeft: 4,
  },
  guidanceCard: {
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 157, 110, 0.2)',
    backgroundColor: 'rgba(255, 157, 110, 0.05)',
  },
  guidanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  guidanceIcon: {
    fontSize: 18,
  },
  guidanceTitle: {
    fontSize: 14,
    fontFamily: 'Lexend-SemiBold',
    color: '#221a16',
  },
  guidanceBody: {
    fontSize: 13,
    fontFamily: 'Lexend',
    color: '#54433b',
    lineHeight: 18,
  },
  workoutList: {
    gap: 12,
  },
  workoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  workoutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  workoutIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 157, 110, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  workoutIcon: {
    fontSize: 18,
  },
  workoutName: {
    fontSize: 14,
    fontFamily: 'Lexend-SemiBold',
    color: '#221a16',
  },
  workoutDate: {
    fontSize: 11,
    fontFamily: 'Lexend',
    color: '#87736a',
    marginTop: 2,
  },
  workoutCalories: {
    fontSize: 14,
    fontFamily: 'Lexend-Bold',
    color: '#00696f',
  },
});
