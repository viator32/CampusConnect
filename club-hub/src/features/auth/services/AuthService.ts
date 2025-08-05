// src/features/auth/services/AuthService.ts
import { BaseService } from '../../../services/BaseService';

export class AuthService extends BaseService {
  async login(email: string, password: string): Promise<{ token: string }> {
    const payload = this.buildPayload({ email, password });
    // TODO: replace '/login' with your backend login endpoint and return the response
    await this.api.request('/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    // TODO: remove dummy token once API is integrated
    return Promise.resolve({ token: 'mock-token' });
  }

  async register(
    name: string,
    email: string,
    password: string,
    studentId: string
  ): Promise<{ token: string }> {
    const payload = this.buildPayload({ name, email, password, studentId });
    // TODO: replace '/register' with your backend registration endpoint and return the response
    await this.api.request('/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    // TODO: remove dummy token once API is integrated
    return Promise.resolve({ token: 'mock-token' });
  }
}

export const authService = new AuthService();
