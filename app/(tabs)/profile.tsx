import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useUserStore } from '@/store/useUserStore';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function ProfileScreen() {
  const { profile, logout } = useUserStore();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.backgroundSecondary }]}>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
          <Text style={styles.avatarText}>{profile?.name?.charAt(0) || 'U'}</Text>
        </View>
        <Text style={[styles.name, { color: theme.text }]}>{profile?.name || 'Guest User'}</Text>
        <Text style={{ color: theme.icon }}>{profile?.email || 'guest@example.com'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Health Profile</Text>
        <Card style={styles.cardSpacing}>
          <View style={styles.row}>
            <Text style={{ color: theme.text }}>Age</Text>
            <Text style={{ color: theme.icon }}>{profile?.age || '28'} years</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={{ color: theme.text }}>Height</Text>
            <Text style={{ color: theme.icon }}>{profile?.height || '175'} cm</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={{ color: theme.text }}>Weight</Text>
            <Text style={{ color: theme.icon }}>{profile?.weight || '70'} kg</Text>
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>App Settings</Text>
        <Card style={styles.cardSpacing}>
          <View style={styles.row}>
            <Text style={{ color: theme.text }}>Push Notifications</Text>
            <Switch value={true} trackColor={{ true: theme.primary }} />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={{ color: theme.text }}>Dark Mode</Text>
            <Switch value={colorScheme === 'dark'} trackColor={{ true: theme.primary }} />
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <Button title="Log Out" variant="outline" onPress={logout} style={{ marginTop: 16 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    color: '#FFF',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    paddingLeft: 4,
  },
  cardSpacing: {
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  }
});
