import { BaseService } from '../../../services/BaseService';
import type { User } from '../types';

export class ProfileService extends BaseService {
  /** Fetch the current user via the `/users/me` endpoint */
  async getCurrent(): Promise<User> {
    const dto = await this.api.request<any>('/users/me');
    return mapUser(dto);
  }

  /** Update the current user (partial PUT is fine) */
  async updateCurrent(id: string, partial: Partial<User>): Promise<User> {
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
    id: String(dto.id),
    role: dto.role ?? 'student',
    name: dto.username ?? dto.name ?? '',
    email: dto.email ?? '',
    avatar: dto.avatar ?? '',
    description: dto.description ?? '',
    subject: dto.subject ?? '',
    preferences: dto.preferences ?? [],
    clubsJoined: dto.clubsJoined ?? 0,
    eventsAttended: dto.eventsAttended ?? 0,
    memberships:
      dto.memberships?.map((m: any) => ({
        id: m.id,
        clubId: m.clubId,
        name: m.name,
        role: m.role,
        avatar: m.avatar ?? '',
        joinedAt: m.joinedAt ?? '',
      })) ?? [],
    settings: dto.settings ?? { notifications: {}, privacy: {}, preferences: {} },
  };
}

function mapUserToDto(p: Partial<User>) {
  const out: any = {};
  if (p.name !== undefined) out.username = p.name;
  if (p.avatar !== undefined) out.avatar = p.avatar;
  if (p.description !== undefined) out.description = p.description;
  if (p.subject !== undefined) out.subject = p.subject;
  if (p.preferences !== undefined) out.preferences = p.preferences;
  return out;
}
