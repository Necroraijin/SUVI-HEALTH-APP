import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useSuvi, Appointment } from '@/context/SuviStateContext';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';

export default function AppointmentsScheduleScreen() {
  const router = useRouter();
  const { state, addAppointment } = useSuvi();

  const [isAdding, setIsAdding] = useState(false);
  const [docName, setDocName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (docName.trim() === '' || date.trim() === '') return;

    addAppointment({
      doctorId: '1', // Default
      doctorName: docName.trim(),
      date: date.trim(),
      time: time.trim() || '10:00 AM',
      location: location.trim() || 'General Clinic',
      notes: notes.trim() || 'Routine follow-up',
      completed: false,
    });

    setDocName('');
    setDate('');
    setTime('');
    setLocation('');
    setNotes('');
    setIsAdding(false);
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <ScreenHeader 
          title="Appointments" 
          onBack={() => router.back()}
          rightAction={
            <TouchableOpacity 
              style={styles.headerBtn}
              onPress={() => setIsAdding(!isAdding)}
            >
              <Text style={styles.headerBtnText}>{isAdding ? 'Cancel' : '+ New'}</Text>
            </TouchableOpacity>
          }
        />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Add Appointment Form */}
          {isAdding && (
            <GlassCard style={styles.formCard}>
              <Text style={styles.formTitle}>Schedule Appointment</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>DOCTOR NAME</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Dr. Sanjay Verma"
                  placeholderTextColor="#87736a"
                  value={docName}
                  onChangeText={setDocName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>DATE (DD/MM/YYYY)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="24/06/2026"
                  placeholderTextColor="#87736a"
                  value={date}
                  onChangeText={setDate}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>TIME</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="10:30 AM"
                  placeholderTextColor="#87736a"
                  value={time}
                  onChangeText={setTime}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>CLINIC LOCATION</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Heart Care Clinic, Sector 18..."
                  placeholderTextColor="#87736a"
                  value={location}
                  onChangeText={setLocation}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>NOTES & SYMPTOMS TO SHARE</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Review BP medication, chest tight..."
                  placeholderTextColor="#87736a"
                  value={notes}
                  onChangeText={setNotes}
                />
              </View>

              <TouchableOpacity 
                style={[styles.saveBtn, (docName.trim() === '' || date.trim() === '') && styles.saveBtnDisabled]}
                disabled={docName.trim() === '' || date.trim() === ''}
                onPress={handleSave}
              >
                <Text style={styles.saveBtnText}>Save Appointment</Text>
              </TouchableOpacity>
            </GlassCard>
          )}

          {/* Appointments List */}
          <Text style={styles.sectionHeader}>Upcoming Reviews</Text>
          {state.appointments.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📅</Text>
              <Text style={styles.emptyText}>No appointments scheduled.</Text>
            </View>
          ) : (
            <View style={styles.appointmentsList}>
              {state.appointments.map((apt) => (
                <GlassCard key={apt.id} style={styles.aptCard}>
                  <View style={styles.aptHeader}>
                    <View style={styles.dateBadge}>
                      <Text style={styles.dateText}>{apt.date.split('/')[0] || apt.date}</Text>
                      <Text style={styles.monthText}>Date</Text>
                    </View>
                    <View style={styles.aptInfo}>
                      <Text style={styles.docName}>{apt.doctorName}</Text>
                      <Text style={styles.timeLocation}>{apt.time} • {apt.location}</Text>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <Text style={styles.notesTitle}>Patient Notes:</Text>
                  <Text style={styles.notesText}>"{apt.notes}"</Text>

                  {/* PDF report summary trigger */}
                  <TouchableOpacity 
                    style={styles.pdfReportBtn}
                    onPress={() => router.push({
                      pathname: '/(screens)/pre-appointment-report',
                      params: { id: apt.id }
                    })}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.pdfReportText}>📋 Generate Pre-Appointment Report</Text>
                  </TouchableOpacity>
                </GlassCard>
              ))}
            </View>
          )}

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
  formCard: {
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  formTitle: {
    fontSize: 16,
    fontFamily: 'Lexend-SemiBold',
    color: '#221a16',
    marginBottom: 4,
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
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: 'Lexend',
    color: '#221a16',
  },
  saveBtn: {
    height: 48,
    borderRadius: 16,
    backgroundColor: '#954921',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnDisabled: {
    backgroundColor: 'rgba(149, 73, 33, 0.4)',
  },
  saveBtnText: {
    fontSize: 14,
    fontFamily: 'Lexend-SemiBold',
    color: '#ffffff',
  },
  sectionHeader: {
    fontSize: 12,
    fontFamily: 'Lexend-SemiBold',
    color: '#954921',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
    paddingLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyIcon: {
    fontSize: 48,
    opacity: 0.4,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Lexend',
    color: '#87736a',
  },
  appointmentsList: {
    gap: 16,
  },
  aptCard: {
    padding: 16,
  },
  aptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  dateBadge: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 157, 110, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    fontFamily: 'Lexend-Bold',
    color: '#954921',
    lineHeight: 22,
  },
  monthText: {
    fontSize: 9,
    fontFamily: 'Lexend-Medium',
    color: '#87736a',
    textTransform: 'uppercase',
  },
  aptInfo: {
    flex: 1,
    gap: 2,
  },
  docName: {
    fontSize: 16,
    fontFamily: 'Lexend-SemiBold',
    color: '#221a16',
  },
  timeLocation: {
    fontSize: 12,
    fontFamily: 'Lexend',
    color: '#87736a',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(149, 73, 33, 0.08)',
    marginVertical: 12,
  },
  notesTitle: {
    fontSize: 11,
    fontFamily: 'Lexend-SemiBold',
    color: '#87736a',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 13,
    fontFamily: 'Lexend',
    color: '#54433b',
    lineHeight: 18,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  pdfReportBtn: {
    width: '100%',
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(149, 73, 33, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(149, 73, 33, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfReportText: {
    fontSize: 12,
    fontFamily: 'Lexend-SemiBold',
    color: '#954921',
  },
});
