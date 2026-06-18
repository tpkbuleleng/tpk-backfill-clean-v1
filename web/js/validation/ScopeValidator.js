import { SCOPE_CONFIG } from "../config/ScopeConfig.js";
import { normalizeKodeKecamatan, normalizeIdTim } from "../domain/ScopeModel.js";
import { addValidationError } from "./ValidationResult.js";

export function isOfficialKecamatan(kodeKecamatan) {
  return SCOPE_CONFIG.officialKecamatanCodes.includes(normalizeKodeKecamatan(kodeKecamatan));
}

export function isRegisteredTim(kodeKecamatan, idTim) {
  const kec = normalizeKodeKecamatan(kodeKecamatan);
  const tim = normalizeIdTim(idTim);
  const registered = SCOPE_CONFIG.validTimByKecamatan[kec] || [];
  return registered.includes(tim);
}

export function validateScope(result, raw) {
  const kodeKecamatan = normalizeKodeKecamatan(raw?.kode_kecamatan);
  const idTim = normalizeIdTim(raw?.id_tim);

  if (!kodeKecamatan) {
    addValidationError(
      result,
      "KODE_KECAMATAN_REQUIRED",
      "kode_kecamatan",
      "kode_kecamatan wajib diisi.",
      {}
    );
    return result;
  }

  if (!idTim) {
    addValidationError(
      result,
      "ID_TIM_REQUIRED",
      "id_tim",
      "id_tim wajib diisi.",
      {}
    );
    return result;
  }

  if (!isOfficialKecamatan(kodeKecamatan)) {
    addValidationError(
      result,
      "KODE_KECAMATAN_INVALID",
      "kode_kecamatan",
      "kode_kecamatan tidak terdaftar pada registry CB-2.",
      { kode_kecamatan: kodeKecamatan }
    );
    return result;
  }

  if (!isRegisteredTim(kodeKecamatan, idTim)) {
    addValidationError(
      result,
      "SCOPE_TIM_NOT_REGISTERED",
      "id_tim",
      "id_tim tidak terdaftar pada kode_kecamatan tersebut.",
      { kode_kecamatan: kodeKecamatan, id_tim: idTim }
    );
  }

  return result;
}
