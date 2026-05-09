import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';

interface PillProps {
  label: string;
  variant?: 'primary' | 'muted' | 'success' | 'indoor' | 'outdoor';
}

export function Pill({ label, variant = 'muted' }: PillProps) {
  const palette = {
    primary: { bg: colors.primaryLight, fg: colors.primaryDark },
    muted: { bg: colors.surfaceAlt, fg: colors.textMuted },
    success: { bg: '#D1FAE5', fg: '#047857' },
    indoor: { bg: '#EEF2FF', fg: colors.indoor },
    outdoor: { bg: colors.primaryLight, fg: colors.primaryDark },
  }[variant];

  return (
    <View style={[styles.pill, { backgroundColor: palette.bg }]}>
      <Text style={[styles.label, { color: palette.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
