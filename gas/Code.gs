/**
 * TPK Backfill Clean v1
 * Paket CB-4 — GAS Web App Endpoint & Real Sheet Provider
 *
 * Cara pakai:
 * 1. Buat Google Sheet baru.
 * 2. Extensions → Apps Script.
 * 3. Tempel file ini sebagai Code.gs.
 * 4. Deploy → New deployment → Web app.
 * 5. Execute as: Me.
 * 6. Who has access: Anyone with the link.
 * 7. Copy Web App URL ke halaman GitHub Pages CB-4.
 */

const TPK_CB4_CONFIG = Object.freeze({
  appName: 'TPK Backfill Clean v1',
  appVersion: 'CB-4.0.0',
  buildPackage: 'CB-4 — GAS Web App Endpoint & Real Sheet Provider',
  taxonomyVersion: 'TPK_TAXONOMY_2026_7E_R1',
  domainVersion: 'TPK_DOMAIN_2026_CB1',
  validationVersion: 'TPK_VALIDATION_2026_CB2',
  providerVersion: 'TPK_PROVIDER_2026_CB4',
  backendMode: 'GAS_WEB_APP_REAL_SHEET_PROVIDER',

  // Kosongkan jika script dibuat dari Extensions → Apps Script pada Google Sheet target.
  // Isi dengan ID Spreadsheet jika memakai standalone Apps Script.
  spreadsheetId: '',

  officialJenisSasaran: ['CATIN', 'BUMIL', 'BUFAS', 'BALITA'],
  officialKecamatanCodes: ['GRK', 'SRT', 'BSB', 'BJR', 'BLL', 'SKS', 'SWN', 'KBT', 'TJK'],
  validTimByKecamatan: {
    TJK: ['TIM_TJK_001'],
    GRK: [],
    SRT: [],
    BSB: [],
    BJR: [],
    BLL: [],
    SKS: [],
    SWN: [],
    KBT: [],
  },

  sheets: {
    sasaran: 'staging_sasaran',
    pendampingan: 'staging_pendampingan',
    audit: 'staging_audit_log',
    meta: 'meta_cb4',
  },
});

const TPK_CB4_HEADERS = Object.freeze({
  staging_sasaran: [
    'staging_row_id',
    'domain_version',
    'record_type',
    'sasaran_unique_key',
    'id_sasaran',
    'id_tim',
    'kode_kecamatan',
    'scope_key',
    'jenis_sasaran',
    'nama_sasaran',
    'nik',
    'no_kk',
    'tanggal_lahir',
    'anchor_date',
    'age_months_at_anchor',
    'kelompok_umur_balita',
    'is_baduta_prioritas',
    'source',
    'created_at',
  ],
  staging_pendampingan: [
    'staging_row_id',
    'domain_version',
    'record_type',
    'pendampingan_unique_key',
    'sasaran_unique_key',
    'id_sasaran',
    'id_tim',
    'kode_kecamatan',
    'scope_key',
    'tanggal_pendampingan',
    'jenis_sasaran',
    'age_months_at_pendampingan',
    'kelompok_umur_balita_at_pendampingan',
    'is_baduta_prioritas_at_pendampingan',
    'status_pendampingan',
    'source',
    'created_at',
  ],
  staging_audit_log: [
    'audit_id',
    'action',
    'key',
    'parent_key',
    'ok',
    'error_code',
    'timestamp',
    'payload_json',
  ],
  meta_cb4: [
    'key',
    'value',
    'updated_at',
  ],
});

function doGet(e) {
  return handleEndpoint_(e || {}, 'GET');
}

function doPost(e) {
  return handleEndpoint_(e || {}, 'POST');
}

