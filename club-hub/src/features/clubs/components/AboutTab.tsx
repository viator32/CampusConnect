// src/features/clubs/components/AboutTab.tsx
import React, { useState } from 'react';
import { Club, Role } from '../types';
import {
  Users,
  Calendar,
  Info as InfoIcon,
  Edit as EditIcon
} from 'lucide-react';
import Button from '../../../components/Button';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';

interface AboutTabProps {
  club: Club;
  onUpdate: (updated: Club) => void;
  currentUserRole?: Role;
}

export default function AboutTab({ club, onUpdate, currentUserRole }: AboutTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const canEdit = currentUserRole === 'ADMIN';

  // initialize form with existing club data
  const [form, setForm] = useState({
    name:        club.name,
    description: club.description,
    category:    club.category,
    image:       club.image,
    founded:     club.founded || '',
    location:    club.location || '',
    tags:        (club.tags || []).join(', ')
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const onEmojiClick = (data: EmojiClickData) => {
    setForm(f => ({ ...f, image: data.emoji }));
    setShowEmojiPicker(false);
  };

  const save = () => {
    const updated: Club = {
      ...club,
      name:        form.name,
      description: form.description,
      category:    form.category,
      image:       form.image,
      founded:     form.founded || undefined,
      location:    form.location || undefined,
      tags:        form.tags.split(',').map(s=>s.trim()).filter(Boolean)
    };
    onUpdate(updated);
    setIsEditing(false);
  };

  // safe arrays
  const tags     = club.tags     ?? [];

  return (
    <div className="space-y-6">
      {/* ── Header Card ── */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Emoji Icon */}
            <div className="relative">
              <div
                className="text-4xl cursor-pointer"
                onClick={() => isEditing && setShowEmojiPicker(v=>!v)}
              >
                {form.image}
              </div>
              {showEmojiPicker && isEditing && (
                <div className="absolute z-30 mt-2">
                    <EmojiPicker
                      onEmojiClick={onEmojiClick}
                      theme={Theme.AUTO}
                      height={400}
                      width="100%"
                    />
                  
                </div>
              )}
            </div>

            {/* Club Name */}
            {isEditing ? (
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="text-2xl font-bold border-b border-gray-300 focus:outline-none"
              />
            ) : (
              <h2 className="text-2xl font-bold text-gray-900">{club.name}</h2>
            )}
          </div>

          {/* Edit / Save */}
          {canEdit && (
            isEditing ? (
              <div className="flex gap-2">
                <Button
                  onClick={save}
                  className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                >
                  Save
                </Button>
                <Button onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1"
              >
                <EditIcon className="w-4 h-4" /> Edit
              </Button>
            )
          )}
        </div>

        {/* Category */}
        {isEditing ? (
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-1 mb-4"
          >
            {['Academic','Creative','Sports','Cultural','Technical'].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        ) : (
          <p className="text-gray-600 mb-4">{club.category}</p>
        )}

        {/* Founded & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {['founded','location'].map(field => (
            <div key={field}>
              <label className="text-sm text-gray-500 flex items-center gap-1">
                <InfoIcon className="w-4 h-4" /> {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              {isEditing ? (
                <input
                  name={field}
                  value={(form as any)[field]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-1"
                  placeholder={field==='founded'?'e.g. 2005':'e.g. Main Campus'}
                />
              ) : (
                <p className="text-gray-700">
                  {(club as any)[field] ?? (
                    <span className="text-gray-400 italic">Not specified</span>
                  )}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-500" />
            <span>{club.members} members</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-500" />
            <span>{club.events.length} upcoming events</span>
          </div>
        </div>
      </div>

      {/* ── Details ── */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        {/* Description */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">About This Club</h3>
          {isEditing ? (
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 resize-none"
              placeholder="Short description…"
            />
          ) : (
            <p className="text-gray-700">
              {club.description || (
                <span className="italic text-gray-400">No description yet.</span>
              )}
            </p>
          )}
        </div>

        {/* Tags */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">Tags</h3>
          {isEditing ? (
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-1"
              placeholder="Comma‑separated tags"
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.length > 0 ? (
                tags.map(t => (
                  <span
                    key={t}
                    className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-sm"
                  >
                    {t}
                  </span>
                ))
              ) : (
                <span className="italic text-gray-400">No tags yet.</span>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
