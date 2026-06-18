import { createValidationResult, requireField, hasErrors, addDomainError, finalizeValidationResult } from "./ValidationResult.js";
import { validateNotFutureDate } from "./DateValidator.js";
import { validateScope } from "./ScopeValidator.js";
import { validateParentSasaranExists } from "./ParentValidator.js";
import { buildPendampinganDomain } from "../domain/PendampinganModel.js";
import { assertJenisSasaranValid } from "../domain/TaxonomyService.js";
import { todayIsoLocal } from "../domain/DateService.js";

export function validatePendampingan(raw = {}, options = {}) {
  const currentDate = options.currentDate || todayIsoLocal();
  const result = createValidationResult({
    validator: "PendampinganValidator",
    currentDate,
  });

  requireField(result, raw, "sasaran_unique_key", "sasaran_unique_key");
  requireField(result, raw, "id_sasaran", "id_sasaran");
  requireField(result, raw, "id_tim", "id_tim");
  requireField(result, raw, "kode_kecamatan", "kode_kecamatan");
  requireField(result, raw, "jenis_sasaran", "jenis_sasaran");
  requireField(result, raw, "tanggal_lahir", "tanggal_lahir");
  requireField(result, raw, "tanggal_pendampingan", "tanggal_pendampingan");
  requireField(result, raw, "status_pendampingan", "status_pendampingan");

  validateNotFutureDate(result, raw, "tanggal_lahir", currentDate, "tanggal_lahir");
  validateNotFutureDate(result, raw, "tanggal_pendampingan", currentDate, "tanggal_pendampingan");
  validateScope(result, raw);
  validateParentSasaranExists(result, raw, options);

  try {
    assertJenisSasaranValid(raw.jenis_sasaran);
  } catch (error) {
    addDomainError(result, error, "jenis_sasaran");
  }

  if (hasErrors(result)) {
    return finalizeValidationResult(result);
  }

  try {
    const domain = buildPendampinganDomain(raw);
    return finalizeValidationResult(result, domain);
  } catch (error) {
    addDomainError(result, error, "tanggal_pendampingan");
    return finalizeValidationResult(result);
  }
}
