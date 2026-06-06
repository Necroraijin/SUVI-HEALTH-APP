import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSuvi } from '@/context/SuviStateContext';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';

export default function ConnectedDevicesScreen() {
  const router = useRouter();
  const { state, syncSmartwatch, disconnectSmartwatch } = useSuvi();

  return (
    <GradientBackground>
      <View style={styles.container}>
        <ScreenHeader title="Connected Devices" onBack={() => router.back()} />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Pair New Sensors</Text>
          <Text style={styles.subtitle}>
            Link external bluetooth health monitors and wearables to enable automated metrics synchronization.
          </Text>

          {/* Primary smartwatch card */}
          <GlassCard style={styles.deviceCard}>
            <View style={styles.deviceHeader}>
              <Text style={styles.deviceIcon}>⌚</Text>
              <View style={styles.deviceText}>
                <Text style={styles.deviceName}>Apple Watch Series 9</Text>
                <Text style={styles.deviceStatus}>
                  {state.watchSynced ? '🟢 Live Connected' : '⚪ Not Connected'}
                </Text>
              </View>
            </View>
            <Text style={styles.deviceDesc}>
              Synchronizes resting heart rate, sleep duration logs, active steps, and baseline blood pressure.
            </Text>
            <TouchableOpacity 
              style={[styles.syncBtn, state.watchSynced ? styles.btnDisconnect : styles.btnConnect]}
              onPress={state.watchSynced ? disconnectSmartwatch : syncSmartwatch}
            >
              <Text style={[styles.syncBtnText, state.watchSynced && styles.btnTextDisconnect]}>
                {state.watchSynced ? 'Disconnect Watch' : 'Pair & Sync Watch'}
              </Text>
            </TouchableOpacity>
          </GlassCard>

          {/* Secondary BP cuff monitor card */}
          <GlassCard style={styles.deviceCard}>
            <View style={styles.deviceHeader}>
              <Text style={styles.deviceIcon}>❤️</Text>
              <View style={styles.deviceText}>
                <Text style={styles.deviceName}>Omron BP Monitor (Bluetooth)</Text>
                <Text style={styles.deviceStatus}>⚪ Ready for pairing</Text>
              </View>
            </View>
            <Text style={styles.deviceDesc}>
              Allows automated logging of systolic & diastolic blood pressure readings.
            </Text>
            <TouchableOpacity 
              style={[styles.syncBtn, styles.btnConnect]}
              onPress={() => alert('Omron BP monitor pairing initiated!')}
            >
              <Text style={styles.syncBtnText}>Pair BP Monitor</Text>
            </TouchableOpacity>
          </GlassCard>

          {/* Continuous Glucose Monitor (CGM) card */}
          <GlassCard style={styles.deviceCard}>
            <View style={styles.deviceHeader}>
              <Text style={styles.deviceIcon}>🩸</Text>
              <View style={styles.deviceText}>
                <Text style={styles.deviceName}>Dexcom G7 CGM</Text>
                <Text style={styles.deviceStatus}>⚪ Ready for pairing</Text>
              </View>
            </View>
            <Text style={styles.deviceDesc}>
              Auto-syncs live interstitial glucose numbers every 5 minutes straight to Suvi dashboards.
            </Text>
            <TouchableOpacity 
              style={[styles.syncBtn, styles.btnConnect]}
              onPress={() => alert('Dexcom G7 CGM pairing initiated!')}
            >
              <Text style={styles.syncBtnText}>Pair Dexcom CGM</Text>
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
  deviceCard: {
    padding: 16,
    marginBottom: 20,
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 10,
  },
  deviceIcon: {
    fontSize: 28,
  },
  deviceText: {
    flex: 1,
    gap: 2,
  },
  deviceName: {
    fontSize: 15,
    fontFamily: 'Lexend-SemiBold',
    color: '#221a16',
  },
  deviceStatus: {
    fontSize: 12,
    fontFamily: 'Lexend-Medium',
    color: '#87736a',
  },
  deviceDesc: {
    fontSize: 12,
    fontFamily: 'Lexend',
    color: '#54433b',
    lineHeight: 16,
    marginBottom: 16,
  },
  syncBtn: {
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnConnect: {
    backgroundColor: '#954921',
  },
  btnDisconnect: {
    backgroundColor: 'rgba(186, 26, 26, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(186, 26, 26, 0.2)',
  },
  syncBtnText: {
    fontSize: 13,
    fontFamily: 'Lexend-SemiBold',
    color: '#ffffff',
  },
  btnTextDisconnect: {
    color: '#ba1a1a',
  },
});
