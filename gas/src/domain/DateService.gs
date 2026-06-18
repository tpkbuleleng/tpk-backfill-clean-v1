/**
 * Date service untuk Apps Script.
 */

function TPK_normalizeIsoDate_(value) {
  return String(value || '').trim();
}

function TPK_parseIsoLocalDate_(value, fieldName) {
  const normalized = TPK_normalizeIsoDate_(value);
  const pattern = /^\d{4}-\d{2}-\d{2}$/;

  if (!pattern.test(normalized)) {
    throw TPK_DomainError_('DATE_FORMAT_INVALID', (fieldName || 'date') + ' wajib memakai format YYYY-MM-DD.', {
      fieldName: fieldName || 'date',
      value: value,
    });
  }

  const parts = normalized.split('-').map(Number);
  const date = new Date(parts[0], parts[1] - 1, parts[2]);

  if (
    date.getFullYear() !== parts[0] ||
    date.getMonth() !== parts[1] - 1 ||
    date.getDate() !== parts[2]
  ) {
    throw TPK_DomainError_('DATE_VALUE_INVALID', (fieldName || 'date') + ' bukan tanggal kalender yang valid.', {
      fieldName: fieldName || 'date',
      value: value,
    });
  }

  return date;
}
