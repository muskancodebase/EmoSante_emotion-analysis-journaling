import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { useFeedback } from './FeedbackContext';
import { ApiJournalRepository } from '../domain/journal/ApiJournalRepository';
import { GetAllJournalEntriesUseCase } from '../domain/journal/GetAllJournalEntriesUseCase';
import { AddJournalEntryUseCase } from '../domain/journal/AddJournalEntryUseCase';
import { UpdateJournalEntryUseCase } from '../domain/journal/UpdateJournalEntryUseCase';
import { DeleteJournalEntryUseCase } from '../domain/journal/DeleteJournalEntryUseCase';

const JournalContext = createContext(null);

export function JournalProvider({ children }) {
  const { token } = useAuth();
  const { showToast } = useFeedback();
  const [entries, setEntries] = useState([]);

  // Load entries when a token becomes available.
  useEffect(() => {
    const loadEntries = async () => {
      if (!token) {
        setEntries([]);
        return;
      }

      try {
        const repository = new ApiJournalRepository(token);
        const useCase = new GetAllJournalEntriesUseCase(repository);
        const data = await useCase.execute();
        setEntries(Array.isArray(data) ? data : []);
      } catch (err) {
        // Keep the same user-facing message as before for consistency.
        showToast('error', 'Could not load journal entries');
      }
    };

    loadEntries();
  }, [token, showToast]);

  const addEntry = async ({ title, content, emotion }) => {
    if (!token) {
      showToast('error', 'You must be logged in to add entries');
      return null;
    }

    try {
      const repository = new ApiJournalRepository(token);
      const useCase = new AddJournalEntryUseCase(repository);
      const data = await useCase.execute({ title, content, emotion });

      setEntries((current) => [data, ...current]);
      return data;
    } catch (err) {
      const message = err?.message || 'Could not save entry';
      showToast('error', message);
      return null;
    }
  };

  const updateEntry = async (id, { title, content, emotion }) => {
    if (!token) {
      showToast('error', 'You must be logged in to update entries');
      return null;
    }

    try {
      const repository = new ApiJournalRepository(token);
      const useCase = new UpdateJournalEntryUseCase(repository);
      const data = await useCase.execute(id, { title, content, emotion });

      setEntries((current) => current.map((entry) => (entry.id === String(id) ? data : entry)));
      return data;
    } catch (err) {
      const message = err?.message || 'Could not update entry';
      showToast('error', message);
      return null;
    }
  };

  const deleteEntry = async (id) => {
    if (!token) {
      showToast('error', 'You must be logged in to delete entries');
      return false;
    }

    try {
      const repository = new ApiJournalRepository(token);
      const useCase = new DeleteJournalEntryUseCase(repository);
      await useCase.execute(id);

      setEntries((current) => current.filter((entry) => entry.id !== String(id)));
      return true;
    } catch (err) {
      const message = err?.message || 'Could not delete entry';
      showToast('error', message);
      return false;
    }
  };

  const value = useMemo(
    () => ({ entries, addEntry, updateEntry, deleteEntry }),
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
