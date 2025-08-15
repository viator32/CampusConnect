import React, { useState } from 'react';
import { Post, Comment } from '../types';
import {
  User as UserIcon,
  Heart,
  MessageCircle,
  Share2
} from 'lucide-react';
import Button from '../../../components/Button';
import SharePopup from '../../../components/SharePopup';
import { clubService } from '../services/ClubService';
import { formatDateTime } from '../../../utils/date';

interface PostDetailProps {
  post: Post;
  onBack: () => void;
  onPostUpdate?: (p: Post) => void;
}

export default function PostDetail({ post, onBack, onPostUpdate }: PostDetailProps) {
  const [showShare, setShowShare] = useState(false);
  const [postData, setPostData] = useState(post);
  const [commentText, setCommentText] = useState('');

  const handleLikePost = async () => {
    setPostData(p => {
      const next = { ...p, likes: p.likes + 1 };
      onPostUpdate?.(next);
      return next;
    });
    try {
      await clubService.likePost(postData.id);
    } catch {
      setPostData(p => {
        const next = { ...p, likes: Math.max(0, p.likes - 1) };
        onPostUpdate?.(next);
        return next;
      });
    }
  };

  const handleLikeComment = async (commentId: number) => {
    setPostData(p => {
      const next = {
        ...p,
        commentsList: (p.commentsList ?? []).map(c =>
          c.id === commentId ? { ...c, likes: (c.likes ?? 0) + 1 } : c
        ),
      };
      onPostUpdate?.(next);
      return next;
    });
    try {
      await clubService.likeComment(commentId);
    } catch {
      setPostData(p => {
        const next = {
          ...p,
          commentsList: (p.commentsList ?? []).map(c =>
            c.id === commentId
              ? { ...c, likes: Math.max(0, (c.likes ?? 1) - 1) }
              : c
          ),
        };
        onPostUpdate?.(next);
        return next;
      });
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      const newComment = await clubService.addComment(postData.id, commentText);
      setPostData(p => {
        const next = {
          ...p,
          comments: p.comments + 1,
          commentsList: [...(p.commentsList ?? []), newComment],
        };
        onPostUpdate?.(next);
        return next;
      });
      setCommentText('');
    } catch {}
  };

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
            <p className="font-medium text-gray-900">{postData.author}</p>
            <p className="text-sm text-gray-500">{formatDateTime(postData.time)}</p>
          </div>
        </div>
        <p className="text-gray-700 mb-4">{postData.content}</p>
        <div className="flex items-center gap-6 text-gray-500">
          <button
            className="flex items-center gap-1 hover:text-orange-500"
            onClick={handleLikePost}
          >
            <Heart className="w-4 h-4" />
            <span className="text-sm">{postData.likes}</span>
          </button>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">{postData.comments} comments</span>
          </span>
          <div className="relative">
            <button
              className="flex items-center gap-1 hover:text-orange-500"
              onClick={() => setShowShare(s => !s)}
            >
              <Share2 className="w-4 h-4" />
            </button>
            {showShare && (
              <SharePopup
                url={window.location.href}
                onClose={() => setShowShare(false)}
              />
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
        {(postData.commentsList ?? []).map((c: Comment) => (
          <div key={c.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{c.author}</p>
                <p className="text-sm text-gray-500">{formatDateTime(c.time)}</p>
              </div>
            </div>
            <p className="text-gray-700 mb-3">{c.content}</p>
            <div className="flex items-center gap-4">
              <button
                className="flex items-center gap-1 text-gray-500 hover:text-orange-500"
                onClick={() => handleLikeComment(c.id)}
              >
                <Heart className="w-4 h-4" />
                <span className="text-sm">{c.likes ?? 0}</span>
              </button>
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
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
        />
        <div className="flex justify-end mt-3">
          <Button
            onClick={handleAddComment}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
          >
            Post Comment
          </Button>
        </div>
      </div>
    </div>
  );
}
