import { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';
import type { CourtType } from '@/types';

interface RequestCourtSheetProps {
  visible: boolean;
  latitude: number | null;
  longitude: number | null;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    suburb: string;
    type: CourtType;
    hoops: number;
    lights: boolean;
    notes: string;
    latitude: number;
    longitude: number;
  }) => void;
}

export function RequestCourtSheet({
  visible,
  latitude,
  longitude,
  onClose,
  onSubmit,
}: RequestCourtSheetProps) {
  const [name, setName] = useState('');
  const [suburb, setSuburb] = useState('');
  const [type, setType] = useState<CourtType>('outdoor');
  const [hoops, setHoops] = useState(2);
  const [lights, setLights] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!visible) {
      setName('');
      setSuburb('');
      setType('outdoor');
      setHoops(2);
      setLights(false);
      setNotes('');
    }
  }, [visible]);

  const canSubmit = name.trim().length >= 2 && suburb.trim().length >= 2 && latitude !== null;

  const handleSubmit = () => {
    if (!canSubmit || latitude === null || longitude === null) return;
    onSubmit({
      name: name.trim(),
      suburb: suburb.trim(),
      type,
      hoops,
      lights,
      notes: notes.trim(),
      latitude,
      longitude,
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <SafeAreaView edges={['bottom']} style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title}>Request a court</Text>
            <Text style={styles.subtitle}>
              {latitude !== null && longitude !== null
                ? `Pin at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
                : 'Tap on the map to drop a pin'}
            </Text>
          </View>

          <ScrollView style={{ maxHeight: 480 }} showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Court name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. Marrickville Park"
              placeholderTextColor={colors.textLight}
              style={styles.input}
              maxLength={60}
            />

            <Text style={styles.label}>Suburb</Text>
            <TextInput
              value={suburb}
              onChangeText={setSuburb}
              placeholder="e.g. Marrickville"
              placeholderTextColor={colors.textLight}
              style={styles.input}
              maxLength={40}
            />

            <Text style={styles.label}>Type</Text>
            <View style={styles.row}>
              {(['outdoor', 'indoor'] as CourtType[]).map((t) => (
                <Pressable
                  key={t}
                  onPress={() => setType(t)}
                  style={[styles.choice, type === t && styles.choiceActive]}
                >
                  <Text style={[styles.choiceText, type === t && styles.choiceTextActive]}>
                    {t === 'indoor' ? 'Indoor' : 'Outdoor'}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>Hoops</Text>
            <View style={styles.row}>
              {[1, 2, 4, 6].map((h) => (
                <Pressable
                  key={h}
                  onPress={() => setHoops(h)}
                  style={[styles.choice, hoops === h && styles.choiceActive]}
                >
                  <Text style={[styles.choiceText, hoops === h && styles.choiceTextActive]}>
                    {h}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.toggleRow}>
              <View>
                <Text style={styles.toggleLabel}>Lights</Text>
                <Text style={styles.toggleSub}>Playable after sunset</Text>
              </View>
              <Switch
                value={lights}
                onValueChange={setLights}
                trackColor={{ false: colors.surfaceAlt, true: colors.primary }}
              />
            </View>

            <Text style={styles.label}>Notes (optional)</Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Any tips? Surface, vibe, busy times..."
              placeholderTextColor={colors.textLight}
              style={[styles.input, styles.notes]}
              multiline
              maxLength={200}
            />
          </ScrollView>

          <Pressable
            disabled={!canSubmit}
            onPress={handleSubmit}
            style={[styles.submit, !canSubmit && styles.submitDisabled]}
          >
            <Text style={styles.submitText}>
              {canSubmit ? 'Submit for review' : 'Add a name and suburb'}
            </Text>
          </Pressable>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: colors.text,
  },
  notes: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  choice: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    alignItems: 'center',
  },
  choiceActive: {
    backgroundColor: colors.text,
  },
  choiceText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  choiceTextActive: {
    color: '#FFFFFF',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  toggleSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  submit: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  submitDisabled: {
    backgroundColor: colors.surfaceAlt,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
