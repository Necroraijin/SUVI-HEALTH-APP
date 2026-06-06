import { useRouter } from 'expo-router';
import { TodayTab } from '@/components/Tabs/TodayTab';

export default function TodayScreen() {
  const router = useRouter();

  const handleNavigateToTab = (index: number) => {
    const routes = ['/(tabs)', '/(tabs)/goals', '/(tabs)/suvi-chat', '/(tabs)/trackers', '/(tabs)/profile'] as const;
    if (routes[index]) {
      router.push(routes[index]);
    }
  };

  return <TodayTab onNavigateToTab={handleNavigateToTab} />;
}
