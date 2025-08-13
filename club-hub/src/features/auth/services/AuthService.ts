import { BaseService } from '../../../services/BaseService';
import { setAuthToken } from '../../../services/api';
import { CURRENT_USER_ID_KEY } from '../../../constants/storage';

type LoginRes = {
  token: string;
  user?: { id: number };
  userId?: number;
  id?: number;
};
type RegisterRes = {
  token: string;
  user?: { id: number };
  userId?: number;
  id?: number;
};

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
    const id = res.user?.id ?? res.userId ?? res.id;
    if (id !== undefined) {
      try { localStorage.setItem(CURRENT_USER_ID_KEY, String(id)); } catch {}
    }
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
    try { localStorage.removeItem(CURRENT_USER_ID_KEY); } catch {}
  }
}

export const authService = new AuthService();
