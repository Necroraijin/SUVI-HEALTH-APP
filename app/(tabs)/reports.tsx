import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function ReportsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.backgroundSecondary }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Health Reports</Text>
        <Text style={{ color: theme.icon, marginTop: 4 }}>
          Upload your blood tests, MRI scans, or other health documents for Suvi to analyze.
        </Text>
      </View>

      <View style={styles.uploadSection}>
        <Card style={styles.uploadCard}>
          <Text style={{ fontSize: 40, marginBottom: 12 }}>📄</Text>
          <Text style={[styles.uploadText, { color: theme.text }]}>Tap to Upload Document</Text>
          <Text style={{ color: theme.icon, fontSize: 12, marginTop: 4 }}>Supports PDF, JPG, PNG</Text>
        </Card>
      </View>

      <View style={styles.listSection}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Reports</Text>
        <Card style={styles.reportCard}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: theme.text, fontWeight: '600' }}>Annual Blood Work.pdf</Text>
            <Text style={{ color: theme.icon, fontSize: 12, marginTop: 4 }}>Uploaded 2 days ago</Text>
          </View>
          <Button title="View" variant="outline" />
        </Card>
        <Card style={styles.reportCard}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: theme.text, fontWeight: '600' }}>Lipid Panel.pdf</Text>
            <Text style={{ color: theme.icon, fontSize: 12, marginTop: 4 }}>Uploaded 1 week ago</Text>
          </View>
          <Button title="View" variant="outline" />
        </Card>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  uploadSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  uploadCard: {
    alignItems: 'center',
    paddingVertical: 32,
    borderStyle: 'dashed',
    borderWidth: 2,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '500',
  },
  listSection: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  reportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  }
});
