export interface ClubRequest {
  id: number;
  name: string;
  requestedBy: string;
  date: string;
}

export interface ExternalAccountRequest {
  id: number;
  email: string;
  reason: string;
  date: string;
}

export interface Analytics {
  totalClubs: number;
  totalMembers: number;
  totalPosts: number;
  avgEngagement: number;
}

export let dummyClubRequests: ClubRequest[] = [
  { id: 1, name: 'Art Club', requestedBy: 'alice@uni.edu', date: '2025-07-10' },
  { id: 2, name: 'Chess Club', requestedBy: 'bob@uni.edu', date: '2025-07-11' }
];

export let dummyExternalRequests: ExternalAccountRequest[] = [
  { id: 1, email: 'john@gmail.com', reason: 'Faculty advisor', date: '2025-07-12' }
];

export const dummyAnalytics: Analytics = {
  totalClubs: 42,
  totalMembers: 1234,
  totalPosts: 5678,
  avgEngagement: 3.4
};
