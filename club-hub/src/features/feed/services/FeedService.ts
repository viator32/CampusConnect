// src/features/feed/services/FeedService.ts
import { Comment } from '../../clubs/types';
import { FeedPost, dummyFeedPosts } from './dummyData';

export class FeedService {
  static async getAll(): Promise<FeedPost[]> {
    return new Promise(resolve =>
      setTimeout(() => resolve(dummyFeedPosts), 200)
    );
  }

  static async addPost(post: Omit<FeedPost, 'id'>): Promise<FeedPost> {
    return new Promise(resolve =>
      setTimeout(() => {
        const newPost: FeedPost = { ...post, id: Date.now() };
        dummyFeedPosts.unshift(newPost);
        resolve(newPost);
      }, 200)
    );
  }

  static async addComment(
    postId: number,
    comment: Omit<Comment, 'id'>
  ): Promise<Comment | undefined> {
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
