import { useMemo } from 'react';
import { useJournal } from './JournalContext';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function formatLocalYMD(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function normalizeDateKey(dateLike) {
  if (!dateLike) return null;
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return null;
  // Use the LOCAL calendar date portion so timezones don't break streaks.
  return formatLocalYMD(d);
}

export function useStreakStats() {
  const { entries } = useJournal();

  return useMemo(() => {
    if (!entries || entries.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        entriesLast7Days: 0,
        lastEntryDateLabel: null,
        history: [],
      };
    }

    const dayKeys = [];
    const uniqueDays = new Set();
    const buckets = new Map(); // dateKey -> { total, emotions: { [emotion]: count } }

    for (const entry of entries) {
      const key = normalizeDateKey(entry.createdAt);
      if (!key) continue;

      if (!uniqueDays.has(key)) {
        uniqueDays.add(key);
        dayKeys.push(key);
      }

      const bucket = buckets.get(key) || { total: 0, emotions: {} };
      bucket.total += 1;
      const emotion = entry.emotion || 'Neutral';
      bucket.emotions[emotion] = (bucket.emotions[emotion] || 0) + 1;
      buckets.set(key, bucket);
    }

    if (dayKeys.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        entriesLast7Days: 0,
        lastEntryDateLabel: entries[0]?.dateLabel || null,
        history: [],
      };
    }

    // Sort calendar days ascending for longest streak.
    dayKeys.sort();

    let longestStreak = 1;
    let currentRun = 1;

    for (let i = 1; i < dayKeys.length; i += 1) {
      const prev = new Date(dayKeys[i - 1]);
      const curr = new Date(dayKeys[i]);
      const diff = Math.round((curr - prev) / MS_PER_DAY);

      if (diff === 0) {
        // Multiple entries on the same day; do not reset the run.
        continue;
      }

      if (diff === 1) {
        currentRun += 1;
      } else {
        currentRun = 1;
      }

      if (currentRun > longestStreak) {
        longestStreak = currentRun;
      }
    }

    // Compute the current streak, walking backwards from the most recent journaling day.
    const dayKeysDesc = [...dayKeys].sort((a, b) => b.localeCompare(a));
    let currentStreak = 1;

    for (let i = 1; i < dayKeysDesc.length; i += 1) {
      const prev = new Date(dayKeysDesc[i - 1]);
      const curr = new Date(dayKeysDesc[i]);
      const diff = Math.round((prev - curr) / MS_PER_DAY);

      if (diff === 0) {
        // Same calendar day: keep the streak going.
        continue;
      }

      if (diff === 1) {
        currentStreak += 1;
      } else {
        break; // Gap > 1 day ends the streak.
      }
    }

    // Determine the last entry date label based on the most recent createdAt.
    let lastEntryDateLabel = null;
    let lastCreatedAt = null;
    for (const entry of entries) {
      if (!entry.createdAt) continue;
      const d = new Date(entry.createdAt);
      if (Number.isNaN(d.getTime())) continue;
      if (!lastCreatedAt || d > lastCreatedAt) {
        lastCreatedAt = d;
        lastEntryDateLabel = entry.dateLabel || null;
      }
    }
    if (!lastEntryDateLabel && entries[0]?.dateLabel) {
      lastEntryDateLabel = entries[0].dateLabel;
    }

    // Build a simple 7-day history window ending today for visualization.
    const today = new Date();
    const history = [];

    for (let offset = 6; offset >= 0; offset -= 1) {
      const d = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - offset,
      );
      const key = formatLocalYMD(d);
      const bucket = buckets.get(key);

      let dominantEmotion = null;
      let total = 0;

      if (bucket) {
        total = bucket.total;
        let maxCount = 0;
        Object.entries(bucket.emotions).forEach(([emotion, count]) => {
          if (count > maxCount) {
            maxCount = count;
            dominantEmotion = emotion;
          }
        });
      }

      history.push({
        date: d,
        dateKey: key,
        label: String(d.getDate()),
        emotion: dominantEmotion,
        total,
      });
    }

    const entriesLast7Days = history.reduce((sum, day) => sum + day.total, 0);

    return {
      currentStreak,
      longestStreak,
      entriesLast7Days,
      lastEntryDateLabel,
      history,
    };
  }, [entries]);
}
