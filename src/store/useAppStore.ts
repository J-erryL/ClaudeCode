import { create } from 'zustand';
import type { Session, Friendship } from '@/types';
import { SESSIONS } from '@/data/sessions';
import { FRIENDSHIPS, CURRENT_USER_ID } from '@/data/users';

interface AppState {
  currentUserId: string;
  sessions: Session[];
  friendships: Friendship[];
  addSession: (session: Omit<Session, 'id'>) => Session;
  joinSession: (sessionId: string, userId: string) => void;
  leaveSession: (sessionId: string, userId: string) => void;
  addFriend: (friendId: string) => void;
  removeFriend: (friendId: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUserId: CURRENT_USER_ID,
  sessions: SESSIONS,
  friendships: FRIENDSHIPS,

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
}));

export const useFriendIds = () => {
  return useAppStore((state) =>
    state.friendships
      .filter((f) => f.userId === state.currentUserId)
      .map((f) => f.friendId),
  );
};
