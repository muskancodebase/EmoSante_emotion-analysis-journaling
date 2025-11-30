// Abstract repository defining the contract for working with journal entries.
// This lives in the domain layer and does not know about React or UI.

export class JournalRepository {
  // Load all journal entries for the current user.
  async getAll() {
    throw new Error('getAll() not implemented');
  }

  // Create a new journal entry.
  async add({ title, content, emotion }) {
    throw new Error('add() not implemented');
  }

  // Update an existing journal entry.
  async update(id, { title, content, emotion }) {
    throw new Error('update() not implemented');
  }

  // Delete a journal entry.
  async remove(id) {
    throw new Error('remove() not implemented');
  }
}
