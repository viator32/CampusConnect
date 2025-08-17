// src/features/notifications/services/NotificationsService.ts
import { BaseService } from '../../../services/BaseService';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  time: string;
  read: boolean;
}

export class NotificationsService extends BaseService {
  async getAll(): Promise<Notification[]> {
    // TODO: replace '/notifications' with backend endpoint
    await this.api.request('/notifications');
    return [];
  }

  async markAsRead(id: number): Promise<void> {
    const payload = this.buildPayload({ id });
    // TODO: replace '/notifications/mark-read' with backend endpoint
    await this.api.request('/notifications/mark-read', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async markAllAsRead(): Promise<void> {
    // TODO: replace '/notifications/mark-all-read' with backend endpoint
    await this.api.request('/notifications/mark-all-read', { method: 'POST' });
  }
}

export const notificationsService = new NotificationsService();
