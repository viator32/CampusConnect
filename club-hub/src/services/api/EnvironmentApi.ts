import { BaseApi } from './BaseApi';

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export class EnvironmentApi extends BaseApi {
  constructor() {
    const base = (import.meta as any).env?.VITE_API_URL ?? '';
    super(base);
  }

  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {})
    };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    // TODO: Replace mock implementation with real API call when backend is ready
    if (!this.baseUrl) {
      if (path.includes('login') || path.includes('register')) {
        return Promise.resolve({ token: 'mock-token' } as T);
      }
      return Promise.resolve({} as T);
    }

    const res = await fetch(this.baseUrl + path, { ...options, headers });
    if (!res.ok) {
      throw new Error('API error');
    }
    return res.json() as Promise<T>;
  }
}

export const environmentApi = new EnvironmentApi();
