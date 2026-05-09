import type { Session } from '@/types';

const now = new Date();

const inHours = (h: number) => {
  const d = new Date(now);
  d.setHours(d.getHours() + h);
  d.setMinutes(0, 0, 0);
  return d.toISOString();
};

const inDays = (d: number, hour: number) => {
  const date = new Date(now);
  date.setDate(date.getDate() + d);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
};

export const SESSIONS: Session[] = [
  {
    id: 's1',
    courtId: 'c1',
    hostId: 'u2',
    startTime: inHours(3),
    durationMinutes: 90,
    attendeeIds: ['u2', 'u4'],
    note: 'Casual shootaround, all welcome',
    maxPlayers: 10,
  },
  {
    id: 's2',
    courtId: 'c2',
    hostId: 'u3',
    startTime: inDays(1, 17),
    durationMinutes: 120,
    attendeeIds: ['u3', 'u6', 'u7'],
    note: '5v5 if we get enough',
    maxPlayers: 10,
  },
  {
    id: 's3',
    courtId: 'c4',
    hostId: 'u5',
    startTime: inDays(1, 8),
    durationMinutes: 60,
    attendeeIds: ['u5'],
    note: 'Morning shoot before work',
  },
  {
    id: 's4',
    courtId: 'c2',
    hostId: 'u4',
    startTime: inDays(2, 18),
    durationMinutes: 120,
    attendeeIds: ['u4', 'u2'],
    note: 'Pickup, intermediate level',
    maxPlayers: 10,
  },
  {
    id: 's5',
    courtId: 'c8',
    hostId: 'u6',
    startTime: inDays(2, 19),
    durationMinutes: 90,
    attendeeIds: ['u6', 'u3'],
    note: 'Indoor session, $10 entry',
  },
  {
    id: 's6',
    courtId: 'c5',
    hostId: 'u8',
    startTime: inDays(3, 16),
    durationMinutes: 90,
    attendeeIds: ['u8'],
  },
  {
    id: 's7',
    courtId: 'c1',
    hostId: 'u1',
    startTime: inDays(0, 19),
    durationMinutes: 60,
    attendeeIds: ['u1'],
    note: 'Just shooting around',
  },
];