function handleEndpoint_(e, method) {
  const params = e.parameter || {};
  const callback = params.callback || '';
  const action = params.action || 'health';

  let result;
  try {
    if (method === 'POST') {
      result = dispatchPost_(e, action, params);
    } else {
      result = dispatchGet_(action, params);
    }
  } catch (error) {
    result = makeError_('ENDPOINT_ERROR', error.message || String(error), {
      action,
      method,
      stack: error.stack || '',
    });
  }

  result.endpoint_method = method;
  result.endpoint_action = action;

  if (callback) {
    return ContentService
      .createTextOutput(callback + '(' + JSON.stringify(result) + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(JSON.stringify(result, null, 2))
    .setMimeType(ContentService.MimeType.JSON);
}

function dispatchGet_(action, params) {
  switch (action) {
    case 'health':
      return getHealth_();
    case 'setupSheets':
      return setupSheets_();
    case 'writeSampleSasaran':
      setupSheets_();
      return writeSasaran_(getSampleSasaran_(), { anchorDate: '2026-06-18' });
    case 'writeSamplePendampingan':
      setupSheets_();
      return writePendampingan_(getSamplePendampingan_(), { currentDate: '2026-06-18' });
    case 'snapshot':
      setupSheets_();
      return getSnapshot_();
    case 'clearTestRows':
      return clearTestRows_();
    default:
      return makeError_('ACTION_NOT_FOUND', 'Action tidak dikenal: ' + action, { action });
  }
}

function dispatchPost_(e, action, params) {
  let body = {};
  if (e.postData && e.postData.contents) {
    body = JSON.parse(e.postData.contents);
  }

  switch (action || body.action) {
    case 'writeSasaran':
      setupSheets_();
      return writeSasaran_(body.raw || {}, body.options || {});
    case 'writePendampingan':
      setupSheets_();
      return writePendampingan_(body.raw || {}, body.options || {});
    default:
      return dispatchGet_(action, params);
  }
}

function getHealth_() {
  const ss = getSpreadsheet_();
  return {
    ok: true,
    app_name: TPK_CB4_CONFIG.appName,
    app_version: TPK_CB4_CONFIG.appVersion,
    build_package: TPK_CB4_CONFIG.buildPackage,
    backend_mode: TPK_CB4_CONFIG.backendMode,
    taxonomy_version: TPK_CB4_CONFIG.taxonomyVersion,
    domain_version: TPK_CB4_CONFIG.domainVersion,
    validation_version: TPK_CB4_CONFIG.validationVersion,
    provider_version: TPK_CB4_CONFIG.providerVersion,
    spreadsheet_id: ss.getId(),
    spreadsheet_name: ss.getName(),
    sheets_found: Object.keys(TPK_CB4_CONFIG.sheets).reduce(function(acc, key) {
      const name = TPK_CB4_CONFIG.sheets[key];
      acc[name] = !!ss.getSheetByName(name);
      return acc;
    }, {}),
  };
}

function setupSheets_() {
  const ss = getSpreadsheet_();
  Object.keys(TPK_CB4_CONFIG.sheets).forEach(function(key) {
    const name = TPK_CB4_CONFIG.sheets[key];
    const sheet = getOrCreateSheet_(ss, name);
    setHeaders_(sheet, TPK_CB4_HEADERS[name]);
  });

  upsertMeta_('app_version', TPK_CB4_CONFIG.appVersion);
  upsertMeta_('provider_version', TPK_CB4_CONFIG.providerVersion);
  upsertMeta_('taxonomy_version', TPK_CB4_CONFIG.taxonomyVersion);
  upsertMeta_('validation_version', TPK_CB4_CONFIG.validationVersion);

  return {
    ok: true,
    action: 'setupSheets',
    provider_version: TPK_CB4_CONFIG.providerVersion,
    sheets: TPK_CB4_CONFIG.sheets,
  };
}

function writeSasaran_(raw, options) {
  options = options || {};
  const anchorDate = options.anchorDate || raw.anchor_date || raw.tanggal_registrasi || toIsoDate_(new Date());
  const validation = validateSasaran_(raw, anchorDate);

  if (!validation.ok) {
    appendAudit_('WRITE_SASARAN_VALIDATION_FAILED', '', '', false, firstErrorCode_(validation), validation);
    return { ok: false, stage: 'VALIDATION', validation, provider: null };
  }

  const domain = validation.domain;
  const sheet = getSheet_(TPK_CB4_CONFIG.sheets.sasaran);
  const key = domain.sasaran_unique_key;

  if (findRowByKey_(sheet, 'sasaran_unique_key', key) > 0) {
    const error = makeError_('DUPLICATE_SASARAN_UNIQUE_KEY', 'sasaran_unique_key sudah ada di staging.', { sasaran_unique_key: key });
    appendAudit_('WRITE_SASARAN_DUPLICATE', key, '', false, error.error.code, error);
    return { ok: false, stage: 'PROVIDER_ERROR', validation, provider: error };
  }

  const row = Object.assign({
    staging_row_id: 'STG_SAS_' + pad4_(Math.max(sheet.getLastRow(), 1)),
    created_at: new Date().toISOString(),
  }, domain);

  appendObjectRow_(sheet, TPK_CB4_HEADERS.staging_sasaran, row);
  appendAudit_('WRITE_SASARAN', key, '', true, '', row);

  return {
    ok: true,
    stage: 'PROVIDER_WRITE',
    action: 'WRITE_SASARAN',
    validation,
    provider: makeProviderResult_('WRITE_SASARAN', TPK_CB4_CONFIG.sheets.sasaran, key, row),
  };
}

function writePendampingan_(raw, options) {
  options = options || {};
  const currentDate = options.currentDate || toIsoDate_(new Date());
  const parentKeys = getParentSasaranKeys_();
  const validation = validatePendampingan_(raw, currentDate, parentKeys);

  if (!validation.ok) {
    appendAudit_('WRITE_PENDAMPINGAN_VALIDATION_FAILED', raw.pendampingan_unique_key || '', raw.sasaran_unique_key || '', false, firstErrorCode_(validation), validation);
    return { ok: false, stage: 'VALIDATION', validation, provider: null };
  }

  const domain = validation.domain;
  const sheet = getSheet_(TPK_CB4_CONFIG.sheets.pendampingan);
  const key = domain.pendampingan_unique_key;

  if (findRowByKey_(sheet, 'pendampingan_unique_key', key) > 0) {
    const error = makeError_('DUPLICATE_PENDAMPINGAN_UNIQUE_KEY', 'pendampingan_unique_key sudah ada di staging.', { pendampingan_unique_key: key });
    appendAudit_('WRITE_PENDAMPINGAN_DUPLICATE', key, domain.sasaran_unique_key, false, error.error.code, error);
    return { ok: false, stage: 'PROVIDER_ERROR', validation, provider: error };
  }

  const row = Object.assign({
    staging_row_id: 'STG_PEN_' + pad4_(Math.max(sheet.getLastRow(), 1)),
    created_at: new Date().toISOString(),
  }, domain);

  appendObjectRow_(sheet, TPK_CB4_HEADERS.staging_pendampingan, row);
  appendAudit_('WRITE_PENDAMPINGAN', key, domain.sasaran_unique_key, true, '', row);

  return {
    ok: true,
    stage: 'PROVIDER_WRITE',
    action: 'WRITE_PENDAMPINGAN',
    validation,
    provider: makeProviderResult_('WRITE_PENDAMPINGAN', TPK_CB4_CONFIG.sheets.pendampingan, key, row),
  };
}

function validateSasaran_(raw, anchorDate) {
  const result = newValidationResult_('SasaranValidator', { anchorDate });
  requireField_(result, raw, 'id_tim');
  requireField_(result, raw, 'kode_kecamatan');
  requireField_(result, raw, 'jenis_sasaran');
  requireField_(result, raw, 'nama_sasaran');
  requireField_(result, raw, 'nik');
  requireField_(result, raw, 'no_kk');
  requireField_(result, raw, 'tanggal_lahir');

  validateNik_(result, raw.nik);
  validateKk_(result, raw.no_kk);
  validateNotFuture_(result, raw.tanggal_lahir, anchorDate, 'tanggal_lahir');
  validateScope_(result, raw);
  validateJenis_(result, raw.jenis_sasaran);

  if (result.errors.length) return finalizeValidation_(result, null);

  try {
    const domain = buildSasaranDomain_(raw, anchorDate);
    return finalizeValidation_(result, domain);
  } catch (error) {
    addError_(result, error.code || 'DOMAIN_ERROR', 'domain', error.message, error.details || {});
    return finalizeValidation_(result, null);
  }
}

function validatePendampingan_(raw, currentDate, parentKeys) {
  const result = newValidationResult_('PendampinganValidator', { currentDate });
  requireField_(result, raw, 'sasaran_unique_key');
  requireField_(result, raw, 'id_sasaran');
  requireField_(result, raw, 'id_tim');
  requireField_(result, raw, 'kode_kecamatan');
  requireField_(result, raw, 'jenis_sasaran');
  requireField_(result, raw, 'tanggal_lahir');
  requireField_(result, raw, 'tanggal_pendampingan');
  requireField_(result, raw, 'status_pendampingan');

  validateNotFuture_(result, raw.tanggal_lahir, currentDate, 'tanggal_lahir');
  validateNotFuture_(result, raw.tanggal_pendampingan, currentDate, 'tanggal_pendampingan');
  validateScope_(result, raw);
  validateJenis_(result, raw.jenis_sasaran);

  const parentKey = normalizeText_(raw.sasaran_unique_key);
  if (parentKey && parentKeys.indexOf(parentKey) < 0) {
    addError_(result, 'PARENT_SASARAN_NOT_FOUND', 'sasaran_unique_key', 'Parent sasaran tidak ditemukan pada staging_sasaran.', { sasaran_unique_key: parentKey });
  }

  if (result.errors.length) return finalizeValidation_(result, null);

  try {
    const domain = buildPendampinganDomain_(raw);
    return finalizeValidation_(result, domain);
  } catch (error) {
    addError_(result, error.code || 'DOMAIN_ERROR', 'domain', error.message, error.details || {});
    return finalizeValidation_(result, null);
  }
}

function buildSasaranDomain_(raw, anchorDate) {
  const jenis = assertJenis_(raw.jenis_sasaran);
  const scopeKey = normalizeUpper_(raw.kode_kecamatan) + '|' + normalizeUpper_(raw.id_tim);
  let ageMonths = null;
  let kelompok = '';
  let isBaduta = false;

  if (jenis === 'BALITA') {
    ageMonths = calculateAgeInMonths_(raw.tanggal_lahir, anchorDate);
    assertBalitaAge_(ageMonths);
    kelompok = ageMonths <= 23 ? 'BADUTA_0_23' : 'BALITA_24_59';
    isBaduta = ageMonths <= 23;
  }

  return {
    domain_version: TPK_CB4_CONFIG.domainVersion,
    record_type: 'SASARAN',
    sasaran_unique_key: normalizeText_(raw.nik) + '|' + normalizeUpper_(raw.id_tim),
    id_sasaran: normalizeText_(raw.id_sasaran),
    id_tim: normalizeUpper_(raw.id_tim),
    kode_kecamatan: normalizeUpper_(raw.kode_kecamatan),
    scope_key: scopeKey,
    jenis_sasaran: jenis,
    nama_sasaran: normalizeText_(raw.nama_sasaran),
    nik: normalizeText_(raw.nik),
    no_kk: normalizeText_(raw.no_kk),
    tanggal_lahir: normalizeText_(raw.tanggal_lahir),
    anchor_date: anchorDate,
    age_months_at_anchor: ageMonths,
    kelompok_umur_balita: kelompok,
    is_baduta_prioritas: isBaduta,
    source: normalizeText_(raw.source || 'GAS_CB4'),
  };
}

function buildPendampinganDomain_(raw) {
  const jenis = assertJenis_(raw.jenis_sasaran);
  const tanggal = normalizeText_(raw.tanggal_pendampingan);
  const scopeKey = normalizeUpper_(raw.kode_kecamatan) + '|' + normalizeUpper_(raw.id_tim);
  let ageMonths = null;
  let kelompok = '';
  let isBaduta = false;

  if (jenis === 'BALITA') {
    ageMonths = calculateAgeInMonths_(raw.tanggal_lahir, tanggal);
    assertBalitaAge_(ageMonths);
    kelompok = ageMonths <= 23 ? 'BADUTA_0_23' : 'BALITA_24_59';
    isBaduta = ageMonths <= 23;
  }

  const parentKey = normalizeText_(raw.sasaran_unique_key);

  return {
    domain_version: TPK_CB4_CONFIG.domainVersion,
    record_type: 'PENDAMPINGAN',
    pendampingan_unique_key: parentKey + '|' + tanggal,
    sasaran_unique_key: parentKey,
    id_sasaran: normalizeText_(raw.id_sasaran),
    id_tim: normalizeUpper_(raw.id_tim),
    kode_kecamatan: normalizeUpper_(raw.kode_kecamatan),
    scope_key: scopeKey,
    tanggal_pendampingan: tanggal,
    jenis_sasaran: jenis,
    age_months_at_pendampingan: ageMonths,
    kelompok_umur_balita_at_pendampingan: kelompok,
    is_baduta_prioritas_at_pendampingan: isBaduta,
    status_pendampingan: normalizeText_(raw.status_pendampingan),
    source: normalizeText_(raw.source || 'GAS_CB4'),
  };
}

function getSnapshot_() {
  const sasaranSheet = getSheet_(TPK_CB4_CONFIG.sheets.sasaran);
  const pendampinganSheet = getSheet_(TPK_CB4_CONFIG.sheets.pendampingan);
  const auditSheet = getSheet_(TPK_CB4_CONFIG.sheets.audit);

  return {
    ok: true,
    provider_version: TPK_CB4_CONFIG.providerVersion,
    sasaran_count: Math.max(0, sasaranSheet.getLastRow() - 1),
    pendampingan_count: Math.max(0, pendampinganSheet.getLastRow() - 1),
    audit_count: Math.max(0, auditSheet.getLastRow() - 1),
    sasaran_preview: readObjects_(sasaranSheet).slice(-5),
    pendampingan_preview: readObjects_(pendampinganSheet).slice(-5),
    audit_preview: readObjects_(auditSheet).slice(-10),
  };
}

function clearTestRows_() {
  Object.keys(TPK_CB4_CONFIG.sheets).forEach(function(key) {
    const name = TPK_CB4_CONFIG.sheets[key];
    const sheet = getSheet_(name);
    const headers = TPK_CB4_HEADERS[name];
    sheet.clearContents();
    setHeaders_(sheet, headers);
  });
  return { ok: true, action: 'clearTestRows' };
}

function getSampleSasaran_() {
  return {
    id_sasaran: 'SAS_TJK_0001',
    id_tim: 'TIM_TJK_001',
    kode_kecamatan: 'TJK',
    jenis_sasaran: 'balita',
    nama_sasaran: 'CONTOH BALITA 23 BULAN',
    nik: '5108010101999999',
    no_kk: '5108010101888888',
    tanggal_lahir: '2024-07-18',
    tanggal_registrasi: '2026-06-18',
    source: 'GAS_SAMPLE_CB4',
  };
}

function getSamplePendampingan_() {
  return {
    sasaran_unique_key: '5108010101999999|TIM_TJK_001',
    id_sasaran: 'SAS_TJK_0001',
    id_tim: 'TIM_TJK_001',
    kode_kecamatan: 'TJK',
    jenis_sasaran: 'BALITA',
    tanggal_lahir: '2024-06-18',
    tanggal_pendampingan: '2026-06-18',
    status_pendampingan: 'KUNJUNGAN_RUMAH',
    source: 'GAS_SAMPLE_CB4',
  };
}

function getSpreadsheet_() {
  if (TPK_CB4_CONFIG.spreadsheetId) {
    return SpreadsheetApp.openById(TPK_CB4_CONFIG.spreadsheetId);
  }
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error('Spreadsheet tidak ditemukan. Gunakan bound script atau isi spreadsheetId pada config.');
  }
  return ss;
}

function getOrCreateSheet_(ss, name) {
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function getSheet_(name) {
  const sheet = getSpreadsheet_().getSheetByName(name);
  if (!sheet) throw new Error('Sheet belum ada: ' + name + '. Jalankan setupSheets dulu.');
  return sheet;
}

function setHeaders_(sheet, headers) {
  const existing = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const needsHeader = existing.join('') === '' || existing.join('|') !== headers.join('|');
  if (needsHeader) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }
}

function appendObjectRow_(sheet, headers, object) {
  const row = headers.map(function(header) {
    const value = object[header];
    if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
    if (value === undefined || value === null) return '';
    return value;
  });
  sheet.appendRow(row);
}

function readObjects_(sheet) {
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0].map(String);
  return values.slice(1).filter(function(row) {
    return row.join('') !== '';
  }).map(function(row) {
    const obj = {};
    headers.forEach(function(header, i) {
      obj[header] = row[i];
    });
    return obj;
  });
}

