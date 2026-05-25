import { create } from 'zustand';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  age?: number;
  height?: number; // cm
  weight?: number; // kg
}

interface UserState {
  profile: UserProfile | null;
  isAuthenticated: boolean;
  setProfile: (profile: UserProfile) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  isAuthenticated: false,
  setProfile: (profile) => set({ profile, isAuthenticated: true }),
  logout: () => set({ profile: null, isAuthenticated: false }),
}));
