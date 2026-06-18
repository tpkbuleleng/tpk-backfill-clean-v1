import { SHEET_CONFIG } from "../config/SheetConfig.js";
import { createProviderError, createProviderResult } from "./ProviderResult.js";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export class MockSheetProvider {
  constructor() {
    this.reset();
  }

  reset() {
    this.tables = {
      [SHEET_CONFIG.stagingTables.sasaran]: [],
      [SHEET_CONFIG.stagingTables.pendampingan]: [],
      [SHEET_CONFIG.stagingTables.audit]: [],
    };

    this.indexes = {
      sasaran: new Map(),
      pendampingan: new Map(),
    };
  }

  getProviderHealth() {
    return Object.freeze({
      ok: true,
      provider_mode: SHEET_CONFIG.providerMode,
      tables: Object.keys(this.tables),
      sasaran_count: this.tables[SHEET_CONFIG.stagingTables.sasaran].length,
      pendampingan_count: this.tables[SHEET_CONFIG.stagingTables.pendampingan].length,
      audit_count: this.tables[SHEET_CONFIG.stagingTables.audit].length,
    });
  }

  appendAudit(action, payload = {}) {
    const row = {
      audit_id: `AUDIT_${String(this.tables[SHEET_CONFIG.stagingTables.audit].length + 1).padStart(4, "0")}`,
      action,
      timestamp: new Date().toISOString(),
      payload: clone(payload),
    };

    this.tables[SHEET_CONFIG.stagingTables.audit].push(row);
    return row;
  }

  writeSasaran(domain) {
    const table = SHEET_CONFIG.stagingTables.sasaran;
    const key = domain?.sasaran_unique_key || "";

    if (!key) {
      return createProviderError({
        action: "WRITE_SASARAN",
        table,
        key,
        code: "SASARAN_KEY_REQUIRED",
        message: "sasaran_unique_key wajib tersedia sebelum write.",
      });
    }

    if (this.indexes.sasaran.has(key)) {
      return createProviderError({
        action: "WRITE_SASARAN",
        table,
        key,
        code: "DUPLICATE_SASARAN_UNIQUE_KEY",
        message: "sasaran_unique_key sudah ada di staging.",
        details: { sasaran_unique_key: key },
      });
    }

    const row = Object.freeze({
      staging_row_id: `STG_SAS_${String(this.tables[table].length + 1).padStart(4, "0")}`,
      ...clone(domain),
    });

    this.tables[table].push(row);
    this.indexes.sasaran.set(key, row);
    this.appendAudit("WRITE_SASARAN", { key });

    return createProviderResult({
      action: "WRITE_SASARAN",
      table,
      key,
      row,
      meta: { row_count: this.tables[table].length },
    });
  }

  hasSasaran(key) {
    return this.indexes.sasaran.has(String(key || "").trim());
  }

  getParentSasaranKeys() {
    return Array.from(this.indexes.sasaran.keys());
  }

  writePendampingan(domain) {
    const table = SHEET_CONFIG.stagingTables.pendampingan;
    const key = domain?.pendampingan_unique_key || "";
    const parentKey = domain?.sasaran_unique_key || "";

    if (!key) {
      return createProviderError({
        action: "WRITE_PENDAMPINGAN",
        table,
        key,
        code: "PENDAMPINGAN_KEY_REQUIRED",
        message: "pendampingan_unique_key wajib tersedia sebelum write.",
      });
    }

    if (!this.hasSasaran(parentKey)) {
      return createProviderError({
        action: "WRITE_PENDAMPINGAN",
        table,
        key,
        code: "PARENT_SASARAN_NOT_FOUND",
        message: "Parent sasaran belum tersedia di staging provider.",
        details: { sasaran_unique_key: parentKey },
      });
    }

    if (this.indexes.pendampingan.has(key)) {
      return createProviderError({
        action: "WRITE_PENDAMPINGAN",
        table,
        key,
        code: "DUPLICATE_PENDAMPINGAN_UNIQUE_KEY",
        message: "pendampingan_unique_key sudah ada di staging.",
        details: { pendampingan_unique_key: key },
      });
    }

    const row = Object.freeze({
      staging_row_id: `STG_PEN_${String(this.tables[table].length + 1).padStart(4, "0")}`,
      ...clone(domain),
    });

    this.tables[table].push(row);
    this.indexes.pendampingan.set(key, row);
    this.appendAudit("WRITE_PENDAMPINGAN", { key, parentKey });

    return createProviderResult({
      action: "WRITE_PENDAMPINGAN",
      table,
      key,
      row,
      meta: { row_count: this.tables[table].length },
    });
  }

  getSnapshot() {
    return Object.freeze(clone({
      provider_health: this.getProviderHealth(),
      tables: this.tables,
    }));
  }
}