function findRowByKey_(sheet, keyField, keyValue) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);
  const index = headers.indexOf(keyField);
  if (index < 0) throw new Error('Header key tidak ditemukan: ' + keyField);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;
  const values = sheet.getRange(2, index + 1, lastRow - 1, 1).getValues();
  for (let i = 0; i < values.length; i++) {
    if (String(values[i][0]) === String(keyValue)) return i + 2;
  }
  return -1;
}

function getParentSasaranKeys_() {
  const sheet = getSheet_(TPK_CB4_CONFIG.sheets.sasaran);
  const objects = readObjects_(sheet);
  return objects.map(function(row) { return String(row.sasaran_unique_key || ''); }).filter(Boolean);
}

function appendAudit_(action, key, parentKey, ok, errorCode, payload) {
  const sheet = getSheet_(TPK_CB4_CONFIG.sheets.audit);
  const row = {
    audit_id: 'AUDIT_' + pad4_(Math.max(sheet.getLastRow(), 1)),
    action,
    key: key || '',
    parent_key: parentKey || '',
    ok: ok ? 'TRUE' : 'FALSE',
    error_code: errorCode || '',
    timestamp: new Date().toISOString(),
    payload_json: JSON.stringify(payload || {}),
  };
  appendObjectRow_(sheet, TPK_CB4_HEADERS.staging_audit_log, row);
}

