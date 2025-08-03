import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Users,
  BookOpen,
  Calendar,
  MessageSquare,
  MessageCircle
} from 'lucide-react';
import { Club } from '../types';
import { ClubService } from '../services/ClubService';

import AboutTab     from '../components/AboutTab';
import EventsTab    from '../components/EventsTab';
import ForumTab     from '../components/ForumTab';
import PostsTab     from '../components/PostsTab';
import MembersTab   from '../components/MembersTab';
import ThreadDetail from '../components/ThreadDetail';
import PostDetail   from '../components/PostDetail';

type TabId = 'about'|'events'|'forum'|'posts'|'members';

export default function ClubDetailPage() {
  const { clubId, postId, threadId } = useParams<{ clubId: string; postId?: string; threadId?: string }>();
  const navigate  = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [club, setClub]           = useState<Club|null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('about');

  useEffect(() => {
    if (!clubId) return;
    ClubService.getById(Number(clubId))
      .then(c => setClub(c ?? null));
  }, [clubId]);

  useEffect(() => {
    const t = searchParams.get('tab') as TabId | null;
    if (t) setActiveTab(t);
  }, [searchParams]);

  if (!club) return <div>Loading…</div>;

  // single‑views via routing
  if (threadId && club) {
    const thread = club.forum_threads.find(t => t.id === Number(threadId));
    if (thread)
      return (
        <ThreadDetail
          thread={thread}
          onBack={() => navigate(`/clubs/${clubId}?tab=forum`)}
        />
      );
  }
  if (postId && club) {
    const post = club.posts.find(p => p.id === Number(postId));
    if (post)
      return (
        <PostDetail
          post={post}
          onBack={() => navigate(`/clubs/${clubId}?tab=posts`)}
        />
      );
  }

  const tabs: { id: TabId; label: string; icon: React.FC<any> }[] = [
    { id: 'about',   label: 'About',  icon: BookOpen      },
    { id: 'events',  label: 'Events', icon: Calendar      },
    { id: 'forum',   label: 'Forum',  icon: MessageSquare },
    { id: 'posts',   label: 'Posts',  icon: MessageCircle },
    { id: 'members', label: 'Members',icon: Users         },
  ];

  const updateClub = (updated: Club) => setClub(updated);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700">
          ← Back
        </button>
        <div className="flex items-center gap-3">
          <div className="text-3xl">{club.image}</div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{club.name}</h1>
            <p className="text-gray-600">{club.members} members</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            const Icon     = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchParams({ tab: tab.id });
                }}
                className={`
                  flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm
                  ${isActive
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab contents */}
      {activeTab === 'about'  && <AboutTab   club={club} onUpdate={updateClub}               />}
      {activeTab === 'events' && <EventsTab  club={club} onClubUpdate={updateClub}           />}
      {activeTab === 'forum'  && (
        <ForumTab
          club={club}
          onClubUpdate={updateClub}
          onSelectThread={thread => navigate(`/clubs/${club.id}/threads/${thread.id}`)}
        />
      )}
      {activeTab === 'posts'  && (
        <PostsTab
          club={club}
          onClubUpdate={updateClub}
          onSelectPost={post => navigate(`/clubs/${club.id}/posts/${post.id}`)}
        />
      )}
      {activeTab === 'members' && <MembersTab club={club}                                    />}
    </div>
  );
}
