import type { User, Friendship } from '@/types';

export const CURRENT_USER_ID = 'u1';

export const USERS: User[] = [
  { id: 'u1', name: 'You', username: 'you', avatarColor: '#FF6B35', skill: 'intermediate' },
  { id: 'u2', name: 'Alex Chen', username: 'alexc', avatarColor: '#3B82F6', skill: 'competitive' },
  { id: 'u3', name: 'Maya Patel', username: 'mayap', avatarColor: '#10B981', skill: 'casual' },
  { id: 'u4', name: 'Jordan Lee', username: 'jlee', avatarColor: '#8B5CF6', skill: 'intermediate' },
  { id: 'u5', name: 'Sam O\'Connor', username: 'samoc', avatarColor: '#EC4899', skill: 'competitive' },
  { id: 'u6', name: 'Priya Nair', username: 'priyan', avatarColor: '#F59E0B', skill: 'intermediate' },
  { id: 'u7', name: 'Tom Williams', username: 'tomw', avatarColor: '#06B6D4', skill: 'casual' },
  { id: 'u8', name: 'Zara Ahmed', username: 'zaraa', avatarColor: '#EF4444', skill: 'intermediate' },
];

export const FRIENDSHIPS: Friendship[] = [
  { userId: 'u1', friendId: 'u2' },
  { userId: 'u1', friendId: 'u3' },
  { userId: 'u1', friendId: 'u4' },
  { userId: 'u1', friendId: 'u6' },
];
