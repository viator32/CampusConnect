// src/features/notifications/services/NotificationsService.ts
import { Notification, dummyNotifications } from './dummyData';

export class NotificationsService {
  static async getAll(): Promise<Notification[]> {
    return new Promise(resolve =>
      setTimeout(() => resolve(dummyNotifications), 200)
    );
  }

  static async markAsRead(id: number): Promise<void> {
    return new Promise(resolve =>
      setTimeout(() => {
        const note = dummyNotifications.find(n => n.id === id);
        if (note) note.read = true;
        resolve();
      }, 200)
    );
  }

  static async markAllAsRead(): Promise<void> {
    return new Promise(resolve =>
      setTimeout(() => {
        dummyNotifications.forEach(n => (n.read = true));
        resolve();
      }, 200)
    );
  }
}
