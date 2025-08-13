// src/services/api.ts
export class EnvironmentApi {
  public readonly baseUrl: string;

  constructor(base?: string) {
    // default to local quarkus + /api when env is missing
    const env = (import.meta as any)?.env?.VITE_API_URL as string | undefined;
    const root = (env ?? 'http://localhost:8080').replace(/\/+$/, '');
    // Ensure we always hit /api
    this.baseUrl = `${root}/api`;
  }

  private static accessToken: string | null = null;

  /** Call this after login/register (and on bootstrap if you load token from storage) */
  static setAuthToken(token: string | null) {
    EnvironmentApi.accessToken = token;
    try {
      if (token) localStorage.setItem('access_token', token);
      else localStorage.removeItem('access_token');
    } catch {}
  }

  /** Restore token on app start (optional) */
  static bootstrapTokenFromStorage() {
    try {
      const t = localStorage.getItem('access_token');
      EnvironmentApi.accessToken = t;
    } catch {}
  }

  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const isAbsolute = /^https?:\/\//i.test(path);
    const url = isAbsolute
      ? path
      : `${this.baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;

    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    // Only set JSON header if the body is not FormData and header not provided
    const isForm = typeof FormData !== 'undefined' && options.body instanceof FormData;
    if (!isForm && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    if (EnvironmentApi.accessToken) {
      headers['Authorization'] = `Bearer ${EnvironmentApi.accessToken}`;
    }

    const res = await fetch(url, { ...options, headers });

    // No refresh endpoint is required beyond POST /auth/refresh with { token }, so we simply throw on 401 here.
    if (!res.ok) {
      const text = await res.text();
      let data: any = null;
      try { data = text ? JSON.parse(text) : null; } catch { data = text; }
      const msg = (data && (data.message || data.error)) || res.statusText;
      throw new Error(`${res.status} ${msg}`);
    }

    if (res.status === 204) return undefined as unknown as T;
    return res.json() as Promise<T>;
  }
}

export const environmentApi = new EnvironmentApi();

// handy re-export
export const setAuthToken = EnvironmentApi.setAuthToken;
EnvironmentApi.bootstrapTokenFromStorage();
