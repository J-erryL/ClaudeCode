import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';
import type { Court } from '@/types';

interface CourtMarkerProps {
  court: Court;
  sessionCount: number;
  selected?: boolean;
}

export function CourtMarker({ court, sessionCount, selected = false }: CourtMarkerProps) {
  const tint = court.type === 'indoor' ? colors.indoor : colors.outdoor;
  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.bubble,
          { backgroundColor: tint, transform: [{ scale: selected ? 1.15 : 1 }] },
        ]}
      >
        <Text style={styles.icon}>🏀</Text>
        {sessionCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{sessionCount}</Text>
          </View>
        )}
      </View>
      <View style={[styles.tail, { borderTopColor: tint }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  bubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  icon: {
    fontSize: 20,
  },
  tail: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -2,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
});
