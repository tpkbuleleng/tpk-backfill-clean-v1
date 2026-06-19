(() => {
  const $ = id => document.getElementById(id);
  const state = { mock: localStorage.getItem('cb6_mock') !== 'false', mockProvider: new MockProvider() };
  $('appVersion').textContent = CB6.appVersion;
  $('endpointUrl').value = localStorage.getItem('cb6_endpoint_url') || '';

  function provider() { return state.mock ? state.mockProvider : new GasProvider($('endpointUrl').value.trim()); }
  function log(value) { $('output').textContent = typeof value === 'string' ? value : JSON.stringify(value, null, 2); }
  function scope() {
    const keys = $('recordKeys').value.split(/[\n,]/).map(s => s.trim()).filter(Boolean);
    return { type: $('exportScope').value, kode_kecamatan: $('kodeKecamatan').value.trim(), id_tim: $('idTim').value.trim(), selected_record_keys: keys };
  }
  function download(filename, content, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }
  async function call(action, payload = {}, opts = {}) {
    try {
      const result = await provider().call(action, payload);
      if (opts.downloadCsv && result.csv_text) download(result.filename || `${action}.csv`, result.csv_text, 'text/csv;charset=utf-8');
      if (opts.downloadJson && result.manifest_json) download(result.filename || `${action}.json`, result.manifest_json, 'application/json;charset=utf-8');
      log(result);
      return result;
    } catch (err) {
      log({ ok:false, action, error_message: err.message });
    }
  }
  async function regression() {
    const results = [];
    for (const action of [CB6.actions.health, CB6.actions.setupSheets, CB6.actions.clearTestRows, CB6.actions.writeSampleSasaran, CB6.actions.writeSamplePendampingan]) {
      const r = await provider().call(action, {}); results.push({ action, ok: !!r.ok });
    }
    const s = await provider().call(CB6.actions.exportSasaranCsv, { scope: scope() });
    const p = await provider().call(CB6.actions.exportPendampinganCsv, { scope: scope() });
    const m = await provider().call(CB6.actions.exportManifest, { scope: scope() });
    const smoke = await provider().call(CB6.actions.runExportSmokeTest, { scope: scope() });
    const checks = {
      export_sasaran_ok: !!s.ok,
      export_pendampingan_ok: !!p.ok,
      manifest_ok: !!m.ok,
      manifest_has_export_batch_id: !!m.manifest?.export_batch_id,
      manifest_has_selected_row_count: Number.isInteger(m.manifest?.selected_row_count),
      manifest_has_selected_record_keys: Array.isArray(m.manifest?.selected_record_keys),
      manifest_has_checksum: !!m.manifest?.checksum,
      smoke_ok: !!smoke.smoke_ok || !!smoke.ok
    };
    const overall = results.every(r => r.ok) && Object.values(checks).every(Boolean);
    log({ ok: overall, regression_version:'TPK_CB6_REGRESSION_2026', overall: overall ? 'PASS' : 'FAIL', mode: state.mock ? 'MOCK' : 'GAS_WEB_APP', app_version:CB6.appVersion, results, checks });
  }

  $('saveEndpointBtn').onclick = () => { localStorage.setItem('cb6_endpoint_url', $('endpointUrl').value.trim()); log({ ok:true, saved:true }); };
  $('mockBtn').onclick = () => { state.mock = !state.mock; localStorage.setItem('cb6_mock', String(state.mock)); $('mockBtn').textContent = 'Mode Mock: ' + (state.mock ? 'ON' : 'OFF'); log({ ok:true, mock_mode:state.mock }); };
  $('mockBtn').textContent = 'Mode Mock: ' + (state.mock ? 'ON' : 'OFF');
  $('healthBtn').onclick = () => call(CB6.actions.health);
  $('setupSheetsBtn').onclick = () => call(CB6.actions.setupSheets);
  $('clearTestRowsBtn').onclick = () => call(CB6.actions.clearTestRows);
  $('writeSampleSasaranBtn').onclick = () => call(CB6.actions.writeSampleSasaran);
  $('writeSamplePendampinganBtn').onclick = () => call(CB6.actions.writeSamplePendampingan);
  $('exportSasaranBtn').onclick = () => call(CB6.actions.exportSasaranCsv, { scope: scope() }, { downloadCsv:true });
  $('exportPendampinganBtn').onclick = () => call(CB6.actions.exportPendampinganCsv, { scope: scope() }, { downloadCsv:true });
  $('exportManifestBtn').onclick = () => call(CB6.actions.exportManifest, { scope: scope() }, { downloadJson:true });
  $('smokeBtn').onclick = () => call(CB6.actions.runExportSmokeTest, { scope: scope() });
  $('snapshotBtn').onclick = () => call(CB6.actions.snapshotExport, { scope: scope() });
  $('regressionBtn').onclick = regression;
  $('clearOutputBtn').onclick = () => log('Output dibersihkan.');
})();
