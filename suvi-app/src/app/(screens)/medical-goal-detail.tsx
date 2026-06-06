import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSuvi } from '@/context/SuviStateContext';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';

export default function MedicalGoalDetailScreen() {
  const router = useRouter();
  const { state } = useSuvi();

  const latestBP = state.bpLogs[0] || { systolic: 120, diastolic: 80 };
  const avgBP = state.bpLogs.length > 0
    ? {
        systolic: Math.round(state.bpLogs.reduce((acc, curr) => acc + curr.systolic, 0) / state.bpLogs.length),
        diastolic: Math.round(state.bpLogs.reduce((acc, curr) => acc + curr.diastolic, 0) / state.bpLogs.length)
      }
    : { systolic: 120, diastolic: 80 };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <ScreenHeader title="Medical Goal Detail" onBack={() => router.back()} />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Compliance Card */}
          <GlassCard style={styles.complianceCard}>
            <View style={styles.complianceHeader}>
              <View style={styles.ringMock}>
                <Text style={styles.ringPercent}>92%</Text>
              </View>
              <View style={styles.complianceText}>
                <Text style={styles.complianceTitle}>Medication Compliance</Text>
                <Text style={styles.complianceDesc}>
                  You've taken 14 of 15 scheduled doses this week. Good job!
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.scheduleBtn}
              onPress={() => router.push('/(screens)/medication-today')}
            >
              <Text style={styles.scheduleBtnText}>View Schedule Timings</Text>
            </TouchableOpacity>
          </GlassCard>

          {/* Blood Pressure Trends */}
          <Text style={styles.sectionTitle}>Blood Pressure Trend</Text>
          <GlassCard style={styles.bpTrendCard}>
            <View style={styles.bpStats}>
              <View style={styles.bpStatCol}>
                <Text style={styles.bpStatLabel}>LATEST BP</Text>
                <Text style={styles.bpStatVal}>{latestBP.systolic}/{latestBP.diastolic}</Text>
                <Text style={styles.bpStatUnit}>mmHg</Text>
              </View>
              <View style={styles.bpDivider} />
              <View style={styles.bpStatCol}>
                <Text style={styles.bpStatLabel}>7-DAY AVERAGE</Text>
                <Text style={styles.bpStatVal}>{avgBP.systolic}/{avgBP.diastolic}</Text>
                <Text style={styles.bpStatUnit}>mmHg</Text>
              </View>
            </View>

            <View style={styles.alertBox}>
              <Text style={styles.alertText}>
                🟢 Your average blood pressure is stable. Daily Metoprolol adherence supports ventricular stability.
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.logBpBtn}
              onPress={() => router.push('/(tabs)/trackers')}
            >
              <Text style={styles.logBpText}>Log Vitals in Trackers</Text>
            </TouchableOpacity>
          </GlassCard>

          {/* HbA1c Targets */}
          <Text style={styles.sectionTitle}>Diabetes & HbA1c Markers</Text>
          <GlassCard style={styles.hba1cCard}>
            <View style={styles.hba1cHeader}>
              <View>
                <Text style={styles.hba1cTitle}>Target HbA1c Level</Text>
                <Text style={styles.hba1cDesc}>Goal set by endocrinologist Dr. Priya Sharma</Text>
              </View>
              <View style={styles.goalBadge}>
                <Text style={styles.goalBadgeText}>&lt; 6.5%</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.labReportRow}>
              <Text style={styles.labTitle}>Last Checked (Lipid Panel report)</Text>
              <Text style={styles.labValue}>6.8% (Slightly Elevated)</Text>
            </View>
            
            <View style={styles.adviceBox}>
              <Text style={styles.adviceText}>
                💡 Suvi Suggestion: Walking 15-20 minutes after dinner has been shown to reduce fasting glucose levels next morning.
              </Text>
            </View>
          </GlassCard>

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
  complianceCard: {
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  complianceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  ringMock: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 5,
    borderColor: '#00696f',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 105, 111, 0.05)',
  },
  ringPercent: {
    fontSize: 14,
    fontFamily: 'Lexend-Bold',
    color: '#00696f',
  },
  complianceText: {
    flex: 1,
    gap: 4,
  },
  complianceTitle: {
    fontSize: 15,
    fontFamily: 'Lexend-SemiBold',
    color: '#221a16',
  },
  complianceDesc: {
    fontSize: 12,
    fontFamily: 'Lexend',
    color: '#87736a',
    lineHeight: 16,
  },
  scheduleBtn: {
    width: '100%',
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(149, 73, 33, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(149, 73, 33, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scheduleBtnText: {
    fontSize: 13,
    fontFamily: 'Lexend-SemiBold',
    color: '#954921',
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
  bpTrendCard: {
    padding: 18,
    marginBottom: 24,
  },
  bpStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  bpStatCol: {
    alignItems: 'center',
    gap: 2,
  },
  bpStatLabel: {
    fontSize: 10,
    fontFamily: 'Lexend-SemiBold',
    color: '#87736a',
  },
  bpStatVal: {
    fontSize: 24,
    fontFamily: 'Lexend-Bold',
    color: '#221a16',
  },
  bpStatUnit: {
    fontSize: 10,
    fontFamily: 'Lexend',
    color: '#87736a',
  },
  bpDivider: {
    width: 1,
    backgroundColor: 'rgba(149, 73, 33, 0.15)',
  },
  alertBox: {
    backgroundColor: 'rgba(0, 105, 111, 0.05)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 105, 111, 0.15)',
  },
  alertText: {
    fontSize: 12,
    fontFamily: 'Lexend',
    color: '#00696f',
    lineHeight: 18,
  },
  logBpBtn: {
    width: '100%',
    height: 40,
    borderRadius: 12,
    backgroundColor: '#954921',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logBpText: {
    fontSize: 13,
    fontFamily: 'Lexend-SemiBold',
    color: '#ffffff',
  },
  hba1cCard: {
    padding: 16,
    marginBottom: 24,
  },
  hba1cHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hba1cTitle: {
    fontSize: 15,
    fontFamily: 'Lexend-SemiBold',
    color: '#221a16',
  },
  hba1cDesc: {
    fontSize: 11,
    fontFamily: 'Lexend',
    color: '#87736a',
  },
  goalBadge: {
    backgroundColor: '#00696f',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  goalBadgeText: {
    fontSize: 12,
    fontFamily: 'Lexend-Bold',
    color: '#ffffff',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(149, 73, 33, 0.08)',
    marginVertical: 14,
  },
  labReportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  labTitle: {
    fontSize: 13,
    fontFamily: 'Lexend-Medium',
    color: '#221a16',
  },
  labValue: {
    fontSize: 13,
    fontFamily: 'Lexend-Bold',
    color: '#ba1a1a',
  },
  adviceBox: {
    backgroundColor: 'rgba(255, 157, 110, 0.06)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 157, 110, 0.2)',
  },
  adviceText: {
    fontSize: 12,
    fontFamily: 'Lexend',
    color: '#954921',
    lineHeight: 18,
  },
});