function upsertMeta_(key, value) {
  const sheet = getSheet_(TPK_CB4_CONFIG.sheets.meta);
  const row = findRowByKey_(sheet, 'key', key);
  const values = [key, value, new Date().toISOString()];
  if (row > 0) {
    sheet.getRange(row, 1, 1, values.length).setValues([values]);
  } else {
    sheet.appendRow(values);
  }
}

function newValidationResult_(validator, context) {
  return {
    ok: true,
    validation_version: TPK_CB4_CONFIG.validationVersion,
    context: Object.assign({ validator }, context || {}),
    error_count: 0,
    warning_count: 0,
    errors: [],
    warnings: [],
    domain: null,
  };
}

function addError_(result, code, field, message, details) {
  result.ok = false;
  result.errors.push({ code, field, message, details: details || {} });
  result.error_count = result.errors.length;
}

function finalizeValidation_(result, domain) {
  result.ok = result.errors.length === 0;
  result.error_count = result.errors.length;
  result.warning_count = result.warnings.length;
  result.domain = result.ok ? domain : null;
  return result;
}

function requireField_(result, raw, field) {
  if (raw[field] === undefined || raw[field] === null || String(raw[field]).trim() === '') {
    addError_(result, 'FIELD_REQUIRED', field, field + ' wajib diisi.', { field });
  }
}

