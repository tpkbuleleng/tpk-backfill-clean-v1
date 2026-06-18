import { APP_CONFIG } from "../config/AppConfig.js";

export function createProviderResult({ ok = true, action, table, key = "", row = null, error = null, meta = {} }) {
  return Object.freeze({
    ok,
    provider_version: APP_CONFIG.providerVersion,
    provider_mode: APP_CONFIG.backendMode,
    action,
    table,
    key,
    row,
    error,
    meta,
  });
}

export function createProviderError({ action, table, key = "", code, message, details = {} }) {
  return createProviderResult({
    ok: false,
    action,
    table,
    key,
    error: { code, message, details },
  });
}
