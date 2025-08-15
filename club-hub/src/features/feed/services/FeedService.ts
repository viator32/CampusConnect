import { BaseService } from '../../../services/BaseService';
import type { Comment } from '../../clubs/types';
import type { FeedPost } from './dummyData'; // keep your type

export interface FeedEventItem {
  type: 'event';
  [key: string]: any;
}

export type FeedItem = FeedPost | FeedEventItem;

export class FeedService extends BaseService {
  async getPage(page = 0, size = 10): Promise<FeedItem[]> {
    return this.api.request<FeedItem[]>(`/feed?page=${page}&size=${size}`);
  }

  async addPost(post: Omit<FeedPost, 'id'>): Promise<FeedPost> {
    const payload = this.buildPayload(post);
    return this.api.request<FeedPost>('/feed', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async addComment(postId: string, comment: Omit<Comment, 'id'>) {
    return this.api.request<Comment>(`/feed/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify(comment),
    });
  }
}

export const feedService = new FeedService();
