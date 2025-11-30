import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { API_BASE_URL } from '../config';
import { useAuth } from './AuthContext';
import { useFeedback } from './FeedbackContext';

const JournalContext = createContext(null);

export function JournalProvider({ children }) {
  const { token } = useAuth();
  const { showToast } = useFeedback();
  const [entries, setEntries] = useState([]);

  // Load entries when a token becomes available.
  useEffect(() => {
    const fetchEntries = async () => {
      if (!token) {
        setEntries([]);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/journal/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to load entries');
        }

        const data = await res.json();
        setEntries(Array.isArray(data.entries) ? data.entries : []);

      } catch (err) {
        showToast('error', 'Could not load journal entries');
      }
    };

    fetchEntries();
  }, [token, showToast]);

  const addEntry = async ({ title, content, emotion }) => {
    if (!token) {
      showToast('error', 'You must be logged in to add entries');
      return null;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/journal/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, emotion }),
      });

      const data = await res.json();

      if (!res.ok) {
        const message = data.message || 'Could not save entry';
        showToast('error', message);
        return null;
      }

      setEntries((current) => [data, ...current]);
      return data;
    } catch (err) {
      showToast('error', 'Network error while saving entry');
      return null;
    }
  };

  const updateEntry = async (id, { title, content, emotion }) => {
    if (!token) {
      showToast('error', 'You must be logged in to update entries');
      return null;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/journal/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, emotion }),
      });

      const data = await res.json();

      if (!res.ok) {
        const message = data.message || 'Could not update entry';
        showToast('error', message);
        return null;
      }

      setEntries((current) => current.map((entry) => (entry.id === String(id) ? data : entry)));
      return data;
    } catch (err) {
      showToast('error', 'Network error while updating entry');
      return null;
    }
  };

  const deleteEntry = async (id) => {
    if (!token) {
      showToast('error', 'You must be logged in to delete entries');
      return false;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/journal/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        const message = data.message || 'Could not delete entry';
        showToast('error', message);
        return false;
      }

      setEntries((current) => current.filter((entry) => entry.id !== String(id)));
      return true;
    } catch (err) {
      showToast('error', 'Network error while deleting entry');
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
