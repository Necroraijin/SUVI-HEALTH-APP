import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].primary,
        headerShown: true,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          borderTopColor: Colors[colorScheme ?? 'light'].border,
        },
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
        },
        headerTitleStyle: {
          color: Colors[colorScheme ?? 'light'].text,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <SymbolView name="house.fill" tintColor={color} fallback="home" />
          ),
        }}
      />
      <Tabs.Screen
        name="vitals"
        options={{
          title: 'Vitals',
          tabBarIcon: ({ color }) => (
            <SymbolView name="heart.text.square.fill" tintColor={color} fallback="heart" />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Suvi',
          tabBarIcon: ({ color }) => (
            <SymbolView name="message.fill" tintColor={color} fallback="chat" />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reports',
          tabBarIcon: ({ color }) => (
            <SymbolView name="doc.text.fill" tintColor={color} fallback="file" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <SymbolView name="person.crop.circle.fill" tintColor={color} fallback="user" />
          ),
        }}
      />
    </Tabs>
  );
}
