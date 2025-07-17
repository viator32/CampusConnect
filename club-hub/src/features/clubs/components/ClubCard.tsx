import React from 'react';
import { Club } from '../types';
import { Users } from 'lucide-react';
import Button from '../../../components/Button';

export default function ClubCard({
  club,
  onClick
}: {
  club: Club;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer p-4"
    >
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
      <div className="flex justify-between items-center">
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            club.isJoined ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'
          }`}
        >
          {club.isJoined ? 'Joined' : 'Not Joined'}
        </span>
        <Button className="text-sm">{club.isJoined ? 'Joined' : 'Join'}</Button>
      </div>
    </div>
  );
}
