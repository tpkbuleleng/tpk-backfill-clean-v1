/**
 * TPK Backfill Clean v1 — CB-6 Selective Export CSV & Manifest Builder
 * Apps Script file: gas/Code.gs
 * Deploy as Web App: Execute as Me, Anyone with link / authorized sesuai kebutuhan uji.
 */

const CB6_CONFIG = Object.freeze({
  appVersion: 'CB-6.0.0',
  packageVersion: 'TPK_BACKFILL_CLEAN_2026_CB6',
  providerVersion: 'TPK_PROVIDER_2026_CB6',
  endpointBridgeVersion: 'TPK_ENDPOINT_BRIDGE_2026_CB6',
  exportVersion: 'TPK_SELECTIVE_EXPORT_2026_CB6',
  taxonomyVersion: 'TPK_TAXONOMY_2026_7E_R1',
  validationVersion: 'TPK_VALIDATION_2026_CB2',
  hardeningVersion: 'TPK_PROVIDER_HARDENING_2026_CB5',
  backendMode: 'GAS_WEB_APP_ENDPOINT_OPTIONAL',
  realProviderMode: 'GAS_WEB_APP_REAL_SHEET_PROVIDER_HARDENED_EXPORT',
  sheets: {
    sasaran: 'staging_sasaran',
    pendampingan: 'staging_pendampingan',
    audit: 'staging_audit_log',
    meta: 'meta_cb4'
  }
});

const CB6_HEADERS = Object.freeze({
  staging_sasaran: [
    'record_key','kode_kecamatan','id_tim','jenis_sasaran','nik','no_kk','nama_sasaran',
    'tanggal_lahir','tanggal_registrasi','anchor_date','is_baduta_prioritas','kelompok_umur_balita',
    'created_at','source'
  ],
  staging_pendampingan: [
    'record_key','sasaran_record_key','kode_kecamatan','id_tim','jenis_sasaran','nik','tanggal_pendampingan',
    'periode_laporan','status_pendampingan','is_baduta_prioritas_at_pendampingan',
    'kelompok_umur_balita_at_pendampingan','created_at','source'
  ],
  staging_audit_log: ['timestamp','action','ok','record_key','message','payload_json'],
  meta_cb4: ['key','value','updated_at']
});

function doGet(e) {
  return jsonOutput_(handleRequest_('health', {}));
}

function doPost(e) {
  try {
    const body = parseBody_(e);
    return jsonOutput_(handleRequest_(body.action, body.payload || {}));
  } catch (err) {
    return jsonOutput_(error_('REQUEST_PARSE_ERROR', err.message));
  }
}

function handleRequest_(action, payload) {
  try {
    switch (action) {
      case 'health': return base_({ action, status: 'healthy', workbook: SpreadsheetApp.getActive().getName() });
      case 'setupSheets': return setupSheets_();
      case 'clearTestRows': return clearTestRows_();
      case 'writeSampleSasaran': return writeSampleSasaran_();
      case 'writeSamplePendampingan': return writeSamplePendampingan_();
      case 'exportSasaranCsv': return exportCsv_('sasaran', normalizeScope_(payload.scope));
      case 'exportPendampinganCsv': return exportCsv_('pendampingan', normalizeScope_(payload.scope));
      case 'exportManifest': return exportManifest_(normalizeScope_(payload.scope));
      case 'runExportSmokeTest': return runExportSmokeTest_(normalizeScope_(payload.scope));
      case 'snapshotExport': return snapshotExport_(normalizeScope_(payload.scope));
      default: return error_('UNKNOWN_ACTION', 'Action tidak dikenal: ' + action);
    }
  } catch (err) {
    return error_('ACTION_FAILED', err.message, { action });
  }
}

function setupSheets_() {
  const ss = SpreadsheetApp.getActive();
  Object.keys(CB6_HEADERS).forEach(name => ensureSheet_(ss, name, CB6_HEADERS[name]));
  upsertMeta_('app_version', CB6_CONFIG.appVersion);
  upsertMeta_('provider_version', CB6_CONFIG.providerVersion);
  upsertMeta_('export_version', CB6_CONFIG.exportVersion);
  return base_({ action: 'setupSheets', sheets_ready: true, sheets: Object.keys(CB6_HEADERS) });
}

