// src/features/admin/services/AdminService.ts
import { BaseService } from '../../../services/BaseService';

export interface ClubRequest {
  id: number;
  name: string;
  requestedBy: string;
  date: string;
}

export interface ExternalAccountRequest {
  id: number;
  email: string;
  reason: string;
  date: string;
}

export interface Analytics {
  totalClubs: number;
  totalMembers: number;
  totalPosts: number;
  avgEngagement: number;
}

export class AdminService extends BaseService {
  async getClubRequests(): Promise<ClubRequest[]> {
    // TODO: replace '/admin/club-requests' with backend endpoint and return API response
    await this.api.request('/admin/club-requests');
    return [];
  }

  async approveClub(id: number): Promise<void> {
    const payload = this.buildPayload({ id });
    // TODO: replace '/admin/club-requests/approve' with backend endpoint
    await this.api.request('/admin/club-requests/approve', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async rejectClub(id: number): Promise<void> {
    const payload = this.buildPayload({ id });
    // TODO: replace '/admin/club-requests/reject' with backend endpoint
    await this.api.request('/admin/club-requests/reject', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async getExternalRequests(): Promise<ExternalAccountRequest[]> {
    // TODO: replace '/admin/external-requests' with backend endpoint
    await this.api.request('/admin/external-requests');
    return [];
  }

  async approveExternal(id: number): Promise<void> {
    const payload = this.buildPayload({ id });
    // TODO: replace '/admin/external-requests/approve' with backend endpoint
    await this.api.request('/admin/external-requests/approve', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async rejectExternal(id: number): Promise<void> {
    const payload = this.buildPayload({ id });
    // TODO: replace '/admin/external-requests/reject' with backend endpoint
    await this.api.request('/admin/external-requests/reject', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async getAnalytics(): Promise<Analytics> {
    // TODO: replace '/admin/analytics' with backend endpoint
    await this.api.request('/admin/analytics');
    return { totalClubs: 0, totalMembers: 0, totalPosts: 0, avgEngagement: 0 };
  }
}

export const adminService = new AdminService();
