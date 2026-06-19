class MockProvider {
  constructor() {
    this.sasaranRows = [];
    this.pendampinganRows = [];
    this.auditCount = 0;
  }
  async call(action, payload = {}) {
    const A = window.CB6.actions;
    if (action === A.health) return this._base({ action, status: 'healthy' });
    if (action === A.setupSheets) return this._base({ action, sheets_ready: true });
    if (action === A.clearTestRows) { this.sasaranRows = []; this.pendampinganRows = []; this.auditCount++; return this._base({ action, cleared: true }); }
    if (action === A.writeSampleSasaran) return this._writeSasaran();
    if (action === A.writeSamplePendampingan) return this._writePendampingan();
    if (action === A.exportSasaranCsv) return this._export('sasaran', payload.scope || {});
    if (action === A.exportPendampinganCsv) return this._export('pendampingan', payload.scope || {});
    if (action === A.exportManifest) return this._manifest(payload.scope || {});
    if (action === A.snapshotExport) return this._snapshot(payload.scope || {});
    if (action === A.runExportSmokeTest) return this._smoke(payload.scope || {});
    throw new Error('Action mock tidak dikenal: ' + action);
  }
  _base(extra) { return { ok: true, app_version: CB6.appVersion, package_version: CB6.packageVersion, provider_version: CB6.providerVersion, export_version: CB6.exportVersion, generated_at: new Date().toISOString(), ...extra }; }
  _writeSasaran() {
    const row = { record_key:'5108010101999999|TIM_TJK_001', kode_kecamatan:'TJK', id_tim:'TIM_TJK_001', jenis_sasaran:'BALITA', nik:'5108010101999999', no_kk:'5108010101888888', nama_sasaran:'BALITA MOCK CB6', tanggal_lahir:'2025-01-10', tanggal_registrasi:'2026-06-19', anchor_date:'2026-06-19', is_baduta_prioritas:'true', kelompok_umur_balita:'BADUTA_0_23', created_at:new Date().toISOString(), source:'CB6_MOCK' };
    if (!this.sasaranRows.some(r => r.record_key === row.record_key)) this.sasaranRows.push(row);
    this.auditCount++;
    return this._base({ action:'writeSampleSasaran', inserted:true, record_key: row.record_key });
  }
  _writePendampingan() {
    if (!this.sasaranRows.length) this._writeSasaran();
    const row = { record_key:'5108010101999999|TIM_TJK_001|2026-06|2026-06-19', sasaran_record_key:'5108010101999999|TIM_TJK_001', kode_kecamatan:'TJK', id_tim:'TIM_TJK_001', jenis_sasaran:'BALITA', nik:'5108010101999999', tanggal_pendampingan:'2026-06-19', periode_laporan:'2026-06', status_pendampingan:'KUNJUNGAN_RUMAH', is_baduta_prioritas_at_pendampingan:'true', kelompok_umur_balita_at_pendampingan:'BADUTA_0_23', created_at:new Date().toISOString(), source:'CB6_MOCK' };
    if (!this.pendampinganRows.some(r => r.record_key === row.record_key)) this.pendampinganRows.push(row);
    this.auditCount++;
    return this._base({ action:'writeSamplePendampingan', inserted:true, record_key: row.record_key });
  }
  _rows(kind, scope) {
    let rows = kind === 'sasaran' ? this.sasaranRows : this.pendampinganRows;
    if (!rows.length) kind === 'sasaran' ? this._writeSasaran() : this._writePendampingan();
    rows = kind === 'sasaran' ? this.sasaranRows : this.pendampinganRows;
    const type = scope.type || 'ALL';
    if (type === 'KODE_KECAMATAN') rows = rows.filter(r => r.kode_kecamatan === scope.kode_kecamatan);
    if (type === 'ID_TIM') rows = rows.filter(r => r.id_tim === scope.id_tim);
    if (type === 'RECORD_KEYS') {
      const keys = new Set(scope.selected_record_keys || []);
      rows = rows.filter(r => keys.has(r.record_key) || keys.has(r.sasaran_record_key));
    }
    return rows;
  }
  _csv(rows) {
    const headers = rows.length ? Object.keys(rows[0]) : ['record_key','kode_kecamatan','id_tim','jenis_sasaran','nik'];
    const esc = v => '="' + String(v ?? '').replace(/"/g,'""') + '"';
    return [headers.join(','), ...rows.map(r => headers.map(h => esc(r[h])).join(','))].join('\n');
  }
  _checksum(text) { let h = 0; for (let i=0;i<text.length;i++) h = Math.imul(31,h) + text.charCodeAt(i) | 0; return 'mock_sha256_' + (h >>> 0).toString(16).padStart(8,'0'); }
  _export(kind, scope) {
    const rows = this._rows(kind, scope); const csv = this._csv(rows); const checksum = this._checksum(csv);
    return this._base({ action: kind === 'sasaran' ? 'exportSasaranCsv' : 'exportPendampinganCsv', export_batch_id: 'EXP_CB6_MOCK_' + Date.now(), export_scope: scope.type || 'ALL', selected_row_count: rows.length, selected_record_keys: rows.map(r => r.record_key), checksum, filename: `cb6_${kind}_mock.csv`, csv_text: csv, header: csv.split('\n')[0].split(',') });
  }
  _manifest(scope) {
    const s = this._export('sasaran', scope); const p = this._export('pendampingan', scope);
    const manifest = { export_batch_id:'EXP_CB6_MANIFEST_MOCK_' + Date.now(), package_version:CB6.packageVersion, provider_version:CB6.providerVersion, taxonomy_version:CB6.taxonomyVersion, validation_version:CB6.validationVersion, hardening_version:CB6.hardeningVersion, source_workbook:'MOCK_GITHUB_PAGES', source_sheets:[CB6.sheets.sasaran, CB6.sheets.pendampingan], export_scope:scope.type || 'ALL', selected_row_count:s.selected_row_count + p.selected_row_count, selected_record_keys:[...s.selected_record_keys, ...p.selected_record_keys], generated_at:new Date().toISOString(), checksum:this._checksum(s.csv_text + p.csv_text), files:{ sasaran:{ checksum:s.checksum, row_count:s.selected_row_count }, pendampingan:{ checksum:p.checksum, row_count:p.selected_row_count } } };
    return this._base({ action:'exportManifest', manifest, manifest_json: JSON.stringify(manifest, null, 2), filename:'cb6_manifest_mock.json' });
  }
  _snapshot(scope) { return this._base({ action:'snapshotExport', sasaran_count:this._rows('sasaran',scope).length, pendampingan_count:this._rows('pendampingan',scope).length, audit_count:this.auditCount, scope }); }
  async _smoke(scope) { const s=this._export('sasaran',scope), p=this._export('pendampingan',scope), m=this._manifest(scope); return this._base({ action:'runExportSmokeTest', smoke_ok:true, checks:{ sasaran_ok:s.ok, pendampingan_ok:p.ok, manifest_ok:m.ok, manifest_has_export_batch_id:!!m.manifest.export_batch_id, manifest_has_selected_row_count:Number.isInteger(m.manifest.selected_row_count), manifest_has_selected_record_keys:Array.isArray(m.manifest.selected_record_keys), manifest_has_checksum:!!m.manifest.checksum, nik_kk_string_guard:true, date_format_guard:true, csv_header_guard:true } }); }
}
window.MockProvider = MockProvider;
