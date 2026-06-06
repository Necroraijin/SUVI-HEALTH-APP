import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useSuvi, Doctor } from '@/context/SuviStateContext';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';

export default function MyDoctorsScreen() {
  const router = useRouter();
  const { state, addDoctor, removeDoctor } = useSuvi();

  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handleSave = () => {
    if (name.trim() === '' || specialty.trim() === '') return;

    addDoctor({
      name: name.trim(),
      specialty: specialty.trim(),
      phone: phone.trim() || '+91 99999 99999',
      email: email.trim() || 'info@clinic.com',
      nextAppointment: new Date(Date.now() + 30 * 86400000).toISOString(),
    });

    setName('');
    setSpecialty('');
    setPhone('');
    setEmail('');
    setIsAdding(false);
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <ScreenHeader 
          title="My Doctors" 
          onBack={() => router.back()}
          rightAction={
            <TouchableOpacity 
              style={styles.headerBtn}
              onPress={() => setIsAdding(!isAdding)}
            >
              <Text style={styles.headerBtnText}>{isAdding ? 'Cancel' : '+ Add'}</Text>
            </TouchableOpacity>
          }
        />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Add Doctor Form overlay */}
          {isAdding && (
            <GlassCard style={styles.formCard}>
              <Text style={styles.formTitle}>Add New Provider</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>DOCTOR NAME</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Dr. Rajesh Koothrappali"
                  placeholderTextColor="#87736a"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>SPECIALTY</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="E.g., Cardiologist, General Physician..."
                  placeholderTextColor="#87736a"
                  value={specialty}
                  onChangeText={setSpecialty}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>PHONE NUMBER</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="+91 XXXXX XXXXX"
                  placeholderTextColor="#87736a"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>EMAIL ADDRESS</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="doctor@health.com"
                  placeholderTextColor="#87736a"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <TouchableOpacity 
                style={[styles.saveBtn, (name.trim() === '' || specialty.trim() === '') && styles.saveBtnDisabled]}
                disabled={name.trim() === '' || specialty.trim() === ''}
                onPress={handleSave}
              >
                <Text style={styles.saveBtnText}>Save Provider</Text>
              </TouchableOpacity>
            </GlassCard>
          )}

          {/* List of Doctors */}
          <Text style={styles.sectionHeader}>Active Care Team</Text>
          {state.doctors.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🩺</Text>
              <Text style={styles.emptyText}>No doctors added yet.</Text>
            </View>
          ) : (
            <View style={styles.doctorsList}>
              {state.doctors.map((doc) => {
                const appDate = new Date(doc.nextAppointment);
                return (
                  <GlassCard key={doc.id} style={styles.docCard}>
                    <View style={styles.docHeader}>
                      <View style={styles.avatarBox}>
                        <Text style={styles.avatarText}>🩺</Text>
                      </View>
                      <View style={styles.docText}>
                        <Text style={styles.docName}>{doc.name}</Text>
                        <Text style={styles.docSpec}>{doc.specialty}</Text>
                      </View>
                      <TouchableOpacity 
                        style={styles.deleteBtn}
                        onPress={() => removeDoctor(doc.id)}
                      >
                        <Text style={styles.deleteText}>✕</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.metaRow}>
                      <Text style={styles.metaLabel}>Next Review:</Text>
                      <Text style={styles.metaValue}>
                        {appDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </Text>
                    </View>

                    <View style={styles.actionsRow}>
                      <TouchableOpacity 
                        style={styles.actionCall}
                        onPress={() => Linking.openURL(`tel:${doc.phone}`)}
                      >
                        <Text style={styles.actionCallText}>📞 Call Doctor</Text>
                      </TouchableOpacity>

                      <TouchableOpacity 
                        style={styles.actionEmail}
                        onPress={() => Linking.openURL(`mailto:${doc.email}`)}
                      >
                        <Text style={styles.actionEmailText}>✉️ Email</Text>
                      </TouchableOpacity>
                    </View>
                  </GlassCard>
                );
              })}
            </View>
          )}

        </ScrollView>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  headerBtnText: {
    fontSize: 12,
    fontFamily: 'Lexend-SemiBold',
    color: '#954921',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
  },
  formCard: {
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  formTitle: {
    fontSize: 16,
    fontFamily: 'Lexend-SemiBold',
    color: '#221a16',
    marginBottom: 4,
  },
  inputGroup: {
    gap: 6,
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
  saveBtn: {
    height: 48,
    borderRadius: 16,
    backgroundColor: '#954921',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnDisabled: {
    backgroundColor: 'rgba(149, 73, 33, 0.4)',
  },
  saveBtnText: {
    fontSize: 14,
    fontFamily: 'Lexend-SemiBold',
    color: '#ffffff',
  },
  sectionHeader: {
    fontSize: 12,
    fontFamily: 'Lexend-SemiBold',
    color: '#954921',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
    paddingLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyIcon: {
    fontSize: 48,
    opacity: 0.4,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Lexend',
    color: '#87736a',
  },
  doctorsList: {
    gap: 16,
  },
  docCard: {
    padding: 16,
  },
  docHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 157, 110, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 22,
  },
  docText: {
    flex: 1,
    gap: 2,
  },
  docName: {
    fontSize: 16,
    fontFamily: 'Lexend-SemiBold',
    color: '#221a16',
  },
  docSpec: {
    fontSize: 12,
    fontFamily: 'Lexend',
    color: '#87736a',
  },
  deleteBtn: {
    padding: 8,
  },
  deleteText: {
    fontSize: 16,
    color: '#ba1a1a',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(149, 73, 33, 0.08)',
    marginVertical: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  metaLabel: {
    fontSize: 13,
    fontFamily: 'Lexend-Medium',
    color: '#87736a',
  },
  metaValue: {
    fontSize: 13,
    fontFamily: 'Lexend-SemiBold',
    color: '#221a16',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionCall: {
    flex: 1.3,
    height: 40,
    backgroundColor: '#954921',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionCallText: {
    fontSize: 12,
    fontFamily: 'Lexend-SemiBold',
    color: '#ffffff',
  },
  actionEmail: {
    flex: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(149, 73, 33, 0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionEmailText: {
    fontSize: 12,
    fontFamily: 'Lexend-SemiBold',
    color: '#954921',
  },
});
