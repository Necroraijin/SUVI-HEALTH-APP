import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useSuvi, GlucoseLog } from '@/context/SuviStateContext';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';

export default function BloodGlucoseScreen() {
  const router = useRouter();
  const { state, addGlucoseRecord } = useSuvi();
  
  const [value, setValue] = useState('');
  const [mealTag, setMealTag] = useState<GlucoseLog['mealTag']>('fasting');
  const [logAlert, setLogAlert] = useState('');

  const handleLog = () => {
    const val = parseInt(value);
    if (isNaN(val) || val <= 0) return;

    addGlucoseRecord(val, mealTag);
    setValue('');

    // Dynamic warning feedback based on medical guidelines
    if (mealTag === 'fasting') {
      if (val >= 126) {
        setLogAlert('⚠️ Fasting glucose is high (≥126 mg/dL). Discuss with Dr. Sharma.');
      } else if (val >= 100) {
        setLogAlert('🟡 Fasting glucose is slightly elevated (100-125 mg/dL).');
      } else {
        setLogAlert('🟢 Your fasting glucose is in the ideal normal range (<100 mg/dL).');
      }
    } else if (mealTag === 'post-meal') {
      if (val >= 200) {
        setLogAlert('⚠️ Post-meal glucose is high (≥200 mg/dL). Consider walk & check dosage.');
      } else if (val >= 140) {
        setLogAlert('🟡 Post-meal glucose is elevated (140-199 mg/dL).');
      } else {
        setLogAlert('🟢 Your post-meal glucose is in the normal range (<140 mg/dL).');
      }
    } else {
      if (val >= 160) {
        setLogAlert('⚠️ Random glucose is elevated. Keep monitoring.');
      } else {
        setLogAlert('🟢 Random glucose reading is normal.');
      }
    }
  };

  const getStatusColor = (val: number, tag: GlucoseLog['mealTag']) => {
    if (tag === 'fasting') {
      if (val >= 126) return '#ba1a1a'; // High
      if (val >= 100) return '#954921'; // Elevated
      return '#00696f'; // Normal
    } else {
      if (val >= 200) return '#ba1a1a';
      if (val >= 140) return '#954921';
      return '#00696f';
    }
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <ScreenHeader title="Blood Glucose" onBack={() => router.push('/(tabs)/trackers')} />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Target Reference Ranges Card */}
          <GlassCard style={styles.rangeCard}>
            <Text style={styles.rangeTitle}>Standard Target Ranges</Text>
            <View style={styles.rangeRow}>
              <View style={styles.rangeCol}>
                <Text style={styles.rangeLabel}>⚡ Fasting</Text>
                <Text style={styles.rangeVal}>Normal: &lt;100 mg/dL</Text>
                <Text style={styles.rangeSub}>Elevated: 100-125</Text>
              </View>
              <View style={styles.rangeDivider} />
              <View style={styles.rangeCol}>
                <Text style={styles.rangeLabel}>🥗 Post-Meal</Text>
                <Text style={styles.rangeVal}>Normal: &lt;140 mg/dL</Text>
                <Text style={styles.rangeSub}>Elevated: 140-199</Text>
              </View>
            </View>
          </GlassCard>

          {/* Log Entry Card */}
          <GlassCard style={styles.logCard}>
            <Text style={styles.logCardTitle}>Log New Reading</Text>
            <Text style={styles.logCardDesc}>Enter your capillary blood sugar value in mg/dL.</Text>

            <View style={styles.inputRow}>
              <TextInput
                style={styles.glucoseInput}
                value={value}
                onChangeText={setValue}
                keyboardType="numeric"
                placeholder="100"
                placeholderTextColor="#87736a"
                maxLength={3}
              />
              <Text style={styles.unitText}>mg/dL</Text>
            </View>

            {/* Meal Tag Selector */}
            <Text style={styles.tagLabel}>Meal association</Text>
            <View style={styles.tagsRow}>
              {([
                { key: 'fasting', label: '⚡ Fasting', icon: '⚡' },
                { key: 'post-meal', label: '🥗 Post-Meal', icon: '🥗' },
                { key: 'random', label: '🕒 Random', icon: '🕒' }
              ] as const).map((tag) => {
                const isActive = mealTag === tag.key;
                return (
                  <TouchableOpacity
                    key={tag.key}
                    style={[styles.tagBtn, isActive && styles.tagBtnActive]}
                    onPress={() => setMealTag(tag.key)}
                  >
                    <Text style={[styles.tagBtnText, isActive && styles.tagBtnTextActive]}>
                      {tag.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {logAlert !== '' && <Text style={styles.logAlert}>{logAlert}</Text>}

            <TouchableOpacity 
              style={[styles.logSubmitBtn, value.trim() === '' && styles.logSubmitBtnDisabled]}
              disabled={value.trim() === ''}
              onPress={handleLog}
              activeOpacity={0.8}
            >
              <Text style={styles.logSubmitText}>Record Reading</Text>
            </TouchableOpacity>
          </GlassCard>

          {/* Reading Log History */}
          <Text style={styles.sectionTitle}>Glucose History</Text>
          <View style={styles.historyList}>
            {state.glucoseLogs.map((log) => {
              const statusColor = getStatusColor(log.value, log.mealTag);
              const tagLabels = { fasting: 'Fasting', 'post-meal': 'Post-Meal', random: 'Random' };
              return (
                <GlassCard key={log.id} style={styles.historyCard}>
                  <View style={styles.historyMain}>
                    <Text style={[styles.historyVal, { color: statusColor }]}>
                      {log.value} <Text style={styles.historyUnit}>mg/dL</Text>
                    </Text>
                    <Text style={styles.historyDate}>{log.timestamp}</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: statusColor + '15', borderColor: statusColor + '30' }]}>
                    <Text style={[styles.badgeText, { color: statusColor }]}>
                      {tagLabels[log.mealTag] || 'Logged'}
                    </Text>
                  </View>
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
  rangeCard: {
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  rangeTitle: {
    fontSize: 14,
    fontFamily: 'Lexend-SemiBold',
    color: '#954921',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    textAlign: 'center',
  },
  rangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rangeCol: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  rangeLabel: {
    fontSize: 13,
    fontFamily: 'Lexend-SemiBold',
    color: '#221a16',
    marginBottom: 4,
  },
  rangeVal: {
    fontSize: 12,
    fontFamily: 'Lexend-Medium',
    color: '#00696f',
  },
  rangeSub: {
    fontSize: 11,
    fontFamily: 'Lexend',
    color: '#87736a',
  },
  rangeDivider: {
    width: 1,
    backgroundColor: 'rgba(149, 73, 33, 0.15)',
    marginHorizontal: 16,
  },
  logCard: {
    padding: 20,
    marginBottom: 28,
  },
  logCardTitle: {
    fontSize: 16,
    fontFamily: 'Lexend-SemiBold',
    color: '#221a16',
    marginBottom: 4,
  },
  logCardDesc: {
    fontSize: 13,
    fontFamily: 'Lexend',
    color: '#87736a',
    lineHeight: 18,
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  glucoseInput: {
    width: 120,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    fontSize: 32,
    fontFamily: 'Lexend-Bold',
    color: '#221a16',
    textAlign: 'center',
  },
  unitText: {
    fontSize: 18,
    fontFamily: 'Lexend-Medium',
    color: '#87736a',
  },
  tagLabel: {
    fontSize: 11,
    fontFamily: 'Lexend-SemiBold',
    color: '#87736a',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tagBtn: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagBtnActive: {
    backgroundColor: '#954921',
    borderColor: '#954921',
  },
  tagBtnText: {
    fontSize: 11,
    fontFamily: 'Lexend-Medium',
    color: '#87736a',
  },
  tagBtnTextActive: {
    color: '#ffffff',
    fontFamily: 'Lexend-SemiBold',
  },
  logAlert: {
    fontSize: 12,
    color: '#954921',
    lineHeight: 18,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  logSubmitBtn: {
    width: '100%',
    height: 48,
    borderRadius: 16,
    backgroundColor: '#954921',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logSubmitBtnDisabled: {
    backgroundColor: 'rgba(149, 73, 33, 0.4)',
  },
  logSubmitText: {
    fontSize: 14,
    fontFamily: 'Lexend-SemiBold',
    color: '#ffffff',
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Lexend-SemiBold',
    color: '#954921',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
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
  historyMain: {
    gap: 4,
  },
  historyVal: {
    fontSize: 18,
    fontFamily: 'Lexend-Bold',
  },
  historyUnit: {
    fontSize: 12,
    fontFamily: 'Lexend-Medium',
    color: '#87736a',
  },
  historyDate: {
    fontSize: 12,
    fontFamily: 'Lexend',
    color: '#87736a',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: 'Lexend-SemiBold',
  },
});
