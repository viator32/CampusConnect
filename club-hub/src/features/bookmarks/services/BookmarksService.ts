// src/features/bookmarks/services/BookmarksService.ts
import { BaseService } from '../../../services/BaseService';
import type { BookmarkedPost } from '../types';
import { mapBookmarkedPost } from '../mappers';

export class BookmarksService extends BaseService {
  async getAll(): Promise<BookmarkedPost[]> {
    // API expects /api/posts/bookmarks
    const arr = await this.api.request<any[]>(
      `${this.api.baseUrl}/posts/bookmarks`
    );
    return arr.map(mapBookmarkedPost);
  }

  async add(id: string): Promise<void> {
    // POST /api/posts/{postId}/bookmark
    await this.api.request<void>(
      `${this.api.baseUrl}/posts/${id}/bookmark`,
      { method: 'POST' }
    );
  }

  async remove(id: string): Promise<void> {
    // DELETE /api/posts/{postId}/bookmark
    await this.api.request<void>(
      `${this.api.baseUrl}/posts/${id}/bookmark`,
      { method: 'DELETE' }
    );
  }
}

export const bookmarksService = new BookmarksService();
