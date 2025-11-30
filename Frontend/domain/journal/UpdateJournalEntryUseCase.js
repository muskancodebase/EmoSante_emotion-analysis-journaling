// Use-case: update an existing journal entry.

export class UpdateJournalEntryUseCase {
  constructor(journalRepository) {
    this.journalRepository = journalRepository;
  }

  async execute(id, { title, content, emotion }) {
    return this.journalRepository.update(id, { title, content, emotion });
  }
}
