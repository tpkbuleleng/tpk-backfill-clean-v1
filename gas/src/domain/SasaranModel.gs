/**
 * Sasaran domain model untuk Apps Script.
 */

function TPK_buildSasaranUniqueKey_(raw) {
  raw = raw || {};
  const nik = TPK_normalizeText_(raw.nik);
  const idTim = TPK_normalizeUpperCode_(raw.id_tim);

  if (!nik || !idTim) {
    return TPK_normalizeText_(raw.sasaran_unique_key);
  }

  return nik + '|' + idTim;
}

function TPK_buildSasaranDomain_(raw, options) {
  raw = raw || {};
  options = options || {};

  const anchorDate = options.anchorDate || raw.anchor_date || raw.tanggal_registrasi;
  const scope = TPK_buildScopeDomain_(raw);
  const normalizedJenis = TPK_assertJenisSasaranValid_(raw.jenis_sasaran);

  let ageMonths = null;
  let kelompokUmurBalita = '';
  let isBadutaPrioritas = false;

  if (normalizedJenis === 'BALITA') {
    ageMonths = TPK_calculateAgeInMonths_(raw.tanggal_lahir, anchorDate);
    TPK_assertBalitaAgeInRange_(ageMonths);
    kelompokUmurBalita = TPK_deriveKelompokUmurBalita_(normalizedJenis, raw.tanggal_lahir, anchorDate);
    isBadutaPrioritas = TPK_deriveIsBadutaPrioritas_(normalizedJenis, raw.tanggal_lahir, anchorDate);
  }

  return Object.freeze({
    domain_version: TPK_APP_CONFIG.domainVersion,
    record_type: 'SASARAN',
    sasaran_unique_key: TPK_buildSasaranUniqueKey_(raw),
    id_sasaran: TPK_normalizeText_(raw.id_sasaran),
    id_tim: scope.id_tim,
    kode_kecamatan: scope.kode_kecamatan,
    scope_key: scope.scope_key,
    jenis_sasaran: normalizedJenis,
    nama_sasaran: TPK_normalizeText_(raw.nama_sasaran),
    nik: TPK_normalizeText_(raw.nik),
    no_kk: TPK_normalizeText_(raw.no_kk),
    tanggal_lahir: TPK_normalizeText_(raw.tanggal_lahir),
    anchor_date: anchorDate,
    age_months_at_anchor: ageMonths,
    kelompok_umur_balita: kelompokUmurBalita,
    is_baduta_prioritas: isBadutaPrioritas,
    source: TPK_normalizeText_(raw.source || 'DOMAIN_BUILD'),
  });
}
