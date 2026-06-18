/**
 * Scope validator untuk Apps Script.
 */

function TPK_isOfficialKecamatan_(kodeKecamatan) {
  return TPK_SCOPE_CONFIG.officialKecamatanCodes.indexOf(TPK_normalizeUpperCode_(kodeKecamatan)) >= 0;
}

function TPK_isRegisteredTim_(kodeKecamatan, idTim) {
  const kec = TPK_normalizeUpperCode_(kodeKecamatan);
  const tim = TPK_normalizeUpperCode_(idTim);
  const registered = TPK_SCOPE_CONFIG.validTimByKecamatan[kec] || [];
  return registered.indexOf(tim) >= 0;
}

function TPK_validateScope_(result, raw) {
  raw = raw || {};
  const kodeKecamatan = TPK_normalizeUpperCode_(raw.kode_kecamatan);
  const idTim = TPK_normalizeUpperCode_(raw.id_tim);

  if (!kodeKecamatan) {
    return TPK_addValidationError_(result, 'KODE_KECAMATAN_REQUIRED', 'kode_kecamatan', 'kode_kecamatan wajib diisi.', {});
  }

  if (!idTim) {
    return TPK_addValidationError_(result, 'ID_TIM_REQUIRED', 'id_tim', 'id_tim wajib diisi.', {});
  }

  if (!TPK_isOfficialKecamatan_(kodeKecamatan)) {
    return TPK_addValidationError_(result, 'KODE_KECAMATAN_INVALID', 'kode_kecamatan', 'kode_kecamatan tidak terdaftar pada registry CB-2.', {
      kode_kecamatan: kodeKecamatan,
    });
  }

  if (!TPK_isRegisteredTim_(kodeKecamatan, idTim)) {
    return TPK_addValidationError_(result, 'SCOPE_TIM_NOT_REGISTERED', 'id_tim', 'id_tim tidak terdaftar pada kode_kecamatan tersebut.', {
      kode_kecamatan: kodeKecamatan,
      id_tim: idTim,
    });
  }

  return result;
}
