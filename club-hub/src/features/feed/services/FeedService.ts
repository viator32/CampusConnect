// src/features/feed/services/FeedService.ts
import { BaseService } from '../../../services/BaseService';
import { Comment } from '../../clubs/types';
import { FeedPost, dummyFeedPosts } from './dummyData';

export class FeedService extends BaseService {
  protected buildPayload(...args: unknown[]): unknown {
    return Object.assign({}, ...args);
  }

  async getAll(): Promise<FeedPost[]> {
    // TODO: replace '/feed' with backend endpoint
    await this.api.request('/feed');
    // TODO: remove dummy data once API is integrated
    return new Promise(resolve =>
      setTimeout(() => resolve(dummyFeedPosts), 200)
    );
  }

  async addPost(post: Omit<FeedPost, 'id'>): Promise<FeedPost> {
    const payload = this.buildPayload(post);
    // TODO: replace '/feed' with backend endpoint
    await this.api.request('/feed', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    // TODO: remove dummy data once API is integrated
    return new Promise(resolve =>
      setTimeout(() => {
        const newPost: FeedPost = { ...post, id: Date.now() };
        dummyFeedPosts.unshift(newPost);
        resolve(newPost);
      }, 200)
    );
  }

  async addComment(
    postId: number,
    comment: Omit<Comment, 'id'>
  ): Promise<Comment | undefined> {
    const payload = this.buildPayload({ postId, comment });
    // TODO: replace `/feed/${postId}/comments` with backend endpoint
    await this.api.request(`/feed/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    // TODO: remove dummy data once API is integrated
    return new Promise(resolve =>
      setTimeout(() => {
        const post = dummyFeedPosts.find(p => p.id === postId);
        if (!post) return resolve(undefined);
        const newComment: Comment = { ...comment, id: Date.now() };
        if (post.commentsList) {
          post.commentsList.push(newComment);
        } else {
          post.commentsList = [newComment];
        }
        post.comments += 1;
        resolve(newComment);
      }, 200)
    );
  }
}

export const feedService = new FeedService();
