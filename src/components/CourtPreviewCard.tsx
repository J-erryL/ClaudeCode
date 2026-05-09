import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/theme/colors';
import { Pill } from './Pill';
import { Avatar } from './Avatar';
import { useAppStore } from '@/store/useAppStore';
import { USERS } from '@/data/users';
import { formatRelative } from '@/lib/format';
import type { Court } from '@/types';

interface CourtPreviewCardProps {
  court: Court;
  onClose: () => void;
}

export function CourtPreviewCard({ court, onClose }: CourtPreviewCardProps) {
  const router = useRouter();
  const sessions = useAppStore((s) =>
    s.sessions
      .filter((sess) => sess.courtId === court.id)
      .filter((sess) => new Date(sess.startTime).getTime() > Date.now())
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()),
  );

  const next = sessions[0];
  const nextHost = next ? USERS.find((u) => u.id === next.hostId) : null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <View style={styles.pillRow}>
            <Pill
              label={court.type === 'indoor' ? 'Indoor' : 'Outdoor'}
              variant={court.type === 'indoor' ? 'indoor' : 'outdoor'}
            />
            {court.free && <Pill label="Free" variant="success" />}
            {court.lights && <Pill label="Lights" />}
          </View>
          <Text style={styles.name}>{court.name}</Text>
          <Text style={styles.suburb}>
            {court.suburb} · {court.hoops} {court.hoops === 1 ? 'hoop' : 'hoops'}
          </Text>
        </View>
        <Pressable onPress={onClose} hitSlop={12} style={styles.close}>
          <Text style={styles.closeIcon}>×</Text>
        </Pressable>
      </View>

      <View style={styles.divider} />

      {next && nextHost ? (
        <View style={styles.nextRow}>
          <Avatar name={nextHost.name} color={nextHost.avatarColor} size={36} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.nextLabel}>Next session {formatRelative(next.startTime)}</Text>
            <Text style={styles.nextHost}>
              {nextHost.name} · {next.attendeeIds.length} going
            </Text>
          </View>
        </View>
      ) : (
        <Text style={styles.emptyText}>No sessions scheduled. Be the first.</Text>
      )}

      <Pressable
        onPress={() => router.push(`/court/${court.id}`)}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Text style={styles.buttonText}>
          {sessions.length > 0 ? `View ${sessions.length} session${sessions.length === 1 ? '' : 's'}` : 'Schedule a session'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  pillRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  suburb: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 2,
  },
  close: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 22,
    color: colors.textMuted,
    lineHeight: 24,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 14,
  },
  nextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  nextLabel: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500',
  },
  nextHost: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '600',
    marginTop: 2,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 14,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonPressed: {
    backgroundColor: colors.primaryDark,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
