import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { OnboardingProfile } from '@/components/Onboarding/OnboardingProfile';

export default function ProfileScreen() {
  const router = useRouter();
  const { goal } = useLocalSearchParams<{ goal: string }>();

  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [name, setName] = useState('Rahul');
  const [age, setAge] = useState('28');
  const [weight, setWeight] = useState('74');

  const handleGenderSelect = (g: 'male' | 'female') => {
    setGender(g);
    if (g === 'female') {
      setName('Sunidhi');
    } else {
      setName('Rahul');
    }
  };

  return (
    <OnboardingProfile
      name={name}
      age={age}
      weight={weight}
      gender={gender}
      onGenderSelect={handleGenderSelect}
      onNameChange={setName}
      onAgeChange={setAge}
      onWeightChange={setWeight}
      onNext={() =>
        router.push({
          pathname: '/(onboarding)/permissions',
          params: { goal: goal || 'medication', name, age, weight, gender },
        })
      }
      onBack={() => router.back()}
    />
  );
}
