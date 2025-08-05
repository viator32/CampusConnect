// src/features/profile/services/ProfileService.ts
import { BaseService } from '../../../services/BaseService';
import { User } from '../types';
import { initialUser } from './dummyData';

export class ProfileService extends BaseService {
  /** fetch the “current” user */
  async getCurrent(): Promise<User> {
    // TODO: replace '/profile/current' with backend endpoint
    await this.api.request('/profile/current');
    // TODO: remove dummy data once API is integrated
    return new Promise(resolve =>
      setTimeout(() => resolve(initialUser), 200)
    );
  }

  /** update only settings */
  async updateSettings(settings: Partial<User['settings']>): Promise<User> {
    const payload = this.buildPayload(settings);
    // TODO: replace '/profile/settings' with backend endpoint
    await this.api.request('/profile/settings', {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    // TODO: remove dummy mutation once API is integrated
    return new Promise(resolve =>
      setTimeout(
        () =>
          resolve({
            ...initialUser,
            settings: { ...initialUser.settings, ...settings }
          }),
        200
      )
    );
  }

  /** update the entire user record */
  async updateCurrent(updatedUser: User): Promise<User> {
    const payload = this.buildPayload(updatedUser);
    // TODO: replace '/profile/update' with backend endpoint
    await this.api.request('/profile/update', {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    // TODO: remove dummy mutation once API is integrated
    return new Promise(resolve =>
      setTimeout(() => resolve(updatedUser), 200)
    );
  }
}

export const profileService = new ProfileService();
