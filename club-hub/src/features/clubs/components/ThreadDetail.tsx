import React, { useEffect, useState } from 'react';
import { Thread, Comment } from '../types';
import { Heart, Share2 } from 'lucide-react';
import Button from '../../../components/Button';
import SharePopup from '../../../components/SharePopup';
import Avatar from '../../../components/Avatar';
import { formatDateTime } from '../../../utils/date';
import { clubService } from '../services/ClubService';
import { Loader2 } from 'lucide-react';
import { ApiError } from '../../../services/api';

/** Props for the dedicated thread view. */
interface ThreadDetailProps {
  thread: Thread;
  onBack: () => void;
}

/** Detailed thread view with replies and share actions. */
export default function ThreadDetail({ thread, onBack }: ThreadDetailProps) {
  const [showShare, setShowShare] = useState(false);
  const [comments, setComments] = useState<Comment[]>(thread.posts ?? []);
  const [error, setError] = useState<string | null>(null);
  const [reply, setReply] = useState<string>('');
  const [posting, setPosting] = useState<boolean>(false);

  // Keep local comments in sync with the provided thread object
  useEffect(() => {
    setComments(thread.posts ?? []);
  }, [thread.id, thread.posts]);

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="text-gray-500 hover:text-gray-700">
        ← Back to Forum
      </button>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Avatar avatar={thread.avatar} size={40} />
          <div>
            <p className="font-medium text-gray-900">{thread.author}</p>
            <p className="text-sm text-gray-500">Original Post</p>
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">{thread.title}</h2>
        {thread.content && <p className="text-gray-700 mb-4">{thread.content}</p>}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>{thread.replies} replies</span>
          <span>{thread.lastActivity}</span>
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
        <h3 className="text-lg font-semibold text-gray-900">Replies</h3>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {comments.map((post: Comment) => (
          <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <Avatar avatar={post.author?.avatar} size={32} />
              <div>
                <p className="font-medium text-gray-900">{post.author?.username}</p>
                <p className="text-sm text-gray-500">{formatDateTime(post.time)}</p>
              </div>
            </div>
            <p className="text-gray-700 mb-3">{post.content}</p>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1 text-gray-500 hover:text-orange-500">
                <Heart className={`w-4 h-4 ${post.liked ? 'text-orange-500' : ''}`} />
                <span className="text-sm">{post.likes ?? 0}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Add a Reply</h4>
        <textarea
          placeholder="Write your reply..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
          rows={3}
          value={reply}
          onChange={e => setReply(e.target.value)}
        />
        <div className="flex justify-end mt-3">
          <Button
            variant="primary"
            disabled={posting || !reply.trim()}
            onClick={async () => {
              if (!reply.trim()) return;
              setPosting(true);
              setError(null);
              try {
                const created = await clubService.addThreadComment(thread.id, reply.trim());
                setComments(prev => [...prev, created]);
                setReply('');
              } catch (e) {
                const err = e as any;
                if (err instanceof ApiError && err.status === 403) {
                  setError('You must be a member to comment.');
                } else {
                  setError('Failed to post reply');
                }
              } finally {
                setPosting(false);
              }
            }}
          >
            {posting ? (
              <span className="inline-flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Posting…</span>
            ) : (
              'Post Reply'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
