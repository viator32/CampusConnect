// src/features/clubs/components/MembersTab.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, List } from 'lucide-react';
import { Club, Member } from '../types';

type Role = 'Owner' | 'Admin' | 'Moderator' | 'Member' | 'Guest';

const ROLE_OPTIONS: { value: Role; label: string; description: string }[] = [
  { value: 'Owner',     label: 'Owner',     description: 'Full control over club settings, members, and content.' },
  { value: 'Admin',     label: 'Admin',     description: 'Can manage members, approve events, and moderate content.' },
  { value: 'Moderator', label: 'Moderator', description: 'Can moderate forum/posts and assist Admins.' },
  { value: 'Member',    label: 'Member',    description: 'Regular member; can post, join events, and comment.' },
  { value: 'Guest',     label: 'Guest',     description: 'Read‑only access; cannot post or join events.' },
];

interface MembersTabProps {
  club: Club;
  onUpdate?: (updated: Member[]) => void;
}

export default function MembersTab({ club, onUpdate }: MembersTabProps) {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>(club.members_list);
  const [view, setView]     = useState<'grid'|'list'>('grid');
  const [search, setSearch] = useState('');

  // Sync props → state
  useEffect(() => {
    setMembers(club.members_list);
  }, [club.members_list]);

  // Filter by name/role
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return members.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q)
    );
  }, [members, search]);

  const handleRoleChange = (id: number, newRole: Role) => {
    const updated = members.map(m =>
      m.id === id ? { ...m, role: newRole } : m
    );
    setMembers(updated);
    onUpdate?.(updated);
  };

  return (
    <div className="space-y-4">
      {/* Search + View Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Search members..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 max-w-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500"
        />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded-lg ${view==='grid' ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100'}`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded-lg ${view==='list' ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100'}`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map(member => (
            <div
              key={member.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col items-center text-center gap-3 hover:shadow-md transition-shadow"
            >
              {/* Only avatar is clickable */}
              <div
                onClick={() => navigate(`/users/${member.id}`)}
                className="cursor-pointer text-3xl"
              >
                {member.avatar}
              </div>

              <p className="font-medium text-gray-900">{member.name}</p>

              {/* Role selector with click isolation */}
              <select
                value={member.role}
                onChange={e => handleRoleChange(member.id, e.target.value as Role)}
                onClick={e => e.stopPropagation()}
                title={ROLE_OPTIONS.find(r=>r.value===member.role)?.description}
                className="border px-2 py-1 rounded bg-white border-gray-300 hover:border-gray-400"
              >
                {ROLE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(member => (
            <div
              key={member.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              {/* Avatar click */}
              <div
                onClick={() => navigate(`/users/${member.id}`)}
                className="cursor-pointer text-3xl"
              >
                {member.avatar}
              </div>

              <div className="flex-1">
                <p className="font-medium text-gray-900">{member.name}</p>
              </div>

              <select
                value={member.role}
                onChange={e => handleRoleChange(member.id, e.target.value as Role)}
                onClick={e => e.stopPropagation()}
                title={ROLE_OPTIONS.find(r=>r.value===member.role)?.description}
                className="mr-4 border px-2 py-1 rounded bg-white border-gray-300 hover:border-gray-400"
              >
                {ROLE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <button
                onClick={() => navigate(`/users/${member.id}`)}
                className="text-gray-400 hover:text-gray-600"
              >
                View Profile →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
