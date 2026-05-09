import { StyleSheet, Text, View } from 'react-native';
import { initialsOf } from '@/lib/format';

interface AvatarProps {
  name: string;
  color: string;
  size?: number;
  ring?: boolean;
}

export function Avatar({ name, color, size = 36, ring = false }: AvatarProps) {
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          borderWidth: ring ? 2 : 0,
        },
      ]}
    >
      <Text style={[styles.initials, { fontSize: size * 0.4 }]}>{initialsOf(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#FFFFFF',
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
