import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useSuvi } from '@/context/SuviStateContext';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';

export default function WeightGoalDetailScreen() {
  const router = useRouter();
  const { state, logWeight } = useSuvi();
  
  const [newWeight, setNewWeight] = useState('');
  const [logStatus, setLogStatus] = useState('');

  const currentWeight = state.profile.weight;
  const targetWeight = state.profile.focusGoal === 'weight-loss' ? 70 : 80; // Default targets based on goal
  const heightM = state.profile.height / 100;
  const bmi = (currentWeight / (heightM * heightM)).toFixed(1);

  const getBMICategory = (val: number) => {
    if (val < 18.5) return 'Underweight';
    if (val < 25.0) return 'Normal weight';
    if (val < 30.0) return 'Overweight';
    return 'Obese';
  };

  const handleLog = () => {
    const val = parseFloat(newWeight);
    if (isNaN(val) || val <= 0) return;

    logWeight(val);
    setNewWeight('');
    setLogStatus('🟢 Weight log saved successfully!');
    setTimeout(() => setLogStatus(''), 3000);
  };

  const progressPercent = Math.min(100, Math.round((currentWeight / targetWeight) * 100));

  return (
    <GradientBackground>
      <View style={styles.container}>
        <ScreenHeader title="Weight Goal Detail" onBack={() => router.back()} />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Progress Header Card */}
          <GlassCard style={styles.progressCard}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.progressTitle}>Weight Target</Text>
                <Text style={styles.progressDesc}>Current: {currentWeight} kg • Target: {targetWeight} kg</Text>
              </View>
              <Text style={styles.progressVal}>{currentWeight} kg</Text>
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${progressPercent}%` }]} />
            </View>
            <Text style={styles.progressPercentText}>{progressPercent}% of Target Achieved</Text>
          </GlassCard>

          {/* BMI Card */}
          <GlassCard style={styles.bmiCard}>
            <Text style={styles.bmiTitle}>Body Mass Index (BMI)</Text>
            <View style={styles.bmiContent}>
              <Text style={styles.bmiVal}>{bmi}</Text>
              <View>
                <Text style={styles.bmiStatus}>{getBMICategory(parseFloat(bmi))}</Text>
                <Text style={styles.bmiSub}>Height: {state.profile.height} cm</Text>
              </View>
            </View>
          </GlassCard>

          {/* Log Weigh-In Form */}
          <Text style={styles.sectionTitle}>Log Today's Weigh-In</Text>
          <GlassCard style={styles.logCard}>
            <Text style={styles.logDesc}>Track weekly or daily weights to update your recovery metrics.</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.weightInput}
                value={newWeight}
                onChangeText={setNewWeight}
                keyboardType="numeric"
                placeholder="74.5"
                placeholderTextColor="#87736a"
                maxLength={5}
              />
              <Text style={styles.unitText}>kg</Text>
            </View>

            {logStatus !== '' && <Text style={styles.logStatusText}>{logStatus}</Text>}

            <TouchableOpacity 
              style={[styles.submitBtn, newWeight.trim() === '' && styles.submitBtnDisabled]}
              disabled={newWeight.trim() === ''}
              onPress={handleLog}
              activeOpacity={0.8}
            >
              <Text style={styles.submitBtnText}>Record Weigh-in</Text>
            </TouchableOpacity>
          </GlassCard>

          {/* Weight Log History */}
          <Text style={styles.sectionTitle}>Weigh-in History</Text>
          <View style={styles.historyList}>
            {state.weightLogs.map((log) => {
              const date = new Date(log.timestamp);
              return (
                <GlassCard key={log.id} style={styles.historyCard}>
                  <View>
                    <Text style={styles.historyWeight}>{log.weight} kg</Text>
                    <Text style={styles.historyDate}>
                      {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Text>
                  </View>
                  <Text style={styles.historyTrend}>
                    {log.weight > targetWeight ? '⬆️ Above Target' : '⬇️ Near Target'}
                  </Text>
                </GlassCard>
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
  },
  progressCard: {
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 15,
    fontFamily: 'Lexend-SemiBold',
    color: '#221a16',
  },
  progressDesc: {
    fontSize: 12,
    fontFamily: 'Lexend',
    color: '#87736a',
  },
  progressVal: {
    fontSize: 22,
    fontFamily: 'Lexend-Bold',
    color: '#954921',
  },
  barTrack: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  barFill: {
    height: '100%',
    backgroundColor: '#954921',
  },
  progressPercentText: {
    fontSize: 11,
    fontFamily: 'Lexend-SemiBold',
    color: '#954921',
    textAlign: 'right',
  },
  bmiCard: {
    padding: 16,
    marginBottom: 24,
  },
  bmiTitle: {
    fontSize: 13,
    fontFamily: 'Lexend-SemiBold',
    color: '#87736a',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  bmiContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  bmiVal: {
    fontSize: 32,
    fontFamily: 'Lexend-Bold',
    color: '#00696f',
  },
  bmiStatus: {
    fontSize: 16,
    fontFamily: 'Lexend-SemiBold',
    color: '#221a16',
  },
  bmiSub: {
    fontSize: 12,
    fontFamily: 'Lexend',
    color: '#87736a',
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Lexend-SemiBold',
    color: '#954921',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  logCard: {
    padding: 18,
    marginBottom: 24,
  },
  logDesc: {
    fontSize: 13,
    fontFamily: 'Lexend',
    color: '#87736a',
    marginBottom: 16,
    lineHeight: 18,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  weightInput: {
    width: 100,
    height: 54,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    fontSize: 24,
    fontFamily: 'Lexend-Bold',
    color: '#221a16',
    textAlign: 'center',
  },
  unitText: {
    fontSize: 18,
    fontFamily: 'Lexend-Medium',
    color: '#87736a',
  },
  logStatusText: {
    fontSize: 12,
    color: '#00696f',
    textAlign: 'center',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  submitBtn: {
    width: '100%',
    height: 48,
    borderRadius: 16,
    backgroundColor: '#954921',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnDisabled: {
    backgroundColor: 'rgba(149, 73, 33, 0.4)',
  },
  submitBtnText: {
    fontSize: 14,
    fontFamily: 'Lexend-SemiBold',
    color: '#ffffff',
  },
  historyList: {
    gap: 12,
  },
  historyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  historyWeight: {
    fontSize: 16,
    fontFamily: 'Lexend-Bold',
    color: '#221a16',
  },
  historyDate: {
    fontSize: 12,
    fontFamily: 'Lexend',
    color: '#87736a',
    marginTop: 2,
  },
  historyTrend: {
    fontSize: 12,
    fontFamily: 'Lexend-Medium',
    color: '#87736a',
  },
});
