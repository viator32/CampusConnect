import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Club } from '../types';
import { ClubService } from '../services/ClubService';
import {
  Users,
  BookOpen,
  Calendar,
  MessageSquare,
  MessageCircle
} from 'lucide-react';
import Button from '../../../components/Button';

export default function ClubDetailPage() {
  const { clubId } = useParams<{ clubId: string }>();
  const [club, setClub] = useState<Club | null>(null);
  const [activeTab, setActiveTab] = useState<'about' | 'events' | 'forum' | 'posts' | 'members'>('about');
  const navigate = useNavigate();

  useEffect(() => {
    if (clubId) {
      ClubService.getById(Number(clubId)).then(c => setClub(c || null));
    }
  }, [clubId]);

  if (!club) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700">
          ← Back
        </button>
        <div className="flex items-center gap-3">
          <div className="text-3xl">{club.image}</div>
          <div>
            <h1 className="text-2xl font-bold">{club.name}</h1>
            <p className="text-gray-600">{club.members} members</p>
          </div>
        </div>
      </div>

      <nav className="border-b border-gray-200">
        <ul className="flex space-x-8">
          {[
            { id: 'about', label: 'About', icon: BookOpen },
            { id: 'events', label: 'Events', icon: Calendar },
            { id: 'forum', label: 'Forum', icon: MessageSquare },
            { id: 'posts', label: 'Posts', icon: MessageCircle },
            { id: 'members', label: 'Members', icon: Users }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    isActive
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {activeTab === 'about' && (
        <div>
          <h2 className="text-xl font-semibold mb-2">About This Club</h2>
          <p className="text-gray-700">{club.description}</p>
        </div>
      )}

      {activeTab === 'events' && (
        <div className="space-y-4">
          {club.events.map(event => (
            <div
              key={event.id}
              className="bg-white p-4 rounded shadow border"
            >
              <h3 className="font-semibold">{event.title}</h3>
              <p className="text-sm text-gray-500">
                {event.date} at {event.time}
              </p>
              <Button className="mt-2">Join Event</Button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'posts' && (
        <div className="space-y-4">
          {club.posts.map(post => (
            <div
              key={post.id}
              className="bg-white p-4 rounded shadow border"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  👤
                </div>
                <div>
                  <p className="font-medium">{post.author}</p>
                  <p className="text-xs text-gray-500">{post.time}</p>
                </div>
              </div>
              <p>{post.content}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'members' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {club.members_list.map(member => (
            <div
              key={member.id}
              className="bg-white p-4 rounded shadow border flex items-center gap-3"
            >
              <div className="text-2xl">{member.avatar}</div>
              <div>
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'forum' && (
        <div className="space-y-4">
          {club.forum_threads.map(thread => (
            <div
              key={thread.id}
              className="bg-white p-4 rounded shadow border"
            >
              <h3 className="font-semibold">{thread.title}</h3>
              <p className="text-xs text-gray-500">
                By {thread.author} • {thread.replies} replies
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
