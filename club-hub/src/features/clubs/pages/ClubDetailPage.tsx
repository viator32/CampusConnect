import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Users,
  BookOpen,
  Calendar,
  MessageSquare,
  MessageCircle,
  Loader2
} from 'lucide-react';
import { Club, Role } from '../types';
import { Subject, Preference } from '../../profile/types';
import { clubService } from '../services/ClubService';
import Button from '../../../components/Button';
import { useProfile } from '../../profile/hooks/useProfile';

import AboutTab     from '../components/AboutTab';
import EventsTab    from '../components/EventsTab';
import ForumTab     from '../components/ForumTab';
import PostsTab     from '../components/PostsTab';
import MembersTab   from '../components/MembersTab';
import ThreadDetail from '../components/ThreadDetail';
import PostDetail   from '../components/PostDetail';

type TabId = 'about'|'events'|'forum'|'posts'|'members';

const ROLE_COLORS: Record<Role, string> = {
  ADMIN: 'bg-red-100 text-red-800',
  MODERATOR: 'bg-blue-100 text-blue-800',
  MEMBER: 'bg-green-100 text-green-800',
};

const ROLE_LABELS: Record<Role, string> = {
  ADMIN: 'Admin',
  MODERATOR: 'Moderator',
  MEMBER: 'Member',
};

const formatEnum = (v: string) =>
  v
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

/**
 * Club detail view with tabs for About, Events, Forum, Posts, and Members.
 * Handles join/leave and routing into post/thread single views.
 */
export default function ClubDetailPage() {
  const { clubId, postId, threadId } = useParams<{ clubId: string; postId?: string; threadId?: string }>();
  const navigate  = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, refresh } = useProfile();

  const [club, setClub]           = useState<Club|null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('about');
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  useEffect(() => {
    if (!clubId) return;
    setLoading(true);
    setError(null);
    clubService
      .getById(clubId)
      .then(c => {
        if (!c) return setClub(null);
        const joined =
          c.isJoined ||
          !!user?.memberships.some(m => m.clubId === c.id) ||
          c.members_list.some(m => String(m.userId) === String(user?.id));
        setClub({ ...c, isJoined: joined });
      })
      .catch(err => setError(err.message ?? 'Failed to load club'))
      .finally(() => setLoading(false));
  }, [clubId, user]);

  useEffect(() => {
    const t = searchParams.get('tab') as TabId | null;
    if (t) setActiveTab(t);
  }, [searchParams]);

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  if (loading || !club) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

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
    const post = club.posts.find(p => p.id === postId);
    if (post)
      return (
        <PostDetail
          post={post}
          onBack={() => navigate(`/clubs/${clubId}?tab=posts`)}
          onPostUpdate={updated =>
            setClub(c =>
              c
                ? { ...c, posts: c.posts.map(p => (p.id === updated.id ? updated : p)) }
                : c
            )
          }
        />
      );
  }

  const userRole: Role | undefined =
    user?.memberships.find(m => m.clubId === club.id)?.role as Role | undefined;

  const tabs: { id: TabId; label: string; icon: React.FC<any> }[] = club.isJoined
    ? [
        { id: 'about',   label: 'About',  icon: BookOpen      },
        { id: 'events',  label: 'Events', icon: Calendar      },
        { id: 'forum',   label: 'Forum',  icon: MessageSquare },
        { id: 'posts',   label: 'Posts',  icon: MessageCircle },
        { id: 'members', label: 'Members',icon: Users         },
      ]
    : [
        { id: 'about', label: 'About', icon: BookOpen }
      ];

  const updateClub = (updated: Club) => setClub(updated);

  const toggleJoin = async () => {
    if (!club) return;
    setError(null);
    const prev = club;
    if (club.isJoined) {
      setClub({ ...club, isJoined: false, members: Math.max(0, club.members - 1) });
      try {
        await clubService.leaveClub(club.id);
        await refresh();
        const updated = await clubService.getById(club.id);
        if (updated) {
          const joined =
            updated.isJoined ||
            updated.members_list.some(m => String(m.userId) === String(user?.id));
          setClub({ ...updated, isJoined: joined });
          setActiveTab('about');
          setSearchParams({ tab: 'about' });
        }
      } catch (err: any) {
        setClub(prev);
        setError(err.message ?? 'Failed to leave club');
      }
    } else {
      setClub({ ...club, isJoined: true, members: club.members + 1 });
      try {
        await clubService.joinClub(club.id);
        await refresh();
        const updated = await clubService.getById(club.id);
        if (updated) {
          const joined =
            updated.isJoined ||
            updated.members_list.some(m => String(m.userId) === String(user?.id));
          setClub({ ...updated, isJoined: joined });
        }
      } catch (err: any) {
        setClub(prev);
        setError(err.message ?? 'Failed to join club');
      }
    }
  };

  return (
    <div className="space-y-6">
       <button onClick={() => navigate('/explore')} className="text-gray-500 hover:text-gray-700">
            ← Back to Explore
          </button>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
         
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {club.avatar ? (
              <img
                src={club.avatar}
                alt={club.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-3xl">
                🏷️
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{club.name}</h1>
              <p className="text-gray-600 flex flex-wrap items-center gap-1">
                <span>{club.members} members</span>
                {club.isJoined && userRole && (
                  <>
                    <span>• Your role:</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[userRole]}`}>
                      {ROLE_LABELS[userRole]}
                    </span>
                  </>
                )}
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                {club.subject !== Subject.NONE && (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded-full text-xs">
                    {formatEnum(club.subject)}
                  </span>
                )}
                {club.interest !== Preference.NONE && (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded-full text-xs">
                    {formatEnum(club.interest)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button onClick={toggleJoin} className="text-sm">
            {club.isJoined ? 'Leave Club' : 'Join Club'}
          </Button>
          <button
            onClick={() => {
              setActiveTab('about');
              setSearchParams({ tab: 'about' });
            }}
            className={`sm:hidden flex items-center gap-1 px-3 py-2 rounded border text-sm font-medium ${
              activeTab === 'about'
                ? 'border-orange-500 text-orange-600'
                : 'border-gray-300 text-gray-600'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            About
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex w-full space-x-2 sm:space-x-8">
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
                className={`flex items-center justify-center whitespace-nowrap gap-2 py-2 px-1 border-b-2 font-medium text-sm flex-1 sm:flex-none ${
                  tab.id === 'about' ? 'hidden sm:flex' : ''
                } ${
                  isActive
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab contents */}
      {activeTab === 'about'  && (
        <AboutTab
          club={club}
          onUpdate={updateClub}
          currentUserRole={userRole}
        />
      )}
      {activeTab === 'events' && (
        <EventsTab
          club={club}
          onClubUpdate={updateClub}
          userRole={userRole}
        />
      )}
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
      {activeTab === 'members' && (
        <MembersTab
          club={club}
          currentUserRole={userRole}
          onUpdate={members => updateClub({ ...club, members_list: members })}
        />
      )}
    </div>
  );
}
