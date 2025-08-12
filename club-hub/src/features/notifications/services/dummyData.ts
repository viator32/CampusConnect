export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  time: string;
  read: boolean;
}

export const dummyNotifications: Notification[] = [
  {
    id: 1,
    type: 'info',
    message: 'Welcome to ClubHub!',
    time: '2025-07-10',
    read: false
  },
  {
    id: 2,
    type: 'success',
    message: 'Your club request was approved',
    time: '2025-07-11',
    read: false
  },
  {
    id: 3,
    type: 'warning',
    message: 'Club meeting rescheduled',
    time: '2025-07-12',
    read: false
  },
  {
    id: 4,
    type: 'error',
    message: 'Payment failed for club dues',
    time: '2025-07-13',
    read: false
  },
  {
    id: 5,
    type: 'info',
    message: 'You have a new message from Admin',
    time: '2025-07-14',
    read: true
  }
];
