import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

interface User {
  nombre: string;
  correoUniversitario: string;
  telefono?: string;
  intereses?: string[];
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,

      setUser: (user) => set({ user }),

      fetchUser: async () => {
        set({ isLoading: true });
        try {
          const res = await api.get('/me');
          set({ user: res.data?.user ?? null, isLoading: false });
        } catch (error) {
          set({ user: null, isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await api.post('/logout');
          set({ user: null, isLoading: false });
        } catch (error) {
          console.error('Logout failed', error);
          set({ user: null, isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);