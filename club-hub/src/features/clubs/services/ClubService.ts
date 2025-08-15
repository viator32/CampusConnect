import { BaseService } from '../../../services/BaseService';
import type { Club, Event as ClubEvent, Post, Comment, Role } from '../types';

export class ClubService extends BaseService {
  async getAll(): Promise<Club[]> {
    const arr = await this.api.request<any[]>('/clubs'); // public in docs
    return arr.map(mapClub);
  }

  async getById(id: string): Promise<Club | undefined> {
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

  async updateClub(id: string, data: Partial<Club>): Promise<Club> {
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

  async deleteClub(id: string): Promise<void> {
    await this.api.request<void>(`/clubs/${id}`, { method: 'DELETE' });
  }

  async joinClub(id: string): Promise<void> {
    await this.api.request<void>(`/clubs/${id}/join`, { method: 'POST' });
  }

  async leaveClub(id: string): Promise<void> {
    await this.api.request<void>(`/clubs/${id}/leave`, { method: 'POST' });
  }

  // Posts inside a club
  async listPosts(clubId: string): Promise<Post[]> {
    const arr = await this.api.request<any[]>(`/clubs/${clubId}/posts`);
    return arr.map(mapPost);
  }

  async createPost(clubId: string, content: string): Promise<Post> {
    const dto = await this.api.request<any>(`/clubs/${clubId}/posts`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
    return mapPost(dto);
  }

  async updatePost(clubId: string, postId: number, content: string): Promise<Post> {
    const dto = await this.api.request<any>(`/clubs/${clubId}/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
    return mapPost(dto);
  }

  async deletePost(clubId: string, postId: number): Promise<void> {
    await this.api.request<void>(`/clubs/${clubId}/posts/${postId}`, { method: 'DELETE' });
  }

  async likePost(postId: number): Promise<void> {
    await this.api.request<void>(`/posts/${postId}/like`, { method: 'POST' });
  }

  // Events inside a club
  async listEvents(clubId: string): Promise<ClubEvent[]> {
    const arr = await this.api.request<any[]>(`/clubs/${clubId}/events`);
    return arr.map(mapEvent);
  }

  async createEvent(clubId: string, ev: Partial<ClubEvent>): Promise<ClubEvent> {
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

  async updateEvent(clubId: string, eventId: number, ev: Partial<ClubEvent>): Promise<ClubEvent> {
    const payload: any = {};
    if (ev.title !== undefined) payload.title = ev.title;
    if (ev.description !== undefined) payload.description = ev.description;
    if (ev.date !== undefined) payload.date = ev.date;
    if (ev.time !== undefined) payload.time = ev.time;
    if (ev.location !== undefined) payload.location = ev.location;

    const dto = await this.api.request<any>(`/clubs/${clubId}/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return mapEvent(dto);
  }

  async deleteEvent(clubId: string, eventId: number): Promise<void> {
    await this.api.request<void>(`/clubs/${clubId}/events/${eventId}`, { method: 'DELETE' });
  }

  async joinEvent(clubId: string, eventId: number): Promise<void> {
    await this.api.request<void>(`/clubs/${clubId}/events/${eventId}/join`, { method: 'POST' });
  }

  async updateMemberRole(clubId: string, memberId: number | string, role: Role): Promise<void> {
    await this.api.request<void>(`/clubs/${clubId}/members/${memberId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  // Comments on a post
  async listComments(postId: number): Promise<Comment[]> {
    const arr = await this.api.request<any[]>(`/posts/${postId}/comments`);
    return arr.map(mapComment);
  }

  async addComment(postId: number, content: string): Promise<Comment> {
    const dto = await this.api.request<any>(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
    return mapComment(dto);
  }

  async likeComment(commentId: number): Promise<void> {
    await this.api.request<void>(`/comments/${commentId}/like`, { method: 'POST' });
  }
}

export const clubService = new ClubService();

// ─── mappers ────────────────────────────────────────────────────────────────
function mapClub(dto: any): Club {
  const rawId = dto.id ?? dto.clubId ?? dto._id;
  return {
    id: String(rawId),
    name: dto.name,
    description: dto.description ?? '',
    category: dto.category ?? 'General',
    image: dto.image ?? '🏷️',
    members: dto.membersCount ?? dto.members ?? 0,
    isJoined: !!dto.isJoined,

    events: (dto.events ?? []).map(mapEvent),
    posts: (dto.posts ?? []).map(mapPost),
    members_list: dto.membersList ?? dto.members_list ?? [],
    forum_threads: dto.forumThreads ?? dto.forum_threads ?? [],

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

function mapComment(dto: any): Comment {
  return {
    id: dto.id,
    author: dto.author ?? dto.username ?? 'Unknown',
    content: dto.content ?? '',
    time: dto.time ?? dto.createdAt ?? '',
    likes: dto.likes ?? 0,
  };
}
