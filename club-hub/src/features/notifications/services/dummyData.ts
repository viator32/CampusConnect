export interface Notification {
  id: number;
  message: string;
  time: string;
  read: boolean;
}

export const dummyNotifications: Notification[] = [
  { id: 1, message: 'Welcome to ClubHub!', time: '2025-07-10', read: false },
  {
    id: 2,
    message: 'Your club request was approved',
    time: '2025-07-11',
    read: false
  }
];
