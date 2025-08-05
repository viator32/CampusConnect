// src/features/notifications/services/NotificationsService.ts
import { BaseService } from '../../../services/BaseService';
import { Notification, dummyNotifications } from './dummyData';

export class NotificationsService extends BaseService {
  async getAll(): Promise<Notification[]> {
    // TODO: replace '/notifications' with backend endpoint
    await this.api.request('/notifications');
    // TODO: remove dummy data once API is integrated
    return new Promise(resolve =>
      setTimeout(() => resolve(dummyNotifications), 200)
    );
  }

  async markAsRead(id: number): Promise<void> {
    const payload = this.buildPayload({ id });
    // TODO: replace '/notifications/mark-read' with backend endpoint
    await this.api.request('/notifications/mark-read', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    // TODO: remove dummy mutation once API is integrated
    return new Promise(resolve =>
      setTimeout(() => {
        const note = dummyNotifications.find(n => n.id === id);
        if (note) note.read = true;
        resolve();
      }, 200)
    );
  }

  async markAllAsRead(): Promise<void> {
    // TODO: replace '/notifications/mark-all-read' with backend endpoint
    await this.api.request('/notifications/mark-all-read', { method: 'POST' });
    // TODO: remove dummy mutation once API is integrated
    return new Promise(resolve =>
      setTimeout(() => {
        dummyNotifications.forEach(n => (n.read = true));
        resolve();
      }, 200)
    );
  }
}

export const notificationsService = new NotificationsService();
