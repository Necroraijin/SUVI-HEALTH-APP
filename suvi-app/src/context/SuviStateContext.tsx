import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
export interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female';
  focusGoal: 'medication' | 'fitness' | 'weight-loss' | 'weight-gain';
  weight: number; // in kg
  isOnboarded: boolean;
}

export interface SmartwatchData {
  steps: number;
  stepsGoal: number;
  sleepHours: number;
  restingHeartRate: number;
  systolicBP: number;
  diastolicBP: number;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  timing: string[]; // e.g. ["9:00 AM", "9:00 PM"]
  takenToday: boolean[]; // tracks taken state for each timing
  totalDoses: number;
}

export interface BPLog {
  id: string;
  timestamp: string;
  systolic: number;
  diastolic: number;
}

export interface SuviState {
  profile: UserProfile;
  watchSynced: boolean;
  watchData: SmartwatchData;
  waterGlasses: number;
  waterGoal: number;
  menstrualCycleDay: number; // 1 to 28
  menstrualCycleStart: string; // date string
  bpLogs: BPLog[];
  medications: Medication[];
}

interface SuviContextType {
  state: SuviState;
  updateProfile: (changes: Partial<UserProfile>) => void;
  setOnboardingComplete: (profile: UserProfile) => void;
  syncSmartwatch: () => void;
  disconnectSmartwatch: () => void;
  logWater: (glasses: number) => void;
  toggleMedication: (medId: string, doseIndex: number) => void;
  addBPRecord: (systolic: number, diastolic: number) => void;
  updateCycleDay: (day: number) => void;
  getMenstrualPhase: () => {
    phase: string;
    phaseLabel: string;
    nutritionTip: string;
    exerciseTip: string;
  };
  getMorningBrief: () => string;
  resetAllData: () => void;
}

const DEFAULT_STATE: SuviState = {
  profile: {
    name: 'Rahul',
    age: 28,
    gender: 'male',
    focusGoal: 'medication',
    weight: 74,
    isOnboarded: false,
  },
  watchSynced: false,
  watchData: {
    steps: 2400,
    stepsGoal: 8000,
    sleepHours: 5.5,
    restingHeartRate: 78,
    systolicBP: 120,
    diastolicBP: 80,
  },
  waterGlasses: 3,
  waterGoal: 8,
  menstrualCycleDay: 12,
  menstrualCycleStart: new Date().toISOString(),
  bpLogs: [
    { id: '1', timestamp: new Date(Date.now() - 86400000).toLocaleString(), systolic: 122, diastolic: 82 },
    { id: '2', timestamp: new Date().toLocaleString(), systolic: 120, diastolic: 80 },
  ],
  medications: [
    { id: '1', name: 'Metformin', dosage: '500mg', timing: ['9:00 AM', '9:00 PM'], takenToday: [true, false], totalDoses: 2 },
    { id: '2', name: 'Metoprolol', dosage: '25mg', timing: ['8:00 AM'], takenToday: [false], totalDoses: 1 },
  ],
};

const SuviContext = createContext<SuviContextType | undefined>(undefined);

