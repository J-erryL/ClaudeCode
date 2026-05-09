import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Pill } from './Pill';
import { Avatar } from './Avatar';
import { USERS } from '@/data/users';
import { colors } from '@/theme/colors';
import type { CourtRequest } from '@/types';

interface RequestRowProps {
  request: CourtRequest;
  showRequester?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
}

export function RequestRow({ request, showRequester, onApprove, onReject }: RequestRowProps) {
  const requester = USERS.find((u) => u.id === request.requestedById);
  const statusVariant =
    request.status === 'approved'
      ? 'success'
      : request.status === 'rejected'
        ? 'muted'
        : 'primary';
  const statusLabel =
    request.status === 'pending' ? 'Pending' : request.status === 'approved' ? 'Approved' : 'Rejected';

  return (
    <View style={styles.row}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{request.name}</Text>
          <Text style={styles.suburb}>
            {request.suburb} · {request.type === 'indoor' ? 'Indoor' : 'Outdoor'} · {request.hoops}{' '}
            {request.hoops === 1 ? 'hoop' : 'hoops'}
            {request.lights ? ' · lights' : ''}
          </Text>
        </View>
        <Pill label={statusLabel} variant={statusVariant} />
      </View>

      {showRequester && requester && (
        <View style={styles.requester}>
          <Avatar name={requester.name} color={requester.avatarColor} size={24} />
          <Text style={styles.requesterText}>Requested by {requester.name}</Text>
        </View>
      )}

      {request.notes && <Text style={styles.notes}>{request.notes}</Text>}

      <Text style={styles.coords}>
        📍 {request.latitude.toFixed(4)}, {request.longitude.toFixed(4)}
      </Text>

      {(onApprove || onReject) && request.status === 'pending' && (
        <View style={styles.actions}>
          {onReject && (
            <Pressable onPress={onReject} style={[styles.btn, styles.rejectBtn]}>
              <Text style={styles.rejectText}>Reject</Text>
            </Pressable>
          )}
          {onApprove && (
            <Pressable onPress={onApprove} style={[styles.btn, styles.approveBtn]}>
              <Text style={styles.approveText}>Approve</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  suburb: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  requester: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  requesterText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  notes: {
    fontSize: 13,
    color: colors.text,
    marginTop: 8,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  coords: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 8,
    fontVariant: ['tabular-nums'],
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  btn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  approveBtn: {
    backgroundColor: colors.success,
  },
  approveText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  rejectBtn: {
    backgroundColor: colors.surfaceAlt,
  },
  rejectText: {
    color: colors.textMuted,
    fontWeight: '600',
    fontSize: 13,
  },
});
