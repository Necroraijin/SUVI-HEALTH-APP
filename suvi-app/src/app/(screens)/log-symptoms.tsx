import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useSuvi } from '@/context/SuviStateContext';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';

const AVAILABLE_SYMPTOMS = [
  'Headache', 'Fatigue', 'Dizziness', 'Nausea', 
  'Stomach Pain', 'Muscle Aches', 'Shortness of Breath', 
  'Cough', 'Fever', 'Sore Throat', 'Anxiety', 'Insomnia'
];

export default function LogSymptomsScreen() {
  const router = useRouter();
  const { logSymptom } = useSuvi();
  
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState<number>(3);
  const [duration, setDuration] = useState<'started-today' | 'ongoing'>('started-today');
  const [energy, setEnergy] = useState<'low' | 'medium' | 'high'>('medium');
  const [notes, setNotes] = useState('');

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const getSeverityLabel = (val: number) => {
    if (val <= 3) return 'Mild (Barely noticeable)';
    if (val <= 6) return 'Moderate (Disrupting some activities)';
    if (val <= 8) return 'Severe (Highly limitative)';
    return 'Very Severe / Critical';
  };

  const handleSave = () => {
    if (selectedSymptoms.length === 0) return;

    logSymptom({
      symptoms: selectedSymptoms,
      severity,
      duration,
      energy,
      notes,
    });

    // Navigate to AI Assessment response screen
    router.replace('/(screens)/ai-assessment');
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <ScreenHeader title="Log Symptoms" onBack={() => router.push('/(tabs)/trackers')} />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Question Title */}
          <Text style={styles.questionTitle}>What symptoms are you feeling?</Text>
          <Text style={styles.questionSubtitle}>Select all that apply. Suvi will analyze and provide a recovery assessment.</Text>

          {/* Symptom Tag Chips Grid */}
          <View style={styles.chipsGrid}>
            {AVAILABLE_SYMPTOMS.map((symptom) => {
              const isSelected = selectedSymptoms.includes(symptom);
              return (
                <TouchableOpacity
                  key={symptom}
                  style={[styles.symptomChip, isSelected && styles.symptomChipActive]}
                  onPress={() => toggleSymptom(symptom)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.symptomChipText, isSelected && styles.symptomChipTextActive]}>
                    {symptom} {isSelected ? '✓' : '+'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Severity Slider (Custom Selector) */}
          <Text style={styles.sectionLabel}>Severity Rating</Text>
          <GlassCard style={styles.card}>
            <Text style={styles.severityVal}>{severity} / 10</Text>
            <Text style={styles.severityLabel}>{getSeverityLabel(severity)}</Text>
            
            {/* Custom slider controls */}
            <View style={styles.sliderControls}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                <TouchableOpacity
                  key={val}
                  style={[
                    styles.sliderNode,
                    severity === val && styles.sliderNodeActive,
                    val <= severity && !styles.sliderNodeActive && styles.sliderNodeSelected
                  ]}
                  onPress={() => setSeverity(val)}
                >
                  <Text style={[styles.sliderNodeText, severity === val && styles.sliderNodeTextActive]}>
                    {val}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </GlassCard>

          {/* Duration Toggle */}
          <Text style={styles.sectionLabel}>Onset & Duration</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleBtn, duration === 'started-today' && styles.toggleBtnActive]}
              onPress={() => setDuration('started-today')}
            >
              <Text style={[styles.toggleBtnText, duration === 'started-today' && styles.toggleBtnTextActive]}>
                Started Today
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toggleBtn, duration === 'ongoing' && styles.toggleBtnActive]}
              onPress={() => setDuration('ongoing')}
            >
              <Text style={[styles.toggleBtnText, duration === 'ongoing' && styles.toggleBtnTextActive]}>
                Ongoing / Recurring
              </Text>
            </TouchableOpacity>
          </View>

          {/* Energy Level Selector */}
          <Text style={styles.sectionLabel}>Overall Energy Level</Text>
          <View style={styles.energyRow}>
            {(['low', 'medium', 'high'] as const).map((lvl) => {
              const isActive = energy === lvl;
              const icons = { low: '😫 Low', medium: '😐 Moderate', high: '🔋 Normal' };
              return (
                <TouchableOpacity
                  key={lvl}
                  style={[styles.energyBtn, isActive && styles.energyBtnActive]}
                  onPress={() => setEnergy(lvl)}
                >
                  <Text style={[styles.energyText, isActive && styles.energyTextActive]}>
                    {icons[lvl]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Additional Notes */}
          <Text style={styles.sectionLabel}>Notes & Context</Text>
          <GlassCard style={styles.notesCard}>
            <TextInput
              style={styles.notesInput}
              multiline
              numberOfLines={4}
              placeholder="E.g., headache started after skipping lunch, feels like a dull throb behind the eyes..."
              placeholderTextColor="#87736a"
              value={notes}
              onChangeText={setNotes}
            />
          </GlassCard>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitBtn, selectedSymptoms.length === 0 && styles.submitBtnDisabled]}
            disabled={selectedSymptoms.length === 0}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text style={styles.submitBtnText}>Analyze with Suvi AI →</Text>
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
    paddingBottom: 48,
  },
  questionTitle: {
    fontSize: 22,
    fontFamily: 'Lexend-SemiBold',
    color: '#221a16',
    marginBottom: 6,
  },
  questionSubtitle: {
    fontSize: 14,
    fontFamily: 'Lexend',
    color: '#87736a',
    lineHeight: 20,
    marginBottom: 20,
  },
  chipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  symptomChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.65)',
  },
  symptomChipActive: {
    backgroundColor: '#954921',
    borderColor: '#954921',
  },
  symptomChipText: {
    fontSize: 13,
    fontFamily: 'Lexend-Medium',
    color: '#221a16',
  },
  symptomChipTextActive: {
    color: '#ffffff',
  },
  sectionLabel: {
    fontSize: 13,
    fontFamily: 'Lexend-SemiBold',
    color: '#954921',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 8,
  },
  card: {
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  severityVal: {
    fontSize: 28,
    fontFamily: 'Lexend-Bold',
    color: '#954921',
    marginBottom: 2,
  },
  severityLabel: {
    fontSize: 13,
    fontFamily: 'Lexend-Medium',
    color: '#87736a',
    marginBottom: 16,
  },
  sliderControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 4,
  },
  sliderNode: {
    flex: 1,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderNodeSelected: {
    backgroundColor: 'rgba(255, 157, 110, 0.15)',
    borderColor: 'rgba(149, 73, 33, 0.2)',
  },
  sliderNodeActive: {
    backgroundColor: '#954921',
    borderColor: '#954921',
  },
  sliderNodeText: {
    fontSize: 12,
    fontFamily: 'Lexend-Medium',
    color: '#87736a',
  },
  sliderNodeTextActive: {
    color: '#ffffff',
    fontFamily: 'Lexend-Bold',
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  toggleBtn: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderColor: '#954921',
  },
  toggleBtnText: {
    fontSize: 14,
    fontFamily: 'Lexend-Medium',
    color: '#87736a',
  },
  toggleBtnTextActive: {
    color: '#954921',
    fontFamily: 'Lexend-SemiBold',
  },
  energyRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  energyBtn: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  energyBtnActive: {
    backgroundColor: '#954921',
    borderColor: '#954921',
  },
  energyText: {
    fontSize: 13,
    fontFamily: 'Lexend-Medium',
    color: '#87736a',
  },
  energyTextActive: {
    color: '#ffffff',
    fontFamily: 'Lexend-SemiBold',
  },
  notesCard: {
    padding: 14,
    marginBottom: 32,
  },
  notesInput: {
    fontSize: 14,
    fontFamily: 'Lexend',
    color: '#221a16',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  submitBtn: {
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
  },
  submitBtnDisabled: {
    backgroundColor: 'rgba(149, 73, 33, 0.4)',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitBtnText: {
    fontSize: 16,
    fontFamily: 'Lexend-SemiBold',
    color: '#ffffff',
  },
});
