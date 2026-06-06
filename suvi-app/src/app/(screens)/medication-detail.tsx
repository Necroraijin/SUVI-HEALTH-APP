import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSuvi } from '@/context/SuviStateContext';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';

export default function MedicationDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, removeMedication } = useSuvi();

  const med = state.medications.find((m) => m.id === id);

  if (!med) {
    return (
      <GradientBackground>
        <View style={styles.container}>
          <ScreenHeader title="Medication Detail" onBack={() => router.back()} />
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Medication not found.</Text>
          </View>
        </View>
      </GradientBackground>
    );
  }

  // Calculate remaining days until refill
  const getDaysLeft = (refillDateStr: string) => {
    const refill = new Date(refillDateStr);
    const diffTime = refill.getTime() - Date.now();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysLeft = getDaysLeft(med.refillDate);

  const handleDelete = () => {
    removeMedication(med.id);
    router.replace('/(screens)/medication-today');
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <ScreenHeader title={med.name} onBack={() => router.back()} />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Main Info Card */}
          <GlassCard style={styles.mainCard}>
            <View style={styles.iconContainer}>
              <Text style={styles.pillIcon}>💊</Text>
            </View>
            <Text style={styles.medTitle}>{med.name}</Text>
            <Text style={styles.medDosage}>{med.dosage}</Text>
            <View style={styles.divider} />
            
            <View style={styles.timingRow}>
              <Text style={styles.timingLabel}>⏰ TIMING</Text>
              <Text style={styles.timingVal}>{med.timing.join(', ')}</Text>
            </View>
          </GlassCard>

          {/* Refill Countdown Card */}
          <GlassCard style={styles.refillCard}>
            <View style={styles.refillLeft}>
              <Text style={styles.refillIcon}>📦</Text>
              <View>
                <Text style={styles.refillTitle}>Refill Schedule</Text>
                <Text style={styles.refillDateText}>
                  Due by {new Date(med.refillDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </Text>
              </View>
            </View>
            <View style={styles.refillRight}>
              <Text style={styles.daysNumber}>{daysLeft}</Text>
              <Text style={styles.daysLabel}>Days Left</Text>
            </View>
          </GlassCard>

          {/* Purpose Details */}
          <Text style={styles.sectionTitle}>Indication & Purpose</Text>
          <GlassCard style={styles.infoCard}>
            <Text style={styles.infoBody}>{med.purpose}</Text>
          </GlassCard>

          {/* Side Effects */}
          {med.sideEffects && med.sideEffects.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Known Side Effects</Text>
              <GlassCard style={styles.infoCard}>
                {med.sideEffects.map((effect, index) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.listText}>{effect}</Text>
                  </View>
                ))}
              </GlassCard>
            </>
          )}

          {/* Food/Drug Interaction Warnings */}
          {med.interactions && med.interactions.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Interaction Warnings</Text>
              <GlassCard style={[styles.infoCard, styles.warningCard]}>
                {med.interactions.map((warn, index) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.bulletWarning}>⚠️</Text>
                    <Text style={styles.listTextWarning}>{warn}</Text>
                  </View>
                ))}
              </GlassCard>
            </>
          )}

          {/* Delete Action Button */}
          <TouchableOpacity 
            style={styles.deleteBtn}
            onPress={handleDelete}
            activeOpacity={0.8}
          >
            <Text style={styles.deleteBtnText}>Discontinue Medication</Text>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Lexend',
    color: '#87736a',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
  },
  mainCard: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 20,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 157, 110, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  pillIcon: {
    fontSize: 32,
  },
  medTitle: {
    fontSize: 22,
    fontFamily: 'Lexend-Bold',
    color: '#221a16',
    marginBottom: 4,
  },
  medDosage: {
    fontSize: 15,
    fontFamily: 'Lexend-Medium',
    color: '#87736a',
    marginBottom: 16,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(149, 73, 33, 0.12)',
    marginBottom: 16,
  },
  timingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  timingLabel: {
    fontSize: 11,
    fontFamily: 'Lexend-SemiBold',
    color: '#954921',
    letterSpacing: 0.5,
  },
  timingVal: {
    fontSize: 14,
    fontFamily: 'Lexend-SemiBold',
    color: '#221a16',
  },
  refillCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  refillLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  refillIcon: {
    fontSize: 24,
  },
  refillTitle: {
    fontSize: 14,
    fontFamily: 'Lexend-SemiBold',
    color: '#221a16',
    marginBottom: 2,
  },
  refillDateText: {
    fontSize: 11,
    fontFamily: 'Lexend',
    color: '#87736a',
  },
  refillRight: {
    alignItems: 'center',
    backgroundColor: 'rgba(149, 73, 33, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 60,
  },
  daysNumber: {
    fontSize: 18,
    fontFamily: 'Lexend-Bold',
    color: '#954921',
    lineHeight: 22,
  },
  daysLabel: {
    fontSize: 9,
    fontFamily: 'Lexend-Medium',
    color: '#954921',
    textTransform: 'uppercase',
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
  infoCard: {
    padding: 16,
    gap: 10,
    marginBottom: 20,
  },
  warningCard: {
    backgroundColor: 'rgba(186, 26, 26, 0.05)',
    borderColor: 'rgba(186, 26, 26, 0.15)',
    borderWidth: 1,
  },
  infoBody: {
    fontSize: 14,
    fontFamily: 'Lexend',
    color: '#54433b',
    lineHeight: 20,
  },
  listItem: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  bullet: {
    fontSize: 14,
    color: '#954921',
    fontWeight: 'bold',
  },
  listText: {
    fontSize: 14,
    fontFamily: 'Lexend',
    color: '#54433b',
    lineHeight: 20,
    flex: 1,
  },
  bulletWarning: {
    fontSize: 12,
    marginTop: 2,
  },
  listTextWarning: {
    fontSize: 14,
    fontFamily: 'Lexend-Medium',
    color: '#ba1a1a',
    lineHeight: 20,
    flex: 1,
  },
  deleteBtn: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(186, 26, 26, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(186, 26, 26, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  deleteBtnText: {
    fontSize: 14,
    fontFamily: 'Lexend-SemiBold',
    color: '#ba1a1a',
  },
});
