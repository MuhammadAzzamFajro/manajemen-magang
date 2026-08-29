/**
 * lib/auth.ts
 * Auth helpers menggunakan Laravel Sanctum (token disimpan di localStorage).
 * Tidak lagi menggunakan Supabase.
 */

import api, { getToken, setToken, clearToken } from './api';

// ─── AUTH: Login ──────────────────────────────────────────────────────────────
export const signIn = async (email: string, password: string) => {
  // POST /api/login → { status: true, data: { token, user } }
  const data = await api.post<{ token: string; user: any }>('/login', { email, password });
  const { token, user } = data;

  setToken(token);

  // Normalisasi profil untuk disimpan di localStorage
  const profile = {
    id:       user.id,
    name:     user.name,
    email:    user.email,
    role:     user.role,
    guru_id:  user.guru?.id  ?? null,
    siswa_id: user.siswa?.id ?? null,
    profile:  user.profile   ?? null,
  };
  setAuthUser(profile);
  return profile;
};

// ─── AUTH: Logout ─────────────────────────────────────────────────────────────
export const signOut = async () => {
  try {
    if (getToken()) {
      await api.post('/logout', {});
    }
  } catch (_) {
    // Abaikan error saat logout
  } finally {
    clearToken();
    clearAuthUser();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
};

// ─── AUTH: Current user from sessionStorage (per-tab, tidak share antar window) ─
export const getAuthUser = (): any | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem('simmas_profile');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setAuthUser = (profile: any) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('simmas_profile', JSON.stringify(profile));
  }
};

export const clearAuthUser = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('simmas_profile');
  }
};

export { getToken };

// Legacy compat — supaya halaman yang import ini tidak perlu diubah
export const setAuthSession  = (_token: string, user: any) => setAuthUser(user);
export const getAuthToken    = () => getToken();
export const clearAuthSession = () => { clearToken(); clearAuthUser(); };
