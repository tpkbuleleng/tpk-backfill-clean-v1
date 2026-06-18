import { TAXONOMY_CONFIG } from "../config/TaxonomyConfig.js";
import { calculateAgeInMonths } from "./AgeService.js";

export function normalizeJenisSasaran(value) {
  return String(value || "").trim().toUpperCase();
}

export function isJenisSasaranValid(value) {
  const normalized = normalizeJenisSasaran(value);
  return TAXONOMY_CONFIG.officialJenisSasaran.includes(normalized);
}

export function assertJenisSasaranValid(value) {
  const normalized = normalizeJenisSasaran(value);

  if (normalized === "BADUTA") {
    throw new Error("BADUTA_LEGACY_NOT_ALLOWED");
  }

  if (!isJenisSasaranValid(normalized)) {
    throw new Error(`JENIS_SASARAN_INVALID: ${value}`);
  }

  return normalized;
}

export function deriveIsBadutaPrioritas(jenisSasaran, dateOfBirthIso, anchorDateIso) {
  const normalized = assertJenisSasaranValid(jenisSasaran);

  if (normalized !== "BALITA") {
    return false;
  }

  const ageMonths = calculateAgeInMonths(dateOfBirthIso, anchorDateIso);

  return (
    ageMonths >= TAXONOMY_CONFIG.badutaPriorityMinAgeMonths &&
    ageMonths <= TAXONOMY_CONFIG.badutaPriorityMaxAgeMonths
  );
}

export function deriveKelompokUmurBalita(jenisSasaran, dateOfBirthIso, anchorDateIso) {
  const normalized = assertJenisSasaranValid(jenisSasaran);

  if (normalized !== "BALITA") {
    return "";
  }

  const ageMonths = calculateAgeInMonths(dateOfBirthIso, anchorDateIso);

  if (ageMonths >= 0 && ageMonths <= 23) {
    return "BADUTA_0_23";
  }

  if (ageMonths >= 24 && ageMonths <= 59) {
    return "BALITA_24_59";
  }

  throw new Error(`BALITA_AGE_OUT_OF_RANGE: ${ageMonths}`);
}
