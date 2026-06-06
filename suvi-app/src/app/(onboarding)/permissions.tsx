import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassCard } from '@/components/ui/GlassCard';

export default function OnboardingPermissionsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    goal: string;
    name: string;
    age: string;
    weight: string;
    gender: string;
  }>();

  const [notifs, setNotifs] = useState(true);
  const [healthData, setHealthData] = useState(true);
  const [camera, setCamera] = useState(false);

  const handleNext = () => {
    router.push({
      pathname: '/(onboarding)/first-goal',
      params: {
        goal: params.goal || 'medication',
        name: params.name || 'Rahul',
        age: params.age || '28',
        weight: params.weight || '74',
        gender: params.gender || 'male',
      },
    });
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Permissions</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.questionText}>Enable care updates.</Text>
          <Text style={styles.subtext}>
            Grant permissions so Suvi can send medication reminders, read baseline health steps, and scan checkup files.
          </Text>

          {/* Permissions Group */}
          <View style={styles.permissionsGroup}>
            
            {/* Notifications */}
            <GlassCard style={styles.permCard}>
              <View style={styles.row}>
                <Text style={styles.icon}>🔔</Text>
                <View style={styles.textContainer}>
                  <Text style={styles.permTitle}>Push Notifications</Text>
                  <Text style={styles.permDesc}>Required for medication alerts, refills, and morning summaries.</Text>
                </View>
                <Switch
                  value={notifs}
                  onValueChange={setNotifs}
                  trackColor={{ false: 'rgba(34, 26, 22, 0.1)', true: '#ff9d6e' }}
                  thumbColor={notifs ? '#954921' : '#f4f3f2'}
                />
              </View>
            </GlassCard>

            {/* Apple Health / Google Fit */}
            <GlassCard style={styles.permCard}>
              <View style={styles.row}>
                <Text style={styles.icon}>⌚</Text>
                <View style={styles.textContainer}>
                  <Text style={styles.permTitle}>Wearable Health Connect</Text>
                  <Text style={styles.permDesc}>Automatically sync steps goals, sleep logs, and heart rates.</Text>
                </View>
                <Switch
                  value={healthData}
                  onValueChange={setHealthData}
                  trackColor={{ false: 'rgba(34, 26, 22, 0.1)', true: '#ff9d6e' }}
                  thumbColor={healthData ? '#954921' : '#f4f3f2'}
                />
              </View>
            </GlassCard>

            {/* Camera */}
            <GlassCard style={styles.permCard}>
              <View style={styles.row}>
                <Text style={styles.icon}>📸</Text>
                <View style={styles.textContainer}>
                  <Text style={styles.permTitle}>Camera Access</Text>
                  <Text style={styles.permDesc}>Allow scanning clinical prescriptions and blood reports.</Text>
                </View>
                <Switch
                  value={camera}
                  onValueChange={setCamera}
                  trackColor={{ false: 'rgba(34, 26, 22, 0.1)', true: '#ff9d6e' }}
                  thumbColor={camera ? '#954921' : '#f4f3f2'}
                />
              </View>
            </GlassCard>

          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.skipBtn} onPress={handleNext}>
            <Text style={styles.skipBtnText}>Skip for Now</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.continueBtn} onPress={handleNext}>
            <Text style={styles.continueBtnText}>Grant & Continue</Text>
          </TouchableOpacity>
        </View>

      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 44,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  backButtonText: {
    fontSize: 20,
    color: '#954921',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#954921',
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  questionText: {
    fontSize: 26,
    fontWeight: '600',
    color: '#221a16',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 15,
    color: '#54433b',
    lineHeight: 22,
    marginBottom: 24,
  },
  permissionsGroup: {
    gap: 16,
  },
  permCard: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  icon: {
    fontSize: 28,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  permTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#221a16',
  },
  permDesc: {
    fontSize: 12,
    color: '#87736a',
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
  },
  skipBtn: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(149, 73, 33, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#954921',
  },
  continueBtn: {
    flex: 1.5,
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
  continueBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
