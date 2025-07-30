// src/features/admin/services/AdminService.ts
import {
  ClubRequest,
  ExternalAccountRequest,
  Analytics,
  dummyClubRequests,
  dummyExternalRequests,
  dummyAnalytics
} from './dummyData';

export class AdminService {
  static async getClubRequests(): Promise<ClubRequest[]> {
    return new Promise(resolve =>
      setTimeout(() => resolve(dummyClubRequests), 200)
    );
  }

  static async approveClub(id: number): Promise<void> {
    return new Promise(resolve =>
      setTimeout(() => {
        dummyClubRequests = dummyClubRequests.filter(r => r.id !== id);
        resolve();
      }, 200)
    );
  }

  static async rejectClub(id: number): Promise<void> {
    return new Promise(resolve =>
      setTimeout(() => {
        dummyClubRequests = dummyClubRequests.filter(r => r.id !== id);
        resolve();
      }, 200)
    );
  }

  static async getExternalRequests(): Promise<ExternalAccountRequest[]> {
    return new Promise(resolve =>
      setTimeout(() => resolve(dummyExternalRequests), 200)
    );
  }

  static async approveExternal(id: number): Promise<void> {
    return new Promise(resolve =>
      setTimeout(() => {
        dummyExternalRequests = dummyExternalRequests.filter(r => r.id !== id);
        resolve();
      }, 200)
    );
  }

  static async rejectExternal(id: number): Promise<void> {
    return new Promise(resolve =>
      setTimeout(() => {
        dummyExternalRequests = dummyExternalRequests.filter(r => r.id !== id);
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
