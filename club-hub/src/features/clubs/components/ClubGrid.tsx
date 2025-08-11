import React from 'react';
import { Club } from '../types';
import ClubCard from './ClubCard';

export default function ClubGrid({
  clubs,
  onSelect,
  onJoin
}: {
  clubs: Club[];
  onSelect: (club: Club) => void;
  onJoin: (club: Club) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {clubs.map(c => (
        <ClubCard
          key={c.id}
          club={c}
          onClick={() => onSelect(c)}
          onJoin={() => onJoin(c)}
        />
      ))}
    </div>
  );
}
