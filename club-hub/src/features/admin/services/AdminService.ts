// src/features/admin/services/AdminService.ts
import { BaseService } from '../../../services/BaseService';
import {
  ClubRequest,
  ExternalAccountRequest,
  Analytics,
  dummyClubRequests as initialClubRequests,
  dummyExternalRequests as initialExternalRequests,
  dummyAnalytics
} from './dummyData';

export class AdminService extends BaseService {
  private clubRequests: ClubRequest[] = [...initialClubRequests];
  private externalRequests: ExternalAccountRequest[] = [...initialExternalRequests];

  protected buildPayload(...args: unknown[]): unknown {
    return Object.assign({}, ...args);
  }

  async getClubRequests(): Promise<ClubRequest[]> {
    // TODO: replace '/admin/club-requests' with backend endpoint and return API response
    await this.api.request('/admin/club-requests');
    // TODO: remove dummy data once API is integrated
    return new Promise(resolve =>
      setTimeout(() => resolve(this.clubRequests), 200)
    );
  }

  async approveClub(id: number): Promise<void> {
    const payload = this.buildPayload({ id });
    // TODO: replace '/admin/club-requests/approve' with backend endpoint
    await this.api.request('/admin/club-requests/approve', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    // TODO: remove dummy mutation once API is integrated
    return new Promise(resolve =>
      setTimeout(() => {
        this.clubRequests = this.clubRequests.filter(r => r.id !== id);
        resolve();
      }, 200)
    );
  }

  async rejectClub(id: number): Promise<void> {
    const payload = this.buildPayload({ id });
    // TODO: replace '/admin/club-requests/reject' with backend endpoint
    await this.api.request('/admin/club-requests/reject', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    // TODO: remove dummy mutation once API is integrated
    return new Promise(resolve =>
      setTimeout(() => {
        this.clubRequests = this.clubRequests.filter(r => r.id !== id);
        resolve();
      }, 200)
    );
  }

  async getExternalRequests(): Promise<ExternalAccountRequest[]> {
    // TODO: replace '/admin/external-requests' with backend endpoint
    await this.api.request('/admin/external-requests');
    // TODO: remove dummy data once API is integrated
    return new Promise(resolve =>
      setTimeout(() => resolve(this.externalRequests), 200)
    );
  }

  async approveExternal(id: number): Promise<void> {
    const payload = this.buildPayload({ id });
    // TODO: replace '/admin/external-requests/approve' with backend endpoint
    await this.api.request('/admin/external-requests/approve', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    // TODO: remove dummy mutation once API is integrated
    return new Promise(resolve =>
      setTimeout(() => {
        this.externalRequests = this.externalRequests.filter(r => r.id !== id);
        resolve();
      }, 200)
    );
  }

  async rejectExternal(id: number): Promise<void> {
    const payload = this.buildPayload({ id });
    // TODO: replace '/admin/external-requests/reject' with backend endpoint
    await this.api.request('/admin/external-requests/reject', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    // TODO: remove dummy mutation once API is integrated
    return new Promise(resolve =>
      setTimeout(() => {
        this.externalRequests = this.externalRequests.filter(r => r.id !== id);
        resolve();
      }, 200)
    );
  }

  async getAnalytics(): Promise<Analytics> {
    // TODO: replace '/admin/analytics' with backend endpoint
    await this.api.request('/admin/analytics');
    // TODO: remove dummy data once API is integrated
    return new Promise(resolve =>
      setTimeout(() => resolve(dummyAnalytics), 200)
    );
  }
}

export const adminService = new AdminService();
