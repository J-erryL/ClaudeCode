import { create } from 'zustand';
import type { Court, CourtRequest, Friendship, Session } from '@/types';
import { SESSIONS } from '@/data/sessions';
import { FRIENDSHIPS, CURRENT_USER_ID } from '@/data/users';
import { COURTS } from '@/data/courts';
import { COURT_REQUESTS } from '@/data/requests';

interface AppState {
  currentUserId: string;
  isAdmin: boolean;
  sessions: Session[];
  friendships: Friendship[];
  approvedCourts: Court[];
  requests: CourtRequest[];

  addSession: (session: Omit<Session, 'id'>) => Session;
  joinSession: (sessionId: string, userId: string) => void;
  leaveSession: (sessionId: string, userId: string) => void;

  addFriend: (friendId: string) => void;
  removeFriend: (friendId: string) => void;

  submitCourtRequest: (
    request: Omit<CourtRequest, 'id' | 'requestedById' | 'status' | 'createdAt'>,
  ) => CourtRequest;
  approveRequest: (requestId: string) => void;
  rejectRequest: (requestId: string, reason?: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUserId: CURRENT_USER_ID,
  isAdmin: true,
  sessions: SESSIONS,
  friendships: FRIENDSHIPS,
  approvedCourts: [],
  requests: COURT_REQUESTS,

  addSession: (session) => {
    const id = `s${Date.now()}`;
    const newSession: Session = { ...session, id };
    set((state) => ({ sessions: [...state.sessions, newSession] }));
    return newSession;
  },

  joinSession: (sessionId, userId) => {
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId && !s.attendeeIds.includes(userId)
          ? { ...s, attendeeIds: [...s.attendeeIds, userId] }
          : s,
      ),
    }));
  },

  leaveSession: (sessionId, userId) => {
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId
          ? { ...s, attendeeIds: s.attendeeIds.filter((id) => id !== userId) }
          : s,
      ),
    }));
  },

  addFriend: (friendId) => {
    const { currentUserId, friendships } = get();
    if (friendships.some((f) => f.userId === currentUserId && f.friendId === friendId)) return;
    set((state) => ({
      friendships: [...state.friendships, { userId: currentUserId, friendId }],
    }));
  },

  removeFriend: (friendId) => {
    const { currentUserId } = get();
    set((state) => ({
      friendships: state.friendships.filter(
        (f) => !(f.userId === currentUserId && f.friendId === friendId),
      ),
    }));
  },

  submitCourtRequest: (request) => {
    const { currentUserId } = get();
    const newRequest: CourtRequest = {
      ...request,
      id: `r${Date.now()}`,
      requestedById: currentUserId,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ requests: [newRequest, ...state.requests] }));
    return newRequest;
  },

  approveRequest: (requestId) => {
    const { currentUserId, requests } = get();
    const request = requests.find((r) => r.id === requestId);
    if (!request || request.status !== 'pending') return;

    const newCourt: Court = {
      id: `c-${request.id}`,
      name: request.name,
      type: request.type,
      sport: request.sport,
      latitude: request.latitude,
      longitude: request.longitude,
      address: request.suburb,
      suburb: request.suburb,
      hoops: request.hoops,
      lights: request.lights,
      surface: 'asphalt',
      free: true,
      notes: request.notes,
    };

    set((state) => ({
      requests: state.requests.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'approved',
              reviewedById: currentUserId,
              reviewedAt: new Date().toISOString(),
            }
          : r,
      ),
      approvedCourts: [...state.approvedCourts, newCourt],
    }));
  },

  rejectRequest: (requestId, reason) => {
    const { currentUserId } = get();
    set((state) => ({
      requests: state.requests.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'rejected',
              reviewedById: currentUserId,
              reviewedAt: new Date().toISOString(),
              rejectionReason: reason,
            }
          : r,
      ),
    }));
  },
}));

export const useFriendIds = () => {
  return useAppStore((state) =>
    state.friendships
      .filter((f) => f.userId === state.currentUserId)
      .map((f) => f.friendId),
  );
};

export const useAllCourts = (): Court[] => {
  const approved = useAppStore((s) => s.approvedCourts);
  return [...COURTS, ...approved];
};

export const usePendingRequests = () =>
  useAppStore((s) => s.requests.filter((r) => r.status === 'pending'));

export const useMyRequests = () =>
  useAppStore((s) => s.requests.filter((r) => r.requestedById === s.currentUserId));
