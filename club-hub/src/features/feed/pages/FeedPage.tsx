// src/features/feed/pages/FeedPage.tsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClubs } from '../../clubs/hooks/useClubs';
import { useProfile } from '../../profile/hooks/useProfile';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Search as SearchIcon
} from 'lucide-react';
import Button from '../../../components/Button';

export default function FeedPage() {
  const navigate = useNavigate();
  const { clubs } = useClubs();
  const { user } = useProfile();

  // flatten posts with club info
  const posts = useMemo(
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

  // state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'recent' | 'popular' | 'following'>('recent');
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set());
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
  const [newComments, setNewComments] = useState<Record<number,string>>({});

  // filter & sort
  const filteredPosts = useMemo(() => {
    let arr = posts.filter(
      p =>
        p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.clubName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (activeTab === 'following') {
      arr = arr.filter(p => p.isJoined);
    } else if (activeTab === 'popular') {
      arr = [...arr].sort((a,b) => b.likes - a.likes);
    }
    return arr;
  }, [posts, searchQuery, activeTab]);

  // suggestions by interest
  const suggestions = useMemo(() => {
    if (!user) return [];
    return clubs.filter(
      c =>
        !c.isJoined &&
        user.interests.some(i => c.category.toLowerCase() === i.toLowerCase())
    );
  }, [clubs, user]);

  const toggleBookmark = (postId:number) => {
    setBookmarked(prev => {
      const next = new Set(prev);
      next.has(postId) ? next.delete(postId) : next.add(postId);
      return next;
    });
  };

  const handleCommentChange = (postId:number, text:string) => {
    setNewComments(prev => ({ ...prev, [postId]: text }));
  };
  const postComment = (postId:number) => {
    // TODO: persist
    setNewComments(prev => ({ ...prev, [postId]: '' }));
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
            placeholder="Search posts..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <nav className="border-b border-gray-200">
          <ul className="flex space-x-4">
            {(['recent','popular','following'] as const).map(tab => (
              <li key={tab}>
                <button
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 font-medium ${
                    activeTab === tab
                      ? 'border-b-2 border-orange-500 text-orange-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Posts */}
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
                <button className="flex items-center gap-1 hover:text-orange-500">
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleBookmark(post.id)}
                  className="flex items-center gap-1 hover:text-orange-500"
                >
                  <Bookmark className="w-4 h-4" />
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
                      onChange={e => handleCommentChange(post.id, e.target.value)}
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
      </main>

      {/* Sidebar Suggestions */}
      <aside className="w-80 flex-shrink-0">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky ">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            You might like
          </h2>
          {suggestions.length > 0 ? (
            <div className="space-y-4">
              {suggestions.map(c => (
                <div
                  key={c.id}
                  className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                  onClick={() => navigate(`/clubs/${c.id}`)}
                >
                  <div className="text-2xl">{c.image}</div>
                  <div>
                    <p className="font-medium text-gray-900">{c.name}</p>
                    <p className="text-sm text-gray-600">{c.category}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No suggestions right now.</p>
          )}
        </div>
      </aside>
    </div>
  );
}
