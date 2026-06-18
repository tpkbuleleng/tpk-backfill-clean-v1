/**
 * Placeholder Sheet Provider GAS untuk CB-3.
 * Implementasi penuh akan dihubungkan pada paket backend berikutnya.
 */

function TPK_getSheetProviderHealth() {
  return {
    ok: true,
    provider_version: TPK_APP_CONFIG.providerVersion,
    provider_mode: TPK_SHEET_CONFIG.providerMode,
    staging_sheets: TPK_SHEET_CONFIG.stagingSheets,
  };
}

function TPK_appendStagingAudit_(action, payload) {
  return {
    ok: true,
    action: action,
    payload: payload || {},
    note: 'CB-3 placeholder. Real SpreadsheetApp write belum diaktifkan.',
  };
}
