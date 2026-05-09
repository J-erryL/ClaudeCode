import { useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useAllCourts,
  useAppStore,
  usePendingRequests,
} from '@/store/useAppStore';
import { CourtsMap, type CourtsMapHandle } from '@/components/CourtsMap';
import { CourtPreviewCard } from '@/components/CourtPreviewCard';
import { RequestCourtSheet } from '@/components/RequestCourtSheet';
import { colors } from '@/theme/colors';
import type { CourtType } from '@/types';

type FilterKey = 'all' | CourtType;

export default function MapScreen() {
  const mapRef = useRef<CourtsMapHandle>(null);
  const allCourts = useAllCourts();
  const pendingRequests = usePendingRequests();
  const sessions = useAppStore((s) => s.sessions);
  const submitCourtRequest = useAppStore((s) => s.submitCourtRequest);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [requestMode, setRequestMode] = useState(false);
  const [pendingPin, setPendingPin] = useState<{ lat: number; lng: number } | null>(null);

  const sessionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const now = Date.now();
    for (const s of sessions) {
      if (new Date(s.startTime).getTime() < now) continue;
      counts[s.courtId] = (counts[s.courtId] ?? 0) + 1;
    }
    return counts;
  }, [sessions]);

  const visibleCourts = useMemo(
    () => allCourts.filter((c) => filter === 'all' || c.type === filter),
    [allCourts, filter],
  );

  const selectedCourt = useMemo(
    () => allCourts.find((c) => c.id === selectedId) ?? null,
    [allCourts, selectedId],
  );

  const handleSelect = (id: string) => {
    setSelectedId(id);
    const court = allCourts.find((c) => c.id === id);
    if (court) mapRef.current?.focusCourt(court.latitude, court.longitude);
  };

  const handleMapPress = (lat: number, lng: number) => {
    setPendingPin({ lat, lng });
  };

  const handleSubmitRequest = (data: {
    name: string;
    suburb: string;
    type: CourtType;
    hoops: number;
    lights: boolean;
    notes: string;
    latitude: number;
    longitude: number;
  }) => {
    submitCourtRequest({
      name: data.name,
      suburb: data.suburb,
      type: data.type,
      sport: 'basketball',
      hoops: data.hoops,
      lights: data.lights,
      notes: data.notes || undefined,
      latitude: data.latitude,
      longitude: data.longitude,
    });
    setPendingPin(null);
    setRequestMode(false);
  };

  return (
    <View style={styles.container}>
      <CourtsMap
        ref={mapRef}
        courts={visibleCourts}
        pendingRequests={pendingRequests}
        selectedId={selectedId}
        sessionCounts={sessionCounts}
        onSelect={handleSelect}
        onDeselect={() => setSelectedId(null)}
        onMapPress={requestMode ? handleMapPress : undefined}
      />

      <SafeAreaView edges={['top']} style={styles.topOverlay} pointerEvents="box-none">
        <View style={styles.headerCard}>
          <Text style={styles.brand}>Rally</Text>
          <Text style={styles.tagline}>Find your run · Sydney</Text>
        </View>
        {!requestMode && (
          <View style={styles.filterRow}>
            {(['all', 'outdoor', 'indoor'] as FilterKey[]).map((key) => (
              <Pressable
                key={key}
                onPress={() => setFilter(key)}
                style={[styles.filterChip, filter === key && styles.filterChipActive]}
              >
                <Text style={[styles.filterText, filter === key && styles.filterTextActive]}>
                  {key === 'all' ? 'All courts' : key === 'indoor' ? 'Indoor' : 'Outdoor'}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
        {requestMode && (
          <View style={styles.requestBanner}>
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerTitle}>Tap the map at the court's location</Text>
              <Text style={styles.bannerSub}>We'll ask for the details next</Text>
            </View>
            <Pressable
              onPress={() => {
                setRequestMode(false);
                setPendingPin(null);
              }}
              style={styles.bannerCancel}
            >
              <Text style={styles.bannerCancelText}>Cancel</Text>
            </Pressable>
          </View>
        )}
      </SafeAreaView>

      {!selectedCourt && (
        <SafeAreaView edges={['bottom']} style={styles.fabWrap} pointerEvents="box-none">
          <Pressable
            onPress={() => {
              setSelectedId(null);
              setRequestMode((prev) => !prev);
              setPendingPin(null);
            }}
            style={[styles.fab, requestMode && styles.fabActive]}
          >
            <Text style={[styles.fabIcon, requestMode && styles.fabIconActive]}>
              {requestMode ? '×' : '+'}
            </Text>
          </Pressable>
        </SafeAreaView>
      )}

      {selectedCourt && !requestMode && (
        <SafeAreaView edges={['bottom']} style={styles.bottomOverlay} pointerEvents="box-none">
          <CourtPreviewCard court={selectedCourt} onClose={() => setSelectedId(null)} />
        </SafeAreaView>
      )}

      <RequestCourtSheet
        visible={pendingPin !== null}
        latitude={pendingPin?.lat ?? null}
        longitude={pendingPin?.lng ?? null}
        onClose={() => setPendingPin(null)}
        onSubmit={handleSubmitRequest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    gap: 10,
  },
  headerCard: {
    backgroundColor: colors.background,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginTop: 8,
  },
  brand: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 2,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.background,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  filterChipActive: {
    backgroundColor: colors.text,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  requestBanner: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  bannerSub: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.9,
    marginTop: 2,
  },
  bannerCancel: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  bannerCancelText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  fabWrap: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  fabActive: {
    backgroundColor: colors.text,
  },
  fabIcon: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '300',
    lineHeight: 32,
  },
  fabIconActive: {
    fontSize: 26,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
});
