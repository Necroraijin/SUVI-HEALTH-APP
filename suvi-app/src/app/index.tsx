import { Redirect } from 'expo-router';
import { useSuvi } from '@/context/SuviStateContext';

export default function Index() {
  const { state } = useSuvi();

  if (state.profile.isOnboarded) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(onboarding)/welcome" />;
}
