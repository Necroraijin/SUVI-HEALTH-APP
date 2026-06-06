import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useSuvi } from '@/context/SuviStateContext';
import { OnboardingGoals } from '@/components/Onboarding/OnboardingGoals';

export default function GoalsScreen() {
  const router = useRouter();
  const { state } = useSuvi();
  const [localGoal, setLocalGoal] = useState<'medication' | 'fitness' | 'weight-loss' | 'weight-gain'>(
    state.profile.focusGoal
  );

  return (
    <OnboardingGoals
      currentGoal={localGoal}
      onSelect={setLocalGoal}
      onNext={() => router.push({ pathname: '/(onboarding)/profile', params: { goal: localGoal } })}
      onBack={() => router.back()}
    />
  );
}
