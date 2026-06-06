import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useSuvi } from '@/context/SuviStateContext';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';

export default function MyHealthProfileScreen() {
  const router = useRouter();
  const { state, updateProfile } = useSuvi();

  const [name, setName] = useState(state.profile.name);
  const [age, setAge] = useState(state.profile.age.toString());
  const [weight, setWeight] = useState(state.profile.weight.toString());
  const [height, setHeight] = useState(state.profile.height.toString());
  const [bloodType, setBloodType] = useState(state.profile.bloodType || 'B+');
  const [emergencyContact, setEmergencyContact] = useState(state.profile.emergencyContact || '');
  const [allergiesText, setAllergiesText] = useState(state.profile.allergies.join(', ') || 'None');
  
  const [saveStatus, setSaveStatus] = useState('');

  const handleSave = () => {
    const ageVal = parseInt(age);
    const weightVal = parseFloat(weight);
    const heightVal = parseFloat(height);

    updateProfile({
      name: name.trim(),
      age: isNaN(ageVal) ? state.profile.age : ageVal,
      weight: isNaN(weightVal) ? state.profile.weight : weightVal,
      height: isNaN(heightVal) ? state.profile.height : heightVal,
      bloodType: bloodType.trim(),
      emergencyContact: emergencyContact.trim(),
      allergies: allergiesText.split(',').map(s => s.trim()).filter(s => s !== '' && s.toLowerCase() !== 'none'),
    });

    setSaveStatus('🟢 Profile updated successfully!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <ScreenHeader title="Health Profile" onBack={() => router.back()} />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <GlassCard style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>FULL NAME</Text>
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>AGE (YRS)</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  value={age}
                  onChangeText={setAge}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>BLOOD TYPE</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. O+, B-"
                  placeholderTextColor="#87736a"
                  value={bloodType}
                  onChangeText={setBloodType}
                />
              </View>
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>HEIGHT (CM)</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  value={height}
                  onChangeText={setHeight}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>WEIGHT (KG)</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  value={weight}
                  onChangeText={setWeight}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>ALLERGIES (COMMA SEPARATED)</Text>
              <TextInput
                style={styles.textInput}
                value={allergiesText}
                onChangeText={setAllergiesText}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>EMERGENCY CONTACT NUMBER</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="phone-pad"
                placeholder="+91 99999 99999"
                placeholderTextColor="#87736a"
                value={emergencyContact}
                onChangeText={setEmergencyContact}
              />
            </View>
          </GlassCard>

          {saveStatus !== '' && <Text style={styles.statusText}>{saveStatus}</Text>}

          <TouchableOpacity 
            style={styles.saveBtn}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text style={styles.saveBtnText}>Save Profile Data</Text>
          </TouchableOpacity>

        </ScrollView>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
  },
  formCard: {
    padding: 20,
    gap: 16,
    marginBottom: 24,
  },
  inputGroup: {
    gap: 6,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 16,
  },
  label: {
    fontSize: 10,
    fontFamily: 'Lexend-SemiBold',
    color: '#87736a',
    letterSpacing: 0.5,
  },
  textInput: {
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: 'Lexend',
    color: '#221a16',
  },
  statusText: {
    fontSize: 13,
    color: '#00696f',
    textAlign: 'center',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  saveBtn: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    backgroundColor: '#954921',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#954921',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  saveBtnText: {
    fontSize: 16,
    fontFamily: 'Lexend-SemiBold',
    color: '#ffffff',
  },
});
