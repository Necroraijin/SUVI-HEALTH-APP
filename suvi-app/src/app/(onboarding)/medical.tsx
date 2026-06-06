import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSuvi } from '@/context/SuviStateContext';
import { OnboardingMedical } from '@/components/Onboarding/OnboardingMedical';

export default function MedicalScreen() {
  const router = useRouter();
  const { state, setOnboardingComplete, syncSmartwatch, disconnectSmartwatch } = useSuvi();
  const params = useLocalSearchParams<{
    goal: string;
    name: string;
    age: string;
    weight: string;
    gender: string;
    stepsGoal?: string;
    targetWeight?: string;
    dosageFrequency?: string;
  }>();

  const handleComplete = () => {
    const goalValue = (params.goal || 'medication') as 'medication' | 'fitness' | 'weight-loss' | 'weight-gain';
    const genderValue = (params.gender || 'male') as 'male' | 'female';

    setOnboardingComplete({
      name: params.name || 'Rahul',
      age: parseInt(params.age || '28') || 28,
      gender: genderValue,
      focusGoal: goalValue,
      weight: parseInt(params.weight || '74') || 74,
      height: 175,
      bloodType: '',
      allergies: [],
      emergencyContact: '',
      isOnboarded: true,
    }, {
      stepsGoal: params.stepsGoal ? parseInt(params.stepsGoal) : undefined,
      targetWeight: params.targetWeight ? parseFloat(params.targetWeight) : undefined,
      dosageFrequency: params.dosageFrequency ? parseInt(params.dosageFrequency) : undefined,
    });

    // The NavigationGuard in _layout.tsx will auto-redirect to (tabs)
  };

  return (
    <OnboardingMedical
      watchSynced={state.watchSynced}
      onSyncWatch={syncSmartwatch}
      onDisconnectWatch={disconnectSmartwatch}
      onComplete={handleComplete}
      onBack={() => router.back()}
    />
  );
}