export const SuviStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SuviState>(DEFAULT_STATE);
  const [loading, setLoading] = useState(true);

  // Load state on start
  useEffect(() => {
    const loadState = async () => {
      try {
        const stored = await AsyncStorage.getItem('@suvi_health_state');
        if (stored) {
          setState(JSON.parse(stored));
        }
      } catch (err) {
        console.log('Error loading Suvi state:', err);
      } finally {
        setLoading(false);
      }
    };
    loadState();
  }, []);

  // Save state helper
  const saveState = async (newState: SuviState) => {
    setState(newState);
    try {
      await AsyncStorage.setItem('@suvi_health_state', JSON.stringify(newState));
    } catch (err) {
      console.log('Error saving Suvi state:', err);
    }
  };

  const updateProfile = (changes: Partial<UserProfile>) => {
    const newState = {
      ...state,
      profile: { ...state.profile, ...changes },
    };
    // Adjust defaults if gender switches
    if (changes.gender === 'female') {
      newState.profile.name = 'Sunidhi';
      newState.profile.focusGoal = 'fitness';
    } else if (changes.gender === 'male') {
      newState.profile.name = 'Rahul';
      newState.profile.focusGoal = 'medication';
    }
    saveState(newState);
  };

  const setOnboardingComplete = (profile: UserProfile) => {
    const newState = {
      ...state,
      profile: { ...profile, isOnboarded: true },
    };
    saveState(newState);
  };

  const syncSmartwatch = () => {
    const newState = {
      ...state,
      watchSynced: true,
      // Pull simulated smartwatch details
      watchData: {
        steps: 4200,
        stepsGoal: 8000,
        sleepHours: 5.8,
        restingHeartRate: 77,
        systolicBP: 118,
        diastolicBP: 78,
      },
    };
    saveState(newState);
  };

  const disconnectSmartwatch = () => {
    const newState = {
      ...state,
      watchSynced: false,
    };
    saveState(newState);
  };

  const logWater = (glasses: number) => {
    const newGlasses = Math.max(0, state.waterGlasses + glasses);
    const newState = {
      ...state,
      waterGlasses: newGlasses,
    };
    saveState(newState);
  };

  const toggleMedication = (medId: string, doseIndex: number) => {
    const updatedMeds = state.medications.map((med) => {
      if (med.id === medId) {
        const newTaken = [...med.takenToday];
        newTaken[doseIndex] = !newTaken[doseIndex];
        return { ...med, takenToday: newTaken };
      }
      return med;
    });
    const newState = {
      ...state,
      medications: updatedMeds,
    };
    saveState(newState);
  };

  const addBPRecord = (systolic: number, diastolic: number) => {
    const newRecord: BPLog = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
      systolic,
      diastolic,
    };
    const newState = {
      ...state,
      bpLogs: [newRecord, ...state.bpLogs].slice(0, 10), // keep last 10 entries
      watchData: {
        ...state.watchData,
        systolicBP: systolic,
        diastolicBP: diastolic,
      },
    };
    saveState(newState);
  };

  const updateCycleDay = (day: number) => {
    const dayClamped = Math.max(1, Math.min(28, day));
    const newState = {
      ...state,
      menstrualCycleDay: dayClamped,
    };
    saveState(newState);
  };

  // Menstrual cycle science advisor
  const getMenstrualPhase = () => {
    const day = state.menstrualCycleDay;
    if (day >= 1 && day <= 5) {
      return {
        phase: 'menstrual',
        phaseLabel: 'Menstrual Phase (Bleeding)',
        nutritionTip: 'Load up on iron-rich foods (spinach, lentils, dark chocolate), hydrate intensely, and favor warm herbal teas.',
        exerciseTip: 'Keep it light. Yoga, dynamic stretching, and short, gentle walks will support uterine recovery.',
      };
    } else if (day >= 6 && day <= 13) {
      return {
        phase: 'follicular',
        phaseLabel: 'Follicular Phase',
        nutritionTip: 'Estrogen is rising! Nourish your growing energy with complex carbohydrates, fermented foods, and fresh broccoli.',
        exerciseTip: 'Energy spike! Excellent time for strength training, higher-intensity cardio, and running.',
      };
    } else if (day === 14) {
      return {
        phase: 'ovulatory',
        phaseLabel: 'Ovulation (Peak Estrogen)',
        nutritionTip: 'Favor light, fiber-dense foods, fresh berries, and magnesium-rich nuts to support healthy metabolic clearance.',
        exerciseTip: 'Maximum strength. Today is perfect for personal records (PRs), HIIT sessions, or energetic dance workouts.',
      };
    } else {
      return {
        phase: 'luteal',
        phaseLabel: 'Luteal Phase (Recovery Focus)',
        nutritionTip: 'Progesterone is peaking. Support your higher metabolic rate with warm foods, root vegetables, avocados, and dark leafy greens.',
        exerciseTip: 'Focus on stamina and recovery. Lighter weights, pilates, hikes, and swimming match your body’s metabolic demands.',
      };
    }
  };

  // Morning proactive brief builder
  const getMorningBrief = () => {
    const { name, gender } = state.profile;
    const { sleepHours, restingHeartRate } = state.watchData;
    
    let brief = `Good morning, ${name}. `;
    
    // Recovery & sleep brief
    if (state.watchSynced) {
      brief += `You slept ${sleepHours} hours last night — slightly less than your goal. `;
      if (restingHeartRate > 75) {
        brief += `Your resting heart rate is slightly elevated at ${restingHeartRate} bpm. `;
      }
    } else {
      brief += `Your smart device isn't synced yet, but we've got a fantastic day planned. `;
    }

    // Custom gender brief (Female Cycle support vs. Male general compliance)
    if (gender === 'female') {
      const cycleInfo = getMenstrualPhase();
      brief += `Today is Day ${state.menstrualCycleDay} of your cycle (${cycleInfo.phaseLabel}). Since your body is in this phase, ${cycleInfo.exerciseTip.split('.')[0].toLowerCase()}. For nutrition, ${cycleInfo.nutritionTip.split('.')[0].toLowerCase()}.`;
    } else {
      brief += `Today is a key consistency day. You have 2 Metformin doses scheduled. Based on your fatigue, let's target a gentle 20-minute evening walk instead of intense cardio to protect your energy levels.`;
    }

    return brief;
  };

  const resetAllData = () => {
    saveState(DEFAULT_STATE);
  };

  if (loading) return null;

  return (
    <SuviContext.Provider
      value={{
        state,
        updateProfile,
        setOnboardingComplete,
        syncSmartwatch,
        disconnectSmartwatch,
        logWater,
        toggleMedication,
        addBPRecord,
        updateCycleDay,
        getMenstrualPhase,
        getMorningBrief,
        resetAllData,
      }}
    >
      {children}
    </SuviContext.Provider>
  );
};

export const useSuvi = () => {
  const context = useContext(SuviContext);
  if (!context) {
    throw new Error('useSuvi must be used within a SuviStateProvider');
  }
  return context;
};