function validateNik_(result, value) {
  if (!/^\d{16}$/.test(normalizeText_(value))) {
    addError_(result, 'NIK_16_DIGIT_REQUIRED', 'nik', 'NIK wajib 16 digit angka.', { valueLength: normalizeText_(value).length });
  }
}

function validateKk_(result, value) {
  if (!/^\d{16}$/.test(normalizeText_(value))) {
    addError_(result, 'KK_16_DIGIT_REQUIRED', 'no_kk', 'Nomor KK wajib 16 digit angka.', { valueLength: normalizeText_(value).length });
  }
}

function validateNotFuture_(result, value, anchorDate, field) {
  try {
    const date = parseIsoDate_(value);
    const anchor = parseIsoDate_(anchorDate);
    if (date > anchor) {
      addError_(result, 'DATE_IN_FUTURE', field, field + ' tidak boleh lebih baru dari anchor date.', { value, anchorIsoDate: anchorDate });
    }
  } catch (error) {
    addError_(result, error.code || 'DATE_FORMAT_INVALID', field, error.message, { value });
  }
}

function validateScope_(result, raw) {
  const kec = normalizeUpper_(raw.kode_kecamatan);
  const tim = normalizeUpper_(raw.id_tim);
  if (TPK_CB4_CONFIG.officialKecamatanCodes.indexOf(kec) < 0) {
    addError_(result, 'KODE_KECAMATAN_INVALID', 'kode_kecamatan', 'kode_kecamatan tidak terdaftar.', { kode_kecamatan: kec });
    return;
  }
  const registered = TPK_CB4_CONFIG.validTimByKecamatan[kec] || [];
  if (registered.indexOf(tim) < 0) {
    addError_(result, 'SCOPE_TIM_NOT_REGISTERED', 'id_tim', 'id_tim tidak terdaftar pada kode_kecamatan tersebut.', { kode_kecamatan: kec, id_tim: tim });
  }
}

