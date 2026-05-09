import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Avatar } from './Avatar';
import { Pill } from './Pill';
import { colors } from '@/theme/colors';
import { USERS } from '@/data/users';
import { formatSessionTime } from '@/lib/format';
import type { Session } from '@/types';

interface SessionRowProps {
  session: Session;
  showCourt?: string;
  onJoin?: () => void;
  onLeave?: () => void;
  joined?: boolean;
}

export function SessionRow({ session, showCourt, onJoin, onLeave, joined }: SessionRowProps) {
  const host = USERS.find((u) => u.id === session.hostId);
  const attendees = session.attendeeIds.map((id) => USERS.find((u) => u.id === id)).filter(Boolean);
  const stackCount = Math.min(attendees.length, 3);

  return (
    <View style={styles.row}>
      <View style={styles.timeCol}>
        <Text style={styles.time}>{formatSessionTime(session.startTime).split(',')[0]}</Text>
        <Text style={styles.timeSub}>
          {formatSessionTime(session.startTime).split(',')[1]?.trim()}
        </Text>
      </View>

      <View style={styles.body}>
        <View style={styles.bodyHeader}>
          {host && (
            <>
              <Avatar name={host.name} color={host.avatarColor} size={28} />
              <Text style={styles.hostName}>{host.name}</Text>
            </>
          )}
          <Pill label={`${session.durationMinutes}m`} />
        </View>
        {showCourt && <Text style={styles.courtName}>{showCourt}</Text>}
        {session.note && <Text style={styles.note}>{session.note}</Text>}

        <View style={styles.footer}>
          <View style={styles.attendees}>
            {attendees.slice(0, stackCount).map((u, i) => (
              <View
                key={u!.id}
                style={[styles.stackedAvatar, { marginLeft: i === 0 ? 0 : -8, zIndex: 10 - i }]}
              >
                <Avatar name={u!.name} color={u!.avatarColor} size={24} ring />
              </View>
            ))}
            <Text style={styles.attendeeCount}>
              {session.attendeeIds.length} going
              {session.maxPlayers ? ` · ${session.maxPlayers - session.attendeeIds.length} spots` : ''}
            </Text>
          </View>
          {onJoin && !joined && (
            <Pressable onPress={onJoin} style={styles.joinBtn}>
              <Text style={styles.joinText}>Join</Text>
            </Pressable>
          )}
          {onLeave && joined && (
            <Pressable onPress={onLeave} style={[styles.joinBtn, styles.leaveBtn]}>
              <Text style={[styles.joinText, styles.leaveText]}>Going</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeCol: {
    width: 78,
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  time: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  timeSub: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  body: {
    flex: 1,
    paddingLeft: 12,
  },
  bodyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hostName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  courtName: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
    fontWeight: '500',
  },
  note: {
    fontSize: 13,
    color: colors.text,
    marginTop: 6,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  attendees: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stackedAvatar: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 12,
  },
  attendeeCount: {
    fontSize: 12,
    color: colors.textMuted,
    marginLeft: 8,
    fontWeight: '500',
  },
  joinBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: colors.primary,
    borderRadius: 999,
  },
  joinText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  leaveBtn: {
    backgroundColor: colors.surfaceAlt,
  },
  leaveText: {
    color: colors.text,
  },
});
