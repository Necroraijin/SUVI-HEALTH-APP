import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSuvi } from '@/context/SuviStateContext';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';

export default function PreAppointmentReportScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, generatePreAppointmentReport } = useSuvi();

  const appointment = state.appointments.find(a => a.id === id);
  const reportText = generatePreAppointmentReport(id || '');

  const [questions, setQuestions] = useState<string[]>([
    'Is it safe to adjust my Metformin dose if fasting glucose stays below 95?',
    'Should we run a blood lipid check next month?',
  ]);
  const [newQuestion, setNewQuestion] = useState('');
  const [isExported, setIsExported] = useState(false);

  const handleAddQuestion = () => {
    if (newQuestion.trim() === '') return;
    setQuestions([...questions, newQuestion.trim()]);
    setNewQuestion('');
  };

  const handleRemoveQuestion = (idx: number) => {
    setQuestions(questions.filter((_, index) => index !== idx));
  };

  const handleExport = () => {
    setIsExported(true);
    setTimeout(() => setIsExported(false), 3000);
  };

  if (!appointment) {
    return (
      <GradientBackground>
        <View style={styles.container}>
          <ScreenHeader title="Share Report" onBack={() => router.back()} />
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Appointment not found.</Text>
          </View>
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <View style={styles.container}>
        <ScreenHeader title="Clinical Brief" onBack={() => router.back()} />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Clinical summary card containing the context text */}
          <Text style={styles.sectionHeader}>Shareable Clinical Summary</Text>
          <GlassCard style={styles.reportCard}>
            <ScrollView style={styles.reportTextScroll} nestedScrollEnabled>
              <Text style={styles.reportText}>{reportText}</Text>
              
              {questions.length > 0 && (
                <>
                  <Text style={styles.reportSectionHeader}>── Patient Questions ──</Text>
                  {questions.map((q, idx) => (
                    <Text key={idx} style={styles.reportQuestionText}>• {q}</Text>
                  ))}
                </>
              )}
            </ScrollView>
          </GlassCard>

          {/* Export PDF Button */}
          {isExported && (
            <Text style={styles.exportSuccess}>
              🟢 PDF summary generated successfully! Ready for printing or emailing.
            </Text>
          )}
          <TouchableOpacity 
            style={styles.exportBtn}
            onPress={handleExport}
            activeOpacity={0.8}
          >
            <Text style={styles.exportBtnText}>📄 Export PDF Share Report</Text>
          </TouchableOpacity>

          {/* Questions Editor */}
          <Text style={styles.sectionHeader}>Questions for Doctor</Text>
          <GlassCard style={styles.questionsCard}>
            <Text style={styles.cardDesc}>Write questions so you remember to bring them up during your review.</Text>
            
            <View style={styles.questionsList}>
              {questions.map((q, idx) => (
                <View key={idx} style={styles.questionItem}>
                  <Text style={styles.questionItemText}>{q}</Text>
                  <TouchableOpacity onPress={() => handleRemoveQuestion(idx)}>
                    <Text style={styles.removeText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <View style={styles.addTimeRow}>
              <TextInput
                style={[styles.textInput, { flex: 1 }]}
                placeholder="Ask about dosage, side effects..."
                placeholderTextColor="#87736a"
                value={newQuestion}
                onChangeText={setNewQuestion}
              />
              <TouchableOpacity 
                style={styles.addTimeBtn}
                onPress={handleAddQuestion}
              >
                <Text style={styles.addTimeBtnText}>+ Add</Text>
              </TouchableOpacity>
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
  sectionHeader: {
    fontSize: 12,
    fontFamily: 'Lexend-SemiBold',
    color: '#954921',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    paddingLeft: 4,
  },
  reportCard: {
    padding: 16,
    height: 320,
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e8dedb',
  },
  reportTextScroll: {
    flex: 1,
  },
  reportText: {
    fontSize: 13,
    fontFamily: 'Courier', // Monospaced for printable look
    color: '#221a16',
    lineHeight: 18,
  },
  reportSectionHeader: {
    fontSize: 13,
    fontFamily: 'Courier',
    fontWeight: 'bold',
    color: '#221a16',
    marginTop: 16,
    marginBottom: 8,
  },
  reportQuestionText: {
    fontSize: 13,
    fontFamily: 'Courier',
    color: '#221a16',
    lineHeight: 18,
    marginBottom: 4,
  },
  exportSuccess: {
    fontSize: 12,
    color: '#00696f',
    textAlign: 'center',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  exportBtn: {
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
    marginBottom: 28,
  },
  exportBtnText: {
    fontSize: 15,
    fontFamily: 'Lexend-SemiBold',
    color: '#ffffff',
  },
  questionsCard: {
    padding: 16,
    gap: 12,
  },
  cardDesc: {
    fontSize: 13,
    fontFamily: 'Lexend',
    color: '#87736a',
    lineHeight: 18,
    marginBottom: 8,
  },
  questionsList: {
    gap: 10,
  },
  questionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(149, 73, 33, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 10,
  },
  questionItemText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Lexend-Medium',
    color: '#54433b',
    lineHeight: 18,
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
});
