import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from '@/components/Avatar';
import { SessionRow } from '@/components/SessionRow';
import { COURTS } from '@/data/courts';
import { USERS } from '@/data/users';
import { useAppStore, useFriendIds } from '@/store/useAppStore';
import { colors } from '@/theme/colors';

export default function ProfileScreen() {
  const router = useRouter();
  const currentUserId = useAppStore((s) => s.currentUserId);
  const sessions = useAppStore((s) => s.sessions);
  const leaveSession = useAppStore((s) => s.leaveSession);
  const friendIds = useFriendIds();
  const me = USERS.find((u) => u.id === currentUserId)!;

  const upcoming = useMemo(() => {
    const now = Date.now();
    return sessions
      .filter((s) => new Date(s.startTime).getTime() > now)
      .filter((s) => s.attendeeIds.includes(currentUserId))
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [sessions, currentUserId]);

  const hostingCount = sessions.filter(
    (s) => s.hostId === currentUserId && new Date(s.startTime).getTime() > Date.now(),
  ).length;

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Avatar name={me.name} color={me.avatarColor} size={72} />
          <Text style={styles.name}>{me.name}</Text>
          <Text style={styles.username}>@{me.username} · {me.skill}</Text>

          <View style={styles.statsRow}>
            <Stat label="Upcoming" value={String(upcoming.length)} />
            <Stat label="Hosting" value={String(hostingCount)} />
            <Stat label="Friends" value={String(friendIds.length)} />
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your sessions</Text>
        </View>

        {upcoming.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No sessions on the calendar</Text>
            <Text style={styles.emptySub}>Open the map and pick a court to lock one in.</Text>
            <Pressable onPress={() => router.push('/')} style={styles.emptyCta}>
              <Text style={styles.emptyCtaText}>Open map</Text>
            </Pressable>
          </View>
        ) : (
          upcoming.map((session) => {
            const court = COURTS.find((c) => c.id === session.courtId);
            const isHost = session.hostId === currentUserId;
            return (
              <Pressable
                key={session.id}
                onPress={() => router.push(`/court/${session.courtId}`)}
              >
                <SessionRow
                  session={session}
                  showCourt={court?.name}
                  joined
                  onLeave={!isHost ? () => leaveSession(session.id, currentUserId) : undefined}
                />
              </Pressable>
            );
          })
        )}
      </ScrollView>
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
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  heroCard: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: colors.surface,
    borderRadius: 20,
    marginBottom: 18,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginTop: 12,
  },
  username: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
    paddingHorizontal: 16,
    width: '100%',
  },
  stat: {
    flex: 1,
    backgroundColor: colors.background,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
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
  sectionHeader: {
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
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
    marginBottom: 16,
  },
  emptyCta: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  emptyCtaText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
