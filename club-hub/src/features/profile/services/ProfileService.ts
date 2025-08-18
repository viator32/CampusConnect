import { BaseService } from '../../../services/BaseService';
import type { User } from '../types';

export class ProfileService extends BaseService {
  /** Fetch the current user via the `/users/me` endpoint */
  async getCurrent(): Promise<User> {
    const dto = await this.api.request<any>('/users/me');
    return mapUser(dto);
  }

  /** Update the current user (partial PUT is fine) */
  async updateCurrent(partial: Partial<User>): Promise<User> {
    const dto = await this.api.request<any>('/users/me', {
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
    id: String(dto.id),
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
    memberships:
      dto.memberships?.map((m: any) => ({
        id: m.id,
        clubId: m.clubId,
        name: m.name,
        role: m.role,
        avatar: m.avatar ?? '👤',
        joinedAt: m.joinedAt ?? '',
      })) ?? [],
    joinedEvents:
      dto.joinedEvents?.map((e: any) => ({
        id: e.id,
        title: e.title,
        date: e.date,
        time: e.time,
        clubId: String(e.clubId),
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
