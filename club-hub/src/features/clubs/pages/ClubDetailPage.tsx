import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, MessageSquare, MessageCircle, Users, User as UserIcon } from 'lucide-react';
import { Club, Thread, Post } from '../types';
import { ClubService } from '../services/ClubService';
import Button from '../../../components/Button';

import AboutTab from '../components/AboutTab';
import EventsTab from '../components/EventsTab';
import ForumTab from '../components/ForumTab';
import PostsTab from '../components/PostsTab';
import MembersTab from '../components/MembersTab';

const tabs = [
  { id: 'about',   label: 'About',  icon: BookOpen      },
  { id: 'events',  label: 'Events', icon: Calendar      },
  { id: 'forum',   label: 'Forum',  icon: MessageSquare },
  { id: 'posts',   label: 'Posts',  icon: MessageCircle },
  { id: 'members', label: 'Members',icon: Users         },
];

export default function ClubDetailPage() {
  const { clubId } = useParams<{clubId:string}>();
  const navigate = useNavigate();

  const [club, setClub] = useState<Club|null>(null);
  const [activeTab, setActiveTab] = useState<typeof tabs[number]['id']>('about');
  const [selectedThread, setSelectedThread] = useState<Thread|null>(null);
  const [selectedPost, setSelectedPost] = useState<Post|null>(null);

  useEffect(() => {
    if (clubId) ClubService.getById(Number(clubId))        .then(c => setClub(c ?? null));
  }, [clubId]);

  if (!club) return <div>Loading...</div>;

  // Thread detail
  if (selectedThread) {
    return (
      <div className="space-y-6">
        <button onClick={() => setSelectedThread(null)} className="text-gray-500 hover:text-gray-700">
          ← Back to Forum
        </button>
        {/* (Copy‑paste your existing Thread detail JSX here) */}
        {/* … */}
      </div>
    );
  }

  // Post detail
  if (selectedPost) {
    return (
      <div className="space-y-6">
        <button onClick={() => setSelectedPost(null)} className="text-gray-500 hover:text-gray-700">
          ← Back to Posts
        </button>
        {/* (Copy‑paste your existing Post detail JSX here) */}
        {/* … */}
      </div>
    );
  }

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

      {/* Tab Bar */}
      <nav className="border-b border-gray-200">
        <ul className="flex space-x-8">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <li key={tab.id}>
                <button
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSelectedThread(null);
                    setSelectedPost(null);
                  }}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    isActive
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" /> {tab.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Tab Content */}
      {activeTab === 'about' && <AboutTab club={club} />}
      {activeTab === 'events' && <EventsTab club={club} setClub={setClub} />}
      {activeTab === 'forum' && (
        <ForumTab
          club={club}
          setClub={setClub}
          onSelectThread={setSelectedThread}
        />
      )}
      {activeTab === 'posts' && (
        <PostsTab
          club={club}
          setClub={setClub}
          onSelectPost={setSelectedPost}
        />
      )}
      {activeTab === 'members' && <MembersTab members={club.members_list} />}
    </div>
  );
}
