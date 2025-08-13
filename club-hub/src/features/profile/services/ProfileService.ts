import { BaseService } from '../../../services/BaseService';
import type { User } from '../types';
import { CURRENT_USER_ID_KEY } from '../../../constants/storage';

export class ProfileService extends BaseService {
  private getCurrentUserId(): number {
    const raw = localStorage.getItem(CURRENT_USER_ID_KEY);
    if (!raw) throw new Error('No current user id found');
    return Number(raw);
  }

  /** Fetch the current user (by stored id) */
  async getCurrent(): Promise<User> {
    const id = this.getCurrentUserId();
    const dto = await this.api.request<any>(`/users/${id}`);
    return mapUser(dto);
  }

  /** Update the current user (partial PUT is fine) */
  async updateCurrent(partial: Partial<User>): Promise<User> {
    const id = this.getCurrentUserId();
    const dto = await this.api.request<any>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(mapUserToDto(partial)),
    });
    return mapUser(dto);
  }
}

export const profileService = new ProfileService();

// ─── mappers ────────────────────────────────────────────────────────────────
function mapUser(dto: any): User {
  return {
    id: dto.id,
    role: dto.role ?? 'student',
    name: dto.username ?? dto.name ?? '',
    email: dto.email ?? '',
    avatar: dto.avatar ?? '👤',
    year: dto.year ?? '',
    major: dto.major ?? '',
    bio: dto.bio ?? '',
    joinedDate: dto.createdAt ?? '',
    clubsJoined: dto.clubsJoined ?? 0,
    eventsAttended: dto.eventsAttended ?? 0,
    postsCreated: dto.postsCreated ?? 0,
    badges: dto.badges ?? [],
    interests: dto.interests ?? [],
    joinedEvents:
      dto.joinedEvents?.map((e: any) => ({
        id: e.id,
        title: e.title,
        date: e.date,
        time: e.time,
        clubId: e.clubId,
        clubName: e.clubName,
        clubImage: e.clubImage ?? '🏷️',
      })) ?? [],
    settings: dto.settings ?? {}, // Add default or mapped settings
  };
}

function mapUserToDto(p: Partial<User>) {
  const out: any = {};
  if (p.name !== undefined) out.username = p.name; // backend field
  if (p.bio !== undefined) out.bio = p.bio;
  if (p.year !== undefined) out.year = p.year;
  if (p.major !== undefined) out.major = p.major;
  if (p.avatar !== undefined) out.avatar = p.avatar;
  if (p.interests !== undefined) out.interests = p.interests;
  return out;
}
