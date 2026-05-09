import { useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COURTS } from '@/data/courts';
import { useAppStore } from '@/store/useAppStore';
import { CourtsMap, type CourtsMapHandle } from '@/components/CourtsMap';
import { CourtPreviewCard } from '@/components/CourtPreviewCard';
import { colors } from '@/theme/colors';
import type { CourtType } from '@/types';

type FilterKey = 'all' | CourtType;

export default function MapScreen() {
  const mapRef = useRef<CourtsMapHandle>(null);
  const sessions = useAppStore((s) => s.sessions);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterKey>('all');

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
    () => COURTS.filter((c) => filter === 'all' || c.type === filter),
    [filter],
  );

  const selectedCourt = useMemo(
    () => COURTS.find((c) => c.id === selectedId) ?? null,
    [selectedId],
  );

  const handleSelect = (id: string) => {
    setSelectedId(id);
    const court = COURTS.find((c) => c.id === id);
    if (court) mapRef.current?.focusCourt(court.latitude, court.longitude);
  };

  return (
    <View style={styles.container}>
      <CourtsMap
        ref={mapRef}
        courts={visibleCourts}
        selectedId={selectedId}
        sessionCounts={sessionCounts}
        onSelect={handleSelect}
        onDeselect={() => setSelectedId(null)}
      />

      <SafeAreaView edges={['top']} style={styles.topOverlay} pointerEvents="box-none">
        <View style={styles.headerCard}>
          <Text style={styles.brand}>Rally</Text>
          <Text style={styles.tagline}>Find your run · Sydney</Text>
        </View>
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
      </SafeAreaView>

      {selectedCourt && (
        <SafeAreaView edges={['bottom']} style={styles.bottomOverlay} pointerEvents="box-none">
          <CourtPreviewCard court={selectedCourt} onClose={() => setSelectedId(null)} />
        </SafeAreaView>
      )}
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
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
});
