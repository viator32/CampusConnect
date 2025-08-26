import { BaseService } from '../../../services/BaseService';
import type { Club, Event as ClubEvent, Post, Comment, Role } from '../types';
import { Subject, Preference } from '../../profile/types';
import { mapClub, mapEvent, mapPost, mapComment } from '../mappers';

export interface ClubSearchParams {
  page?: number;
  size?: number;
  name?: string;
  category?: string;
  interest?: Preference;
  minMembers?: number;
  maxMembers?: number;
}

export class ClubService extends BaseService {
  async getAll(params: ClubSearchParams = {}): Promise<{ clubs: Club[]; totalPages: number }> {
    const search = new URLSearchParams();
    if (params.page !== undefined) search.set('page', String(params.page));
    if (params.size !== undefined) search.set('size', String(params.size));
    if (params.name) search.set('name', params.name);
    if (params.category) search.set('category', params.category);
    if (params.interest && params.interest !== Preference.NONE)
      search.set('interest', params.interest);
    if (params.minMembers !== undefined) search.set('minMembers', String(params.minMembers));
    if (params.maxMembers !== undefined) search.set('maxMembers', String(params.maxMembers));

    const query = search.toString();
    const dto = await this.api.request<any>(`/clubs${query ? `?${query}` : ''}`); // public in docs
    const content = Array.isArray(dto) ? dto : dto.content ?? [];
    const totalPages = dto.totalPages ?? 1;
    return { clubs: content.map(mapClub), totalPages };
  }

  async getById(id: string): Promise<Club | undefined> {
    const dto = await this.api.request<any>(`/clubs/${id}`);
    return mapClub(dto);
  }

  async createClub(data: Partial<Club>): Promise<Club> {
    // backend expects: { name, description, category, subject, interest }
    const payload = this.buildPayload({
      name: data.name,
      description: data.description,
      category: data.category,
      subject: data.subject ?? Subject.NONE,
      interest: data.interest ?? Preference.NONE,
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
    if (data.subject !== undefined) payload.subject = data.subject;
    if (data.interest !== undefined) payload.interest = data.interest;

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

  async updateAvatar(id: string, file: Blob): Promise<Club> {
    const dto = await this.api.request<any>(`/clubs/${id}/avatar`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: file,
    });
    return mapClub(dto);
  }

  // Posts inside a club
  async listPosts(clubId: string): Promise<Post[]> {
    const arr = await this.api.request<any[]>(`/clubs/${clubId}/posts`);
    return arr
      .map(mapPost)
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  }

  async createPost(clubId: string, content: string): Promise<Post> {
    const dto = await this.api.request<any>(`/clubs/${clubId}/posts`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
    return mapPost(dto);
  }

  async updatePost(clubId: string, postId: string, content: string): Promise<Post> {
    const dto = await this.api.request<any>(`/clubs/${clubId}/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
    return mapPost(dto);
  }

  async deletePost(clubId: string, postId: string): Promise<void> {
    await this.api.request<void>(`/clubs/${clubId}/posts/${postId}`, { method: 'DELETE' });
  }

  async likePost(postId: string): Promise<void> {
    await this.api.request<void>(`/posts/${postId}/like`, { method: 'POST' });
  }

  async unlikePost(postId: string): Promise<void> {
    await this.api.request<void>(`/posts/${postId}/like`, { method: 'DELETE' });
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
  async listComments(postId: string): Promise<Comment[]> {
    const arr = await this.api.request<any[]>(`/posts/${postId}/comments`);
    return arr.map(mapComment);
  }

  async addComment(postId: string, content: string): Promise<Comment> {
    const dto = await this.api.request<any>(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
    return mapComment(dto);
  }

  async likeComment(commentId: string): Promise<void> {
    await this.api.request<void>(`/comments/${commentId}/like`, { method: 'POST' });
  }
}

export const clubService = new ClubService();

