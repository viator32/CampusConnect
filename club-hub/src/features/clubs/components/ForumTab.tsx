import React, { useState, useEffect, useRef } from 'react';
import { Club, Thread } from '../types';
import Button from '../../../components/Button';
import { clubService } from '../services/ClubService';
import { ApiError } from '../../../services/api';
import { Loader2 } from 'lucide-react';

/** Props for the club Forum tab. */
interface ForumTabProps {
  club: Club;
  onClubUpdate: (c: Club) => void;
  onSelectThread: (t: Thread) => void;
}

/**
 * Forum tab for creating and browsing discussion threads inside a club.
 */
export default function ForumTab({ club, onClubUpdate, onSelectThread }: ForumTabProps) {
  const [title, setTitle]   = useState('');
  const [content, setContent] = useState('');
  const [error, setError]   = useState<string|null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState<number>(club.forum_threads.length || 0);
  const clubRef = useRef(club);
  useEffect(() => { clubRef.current = club; }, [club]);

  useEffect(() => {
    // Always fetch fresh threads when this tab mounts
    setLoading(true);
    setHasMore(true);
    clubService
      .listThreadsPage(club.id, 0, 10)
      .then(list => {
        onClubUpdate({ ...clubRef.current, forum_threads: list });
        setOffset(list.length);
        if (list.length < 10) setHasMore(false);
      })
      .catch(err => setError(err?.message ?? 'Failed to load threads'))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    setError(null);
    if (!title.trim() || !content.trim()) {
      setError('Both title and content are required.');
      return;
    }
    try {
      const created = await clubService.createThread(club.id, title.trim(), content.trim());
      onClubUpdate({ ...club, forum_threads: [ created, ...club.forum_threads ] });
      setTitle(''); setContent('');
    } catch (e) {
      const err = e as any;
      if (err instanceof ApiError && err.status === 403) {
        setError('Only club members can create threads.');
      } else {
        setError('Failed to create thread');
      }
    }
  };

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const limit = 10;
      const list = await clubService.listThreadsPage(club.id, offset, limit);
      const existing = new Set((clubRef.current.forum_threads ?? []).map(t => t.id));
      const filtered = list.filter(t => {
        if (existing.has(t.id)) return false;
        existing.add(t.id);
        return true;
      });
      if (filtered.length > 0) {
        onClubUpdate({ ...clubRef.current, forum_threads: [...clubRef.current.forum_threads, ...filtered] });
      }
      setOffset(o => o + limit);
      if (list.length < limit) setHasMore(false);
    } catch (e) {
      setError('Failed to load more threads');
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
        <input
          type="text"
          placeholder="Thread title"
          className="w-full border border-gray-300 rounded-lg px-3 py-1 mb-2"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Thread content"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 resize-none"
          rows={3}
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <Button
          onClick={handleCreate}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
        >
          Create Thread
        </Button>
      </div>

      {loading && (
        <div className="flex justify-center py-6">
          <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
        </div>
      )}

      {club.forum_threads.map(thread => (
        <div
          key={thread.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md cursor-pointer"
          onClick={() => onSelectThread(thread)}
        >
          <h4 className="font-semibold text-gray-900 mb-2">{thread.title}</h4>
          <p className="text-xs text-gray-500">
            By {thread.author} • {thread.replies} replies
          </p>
        </div>
      ))}

      {hasMore && !loading && (
        <div className="flex justify-center py-4">
          <Button onClick={loadMore} disabled={loadingMore} className="px-4 py-2">
            {loadingMore ? (
              <span className="inline-flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</span>
            ) : (
              'Load more'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
