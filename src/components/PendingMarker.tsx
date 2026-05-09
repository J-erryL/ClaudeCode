import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';

export function PendingMarker() {
  return (
    <View style={styles.wrap}>
      <View style={styles.bubble}>
        <Text style={styles.icon}>?</Text>
      </View>
      <View style={styles.tail} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  bubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderStyle: 'dashed',
    backgroundColor: colors.textMuted,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  icon: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  tail: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.textMuted,
    marginTop: -2,
  },
});
