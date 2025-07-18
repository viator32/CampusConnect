import React, { useState } from 'react';
import { Member } from '../types';
import { Grid, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MembersTabProps {
  members: Member[];
}

export default function MembersTab({ members }: MembersTabProps) {
  const [view, setView] = useState<'grid'|'list'>('grid');
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center gap-2">
        <button
          onClick={() => setView('grid')}
          className={`p-2 rounded-lg ${
            view === 'grid' ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100'
          }`}
        >
          <Grid className="w-5 h-5" />
        </button>
        <button
          onClick={() => setView('list')}
          className={`p-2 rounded-lg ${
            view === 'list' ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100'
          }`}
        >
          <List className="w-5 h-5" />
        </button>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {members.map(m => (
            <div
              key={m.id}
              onClick={() => navigate(`/users/${m.id}`)}
              className="cursor-pointer bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col items-center text-center gap-3 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl">{m.avatar}</div>
              <p className="font-medium text-gray-900">{m.name}</p>
              <p className="text-sm text-gray-500">{m.role}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {members.map(m => (
            <div
              key={m.id}
              onClick={() => navigate(`/users/${m.id}`)}
              className="cursor-pointer bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl">{m.avatar}</div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{m.name}</p>
                <p className="text-sm text-gray-500">{m.role}</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                View Profile →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
