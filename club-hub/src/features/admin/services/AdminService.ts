// src/features/admin/services/AdminService.ts
import {
  ClubRequest,
  ExternalAccountRequest,
  Analytics,
  dummyClubRequests as initialClubRequests,
  dummyExternalRequests as initialExternalRequests,
  dummyAnalytics
} from './dummyData';

export class AdminService {
  // make private mutable copies
  private static clubRequests: ClubRequest[] = [...initialClubRequests];
  private static externalRequests: ExternalAccountRequest[] = [...initialExternalRequests];

  static async getClubRequests(): Promise<ClubRequest[]> {
    return new Promise(resolve =>
      setTimeout(() => resolve(this.clubRequests), 200)
    );
  }

  static async approveClub(id: number): Promise<void> {
    return new Promise(resolve =>
      setTimeout(() => {
        this.clubRequests = this.clubRequests.filter(r => r.id !== id);
        resolve();
      }, 200)
    );
  }

  static async rejectClub(id: number): Promise<void> {
    return new Promise(resolve =>
      setTimeout(() => {
        this.clubRequests = this.clubRequests.filter(r => r.id !== id);
        resolve();
      }, 200)
    );
  }

  static async getExternalRequests(): Promise<ExternalAccountRequest[]> {
    return new Promise(resolve =>
      setTimeout(() => resolve(this.externalRequests), 200)
    );
  }

  static async approveExternal(id: number): Promise<void> {
    return new Promise(resolve =>
      setTimeout(() => {
        this.externalRequests = this.externalRequests.filter(r => r.id !== id);
        resolve();
      }, 200)
    );
  }

  static async rejectExternal(id: number): Promise<void> {
    return new Promise(resolve =>
      setTimeout(() => {
        this.externalRequests = this.externalRequests.filter(r => r.id !== id);
        resolve();
      }, 200)
    );
  }

  static async getAnalytics(): Promise<Analytics> {
    return new Promise(resolve =>
      setTimeout(() => resolve(dummyAnalytics), 200)
    );
  }
}
