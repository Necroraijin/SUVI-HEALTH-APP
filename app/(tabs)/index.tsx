import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useUserStore } from '@/store/useUserStore';
import { useVitalsStore } from '@/store/useVitalsStore';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function HomeScreen() {
  const { profile } = useUserStore();
  const { records } = useVitalsStore();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const userName = profile?.name || 'Guest';

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.backgroundSecondary }]}>
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: theme.text }]}>Hello, {userName}</Text>
        <Text style={styles.subGreeting}>Here is your daily wellness summary.</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>AI Suggestions</Text>
        <Card>
          <Text style={[styles.aiText, { color: theme.text }]}>
            "Suvi: Based on your recent heart rate data, you've been doing great! Make sure to drink at least 2 liters of water today and take your Vitamin D supplement after lunch."
          </Text>
          <Button title="Chat with Suvi" variant="outline" style={{ marginTop: 12 }} />
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Daily Goals</Text>
        <Card>
          <View style={styles.goalRow}>
            <Text style={{ color: theme.text, fontSize: 16 }}>💧 Water Intake</Text>
            <Text style={{ color: theme.secondary, fontWeight: 'bold' }}>1.2L / 2L</Text>
          </View>
          <View style={[styles.goalRow, { marginTop: 12 }]}>
            <Text style={{ color: theme.text, fontSize: 16 }}>🚶‍♂️ Steps</Text>
            <Text style={{ color: theme.secondary, fontWeight: 'bold' }}>4,500 / 8,000</Text>
          </View>
          <View style={[styles.goalRow, { marginTop: 12 }]}>
            <Text style={{ color: theme.text, fontSize: 16 }}>💊 Medication (Lisinopril)</Text>
            <Text style={{ color: theme.text }}>Taken ✅</Text>
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Vitals</Text>
        {records.length === 0 ? (
          <Text style={{ color: theme.icon, fontStyle: 'italic' }}>No recent vitals logged.</Text>
        ) : (
          records.slice(0, 3).map((record) => (
            <Card key={record.id} style={styles.vitalCard}>
              <Text style={{ color: theme.text, textTransform: 'capitalize' }}>
                {record.type.replace('_', ' ')}
              </Text>
              <Text style={{ color: theme.primary, fontWeight: 'bold', fontSize: 18 }}>
                {record.value} {record.unit}
              </Text>
            </Card>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 48,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subGreeting: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  aiText: {
    fontSize: 16,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vitalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  }
});
