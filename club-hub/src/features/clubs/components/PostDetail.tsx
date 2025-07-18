import React from 'react';
import { Post, Comment } from '../types';
import {
  User as UserIcon,
  Heart,
  MessageCircle
} from 'lucide-react';
import Button from '../../../components/Button';

interface PostDetailProps {
  post: Post;
  onBack: () => void;
}

export default function PostDetail({ post, onBack }: PostDetailProps) {
  return (
    <div className="space-y-6">
      <button onClick={onBack} className="text-gray-500 hover:text-gray-700">
        ← Back to Posts
      </button>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{post.author}</p>
            <p className="text-sm text-gray-500">{post.time}</p>
          </div>
        </div>
        <p className="text-gray-700 mb-4">{post.content}</p>
        <div className="flex items-center gap-6 text-gray-500">
          <button className="flex items-center gap-1 hover:text-orange-500">
            <Heart className="w-4 h-4" />
            <span className="text-sm">{post.likes}</span>
          </button>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">{post.comments} comments</span>
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
        {(post.commentsList ?? []).map((c: Comment) => (
          <div key={c.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{c.author}</p>
                <p className="text-sm text-gray-500">{c.time}</p>
              </div>
            </div>
            <p className="text-gray-700 mb-3">{c.content}</p>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1 text-gray-500 hover:text-orange-500">
                <Heart className="w-4 h-4" />
                <span className="text-sm">{c.likes ?? 0}</span>
              </button>
              <button className="text-gray-500 hover:text-orange-500 text-sm">Reply</button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Add a Comment</h4>
        <textarea
          placeholder="Write your comment..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
          rows={3}
        />
        <div className="flex justify-end mt-3">
          <Button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
            Post Comment
          </Button>
        </div>
      </div>
    </div>
  );
}
