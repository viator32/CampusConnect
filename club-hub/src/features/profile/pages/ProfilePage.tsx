import React from 'react';
import { useProfile } from '../hooks/useProfile';
import Toggle from '../../../components/Toggle';

export default function ProfilePage() {
  const { user } = useProfile();
  if (!user) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-3xl">
            {user.avatar}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-600">{user.year} • {user.major}</p>
            <p className="text-gray-500 text-sm">Member since {user.joinedDate}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{user.clubsJoined}</div>
            <div className="text-sm text-gray-600">Clubs Joined</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{user.eventsAttended}</div>
            <div className="text-sm text-gray-600">Events Attended</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{user.postsCreated}</div>
            <div className="text-sm text-gray-600">Posts Created</div>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">About</h3>
          <p className="text-gray-700">{user.bio}</p>
        </div>
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Badges</h3>
          <div className="flex flex-wrap gap-2">
            {user.badges.map(badge => (
              <span key={badge} className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm">
                {badge}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {user.interests.map(interest => (
              <span key={interest} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
