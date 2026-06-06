import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSuvi } from '../../context/SuviStateContext';
import { GlassCard } from '../ui/GlassCard';

export const ProfileSettingsTab: React.FC = () => {
  const router = useRouter();
  const { state, syncSmartwatch, disconnectSmartwatch, resetAllData } = useSuvi();

  const handleReset = () => {
    Alert.alert(
      'Reset Companion State',
      'This will clear your logged water, medications, and profiles, taking you back to the onboarding welcome screen. Perfect for testing both gender configurations!',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset State', style: 'destructive', onPress: resetAllData }
      ]
    );
  };

  const activeGoalLabel =
    state.profile.focusGoal === 'medication'
      ? 'Medication Adherence'
      : state.profile.focusGoal === 'fitness'
      ? 'Stamina & Wellness'
      : state.profile.focusGoal === 'weight-loss'
      ? 'Weight Loss'
      : 'Muscle Gain';

  const renderMenuRow = (icon: string, title: string, desc: string, onPress: () => void) => (
    <TouchableOpacity style={styles.menuRow} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.rowIconBox}>
        <Text style={styles.rowIcon}>{icon}</Text>
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowDesc}>{desc}</Text>
      </View>
      <Text style={styles.arrowIcon}>➔</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Companion Profile</Text>
      <Text style={styles.subtitle}>Configure connected devices, privacy filters, and bio-parameters.</Text>

      {/* User Stats Card */}
      <GlassCard style={styles.profileCard}>
        <View style={styles.avatarBig}>
          <Text style={styles.avatarBigText}>
            {state.profile.gender === 'female' ? '👩' : '👨'}
          </Text>
        </View>
        <Text style={styles.profileName}>{state.profile.name}</Text>
        <Text style={styles.profileSub}>Biological {state.profile.gender === 'female' ? 'Female' : 'Male'} • {state.profile.age} years old</Text>

        <View style={styles.divider} />

        <View style={styles.infoGrid}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Weight</Text>
            <Text style={styles.infoVal}>{state.profile.weight} kg</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Focus Goal</Text>
            <Text style={styles.infoVal}>{activeGoalLabel}</Text>
          </View>
        </View>
      </GlassCard>

      {/* Clinical Team & Visits Card Group */}
      <Text style={styles.sectionTitle}>Clinical Team & Visits</Text>
      <GlassCard style={styles.cardGroup}>
        {renderMenuRow('🩺', 'My Care Team', 'Active doctors, specialties, and clinics', () => router.push('/(screens)/my-doctors'))}
        <View style={styles.dividerLight} />
        {renderMenuRow('📅', 'Appointments Schedule', 'Upcoming doctor appointments and schedule reviews', () => router.push('/(screens)/appointments-schedule'))}
        <View style={styles.dividerLight} />
        {renderMenuRow('📄', 'Medical Vault', 'Expandable AI summaries of clinical documents', () => router.push('/(screens)/health-vault'))}
      </GlassCard>

      {/* Connection Card */}
      <Text style={[styles.sectionTitle, styles.topMargin]}>Connections & Integrations</Text>
      <GlassCard style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowIconBox}>
            <Text style={styles.rowIcon}>⌚</Text>
          </View>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Smartwatch Integration</Text>
            <Text style={styles.rowDesc}>{state.watchSynced ? 'Live Connected (Rest HR, Sleep, BP)' : 'Not Connected'}</Text>
          </View>
          <TouchableOpacity 
            style={[styles.toggleBtn, state.watchSynced ? styles.toggleActive : styles.toggleInactive]}
            onPress={state.watchSynced ? disconnectSmartwatch : syncSmartwatch}
          >
            <Text style={styles.toggleText}>{state.watchSynced ? 'Disconnect' : 'Connect'}</Text>
          </TouchableOpacity>
        </View>
      </GlassCard>

      {/* Settings Options Group */}
      <Text style={[styles.sectionTitle, styles.topMargin]}>Companion Settings</Text>
      <GlassCard style={styles.cardGroup}>
        {renderMenuRow('👤', 'Health Profile', 'Height, emergency contact, and medical indicators', () => router.push('/(screens)/my-health-profile'))}
        <View style={styles.dividerLight} />
        {renderMenuRow('🔌', 'Connected Devices', 'Manage wearable sensors, BP cuffs, and CGMs', () => router.push('/(screens)/connected-devices'))}
        <View style={styles.dividerLight} />
        {renderMenuRow('🔔', 'Reminders & Timing', 'Customize daily brief timing and quiet hours', () => router.push('/(screens)/notifications-timing'))}
        <View style={styles.dividerLight} />
        {renderMenuRow('🔒', 'Privacy & Safety', 'Configure data sharing preferences and account purges', () => router.push('/(screens)/privacy-safety'))}
      </GlassCard>

      {/* Testing Section */}
      <Text style={[styles.sectionTitle, styles.topMargin]}>Companion Reset (For Prototype Testing)</Text>
      <GlassCard style={styles.card}>
        <Text style={styles.resetDesc}>
          Want to test the other companion mode? Resetting the app returns you to the welcome onboarding, where you can select the opposite gender to test Sunidhi's menstrual phase advisor or Rahul's Metformin reminders!
        </Text>
        <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
          <Text style={styles.resetBtnText}>Reset Companion State</Text>
        </TouchableOpacity>
      </GlassCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 110,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#954921',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#87736a',
    lineHeight: 20,
    marginBottom: 24,
  },
  profileCard: {
    padding: 24,
    alignItems: 'center',
    marginBottom: 28,
  },
  avatarBig: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 16,
  },
  avatarBigText: {
    fontSize: 40,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#221a16',
    marginBottom: 4,
  },
  profileSub: {
    fontSize: 13,
    color: '#87736a',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(149, 73, 33, 0.15)',
    marginVertical: 20,
  },
  infoGrid: {
    flexDirection: 'row',
    width: '100%',
  },
  infoBox: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  infoLabel: {
    fontSize: 11,
    color: '#87736a',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  infoVal: {
    fontSize: 15,
    fontWeight: '600',
    color: '#221a16',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#221a16',
    marginBottom: 16,
    paddingLeft: 4,
  },
  topMargin: {
    marginTop: 28,
  },
  card: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rowIcon: {
    fontSize: 22,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#221a16',
  },
  rowDesc: {
    fontSize: 12,
    color: '#87736a',
  },
  toggleBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  toggleInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderColor: 'rgba(149, 73, 33, 0.25)',
  },
  toggleActive: {
    backgroundColor: 'rgba(186, 26, 26, 0.1)',
    borderColor: 'rgba(186, 26, 26, 0.25)',
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#954921',
  },
  resetDesc: {
    fontSize: 13,
    color: '#54433b',
    lineHeight: 18,
    marginBottom: 16,
  },
  resetBtn: {
    width: '100%',
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(186, 26, 26, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(186, 26, 26, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ba1a1a',
  },
  cardGroup: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 0,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  dividerLight: {
    height: 1,
    backgroundColor: 'rgba(149, 73, 33, 0.08)',
  },
  arrowIcon: {
    fontSize: 14,
    color: '#954921',
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },
});