function validateJenis_(result, value) {
  try { assertJenis_(value); }
  catch (error) { addError_(result, error.code || 'JENIS_SASARAN_INVALID', 'jenis_sasaran', error.message, error.details || {}); }
}

function assertJenis_(value) {
  const jenis = normalizeUpper_(value);
  if (!jenis) throw makeDomainError_('JENIS_SASARAN_REQUIRED', 'jenis_sasaran wajib diisi.', { value });
  if (jenis === 'BADUTA') throw makeDomainError_('BADUTA_LEGACY_NOT_ALLOWED', 'BADUTA tidak boleh menjadi jenis_sasaran.', { value });
  if (TPK_CB4_CONFIG.officialJenisSasaran.indexOf(jenis) < 0) {
    throw makeDomainError_('JENIS_SASARAN_INVALID', 'jenis_sasaran tidak valid: ' + value, { value });
  }
  return jenis;
}

function assertBalitaAge_(ageMonths) {
  if (ageMonths < 0 || ageMonths > 59) {
    throw makeDomainError_('BALITA_AGE_OUT_OF_RANGE', 'Umur BALITA harus 0–59 bulan.', { ageMonths });
  }
}

function calculateAgeInMonths_(dateOfBirthIso, anchorDateIso) {
  const dob = parseIsoDate_(dateOfBirthIso);
  const anchor = parseIsoDate_(anchorDateIso);
  if (dob > anchor) throw makeDomainError_('DATE_OF_BIRTH_AFTER_ANCHOR', 'Tanggal lahir tidak boleh lebih baru dari anchor date.', { dateOfBirthIso, anchorDateIso });
  let months = (anchor.getFullYear() - dob.getFullYear()) * 12;
  months += anchor.getMonth() - dob.getMonth();
  if (anchor.getDate() < dob.getDate()) months -= 1;
  return months;
}

