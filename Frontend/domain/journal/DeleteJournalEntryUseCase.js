// Use-case: delete an existing journal entry.

export class DeleteJournalEntryUseCase {
  constructor(journalRepository) {
    this.journalRepository = journalRepository;
  }

  async execute(id) {
    return this.journalRepository.remove(id);
  }
}
