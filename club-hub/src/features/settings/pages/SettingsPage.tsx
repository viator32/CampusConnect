import React from 'react';
import { useProfile } from '../../profile/hooks/useProfile';
import Toggle from '../../../components/Toggle';

export default function SettingsPage() {
  const { user, setUser } = useProfile();
  if (!user) return <div>Loading...</div>;

  // 1) Notification toggles
  const notifLabels = {
    email: 'Email Notifications',
    push: 'Push Notifications',
    clubUpdates: 'Club Updates',
    eventReminders: 'Event Reminders',
    forumReplies: 'Forum Replies'
  } as const;
  const notifDesc = {
    email: 'Receive notifications via email',
    push: 'Receive push notifications on your device',
    clubUpdates: 'Get updates when clubs you follow post',
    eventReminders: 'Be reminded before events',
    forumReplies: 'Notify when someone replies to your forum posts'
  } as const;

  const toggleNotification = (key: keyof typeof user.settings.notifications) => {
    setUser({
      ...user,
      settings: {
        ...user.settings,
        notifications: {
          ...user.settings.notifications,
          [key]: !user.settings.notifications[key]
        }
      }
    });
    // TODO: call ProfileService.updateSettings(...)
  };

  // 2) Privacy toggles
  const togglePrivacy = (key: keyof typeof user.settings.privacy) => {
    setUser({
      ...user,
      settings: {
        ...user.settings,
        privacy: {
          ...user.settings.privacy,
          [key]: !user.settings.privacy[key]
        }
      }
    });
  };

  // 3) Profile visibility
  const changeProfileVisibility = (value: 'public' | 'private') => {
    setUser({
      ...user,
      settings: {
        ...user.settings,
        privacy: {
          ...user.settings.privacy,
          profileVisibility: value
        }
      }
    });
  };

  // 4) Preferences
  const changePreference = (key: keyof typeof user.settings.preferences, value: any) => {
    setUser({
      ...user,
      settings: {
        ...user.settings,
        preferences: {
          ...user.settings.preferences,
          [key]: value
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Page title */}
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Notification Settings</h3>
        <div className="space-y-4">
          {Object.entries(user.settings.notifications).map(([key, enabled]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">
                  {notifLabels[key as keyof typeof notifLabels]}
                </p>
                <p className="text-sm text-gray-600">
                  {notifDesc[key as keyof typeof notifDesc]}
                </p>
              </div>
              <Toggle
                checked={enabled as boolean}
                onChange={() => toggleNotification(key as any)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Privacy Settings</h3>
        <div className="space-y-4">
          {/* Profile Visibility */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Profile Visibility</p>
              <p className="text-sm text-gray-600">Who can see your profile</p>
            </div>
            <select
              value={user.settings.privacy.profileVisibility}
              onChange={e => changeProfileVisibility(e.target.value as 'public' | 'private')}
              className="border border-gray-300 rounded-lg p-1"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
          {/* Show Email / Clubs / Messages */}
          {(['showEmail', 'showClubs', 'allowMessages'] as (keyof typeof user.settings.privacy)[]).map(key => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">
                  {key === 'showEmail'
                    ? 'Show Email on Profile'
                    : key === 'showClubs'
                    ? 'Show Clubs on Profile'
                    : 'Allow Direct Messages'}
                </p>
              </div>
              <Toggle
                checked={user.settings.privacy[key] as boolean}
                onChange={() => togglePrivacy(key)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Preferences</h3>
        <div className="space-y-4">
          {/* Theme */}
          <div className="flex items-center justify-between">
            <p className="font-medium text-gray-900">Theme</p>
            <select
              value={user.settings.preferences.theme}
              onChange={e => changePreference('theme', e.target.value)}
              className="border border-gray-300 rounded-lg p-1"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          {/* Language */}
          <div className="flex items-center justify-between">
            <p className="font-medium text-gray-900">Language</p>
            <select
              value={user.settings.preferences.language}
              onChange={e => changePreference('language', e.target.value)}
              className="border border-gray-300 rounded-lg p-1"
            >
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
            </select>
          </div>
          {/* Time Format */}
          <div className="flex items-center justify-between">
            <p className="font-medium text-gray-900">Time Format</p>
            <select
              value={user.settings.preferences.timeFormat}
              onChange={e => changePreference('timeFormat', e.target.value)}
              className="border border-gray-300 rounded-lg p-1"
            >
              <option value="12h">12-hour</option>
              <option value="24h">24-hour</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
