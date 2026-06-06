import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSuvi } from '@/context/SuviStateContext';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';

export default function AdherenceTrackerScreen() {
  const router = useRouter();
  const { state } = useSuvi();
  
  const [filterPeriod, setFilterPeriod] = useState<'weekly' | 'monthly'>('monthly');

  // Mock adherence calendar grid for last 28 days (4 weeks)
  // true = all taken, false = missed, null = no doses scheduled
  const mockComplianceGrid = [
    true, true, true, false, true, true, true,
    true, false, true, true, true, true, true,
    true, true, false, true, true, true, true,
    true, true, true, true, false, true, true
  ];

  const takenDosesCount = mockComplianceGrid.filter(v => v === true).length;
  const complianceRate = Math.round((takenDosesCount / mockComplianceGrid.length) * 100);

  return (
    <GradientBackground>
      <View style={styles.container}>
        <ScreenHeader title="Adherence Tracker" onBack={() => router.back()} />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Main Statistics Cards */}
          <View style={styles.statsRow}>
            <GlassCard style={styles.statCard}>
              <Text style={styles.statLabel}>Compliance Rate</Text>
              <Text style={styles.statNumber}>{complianceRate}%</Text>
              <Text style={styles.statSub}>Target: &gt;90%</Text>
            </GlassCard>

            <GlassCard style={styles.statCard}>
              <Text style={styles.statLabel}>Active Streak</Text>
              <Text style={styles.statNumber}>12 Days</Text>
              <Text style={styles.statSub}>Personal Best: 24d</Text>
            </GlassCard>
          </View>

          {/* Toggle buttons */}
          <View style={styles.toggleRow}>
            {(['weekly', 'monthly'] as const).map((period) => {
              const isActive = filterPeriod === period;
              return (
                <TouchableOpacity
                  key={period}
                  style={[styles.toggleBtn, isActive && styles.toggleBtnActive]}
                  onPress={() => setFilterPeriod(period)}
                >
                  <Text style={[styles.toggleBtnText, isActive && styles.toggleBtnTextActive]}>
                    {period === 'weekly' ? '7 Days Summary' : '28 Days Heatmap'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Adherence Heatmap Grid */}
          <GlassCard style={styles.heatmapCard}>
            <Text style={styles.heatmapTitle}>Dose Checklist History</Text>
            <Text style={styles.heatmapSubtitle}>Showing compliance slots for scheduled prescription timings.</Text>
            
            <View style={styles.gridContainer}>
              {/* Day Labels */}
              <View style={styles.daysLabelsRow}>
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                  <Text key={idx} style={styles.dayLabelText}>{day}</Text>
                ))}
              </View>

              {/* Matrix nodes */}
              <View style={styles.matrixGrid}>
                {mockComplianceGrid.slice(0, filterPeriod === 'weekly' ? 7 : 28).map((val, idx) => {
                  return (
                    <View 
                      key={idx} 
                      style={[
                        styles.matrixNode, 
                        val === true && styles.nodeTaken,
                        val === false && styles.nodeMissed
                      ]}
                    >
                      <Text style={[styles.nodeText, val !== null && styles.nodeTextActive]}>
                        {idx + 1}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>

            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.nodeTaken]} />
                <Text style={styles.legendText}>All Taken</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.nodeMissed]} />
                <Text style={styles.legendText}>Missed Dose</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.nodeUpcoming]} />
                <Text style={styles.legendText}>No Schedule</Text>
              </View>
            </View>
          </GlassCard>

          {/* Clinical Context Advice */}
          <Text style={styles.sectionTitle}>Suvi Adherence Review</Text>
          <GlassCard style={styles.adviceCard}>
            <View style={styles.adviceHeader}>
              <Text style={styles.adviceIcon}>🤖</Text>
              <Text style={styles.adviceTitle}>Clinical Insights</Text>
            </View>
            <Text style={styles.adviceBody}>
              Excellent consistency overall! You missed 1 evening dose of Metformin 4 days ago. Reminders are set for 9:00 PM. Based on your schedule, keeping a backup pill container in your daily pack can prevent missing evening doses when outdoors.
            </Text>
          </GlassCard>

          {/* Action to log scheduling */}
          <TouchableOpacity
            style={styles.scheduleBtn}
            onPress={() => router.replace('/(screens)/medication-today')}
          >
            <Text style={styles.scheduleBtnText}>View Daily Timings Schedule</Text>
          </TouchableOpacity>
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
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Lexend-SemiBold',
    color: '#87736a',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  statNumber: {
    fontSize: 28,
    fontFamily: 'Lexend-Bold',
    color: '#954921',
    marginBottom: 2,
  },
  statSub: {
    fontSize: 11,
    fontFamily: 'Lexend',
    color: '#87736a',
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 24,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.65)',
    marginBottom: 20,
  },
  toggleBtn: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: '#954921',
  },
  toggleBtnText: {
    fontSize: 13,
    fontFamily: 'Lexend-Medium',
    color: '#87736a',
  },
  toggleBtnTextActive: {
    color: '#ffffff',
    fontFamily: 'Lexend-SemiBold',
  },
  heatmapCard: {
    padding: 20,
    marginBottom: 24,
  },
  heatmapTitle: {
    fontSize: 15,
    fontFamily: 'Lexend-SemiBold',
    color: '#221a16',
    marginBottom: 4,
  },
  heatmapSubtitle: {
    fontSize: 12,
    fontFamily: 'Lexend',
    color: '#87736a',
    lineHeight: 16,
    marginBottom: 20,
  },
  gridContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  daysLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  dayLabelText: {
    width: 32,
    textAlign: 'center',
    fontSize: 11,
    fontFamily: 'Lexend-SemiBold',
    color: '#87736a',
  },
  matrixGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    gap: 8,
    paddingHorizontal: 4,
  },
  matrixNode: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nodeTaken: {
    backgroundColor: '#00696f',
    borderColor: '#00696f',
  },
  nodeMissed: {
    backgroundColor: '#ba1a1a',
    borderColor: '#ba1a1a',
  },
  nodeUpcoming: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  nodeText: {
    fontSize: 12,
    fontFamily: 'Lexend-Medium',
    color: '#87736a',
  },
  nodeTextActive: {
    color: '#ffffff',
    fontFamily: 'Lexend-Bold',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(149, 73, 33, 0.08)',
    paddingTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 11,
    fontFamily: 'Lexend-Medium',
    color: '#87736a',
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Lexend-SemiBold',
    color: '#954921',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 8,
    paddingLeft: 4,
  },
  adviceCard: {
    padding: 16,
    marginBottom: 24,
  },
  adviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  adviceIcon: {
    fontSize: 18,
  },
  adviceTitle: {
    fontSize: 15,
    fontFamily: 'Lexend-SemiBold',
    color: '#221a16',
  },
  adviceBody: {
    fontSize: 13,
    fontFamily: 'Lexend',
    color: '#54433b',
    lineHeight: 18,
  },
  scheduleBtn: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    backgroundColor: '#954921',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#954921',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  scheduleBtnText: {
    fontSize: 14,
    fontFamily: 'Lexend-SemiBold',
    color: '#ffffff',
  },
});
