// src/features/bookmarks/services/BookmarksService.ts
import { BaseService } from '../../../services/BaseService';
import { BookmarkedPost, dummyBookmarks } from './dummyData';

export class BookmarksService extends BaseService {
  protected buildPayload(...args: unknown[]): unknown {
    return Object.assign({}, ...args);
  }

  async getAll(): Promise<BookmarkedPost[]> {
    // TODO: replace '/bookmarks' with backend endpoint
    await this.api.request('/bookmarks');
    // TODO: remove dummy data once API is integrated
    return new Promise(resolve =>
      setTimeout(() => resolve(dummyBookmarks), 200)
    );
  }

  async add(post: BookmarkedPost): Promise<void> {
    const payload = this.buildPayload(post);
    // TODO: replace '/bookmarks' with backend endpoint
    await this.api.request('/bookmarks', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    // TODO: remove dummy mutation once API is integrated
    return new Promise(resolve =>
      setTimeout(() => {
        dummyBookmarks.push(post);
        resolve();
      }, 200)
    );
  }

  async remove(id: number): Promise<void> {
    const payload = this.buildPayload({ id });
    // TODO: replace `/bookmarks/${id}` with backend endpoint
    await this.api.request(`/bookmarks/${id}`, {
      method: 'DELETE',
      body: JSON.stringify(payload)
    });
    // TODO: remove dummy mutation once API is integrated
    return new Promise(resolve =>
      setTimeout(() => {
        const index = dummyBookmarks.findIndex(b => b.id === id);
        if (index !== -1) dummyBookmarks.splice(index, 1);
        resolve();
      }, 200)
    );
  }
}

export const bookmarksService = new BookmarksService();
