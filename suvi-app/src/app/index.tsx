import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useSuvi } from '@/context/SuviStateContext';

// Onboarding imports
import { OnboardingWelcome } from '@/components/Onboarding/OnboardingWelcome';
import { OnboardingGoals } from '@/components/Onboarding/OnboardingGoals';
import { OnboardingProfile } from '@/components/Onboarding/OnboardingProfile';
import { OnboardingMedical } from '@/components/Onboarding/OnboardingMedical';

// Tab imports
import { TodayTab } from '@/components/Tabs/TodayTab';
import { GoalsHubTab } from '@/components/Tabs/GoalsHubTab';
import { SuviChatTab } from '@/components/Tabs/SuviChatTab';
import { TrackersHubTab } from '@/components/Tabs/TrackersHubTab';
import { ProfileSettingsTab } from '@/components/Tabs/ProfileSettingsTab';

// UI imports
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassCard } from '@/components/ui/GlassCard';

export default function HomeScreen() {
  const { state, updateProfile, setOnboardingComplete, syncSmartwatch, disconnectSmartwatch } = useSuvi();
  
  // Onboarding local step: 0 = welcome, 1 = goals, 2 = profile, 3 = medical
  const [onboardingStep, setOnboardingStep] = useState(0);

  // Local form states (synced on changes or continues)
  const [localGender, setLocalGender] = useState<'male' | 'female'>('male');
  const [localName, setLocalName] = useState('Rahul');
  const [localAge, setLocalAge] = useState('28');
  const [localWeight, setLocalWeight] = useState('74');
  const [localGoal, setLocalGoal] = useState<'medication' | 'fitness' | 'weight-loss' | 'weight-gain'>('medication');

  // Sync profile when state defaults change
  useEffect(() => {
    setLocalGender(state.profile.gender);
    setLocalName(state.profile.name);
    setLocalAge(state.profile.age.toString());
    setLocalWeight(state.profile.weight.toString());
    setLocalGoal(state.profile.focusGoal);
  }, [state.profile.isOnboarded]);

  const handleGenderSelect = (gender: 'male' | 'female') => {
    setLocalGender(gender);
    // Auto-update default names to make testing the 2 modes instant and fun!
    if (gender === 'female') {
      setLocalName('Sunidhi');
      setLocalGoal('fitness');
    } else {
      setLocalName('Rahul');
      setLocalGoal('medication');
    }
  };

  const handleCompleteOnboarding = () => {
    const ageNum = parseInt(localAge) || 28;
    const weightNum = parseInt(localWeight) || 74;

    setOnboardingComplete({
      name: localName,
      age: ageNum,
      gender: localGender,
      focusGoal: localGoal,
      weight: weightNum,
      isOnboarded: true,
    });
  };

  // Main navigation tab index: 0 = Today, 1 = Goals, 2 = Suvi Chat, 3 = Trackers, 4 = Settings
  const [activeTab, setActiveTab] = useState(0);

  // --- 1. RENDER ONBOARDING FLOW ---
  if (!state.profile.isOnboarded) {
    if (onboardingStep === 0) {
      return <OnboardingWelcome onNext={() => setOnboardingStep(1)} />;
    }
    
    if (onboardingStep === 1) {
      return (
        <OnboardingGoals
          currentGoal={localGoal}
          onSelect={setLocalGoal}
          onNext={() => setOnboardingStep(2)}
          onBack={() => setOnboardingStep(0)}
        />
      );
    }
    
    if (onboardingStep === 2) {
      return (
        <OnboardingProfile
          name={localName}
          age={localAge}
          weight={localWeight}
          gender={localGender}
          onGenderSelect={handleGenderSelect}
          onNameChange={setLocalName}
          onAgeChange={setLocalAge}
          onWeightChange={setLocalWeight}
          onNext={() => setOnboardingStep(3)}
          onBack={() => setOnboardingStep(1)}
        />
      );
    }

    if (onboardingStep === 3) {
      return (
        <OnboardingMedical
          watchSynced={state.watchSynced}
          onSyncWatch={syncSmartwatch}
          onDisconnectWatch={disconnectSmartwatch}
          onComplete={handleCompleteOnboarding}
          onBack={() => setOnboardingStep(2)}
        />
      );
    }
  }

  // --- 2. RENDER MAIN TAB BED ---
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 0:
        return <TodayTab onNavigateToTab={setActiveTab} />;
      case 1:
        return <GoalsHubTab />;
      case 2:
        return <SuviChatTab />;
      case 3:
        return <TrackersHubTab />;
      case 4:
        return <ProfileSettingsTab />;
      default:
        return <TodayTab onNavigateToTab={setActiveTab} />;
    }
  };

  return (
    <GradientBackground>
      {/* Active Tab Screen */}
      <View style={styles.tabContent}>{renderActiveTabContent()}</View>

      {/* Premium Custom Floating Bottom Nav Bar */}
      <View style={styles.navBarWrapper}>
        <GlassCard style={styles.navBar}>
          <TouchableOpacity
            style={[styles.navItem, activeTab === 0 && styles.activeNavItem]}
            onPress={() => setActiveTab(0)}
            activeOpacity={0.8}
          >
            <Text style={[styles.navIcon, activeTab === 0 && styles.activeNavIcon]}>🏠</Text>
            <Text style={[styles.navLabel, activeTab === 0 && styles.activeNavLabel]}>Today</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, activeTab === 1 && styles.activeNavItem]}
            onPress={() => setActiveTab(1)}
            activeOpacity={0.8}
          >
            <Text style={[styles.navIcon, activeTab === 1 && styles.activeNavIcon]}>🎯</Text>
            <Text style={[styles.navLabel, activeTab === 1 && styles.activeNavLabel]}>Goals</Text>
          </TouchableOpacity>

          {/* Central Pulsing Mic Orb Shortcut */}
          <TouchableOpacity
            style={styles.micOrbShortcut}
            onPress={() => setActiveTab(2)}
            activeOpacity={0.8}
          >
            <View style={styles.micOrbInner}>
              <Text style={styles.micOrbIcon}>🎙️</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, activeTab === 3 && styles.activeNavItem]}
            onPress={() => setActiveTab(3)}
            activeOpacity={0.8}
          >
            <Text style={[styles.navIcon, activeTab === 3 && styles.activeNavIcon]}>📊</Text>
            <Text style={[styles.navLabel, activeTab === 3 && styles.activeNavLabel]}>Trackers</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, activeTab === 4 && styles.activeNavItem]}
            onPress={() => setActiveTab(4)}
            activeOpacity={0.8}
          >
            <Text style={[styles.navIcon, activeTab === 4 && styles.activeNavIcon]}>👤</Text>
            <Text style={[styles.navLabel, activeTab === 4 && styles.activeNavLabel]}>Profile</Text>
          </TouchableOpacity>
        </GlassCard>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
  },
  navBarWrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  navBar: {
    flexDirection: 'row',
    height: 72,
    borderRadius: 36,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.48)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.65)',
    // Elegant bottom shadows
    shadowColor: '#954921',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    gap: 2,
  },
  activeNavItem: {
    transform: [{ scale: 1.05 }],
  },
  navIcon: {
    fontSize: 20,
    opacity: 0.6,
  },
  activeNavIcon: {
    opacity: 1,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#87736a',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  activeNavLabel: {
    color: '#954921',
  },
  micOrbShortcut: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginTop: -28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff8f6',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#954921',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  micOrbInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ff9d6e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micOrbIcon: {
    fontSize: 22,
    color: '#ffffff',
  },
});
