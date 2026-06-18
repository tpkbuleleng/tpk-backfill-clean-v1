import { APP_CONFIG } from "../config/AppConfig.js";
import { normalizeText } from "./TaxonomyService.js";
import { deriveTaxonomyProfile } from "./TaxonomyService.js";
import { buildScopeDomain } from "./ScopeModel.js";

function normalizeIdentifier(value) {
  return normalizeText(value);
}

export function buildPendampinganUniqueKey(raw = {}) {
  const existing = normalizeIdentifier(raw.pendampingan_unique_key);

  if (existing) {
    return existing;
  }

  const sasaranUniqueKey = normalizeIdentifier(raw.sasaran_unique_key);
  const tanggalPendampingan = normalizeIdentifier(raw.tanggal_pendampingan);

  if (!sasaranUniqueKey || !tanggalPendampingan) {
    return "";
  }

  return `${sasaranUniqueKey}|${tanggalPendampingan}`;
}

export function buildPendampinganDomain(raw = {}) {
  const tanggalPendampingan = normalizeIdentifier(raw.tanggal_pendampingan);
  const scope = buildScopeDomain(raw);
  const taxonomy = deriveTaxonomyProfile(raw.jenis_sasaran, raw.tanggal_lahir, tanggalPendampingan);

  return Object.freeze({
    domain_version: APP_CONFIG.domainVersion,
    record_type: "PENDAMPINGAN",
    pendampingan_unique_key: buildPendampinganUniqueKey(raw),
    sasaran_unique_key: normalizeIdentifier(raw.sasaran_unique_key),
    id_sasaran: normalizeIdentifier(raw.id_sasaran),
    id_tim: scope.id_tim,
    kode_kecamatan: scope.kode_kecamatan,
    scope_key: scope.scope_key,
    tanggal_pendampingan: tanggalPendampingan,
    jenis_sasaran: taxonomy.jenis_sasaran,
    age_months_at_pendampingan: taxonomy.age_months_at_anchor,
    kelompok_umur_balita_at_pendampingan: taxonomy.kelompok_umur_balita,
    is_baduta_prioritas_at_pendampingan: taxonomy.is_baduta_prioritas,
    status_pendampingan: normalizeText(raw.status_pendampingan),
    source: normalizeText(raw.source || "DOMAIN_BUILD"),
  });
}
