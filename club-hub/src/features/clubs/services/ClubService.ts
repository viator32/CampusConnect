import { Club } from '../types';
import { dummyClubs } from './dummyData';

export class ClubService {
  static async getAll(): Promise<Club[]> {
    // TODO: replace with real API call
    return new Promise(resolve => setTimeout(() => resolve(dummyClubs), 200));
  }

  static async getById(id: number): Promise<Club | undefined> {
    return new Promise(resolve =>
      setTimeout(() => resolve(dummyClubs.find(c => c.id === id)), 200)
    );
  }

  static async createClub(data: Partial<Club>): Promise<Club> {
    // TODO: POST to backend
    const newClub: Club = { ...(data as Club), id: Date.now() };
    return new Promise(resolve => setTimeout(() => resolve(newClub), 200));
  }
}