function clearTestRows_() {
  setupSheets_();
  [CB6_CONFIG.sheets.sasaran, CB6_CONFIG.sheets.pendampingan, CB6_CONFIG.sheets.audit].forEach(name => {
    const sh = SpreadsheetApp.getActive().getSheetByName(name);
    const last = sh.getLastRow();
    if (last > 1) sh.getRange(2, 1, last - 1, sh.getLastColumn()).clearContent();
  });
  appendAudit_('clearTestRows', true, '', 'CB-6 test rows cleared', {});
  return base_({ action: 'clearTestRows', cleared: true });
}

function writeSampleSasaran_() {
  setupSheets_();
  const row = {
    record_key: '5108010101999999|TIM_TJK_001',
    kode_kecamatan: 'TJK',
    id_tim: 'TIM_TJK_001',
    jenis_sasaran: 'BALITA',
    nik: '5108010101999999',
    no_kk: '5108010101888888',
    nama_sasaran: 'BALITA SAMPLE CB6',
    tanggal_lahir: '2025-01-10',
    tanggal_registrasi: '2026-06-19',
    anchor_date: '2026-06-19',
    is_baduta_prioritas: true,
    kelompok_umur_balita: 'BADUTA_0_23',
    created_at: new Date().toISOString(),
    source: 'CB6_SAMPLE'
  };
  const inserted = appendUniqueRow_(CB6_CONFIG.sheets.sasaran, 'record_key', row);
  appendAudit_('writeSampleSasaran', inserted, row.record_key, inserted ? 'Inserted' : 'Duplicate ignored', row);
  return base_({ action: 'writeSampleSasaran', inserted, duplicate_guard_ok: !inserted, record_key: row.record_key });
}

function writeSamplePendampingan_() {
  setupSheets_();
  const row = {
    record_key: '5108010101999999|TIM_TJK_001|2026-06|2026-06-19',
    sasaran_record_key: '5108010101999999|TIM_TJK_001',
    kode_kecamatan: 'TJK',
    id_tim: 'TIM_TJK_001',
    jenis_sasaran: 'BALITA',
    nik: '5108010101999999',
    tanggal_pendampingan: '2026-06-19',
    periode_laporan: '2026-06',
    status_pendampingan: 'KUNJUNGAN_RUMAH',
    is_baduta_prioritas_at_pendampingan: true,
    kelompok_umur_balita_at_pendampingan: 'BADUTA_0_23',
    created_at: new Date().toISOString(),
    source: 'CB6_SAMPLE'
  };
  const inserted = appendUniqueRow_(CB6_CONFIG.sheets.pendampingan, 'record_key', row);
  appendAudit_('writeSamplePendampingan', inserted, row.record_key, inserted ? 'Inserted' : 'Duplicate ignored', row);
  return base_({ action: 'writeSamplePendampingan', inserted, duplicate_guard_ok: !inserted, record_key: row.record_key });
}

function exportCsv_(kind, scope) {
  setupSheets_();
  const sheetName = kind === 'sasaran' ? CB6_CONFIG.sheets.sasaran : CB6_CONFIG.sheets.pendampingan;
  const exportBatchId = createExportBatchId_(kind, scope);
  const dataset = readFilteredDataset_(sheetName, scope);
  const csvText = buildCsv_(dataset.headers, dataset.rows);
  const checksum = sha256_(csvText);
  appendAudit_('export' + titleCase_(kind) + 'Csv', true, exportBatchId, 'CSV exported', { scope, selected_row_count: dataset.rows.length, checksum });
  return base_({
    action: kind === 'sasaran' ? 'exportSasaranCsv' : 'exportPendampinganCsv',
    export_batch_id: exportBatchId,
    source_workbook: SpreadsheetApp.getActive().getName(),
    source_sheet: sheetName,
    export_scope: scope.type,
    selected_row_count: dataset.rows.length,
    selected_record_keys: dataset.rows.map(r => String(r.record_key || r.sasaran_record_key || '')).filter(Boolean),
    checksum,
    filename: exportBatchId + '_' + kind + '.csv',
    header: dataset.headers,
    csv_text: csvText
  });
}

