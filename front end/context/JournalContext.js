import React, { createContext, useContext, useState, useMemo } from 'react';

const JournalContext = createContext(null);

const initialEntries = [
  {
    id: '1',
    title: 'Evening reflection',
    preview:
      'Today felt balanced. I had a few moments of stress but overall I feel calm and grounded.',
    dateLabel: 'Nov 16 • 9:30 PM',
    emotion: 'Calm',
  },
  {
    id: '2',
    title: 'Morning check-in',
    preview:
      'Woke up a bit tired but hopeful. I am curious about how today will go.',
    dateLabel: 'Nov 15 • 8:05 AM',
    emotion: 'Neutral',
  },
];

export function JournalProvider({ children }) {
  const [entries, setEntries] = useState(initialEntries);

  const addEntry = (entry) => {
    setEntries((current) => [
      {
        id: String(Date.now()),
        ...entry,
      },
      ...current,
    ]);
  };

  const value = useMemo(
    () => ({ entries, addEntry }),
    [entries]
  );

  return <JournalContext.Provider value={value}>{children}</JournalContext.Provider>;
}

export function useJournal() {
  const ctx = useContext(JournalContext);
  if (!ctx) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return ctx;
}
