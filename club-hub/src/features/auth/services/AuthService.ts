import { BaseService } from '../../../services/BaseService';
import { setAuthToken } from '../../../services/api';

type LoginRes = { token: string };
type RegisterRes = { token: string };

// Backend requires: email, password
// Register requires: email, username, studentId, password
export class AuthService extends BaseService {
  async login(email: string, password: string): Promise<LoginRes> {
    const payload = this.buildPayload({ email, password });
    const res = await this.api.request<LoginRes>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setAuthToken(res.token);
    return res;
  }

  async register(
    username: string,
    email: string,
    password: string,
    studentId: string
  ): Promise<RegisterRes> {
    const payload = this.buildPayload({ email, username, studentId, password });
    const res = await this.api.request<RegisterRes>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setAuthToken(res.token);
    return res;
  }

  async refresh(currentToken: string): Promise<LoginRes> {
    const res = await this.api.request<LoginRes>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ token: currentToken }),
    });
    setAuthToken(res.token);
    return res;
  }

  logout() {
    setAuthToken(null);
  }
}

export const authService = new AuthService();
