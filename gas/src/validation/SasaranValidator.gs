/**
 * Sasaran validator untuk Apps Script.
 */

function TPK_requireField_(result, raw, field, label) {
  const value = (raw || {})[field];

  if (value === undefined || value === null || String(value).trim() === '') {
    TPK_addValidationError_(result, 'FIELD_REQUIRED', field, (label || field) + ' wajib diisi.', { field: field });
  }

  return result;
}

function TPK_validateSasaran_(raw, options) {
  raw = raw || {};
  options = options || {};

  const anchorDate = options.anchorDate || raw.anchor_date || raw.tanggal_registrasi;
  const result = TPK_createValidationResult_({
    validator: 'SasaranValidator',
    anchorDate: anchorDate,
  });

  TPK_requireField_(result, raw, 'id_tim', 'id_tim');
  TPK_requireField_(result, raw, 'kode_kecamatan', 'kode_kecamatan');
  TPK_requireField_(result, raw, 'jenis_sasaran', 'jenis_sasaran');
  TPK_requireField_(result, raw, 'nama_sasaran', 'nama_sasaran');
  TPK_requireField_(result, raw, 'nik', 'NIK');
  TPK_requireField_(result, raw, 'no_kk', 'Nomor KK');
  TPK_requireField_(result, raw, 'tanggal_lahir', 'tanggal_lahir');

  TPK_validateNik16_(result, raw, 'nik');
  TPK_validateKk16_(result, raw, 'no_kk');

  try {
    TPK_assertNotFutureDate_(raw.tanggal_lahir, anchorDate, 'tanggal_lahir');
  } catch (error) {
    TPK_addDomainError_(result, error, 'tanggal_lahir');
  }

  TPK_validateScope_(result, raw);

  try {
    TPK_assertJenisSasaranValid_(raw.jenis_sasaran);
  } catch (error) {
    TPK_addDomainError_(result, error, 'jenis_sasaran');
  }

  if (result.errors.length > 0) {
    return TPK_finalizeValidationResult_(result, null);
  }

  try {
    const domain = TPK_buildSasaranDomain_(raw, { anchorDate: anchorDate });
    return TPK_finalizeValidationResult_(result, domain);
  } catch (error) {
    TPK_addDomainError_(result, error, 'jenis_sasaran');
    return TPK_finalizeValidationResult_(result, null);
  }
}
