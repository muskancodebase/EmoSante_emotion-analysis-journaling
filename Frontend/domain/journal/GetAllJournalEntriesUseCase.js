// Use-case: load all journal entries for the current user.

export class GetAllJournalEntriesUseCase {
  constructor(journalRepository) {
    this.journalRepository = journalRepository;
  }

  async execute() {
    return this.journalRepository.getAll();
  }
}
