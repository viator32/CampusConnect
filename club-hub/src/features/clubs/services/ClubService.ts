import { BaseService } from '../../../services/BaseService';
import { Club } from '../types';
import { dummyClubs } from './dummyData';

export class ClubService extends BaseService {
  protected buildPayload(...args: unknown[]): unknown {
    return Object.assign({}, ...args);
  }

  async getAll(): Promise<Club[]> {
    // TODO: replace '/clubs' with backend endpoint
    await this.api.request('/clubs');
    // TODO: remove dummy data once API is integrated
    return new Promise(resolve => setTimeout(() => resolve(dummyClubs), 200));
  }

  async getById(id: number): Promise<Club | undefined> {
    // TODO: replace `/clubs/${id}` with backend endpoint
    await this.api.request(`/clubs/${id}`);
    // TODO: remove dummy data once API is integrated
    return new Promise(resolve =>
      setTimeout(() => resolve(dummyClubs.find(c => c.id === id)), 200)
    );
  }

  async createClub(data: Partial<Club>): Promise<Club> {
    const payload = this.buildPayload(data);
    // TODO: replace '/clubs' with backend endpoint and return created club
    await this.api.request('/clubs', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    // TODO: remove dummy data once API is integrated
    const newClub: Club = { ...(data as Club), id: Date.now() };
    return new Promise(resolve => setTimeout(() => resolve(newClub), 200));
  }
}

export const clubService = new ClubService();
