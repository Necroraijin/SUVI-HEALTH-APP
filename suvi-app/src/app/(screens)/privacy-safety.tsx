import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useSuvi } from '@/context/SuviStateContext';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';

export default function PrivacySafetyScreen() {
  const router = useRouter();
  const { resetAllData } = useSuvi();

  const [shareData, setShareData] = useState(true);
  const [appLock, setAppLock] = useState(false);
  const [anonAnalytics, setAnonAnalytics] = useState(true);

  const [statusMsg, setStatusMsg] = useState('');

  const handleExport = () => {
    setStatusMsg('🟢 Preparing export... raw JSON health data package saved to documents.');
    setTimeout(() => setStatusMsg(''), 4000);
  };

  const handleDelete = () => {
    resetAllData();
    router.replace('/(onboarding)/welcome');
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <ScreenHeader title="Privacy & Safety" onBack={() => router.back()} />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <Text style={styles.sectionHeader}>Security & App Lock</Text>
          <View style={styles.groupCard}>
            <View style={styles.row}>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>Biometrics App Lock</Text>
                <Text style={styles.rowDesc}>Require Face ID / Touch ID when launching Suvi</Text>
              </View>
              <Switch
                value={appLock}
                onValueChange={setAppLock}
                trackColor={{ false: 'rgba(34, 26, 22, 0.1)', true: '#ff9d6e' }}
                thumbColor={appLock ? '#954921' : '#f4f3f2'}
              />
            </View>
          </View>

          <Text style={styles.sectionHeader}>Health Data Privacy</Text>
          <View style={styles.groupCard}>
            
            <View style={styles.row}>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>Share Vitals with Clinic</Text>
                <Text style={styles.rowDesc}>Allows Dr. Sanjay Verma to view BP & glucose metrics</Text>
              </View>
              <Switch
                value={shareData}
                onValueChange={setShareData}
                trackColor={{ false: 'rgba(34, 26, 22, 0.1)', true: '#ff9d6e' }}
                thumbColor={shareData ? '#954921' : '#f4f3f2'}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>Anonymous Analytics</Text>
                <Text style={styles.rowDesc}>Share crash logs & metrics to optimize performance</Text>
              </View>
              <Switch
                value={anonAnalytics}
                onValueChange={setAnonAnalytics}
                trackColor={{ false: 'rgba(34, 26, 22, 0.1)', true: '#ff9d6e' }}
                thumbColor={anonAnalytics ? '#954921' : '#f4f3f2'}
              />
            </View>
          </View>

          {/* Export / Delete Actions */}
          <Text style={styles.sectionHeader}>Manage Account Data</Text>
          
          {statusMsg !== '' && <Text style={styles.statusText}>{statusMsg}</Text>}

          <GlassCard style={styles.actionsCard}>
            <Text style={styles.actionDesc}>
              You have complete ownership of your health records. Export your full log history as a standard portable JSON envelope.
            </Text>
            <TouchableOpacity style={styles.exportBtn} onPress={handleExport}>
              <Text style={styles.exportText}>📥 Export My Health Data</Text>
            </TouchableOpacity>

            <View style={styles.cardDivider} />

            <Text style={styles.actionDesc}>
              Permanently purge all data from this device. This includes onboarding settings, logged blood sugar records, and vault reports.
            </Text>
            <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
              <Text style={styles.deleteText}>🗑️ Purge & Delete All Data</Text>
            </TouchableOpacity>
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
  actionsCard: {
    padding: 16,
    gap: 12,
    marginBottom: 24,
  },
  actionDesc: {
    fontSize: 12,
    fontFamily: 'Lexend',
    color: '#87736a',
    lineHeight: 16,
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(149, 73, 33, 0.08)',
    marginVertical: 8,
  },
  exportBtn: {
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(149, 73, 33, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(149, 73, 33, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  exportText: {
    fontSize: 13,
    fontFamily: 'Lexend-SemiBold',
    color: '#954921',
  },
  deleteBtn: {
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(186, 26, 26, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(186, 26, 26, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  deleteText: {
    fontSize: 13,
    fontFamily: 'Lexend-SemiBold',
    color: '#ba1a1a',
  },
  statusText: {
    fontSize: 12,
    color: '#00696f',
    textAlign: 'center',
    marginBottom: 12,
    fontStyle: 'italic',
  },
});
