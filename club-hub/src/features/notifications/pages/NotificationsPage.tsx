import React from 'react';
import { Bell } from 'lucide-react';

export default function NotificationsPage() {
  // TODO: replace with real notifications data
  const notifications: Array<{
    id: number;
    message: string;
    time: string;
  }> = [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>

      {notifications.length > 0 ? (
        <ul className="space-y-4">
          {notifications.map(note => (
            <li
              key={note.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
            >
              <p className="text-gray-900">{note.message}</p>
              <p className="text-xs text-gray-500 mt-1">{note.time}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-12">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
          <p className="text-gray-600">You're all caught up!</p>
        </div>
      )}
    </div>
  );
}
