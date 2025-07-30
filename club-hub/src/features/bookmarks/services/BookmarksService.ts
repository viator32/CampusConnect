// src/features/bookmarks/services/BookmarksService.ts
import { BookmarkedPost, dummyBookmarks } from './dummyData';

export class BookmarksService {
  static async getAll(): Promise<BookmarkedPost[]> {
    return new Promise(resolve =>
      setTimeout(() => resolve(dummyBookmarks), 200)
    );
  }

  static async add(post: BookmarkedPost): Promise<void> {
    return new Promise(resolve =>
      setTimeout(() => {
        dummyBookmarks.push(post);
        resolve();
      }, 200)
    );
  }

  static async remove(id: number): Promise<void> {
    return new Promise(resolve =>
      setTimeout(() => {
        const index = dummyBookmarks.findIndex(b => b.id === id);
        if (index !== -1) dummyBookmarks.splice(index, 1);
        resolve();
      }, 200)
    );
  }
}