function exportManifest_(scope) {
  setupSheets_();
  const batchId = createExportBatchId_('manifest', scope);
  const sasaran = readFilteredDataset_(CB6_CONFIG.sheets.sasaran, scope);
  const pendampingan = readFilteredDataset_(CB6_CONFIG.sheets.pendampingan, scope);
  const sasaranCsv = buildCsv_(sasaran.headers, sasaran.rows);
  const pendampinganCsv = buildCsv_(pendampingan.headers, pendampingan.rows);
  const selectedRecordKeys = [].concat(
    sasaran.rows.map(r => String(r.record_key || '')).filter(Boolean),
    pendampingan.rows.map(r => String(r.record_key || r.sasaran_record_key || '')).filter(Boolean)
  );
  const manifest = {
    export_batch_id: batchId,
    package_version: CB6_CONFIG.packageVersion,
    app_version: CB6_CONFIG.appVersion,
    provider_version: CB6_CONFIG.providerVersion,
    endpoint_bridge_version: CB6_CONFIG.endpointBridgeVersion,
    export_version: CB6_CONFIG.exportVersion,
    taxonomy_version: CB6_CONFIG.taxonomyVersion,
    validation_version: CB6_CONFIG.validationVersion,
    hardening_version: CB6_CONFIG.hardeningVersion,
    source_workbook: SpreadsheetApp.getActive().getName(),
    source_sheets: [CB6_CONFIG.sheets.sasaran, CB6_CONFIG.sheets.pendampingan],
    export_scope: scope.type,
    scope_filter: scope,
    selected_row_count: sasaran.rows.length + pendampingan.rows.length,
    selected_record_keys: selectedRecordKeys,
    generated_at: new Date().toISOString(),
    checksum: sha256_(sasaranCsv + '\n---CB6_MANIFEST_JOIN---\n' + pendampinganCsv),
    files: {
      sasaran: {
        source_sheet: CB6_CONFIG.sheets.sasaran,
        filename: batchId + '_sasaran.csv',
        selected_row_count: sasaran.rows.length,
        header: sasaran.headers,
        checksum: sha256_(sasaranCsv)
      },
      pendampingan: {
        source_sheet: CB6_CONFIG.sheets.pendampingan,
        filename: batchId + '_pendampingan.csv',
        selected_row_count: pendampingan.rows.length,
        header: pendampingan.headers,
        checksum: sha256_(pendampinganCsv)
      }
    }
  };
  appendAudit_('exportManifest', true, batchId, 'Manifest exported', { scope, checksum: manifest.checksum });
  return base_({ action: 'exportManifest', manifest, manifest_json: JSON.stringify(manifest, null, 2), filename: batchId + '_manifest.json' });
}

function runExportSmokeTest_(scope) {
  setupSheets_();
  if (readAllRows_(CB6_CONFIG.sheets.sasaran).rows.length === 0) writeSampleSasaran_();
  if (readAllRows_(CB6_CONFIG.sheets.pendampingan).rows.length === 0) writeSamplePendampingan_();
  const sasaran = exportCsv_('sasaran', scope);
  const pendampingan = exportCsv_('pendampingan', scope);
  const manifest = exportManifest_(scope);
  const checks = {
    sasaran_ok: !!sasaran.ok,
    pendampingan_ok: !!pendampingan.ok,
    manifest_ok: !!manifest.ok,
    manifest_has_export_batch_id: !!manifest.manifest.export_batch_id,
    manifest_has_selected_row_count: Number.isInteger(manifest.manifest.selected_row_count),
    manifest_has_selected_record_keys: Array.isArray(manifest.manifest.selected_record_keys),
    manifest_has_checksum: !!manifest.manifest.checksum,
    csv_header_guard: Array.isArray(sasaran.header) && Array.isArray(pendampingan.header),
    nik_kk_string_guard: csvKeepsSensitiveNumbers_(sasaran.csv_text),
    date_format_guard: csvDateFormatGuard_(sasaran.csv_text + '\n' + pendampingan.csv_text)
  };
  const smokeOk = Object.keys(checks).every(k => checks[k] === true);
  appendAudit_('runExportSmokeTest', smokeOk, manifest.manifest.export_batch_id, smokeOk ? 'PASS' : 'FAIL', checks);
  return base_({ action: 'runExportSmokeTest', smoke_ok: smokeOk, overall: smokeOk ? 'PASS' : 'FAIL', checks });
}

function snapshotExport_(scope) {
  setupSheets_();
  const sasaran = readFilteredDataset_(CB6_CONFIG.sheets.sasaran, scope);
  const pendampingan = readFilteredDataset_(CB6_CONFIG.sheets.pendampingan, scope);
  const audit = readAllRows_(CB6_CONFIG.sheets.audit);
  return base_({
    action: 'snapshotExport',
    source_workbook: SpreadsheetApp.getActive().getName(),
    export_scope: scope.type,
    sasaran_count: sasaran.rows.length,
    pendampingan_count: pendampingan.rows.length,
    audit_count: audit.rows.length,
    sasaran_headers: sasaran.headers,
    pendampingan_headers: pendampingan.headers
  });
}

