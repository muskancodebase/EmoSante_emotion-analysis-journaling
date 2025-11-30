import { JournalRepository } from './JournalRepository';
import { API_BASE_URL } from '../../config';

// Concrete repository that knows how to talk to the backend API.
// All HTTP + fetch details live here instead of inside React components or contexts.

export class ApiJournalRepository extends JournalRepository {
  constructor(token) {
    super();
    this.token = token;
  }

  _authHeaders() {
    if (!this.token) {
      throw new Error('Missing auth token');
    }
    return {
      Authorization: `Bearer ${this.token}`,
    };
  }

  _jsonHeaders() {
    return {
      'Content-Type': 'application/json',
      ...this._authHeaders(),
    };
  }

  async getAll() {
    try {
      const res = await fetch(`${API_BASE_URL}/journal/`, {
        headers: this._authHeaders(),
      });

      let data = null;
      try {
        data = await res.json();
      } catch (err) {
        data = null;
      }

      if (!res.ok) {
        const message = (data && data.message) || 'Failed to load entries';
        const error = new Error(message);
        error.isHttpError = true;
        throw error;
      }

      return Array.isArray(data) ? data : [];
    } catch (err) {
      if (err.isHttpError) {
        throw err;
      }
      throw new Error('Network error while loading journal entries');
    }
  }

  async add({ title, content, emotion }) {
    try {
      const res = await fetch(`${API_BASE_URL}/journal/`, {
        method: 'POST',
        headers: this._jsonHeaders(),
        body: JSON.stringify({ title, content, emotion }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch (err) {
        data = null;
      }

      if (!res.ok) {
        const message = (data && data.message) || 'Could not save entry';
        const error = new Error(message);
        error.isHttpError = true;
        throw error;
      }

      return data;
    } catch (err) {
      if (err.isHttpError) {
        throw err;
      }
      throw new Error('Network error while saving entry');
    }
  }

  async update(id, { title, content, emotion }) {
    try {
      const res = await fetch(`${API_BASE_URL}/journal/${id}`, {
        method: 'PUT',
        headers: this._jsonHeaders(),
        body: JSON.stringify({ title, content, emotion }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch (err) {
        data = null;
      }

      if (!res.ok) {
        const message = (data && data.message) || 'Could not update entry';
        const error = new Error(message);
        error.isHttpError = true;
        throw error;
      }

      return data;
    } catch (err) {
      if (err.isHttpError) {
        throw err;
      }
      throw new Error('Network error while updating entry');
    }
  }

  async remove(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/journal/${id}`, {
        method: 'DELETE',
        headers: this._authHeaders(),
      });

      let data = null;
      try {
        data = await res.json();
      } catch (err) {
        data = null;
      }

      if (!res.ok) {
        const message = (data && data.message) || 'Could not delete entry';
        const error = new Error(message);
        error.isHttpError = true;
        throw error;
      }

      // We return true on success so callers can distinguish success/failure.
      return true;
    } catch (err) {
      if (err.isHttpError) {
        throw err;
      }
      throw new Error('Network error while deleting entry');
    }
  }
}
