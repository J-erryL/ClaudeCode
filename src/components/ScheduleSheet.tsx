import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';

interface ScheduleSheetProps {
  visible: boolean;
  courtName: string;
  onClose: () => void;
  onSchedule: (params: { startTime: string; durationMinutes: number; note: string }) => void;
}

const DURATIONS = [60, 90, 120, 180];

const buildDayOptions = () => {
  const days: { label: string; date: Date }[] = [];
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    d.setHours(0, 0, 0, 0);
    days.push({
      label:
        i === 0
          ? 'Today'
          : i === 1
            ? 'Tomorrow'
            : d.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric' }),
      date: d,
    });
  }
  return days;
};

const buildHourOptions = (selectedDay: Date) => {
  const hours: { label: string; hour: number; disabled: boolean }[] = [];
  const now = new Date();
  const isToday = selectedDay.toDateString() === now.toDateString();
  for (let h = 6; h <= 22; h++) {
    const disabled = isToday && h <= now.getHours();
    const label = new Date(0, 0, 0, h).toLocaleTimeString('en-AU', {
      hour: 'numeric',
      hour12: true,
    });
    hours.push({ label, hour: h, disabled });
  }
  return hours;
};

export function ScheduleSheet({ visible, courtName, onClose, onSchedule }: ScheduleSheetProps) {
  const days = useMemo(buildDayOptions, [visible]);
  const [dayIndex, setDayIndex] = useState(0);
  const [hour, setHour] = useState<number | null>(null);
  const [duration, setDuration] = useState(90);
  const [note, setNote] = useState('');

  const hourOptions = useMemo(() => buildHourOptions(days[dayIndex].date), [dayIndex, days]);

  const canSubmit = hour !== null;

  const handleSubmit = () => {
    if (hour === null) return;
    const start = new Date(days[dayIndex].date);
    start.setHours(hour, 0, 0, 0);
    onSchedule({
      startTime: start.toISOString(),
      durationMinutes: duration,
      note: note.trim(),
    });
    setHour(null);
    setNote('');
    setDuration(90);
    setDayIndex(0);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <SafeAreaView edges={['bottom']} style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title}>Schedule a session</Text>
            <Text style={styles.subtitle}>{courtName}</Text>
          </View>

          <ScrollView style={{ maxHeight: 480 }} showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Day</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
              {days.map((d, i) => (
                <Pressable
                  key={i}
                  onPress={() => {
                    setDayIndex(i);
                    setHour(null);
                  }}
                  style={[styles.dayChip, dayIndex === i && styles.dayChipActive]}
                >
                  <Text style={[styles.dayText, dayIndex === i && styles.dayTextActive]}>
                    {d.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            <Text style={styles.label}>Time</Text>
            <View style={styles.hourGrid}>
              {hourOptions.map((opt) => (
                <Pressable
                  key={opt.hour}
                  disabled={opt.disabled}
                  onPress={() => setHour(opt.hour)}
                  style={[
                    styles.hourChip,
                    hour === opt.hour && styles.hourChipActive,
                    opt.disabled && styles.hourChipDisabled,
                  ]}
                >
                  <Text
                    style={[
                      styles.hourText,
                      hour === opt.hour && styles.hourTextActive,
                      opt.disabled && styles.hourTextDisabled,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>Duration</Text>
            <View style={styles.durationRow}>
              {DURATIONS.map((d) => (
                <Pressable
                  key={d}
                  onPress={() => setDuration(d)}
                  style={[styles.durationChip, duration === d && styles.durationChipActive]}
                >
                  <Text
                    style={[styles.durationText, duration === d && styles.durationTextActive]}
                  >
                    {d < 60 ? `${d}m` : `${Math.round(d / 60)}h${d % 60 ? ` ${d % 60}m` : ''}`}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>Note (optional)</Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Casual shootaround, all welcome..."
              placeholderTextColor={colors.textLight}
              style={styles.input}
              multiline
              maxLength={140}
            />
          </ScrollView>

          <Pressable
            disabled={!canSubmit}
            onPress={handleSubmit}
            style={[styles.submit, !canSubmit && styles.submitDisabled]}
          >
            <Text style={styles.submitText}>
              {canSubmit ? 'Lock it in' : 'Pick a time'}
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
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
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
  scroll: {
    marginHorizontal: -4,
  },
  dayChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  dayChipActive: {
    backgroundColor: colors.text,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  dayTextActive: {
    color: '#FFFFFF',
  },
  hourGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hourChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.surface,
    borderRadius: 12,
    minWidth: 72,
    alignItems: 'center',
  },
  hourChipActive: {
    backgroundColor: colors.primary,
  },
  hourChipDisabled: {
    opacity: 0.35,
  },
  hourText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  hourTextActive: {
    color: '#FFFFFF',
  },
  hourTextDisabled: {
    color: colors.textLight,
  },
  durationRow: {
    flexDirection: 'row',
    gap: 8,
  },
  durationChip: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    alignItems: 'center',
  },
  durationChipActive: {
    backgroundColor: colors.text,
  },
  durationText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  durationTextActive: {
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: colors.text,
    minHeight: 80,
    textAlignVertical: 'top',
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
