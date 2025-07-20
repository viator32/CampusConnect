// src/features/profile/pages/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import Button from '../../../components/Button';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateUser } = useProfile();

  const [isEditing, setIsEditing]         = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [form, setForm] = useState({
    name:      '',
    bio:       '',
    year:      '',
    major:     '',
    avatar:    '',
    interests: ''
  });

  // prefills when entering edit mode or user loads
  useEffect(() => {
    if (user) {
      setForm({
        name:      user.name,
        bio:       user.bio,
        year:      user.year,
        major:     user.major,
        avatar:    user.avatar,
        interests: user.interests.join(', ')
      });
    }
  }, [user, isEditing]);

  if (!user) return <div>Loading…</div>;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const onAvatarClick = (data: EmojiClickData) => {
    setForm(f => ({ ...f, avatar: data.emoji }));
    setShowAvatarPicker(false);
  };

  const save = async () => {
    const updated = {
      ...user,
      name:      form.name.trim() || user.name,
      bio:       form.bio,
      year:      form.year,
      major:     form.major,
      avatar:    form.avatar,
      interests: form.interests
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
    };
    await updateUser(updated);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      {/* ── Main Card ── */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <div
              className={`w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-4xl cursor-pointer
                ${isEditing ? 'hover:ring-2 hover:ring-orange-300' : ''}`}
              onClick={() => isEditing && setShowAvatarPicker(v => !v)}
            >
              {form.avatar}
            </div>
            {isEditing && showAvatarPicker && (
              <div className="absolute z-30 top-full mt-2">
                <div className="h-60 w-80 overflow-auto rounded-lg shadow-lg">
                  <EmojiPicker
                    onEmojiClick={onAvatarClick}
                    theme={Theme.AUTO}
                    height={240}
                    width="100%"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Info + edit/save */}
          <div className="flex-1">
            <div className="flex justify-between items-center">
              {isEditing ? (
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="text-2xl font-bold border-b border-gray-300 focus:outline-none"
                />
              ) : (
                <h2 className="text-2xl font-bold">{user.name}</h2>
              )}
              <div>
                {isEditing ? (
                  <>
                    <Button
                      onClick={save}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mr-2"
                    >
                      Save
                    </Button>
                    <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>

            {/* Year / Major */}
            {isEditing ? (
              <div className="mt-2 flex gap-4">
                <input
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  placeholder="Year"
                  className="border rounded px-3 py-1"
                />
                <input
                  name="major"
                  value={form.major}
                  onChange={handleChange}
                  placeholder="Major"
                  className="border rounded px-3 py-1"
                />
              </div>
            ) : (
              <p className="mt-1 text-gray-600">
                {user.year} • {user.major}
              </p>
            )}

            {/* Bio */}
            <div className="mt-4">
              <h3 className="font-semibold text-gray-900">About</h3>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border rounded px-3 py-2 resize-none"
                  placeholder="Tell us about yourself…"
                />
              ) : (
                <p className="text-gray-700">
                  {user.bio || (
                    <span className="italic text-gray-400">No bio yet.</span>
                  )}
                </p>
              )}
            </div>

            {/* Interests */}
            <div className="mt-3">
              <h3 className="font-semibold text-gray-900">Interests</h3>
              {isEditing ? (
                <input
                  name="interests"
                  value={form.interests}
                  onChange={handleChange}
                  placeholder="Comma‑separated"
                  className="w-full border rounded px-3 py-2"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user.interests.length > 0 ? (
                    user.interests.map(i => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {i}
                      </span>
                    ))
                  ) : (
                    <span className="italic text-gray-400">
                      No interests yet.
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="mt-4 flex gap-6">
              <Stat label="Clubs Joined"   value={user.clubsJoined} />
              <Stat label="Events Attended" value={user.eventsAttended} />
              <Stat label="Posts Created"   value={user.postsCreated} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Upcoming Events ── */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Upcoming Events</h2>
        {user.joinedEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.joinedEvents.map(ev => (
              <div
                key={ev.id}
                className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md cursor-pointer"
                onClick={() => navigate(`/clubs/${ev.clubId}`)}
              >
                <div className="flex items-center gap-3 mb-1">
                  <div className="text-2xl">{ev.clubImage}</div>
                  <div>
                    <p className="font-semibold text-gray-900">{ev.clubName}</p>
                    <p className="text-sm text-gray-500">
                      {ev.date} @ {ev.time}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700">{ev.title}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="italic text-gray-600">
            You haven’t joined any upcoming events.
          </p>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="text-xl font-bold text-orange-600">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}
