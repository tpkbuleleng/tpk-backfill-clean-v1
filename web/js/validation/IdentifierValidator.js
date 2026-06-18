import { addValidationError } from "./ValidationResult.js";

const SIXTEEN_DIGIT_PATTERN = /^\d{16}$/;

export function normalizeDigits(value) {
  return String(value || "").trim();
}

export function isSixteenDigits(value) {
  return SIXTEEN_DIGIT_PATTERN.test(normalizeDigits(value));
}

export function validateNik16(result, raw, field = "nik") {
  const value = normalizeDigits(raw?.[field]);

  if (!value) {
    addValidationError(
      result,
      "NIK_REQUIRED",
      field,
      "NIK wajib diisi.",
      { field }
    );
    return result;
  }

  if (!isSixteenDigits(value)) {
    addValidationError(
      result,
      "NIK_16_DIGIT_REQUIRED",
      field,
      "NIK wajib 16 digit angka.",
      { field, valueLength: value.length }
    );
  }

  return result;
}

export function validateKk16(result, raw, field = "no_kk") {
  const value = normalizeDigits(raw?.[field]);

  if (!value) {
    addValidationError(
      result,
      "KK_REQUIRED",
      field,
      "Nomor KK wajib diisi.",
      { field }
    );
    return result;
  }

  if (!isSixteenDigits(value)) {
    addValidationError(
      result,
      "KK_16_DIGIT_REQUIRED",
      field,
      "Nomor KK wajib 16 digit angka.",
      { field, valueLength: value.length }
    );
  }

  return result;
}
