import React, { useEffect, useMemo, useState } from 'react';
import { Thread, Comment } from '../types';
import { Share2, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import Button from '../../../components/Button';
import SharePopup from '../../../components/SharePopup';
import Avatar from '../../../components/Avatar';
import { formatDateTime } from '../../../utils/date';
import { clubService } from '../services/ClubService';
import { ApiError } from '../../../services/api';

/** Props for the dedicated thread view. */
interface ThreadDetailProps {
  thread: Thread;
  onBack: () => void;
}

/** Detailed thread view with replies and share actions. */
export default function ThreadDetail({ thread, onBack }: ThreadDetailProps) {
  const [showShare, setShowShare] = useState(false);
  const [threadState, setThreadState] = useState<Thread>(thread);
  const [comments, setComments] = useState<Comment[]>(thread.posts ?? []);
  const [error, setError] = useState<string | null>(null);
  const [reply, setReply] = useState<string>('');
  const [posting, setPosting] = useState<boolean>(false);

  // Sorting helper for comments by score (upvotes - downvotes)
  const sortByScore = (list: Comment[]) =>
    [...list].sort((a, b) => ((b.upvotes ?? 0) - (b.downvotes ?? 0)) - ((a.upvotes ?? 0) - (a.downvotes ?? 0)));

  // Keep local comments in sync with the provided thread object
  useEffect(() => {
    setThreadState(thread);
    const list = thread.posts ?? [];
    setComments(sortByScore(list));
  }, [thread.id, thread.posts]);

  const threadScore = useMemo(
    () => (threadState.upvotes ?? 0) - (threadState.downvotes ?? 0),
    [threadState.upvotes, threadState.downvotes]
  );

  // Toggle upvote/downvote on the thread
  const toggleThreadUpvote = async () => {
    const wasUpvoted = !!threadState.upvoted;
    setThreadState(t => ({
      ...t,
      upvoted: !wasUpvoted,
      downvoted: wasUpvoted ? t.downvoted : false,
      upvotes: (t.upvotes ?? 0) + (wasUpvoted ? -1 : 1),
      downvotes: wasUpvoted ? (t.downvotes ?? 0) : Math.max(0, (t.downvotes ?? 0) - (t.downvoted ? 1 : 0)),
    }));
    try {
      if (wasUpvoted) await clubService.removeUpvoteThread(threadState.id);
      else await clubService.upvoteThread(threadState.id);
    } catch (e) {
      // revert on error
      setThreadState(t => ({
        ...t,
        upvoted: wasUpvoted,
        downvoted: t.downvoted,
        upvotes: (t.upvotes ?? 0) + (wasUpvoted ? 1 : -1),
        downvotes: t.downvotes,
      }));
      const err = e as any;
      if (err instanceof ApiError && err.status === 403) setError('You must be a member to vote.');
    }
  };

  const toggleThreadDownvote = async () => {
    const wasDownvoted = !!threadState.downvoted;
    setThreadState(t => ({
      ...t,
      downvoted: !wasDownvoted,
      upvoted: wasDownvoted ? t.upvoted : false,
      downvotes: (t.downvotes ?? 0) + (wasDownvoted ? -1 : 1),
      upvotes: wasDownvoted ? (t.upvotes ?? 0) : Math.max(0, (t.upvotes ?? 0) - (t.upvoted ? 1 : 0)),
    }));
    try {
      if (wasDownvoted) await clubService.removeDownvoteThread(threadState.id);
      else await clubService.downvoteThread(threadState.id);
    } catch (e) {
      // revert on error
      setThreadState(t => ({
        ...t,
        downvoted: wasDownvoted,
        upvoted: t.upvoted,
        downvotes: (t.downvotes ?? 0) + (wasDownvoted ? 1 : -1),
        upvotes: t.upvotes,
      }));
      const err = e as any;
      if (err instanceof ApiError && err.status === 403) setError('You must be a member to vote.');
    }
  };

  // Toggle voting on a comment
  const toggleCommentUpvote = async (commentId: string) => {
    let prevUpvoted = false;
    let prevDownvoted = false;
    setComments(prev => sortByScore(prev.map(c => {
      if (c.id !== commentId) return c;
      prevUpvoted = !!c.upvoted;
      prevDownvoted = !!c.downvoted;
      const nextUpvoted = !prevUpvoted;
      const nextDownvoted = prevDownvoted && nextUpvoted ? false : prevDownvoted;
      return {
        ...c,
        upvoted: nextUpvoted,
        downvoted: nextDownvoted,
        upvotes: (c.upvotes ?? 0) + (nextUpvoted ? 1 : -1),
        downvotes: nextDownvoted ? Math.max(0, (c.downvotes ?? 0) - 1) : (c.downvotes ?? 0),
      };
    })));
    try {
      if (prevUpvoted) await clubService.removeUpvoteComment(commentId);
      else await clubService.upvoteComment(commentId);
    } catch (e) {
      // revert
      setComments(prev => sortByScore(prev.map(c => {
        if (c.id !== commentId) return c;
        return {
          ...c,
          upvoted: prevUpvoted,
          downvoted: prevDownvoted,
          upvotes: (c.upvotes ?? 0) + (prevUpvoted ? 1 : -1),
          downvotes: prevDownvoted ? (c.downvotes ?? 0) + 1 : (c.downvotes ?? 0),
        };
      })));
      const err = e as any;
      if (err instanceof ApiError && err.status === 403) setError('You must be a member to vote.');
    }
  };

  const toggleCommentDownvote = async (commentId: string) => {
    let prevUpvoted = false;
    let prevDownvoted = false;
    setComments(prev => sortByScore(prev.map(c => {
      if (c.id !== commentId) return c;
      prevUpvoted = !!c.upvoted;
      prevDownvoted = !!c.downvoted;
      const nextDownvoted = !prevDownvoted;
      const nextUpvoted = prevUpvoted && nextDownvoted ? false : prevUpvoted;
      return {
        ...c,
        downvoted: nextDownvoted,
        upvoted: nextUpvoted,
        downvotes: (c.downvotes ?? 0) + (nextDownvoted ? 1 : -1),
        upvotes: nextUpvoted ? Math.max(0, (c.upvotes ?? 0) - 1) : (c.upvotes ?? 0),
      };
    })));
    try {
      if (prevDownvoted) await clubService.removeDownvoteComment(commentId);
      else await clubService.downvoteComment(commentId);
    } catch (e) {
      // revert
      setComments(prev => sortByScore(prev.map(c => {
        if (c.id !== commentId) return c;
        return {
          ...c,
          upvoted: prevUpvoted,
          downvoted: prevDownvoted,
          downvotes: (c.downvotes ?? 0) + (prevDownvoted ? 1 : -1),
          upvotes: prevUpvoted ? (c.upvotes ?? 0) + 1 : (c.upvotes ?? 0),
        };
      })));
      const err = e as any;
      if (err instanceof ApiError && err.status === 403) setError('You must be a member to vote.');
    }
  };

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="text-gray-500 hover:text-gray-700">
        ← Back to Forum
      </button>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Avatar avatar={threadState.avatar} size={40} />
          <div>
            <p className="font-medium text-gray-900">{threadState.author}</p>
            <p className="text-sm text-gray-500">Original Post</p>
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">{threadState.title}</h2>
        {threadState.content && <p className="text-gray-700 mb-4">{threadState.content}</p>}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>{threadState.replies} replies</span>
          <span>{threadState.lastActivity}</span>
          <div className="flex items-center gap-2 text-gray-600">
            <button
              className={`p-1 rounded hover:bg-gray-100 ${threadState.upvoted ? 'text-orange-600' : ''}`}
              onClick={toggleThreadUpvote}
              aria-label="Upvote thread"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <span className="text-sm">{threadState.upvotes ?? 0}</span>
            <button
              className={`p-1 rounded hover:bg-gray-100 ${threadState.downvoted ? 'text-blue-600' : ''}`}
              onClick={toggleThreadDownvote}
              aria-label="Downvote thread"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
            <span className="text-sm">{threadState.downvotes ?? 0}</span>
            <span className="text-xs text-gray-400">• score: {threadScore}</span>
          </div>
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
            <div className="flex items-center gap-2 text-gray-600">
              <button
                className={`p-1 rounded hover:bg-gray-100 ${post.upvoted ? 'text-orange-600' : ''}`}
                onClick={() => toggleCommentUpvote(post.id)}
                aria-label="Upvote reply"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <span className="text-sm">{post.upvotes ?? 0}</span>
              <button
                className={`p-1 rounded hover:bg-gray-100 ${post.downvoted ? 'text-blue-600' : ''}`}
                onClick={() => toggleCommentDownvote(post.id)}
                aria-label="Downvote reply"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <span className="text-sm">{post.downvotes ?? 0}</span>
              <span className="text-xs text-gray-400">• score: {(post.upvotes ?? 0) - (post.downvotes ?? 0)}</span>
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
                const created = await clubService.addThreadComment(threadState.id, reply.trim());
                setComments(prev => sortByScore([...prev, created]));
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
