window.CB6 = Object.freeze({
  appVersion: 'CB-6.0.0',
  packageVersion: 'TPK_BACKFILL_CLEAN_2026_CB6',
  providerVersion: 'TPK_PROVIDER_2026_CB6',
  endpointBridgeVersion: 'TPK_ENDPOINT_BRIDGE_2026_CB6',
  exportVersion: 'TPK_SELECTIVE_EXPORT_2026_CB6',
  taxonomyVersion: 'TPK_TAXONOMY_2026_7E_R1',
  validationVersion: 'TPK_VALIDATION_2026_CB2',
  hardeningVersion: 'TPK_PROVIDER_HARDENING_2026_CB5',
  realProviderMode: 'GAS_WEB_APP_REAL_SHEET_PROVIDER_HARDENED_EXPORT',
  backendMode: 'GAS_WEB_APP_ENDPOINT_OPTIONAL',
  sheets: {
    sasaran: 'staging_sasaran',
    pendampingan: 'staging_pendampingan',
    audit: 'staging_audit_log',
    meta: 'meta_cb4'
  },
  actions: Object.freeze({
    health: 'health',
    setupSheets: 'setupSheets',
    clearTestRows: 'clearTestRows',
    writeSampleSasaran: 'writeSampleSasaran',
    writeSamplePendampingan: 'writeSamplePendampingan',
    exportSasaranCsv: 'exportSasaranCsv',
    exportPendampinganCsv: 'exportPendampinganCsv',
    exportManifest: 'exportManifest',
    runExportSmokeTest: 'runExportSmokeTest',
    snapshotExport: 'snapshotExport'
  })
});
