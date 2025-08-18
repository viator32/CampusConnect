// src/features/bookmarks/services/BookmarksService.ts
import { BaseService } from '../../../services/BaseService';

export interface BookmarkedPost {
  id: string;
  author: string;
  content: string;
  time: string;
  likes: number;
  comments: number;
  clubId?: string;
  clubName?: string;
  clubImage?: string;
}

export class BookmarksService extends BaseService {
  async getAll(): Promise<BookmarkedPost[]> {
    const arr = await this.api.request<any[]>(`/posts/bookmarks`);
    return arr.map(mapBookmarkedPost);
  }

  async add(id: string): Promise<void> {
    await this.api.request<void>(`/posts/${id}/bookmark`, { method: 'POST' });
  }

  async remove(id: string): Promise<void> {
    await this.api.request<void>(`/posts/${id}/bookmark`, { method: 'DELETE' });
  }
}

function mapBookmarkedPost(dto: any): BookmarkedPost {
  return {
    id: String(dto.id),
    author: dto.author ?? dto.username ?? 'Unknown',
    content: dto.content ?? '',
    time: dto.time ?? dto.createdAt ?? '',
    likes: dto.likes ?? 0,
    comments: dto.comments ?? 0,
    clubId: dto.clubId ?? dto.club?.id,
    clubName: dto.clubName ?? dto.club?.name,
    clubImage: dto.clubImage ?? dto.club?.image,
  };
}

export const bookmarksService = new BookmarksService();
