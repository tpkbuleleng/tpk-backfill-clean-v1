/**
 * Pendampingan validator untuk Apps Script.
 */

function TPK_parentRegistryHas_(parentSasaranKeys, key) {
  parentSasaranKeys = parentSasaranKeys || [];
  return parentSasaranKeys.indexOf(key) >= 0;
}

function TPK_validatePendampingan_(raw, options) {
  raw = raw || {};
  options = options || {};

  const currentDate = options.currentDate;
  const parentSasaranKeys = options.parentSasaranKeys || [];

  const result = TPK_createValidationResult_({
    validator: 'PendampinganValidator',
    currentDate: currentDate,
  });

  TPK_requireField_(result, raw, 'sasaran_unique_key', 'sasaran_unique_key');
  TPK_requireField_(result, raw, 'id_sasaran', 'id_sasaran');
  TPK_requireField_(result, raw, 'id_tim', 'id_tim');
  TPK_requireField_(result, raw, 'kode_kecamatan', 'kode_kecamatan');
  TPK_requireField_(result, raw, 'jenis_sasaran', 'jenis_sasaran');
  TPK_requireField_(result, raw, 'tanggal_lahir', 'tanggal_lahir');
  TPK_requireField_(result, raw, 'tanggal_pendampingan', 'tanggal_pendampingan');
  TPK_requireField_(result, raw, 'status_pendampingan', 'status_pendampingan');

  try {
    TPK_assertNotFutureDate_(raw.tanggal_lahir, currentDate, 'tanggal_lahir');
  } catch (error) {
    TPK_addDomainError_(result, error, 'tanggal_lahir');
  }

  try {
    TPK_assertNotFutureDate_(raw.tanggal_pendampingan, currentDate, 'tanggal_pendampingan');
  } catch (error) {
    TPK_addDomainError_(result, error, 'tanggal_pendampingan');
  }

  TPK_validateScope_(result, raw);

  const key = TPK_normalizeText_(raw.sasaran_unique_key);
  if (!key) {
    TPK_addValidationError_(result, 'PARENT_SASARAN_KEY_REQUIRED', 'sasaran_unique_key', 'sasaran_unique_key wajib diisi untuk pendampingan.', {});
  } else if (!TPK_parentRegistryHas_(parentSasaranKeys, key)) {
    TPK_addValidationError_(result, 'PARENT_SASARAN_NOT_FOUND', 'sasaran_unique_key', 'Parent sasaran tidak ditemukan pada registry validasi.', {
      sasaran_unique_key: key,
    });
  }

  try {
    TPK_assertJenisSasaranValid_(raw.jenis_sasaran);
  } catch (error) {
    TPK_addDomainError_(result, error, 'jenis_sasaran');
  }

  if (result.errors.length > 0) {
    return TPK_finalizeValidationResult_(result, null);
  }

  try {
    const domain = TPK_buildPendampinganDomain_(raw);
    return TPK_finalizeValidationResult_(result, domain);
  } catch (error) {
    TPK_addDomainError_(result, error, 'tanggal_pendampingan');
    return TPK_finalizeValidationResult_(result, null);
  }
}
