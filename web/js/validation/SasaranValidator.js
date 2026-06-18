import { createValidationResult, requireField, hasErrors, addDomainError, finalizeValidationResult } from "./ValidationResult.js";
import { validateNik16, validateKk16 } from "./IdentifierValidator.js";
import { validateNotFutureDate } from "./DateValidator.js";
import { validateScope } from "./ScopeValidator.js";
import { buildSasaranDomain } from "../domain/SasaranModel.js";
import { assertJenisSasaranValid } from "../domain/TaxonomyService.js";
import { todayIsoLocal } from "../domain/DateService.js";

export function validateSasaran(raw = {}, options = {}) {
  const anchorDate = options.anchorDate || raw.anchor_date || raw.tanggal_registrasi || todayIsoLocal();
  const result = createValidationResult({ validator: "SasaranValidator", anchorDate });

  requireField(result, raw, "id_tim", "id_tim");
  requireField(result, raw, "kode_kecamatan", "kode_kecamatan");
  requireField(result, raw, "jenis_sasaran", "jenis_sasaran");
  requireField(result, raw, "nama_sasaran", "nama_sasaran");
  requireField(result, raw, "nik", "NIK");
  requireField(result, raw, "no_kk", "Nomor KK");
  requireField(result, raw, "tanggal_lahir", "tanggal_lahir");

  validateNik16(result, raw, "nik");
  validateKk16(result, raw, "no_kk");
  validateNotFutureDate(result, raw, "tanggal_lahir", anchorDate, "tanggal_lahir");
  validateScope(result, raw);

  try {
    assertJenisSasaranValid(raw.jenis_sasaran);
  } catch (error) {
    addDomainError(result, error, "jenis_sasaran");
  }

  if (hasErrors(result)) {
    return finalizeValidationResult(result);
  }

  try {
    return finalizeValidationResult(result, buildSasaranDomain(raw, { anchorDate }));
  } catch (error) {
    addDomainError(result, error, "jenis_sasaran");
    return finalizeValidationResult(result);
  }
}
