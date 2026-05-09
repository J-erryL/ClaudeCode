import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COURTS } from '@/data/courts';
import { useAppStore } from '@/store/useAppStore';
import { Pill } from '@/components/Pill';
import { SessionRow } from '@/components/SessionRow';
import { ScheduleSheet } from '@/components/ScheduleSheet';
import { colors } from '@/theme/colors';

export default function CourtDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const court = useMemo(() => COURTS.find((c) => c.id === id), [id]);
  const currentUserId = useAppStore((s) => s.currentUserId);
  const sessions = useAppStore((s) =>
    s.sessions
      .filter((sess) => sess.courtId === id)
      .filter((sess) => new Date(sess.startTime).getTime() > Date.now())
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()),
  );
  const addSession = useAppStore((s) => s.addSession);
  const joinSession = useAppStore((s) => s.joinSession);
  const leaveSession = useAppStore((s) => s.leaveSession);

  if (!court) {
    return (
      <SafeAreaView style={styles.notFound}>
        <Text style={styles.notFoundText}>Court not found</Text>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Go back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const handleSchedule = (params: {
    startTime: string;
    durationMinutes: number;
    note: string;
  }) => {
    addSession({
      courtId: court.id,
      hostId: currentUserId,
      attendeeIds: [currentUserId],
      startTime: params.startTime,
      durationMinutes: params.durationMinutes,
      note: params.note || undefined,
    });
    setScheduleOpen(false);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.iconBtn}>
          <Text style={styles.iconBtnText}>←</Text>
        </Pressable>
        <Text style={styles.topBarTitle}>Court</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.heroPills}>
          <Pill
            label={court.type === 'indoor' ? 'Indoor' : 'Outdoor'}
            variant={court.type === 'indoor' ? 'indoor' : 'outdoor'}
          />
          {court.free && <Pill label="Free" variant="success" />}
          {court.lights && <Pill label="Lights" />}
          <Pill label={court.surface} />
        </View>
        <Text style={styles.title}>{court.name}</Text>
        <Text style={styles.subtitle}>
          {court.address} · {court.suburb}
        </Text>

        <View style={styles.statsRow}>
          <Stat label="Hoops" value={String(court.hoops)} />
          <Stat label="Sessions" value={String(sessions.length)} />
          <Stat label="Type" value={court.type === 'indoor' ? 'Indoor' : 'Outdoor'} />
        </View>

        {court.notes && (
          <View style={styles.notes}>
            <Text style={styles.notesText}>{court.notes}</Text>
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming sessions</Text>
          <Text style={styles.sectionCount}>{sessions.length}</Text>
        </View>

        {sessions.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No sessions yet</Text>
            <Text style={styles.emptySub}>
              Be the first. Drop a time and friends nearby will see it.
            </Text>
          </View>
        ) : (
          sessions.map((session) => {
            const joined = session.attendeeIds.includes(currentUserId);
            const isHost = session.hostId === currentUserId;
            return (
              <SessionRow
                key={session.id}
                session={session}
                joined={joined}
                onJoin={!joined ? () => joinSession(session.id, currentUserId) : undefined}
                onLeave={joined && !isHost ? () => leaveSession(session.id, currentUserId) : undefined}
              />
            );
          })
        )}
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.ctaWrap}>
        <Pressable
          onPress={() => setScheduleOpen(true)}
          style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
        >
          <Text style={styles.ctaText}>+ Schedule a session</Text>
        </Pressable>
      </SafeAreaView>

      <ScheduleSheet
        visible={scheduleOpen}
        courtName={court.name}
        onClose={() => setScheduleOpen(false)}
        onSchedule={handleSchedule}
      />
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnText: {
    fontSize: 20,
    color: colors.text,
    fontWeight: '600',
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  heroPills: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
    marginBottom: 18,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
  notes: {
    backgroundColor: colors.primaryLight,
    padding: 12,
    borderRadius: 12,
    marginBottom: 18,
  },
  notesText: {
    fontSize: 13,
    color: colors.primaryDark,
    lineHeight: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    flex: 1,
  },
  sectionCount: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '600',
  },
  empty: {
    backgroundColor: colors.surface,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  emptySub: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 20,
  },
  ctaWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cta: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginVertical: 12,
  },
  ctaPressed: {
    backgroundColor: colors.primaryDark,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  notFound: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: 16,
    color: colors.textMuted,
    marginBottom: 16,
  },
  backBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
