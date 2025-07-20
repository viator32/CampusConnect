// src/features/profile/services/ProfileService.ts
import { User } from '../types';
import { initialUser } from './dummyData';

export class ProfileService {
  /** fetch the “current” user */
  static async getCurrent(): Promise<User> {
    return new Promise(resolve =>
      setTimeout(() => resolve(initialUser), 200)
    );
  }

  /** update only settings */
  static async updateSettings(
    settings: Partial<User['settings']>
  ): Promise<User> {
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
  static async updateCurrent(updatedUser: User): Promise<User> {
    return new Promise(resolve =>
      setTimeout(() => resolve(updatedUser), 200)
    );
  }
}
