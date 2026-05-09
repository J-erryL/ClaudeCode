export type CourtType = 'outdoor' | 'indoor';
export type Sport = 'basketball' | 'running' | 'soccer' | 'tennis';

export interface Court {
  id: string;
  name: string;
  type: CourtType;
  sport: Sport;
  latitude: number;
  longitude: number;
  address: string;
  suburb: string;
  hoops: number;
  lights: boolean;
  surface: 'asphalt' | 'concrete' | 'rubber' | 'wood' | 'synthetic';
  free: boolean;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  avatarColor: string;
  skill: 'casual' | 'intermediate' | 'competitive';
}

export interface Session {
  id: string;
  courtId: string;
  hostId: string;
  startTime: string;
  durationMinutes: number;
  attendeeIds: string[];
  note?: string;
  maxPlayers?: number;
}

export interface Friendship {
  userId: string;
  friendId: string;
}

export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface CourtRequest {
  id: string;
  name: string;
  type: CourtType;
  sport: Sport;
  latitude: number;
  longitude: number;
  suburb: string;
  hoops: number;
  lights: boolean;
  notes?: string;
  requestedById: string;
  status: RequestStatus;
  createdAt: string;
  reviewedById?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}
