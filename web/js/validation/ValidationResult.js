import { APP_CONFIG } from "../config/AppConfig.js";
import { DomainError } from "../domain/DomainError.js";

export function createValidationResult(context = {}) {
  return {
    ok: true,
    validation_version: APP_CONFIG.validationVersion,
    context,
    error_count: 0,
    warning_count: 0,
    errors: [],
    warnings: [],
    domain: null,
  };
}

export function addValidationError(result, code, field, message, details = {}) {
  result.ok = false;
  result.errors.push({ code, field, message, details });
  result.error_count = result.errors.length;
  return result;
}

export function addValidationWarning(result, code, field, message, details = {}) {
  result.warnings.push({ code, field, message, details });
  result.warning_count = result.warnings.length;
  return result;
}

export function addDomainError(result, error, fallbackField = "") {
  if (error instanceof DomainError) {
    return addValidationError(
      result,
      error.code,
      error.details?.fieldName || fallbackField,
      error.message,
      error.details || {}
    );
  }

  return addValidationError(
    result,
    "DOMAIN_ERROR",
    fallbackField,
    error?.message || "Domain error tidak dikenal.",
    { originalErrorName: error?.name || "" }
  );
}

export function requireField(result, raw, field, label = field) {
  const value = raw?.[field];

  if (value === undefined || value === null || String(value).trim() === "") {
    addValidationError(result, "FIELD_REQUIRED", field, `${label} wajib diisi.`, { field });
  }

  return result;
}

export function hasErrors(result) {
  return result.errors.length > 0;
}

export function finalizeValidationResult(result, domain = null) {
  result.ok = result.errors.length === 0;
  result.error_count = result.errors.length;
  result.warning_count = result.warnings.length;
  result.domain = result.ok ? domain : null;
  return Object.freeze({
    ...result,
    errors: Object.freeze([...result.errors]),
    warnings: Object.freeze([...result.warnings]),
    domain: result.ok && domain ? Object.freeze({ ...domain }) : null,
  });
}
