import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Types ─────────────────────────────────────────────────────

export interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female';
  focusGoal: 'medication' | 'fitness' | 'weight-loss' | 'weight-gain';
  weight: number;
  height: number;
  bloodType: string;
  allergies: string[];
  emergencyContact: string;
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
  timing: string[];
  takenToday: boolean[];
  totalDoses: number;
  purpose: string;
  sideEffects: string[];
  interactions: string[];
  refillDate: string;
}

export interface BPLog {
  id: string;
  timestamp: string;
  systolic: number;
  diastolic: number;
}

export interface GlucoseLog {
  id: string;
  timestamp: string;
  value: number;
  mealTag: 'fasting' | 'post-meal' | 'random';
}

export interface SymptomLog {
  id: string;
  timestamp: string;
  symptoms: string[];
  severity: number;
  duration: 'started-today' | 'ongoing';
  energy: 'low' | 'medium' | 'high';
  notes: string;
}

export interface ScannedDocument {
  id: string;
  timestamp: string;
  title: string;
  category: 'lab-report' | 'prescription' | 'imaging' | 'visit-notes';
  summary: string;
  extractedMeds: string[];
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  email: string;
  nextAppointment: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  location: string;
  notes: string;
  completed: boolean;
}

export interface WeightLog {
  id: string;
  timestamp: string;
  weight: number;
}

export interface SuviState {
  profile: UserProfile;
  watchSynced: boolean;
  watchData: SmartwatchData;
  waterGlasses: number;
  waterGoal: number;
  menstrualCycleDay: number;
  menstrualCycleStart: string;
  bpLogs: BPLog[];
  glucoseLogs: GlucoseLog[];
  medications: Medication[];
  symptoms: SymptomLog[];
  documents: ScannedDocument[];
  doctors: Doctor[];
  appointments: Appointment[];
  weightLogs: WeightLog[];
  activeTrackers: string[];
  notificationPrefs: {
    medicationReminders: boolean;
    dailyBriefTime: string;
    symptomCheckins: boolean;
    appointmentAlerts: boolean;
    quietHoursStart: string;
    quietHoursEnd: string;
  };
}

interface SuviContextType {
  state: SuviState;
  updateProfile: (changes: Partial<UserProfile>) => void;
  setOnboardingComplete: (profile: UserProfile, extraGoals?: { stepsGoal?: number; targetWeight?: number; dosageFrequency?: number }) => void;
  syncSmartwatch: () => void;
  disconnectSmartwatch: () => void;
  logWater: (glasses: number) => void;
  toggleMedication: (medId: string, doseIndex: number) => void;
  addMedication: (med: Omit<Medication, 'id'>) => void;
  removeMedication: (medId: string) => void;
  addBPRecord: (systolic: number, diastolic: number) => void;
  addGlucoseRecord: (value: number, mealTag: GlucoseLog['mealTag']) => void;
  updateCycleDay: (day: number) => void;
  logSymptom: (symptom: Omit<SymptomLog, 'id' | 'timestamp'>) => void;
  addDocument: (doc: Omit<ScannedDocument, 'id' | 'timestamp'>) => void;
  removeDocument: (docId: string) => void;
  addDoctor: (doc: Omit<Doctor, 'id'>) => void;
  removeDoctor: (docId: string) => void;
  addAppointment: (apt: Omit<Appointment, 'id'>) => void;
  logWeight: (weight: number) => void;
  toggleTracker: (trackerId: string) => void;
  updateNotificationPrefs: (prefs: Partial<SuviState['notificationPrefs']>) => void;
  getMenstrualPhase: () => {
    phase: string;
    phaseLabel: string;
    nutritionTip: string;
    exerciseTip: string;
  };
  getMorningBrief: () => string;
  getSymptomPatterns: () => { pattern: string; correlation: string }[];
  generatePreAppointmentReport: (appointmentId: string) => string;
  resetAllData: () => void;
}

// ─── Default State ─────────────────────────────────────────────

