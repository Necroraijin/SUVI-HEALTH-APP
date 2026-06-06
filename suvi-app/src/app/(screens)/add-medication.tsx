import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useSuvi } from '@/context/SuviStateContext';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';

export default function AddMedicationScreen() {
  const router = useRouter();
  const { addMedication } = useSuvi();

  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [purpose, setPurpose] = useState('');
  const [timings, setTimings] = useState<string[]>(['09:00 AM']);
  const [newTime, setNewTime] = useState('');

  const handleAddTime = () => {
    if (newTime.trim() === '') return;
    setTimings([...timings, newTime.trim()]);
    setNewTime('');
  };

  const handleRemoveTime = (index: number) => {
    setTimings(timings.filter((_, idx) => idx !== index));
  };

  const handleSave = () => {
    if (name.trim() === '' || dosage.trim() === '' || timings.length === 0) return;

    addMedication({
      name,
      dosage,
      purpose: purpose.trim() || 'General health regulation',
      timing: timings,
      takenToday: timings.map(() => false),
      totalDoses: timings.length,
      sideEffects: ['Stomach upset (common)', 'Mild drowsiness'],
      interactions: ['Avoid alcohol', 'Take with food if nausea occurs'],
      refillDate: new Date(Date.now() + 30 * 86400000).toISOString(),
    });

    router.replace('/(screens)/medication-today');
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <ScreenHeader title="Add Medication" onBack={() => router.back()} />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Scan prescriptions Callout */}
          <GlassCard style={styles.scanCard}>
            <View style={styles.scanHeader}>
              <Text style={styles.scanIcon}>📄</Text>
              <View style={styles.scanInfo}>
                <Text style={styles.scanTitle}>Have a written prescription?</Text>
                <Text style={styles.scanDesc}>Use Suvi OCR to auto-extract name, dosage, and schedule timings instantly.</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.scanBtn}
              onPress={() => router.push('/(screens)/document-scanner')}
              activeOpacity={0.8}
            >
              <Text style={styles.scanBtnText}>📸 Scan Prescription</Text>
            </TouchableOpacity>
          </GlassCard>

          {/* Form Fields */}
          <Text style={styles.sectionHeader}>Medication Details</Text>
          
          <GlassCard style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>MEDICATION NAME</Text>
              <TextInput
                style={styles.textInput}
                placeholder="E.g., Metformin, Lisinopril..."
                placeholderTextColor="#87736a"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>DOSAGE STRENGTH</Text>
              <TextInput
                style={styles.textInput}
                placeholder="E.g., 500mg, 1 tablet, 5ml..."
                placeholderTextColor="#87736a"
                value={dosage}
                onChangeText={setDosage}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>PURPOSE / TARGET CONDITION</Text>
              <TextInput
                style={styles.textInput}
                placeholder="E.g., Blood sugar control, high BP..."
                placeholderTextColor="#87736a"
                value={purpose}
                onChangeText={setPurpose}
              />
            </View>
          </GlassCard>

          {/* Schedule Timings list */}
          <Text style={styles.sectionHeader}>Reminders & Timings</Text>
          <GlassCard style={styles.formCard}>
            <View style={styles.timingsList}>
              {timings.map((time, idx) => (
                <View key={idx} style={styles.timeTag}>
                  <Text style={styles.timeText}>⏰ {time}</Text>
                  <TouchableOpacity onPress={() => handleRemoveTime(idx)}>
                    <Text style={styles.removeText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Timing input */}
            <View style={styles.addTimeRow}>
              <TextInput
                style={[styles.textInput, { flex: 1 }]}
                placeholder="E.g., 09:00 AM, 08:30 PM..."
                placeholderTextColor="#87736a"
                value={newTime}
                onChangeText={setNewTime}
              />
              <TouchableOpacity 
                style={styles.addTimeBtn}
                onPress={handleAddTime}
              >
                <Text style={styles.addTimeBtnText}>+ Add</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>

          {/* Save Action */}
          <TouchableOpacity
            style={[styles.saveBtn, (name.trim() === '' || dosage.trim() === '') && styles.saveBtnDisabled]}
            disabled={name.trim() === '' || dosage.trim() === ''}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text style={styles.saveBtnText}>Save Medication Schedule</Text>
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
  scanCard: {
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 157, 110, 0.25)',
  },
  scanHeader: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 14,
  },
  scanIcon: {
    fontSize: 28,
  },
  scanInfo: {
    flex: 1,
    gap: 2,
  },
  scanTitle: {
    fontSize: 14,
    fontFamily: 'Lexend-SemiBold',
    color: '#221a16',
  },
  scanDesc: {
    fontSize: 12,
    fontFamily: 'Lexend',
    color: '#87736a',
    lineHeight: 16,
  },
  scanBtn: {
    width: '100%',
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(149, 73, 33, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(149, 73, 33, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanBtnText: {
    fontSize: 13,
    fontFamily: 'Lexend-SemiBold',
    color: '#954921',
  },
  sectionHeader: {
    fontSize: 12,
    fontFamily: 'Lexend-SemiBold',
    color: '#954921',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    paddingLeft: 4,
  },
  formCard: {
    padding: 18,
    gap: 14,
    marginBottom: 24,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 10,
    fontFamily: 'Lexend-SemiBold',
    color: '#87736a',
    letterSpacing: 0.5,
  },
  textInput: {
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: 'Lexend',
    color: '#221a16',
  },
  timingsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(149, 73, 33, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'Lexend-Medium',
    color: '#221a16',
  },
  removeText: {
    fontSize: 12,
    color: '#ba1a1a',
    fontWeight: 'bold',
    paddingHorizontal: 4,
  },
  addTimeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  addTimeBtn: {
    width: 72,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#954921',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addTimeBtnText: {
    fontSize: 13,
    fontFamily: 'Lexend-SemiBold',
    color: '#ffffff',
  },
  saveBtn: {
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
  saveBtnDisabled: {
    backgroundColor: 'rgba(149, 73, 33, 0.4)',
    shadowOpacity: 0,
    elevation: 0,
  },
  saveBtnText: {
    fontSize: 16,
    fontFamily: 'Lexend-SemiBold',
    color: '#ffffff',
  },
});
