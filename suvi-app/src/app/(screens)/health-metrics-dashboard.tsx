import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSuvi } from '@/context/SuviStateContext';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';

export default function HealthMetricsDashboard() {
  const router = useRouter();
  const { state } = useSuvi();
  
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const latestBP = state.bpLogs[0] || { systolic: 120, diastolic: 80 };
  const latestGlucose = state.glucoseLogs[0] || { value: 105, mealTag: 'fasting' };
  const latestWeight = state.weightLogs[0] || { weight: state.profile.weight };

  const metrics = [
    {
      id: 'steps',
      title: 'Steps Walked',
      value: state.watchData.steps.toLocaleString(),
      subValue: `Goal: ${state.watchData.stepsGoal.toLocaleString()}`,
      icon: '🏃',
      color: '#00dbe7',
      route: '/(tabs)/trackers', // Go to trackers tab
    },
    {
      id: 'sleep',
      title: 'Sleep Duration',
      value: `${state.watchData.sleepHours} hrs`,
      subValue: 'Target: 8.0 hrs',
      icon: '😴',
      color: '#855cf8',
      route: '/(tabs)/trackers',
    },
    {
      id: 'bp',
      title: 'Blood Pressure',
      value: `${latestBP.systolic}/${latestBP.diastolic}`,
      subValue: 'mmHg • Normal',
      icon: '❤️',
      color: '#ba1a1a',
      route: '/(tabs)/trackers',
    },
    {
      id: 'glucose',
      title: 'Blood Glucose',
      value: `${latestGlucose.value}`,
      subValue: `mg/dL • ${latestGlucose.mealTag === 'fasting' ? 'Fasting' : 'Post-Meal'}`,
      icon: '🩸',
      color: '#954921',
      route: '/(screens)/blood-glucose',
    },
    {
      id: 'heart-rate',
      title: 'Resting HR',
      value: `${state.watchData.restingHeartRate} bpm`,
      subValue: 'Normal range: 60-100',
      icon: '💓',
      color: '#ff9d6e',
      route: '/(tabs)/trackers',
    },
    {
      id: 'weight',
      title: 'Body Weight',
      value: `${latestWeight.weight} kg`,
      subValue: 'Target: 70 kg',
      icon: '⚖️',
      color: '#00696f',
      route: '/(screens)/weight-goal-detail',
    },
  ];

  return (
    <GradientBackground>
      <View style={styles.container}>
        <ScreenHeader 
          title="Health Dashboard" 
          onBack={() => router.push('/(tabs)')}
          rightAction={
            <TouchableOpacity 
              style={styles.headerBtn}
              onPress={() => router.push('/(screens)/manage-trackers')}
            >
              <Text style={styles.headerBtnText}>⚙️ Edit</Text>
            </TouchableOpacity>
          }
        />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Period Selector Toggle */}
          <View style={styles.periodRow}>
            {(['daily', 'weekly', 'monthly'] as const).map((p) => {
              const isActive = period === p;
              const labels = { daily: 'Today', weekly: '7 Days', monthly: '30 Days' };
              return (
                <TouchableOpacity
                  key={p}
                  style={[styles.periodBtn, isActive && styles.periodBtnActive]}
                  onPress={() => setPeriod(p)}
                >
                  <Text style={[styles.periodBtnText, isActive && styles.periodBtnTextActive]}>
                    {labels[p]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Quick Health Summary Message */}
          <GlassCard style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Health Summary</Text>
            <Text style={styles.summaryBody}>
              {state.watchSynced 
                ? `Vitals look stable. Steps are at ${Math.round((state.watchData.steps / state.watchData.stepsGoal)*100)}% of goal, and heart rate is optimal. Daily metrics are updating live.`
                : 'Please sync your smartwatch in the Onboarding or Today screen to capture automatic steps, resting heart rate, and sleep analytics.'
              }
            </Text>
          </GlassCard>

          {/* Grid of Metric Cards */}
          <Text style={styles.sectionTitle}>Key Vital Metrics</Text>
          <View style={styles.metricsGrid}>
            {metrics.map((metric) => {
              // Only display metric if it is enabled in activeTrackers list
              const isEnabled = state.activeTrackers.includes(metric.id) || 
                                (metric.id === 'heart-rate' && state.activeTrackers.includes('heart-rate')) ||
                                (metric.id === 'sleep' && state.activeTrackers.includes('sleep')) ||
                                (metric.id === 'steps' && state.activeTrackers.includes('steps'));
              
              if (!isEnabled) return null;

              return (
                <TouchableOpacity
                  key={metric.id}
                  style={styles.gridCardWrapper}
                  onPress={() => router.push(metric.route as any)}
                  activeOpacity={0.9}
                >
                  <GlassCard style={styles.metricCard}>
                    <View style={styles.cardHeader}>
                      <View style={[styles.iconBox, { backgroundColor: metric.color + '15' }]}>
                        <Text style={styles.icon}>{metric.icon}</Text>
                      </View>
                      <View style={styles.sparklineContainer}>
                        {/* Mock sparkline graph bars */}
                        <View style={[styles.sparkBar, { height: 10, backgroundColor: metric.color }]} />
                        <View style={[styles.sparkBar, { height: 16, backgroundColor: metric.color, opacity: 0.6 }]} />
                        <View style={[styles.sparkBar, { height: 12, backgroundColor: metric.color, opacity: 0.8 }]} />
                        <View style={[styles.sparkBar, { height: 22, backgroundColor: metric.color }]} />
                      </View>
                    </View>

                    <Text style={styles.metricTitle}>{metric.title}</Text>
                    <Text style={styles.metricValue}>{metric.value}</Text>
                    <Text style={styles.metricSub}>{metric.subValue}</Text>
                  </GlassCard>
                </TouchableOpacity>
              );
            })}
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
  headerBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  headerBtnText: {
    fontSize: 12,
    fontFamily: 'Lexend-SemiBold',
    color: '#954921',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
  },
  periodRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 24,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.65)',
    marginBottom: 20,
  },
  periodBtn: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  periodBtnActive: {
    backgroundColor: '#954921',
  },
  periodBtnText: {
    fontSize: 13,
    fontFamily: 'Lexend-Medium',
    color: '#87736a',
  },
  periodBtnTextActive: {
    color: '#ffffff',
    fontFamily: 'Lexend-SemiBold',
  },
  summaryCard: {
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  summaryTitle: {
    fontSize: 15,
    fontFamily: 'Lexend-SemiBold',
    color: '#221a16',
    marginBottom: 6,
  },
  summaryBody: {
    fontSize: 13,
    fontFamily: 'Lexend',
    color: '#54433b',
    lineHeight: 19,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Lexend-SemiBold',
    color: '#954921',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  gridCardWrapper: {
    width: '50%',
    padding: 8,
  },
  metricCard: {
    padding: 14,
    height: 145,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 18,
  },
  sparklineContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    height: 24,
  },
  sparkBar: {
    width: 4,
    borderRadius: 2,
  },
  metricTitle: {
    fontSize: 12,
    fontFamily: 'Lexend-Medium',
    color: '#87736a',
    marginTop: 8,
  },
  metricValue: {
    fontSize: 20,
    fontFamily: 'Lexend-Bold',
    color: '#221a16',
    marginVertical: 2,
  },
  metricSub: {
    fontSize: 11,
    fontFamily: 'Lexend',
    color: '#87736a',
  },
});