function parseIsoDate_(value) {
  const text = normalizeText_(value);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    const err = new Error('Tanggal wajib format YYYY-MM-DD.');
    err.code = 'DATE_FORMAT_INVALID';
    throw err;
  }
  const parts = text.split('-').map(Number);
  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  if (date.getFullYear() !== parts[0] || date.getMonth() !== parts[1] - 1 || date.getDate() !== parts[2]) {
    const err = new Error('Tanggal kalender tidak valid.');
    err.code = 'DATE_VALUE_INVALID';
    throw err;
  }
  return date;
}

function makeProviderResult_(action, table, key, row) {
  return {
    ok: true,
    provider_version: TPK_CB4_CONFIG.providerVersion,
    provider_mode: TPK_CB4_CONFIG.backendMode,
    action,
    table,
    key,
    row,
    error: null,
  };
}

function makeError_(code, message, details) {
  return {
    ok: false,
    provider_version: TPK_CB4_CONFIG.providerVersion,
    provider_mode: TPK_CB4_CONFIG.backendMode,
    error: { code, message, details: details || {} },
  };
}

function makeDomainError_(code, message, details) {
  const err = new Error(message);
  err.code = code;
  err.details = details || {};
  return err;
}

function firstErrorCode_(validation) {
  return validation && validation.errors && validation.errors[0] ? validation.errors[0].code : '';
}

function normalizeText_(value) {
  return String(value || '').trim();
}

function normalizeUpper_(value) {
  return normalizeText_(value).toUpperCase();
}

function pad4_(value) {
  return String(value).padStart(4, '0');
}

function toIsoDate_(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}
