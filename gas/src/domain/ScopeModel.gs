/**
 * Scope model untuk Apps Script.
 */

function TPK_buildScopeKey_(kodeKecamatan, idTim) {
  const kecamatan = TPK_normalizeUpperCode_(kodeKecamatan);
  const tim = TPK_normalizeUpperCode_(idTim);

  if (!kecamatan || !tim) {
    return '';
  }

  return kecamatan + '|' + tim;
}

function TPK_buildScopeDomain_(raw) {
  raw = raw || {};
  const kodeKecamatan = TPK_normalizeUpperCode_(raw.kode_kecamatan);
  const idTim = TPK_normalizeUpperCode_(raw.id_tim);

  return Object.freeze({
    kode_kecamatan: kodeKecamatan,
    id_tim: idTim,
    scope_key: TPK_buildScopeKey_(kodeKecamatan, idTim),
  });
}
