// src/features/auth/services/AuthService.ts
import { apiRequest } from '../../../services/api';

export class AuthService {
  static async login(email: string, password: string): Promise<{ token: string }> {
    // TODO: replace '/login' with your backend login endpoint
    return apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  static async register(
    name: string,
    email: string,
    password: string,
    studentId: string
  ): Promise<{ token: string }> {
    // TODO: replace '/register' with your backend registration endpoint
    return apiRequest('/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, studentId })
    });
  }
}
