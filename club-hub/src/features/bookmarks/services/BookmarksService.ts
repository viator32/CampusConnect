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
    // TODO: replace '/bookmarks' with backend endpoint
    await this.api.request('/bookmarks');
    return [];
  }

  async add(post: BookmarkedPost): Promise<void> {
    const payload = this.buildPayload(post);
    // TODO: replace '/bookmarks' with backend endpoint
    await this.api.request('/bookmarks', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async remove(id: string): Promise<void> {
    const payload = this.buildPayload({ id });
    // TODO: replace `/bookmarks/${id}` with backend endpoint
    await this.api.request(`/bookmarks/${id}`, {
      method: 'DELETE',
      body: JSON.stringify(payload)
    });
  }
}

export const bookmarksService = new BookmarksService();