function readFilteredDataset_(sheetName, scope) {
  const data = readAllRows_(sheetName);
  const rows = data.rows.filter(row => rowMatchesScope_(row, scope));
  return { headers: data.headers, rows };
}

function rowMatchesScope_(row, scope) {
  if (!scope || scope.type === 'ALL') return true;
  if (scope.type === 'KODE_KECAMATAN') return String(row.kode_kecamatan || '') === String(scope.kode_kecamatan || '');
  if (scope.type === 'ID_TIM') return String(row.id_tim || '') === String(scope.id_tim || '');
  if (scope.type === 'RECORD_KEYS') {
    const keys = scope.selected_record_keys || [];
    const rk = String(row.record_key || '');
    const srk = String(row.sasaran_record_key || '');
    return keys.indexOf(rk) >= 0 || keys.indexOf(srk) >= 0;
  }
  return true;
}

function readAllRows_(sheetName) {
  const sh = SpreadsheetApp.getActive().getSheetByName(sheetName);
  if (!sh) return { headers: CB6_HEADERS[sheetName] || [], rows: [] };
  const lastRow = sh.getLastRow();
  const lastCol = sh.getLastColumn();
  if (lastRow < 1 || lastCol < 1) return { headers: CB6_HEADERS[sheetName] || [], rows: [] };
  const display = sh.getRange(1, 1, lastRow, lastCol).getDisplayValues();
  const headers = display[0].map(h => String(h).trim()).filter(Boolean);
  const rows = [];
  for (let r = 1; r < display.length; r++) {
    if (display[r].every(v => String(v).trim() === '')) continue;
    const obj = {};
    headers.forEach((h, i) => obj[h] = normalizeExportValue_(h, display[r][i]));
    rows.push(obj);
  }
  return { headers, rows };
}

function buildCsv_(headers, rows) {
  const stableHeaders = headers && headers.length ? headers : [];
  const lines = [stableHeaders.map(csvEscape_).join(',')];
  rows.forEach(row => lines.push(stableHeaders.map(h => csvEscape_(normalizeExportValue_(h, row[h]))).join(',')));
  return lines.join('\n');
}

function csvEscape_(value) {
  const s = String(value == null ? '' : value);
  return '"' + s.replace(/"/g, '""') + '"';
}

function normalizeExportValue_(header, value) {
  if (value == null) return '';
  let s = String(value).trim();
  const dateHeaders = ['tanggal_lahir','tanggal_registrasi','anchor_date','tanggal_pendampingan'];
  if (dateHeaders.indexOf(header) >= 0) return normalizeDateString_(s);
  const boolHeaders = ['is_baduta_prioritas','is_baduta_prioritas_at_pendampingan'];
  if (boolHeaders.indexOf(header) >= 0) return normalizeBooleanString_(s);
  if (header === 'nik' || header === 'no_kk') return s.replace(/[^0-9]/g, '').padStart(16, '0').slice(-16);
  return s;
}

function normalizeDateString_(s) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const d = new Date(s);
  if (!isNaN(d.getTime())) return Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  return s;
}

function normalizeBooleanString_(s) {
  const v = String(s).toLowerCase();
  if (['true','1','ya','yes','y'].indexOf(v) >= 0) return 'true';
  if (['false','0','tidak','no','n'].indexOf(v) >= 0) return 'false';
  return s;
}

function appendUniqueRow_(sheetName, keyHeader, rowObj) {
  const sh = SpreadsheetApp.getActive().getSheetByName(sheetName);
  const headers = getHeaders_(sh);
  const keyIdx = headers.indexOf(keyHeader);
  if (keyIdx < 0) throw new Error('Key header tidak ditemukan: ' + keyHeader);
  const key = String(rowObj[keyHeader] || '');
  if (key && sh.getLastRow() > 1) {
    const keys = sh.getRange(2, keyIdx + 1, sh.getLastRow() - 1, 1).getDisplayValues().flat().map(String);
    if (keys.indexOf(key) >= 0) return false;
  }
  sh.appendRow(headers.map(h => rowObj[h] == null ? '' : rowObj[h]));
  return true;
}

