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
        try {
          await api.post('/logout');
          set({ user: null });
        } catch (error) {
          console.error('Logout failed', error);
        }
      },
    }),
    {
      name: 'auth-storage', // nombre en localStorage
      partialize: (state) => ({ user: state.user }), // solo persiste el user
    }
  )
);