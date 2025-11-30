import { Platform } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import theme from '../theme';

// --- Interfaces via small concrete classes (SOLID) ---
// InMemoryEntryRepository: simple repository over the in-memory entries array.
export class InMemoryEntryRepository {
  constructor(entries) {
    this._entries = Array.isArray(entries) ? entries : [];
  }

  getAll() {
    return [...this._entries];
  }

  getByIds(ids) {
    if (!Array.isArray(ids) || ids.length === 0) {
      return [];
    }
    const idSet = new Set(ids.map(String));
    return this._entries.filter((entry) => idSet.has(String(entry.id)));
  }
}

// HtmlPdfGenerator: responsible only for turning entries into a PDF file via HTML.
export class HtmlPdfGenerator {
  async generate(entries) {
    const safeEntries = Array.isArray(entries) ? entries : [];
    const html = this._buildHtml(safeEntries);
    const { uri } = await Print.printToFileAsync({ html });
    return { uri };
  }

  _buildHtml(entries) {
    const { colors, typography } = theme;

    const escapeHtml = (value) => {
      if (value === null || value === undefined) return '';
      return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    };

    const entryBlocks = entries
      .map((entry, index) => {
        const title = escapeHtml(entry.title || `Entry ${index + 1}`);
        const dateLabel = escapeHtml(entry.dateLabel || entry.created_at || '');
        const emotion = escapeHtml(entry.emotion || '');
        const content = escapeHtml(entry.content || entry.preview || '');

        return `
          <section class="entry">
            <h2 class="entry-title">${title}</h2>
            <div class="entry-meta">
              ${dateLabel ? `<span class="entry-date">${dateLabel}</span>` : ''}
              ${emotion ? `<span class="entry-emotion">${emotion}</span>` : ''}
            </div>
            <p class="entry-content">${content.replace(/\n/g, '<br />')}</p>
          </section>
        `;
      })
      .join('\n');

    const generatedAt = escapeHtml(new Date().toLocaleString());

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>ÉmoSanté – Journal export</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
                Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
              padding: 24px;
              color: ${colors.text};
              background-color: ${colors.background};
            }
            .page-header {
              text-align: center;
              margin-bottom: 24px;
            }
            .brand-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 999px;
              background-color: ${colors.primary};
              color: ${colors.textOnPrimary};
              font-size: ${typography.sizes.caption}px;
              letter-spacing: 0.5px;
              margin-bottom: 8px;
            }
            h1 {
              font-size: ${typography.sizes.title}px;
              margin: 0 0 4px 0;
            }
            .subtitle {
              font-size: ${typography.sizes.caption}px;
              color: ${colors.textMuted};
              margin: 0;
            }
            .entries-wrapper {
              margin-top: 16px;
            }
            .entry {
              margin-bottom: 16px;
              padding: 16px 18px;
              border-radius: 16px;
              background-color: ${colors.surface};
              border: 1px solid ${colors.borderSoft};
              page-break-inside: avoid;
            }
            .entry-title {
              font-size: ${typography.sizes.subtitle}px;
              margin: 0 0 6px 0;
            }
            .entry-meta {
              font-size: ${typography.sizes.caption}px;
              color: ${colors.textMuted};
              margin-bottom: 8px;
            }
            .entry-meta span + span::before {
              content: ' • ';
              margin: 0 4px;
            }
            .entry-emotion {
              display: inline-block;
              padding: 2px 10px;
              border-radius: 999px;
              background-color: ${colors.primaryLight};
              color: ${colors.text};
            }
            .entry-content {
              font-size: ${typography.sizes.body}px;
              line-height: 1.5;
              white-space: normal;
            }
            .empty {
              font-size: ${typography.sizes.body}px;
              color: ${colors.textMuted};
              text-align: center;
              margin-top: 32px;
            }
          </style>
        </head>
        <body>
          <header class="page-header">
            <div class="brand-badge">ÉmoSanté</div>
            <h1>Journal export</h1>
            <p class="subtitle">Generated on ${generatedAt}</p>
          </header>
          <main class="entries-wrapper">
            ${entryBlocks || '<p class="empty">No entries selected.</p>'}
          </main>
        </body>
      </html>
    `;
  }
}

// ExpoSharingPdfSaver: only responsible for exposing the OS share/save UI.
export class ExpoSharingPdfSaver {
  async save(uri) {
    if (!uri) {
      throw new Error('PDF URI is missing');
    }

    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      // On some platforms (e.g. web), expo-sharing is not available.
      // We let the caller decide how to handle this.
      if (Platform.OS === 'web') {
        throw new Error('Sharing is not available in this environment.');
      }
      throw new Error('Sharing is not available on this device.');
    }

    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Export journal entries',
      UTI: 'com.adobe.pdf',
    });
  }
}

// ExportEntriesUseCase: coordinates repository + generator + saver.
export class ExportEntriesUseCase {
  constructor(entryRepository, pdfGenerator, pdfSaver) {
    this.entryRepository = entryRepository;
    this.pdfGenerator = pdfGenerator;
    this.pdfSaver = pdfSaver;
  }

  async execute(entryIds) {
    const idsArray = Array.isArray(entryIds) ? entryIds : [];

    const entriesToExport =
      idsArray.length > 0
        ? this.entryRepository.getByIds(idsArray)
        : this.entryRepository.getAll();

    if (!entriesToExport || entriesToExport.length === 0) {
      throw new Error('No entries selected to export.');
    }

    const { uri } = await this.pdfGenerator.generate(entriesToExport);
    await this.pdfSaver.save(uri);
    return uri;
  }
}

// Factory to wire concrete implementations together (Dependency Inversion).
export function createExportEntriesUseCase(entries) {
  const repository = new InMemoryEntryRepository(entries);
  const pdfGenerator = new HtmlPdfGenerator();
  const pdfSaver = new ExpoSharingPdfSaver();

  return new ExportEntriesUseCase(repository, pdfGenerator, pdfSaver);
}
