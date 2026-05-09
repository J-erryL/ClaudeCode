import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from '@/components/Avatar';
import { Pill } from '@/components/Pill';
import { USERS } from '@/data/users';
import { useAppStore, useFriendIds } from '@/store/useAppStore';
import { formatRelative } from '@/lib/format';
import { colors } from '@/theme/colors';

export default function FriendsScreen() {
  const [query, setQuery] = useState('');
  const friendIds = useFriendIds();
  const currentUserId = useAppStore((s) => s.currentUserId);
  const sessions = useAppStore((s) => s.sessions);
  const addFriend = useAppStore((s) => s.addFriend);
  const removeFriend = useAppStore((s) => s.removeFriend);

  const friends = useMemo(
    () => USERS.filter((u) => friendIds.includes(u.id)),
    [friendIds],
  );

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    return USERS.filter(
      (u) =>
        u.id !== currentUserId &&
        !friendIds.includes(u.id) &&
        (q === '' || u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q)),
    );
  }, [query, friendIds, currentUserId]);

  const nextSessionFor = (userId: string) => {
    const now = Date.now();
    return sessions
      .filter((s) => new Date(s.startTime).getTime() > now)
      .filter((s) => s.hostId === userId || s.attendeeIds.includes(userId))
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0];
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Friends</Text>
          <Text style={styles.subtitle}>
            {friends.length} {friends.length === 1 ? 'friend' : 'friends'}
          </Text>
        </View>

        <View style={styles.searchWrap}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Find by name or @username"
            placeholderTextColor={colors.textLight}
            style={styles.search}
          />
        </View>

        {friends.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>Your circle</Text>
            {friends.map((friend) => {
              const next = nextSessionFor(friend.id);
              return (
                <View key={friend.id} style={styles.row}>
                  <Avatar name={friend.name} color={friend.avatarColor} size={48} />
                  <View style={styles.rowBody}>
                    <Text style={styles.rowName}>{friend.name}</Text>
                    {next ? (
                      <Text style={styles.rowSub}>
                        Playing {formatRelative(next.startTime)}
                      </Text>
                    ) : (
                      <Text style={styles.rowSub}>@{friend.username}</Text>
                    )}
                  </View>
                  {next && <Pill label="Active" variant="success" />}
                  <Pressable
                    onPress={() => removeFriend(friend.id)}
                    style={[styles.actionBtn, styles.removeBtn]}
                  >
                    <Text style={styles.removeText}>Remove</Text>
                  </Pressable>
                </View>
              );
            })}
          </>
        )}

        <Text style={styles.sectionLabel}>
          {query.trim() ? 'Search results' : 'Suggested'}
        </Text>
        {suggestions.length === 0 ? (
          <Text style={styles.emptyText}>No matches</Text>
        ) : (
          suggestions.map((user) => (
            <View key={user.id} style={styles.row}>
              <Avatar name={user.name} color={user.avatarColor} size={48} />
              <View style={styles.rowBody}>
                <Text style={styles.rowName}>{user.name}</Text>
                <Text style={styles.rowSub}>
                  @{user.username} · {user.skill}
                </Text>
              </View>
              <Pressable
                onPress={() => addFriend(user.id)}
                style={[styles.actionBtn, styles.addBtn]}
              >
                <Text style={styles.addText}>+ Add</Text>
              </Pressable>
            </View>
          ))
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
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 16,
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
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 18,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  search: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: colors.background,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  rowBody: {
    flex: 1,
  },
  rowName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  rowSub: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  actionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
  },
  addBtn: {
    backgroundColor: colors.primary,
  },
  addText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  removeBtn: {
    backgroundColor: colors.surfaceAlt,
  },
  removeText: {
    color: colors.textMuted,
    fontWeight: '600',
    fontSize: 13,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: 16,
  },
});
