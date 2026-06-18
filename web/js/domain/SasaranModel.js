import { APP_CONFIG } from "../config/AppConfig.js";
import { normalizeText } from "./TaxonomyService.js";
import { deriveTaxonomyProfile } from "./TaxonomyService.js";
import { buildScopeDomain } from "./ScopeModel.js";
import { todayIsoLocal } from "./DateService.js";

function normalizeIdentifier(value) {
  return normalizeText(value);
}

export function buildSasaranUniqueKey(raw = {}) {
  const nik = normalizeIdentifier(raw.nik);
  const idTim = normalizeIdentifier(raw.id_tim).toUpperCase();

  if (!nik || !idTim) {
    return normalizeIdentifier(raw.sasaran_unique_key);
  }

  return `${nik}|${idTim}`;
}

export function buildSasaranDomain(raw = {}, options = {}) {
  const anchorDate = options.anchorDate || raw.anchor_date || raw.tanggal_registrasi || todayIsoLocal();
  const scope = buildScopeDomain(raw);
  const taxonomy = deriveTaxonomyProfile(raw.jenis_sasaran, raw.tanggal_lahir, anchorDate);
  const sasaranUniqueKey = buildSasaranUniqueKey(raw);

  return Object.freeze({
    domain_version: APP_CONFIG.domainVersion,
    record_type: "SASARAN",
    sasaran_unique_key: sasaranUniqueKey,
    id_sasaran: normalizeIdentifier(raw.id_sasaran),
    id_tim: scope.id_tim,
    kode_kecamatan: scope.kode_kecamatan,
    scope_key: scope.scope_key,
    jenis_sasaran: taxonomy.jenis_sasaran,
    nama_sasaran: normalizeText(raw.nama_sasaran),
    nik: normalizeIdentifier(raw.nik),
    no_kk: normalizeIdentifier(raw.no_kk),
    tanggal_lahir: normalizeIdentifier(raw.tanggal_lahir),
    anchor_date: taxonomy.anchor_date,
    age_months_at_anchor: taxonomy.age_months_at_anchor,
    kelompok_umur_balita: taxonomy.kelompok_umur_balita,
    is_baduta_prioritas: taxonomy.is_baduta_prioritas,
    source: normalizeText(raw.source || "DOMAIN_BUILD"),
  });
}
