import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useSuvi } from '@/context/SuviStateContext';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';

interface TrackerItem {
  id: string;
  name: string;
  desc: string;
  icon: string;
  category: 'manual' | 'sync';
}

const AVAILABLE_TRACKERS: TrackerItem[] = [
  { id: 'water', name: 'Water Intake', desc: 'Log glasses manually to hit 2.0L goal', icon: '💧', category: 'manual' },
  { id: 'bp', name: 'Blood Pressure', desc: 'Record systolic and diastolic logs', icon: '❤️', category: 'manual' },
  { id: 'glucose', name: 'Blood Glucose', desc: 'Track fasting and post-meal indices', icon: '🩸', category: 'manual' },
  { id: 'weight', name: 'Body Weight', desc: 'Monitor weight logs over time', icon: '⚖️', category: 'manual' },
  { id: 'cycle', name: 'Menstrual Cycle', desc: 'Day-to-day phases and nutrition tips', icon: '🌸', category: 'manual' },
  { id: 'steps', name: 'Steps Counter', desc: 'Live synced count of active walking', icon: '🏃', category: 'sync' },
  { id: 'sleep', name: 'Sleep Tracker', desc: 'Automated duration and quality log', icon: '😴', category: 'sync' },
  { id: 'heart-rate', name: 'Heart Rate', desc: 'Resting and active pulses via device', icon: '💓', category: 'sync' },
];

export default function ManageTrackersScreen() {
  const router = useRouter();
  const { state, toggleTracker } = useSuvi();

  // Filter menstrual cycle for male profile to keep it clean, or keep it but note
  const isFemale = state.profile.gender === 'female';
  const visibleTrackers = AVAILABLE_TRACKERS.filter(t => isFemale || t.id !== 'cycle');

  return (
    <GradientBackground>
      <View style={styles.container}>
        <ScreenHeader title="Manage Trackers" onBack={() => router.back()} />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Customize Trackers</Text>
          <Text style={styles.subtitle}>
            Select which metrics you want active in your health hub and dashboards. Synced trackers require a linked smart device.
          </Text>

          {/* Manual Entry Trackers Group */}
          <Text style={styles.sectionHeader}>Manual Logging Trackers</Text>
          <View style={styles.groupCard}>
            {visibleTrackers
              .filter(t => t.category === 'manual')
              .map((tracker, idx, arr) => {
                const isActive = state.activeTrackers.includes(tracker.id);
                return (
                  <View key={tracker.id}>
                    <View style={styles.trackerRow}>
                      <Text style={styles.trackerIcon}>{tracker.icon}</Text>
                      <View style={styles.trackerText}>
                        <Text style={styles.trackerName}>{tracker.name}</Text>
                        <Text style={styles.trackerDesc}>{tracker.desc}</Text>
                      </View>
                      <Switch
                        value={isActive}
                        onValueChange={() => toggleTracker(tracker.id)}
                        trackColor={{ false: 'rgba(34, 26, 22, 0.1)', true: '#ff9d6e' }}
                        thumbColor={isActive ? '#954921' : '#f4f3f2'}
                      />
                    </View>
                    {idx < arr.length - 1 && <View style={styles.divider} />}
                  </View>
                );
              })}
          </View>

          {/* Automated/Sync Trackers Group */}
          <Text style={styles.sectionHeader}>Wearable Synced Trackers</Text>
          <View style={styles.groupCard}>
            {visibleTrackers
              .filter(t => t.category === 'sync')
              .map((tracker, idx, arr) => {
                const isActive = state.activeTrackers.includes(tracker.id);
                return (
                  <View key={tracker.id}>
                    <View style={styles.trackerRow}>
                      <Text style={styles.trackerIcon}>{tracker.icon}</Text>
                      <View style={styles.trackerText}>
                        <Text style={styles.trackerName}>{tracker.name}</Text>
                        <Text style={styles.trackerDesc}>{tracker.desc}</Text>
                      </View>
                      <Switch
                        value={isActive}
                        onValueChange={() => toggleTracker(tracker.id)}
                        trackColor={{ false: 'rgba(34, 26, 22, 0.1)', true: '#ff9d6e' }}
                        thumbColor={isActive ? '#954921' : '#f4f3f2'}
                      />
                    </View>
                    {idx < arr.length - 1 && <View style={styles.divider} />}
                  </View>
                );
              })}
          </View>

          {/* Add custom tracker trigger placeholder */}
          <TouchableOpacity 
            style={styles.addCustomBtn}
            onPress={() => alert('Custom trackers feature is in development!')}
          >
            <Text style={styles.addCustomText}>+ Add Custom Tracker</Text>
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
  title: {
    fontSize: 22,
    fontFamily: 'Lexend-SemiBold',
    color: '#221a16',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Lexend',
    color: '#87736a',
    lineHeight: 20,
    marginBottom: 24,
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
  trackerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 14,
  },
  trackerIcon: {
    fontSize: 24,
  },
  trackerText: {
    flex: 1,
    gap: 2,
  },
  trackerName: {
    fontSize: 15,
    fontFamily: 'Lexend-SemiBold',
    color: '#221a16',
  },
  trackerDesc: {
    fontSize: 12,
    fontFamily: 'Lexend',
    color: '#87736a',
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(149, 73, 33, 0.08)',
  },
  addCustomBtn: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(149, 73, 33, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  addCustomText: {
    fontSize: 14,
    fontFamily: 'Lexend-SemiBold',
    color: '#954921',
  },
});
