import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

interface User {
  id: string; // ✅ AGREGAR ESTE CAMPO
  nombre: string;
  correoUniversitario: string;
  telefono?: string;
  intereses?: string[];
  role?: string; // ✅ AGREGAR para validar permisos
  edad?: number;
  carrera?: string;
  comuna?: string;
  direccion?: string;
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
          // ✅ CORREGIDO: El endpoint es /profile (sin /auth)
          const res = await api.get('/profile');
          if (res.data.success) {
            const userData = res.data.user;
            set({
              user: {
                id: userData._id || userData.id,
                nombre: userData.nombre,
                correoUniversitario: userData.correoUniversitario,
                telefono: userData.telefono,
                intereses: userData.intereses,
                role: userData.rol || userData.role,
                edad: userData.edad,
                carrera: userData.carrera,
                comuna: userData.comuna,
                direccion: userData.direccion,
              },
            });
          }
        } catch (error) {
          console.error('Error fetching user:', error);
          set({ user: null });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          // ✅ CORREGIDO: El endpoint es /logout (sin /auth)
          await api.get('/logout');
          set({ user: null });
        } catch (error) {
          console.error('Error logging out:', error);
          set({ user: null });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);