function ensureSheet_(ss, name, headers) {
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  const lastCol = Math.max(sh.getLastColumn(), headers.length);
  if (sh.getLastRow() === 0 || sh.getRange(1, 1, 1, lastCol).getDisplayValues()[0].every(v => !v)) {
    sh.getRange(1, 1, 1, headers.length).setValues([headers]);
  } else {
    const existing = getHeaders_(sh);
    headers.forEach(h => {
      if (existing.indexOf(h) < 0) sh.getRange(1, sh.getLastColumn() + 1).setValue(h);
    });
  }
  sh.setFrozenRows(1);
  return sh;
}

function getHeaders_(sh) {
  if (!sh || sh.getLastColumn() === 0) return [];
  return sh.getRange(1, 1, 1, sh.getLastColumn()).getDisplayValues()[0].map(h => String(h).trim()).filter(Boolean);
}

function appendAudit_(action, ok, recordKey, message, payload) {
  const sh = SpreadsheetApp.getActive().getSheetByName(CB6_CONFIG.sheets.audit);
  if (!sh) return;
  sh.appendRow([new Date().toISOString(), action, String(!!ok), recordKey || '', message || '', JSON.stringify(payload || {})]);
}

function upsertMeta_(key, value) {
  const sh = SpreadsheetApp.getActive().getSheetByName(CB6_CONFIG.sheets.meta);
  if (!sh) return;
  const data = sh.getDataRange().getDisplayValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === key) {
      sh.getRange(i + 1, 2, 1, 2).setValues([[value, new Date().toISOString()]]);
      return;
    }
  }
  sh.appendRow([key, value, new Date().toISOString()]);
}

function createExportBatchId_(kind, scope) {
  const tz = Session.getScriptTimeZone();
  const stamp = Utilities.formatDate(new Date(), tz, 'yyyyMMdd_HHmmss');
  const suffix = (scope.type === 'KODE_KECAMATAN' && scope.kode_kecamatan) ? scope.kode_kecamatan : (scope.type === 'ID_TIM' && scope.id_tim ? scope.id_tim : scope.type);
  return ['EXP_CB6', String(kind).toUpperCase(), suffix, stamp].join('_').replace(/[^A-Z0-9_\-]/gi, '_');
}

function normalizeScope_(scope) {
  const s = scope || {};
  const type = ['ALL','KODE_KECAMATAN','ID_TIM','RECORD_KEYS'].indexOf(s.type) >= 0 ? s.type : 'ALL';
  return {
    type,
    kode_kecamatan: String(s.kode_kecamatan || '').trim(),
    id_tim: String(s.id_tim || '').trim(),
    selected_record_keys: Array.isArray(s.selected_record_keys) ? s.selected_record_keys.map(String).map(v => v.trim()).filter(Boolean) : []
  };
}

function sha256_(text) {
  const raw = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, text, Utilities.Charset.UTF_8);
  return raw.map(b => (b < 0 ? b + 256 : b).toString(16).padStart(2, '0')).join('');
}

function csvKeepsSensitiveNumbers_(csv) {
  return /5108010101999999/.test(csv) && /5108010101888888/.test(csv);
}

function csvDateFormatGuard_(csv) {
  return /2025-01-10/.test(csv) && /2026-06-19/.test(csv);
}

function titleCase_(s) {
  return String(s).charAt(0).toUpperCase() + String(s).slice(1);
}

function parseBody_(e) {
  if (!e || !e.postData || !e.postData.contents) return {};
  return JSON.parse(e.postData.contents);
}

function jsonOutput_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function base_(extra) {
  return Object.assign({
    ok: true,
    app_version: CB6_CONFIG.appVersion,
    package_version: CB6_CONFIG.packageVersion,
    provider_version: CB6_CONFIG.providerVersion,
    endpoint_bridge_version: CB6_CONFIG.endpointBridgeVersion,
    export_version: CB6_CONFIG.exportVersion,
    taxonomy_version: CB6_CONFIG.taxonomyVersion,
    validation_version: CB6_CONFIG.validationVersion,
    hardening_version: CB6_CONFIG.hardeningVersion,
    backend_mode: CB6_CONFIG.backendMode,
    real_provider_mode: CB6_CONFIG.realProviderMode,
    generated_at: new Date().toISOString()
  }, extra || {});
}

function error_(code, message, extra) {
  return Object.assign(base_({ ok: false, error_code: code, message }), extra || {});
}
