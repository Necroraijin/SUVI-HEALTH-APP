import { create } from 'zustand';

export interface VitalRecord {
  id: string;
  type: 'heart_rate' | 'blood_pressure' | 'weight' | 'sleep' | 'steps';
  value: string;
  unit: string;
  timestamp: string;
}

interface VitalsState {
  records: VitalRecord[];
  addRecord: (record: Omit<VitalRecord, 'id'>) => void;
}

export const useVitalsStore = create<VitalsState>((set) => ({
  records: [],
  addRecord: (record) => set((state) => ({
    records: [
      { ...record, id: Math.random().toString(36).substring(7) },
      ...state.records
    ]
  })),
}));
