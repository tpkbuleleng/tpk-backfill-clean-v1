export const SHEET_CONFIG = Object.freeze({
  providerMode: "MOCK_BROWSER_STAGING_WITH_GAS_ENDPOINT_OPTION",
  realProviderMode: "GAS_WEB_APP_REAL_SHEET_PROVIDER",
  endpointMode: "JSONP_GET_BRIDGE",
  stagingTables: Object.freeze({
    sasaran: "staging_sasaran",
    pendampingan: "staging_pendampingan",
    audit: "staging_audit_log",
  }),
  keyFields: Object.freeze({
    sasaran: "sasaran_unique_key",
    pendampingan: "pendampingan_unique_key",
  }),
});
