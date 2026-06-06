import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSuvi } from '../../context/SuviStateContext';
import { GlassCard } from '../ui/GlassCard';


export const TrackersHubTab: React.FC = () => {
  const router = useRouter();
  const { state, logWater, addBPRecord, updateCycleDay, getMenstrualPhase } = useSuvi();
  
  // Sub-navigation: 'hub' | 'cycle' | 'bp' | 'water'
  const [subView, setSubView] = useState<'hub' | 'cycle' | 'bp' | 'water'>('hub');
  
  // BP input states
  const [sysIn, setSysIn] = useState('');
  const [diaIn, setDiaIn] = useState('');
  const [bpAlert, setBpAlert] = useState('');

  const handleLogBP = () => {
    const s = parseInt(sysIn);
    const d = parseInt(diaIn);
    if (isNaN(s) || isNaN(d)) return;

    addBPRecord(s, d);
    
    // BP evaluation
    if (s > 130 || d > 85) {
      setBpAlert('⚠️ Your reading is slightly elevated. Avoid caffeine, rest for a bit, and log again. If it remains high, reach out to your doctor.');
    } else if (s < 95 || d < 60) {
      setBpAlert('⚠️ Your reading is a bit low. Rest, hydrate with water, and log again shortly.');
    } else {
      setBpAlert('🟢 Your blood pressure reading is in the ideal healthy range.');
    }

    setSysIn('');
    setDiaIn('');
  };

  const cycleInfo = getMenstrualPhase();
  const latestBP = state.bpLogs[0] || { systolic: 120, diastolic: 80 };
  const latestGlucose = state.glucoseLogs[0] || { value: 105, mealTag: 'fasting' };
  const latestSymptom = state.symptoms[0];

  // --- RENDERING SUB-VIEWS ---

  // Main Hub List
  if (subView === 'hub') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.hubHeaderRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Health Trackers</Text>
            <Text style={styles.subtitle}>Log parameters manually or check values synced from your wearable.</Text>
          </View>
          <TouchableOpacity 
            style={styles.manageBtn}
            onPress={() => router.push('/(screens)/manage-trackers')}
          >
            <Text style={styles.manageBtnText}>⚙️ Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Health Dashboard Callout */}
        <GlassCard style={styles.dashboardCard}>
          <View style={styles.dashboardHeader}>
            <Text style={styles.dashboardTitle}>📊 Health Metrics Dashboard</Text>
            <TouchableOpacity 
              style={styles.dashboardBtn}
              onPress={() => router.push('/(screens)/health-metrics-dashboard')}
            >
              <Text style={styles.dashboardBtnText}>View Analytics ➔</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.dashboardDesc}>
            Analyze resting heart rate, steps consistency, sleep duration, and clinical blood work.
          </Text>
        </GlassCard>

        <View style={styles.grid}>
          {/* Water Logger Tile */}
          {state.activeTrackers.includes('water') && (
            <TouchableOpacity activeOpacity={0.8} style={styles.gridCard} onPress={() => setSubView('water')}>
              <Text style={styles.gridIcon}>💧</Text>
              <View style={styles.gridInfo}>
                <Text style={styles.gridTitle}>Water Tracker</Text>
                <Text style={styles.gridDesc}>{state.waterGlasses} of {state.waterGoal} glasses logged</Text>
              </View>
              <Text style={styles.gridArrow}>➔</Text>
            </TouchableOpacity>
          )}

          {/* Menstrual Cycle Tile (Only shows for female profiles if active) */}
          {state.profile.gender === 'female' && state.activeTrackers.includes('cycle') && (
            <TouchableOpacity activeOpacity={0.8} style={styles.gridCard} onPress={() => setSubView('cycle')}>
              <Text style={styles.gridIcon}>🌸</Text>
              <View style={styles.gridInfo}>
                <Text style={styles.gridTitle}>Menstrual Cycle</Text>
                <Text style={styles.gridDesc}>Day {state.menstrualCycleDay} • {cycleInfo.phaseLabel.split(' ')[0]}</Text>
              </View>
              <Text style={styles.gridArrow}>➔</Text>
            </TouchableOpacity>
          )}

          {/* Blood Pressure Tile */}
          {state.activeTrackers.includes('bp') && (
            <TouchableOpacity activeOpacity={0.8} style={styles.gridCard} onPress={() => setSubView('bp')}>
              <Text style={styles.gridIcon}>❤️</Text>
              <View style={styles.gridInfo}>
                <Text style={styles.gridTitle}>Blood Pressure</Text>
                <Text style={styles.gridDesc}>Latest: {latestBP.systolic}/{latestBP.diastolic} mmHg</Text>
              </View>
              <Text style={styles.gridArrow}>➔</Text>
            </TouchableOpacity>
          )}

          {/* Blood Glucose Tile */}
          {state.activeTrackers.includes('glucose') && (
            <TouchableOpacity 
              activeOpacity={0.8} 
              style={styles.gridCard} 
              onPress={() => router.push('/(screens)/blood-glucose')}
            >
              <Text style={styles.gridIcon}>🩸</Text>
              <View style={styles.gridInfo}>
                <Text style={styles.gridTitle}>Blood Glucose</Text>
                <Text style={styles.gridDesc}>Latest: {latestGlucose.value} mg/dL ({latestGlucose.mealTag})</Text>
              </View>
              <Text style={styles.gridArrow}>➔</Text>
            </TouchableOpacity>
          )}

          {/* Symptom Tracker Tile */}
          <TouchableOpacity 
            activeOpacity={0.8} 
            style={styles.gridCard} 
            onPress={() => router.push('/(screens)/symptom-history')}
          >
            <Text style={styles.gridIcon}>⚠️</Text>
            <View style={styles.gridInfo}>
              <Text style={styles.gridTitle}>Symptom Tracker</Text>
              <Text style={styles.gridDesc}>
                {latestSymptom 
                  ? `Last: ${latestSymptom.symptoms.join(', ')} (Sev: ${latestSymptom.severity}/10)` 
                  : 'Log headache, fatigue, or recovery indicators'}
              </Text>
            </View>
            <Text style={styles.gridArrow}>➔</Text>
          </TouchableOpacity>
        </View>

        {/* Sync Device Banner */}
        <GlassCard style={styles.deviceCard}>
          <Text style={styles.deviceTitle}>Device Connectivity</Text>
          <Text style={styles.deviceDesc}>
            {state.watchSynced 
              ? 'Your Apple Watch is active. Sleep, heart rate, and step values sync automatically.'
              : 'Sync your smartwatch to import sleep, blood pressure, and step tracking metrics automatically.'
            }
          </Text>
        </GlassCard>
      </ScrollView>
    );
  }


  // Water sub-view
  if (subView === 'water') {
    const percent = Math.min(100, Math.round((state.waterGlasses / state.waterGoal) * 100));
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.subHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setSubView('hub')}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.subHeaderTitle}>Water Tracker</Text>
        </View>

        <GlassCard style={styles.detailCard}>
          <Text style={styles.bigIcon}>💧</Text>
          <Text style={styles.detailTitle}>{state.waterGlasses} Glasses</Text>
          <Text style={styles.detailDesc}>Daily goal: {state.waterGoal} glasses (2 Liters)</Text>

          {/* Custom Progress Bar */}
          <View style={styles.progressBarWrapper}>
            <View style={[styles.progressBar, { width: `${percent}%` }]} />
          </View>
          <Text style={styles.percentText}>{percent}% Completed</Text>

          <View style={styles.waterControls}>
            <TouchableOpacity style={[styles.controlBtn, styles.minusBtn]} onPress={() => logWater(-1)}>
              <Text style={styles.controlBtnText}>- Remove</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.controlBtn, styles.plusBtn]} onPress={() => logWater(1)}>
              <Text style={styles.controlBtnText}>+ Add Glass</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>
      </ScrollView>
    );
  }

  // Menstrual cycle sub-view
  if (subView === 'cycle') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.subHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setSubView('hub')}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.subHeaderTitle}>Menstrual Cycle</Text>
        </View>

        {/* Phase details */}
        <GlassCard style={styles.detailCard}>
          <Text style={styles.bigIcon}>🌸</Text>
          <Text style={styles.detailTitle}>Cycle Day {state.menstrualCycleDay}</Text>
          <Text style={styles.detailPhase}>{cycleInfo.phaseLabel}</Text>

          <View style={styles.divider} />

          {/* Science tips based on active state day */}
          <View style={styles.adviceGroup}>
            <Text style={styles.adviceLabel}>🍲 Nutrition Guide</Text>
            <Text style={styles.adviceText}>{cycleInfo.nutritionTip}</Text>
          </View>

          <View style={[styles.adviceGroup, styles.topMargin]}>
            <Text style={styles.adviceLabel}>🏋️ Training Guide</Text>
            <Text style={styles.adviceText}>{cycleInfo.exerciseTip}</Text>
          </View>
        </GlassCard>

        {/* Calendar Sim adjustment */}
        <GlassCard style={[styles.detailCard, styles.topMargin]}>
          <Text style={styles.cardHeader}>Cycle Day Adjustment (Simulated)</Text>
          <Text style={styles.cardDesc}>Increment cycle day manually to see how Suvi's morning brief and recommendations adjust dynamically!</Text>
          
          <View style={styles.cycleControls}>
            <TouchableOpacity style={styles.cycleBtn} onPress={() => updateCycleDay(state.menstrualCycleDay - 1)}>
              <Text style={styles.cycleBtnText}>- Day</Text>
            </TouchableOpacity>
            <View style={styles.cycleDayBox}>
              <Text style={styles.cycleDayVal}>{state.menstrualCycleDay}</Text>
            </View>
            <TouchableOpacity style={styles.cycleBtn} onPress={() => updateCycleDay(state.menstrualCycleDay + 1)}>
              <Text style={styles.cycleBtnText}>+ Day</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>
      </ScrollView>
    );
  }

  // Blood Pressure sub-view
  if (subView === 'bp') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.subHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setSubView('hub')}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.subHeaderTitle}>Blood Pressure</Text>
        </View>

        {/* Add BP Log Card */}
        <GlassCard style={styles.detailCard}>
          <Text style={styles.detailTitle}>Log Manual Reading</Text>
          <Text style={styles.cardDesc}>Enter your blood pressure reading in mmHg (Systolic / Diastolic).</Text>

          <View style={styles.bpForm}>
            <View style={styles.bpInputGroup}>
              <Text style={styles.bpInputLabel}>Systolic (High)</Text>
              <TextInput
                style={styles.bpInput}
                value={sysIn}
                onChangeText={setSysIn}
                keyboardType="numeric"
                placeholder="120"
                placeholderTextColor="#87736a"
                maxLength={3}
              />
            </View>

            <View style={styles.bpInputGroup}>
              <Text style={styles.bpInputLabel}>Diastolic (Low)</Text>
              <TextInput
                style={styles.bpInput}
                value={diaIn}
                onChangeText={setDiaIn}
                keyboardType="numeric"
                placeholder="80"
                placeholderTextColor="#87736a"
                maxLength={3}
              />
            </View>
          </View>

          {bpAlert !== '' && <Text style={styles.bpAlert}>{bpAlert}</Text>}

          <TouchableOpacity style={styles.bpLogBtn} onPress={handleLogBP}>
            <Text style={styles.bpLogBtnText}>Log BP Reading</Text>
          </TouchableOpacity>
        </GlassCard>

        {/* History List */}
        <Text style={styles.sectionTitle}>BP Log History</Text>
        <View style={styles.bpHistoryList}>
          {state.bpLogs.map((log) => (
            <GlassCard key={log.id} style={styles.historyCard}>
              <View style={styles.historyTextContainer}>
                <Text style={styles.historyVal}>{log.systolic} / {log.diastolic} mmHg</Text>
                <Text style={styles.historyDate}>{log.timestamp}</Text>
              </View>
              <View style={[
                styles.statusIndicator, 
                log.systolic > 130 ? styles.statusHigh : styles.statusNormal
              ]}>
                <Text style={styles.statusIndText}>
                  {log.systolic > 130 ? 'High' : 'Normal'}
                </Text>
              </View>
            </GlassCard>
          ))}
        </View>
      </ScrollView>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 110,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#954921',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#87736a',
    lineHeight: 20,
    marginBottom: 24,
  },
  grid: {
    gap: 16,
    marginBottom: 28,
  },
  gridCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.42)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.55)',
  },
  gridIcon: {
    fontSize: 28,
    marginRight: 16,
  },
  gridInfo: {
    flex: 1,
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#221a16',
    marginBottom: 4,
  },
  gridDesc: {
    fontSize: 13,
    color: '#87736a',
  },
  gridArrow: {
    fontSize: 16,
    color: '#954921',
    fontWeight: 'bold',
  },
  deviceCard: {
    padding: 16,
  },
  deviceTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#221a16',
    marginBottom: 8,
  },
  deviceDesc: {
    fontSize: 13,
    color: '#54433b',
    lineHeight: 18,
  },
  // Sub Header Styles
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    marginRight: 16,
  },
  backBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#954921',
  },
  subHeaderTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#954921',
  },
  // Details sub-views
  detailCard: {
    padding: 24,
    alignItems: 'center',
  },
  bigIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#221a16',
    marginBottom: 4,
  },
  detailDesc: {
    fontSize: 13,
    color: '#87736a',
    marginBottom: 20,
  },
  progressBarWrapper: {
    width: '100%',
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    overflow: 'hidden',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  progressBar: {
    height: '100%',
    borderRadius: 6,
    backgroundColor: '#00dbe7',
  },
  percentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00696f',
    marginBottom: 24,
  },
  waterControls: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  controlBtn: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  minusBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(149, 73, 33, 0.25)',
  },
  plusBtn: {
    backgroundColor: '#954921',
  },
  controlBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  // Menstrual detail styles
  detailPhase: {
    fontSize: 16,
    color: '#954921',
    fontWeight: '600',
    marginBottom: 8,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(149, 73, 33, 0.15)',
    marginVertical: 16,
  },
  adviceGroup: {
    width: '100%',
    gap: 6,
  },
  adviceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#221a16',
  },
  adviceText: {
    fontSize: 13,
    color: '#54433b',
    lineHeight: 18,
  },
  cardHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#221a16',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  cardDesc: {
    fontSize: 13,
    color: '#87736a',
    lineHeight: 18,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  cycleControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  cycleBtn: {
    width: 64,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(149, 73, 33, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cycleBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#954921',
  },
  cycleDayBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#954921',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cycleDayVal: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  // BP form
  bpForm: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
    marginBottom: 16,
  },
  bpInputGroup: {
    flex: 1,
    gap: 6,
  },
  bpInputLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#87736a',
    textTransform: 'uppercase',
  },
  bpInput: {
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#221a16',
    textAlign: 'center',
  },
  bpAlert: {
    fontSize: 12,
    color: '#954921',
    lineHeight: 18,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  bpLogBtn: {
    width: '100%',
    height: 48,
    borderRadius: 16,
    backgroundColor: '#954921',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bpLogBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#221a16',
    marginVertical: 16,
    paddingLeft: 4,
  },
  bpHistoryList: {
    gap: 12,
  },
  historyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  historyTextContainer: {
    gap: 4,
  },
  historyVal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#221a16',
  },
  historyDate: {
    fontSize: 12,
    color: '#87736a',
  },
  statusIndicator: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusNormal: {
    backgroundColor: 'rgba(0, 219, 231, 0.15)',
  },
  statusHigh: {
    backgroundColor: 'rgba(186, 26, 26, 0.15)',
  },
  statusIndText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#954921',
  },
  topMargin: {
    marginTop: 24,
  },
  hubHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  manageBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  manageBtnText: {
    fontSize: 12,
    fontFamily: 'Lexend-SemiBold',
    color: '#954921',
  },
  dashboardCard: {
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dashboardTitle: {
    fontSize: 14,
    fontFamily: 'Lexend-SemiBold',
    color: '#221a16',
  },
  dashboardBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#954921',
  },
  dashboardBtnText: {
    fontSize: 10,
    fontFamily: 'Lexend-SemiBold',
    color: '#ffffff',
  },
  dashboardDesc: {
    fontSize: 12,
    fontFamily: 'Lexend',
    color: '#87736a',
    lineHeight: 16,
  },
});
