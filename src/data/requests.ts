import type { CourtRequest } from '@/types';

const hoursAgo = (h: number) => {
  const d = new Date();
  d.setHours(d.getHours() - h);
  return d.toISOString();
};

export const COURT_REQUESTS: CourtRequest[] = [
  {
    id: 'r1',
    name: 'Marrickville Park',
    type: 'outdoor',
    sport: 'basketball',
    latitude: -33.9133,
    longitude: 151.1561,
    suburb: 'Marrickville',
    hoops: 2,
    lights: false,
    notes: 'New asphalt court next to the oval',
    requestedById: 'u3',
    status: 'pending',
    createdAt: hoursAgo(8),
  },
  {
    id: 'r2',
    name: 'Five Dock Park',
    type: 'outdoor',
    sport: 'basketball',
    latitude: -33.8624,
    longitude: 151.1306,
    suburb: 'Five Dock',
    hoops: 1,
    lights: true,
    requestedById: 'u4',
    status: 'pending',
    createdAt: hoursAgo(26),
  },
];
