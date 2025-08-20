import React, { useState, useEffect } from 'react';
import { useProfile } from '../hooks/useProfile';
import Button from '../../../components/Button';
import { Subject, Preference } from '../types';

export default function ProfilePage() {
  const { user, updateUser } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    subject: '' as Subject | '',
    preferences: [] as Preference[],
    avatar: '',
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        description: user.description,
        subject: user.subject || '',
        preferences: user.preferences || [],
        avatar: user.avatar || '',
      });
    }
  }, [user, isEditing]);

  if (!user) return <div>Loading...</div>;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm(f => ({ ...f, subject: e.target.value as Subject }));
  };

  const handlePreferencesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.selectedOptions, o => o.value as Preference);
    setForm(f => ({ ...f, preferences: values }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(f => ({ ...f, avatar: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const save = async () => {
    await updateUser({
      ...user,
      name: form.name.trim() || user.name,
      description: form.description,
      subject: form.subject,
      preferences: form.preferences,
      avatar: form.avatar,
    });
    setIsEditing(false);
  };

  const subjectOptions = Object.values(Subject);
  const preferenceOptions = Object.values(Preference);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start gap-6">
          <div className="relative">
            {form.avatar ? (
              <img
                src={form.avatar}
                alt="avatar"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-200 rounded-full" />
            )}
            {isEditing && (
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            )}
          </div>

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
                  <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                )}
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-gray-900">Description</h3>
              {isEditing ? (
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border rounded px-3 py-2 resize-none"
                />
              ) : (
                <p className="text-gray-700">
                  {user.description || (
                    <span className="italic text-gray-400">No description.</span>
                  )}
                </p>
              )}
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-gray-900">Subject</h3>
              {isEditing ? (
                <select
                  value={form.subject}
                  onChange={handleSubjectChange}
                  className="border rounded px-3 py-2 w-full"
                >
                  <option value="">Select subject</option>
                  {subjectOptions.map(s => (
                    <option key={s} value={s}>
                      {s.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-gray-700">
                  {user.subject || (
                    <span className="italic text-gray-400">No subject selected.</span>
                  )}
                </p>
              )}
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-gray-900">Preferences</h3>
              {isEditing ? (
                <select
                  multiple
                  value={form.preferences}
                  onChange={handlePreferencesChange}
                  className="border rounded px-3 py-2 w-full h-32"
                >
                  {preferenceOptions.map(p => (
                    <option key={p} value={p}>
                      {p.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user.preferences.length > 0 ? (
                    user.preferences.map(p => (
                      <span
                        key={p}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {p.replace(/_/g, ' ')}
                      </span>
                    ))
                  ) : (
                    <span className="italic text-gray-400">
                      No preferences selected.
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
