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
  liked?: boolean;
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
      | { posts?: any[]; events?: any[] }
    >(`/feed?page=${page}&size=${size}`);

    if (Array.isArray(res)) return res;

    if (res && Array.isArray((res as any).content)) {
      return (res as any).content;
    }

    const postsData = Array.isArray((res as any)?.posts) ? (res as any).posts : [];
    const eventsData = Array.isArray((res as any)?.events) ? (res as any).events : [];

    const posts: FeedPost[] = postsData.map((p: any) => ({
      id: p.id,
      clubId: p.club?.id ?? p.clubId ?? '',
      clubName: p.club?.name ?? '',
      clubImage: p.club?.image ?? '',
      author: p.author,
      content: p.content,
      likes: p.likes ?? 0,
      liked: p.liked ?? p.likedByUser ?? p.likedByMe ?? false,
      comments: p.comments ?? 0,
      time: p.time,
      commentsList: p.commentsList ?? [],
    }));

    const events: FeedEventItem[] = eventsData.map((e: any) => ({
      type: 'event',
      id: e.id,
      clubId: e.clubId ?? e.club?.id ?? '',
      clubName: e.club?.name ?? '',
      clubImage: e.club?.image ?? '',
      isJoinedClub: e.club?.isJoined ?? false,
      title: e.title,
      date: e.date,
      time: e.time,
      location: e.location,
      description: e.description,
      joinedCount: e.attendees ?? e.joinedCount ?? 0,
    }));

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
