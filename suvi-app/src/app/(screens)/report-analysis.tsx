import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSuvi } from '@/context/SuviStateContext';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassCard } from '@/components/ui/GlassCard';

export default function ReportAnalysisScreen() {
  const router = useRouter();
  const { state } = useSuvi();

  // Get the most recently added document
  const latestDoc = state.documents[0];

  return (
    <GradientBackground>
      <ScrollView style={styles.container} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/(tabs)')}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Analysis Results</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Success Badge */}
        <View style={styles.successBadge}>
          <Text style={styles.successIcon}>✅</Text>
          <Text style={styles.successText}>Report Analyzed Successfully</Text>
        </View>

        {/* Report Summary Card */}
        <GlassCard style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryIcon}>📊</Text>
            <View style={styles.summaryTitleContainer}>
              <Text style={styles.summaryTitle}>{latestDoc?.title || 'Report Analysis'}</Text>
              <Text style={styles.summaryDate}>
                {latestDoc ? new Date(latestDoc.timestamp).toLocaleDateString() : 'Today'}
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
          <Text style={styles.summaryLabel}>AI Summary</Text>
          <Text style={styles.summaryBody}>
            {latestDoc?.summary || 'No summary available.'}
          </Text>
        </GlassCard>

        {/* Extracted Medications */}
        {latestDoc?.extractedMeds && latestDoc.extractedMeds.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Extracted Medications</Text>
            <View style={styles.medsList}>
              {latestDoc.extractedMeds.map((med, idx) => (
                <GlassCard key={idx} style={styles.medCard}>
                  <View style={styles.medIconBox}>
                    <Text style={styles.medIcon}>💊</Text>
                  </View>
                  <View style={styles.medInfo}>
                    <Text style={styles.medName}>{med}</Text>
                    <Text style={styles.medStatus}>Added to medication scheduler</Text>
                  </View>
                  <View style={styles.checkBadge}>
                    <Text style={styles.checkText}>✓</Text>
                  </View>
                </GlassCard>
              ))}
            </View>
          </>
        )}

        {/* Key Findings */}
        <Text style={styles.sectionTitle}>Key Findings</Text>
        <View style={styles.findingsList}>
          <GlassCard style={styles.findingCard}>
            <View style={[styles.findingDot, { backgroundColor: '#ff9d6e' }]} />
            <View style={styles.findingInfo}>
              <Text style={styles.findingTitle}>HbA1c Level: 6.8%</Text>
              <Text style={styles.findingDesc}>
                Slightly above target (6.5%). Continue Metformin adherence and reduce refined sugar intake.
              </Text>
            </View>
          </GlassCard>

          <GlassCard style={styles.findingCard}>
            <View style={[styles.findingDot, { backgroundColor: '#00dbe7' }]} />
            <View style={styles.findingInfo}>
              <Text style={styles.findingTitle}>LDL Cholesterol: Improved</Text>
              <Text style={styles.findingDesc}>
                Down 8% from last reading. Your dietary changes are working well.
              </Text>
            </View>
          </GlassCard>

          <GlassCard style={styles.findingCard}>
            <View style={[styles.findingDot, { backgroundColor: '#00696f' }]} />
            <View style={styles.findingInfo}>
              <Text style={styles.findingTitle}>Fasting Glucose: 118 mg/dL</Text>
              <Text style={styles.findingDesc}>
                Slightly elevated. Consider evening walking routine and monitor carb portions.
              </Text>
            </View>
          </GlassCard>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.vaultBtn}
            onPress={() => router.push('/(screens)/health-vault')}
            activeOpacity={0.8}
          >
            <Text style={styles.vaultBtnText}>View in Health Vault</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.chatBtn}
            onPress={() => router.push('/(tabs)/suvi-chat')}
            activeOpacity={0.8}
          >
            <Text style={styles.chatBtnText}>Discuss with Suvi</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    paddingHorizontal: 24, paddingTop: 44, paddingBottom: 40,
  },
  header: {
    height: 56, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.4)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.6)',
  },
  backIcon: { fontSize: 20, color: '#954921', fontFamily: 'Lexend-Bold' },
  headerTitle: { fontSize: 18, fontFamily: 'Lexend-SemiBold', color: '#954921' },
  placeholder: { width: 40 },

  successBadge: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'center',
    gap: 8, marginBottom: 24, marginTop: 8,
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: 'rgba(0, 105, 111, 0.1)',
    borderWidth: 1, borderColor: 'rgba(0, 105, 111, 0.2)',
  },
  successIcon: { fontSize: 16 },
  successText: { fontSize: 13, fontFamily: 'Lexend-SemiBold', color: '#00696f' },

  summaryCard: { padding: 20, marginBottom: 28 },
  summaryHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 4 },
  summaryIcon: { fontSize: 32 },
  summaryTitleContainer: { flex: 1 },
  summaryTitle: { fontSize: 18, fontFamily: 'Lexend-SemiBold', color: '#221a16' },
  summaryDate: { fontSize: 12, fontFamily: 'Lexend', color: '#87736a' },
  divider: {
    width: '100%', height: 1,
    backgroundColor: 'rgba(149, 73, 33, 0.1)', marginVertical: 16,
  },
  summaryLabel: {
    fontSize: 11, fontFamily: 'Lexend-SemiBold', color: '#954921',
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8,
  },
  summaryBody: {
    fontSize: 14, fontFamily: 'Lexend', color: '#54433b', lineHeight: 22,
  },

  sectionTitle: {
    fontSize: 18, fontFamily: 'Lexend-SemiBold', color: '#221a16',
    marginBottom: 16, paddingLeft: 4,
  },
  medsList: { gap: 12, marginBottom: 28 },
  medCard: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, gap: 14,
  },
  medIconBox: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255, 157, 110, 0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
  medIcon: { fontSize: 22 },
  medInfo: { flex: 1, gap: 2 },
  medName: { fontSize: 15, fontFamily: 'Lexend-SemiBold', color: '#221a16' },
  medStatus: { fontSize: 12, fontFamily: 'Lexend', color: '#00696f' },
  checkBadge: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#00696f',
    justifyContent: 'center', alignItems: 'center',
  },
  checkText: { fontSize: 14, color: '#ffffff', fontFamily: 'Lexend-Bold' },

  findingsList: { gap: 12, marginBottom: 32 },
  findingCard: { flexDirection: 'row', padding: 16, gap: 14 },
  findingDot: {
    width: 10, height: 10, borderRadius: 5, marginTop: 5,
  },
  findingInfo: { flex: 1, gap: 4 },
  findingTitle: { fontSize: 15, fontFamily: 'Lexend-SemiBold', color: '#221a16' },
  findingDesc: { fontSize: 13, fontFamily: 'Lexend', color: '#54433b', lineHeight: 19 },

  actionsContainer: { gap: 12, marginBottom: 40 },
  vaultBtn: {
    width: '100%', height: 56, borderRadius: 28,
    backgroundColor: '#954921',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#954921', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  vaultBtnText: { fontSize: 16, fontFamily: 'Lexend-SemiBold', color: '#ffffff' },
  chatBtn: {
    width: '100%', height: 56, borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1, borderColor: 'rgba(149,73,33,0.25)',
    justifyContent: 'center', alignItems: 'center',
  },
  chatBtnText: { fontSize: 16, fontFamily: 'Lexend-SemiBold', color: '#954921' },
});
