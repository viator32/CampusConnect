// src/features/clubs/pages/MyClubsPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClubs } from '../hooks/useClubs';
import { Plus, Users, X, Smile, Loader2 } from 'lucide-react';
import Button from '../../../components/Button';
import type { Club } from '../types';
import { clubService } from '../services/ClubService';

import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';

const categories = ['Academic', 'Creative', 'Sports', 'Cultural', 'Technical'];

export default function MyClubsPage() {
  const navigate = useNavigate();
  const { clubs, addClub, leaveClub, loading, error } = useClubs();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // modal + emoji state
  const [showModal, setShowModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [form, setForm] = useState<Pick<Club, 'name'|'description'|'category'|'image'>>({
    name: '',
    description: '',
    category: categories[0],
    image: '🏷️'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setForm(f => ({ ...f, image: emojiData.emoji }));
    setShowEmojiPicker(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      const created = await clubService.createClub(form);
      // ensure newly created club appears joined for the creator
      addClub({
        ...created,
        isJoined: true,
        members: created.members || 1,
      });
      setShowModal(false);
      setShowEmojiPicker(false);
      setForm({ name: '', description: '', category: categories[0], image: '🏷️' });
    } catch (err: any) {
      setSubmitError(err?.message ?? 'Failed to create club');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  const joinedClubs = clubs.filter(c => c.isJoined);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Clubs</h1>
        <Button
          onClick={() => setShowModal(true)}
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
                <div className="flex justify-between items-center">
                  <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-600">Joined</span>
                  <Button
                    className="text-sm"
                    onClick={e => {
                      e.stopPropagation();
                      leaveClub(club.id);
                    }}
                  >
                    Leave
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-600">
          You haven’t joined any clubs yet.
        </div>
      )}

      {/* Create Club Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            {/* Close */}
            <button
              onClick={() => {
                setShowModal(false);
                setShowEmojiPicker(false);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-orange-600" /> New Club
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Emoji selector now at the very top */}
              <div className="relative">
                <label className="block text-gray-700 mb-1">Icon (emoji)</label>
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(v => !v)}
                  className="flex items-center gap-1 border px-3 py-2 rounded hover:bg-gray-100"
                >
                  <Smile className="w-5 h-5 text-gray-600" />
                  <span className="text-xl">{form.image}</span>
                </button>
                {showEmojiPicker && (
                  <div
                    className={`
                      absolute z-20 top-full left-0 -mt-2 mb-1
                      shadow-lg bg-white rounded-lg overflow-hidden
                    `}
                  >
                    <div className="w-[350px] h-[400px]">
                      <EmojiPicker
                        onEmojiClick={onEmojiClick}
                        theme={Theme.AUTO}
                        height={400}
                        width="100%"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Description</label>
                <input
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {submitError && (
                <p className="text-sm text-red-500 text-center">{submitError}</p>
              )}
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setShowEmojiPicker(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
