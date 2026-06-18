import { normalizeUpperCode, normalizeText } from "./TaxonomyService.js";

export function normalizeKodeKecamatan(value) {
  return normalizeUpperCode(value);
}

export function normalizeIdTim(value) {
  return normalizeUpperCode(value);
}

export function normalizeKodeDesa(value) {
  return normalizeText(value);
}

export function buildScopeKey({ kode_kecamatan, id_tim }) {
  const kecamatan = normalizeKodeKecamatan(kode_kecamatan);
  const tim = normalizeIdTim(id_tim);

  if (!kecamatan || !tim) {
    return "";
  }

  return `${kecamatan}|${tim}`;
}

export function buildScopeDomain(raw = {}) {
  const kodeKecamatan = normalizeKodeKecamatan(raw.kode_kecamatan);
  const idTim = normalizeIdTim(raw.id_tim);

  return Object.freeze({
    kode_kecamatan: kodeKecamatan,
    id_tim: idTim,
    scope_key: buildScopeKey({
      kode_kecamatan: kodeKecamatan,
      id_tim: idTim,
    }),
  });
}
