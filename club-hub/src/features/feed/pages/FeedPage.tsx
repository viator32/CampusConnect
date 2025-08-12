// src/features/feed/pages/FeedPage.tsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClubs } from '../../clubs/hooks/useClubs';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Search as SearchIcon,
  Calendar,
  MapPin
} from 'lucide-react';
import { bookmarksService } from '../../bookmarks/services/BookmarksService';
import Button from '../../../components/Button';
import SharePopup from '../../../components/SharePopup';
import type { Comment } from '../../clubs/types';

type PostWithMeta = {
  clubId: number;
  clubName: string;
  clubImage: string;
  isJoined: boolean;
} & {
  id: number;
  author: string;
  content: string;
  likes: number;
  comments: number;
  time: string;
  commentsList?: Comment[];
};

type EventFeedItem = {
  type: 'event';
  clubId: number;
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
  const { clubs } = useClubs();

  // flatten posts with club info
  const posts: PostWithMeta[] = useMemo(
    () =>
      clubs.flatMap(club =>
        club.posts.map(post => ({
          ...post,
          clubId: club.id,
          clubName: club.name,
          clubImage: club.image,
          isJoined: club.isJoined
        }))
      ),
    [clubs]
  );

  // build events feed separately
  const events: EventFeedItem[] = useMemo(
    () =>
      clubs.flatMap(club =>
        club.events.map(ev => ({
          type: 'event' as const,
          clubId: club.id,
          clubName: club.name,
          clubImage: club.image,
          isJoinedClub: club.isJoined,
          id: ev.id,
          title: ev.title,
          date: ev.date,
          time: ev.time,
          location: ev.location,
          description: ev.description,
          joinedCount: ev.joined ?? ev.participants?.length ?? 0,
          participants: ev.participants
        }))
      ),
    [clubs]
  );

  // state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'recent' | 'popular' | 'events'>('recent');
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set());
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
  const [sharePostId, setSharePostId] = useState<number | null>(null);
  const [newComments, setNewComments] = useState<Record<number, string>>({});
  const [joinedEvents, setJoinedEvents] = useState<Set<string>>(new Set()); // key: `${clubId}-${eventId}`

  // post filtering & sorting
  const filteredPosts = useMemo(() => {
    let arr = posts.filter(
      p =>
        p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.clubName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (activeTab === 'popular') {
      arr = [...arr].sort((a, b) => b.likes - a.likes);
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
    if (bookmarked.has(post.id)) {
      await bookmarksService.remove(post.id);
      setBookmarked(prev => {
        const next = new Set(prev);
        next.delete(post.id);
        return next;
      });
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
      setBookmarked(prev => new Set(prev).add(post.id));
    }
  };

  const handleCommentChange = (postId: number, text: string) => {
    setNewComments(prev => ({ ...prev, [postId]: text }));
  };
  const postComment = (postId: number) => {
    setNewComments(prev => ({ ...prev, [postId]: '' }));
  };

  const handleJoinEvent = (ev: EventFeedItem) => {
    const key = `${ev.clubId}-${ev.id}`;
    setJoinedEvents(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

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
                        {post.clubName} • {post.time}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <p className="text-gray-700 mb-3">{post.content}</p>

                  {/* Actions */}
                  <div className="flex items-center gap-6 text-gray-500 mb-2">
                    <button className="flex items-center gap-1 hover:text-orange-500">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    <button
                      className="flex items-center gap-1 hover:text-orange-500"
                      onClick={() =>
                        setExpandedPostId(prev => (prev === post.id ? null : post.id))
                      }
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
                  {expandedPostId === post.id && (
                    <div className="mt-4 space-y-4">
                      {(post.commentsList ?? []).map(c => (
                        <div key={c.id} className="bg-gray-50 rounded-lg p-3">
                          <p className="font-medium text-gray-900">{c.author}</p>
                          <p className="text-sm text-gray-700 mb-1">{c.content}</p>
                          <p className="text-xs text-gray-500">{c.time}</p>
                        </div>
                      ))}
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <textarea
                          rows={2}
                          placeholder="Write a comment…"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 resize-none"
                          value={newComments[post.id] || ''}
                          onChange={e =>
                            handleCommentChange(post.id, e.target.value)
                          }
                        />
                        <div className="flex justify-end mt-2">
                          <Button onClick={() => postComment(post.id)}>
                            Post Comment
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
