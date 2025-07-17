import { User } from '../types';
import { initialUser } from './dummyData';

export class ProfileService {
  static async getCurrent(): Promise<User> {
    // TODO: fetch from real API
    return new Promise(resolve => setTimeout(() => resolve(initialUser), 200));
  }

  static async updateSettings(settings: Partial<User['settings']>): Promise<User> {
    // TODO: send PATCH/PUT to backend
    return new Promise(resolve => setTimeout(() => resolve({ ...initialUser, settings: { ...initialUser.settings, ...settings } }), 200));
  }
}
