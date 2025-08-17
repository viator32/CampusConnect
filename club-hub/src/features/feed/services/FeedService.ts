import { BaseService } from '../../../services/BaseService';
import type { Comment } from '../../clubs/types';

export interface FeedPost {
  id: string;
  clubId: string;
  clubName: string;
  clubImage: string;
  author: string;
  content: string;
  likes: number;
  comments: number;
  time: string;
  commentsList?: Comment[];
}

export interface FeedEventItem {
  type: 'event';
  [key: string]: any;
}

export type FeedItem = FeedPost | FeedEventItem;

export class FeedService extends BaseService {
  async getPage(page = 0, size = 10): Promise<FeedItem[]> {
    const res = await this.api.request<
      | FeedItem[]
      | { content?: FeedItem[] }
      | { posts?: FeedPost[]; events?: FeedEventItem[] }
    >(`/feed?page=${page}&size=${size}`);

    if (Array.isArray(res)) return res;

    if (res && Array.isArray((res as any).content)) {
      return (res as any).content;
    }

    const posts = Array.isArray((res as any)?.posts) ? (res as any).posts : [];
    const events = Array.isArray((res as any)?.events) ? (res as any).events : [];
    if (posts.length > 0 || events.length > 0) {
      return [...posts, ...events];
    }

    throw new Error('Invalid feed response');
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
