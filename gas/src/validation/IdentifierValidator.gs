/**
 * Identifier validator untuk Apps Script.
 */

function TPK_isSixteenDigits_(value) {
  return /^\d{16}$/.test(String(value || '').trim());
}

function TPK_validateNik16_(result, raw, field) {
  field = field || 'nik';
  const value = String((raw || {})[field] || '').trim();

  if (!value) {
    return TPK_addValidationError_(result, 'NIK_REQUIRED', field, 'NIK wajib diisi.', { field: field });
  }

  if (!TPK_isSixteenDigits_(value)) {
    return TPK_addValidationError_(result, 'NIK_16_DIGIT_REQUIRED', field, 'NIK wajib 16 digit angka.', {
      field: field,
      valueLength: value.length,
    });
  }

  return result;
}

function TPK_validateKk16_(result, raw, field) {
  field = field || 'no_kk';
  const value = String((raw || {})[field] || '').trim();

  if (!value) {
    return TPK_addValidationError_(result, 'KK_REQUIRED', field, 'Nomor KK wajib diisi.', { field: field });
  }

  if (!TPK_isSixteenDigits_(value)) {
    return TPK_addValidationError_(result, 'KK_16_DIGIT_REQUIRED', field, 'Nomor KK wajib 16 digit angka.', {
      field: field,
      valueLength: value.length,
    });
  }

  return result;
}
