// Use-case: search journal entries using a query string and a filter mode.
// This is a pure function-like class with no knowledge of React or network.

export class SearchJournalEntriesUseCase {
  execute(entries, { query, filter }) {
    const list = Array.isArray(entries) ? entries : [];
    const trimmed = (query || '').trim().toLowerCase();

    if (!trimmed) return list;

    switch (filter) {
      case 'Emotion': {
        return list.filter((entry) => {
          const emotion = (entry.emotion || '').toLowerCase();
          return emotion.includes(trimmed);
        });
      }
      case 'Date': {
        return list.filter((entry) => {
          const date = (entry.dateLabel || entry.created_at || '').toLowerCase();
          return date.includes(trimmed);
        });
      }
      case 'Keywords':
      default: {
        return list.filter((entry) => {
          const title = entry.title || '';
          const preview = entry.preview || '';
          const emotion = entry.emotion || '';
          const date = entry.dateLabel || entry.created_at || '';
          const haystack = `${title} ${preview} ${emotion} ${date}`.toLowerCase();
          return haystack.includes(trimmed);
        });
      }
    }
  }
}
