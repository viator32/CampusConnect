// src/features/feed/pages/FeedPage.tsx
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Search as SearchIcon,
  Calendar,
  MapPin,
  Loader2
} from 'lucide-react';
import { bookmarksService } from '../../bookmarks/services/BookmarksService';
import Toast from '../../../components/Toast';
import Button from '../../../components/Button';
import SharePopup from '../../../components/SharePopup';
import { clubService } from '../../clubs/services/ClubService';
import { feedService } from '../services/FeedService';
import { formatDateTime } from '../../../utils/date';

type PostWithMeta = {
  clubId: string;
  clubName: string;
  clubImage: string;
  isJoined: boolean;
} & {
  id: string;
  author: string;
  content: string;
  likes: number;
  comments: number;
  time: string;
};

type EventFeedItem = {
  type: 'event';
  clubId: string;
  clubName: string;
  clubImage: string;
  isJoinedClub: boolean;
  id: number;
  title: string;
  date: string;
  time: string;
  location?: string;
  description?: string;
  joinedCount: number;
  participants?: { id: number; name: string; surname: string; email: string }[];
};

export default function FeedPage() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState<PostWithMeta[]>([]);
  const [events, setEvents] = useState<EventFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    setError(null);
    try {
      const items = await feedService.getPage(page, 10);
      const newPosts = items.filter((i: any) => i.type !== 'event') as PostWithMeta[];
      const newEvents = items.filter((i: any) => i.type === 'event') as EventFeedItem[];
      setPosts(prev => [...prev, ...newPosts]);
      setEvents(prev => [...prev, ...newEvents]);
      setPage(p => p + 1);
      if (items.length < 10) setHasMore(false);
    } catch (err: any) {
      setError(err.message ?? 'Failed to load feed');
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [page, hasMore, loadingMore]);

  useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const observer = useRef<IntersectionObserver | null>(null);
  const loaderRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loadingMore, hasMore, loadMore]
  );

  // state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'recent' | 'popular' | 'events'>('recent');
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [sharePostId, setSharePostId] = useState<string | null>(null);
  const [joinedEvents, setJoinedEvents] = useState<Set<string>>(new Set()); // key: `${clubId}-${eventId}`
  const [bookmarkError, setBookmarkError] = useState<string | null>(null);

  // post filtering & sorting
  const filteredPosts = useMemo(() => {
    let arr = posts.filter(
      p =>
        p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.clubName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (activeTab === 'recent') {
      arr = [...arr].sort((a, b) => b.likes - a.likes);
    } else if (activeTab === 'popular') {
      arr = [...arr].sort(
        (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
      );
    }
    return arr;
  }, [posts, searchQuery, activeTab]);

  // event filtering & sorting
  const filteredEvents = useMemo(() => {
    let evs = events.filter(e => {
      const q = searchQuery.toLowerCase();
      return (
        e.title.toLowerCase().includes(q) ||
        e.clubName.toLowerCase().includes(q) ||
        (e.description?.toLowerCase().includes(q) ?? false)
      );
    });
    if (activeTab === 'popular') {
      evs = [...evs].sort((a, b) => b.joinedCount - a.joinedCount);
    } else {
      evs = [...evs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    return evs;
  }, [events, searchQuery, activeTab]);

  const toggleBookmark = async (post: PostWithMeta) => {
    const prev = new Set(bookmarked);
    const isBookmarked = prev.has(post.id);
    if (isBookmarked) {
      setBookmarked(next => {
        const copy = new Set(next);
        copy.delete(post.id);
        return copy;
      });
    } else {
      setBookmarked(next => {
        const copy = new Set(next);
        copy.add(post.id);
        return copy;
      });
    }
    try {
      if (isBookmarked) {
        await bookmarksService.remove(post.id);
      } else {
        await bookmarksService.add({
          id: post.id,
          author: post.author,
          content: post.content,
          time: post.time,
          likes: post.likes,
          comments: post.comments,
          clubId: post.clubId,
          clubName: post.clubName,
          clubImage: post.clubImage
        });
      }
    } catch (err) {
      setBookmarked(prev);
      setBookmarkError('Failed to update bookmark');
    }
  };

  const likePost = async (postId: string) => {
    setPosts(prev =>
      prev.map(p => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
    );
    try {
      await clubService.likePost(postId);
    } catch {
      // ignore backend parse errors; keep optimistic like
    }
  };


  const handleJoinEvent = (ev: EventFeedItem) => {
    const key = `${ev.clubId}-${ev.id}`;
    setJoinedEvents(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  return (
    <div className="flex space-x-6">
      {/* Main Column */}
      <main className="flex-1 space-y-6">
        {/* Search */}
        <div className="relative max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={activeTab === 'events' ? 'Search events...' : 'Search posts...'}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <nav className="border-b border-gray-200">
          <ul className="flex space-x-4">
            {(['recent', 'popular', 'events'] as const).map(tab => (
              <li key={tab}>
                <button
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 font-medium ${
                    activeTab === tab
                      ? 'border-b-2 border-orange-500 text-orange-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab === 'events' ? 'Events' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Feed Content */}
        {activeTab === 'events' ? (
          <>
            {filteredEvents.length === 0 && (
              <p className="text-center text-gray-500">No events to show.</p>
            )}
            <div className="space-y-4">
              {filteredEvents.map(ev => {
                const key = `${ev.clubId}-${ev.id}`;
                const joinedByUser = joinedEvents.has(key);
                return (
                  <div
                    key={`event-${ev.clubId}-${ev.id}`}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{ev.clubImage}</div>
                        <div>
                          <p className="font-medium text-gray-900">{ev.clubName}</p>
                          <p className="text-sm text-gray-500">{ev.title}</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 flex gap-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{ev.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{ev.location || 'TBA'}</span>
                        </div>
                      </div>
                    </div>
                    {ev.description && (
                      <p className="text-gray-700 mb-2">{ev.description}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-gray-500 flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Share2 className="w-4 h-4" />
                          <span className="text-sm">{ev.joinedCount} joined</span>
                        </div>
                      </div>
                      <div>
                        <Button
                          onClick={() => handleJoinEvent(ev)}
                          className={`px-4 py-2 rounded-lg text-sm ${
                            joinedByUser
                              ? 'bg-gray-200 text-gray-700 cursor-default'
                              : 'bg-orange-500 text-white hover:bg-orange-600'
                          }`}
                        >
                          {joinedByUser ? 'Joined' : 'Join'}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            {filteredPosts.length === 0 && (
              <p className="text-center text-gray-500">No posts to show.</p>
            )}
            <div className="space-y-4">
              {filteredPosts.map(post => (
                <div
                  key={`${post.clubId}-${post.id}`}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                >
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-lg">{post.clubImage}</div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{post.author}</p>
                      <p className="text-sm text-gray-500">
                        {post.clubName} • {formatDateTime(post.time)}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <p className="text-gray-700 mb-3">{post.content}</p>

                  {/* Actions */}
                  <div className="flex items-center gap-6 text-gray-500 mb-2">
                    <button
                      className="flex items-center gap-1 hover:text-orange-500"
                      onClick={() => {
                        likePost(post.id);
                        navigate(`/clubs/${post.clubId}/posts/${post.id}`);
                      }}
                    >
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    <button
                      className="flex items-center gap-1 hover:text-orange-500"
                      onClick={() => navigate(`/clubs/${post.clubId}/posts/${post.id}`)}
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">{post.comments}</span>
                    </button>
                    <div className="relative">
                      <button
                        className="flex items-center gap-1 hover:text-orange-500"
                        onClick={() =>
                          setSharePostId(prev => (prev === post.id ? null : post.id))
                        }
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      {sharePostId === post.id && (
                        <SharePopup
                          url={`${window.location.origin}/clubs/${post.clubId}/posts/${post.id}`}
                          onClose={() => setSharePostId(null)}
                        />
                      )}
                    </div>
                    <button
                      onClick={() => toggleBookmark(post)}
                      className="flex items-center gap-1 hover:text-orange-500"
                    >
                      <Bookmark className={`w-4 h-4 ${bookmarked.has(post.id) ? 'text-orange-500' : ''}`} />
                    </button>
                  </div>

                  {/* Comments */}
                  {/* Comments are handled in PostDetail view */}
                </div>
              ))}
            </div>
          </>
        )}
        <div ref={loaderRef} />
        {loadingMore && (
          <div className="flex justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
          </div>
        )}
      </main>
      {bookmarkError && (
        <Toast message={bookmarkError} onClose={() => setBookmarkError(null)} />
      )}
    </div>
  );
}
