import { addValidationError } from "./ValidationResult.js";

export function normalizeParentRegistry(parentSasaranKeys = []) {
  if (parentSasaranKeys instanceof Set) {
    return parentSasaranKeys;
  }

  return new Set(parentSasaranKeys);
}

export function validateParentSasaranExists(result, raw, options = {}) {
  const key = String(raw?.sasaran_unique_key || "").trim();

  if (!key) {
    addValidationError(
      result,
      "PARENT_SASARAN_KEY_REQUIRED",
      "sasaran_unique_key",
      "sasaran_unique_key wajib diisi untuk pendampingan.",
      {}
    );
    return result;
  }

  const registry = normalizeParentRegistry(options.parentSasaranKeys || []);

  if (!registry.has(key)) {
    addValidationError(
      result,
      "PARENT_SASARAN_NOT_FOUND",
      "sasaran_unique_key",
      "Parent sasaran tidak ditemukan pada registry validasi.",
      { sasaran_unique_key: key }
    );
  }

  return result;
}
