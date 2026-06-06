import { useRouter } from 'expo-router';
import { OnboardingWelcome } from '@/components/Onboarding/OnboardingWelcome';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <OnboardingWelcome
      onNext={() => router.push('/(onboarding)/goals')}
    />
  );
}
