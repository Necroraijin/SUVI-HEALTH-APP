import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Modal } from 'react-native';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useVitalsStore, VitalRecord } from '@/store/useVitalsStore';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function VitalsScreen() {
  const { records, addRecord } = useVitalsStore();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const [modalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState('heart_rate');
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState('bpm');

  const handleAdd = () => {
    if (!value) return;
    addRecord({
      type: type as VitalRecord['type'],
      value,
      unit,
      timestamp: new Date().toISOString(),
    });
    setValue('');
    setModalVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundSecondary }]}>
      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', color: theme.icon, marginTop: 40 }}>
            No vitals recorded yet.
          </Text>
        }
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View>
              <Text style={{ color: theme.text, fontSize: 16, textTransform: 'capitalize', fontWeight: '500' }}>
                {item.type.replace('_', ' ')}
              </Text>
              <Text style={{ color: theme.icon, fontSize: 12, marginTop: 4 }}>
                {new Date(item.timestamp).toLocaleString()}
              </Text>
            </View>
            <Text style={{ color: theme.primary, fontSize: 20, fontWeight: 'bold' }}>
              {item.value} {item.unit}
            </Text>
          </Card>
        )}
      />

      <View style={styles.footer}>
        <Button title="Log Vital Sign" onPress={() => setModalVisible(true)} />
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Add Vital Sign</Text>
            <Input
              label="Type (e.g., heart_rate, blood_pressure)"
              value={type}
              onChangeText={setType}
            />
            <Input
              label="Value"
              value={value}
              onChangeText={setValue}
              keyboardType="numeric"
            />
            <Input
              label="Unit (e.g., bpm, mmHg)"
              value={unit}
              onChangeText={setUnit}
            />
            <View style={styles.modalActions}>
              <Button title="Cancel" variant="outline" onPress={() => setModalVisible(false)} style={{ flex: 1, marginRight: 8 }} />
              <Button title="Save" onPress={handleAdd} style={{ flex: 1, marginLeft: 8 }} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'transparent',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: Platform.OS === 'ios' ? 24 : 0,
  }
});
