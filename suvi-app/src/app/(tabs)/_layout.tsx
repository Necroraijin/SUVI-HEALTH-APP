import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Tabs, usePathname } from 'expo-router';
import { GradientBackground } from '@/components/ui/GradientBackground';

interface TabIconProps {
  icon: string;
  label: string;
  focused: boolean;
}

function TabIcon({ icon, label, focused }: TabIconProps) {
  return (
    <View style={[styles.navItem, focused && styles.activeNavItem]}>
      <Text style={[styles.navIcon, focused && styles.activeNavIcon]}>{icon}</Text>
      <Text style={[styles.navLabel, focused && styles.activeNavLabel]}>{label}</Text>
    </View>
  );
}

function MicOrbIcon({ focused }: { focused: boolean }) {
  return (
    <View style={styles.micOrbShortcut}>
      <View style={styles.micOrbInner}>
        <Text style={styles.micOrbIcon}>🎙️</Text>
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <GradientBackground>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#954921',
          tabBarInactiveTintColor: '#87736a',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Today',
            tabBarIcon: ({ focused }) => (
              <TabIcon icon="🏠" label="Today" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="goals"
          options={{
            title: 'Goals',
            tabBarIcon: ({ focused }) => (
              <TabIcon icon="🎯" label="Goals" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="suvi-chat"
          options={{
            title: 'Suvi',
            tabBarIcon: ({ focused }) => <MicOrbIcon focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="trackers"
          options={{
            title: 'Trackers',
            tabBarIcon: ({ focused }) => (
              <TabIcon icon="📊" label="Trackers" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ focused }) => (
              <TabIcon icon="👤" label="Profile" focused={focused} />
            ),
          }}
        />
      </Tabs>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.48)',
    borderTopWidth: 0,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.65)',
    shadowColor: '#954921',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 10,
    paddingHorizontal: 4,
  },
  navItem: {
    justifyContent: 'center',
    alignItems: 'center',
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
    fontFamily: 'Lexend-SemiBold',
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
