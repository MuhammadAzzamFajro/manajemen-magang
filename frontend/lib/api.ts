/**
 * lib/api.ts
 * HTTP client untuk memanggil Laravel REST API (MySQL backend).
 * Menggantikan penggunaan Supabase langsung dari browser.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// ─── Token helpers ────────────────────────────────────────────────────────────
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('simmas_token');
};

export const setToken = (token: string) => {
  if (typeof window !== 'undefined') sessionStorage.setItem('simmas_token', token);
};

export const clearToken = () => {
  if (typeof window !== 'undefined') sessionStorage.removeItem('simmas_token');
};

// ─── Core fetch wrapper ───────────────────────────────────────────────────────
async function request<T = any>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  body?: any,
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    // Laravel validation error (422) → format errors
    if (res.status === 422 && json.errors) {
      const messages = Object.values(json.errors).flat().join(' ');
      throw new Error(messages || json.message || 'Validasi gagal.');
    }
    throw new Error(json.message || `HTTP ${res.status}`);
  }

  // Laravel API selalu wrap dalam { status: true, data: ... }
  // Kembalikan data langsung jika ada, atau seluruh json
  return (json.data !== undefined ? json.data : json) as T;
}

// ─── Shorthand helpers ────────────────────────────────────────────────────────
export const api = {
  get:    <T = any>(path: string)                   => request<T>('GET',    path),
  post:   <T = any>(path: string, body: any)        => request<T>('POST',   path, body),
  put:    <T = any>(path: string, body: any)        => request<T>('PUT',    path, body),
  patch:  <T = any>(path: string, body?: any)       => request<T>('PATCH',  path, body),
  delete: <T = any>(path: string)                   => request<T>('DELETE', path),

  // multipart/form-data (file upload)
  postForm: async <T = any>(path: string, formData: FormData): Promise<T> => {
    const token = getToken();
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${BASE_URL}${path}`, { method: 'POST', headers, body: formData });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (res.status === 422 && json.errors) {
        const messages = Object.values(json.errors).flat().join(' ');
        throw new Error(messages || json.message || 'Validasi gagal.');
      }
      throw new Error(json.message || `HTTP ${res.status}`);
    }
    return (json.data !== undefined ? json.data : json) as T;
  },

  putForm: async <T = any>(path: string, formData: FormData): Promise<T> => {
    const token = getToken();
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    // Laravel doesn't support PUT multipart; use POST with _method spoofing
    formData.append('_method', 'PUT');
    const res = await fetch(`${BASE_URL}${path}`, { method: 'POST', headers, body: formData });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (res.status === 422 && json.errors) {
        const messages = Object.values(json.errors).flat().join(' ');
        throw new Error(messages || json.message || 'Validasi gagal.');
      }
      throw new Error(json.message || `HTTP ${res.status}`);
    }
    return (json.data !== undefined ? json.data : json) as T;
  },
};

export default api;
