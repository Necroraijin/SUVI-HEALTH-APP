import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientBackground } from '../ui/GradientBackground';

interface OnboardingProfileProps {
  name: string;
  age: string;
  weight: string;
  gender: 'male' | 'female';
  onGenderSelect: (gender: 'male' | 'female') => void;
  onNameChange: (name: string) => void;
  onAgeChange: (age: string) => void;
  onWeightChange: (weight: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const OnboardingProfile: React.FC<OnboardingProfileProps> = ({
  name,
  age,
  weight,
  gender,
  onGenderSelect,
  onNameChange,
  onAgeChange,
  onWeightChange,
  onNext,
  onBack,
}) => {
  return (
    <GradientBackground>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Basic Profile</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.questionText}>Tell me about yourself.</Text>
            <Text style={styles.subtext}>
              Suvi will personalize your health logs, alerts, and conversational vocabulary based on your profile.
            </Text>

            <View style={styles.form}>
              {/* Gender Selector */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Biological Gender</Text>
                <View style={styles.genderContainer}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => onGenderSelect('male')}
                    style={[styles.genderCard, gender === 'male' && styles.selectedGender]}
                  >
                    <Text style={styles.genderIcon}>👨</Text>
                    <Text style={[styles.genderText, gender === 'male' && styles.selectedGenderText]}>
                      Male
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => onGenderSelect('female')}
                    style={[styles.genderCard, gender === 'female' && styles.selectedGender]}
                  >
                    <Text style={styles.genderIcon}>👩</Text>
                    <Text style={[styles.genderText, gender === 'female' && styles.selectedGenderText]}>
                      Female
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Name Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Preferred Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={onNameChange}
                  placeholder={gender === 'female' ? 'Sunidhi' : 'Rahul'}
                  placeholderTextColor="#87736a"
                />
              </View>

              <View style={styles.row}>
                {/* Age Input */}
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>Age (Years)</Text>
                  <TextInput
                    style={styles.input}
                    value={age}
                    onChangeText={onAgeChange}
                    keyboardType="numeric"
                    placeholder="28"
                    placeholderTextColor="#87736a"
                    maxLength={3}
                  />
                </View>

                {/* Weight Input */}
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>Weight (kg)</Text>
                  <TextInput
                    style={styles.input}
                    value={weight}
                    onChangeText={onWeightChange}
                    keyboardType="numeric"
                    placeholder="74"
                    placeholderTextColor="#87736a"
                    maxLength={3}
                  />
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.button} onPress={onNext} activeOpacity={0.8}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingBottom: 24,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  backButtonText: {
    fontSize: 20,
    color: '#954921',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#954921',
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  questionText: {
    fontSize: 26,
    fontWeight: '600',
    color: '#221a16',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 15,
    color: '#54433b',
    lineHeight: 22,
    marginBottom: 24,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#954921',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  genderCard: {
    flex: 1,
    flexDirection: 'row',
    height: 56,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  selectedGender: {
    backgroundColor: '#954921',
    borderColor: '#954921',
  },
  genderIcon: {
    fontSize: 20,
  },
  genderText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#221a16',
  },
  selectedGenderText: {
    color: '#ffffff',
  },
  input: {
    height: 56,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.55)',
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#221a16',
  },
  footer: {
    paddingHorizontal: 24,
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    backgroundColor: '#954921',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#954921',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
