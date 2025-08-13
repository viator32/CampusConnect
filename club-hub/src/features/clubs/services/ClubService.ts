import { BaseService } from '../../../services/BaseService';
import type { Club, Event as ClubEvent, Post } from '../types';

export class ClubService extends BaseService {
  async getAll(): Promise<Club[]> {
    const arr = await this.api.request<any[]>('/clubs'); // public in docs
    return arr.map(mapClub);
  }

  async getById(id: number | string): Promise<Club> {
    const dto = await this.api.request<any>(`/clubs/${id}`);
    return mapClub(dto);
  }

  async createClub(data: Partial<Club>): Promise<Club> {
    // backend expects: { name, description, category, image? }
    const payload = this.buildPayload({
      name: data.name,
      description: data.description,
      category: data.category,
      image: data.image,
    });
    const dto = await this.api.request<any>('/clubs', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return mapClub(dto);
  }

  async updateClub(id: number, data: Partial<Club>): Promise<Club> {
    const payload: any = {};
    if (data.name !== undefined) payload.name = data.name;
    if (data.description !== undefined) payload.description = data.description;
    if (data.category !== undefined) payload.category = data.category;
    if (data.image !== undefined) payload.image = data.image;

    const dto = await this.api.request<any>(`/clubs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return mapClub(dto);
  }

  async deleteClub(id: number): Promise<void> {
    await this.api.request<void>(`/clubs/${id}`, { method: 'DELETE' });
  }

  async joinClub(id: number): Promise<void> {
    await this.api.request<void>(`/clubs/${id}/join`, { method: 'POST' });
  }

  async leaveClub(id: number): Promise<void> {
    await this.api.request<void>(`/clubs/${id}/leave`, { method: 'POST' });
  }

  // Posts inside a club
  async listPosts(clubId: number): Promise<Post[]> {
    const arr = await this.api.request<any[]>(`/clubs/${clubId}/posts`);
    return arr.map(mapPost);
  }

  async createPost(clubId: number, content: string): Promise<Post> {
    const dto = await this.api.request<any>(`/clubs/${clubId}/posts`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
    return mapPost(dto);
  }

  // Events inside a club
  async listEvents(clubId: number): Promise<ClubEvent[]> {
    const arr = await this.api.request<any[]>(`/clubs/${clubId}/events`);
    return arr.map(mapEvent);
  }

  async createEvent(clubId: number, ev: Partial<ClubEvent>): Promise<ClubEvent> {
    const payload: any = {};
    if (ev.title !== undefined) payload.title = ev.title;
    if (ev.description !== undefined) payload.description = ev.description;
    if (ev.date !== undefined) payload.date = ev.date;
    if (ev.time !== undefined) payload.time = ev.time;
    if (ev.location !== undefined) payload.location = ev.location;

    const dto = await this.api.request<any>(`/clubs/${clubId}/events`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return mapEvent(dto);
  }
}

export const clubService = new ClubService();

// ─── mappers ────────────────────────────────────────────────────────────────
function mapClub(dto: any): Club {
  const rawId = dto.id ?? dto.clubId ?? dto._id;
  const id = typeof rawId === 'string' ? parseInt(rawId, 10) : rawId;
  return {
    id: isNaN(id) ? rawId : id,
    name: dto.name,
    description: dto.description ?? '',
    category: dto.category ?? 'General',
    image: dto.image ?? '🏷️',
    members: dto.membersCount ?? dto.members ?? 0,
    isJoined: !!dto.isJoined,

    events: (dto.events ?? []).map(mapEvent),
    posts: (dto.posts ?? []).map(mapPost),
    members_list: dto.membersList ?? [],
    forum_threads: dto.forumThreads ?? [],

    founded: dto.founded,
    location: dto.location,
    tags: dto.tags ?? [],
    projects: dto.projects ?? [],
  };
}

function mapEvent(dto: any): ClubEvent {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    date: dto.date,
    time: dto.time,
    location: dto.location,
    status: dto.status,
    joined: dto.participantsCount ?? dto.joined,
    participants: dto.participants,
  };
}

function mapPost(dto: any): Post {
  return {
    id: dto.id,
    author: dto.author ?? dto.username ?? 'Unknown',
    content: dto.content ?? '',
    likes: dto.likes ?? 0,
    comments: dto.comments ?? 0,
    time: dto.time ?? dto.createdAt ?? '',
    commentsList: dto.commentsList ?? [],
    photo: dto.photo,
    poll: dto.poll,
  };
}
