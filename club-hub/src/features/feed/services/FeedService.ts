import { BaseService } from '../../../services/BaseService';
import type { Comment } from '../../clubs/types';
import type { FeedPost } from './dummyData'; // keep your type

export class FeedService extends BaseService {
  async getAll(): Promise<FeedPost[]> {
    // When your feed endpoint is ready, just return that:
    // return this.api.request<FeedPost[]>('/feed');
    // For now fall back to clubs posts aggregation if you want (optional):
    return this.api.request<FeedPost[]>('/feed'); // will work once backend provides it
  }

  async addPost(post: Omit<FeedPost, 'id'>): Promise<FeedPost> {
    const payload = this.buildPayload(post);
    return this.api.request<FeedPost>('/feed', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async addComment(postId: number, comment: Omit<Comment, 'id'>) {
    return this.api.request<Comment>(`/feed/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify(comment),
    });
  }
}

export const feedService = new FeedService();
