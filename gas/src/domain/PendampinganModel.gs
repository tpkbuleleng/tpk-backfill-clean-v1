/**
 * Pendampingan domain model untuk Apps Script.
 */

function TPK_buildPendampinganUniqueKey_(raw) {
  raw = raw || {};
  const existing = TPK_normalizeText_(raw.pendampingan_unique_key);

  if (existing) {
    return existing;
  }

  const sasaranUniqueKey = TPK_normalizeText_(raw.sasaran_unique_key);
  const tanggalPendampingan = TPK_normalizeText_(raw.tanggal_pendampingan);

  if (!sasaranUniqueKey || !tanggalPendampingan) {
    return '';
  }

  return sasaranUniqueKey + '|' + tanggalPendampingan;
}

function TPK_buildPendampinganDomain_(raw) {
  raw = raw || {};
  const tanggalPendampingan = TPK_normalizeText_(raw.tanggal_pendampingan);
  const scope = TPK_buildScopeDomain_(raw);
  const normalizedJenis = TPK_assertJenisSasaranValid_(raw.jenis_sasaran);

  let ageMonths = null;
  let kelompokUmurBalita = '';
  let isBadutaPrioritas = false;

  if (normalizedJenis === 'BALITA') {
    ageMonths = TPK_calculateAgeInMonths_(raw.tanggal_lahir, tanggalPendampingan);
    TPK_assertBalitaAgeInRange_(ageMonths);
    kelompokUmurBalita = TPK_deriveKelompokUmurBalita_(normalizedJenis, raw.tanggal_lahir, tanggalPendampingan);
    isBadutaPrioritas = TPK_deriveIsBadutaPrioritas_(normalizedJenis, raw.tanggal_lahir, tanggalPendampingan);
  }

  return Object.freeze({
    domain_version: TPK_APP_CONFIG.domainVersion,
    record_type: 'PENDAMPINGAN',
    pendampingan_unique_key: TPK_buildPendampinganUniqueKey_(raw),
    sasaran_unique_key: TPK_normalizeText_(raw.sasaran_unique_key),
    id_sasaran: TPK_normalizeText_(raw.id_sasaran),
    id_tim: scope.id_tim,
    kode_kecamatan: scope.kode_kecamatan,
    scope_key: scope.scope_key,
    tanggal_pendampingan: tanggalPendampingan,
    jenis_sasaran: normalizedJenis,
    age_months_at_pendampingan: ageMonths,
    kelompok_umur_balita_at_pendampingan: kelompokUmurBalita,
    is_baduta_prioritas_at_pendampingan: isBadutaPrioritas,
    status_pendampingan: TPK_normalizeText_(raw.status_pendampingan),
    source: TPK_normalizeText_(raw.source || 'DOMAIN_BUILD'),
  });
}
