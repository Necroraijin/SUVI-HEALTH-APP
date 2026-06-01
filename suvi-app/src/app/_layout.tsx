import { Slot } from 'expo-router';
import { SuviStateProvider } from '@/context/SuviStateContext';

export default function RootLayout() {
  return (
    <SuviStateProvider>
      <Slot />
    </SuviStateProvider>
  );
}

