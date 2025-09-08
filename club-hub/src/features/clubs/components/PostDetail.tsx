import React, { useState, useEffect } from 'react';
import { Post, Comment } from '../types';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import Button from '../../../components/Button';
import Toast from '../../../components/Toast';
import { ApiError } from '../../../services/api';
import SharePopup from '../../../components/SharePopup';
import { clubService } from '../services/ClubService';
import { formatDateTime } from '../../../utils/date';
import Avatar from '../../../components/Avatar';
import ImageLightbox from '../../../components/ImageLightbox';

/** Props for the dedicated post view. */
interface PostDetailProps {
  post: Post;
  onBack: () => void;
  onPostUpdate?: (p: Post) => void;
}

/** Detailed post view with comments, likes, and sharing. */
export default function PostDetail({ post, onBack, onPostUpdate }: PostDetailProps) {
  const [showShare, setShowShare] = useState(false);
  const [postData, setPostData] = useState(post);
  const [commentText, setCommentText] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  useEffect(() => {
    clubService
      .listComments(post.id)
      .then(comments => {
        setPostData(p => ({
          ...p,
          comments: comments.length,
          commentsList: comments,
        }));
        onPostUpdate?.({ ...post, comments: comments.length, commentsList: comments });
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.id]);

  const handleLikePost = async () => {
    const isLiked = postData.liked ?? false;
    setPostData(p => {
      const next = {
        ...p,
        liked: !isLiked,
        likes: p.likes + (isLiked ? -1 : 1),
      };
      onPostUpdate?.(next);
      return next;
    });
    try {
      if (isLiked) await clubService.unlikePost(postData.id);
      else await clubService.likePost(postData.id);
    } catch (e) {
      const err = e as any;
      if (err instanceof ApiError && err.status === 403) {
        setActionError('You do not have permission to like posts.');
      }
      setPostData(p => {
        const next = {
          ...p,
          liked: isLiked,
          likes: p.likes + (isLiked ? 1 : -1),
        };
        onPostUpdate?.(next);
        return next;
      });
    }
  };

  const handleLikeComment = async (commentId: string) => {
    // Optimistically toggle like/unlike on the specific comment
    let prevLiked = false;
    setPostData(p => {
      const next = {
        ...p,
        commentsList: (p.commentsList ?? []).map(c => {
          if (c.id !== commentId) return c;
          prevLiked = !!c.liked;
          const nowLiked = !prevLiked;
          const nextLikes = (c.likes ?? 0) + (nowLiked ? 1 : -1);
          return { ...c, liked: nowLiked, likes: Math.max(0, nextLikes) };
        }),
      };
      onPostUpdate?.(next);
      return next;
    });
    try {
      if (prevLiked) await clubService.unlikeComment(commentId);
      else await clubService.likeComment(commentId);
    } catch (e) {
      const err = e as any;
      if (err instanceof ApiError && err.status === 403) {
        setActionError('You do not have permission to like comments.');
      }
      // Revert on error
      setPostData(p => ({
        ...p,
        commentsList: (p.commentsList ?? []).map(c => {
          if (c.id !== commentId) return c;
          const revertedLikes = (c.likes ?? 0) + (c.liked ? -1 : 1);
          return { ...c, liked: !c.liked, likes: Math.max(0, revertedLikes) };
        }),
      }));
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      await clubService.addComment(postData.id, commentText);
    } catch (e) {
      const err = e as any;
      if (err instanceof ApiError && err.status === 403) {
        setActionError('You do not have permission to comment.');
      }
    }

    try {
      const comments = await clubService.listComments(postData.id);
      setPostData(p => {
        const next = {
          ...p,
          comments: comments.length,
          commentsList: comments,
        };
        onPostUpdate?.(next);
        return next;
      });
      setCommentText('');
    } catch {}
  };

  return (
    <>
    <div className="space-y-6">
      {actionError && <Toast message={actionError} onClose={() => setActionError(null)} />}
      <button onClick={onBack} className="text-gray-500 hover:text-gray-700">
        ← Back to Posts
      </button>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Avatar avatar={postData.avatar} size={40} />
          <div>
            <p className="font-medium text-gray-900">{postData.author}</p>
            <p className="text-sm text-gray-500">{formatDateTime(postData.time)}</p>
          </div>
        </div>
        <p className="text-gray-700 mb-4">{postData.content}</p>
        {postData.picture && (
          <button
            className="w-full rounded-lg bg-gray-100 mb-4 flex items-center justify-center h-72 md:h-96 lg:h-[32rem] overflow-hidden"
            onClick={() => setLightboxSrc(postData.picture!)}
            aria-label="Open image"
          >
            <img
              src={postData.picture}
              alt="attachment"
              className="max-h-full max-w-full object-contain"
              loading="lazy"
              decoding="async"
            />
          </button>
        )}
        <div className="flex items-center gap-6 text-gray-500">
          <button
            className="flex items-center gap-1 hover:text-orange-500"
            onClick={handleLikePost}
          >
            <Heart className={`w-4 h-4 ${postData.liked ? 'text-orange-500' : ''}`} />
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
              <Avatar avatar={c.author?.avatar} size={32} />
              <div>
                <p className="font-medium text-gray-900">{c.author?.username}</p>
                <p className="text-sm text-gray-500">{formatDateTime(c.time)}</p>
              </div>
            </div>
            <p className="text-gray-700 mb-3">{c.content}</p>
            <div className="flex items-center gap-4">
              <button
                className="flex items-center gap-1 text-gray-500 hover:text-orange-500"
                onClick={() => handleLikeComment(c.id)}
              >
                <Heart className={`w-4 h-4 ${c.liked ? 'text-orange-500' : ''}`} />
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
    {lightboxSrc && (
      <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
    )}
  </>
  );
}
