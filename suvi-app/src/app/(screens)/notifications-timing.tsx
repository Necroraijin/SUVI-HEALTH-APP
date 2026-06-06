import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Switch, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useSuvi } from '@/context/SuviStateContext';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';

export default function NotificationsTimingScreen() {
  const router = useRouter();
  const { state, updateNotificationPrefs } = useSuvi();

  const [briefTime, setBriefTime] = useState(state.notificationPrefs.dailyBriefTime);
  const [quietStart, setQuietStart] = useState(state.notificationPrefs.quietHoursStart);
  const [quietEnd, setQuietEnd] = useState(state.notificationPrefs.quietHoursEnd);

  const [saveStatus, setSaveStatus] = useState('');

  const handleSave = () => {
    updateNotificationPrefs({
      dailyBriefTime: briefTime.trim(),
      quietHoursStart: quietStart.trim(),
      quietHoursEnd: quietEnd.trim(),
    });

    setSaveStatus('🟢 Schedule preferences saved!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <ScreenHeader title="Reminders & Timing" onBack={() => router.back()} />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <Text style={styles.sectionHeader}>Alert Categories</Text>
          <View style={styles.groupCard}>
            
            {/* Med reminders switch */}
            <View style={styles.row}>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>Medication Reminders</Text>
                <Text style={styles.rowDesc}>Notify at scheduled dosing timing slots</Text>
              </View>
              <Switch
                value={state.notificationPrefs.medicationReminders}
                onValueChange={(val) => updateNotificationPrefs({ medicationReminders: val })}
                trackColor={{ false: 'rgba(34, 26, 22, 0.1)', true: '#ff9d6e' }}
                thumbColor={state.notificationPrefs.medicationReminders ? '#954921' : '#f4f3f2'}
              />
            </View>

            <View style={styles.divider} />

            {/* Symptom reminders switch */}
            <View style={styles.row}>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>Symptom Check-ins</Text>
                <Text style={styles.rowDesc}>Daily evening prompts to log energy & logs</Text>
              </View>
              <Switch
                value={state.notificationPrefs.symptomCheckins}
                onValueChange={(val) => updateNotificationPrefs({ symptomCheckins: val })}
                trackColor={{ false: 'rgba(34, 26, 22, 0.1)', true: '#ff9d6e' }}
                thumbColor={state.notificationPrefs.symptomCheckins ? '#954921' : '#f4f3f2'}
              />
            </View>

            <View style={styles.divider} />

            {/* Appointment reminders switch */}
            <View style={styles.row}>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>Appointments Alerts</Text>
                <Text style={styles.rowDesc}>Reminder 24 hours prior to clinician visits</Text>
              </View>
              <Switch
                value={state.notificationPrefs.appointmentAlerts}
                onValueChange={(val) => updateNotificationPrefs({ appointmentAlerts: val })}
                trackColor={{ false: 'rgba(34, 26, 22, 0.1)', true: '#ff9d6e' }}
                thumbColor={state.notificationPrefs.appointmentAlerts ? '#954921' : '#f4f3f2'}
              />
            </View>
          </View>

          <Text style={styles.sectionHeader}>Delivery Schedule</Text>
          <GlassCard style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>DAILY MORNING BRIEF TIME</Text>
              <TextInput
                style={styles.textInput}
                value={briefTime}
                onChangeText={setBriefTime}
                placeholder="e.g. 07:00 AM"
                placeholderTextColor="#87736a"
              />
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>QUIET HOURS START</Text>
                <TextInput
                  style={styles.textInput}
                  value={quietStart}
                  onChangeText={setQuietStart}
                  placeholder="10:00 PM"
                  placeholderTextColor="#87736a"
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>QUIET HOURS END</Text>
                <TextInput
                  style={styles.textInput}
                  value={quietEnd}
                  onChangeText={setQuietEnd}
                  placeholder="07:00 AM"
                  placeholderTextColor="#87736a"
                />
              </View>
            </View>
          </GlassCard>

          {saveStatus !== '' && <Text style={styles.statusText}>{saveStatus}</Text>}

          <TouchableOpacity 
            style={styles.saveBtn}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text style={styles.saveBtnText}>Save Schedule Preferences</Text>
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
  sectionHeader: {
    fontSize: 12,
    fontFamily: 'Lexend-SemiBold',
    color: '#954921',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 12,
    paddingLeft: 4,
  },
  groupCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.42)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.55)',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 14,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontSize: 15,
    fontFamily: 'Lexend-SemiBold',
    color: '#221a16',
  },
  rowDesc: {
    fontSize: 12,
    fontFamily: 'Lexend',
    color: '#87736a',
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(149, 73, 33, 0.08)',
  },
  formCard: {
    padding: 20,
    gap: 16,
    marginBottom: 24,
  },
  inputGroup: {
    gap: 6,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 16,
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
  statusText: {
    fontSize: 13,
    color: '#00696f',
    textAlign: 'center',
    marginBottom: 16,
    fontStyle: 'italic',
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
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  saveBtnText: {
    fontSize: 16,
    fontFamily: 'Lexend-SemiBold',
    color: '#ffffff',
  },
});
