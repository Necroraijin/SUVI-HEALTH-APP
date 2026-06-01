import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard } from '../ui/GlassCard';
import { GradientBackground } from '../ui/GradientBackground';

interface OnboardingMedicalProps {
  watchSynced: boolean;
  onSyncWatch: () => void;
  onDisconnectWatch: () => void;
  onComplete: () => void;
  onBack: () => void;
}

export const OnboardingMedical: React.FC<OnboardingMedicalProps> = ({
  watchSynced,
  onSyncWatch,
  onDisconnectWatch,
  onComplete,
  onBack,
}) => {
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  const simulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScanComplete(true);
    }, 2500);
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Context & Connections</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.questionText}>Sync with your health.</Text>
          <Text style={styles.subtext}>
            Connect your sensors and upload reports so Suvi can proactively suggest recovery cycles and medication timing.
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Wearable Integration</Text>
            <GlassCard style={styles.syncCard}>
              <View style={styles.syncHeader}>
                <Text style={styles.syncIcon}>⌚</Text>
                <View style={styles.syncTextContainer}>
                  <Text style={styles.syncTitle}>Smartwatch & Wearables</Text>
                  <Text style={styles.syncStatus}>
                    {watchSynced ? '🟢 Fully Synced (Rest HR, Sleep, BP)' : '🔴 Device Disconnected'}
                  </Text>
                </View>
              </View>

              {watchSynced ? (
                <View style={styles.syncDataGrid}>
                  <View style={styles.dataBadge}>
                    <Text style={styles.badgeLabel}>Heart Rate</Text>
                    <Text style={styles.badgeVal}>77 bpm</Text>
                  </View>
                  <View style={styles.dataBadge}>
                    <Text style={styles.badgeLabel}>Sleep Log</Text>
                    <Text style={styles.badgeVal}>5.8 hrs</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.syncButton, styles.disconnectBtn]}
                    onPress={onDisconnectWatch}
                  >
                    <Text style={styles.syncButtonText}>Disconnect Device</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.syncButton} onPress={onSyncWatch}>
                  <Text style={styles.syncButtonText}>Sync Smartwatch Data</Text>
                </TouchableOpacity>
              )}
            </GlassCard>
          </View>

          <View style={[styles.section, styles.topMargin]}>
            <Text style={styles.sectionTitle}>2. Document Scanner (AI)</Text>
            <GlassCard style={styles.syncCard}>
              <View style={styles.syncHeader}>
                <Text style={styles.syncIcon}>📄</Text>
                <View style={styles.syncTextContainer}>
                  <Text style={styles.syncTitle}>Clinical Health Reports</Text>
                  <Text style={styles.syncStatus}>
                    {scanComplete ? '🟢 2 Medications Extracted' : '⚪ Ready for PDF/Image upload'}
                  </Text>
                </View>
              </View>

              {scanning ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#954921" />
                  <Text style={styles.loadingText}>Extracting records via Suvi AI...</Text>
                </View>
              ) : scanComplete ? (
                <View style={styles.extractedContainer}>
                  <Text style={styles.extractedHeader}>Found inside report:</Text>
                  <View style={styles.medRow}>
                    <Text style={styles.medBullet}>•</Text>
                    <Text style={styles.medText}>Metformin (500mg) - twice daily (9am, 9pm)</Text>
                  </View>
                  <View style={styles.medRow}>
                    <Text style={styles.medBullet}>•</Text>
                    <Text style={styles.medText}>Metoprolol (25mg) - once daily (8am)</Text>
                  </View>
                  <Text style={styles.successNote}>Successfully added to medication scheduler.</Text>
                </View>
              ) : (
                <TouchableOpacity style={styles.syncButton} onPress={simulateScan}>
                  <Text style={styles.syncButtonText}>Upload & Scan Medical Report</Text>
                </TouchableOpacity>
              )}
            </GlassCard>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.button} onPress={onComplete} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Finish Setup</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingBottom: 24,
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
  section: {
    gap: 12,
  },
  topMargin: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#954921',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingLeft: 4,
  },
  syncCard: {
    padding: 16,
  },
  syncHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  syncIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  syncTextContainer: {
    flex: 1,
  },
  syncTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#221a16',
    marginBottom: 4,
  },
  syncStatus: {
    fontSize: 13,
    color: '#87736a',
  },
  syncButton: {
    height: 48,
    borderRadius: 16,
    backgroundColor: '#fff8f6',
    borderWidth: 1,
    borderColor: 'rgba(149, 73, 33, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  syncButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#954921',
  },
  disconnectBtn: {
    marginTop: 12,
    width: '100%',
    borderColor: 'rgba(186, 26, 26, 0.25)',
  },
  syncDataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dataBadge: {
    flex: 1,
    minWidth: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  badgeLabel: {
    fontSize: 11,
    color: '#87736a',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  badgeVal: {
    fontSize: 15,
    fontWeight: '600',
    color: '#00696f',
  },
  loadingContainer: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#54433b',
  },
  extractedContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  extractedHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: '#221a16',
    marginBottom: 8,
  },
  medRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  medBullet: {
    color: '#954921',
    fontWeight: 'bold',
  },
  medText: {
    fontSize: 13,
    color: '#54433b',
    lineHeight: 18,
    flex: 1,
  },
  successNote: {
    fontSize: 11,
    color: '#00696f',
    marginTop: 8,
    fontStyle: 'italic',
  },
  footer: {
    paddingHorizontal: 24,
  },
  button: {
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
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