const DEFAULT_STATE: SuviState = {
  profile: {
    name: 'Rahul',
    age: 28,
    gender: 'male',
    focusGoal: 'medication',
    weight: 74,
    height: 175,
    bloodType: 'B+',
    allergies: [],
    emergencyContact: '',
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
  glucoseLogs: [
    { id: '1', timestamp: new Date(Date.now() - 86400000).toLocaleString(), value: 105, mealTag: 'fasting' },
    { id: '2', timestamp: new Date().toLocaleString(), value: 142, mealTag: 'post-meal' },
  ],
  medications: [
    {
      id: '1', name: 'Metformin', dosage: '500mg', timing: ['9:00 AM', '9:00 PM'],
      takenToday: [true, false], totalDoses: 2,
      purpose: 'Blood sugar regulation for Type 2 Diabetes',
      sideEffects: ['Nausea', 'Stomach upset', 'Metallic taste'],
      interactions: ['Avoid excessive alcohol', 'Take with food'],
      refillDate: new Date(Date.now() + 14 * 86400000).toISOString(),
    },
    {
      id: '2', name: 'Metoprolol', dosage: '25mg', timing: ['8:00 AM'],
      takenToday: [false], totalDoses: 1,
      purpose: 'Heart rate control and blood pressure management',
      sideEffects: ['Dizziness', 'Fatigue', 'Cold extremities'],
      interactions: ['Do not stop suddenly', 'Avoid grapefruit'],
      refillDate: new Date(Date.now() + 4 * 86400000).toISOString(),
    },
  ],
  symptoms: [
    {
      id: '1', timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
      symptoms: ['Headache', 'Fatigue'], severity: 4,
      duration: 'started-today', energy: 'low',
      notes: 'Felt tired after skipping lunch',
    },
  ],
  documents: [
    {
      id: '1', timestamp: new Date().toISOString(),
      title: 'Comprehensive Lipid Panel', category: 'lab-report',
      summary: 'All values normal. LDL decreased by 12% since last check.',
      extractedMeds: [],
    },
    {
      id: '2', timestamp: new Date(Date.now() - 30 * 86400000).toISOString(),
      title: 'Prescription — Metformin 500mg', category: 'prescription',
      summary: 'Active prescription. Twice daily dosing with meals.',
      extractedMeds: ['Metformin 500mg'],
    },
    {
      id: '3', timestamp: new Date(Date.now() - 60 * 86400000).toISOString(),
      title: 'Chest X-Ray (PA/LAT)', category: 'imaging',
      summary: 'Clear lungs. No acute cardiopulmonary disease detected.',
      extractedMeds: [],
    },
    {
      id: '4', timestamp: new Date(Date.now() - 90 * 86400000).toISOString(),
      title: 'Complete Blood Count (CBC)', category: 'lab-report',
      summary: 'Mild anemia indicated. Discuss dietary changes with provider.',
      extractedMeds: [],
    },
  ],
  doctors: [
    {
      id: '1', name: 'Dr. Sanjay Verma', specialty: 'Cardiologist',
      phone: '+91 98765 43210', email: 'dr.verma@healthclinic.in',
      nextAppointment: new Date(Date.now() + 7 * 86400000).toISOString(),
    },
    {
      id: '2', name: 'Dr. Priya Sharma', specialty: 'Endocrinologist',
      phone: '+91 98765 43211', email: 'dr.sharma@healthclinic.in',
      nextAppointment: new Date(Date.now() + 14 * 86400000).toISOString(),
    },
  ],
  appointments: [
    {
      id: '1', doctorId: '1', doctorName: 'Dr. Sanjay Verma',
      date: new Date(Date.now() + 7 * 86400000).toLocaleDateString(),
      time: '10:30 AM', location: 'Heart Care Clinic, Sector 18',
      notes: 'Follow-up on BP medication', completed: false,
    },
    {
      id: '2', doctorId: '2', doctorName: 'Dr. Priya Sharma',
      date: new Date(Date.now() + 14 * 86400000).toLocaleDateString(),
      time: '2:00 PM', location: 'Diabetes Center, MG Road',
      notes: 'Quarterly HbA1c review', completed: false,
    },
  ],
  weightLogs: [
    { id: '1', timestamp: new Date(Date.now() - 7 * 86400000).toISOString(), weight: 75 },
    { id: '2', timestamp: new Date(Date.now() - 3 * 86400000).toISOString(), weight: 74.5 },
    { id: '3', timestamp: new Date().toISOString(), weight: 74 },
  ],
  activeTrackers: ['water', 'bp', 'cycle', 'glucose', 'weight', 'steps', 'sleep', 'heart-rate'],
  notificationPrefs: {
    medicationReminders: true,
    dailyBriefTime: '7:00 AM',
    symptomCheckins: true,
    appointmentAlerts: true,
    quietHoursStart: '10:00 PM',
    quietHoursEnd: '7:00 AM',
  },
};

// ─── Context ───────────────────────────────────────────────────

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
          // Merge stored with defaults so new fields get defaults
          const parsed = JSON.parse(stored);
          setState({ ...DEFAULT_STATE, ...parsed, profile: { ...DEFAULT_STATE.profile, ...parsed.profile } });
        }
      } catch (err) {
        console.log('Error loading Suvi state:', err);
      } finally {
        setLoading(false);
      }
    };
    loadState();
  }, []);

  const saveState = async (newState: SuviState) => {
    setState(newState);
    try {
      await AsyncStorage.setItem('@suvi_health_state', JSON.stringify(newState));
    } catch (err) {
      console.log('Error saving Suvi state:', err);
    }
  };

  // ─── Profile ──────────────────────────────────────────────

  const updateProfile = (changes: Partial<UserProfile>) => {
    const newState = {
      ...state,
      profile: { ...state.profile, ...changes },
    };
    if (changes.gender === 'female') {
      newState.profile.name = 'Sunidhi';
      newState.profile.focusGoal = 'fitness';
    } else if (changes.gender === 'male') {
      newState.profile.name = 'Rahul';
      newState.profile.focusGoal = 'medication';
    }
    saveState(newState);
  };

  const setOnboardingComplete = (
    profile: UserProfile,
    extraGoals?: { stepsGoal?: number; targetWeight?: number; dosageFrequency?: number }
  ) => {
    const newState = {
      ...state,
      profile: { ...DEFAULT_STATE.profile, ...profile, isOnboarded: true },
    };
    if (extraGoals?.stepsGoal) {
      newState.watchData.stepsGoal = extraGoals.stepsGoal;
    }
    if (extraGoals?.targetWeight) {
      newState.profile.weight = profile.weight;
      newState.weightLogs = [
        { id: 'initial', timestamp: new Date().toISOString(), weight: profile.weight },
        ...newState.weightLogs
      ];
    }
    if (extraGoals?.dosageFrequency && profile.focusGoal === 'medication') {
      if (extraGoals.dosageFrequency === 1) {
        newState.medications[0].timing = ['09:00 AM'];
        newState.medications[0].takenToday = [false];
        newState.medications[0].totalDoses = 1;
      } else if (extraGoals.dosageFrequency === 3) {
        newState.medications[0].timing = ['09:00 AM', '02:00 PM', '09:00 PM'];
        newState.medications[0].takenToday = [false, false, false];
        newState.medications[0].totalDoses = 3;
      }
    }
    saveState(newState);
  };

  // ─── Smartwatch ───────────────────────────────────────────

  const syncSmartwatch = () => {
    saveState({
      ...state,
      watchSynced: true,
      watchData: {
        steps: 4200, stepsGoal: 8000, sleepHours: 5.8,
        restingHeartRate: 77, systolicBP: 118, diastolicBP: 78,
      },
    });
  };

  const disconnectSmartwatch = () => {
    saveState({ ...state, watchSynced: false });
  };

  // ─── Water ────────────────────────────────────────────────

  const logWater = (glasses: number) => {
    saveState({ ...state, waterGlasses: Math.max(0, state.waterGlasses + glasses) });
  };

  // ─── Medications ──────────────────────────────────────────

  const toggleMedication = (medId: string, doseIndex: number) => {
    const updatedMeds = state.medications.map((med) => {
      if (med.id === medId) {
        const newTaken = [...med.takenToday];
        newTaken[doseIndex] = !newTaken[doseIndex];
        return { ...med, takenToday: newTaken };
      }
      return med;
    });
    saveState({ ...state, medications: updatedMeds });
  };

  const addMedication = (med: Omit<Medication, 'id'>) => {
    const newMed = { ...med, id: Date.now().toString() };
    saveState({ ...state, medications: [...state.medications, newMed] });
  };

  const removeMedication = (medId: string) => {
    saveState({ ...state, medications: state.medications.filter(m => m.id !== medId) });
  };

  // ─── Blood Pressure ──────────────────────────────────────

  const addBPRecord = (systolic: number, diastolic: number) => {
    const newRecord: BPLog = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
      systolic, diastolic,
    };
    saveState({
      ...state,
      bpLogs: [newRecord, ...state.bpLogs].slice(0, 20),
      watchData: { ...state.watchData, systolicBP: systolic, diastolicBP: diastolic },
    });
  };

  // ─── Glucose ──────────────────────────────────────────────

  const addGlucoseRecord = (value: number, mealTag: GlucoseLog['mealTag']) => {
    const newRecord: GlucoseLog = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
      value, mealTag,
    };
    saveState({ ...state, glucoseLogs: [newRecord, ...state.glucoseLogs].slice(0, 20) });
  };

  // ─── Menstrual Cycle ──────────────────────────────────────

  const updateCycleDay = (day: number) => {
    saveState({ ...state, menstrualCycleDay: Math.max(1, Math.min(28, day)) });
  };

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
        exerciseTip: 'Focus on stamina and recovery. Lighter weights, pilates, hikes, and swimming match your body\'s metabolic demands.',
      };
    }
  };

  // ─── Symptoms ─────────────────────────────────────────────

  const logSymptom = (symptom: Omit<SymptomLog, 'id' | 'timestamp'>) => {
    const newLog: SymptomLog = {
      ...symptom,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    saveState({ ...state, symptoms: [newLog, ...state.symptoms].slice(0, 50) });
  };

  const getSymptomPatterns = () => {
    // Mock pattern analysis based on logged symptoms
    const patterns: { pattern: string; correlation: string }[] = [];
    const headacheCount = state.symptoms.filter(s => s.symptoms.includes('Headache')).length;
    const fatigueCount = state.symptoms.filter(s => s.symptoms.includes('Fatigue')).length;

    if (headacheCount >= 2) {
      patterns.push({
        pattern: `Headache reported ${headacheCount} times recently`,
        correlation: 'May correlate with low sleep hours (avg 5.5 hrs) or Metoprolol side effects',
      });
    }
    if (fatigueCount >= 1) {
      patterns.push({
        pattern: `Fatigue reported ${fatigueCount} time(s)`,
        correlation: 'Often occurs on days with less than 6 hours of sleep or post-lunch energy dips',
      });
    }
    if (patterns.length === 0) {
      patterns.push({
        pattern: 'No significant patterns detected yet',
        correlation: 'Continue logging symptoms to discover correlations with medications, sleep, and activity',
      });
    }
    return patterns;
  };

  // ─── Documents ────────────────────────────────────────────

  const addDocument = (doc: Omit<ScannedDocument, 'id' | 'timestamp'>) => {
    const newDoc: ScannedDocument = {
      ...doc,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    saveState({ ...state, documents: [newDoc, ...state.documents] });
  };

  const removeDocument = (docId: string) => {
    saveState({ ...state, documents: state.documents.filter(d => d.id !== docId) });
  };

  // ─── Doctors & Appointments ───────────────────────────────

  const addDoctor = (doc: Omit<Doctor, 'id'>) => {
    const newDoc = { ...doc, id: Date.now().toString() };
    saveState({ ...state, doctors: [...state.doctors, newDoc] });
  };

  const removeDoctor = (docId: string) => {
    saveState({ ...state, doctors: state.doctors.filter(d => d.id !== docId) });
  };

  const addAppointment = (apt: Omit<Appointment, 'id'>) => {
    const newApt = { ...apt, id: Date.now().toString() };
    saveState({ ...state, appointments: [...state.appointments, newApt] });
  };

  // ─── Weight ───────────────────────────────────────────────

  const logWeight = (weight: number) => {
    const newLog: WeightLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      weight,
    };
    saveState({
      ...state,
      weightLogs: [newLog, ...state.weightLogs].slice(0, 30),
      profile: { ...state.profile, weight },
    });
  };

  // ─── Trackers ─────────────────────────────────────────────

  const toggleTracker = (trackerId: string) => {
    const active = state.activeTrackers.includes(trackerId)
      ? state.activeTrackers.filter(t => t !== trackerId)
      : [...state.activeTrackers, trackerId];
    saveState({ ...state, activeTrackers: active });
  };

  // ─── Notifications ────────────────────────────────────────

  const updateNotificationPrefs = (prefs: Partial<SuviState['notificationPrefs']>) => {
    saveState({
      ...state,
      notificationPrefs: { ...state.notificationPrefs, ...prefs },
    });
  };

  // ─── Morning Brief ────────────────────────────────────────

  const getMorningBrief = () => {
    const { name, gender } = state.profile;
    const { sleepHours, restingHeartRate } = state.watchData;

    let brief = `Good morning, ${name}. `;

    if (state.watchSynced) {
      brief += `You slept ${sleepHours} hours last night — slightly less than your goal. `;
      if (restingHeartRate > 75) {
        brief += `Your resting heart rate is slightly elevated at ${restingHeartRate} bpm. `;
      }
    } else {
      brief += `Your smart device isn't synced yet, but we've got a fantastic day planned. `;
    }

    if (gender === 'female') {
      const cycleInfo = getMenstrualPhase();
      brief += `Today is Day ${state.menstrualCycleDay} of your cycle (${cycleInfo.phaseLabel}). Since your body is in this phase, ${cycleInfo.exerciseTip.split('.')[0].toLowerCase()}. For nutrition, ${cycleInfo.nutritionTip.split('.')[0].toLowerCase()}.`;
    } else {
      brief += `Today is a key consistency day. You have 2 Metformin doses scheduled. Based on your fatigue, let's target a gentle 20-minute evening walk instead of intense cardio to protect your energy levels.`;
    }

    return brief;
  };

  // ─── Pre-Appointment Report ───────────────────────────────

  const generatePreAppointmentReport = (appointmentId: string) => {
    const apt = state.appointments.find(a => a.id === appointmentId);
    if (!apt) return 'No appointment found.';

    const latestBP = state.bpLogs[0];
    const latestGlucose = state.glucoseLogs[0];
    const recentSymptoms = state.symptoms.slice(0, 3);
    const medSummary = state.medications.map(m =>
      `${m.name} ${m.dosage} — ${m.timing.join(', ')}`
    ).join('\n');

    let report = `📋 Pre-Appointment Summary for ${apt.doctorName}\n`;
    report += `Date: ${apt.date} at ${apt.time}\n\n`;
    report += `── Current Vitals ──\n`;
    if (latestBP) report += `Blood Pressure: ${latestBP.systolic}/${latestBP.diastolic} mmHg\n`;
    if (latestGlucose) report += `Blood Glucose: ${latestGlucose.value} mg/dL (${latestGlucose.mealTag})\n`;
    report += `Resting Heart Rate: ${state.watchData.restingHeartRate} bpm\n`;
    report += `Weight: ${state.profile.weight} kg\n\n`;
    report += `── Current Medications ──\n${medSummary}\n\n`;
    if (recentSymptoms.length > 0) {
      report += `── Recent Symptoms ──\n`;
      recentSymptoms.forEach(s => {
        report += `• ${s.symptoms.join(', ')} (Severity: ${s.severity}/10)\n`;
      });
    }
    return report;
  };

  // ─── Reset ────────────────────────────────────────────────

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
        addMedication,
        removeMedication,
        addBPRecord,
        addGlucoseRecord,
        updateCycleDay,
        logSymptom,
        addDocument,
        removeDocument,
        addDoctor,
        removeDoctor,
        addAppointment,
        logWeight,
        toggleTracker,
        updateNotificationPrefs,
        getMenstrualPhase,
        getMorningBrief,
        getSymptomPatterns,
        generatePreAppointmentReport,
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
