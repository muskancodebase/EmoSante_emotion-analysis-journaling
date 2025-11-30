// Use-case: add a new journal entry.

export class AddJournalEntryUseCase {
  constructor(journalRepository) {
    this.journalRepository = journalRepository;
  }

  async execute({ title, content, emotion }) {
    return this.journalRepository.add({ title, content, emotion });
  }
}
