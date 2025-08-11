import React from 'react';
import { Club } from '../types';
import { Users } from 'lucide-react';
import Button from '../../../components/Button';

export default function ClubList({
  clubs,
  onSelect,
  onJoin
}: {
  clubs: Club[];
  onSelect: (club: Club) => void;
  onJoin: (club: Club) => void;
}) {
  return (
    <div className="space-y-4">
      {clubs.map(club => (
        <div
          key={club.id}
          onClick={() => onSelect(club)}
          className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer p-4 flex items-center gap-4"
        >
          <div className="text-3xl">{club.image}</div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{club.name}</h3>
            <p className="text-sm text-gray-600">{club.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" /> {club.members} members
              </span>
              <span className="px-2 py-1 rounded-full bg-gray-100">{club.category}</span>
            </div>
          </div>
          <Button
            className="text-sm"
            onClick={e => {
              e.stopPropagation();
              if (!club.isJoined) onJoin(club);
            }}
            disabled={club.isJoined}
          >
            {club.isJoined ? 'Joined' : 'Join'}
          </Button>
        </div>
      ))}
    </div>
  );
}
