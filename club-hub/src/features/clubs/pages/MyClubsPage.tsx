// src/features/clubs/pages/MyClubsPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useClubs } from '../hooks/useClubs';
import { Plus, Users } from 'lucide-react';
import Button from '../../../components/Button';

export default function MyClubsPage() {
  const navigate = useNavigate();
  const { clubs } = useClubs();
  const joinedClubs = clubs.filter(c => c.isJoined);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Clubs</h1>
        <Button
          onClick={() => navigate('/clubs/new')}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
        >
          <Plus className="w-4 h-4" />
          Create Club
        </Button>
      </div>

      {/* Joined Clubs List */}
      {joinedClubs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {joinedClubs.map(club => (
            <div
              key={club.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/clubs/${club.id}`)}
            >
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">{club.image}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{club.name}</h3>
                    <p className="text-sm text-gray-600">{club.category}</p>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{club.members}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">{club.description}</p>
                <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-600">
                  Joined
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-600">
          You haven’t joined any clubs yet.
        </div>
      )}
    </div>
  );
}
