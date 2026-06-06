import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSuvi, Medication } from '@/context/SuviStateContext';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';

export default function MedicationTodayScreen() {
  const router = useRouter();
  const { state, toggleMedication } = useSuvi();

  // Helper to categorize timings to time-of-day slots
  const getSlot = (timeStr: string): 'Morning' | 'Afternoon' | 'Evening' => {
    const timeLower = timeStr.toLowerCase();
    if (timeLower.includes('am')) {
      const hour = parseInt(timeLower.split(':')[0]);
      if (hour >= 11 && hour < 12) return 'Afternoon';
      return 'Morning';
    }
    if (timeLower.includes('pm')) {
      const hour = parseInt(timeLower.split(':')[0]);
      if (hour < 4 || hour === 12) return 'Afternoon';
      return 'Evening';
    }
    return 'Morning';
  };

  // Build daily timeline slots
  const slots: Record<'Morning' | 'Afternoon' | 'Evening', { med: Medication; timeIndex: number; timeLabel: string }[]> = {
    Morning: [],
    Afternoon: [],
    Evening: [],
  };

  state.medications.forEach((med) => {
    med.timing.forEach((time, index) => {
      const slot = getSlot(time);
      slots[slot].push({ med, timeIndex: index, timeLabel: time });
    });
  });

  const totalDoses = state.medications.reduce((acc, curr) => acc + curr.totalDoses, 0);
  const takenDoses = state.medications.reduce((acc, curr) => {
    return acc + curr.takenToday.filter(Boolean).length;
  }, 0);

  return (
    <GradientBackground>
      <View style={styles.container}>
        <ScreenHeader 
          title="Daily Schedule" 
          onBack={() => router.push('/(tabs)')}
          rightAction={
            <TouchableOpacity 
              style={styles.headerBtn}
              onPress={() => router.push('/(screens)/adherence-tracker')}
            >
              <Text style={styles.headerBtnText}>📊 Stats</Text>
            </TouchableOpacity>
          }
        />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Progress Header Card */}
          <GlassCard style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <View>
                <Text style={styles.progressTitle}>Medication Compliance</Text>
                <Text style={styles.progressDesc}>
                  {takenDoses} of {totalDoses} doses logged today
                </Text>
              </View>
              <Text style={styles.progressPercent}>
                {totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0}%
              </Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { width: `${totalDoses > 0 ? (takenDoses / totalDoses) * 100 : 0}%` }
                ]} 
              />
            </View>
          </GlassCard>

          {/* Time Slot Sections */}
          {(['Morning', 'Afternoon', 'Evening'] as const).map((slotName) => {
            const list = slots[slotName];
            if (list.length === 0) return null;

            return (
              <View key={slotName} style={styles.slotSection}>
                <Text style={styles.slotHeader}>🌅 {slotName}</Text>
                
                <View style={styles.slotList}>
                  {list.map(({ med, timeIndex, timeLabel }) => {
                    const isTaken = med.takenToday[timeIndex];
                    return (
                      <GlassCard key={`${med.id}-${timeIndex}`} style={[styles.medCard, isTaken && styles.medCardCompleted]}>
                        <TouchableOpacity
                          style={styles.checkArea}
                          onPress={() => toggleMedication(med.id, timeIndex)}
                          activeOpacity={0.8}
                        >
                          <View style={[styles.checkbox, isTaken && styles.checkboxChecked]}>
                            {isTaken && <Text style={styles.checkboxCheck}>✓</Text>}
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity 
                          style={styles.infoArea}
                          onPress={() => router.push({
                            pathname: '/(screens)/medication-detail',
                            params: { id: med.id }
                          })}
                          activeOpacity={0.8}
                        >
                          <View style={styles.medTextGroup}>
                            <Text style={[styles.medName, isTaken && styles.medNameCrossed]}>
                              {med.name}
                            </Text>
                            <Text style={styles.medDosage}>
                              {med.dosage} • {timeLabel}
                            </Text>
                          </View>
                          <Text style={styles.infoIcon}>ⓘ</Text>
                        </TouchableOpacity>
                      </GlassCard>
                    );
                  })}
                </View>
              </View>
            );
          })}

          {/* Floating-like action button at bottom */}
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => router.push('/(screens)/add-medication')}
            activeOpacity={0.8}
          >
            <Text style={styles.addBtnText}>+ Add New Medication</Text>
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
  progressCard: {
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 14,
    fontFamily: 'Lexend-SemiBold',
    color: '#221a16',
    marginBottom: 2,
  },
  progressDesc: {
    fontSize: 12,
    fontFamily: 'Lexend',
    color: '#87736a',
  },
  progressPercent: {
    fontSize: 24,
    fontFamily: 'Lexend-Bold',
    color: '#954921',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#954921',
    borderRadius: 4,
  },
  slotSection: {
    marginBottom: 24,
  },
  slotHeader: {
    fontSize: 12,
    fontFamily: 'Lexend-SemiBold',
    color: '#954921',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    paddingLeft: 4,
  },
  slotList: {
    gap: 12,
  },
  medCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  medCardCompleted: {
    opacity: 0.85,
    backgroundColor: 'rgba(0, 105, 111, 0.04)',
    borderColor: 'rgba(0, 105, 111, 0.1)',
  },
  checkArea: {
    padding: 6,
    marginRight: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#954921',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#00696f',
    borderColor: '#00696f',
  },
  checkboxCheck: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  infoArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  medTextGroup: {
    flex: 1,
    gap: 2,
  },
  medName: {
    fontSize: 16,
    fontFamily: 'Lexend-SemiBold',
    color: '#221a16',
  },
  medNameCrossed: {
    textDecorationLine: 'line-through',
    color: '#87736a',
  },
  medDosage: {
    fontSize: 12,
    fontFamily: 'Lexend',
    color: '#87736a',
  },
  infoIcon: {
    fontSize: 18,
    color: '#954921',
    paddingHorizontal: 8,
  },
  addBtn: {
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
    marginTop: 12,
  },
  addBtnText: {
    fontSize: 16,
    fontFamily: 'Lexend-SemiBold',
    color: '#ffffff',
  },
});
