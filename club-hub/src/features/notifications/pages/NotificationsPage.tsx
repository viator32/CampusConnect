import React, { useEffect, useState } from 'react';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  XCircle
} from 'lucide-react';
import { notificationsService } from '../services/NotificationsService';
import type { Notification as NotificationType } from '../services/dummyData';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    notificationsService
      .getAll()
      .then(setNotifications)
      .catch(() => setError('Failed to load notifications'))
      .finally(() => setLoading(false));
  }, []);

  const handleMarkRead = async (id: number) => {
    try {
      await notificationsService.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
    } catch {
      setError('Failed to mark notification as read');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch {
      setError('Failed to mark notifications as read');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const typeStyles: Record<
    NotificationType['type'],
    { icon: React.ElementType; color: string }
  > = {
    info: { icon: Info, color: 'text-blue-500' },
    success: { icon: CheckCircle, color: 'text-green-500' },
    warning: { icon: AlertTriangle, color: 'text-yellow-500' },
    error: { icon: XCircle, color: 'text-red-500' }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-sm text-orange-600 hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading notifications...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : notifications.length > 0 ? (
        <ul className="space-y-4">
          {notifications.map(note => {
            const { icon: Icon, color } = typeStyles[note.type];
            return (
              <li
                key={note.id}
                className={`flex items-start bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${
                  note.read ? 'opacity-60' : ''
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 ${color}`} />
                <div className="flex-1">
                  <p className="text-gray-900">{note.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{note.time}</p>
                </div>
                {!note.read && (
                  <button
                    onClick={() => handleMarkRead(note.id)}
                    className="text-sm text-orange-600 hover:underline ml-4"
                  >
                    Mark as read
                  </button>
                )}
              </li>
            );
          })}
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
