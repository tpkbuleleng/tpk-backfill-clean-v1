/**
 * Placeholder Staging Writer GAS untuk CB-3.
 * Jalur browser saat ini memakai MockSheetProvider.
 */

function TPK_writeSasaranToStaging_(raw, options) {
  return {
    ok: false,
    code: 'GAS_PROVIDER_NOT_CONNECTED_IN_CB3',
    message: 'Gunakan mock provider di GitHub Pages. GAS write akan diaktifkan pada paket berikutnya.',
    raw: raw || {},
    options: options || {},
  };
}

function TPK_writePendampinganToStaging_(raw, options) {
  return {
    ok: false,
    code: 'GAS_PROVIDER_NOT_CONNECTED_IN_CB3',
    message: 'Gunakan mock provider di GitHub Pages. GAS write akan diaktifkan pada paket berikutnya.',
    raw: raw || {},
    options: options || {},
  };
}
