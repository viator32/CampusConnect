import React from 'react';
import { useProfile } from '../../profile/hooks/useProfile';
import Toggle from '../../../components/Toggle';

export default function SettingsPage() {
  const { user, setUser } = useProfile();
  if (!user) return <div>Loading...</div>;

  // 1) notifications toggle
  type NotificationKey = keyof typeof user.settings.notifications;
  const notificationKeys = Object.keys(user.settings.notifications) as NotificationKey[];

  const toggleNotification = (key: NotificationKey) => {
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
  };

  // 2) privacy toggles (only the booleans)
  const PRIVACY_TOGGLE_KEYS = ['showEmail','showClubs','allowMessages'] as const;
  type PrivacyToggleKey = typeof PRIVACY_TOGGLE_KEYS[number];
  const togglePrivacy = (key: PrivacyToggleKey) => {
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

  // 3) profile visibility (string)
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

  // 4) preferences (theme, language, timeFormat)
  type PreferenceKey = keyof typeof user.settings.preferences;
  const changePreference = (key: PreferenceKey, value: any) => {
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

  const notifLabels = {
    email: 'Email Notifications',
    push: 'Push Notifications',
    clubUpdates: 'Club Updates',
    eventReminders: 'Event Reminders',
    forumReplies: 'Forum Replies'
  } as const;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Notifications */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="mb-4 font-semibold">Notification Settings</h3>
        <div className="space-y-4">
          {notificationKeys.map(key => (
            <div key={key} className="flex items-center justify-between">
              <p className="font-medium">{notifLabels[key]}</p>
              <Toggle
                checked={user.settings.notifications[key]}
                onChange={() => toggleNotification(key)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="mb-4 font-semibold">Privacy Settings</h3>
        <div className="space-y-4">
          {/* profileVisibility */}
          <div className="flex items-center justify-between">
            <p className="font-medium">Profile Visibility</p>
            <select
              value={user.settings.privacy.profileVisibility}
              onChange={e => changeProfileVisibility(e.target.value as 'public'|'private')}
              className="border p-1 rounded"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
          {/* boolean privacy toggles */}
          {PRIVACY_TOGGLE_KEYS.map(key => (
            <div key={key} className="flex items-center justify-between">
              <p className="font-medium">
                {{
                  showEmail: 'Show Email on Profile',
                  showClubs: 'Show Clubs on Profile',
                  allowMessages: 'Allow Direct Messages'
                }[key]}
              </p>
              <Toggle
                checked={user.settings.privacy[key]}
                onChange={() => togglePrivacy(key)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="mb-4 font-semibold">Preferences</h3>
        <div className="space-y-4">
          {(['theme','language','timeFormat'] as PreferenceKey[]).map(key => (
            <div key={key} className="flex items-center justify-between">
              <p className="font-medium">
                {key === 'theme'
                  ? 'Theme'
                  : key === 'language'
                  ? 'Language'
                  : 'Time Format'}
              </p>
              <select
                value={(user.settings.preferences as any)[key]}
                onChange={e => changePreference(key, e.target.value)}
                className="border p-1 rounded"
              >
                {key === 'theme' && (
                  <>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </>
                )}
                {key === 'language' && (
                  <>
                    <option value="english">English</option>
                    <option value="spanish">Spanish</option>
                  </>
                )}
                {key === 'timeFormat' && (
                  <>
                    <option value="12h">12‑hour</option>
                    <option value="24h">24‑hour</option>
                  </>
                )}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
