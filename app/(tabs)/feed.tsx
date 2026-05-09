import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COURTS } from '@/data/courts';
import { useAppStore, useFriendIds } from '@/store/useAppStore';
import { SessionRow } from '@/components/SessionRow';
import { colors } from '@/theme/colors';

type Tab = 'friends' | 'all';

export default function FeedScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('friends');
  const sessions = useAppStore((s) => s.sessions);
  const currentUserId = useAppStore((s) => s.currentUserId);
  const joinSession = useAppStore((s) => s.joinSession);
  const leaveSession = useAppStore((s) => s.leaveSession);
  const friendIds = useFriendIds();

  const visibleSessions = useMemo(() => {
    const now = Date.now();
    return sessions
      .filter((s) => new Date(s.startTime).getTime() > now)
      .filter((s) => {
        if (tab === 'all') return true;
        return (
          s.hostId === currentUserId ||
          friendIds.includes(s.hostId) ||
          s.attendeeIds.includes(currentUserId) ||
          s.attendeeIds.some((id) => friendIds.includes(id))
        );
      })
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [sessions, tab, friendIds, currentUserId]);

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Feed</Text>
        <Text style={styles.subtitle}>Sessions on the radar</Text>
      </View>

      <View style={styles.tabs}>
        <Pressable
          onPress={() => setTab('friends')}
          style={[styles.tab, tab === 'friends' && styles.tabActive]}
        >
          <Text style={[styles.tabText, tab === 'friends' && styles.tabTextActive]}>
            Your circle
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setTab('all')}
          style={[styles.tab, tab === 'all' && styles.tabActive]}
        >
          <Text style={[styles.tabText, tab === 'all' && styles.tabTextActive]}>
            Everyone
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {visibleSessions.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Nothing on yet</Text>
            <Text style={styles.emptySub}>
              {tab === 'friends'
                ? 'Add friends or check Everyone to see sessions nearby.'
                : 'Drop the first session at any court.'}
            </Text>
          </View>
        ) : (
          visibleSessions.map((session) => {
            const court = COURTS.find((c) => c.id === session.courtId);
            const joined = session.attendeeIds.includes(currentUserId);
            const isHost = session.hostId === currentUserId;
            return (
              <Pressable
                key={session.id}
                onPress={() => router.push(`/court/${session.courtId}`)}
              >
                <SessionRow
                  session={session}
                  showCourt={court?.name}
                  joined={joined}
                  onJoin={!joined ? () => joinSession(session.id, currentUserId) : undefined}
                  onLeave={joined && !isHost ? () => leaveSession(session.id, currentUserId) : undefined}
                />
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 2,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.surface,
    borderRadius: 999,
  },
  tabActive: {
    backgroundColor: colors.text,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  empty: {
    backgroundColor: colors.surface,
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  emptySub: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
});
