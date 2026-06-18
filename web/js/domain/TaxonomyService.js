import { TAXONOMY_CONFIG } from "../config/TaxonomyConfig.js";
import { DomainError } from "./DomainError.js";
import { calculateAgeInMonths } from "./AgeService.js";

export function normalizeText(value) {
  return String(value || "").trim();
}

export function normalizeUpperCode(value) {
  return normalizeText(value).toUpperCase();
}

export function normalizeJenisSasaran(value) {
  return normalizeUpperCode(value);
}

export function isJenisSasaranValid(value) {
  return TAXONOMY_CONFIG.officialJenisSasaran.includes(normalizeJenisSasaran(value));
}

export function assertJenisSasaranValid(value) {
  const normalized = normalizeJenisSasaran(value);

  if (!normalized) {
    throw new DomainError("JENIS_SASARAN_REQUIRED", "jenis_sasaran wajib diisi.", { value });
  }

  if (normalized === "BADUTA") {
    throw new DomainError(
      "BADUTA_LEGACY_NOT_ALLOWED",
      "BADUTA tidak boleh menjadi jenis_sasaran. Gunakan BALITA dan turunkan baduta_prioritas dari umur.",
      { value }
    );
  }

  if (!isJenisSasaranValid(normalized)) {
    throw new DomainError(
      "JENIS_SASARAN_INVALID",
      `jenis_sasaran tidak valid: ${value}`,
      { value, allowedValues: TAXONOMY_CONFIG.officialJenisSasaran }
    );
  }

  return normalized;
}

export function assertBalitaAgeInRange(ageMonths) {
  if (ageMonths < TAXONOMY_CONFIG.balitaMinAgeMonths || ageMonths > TAXONOMY_CONFIG.balitaMaxAgeMonths) {
    throw new DomainError(
      "BALITA_AGE_OUT_OF_RANGE",
      `Umur BALITA harus ${TAXONOMY_CONFIG.balitaMinAgeMonths}–${TAXONOMY_CONFIG.balitaMaxAgeMonths} bulan.`,
      { ageMonths, min: TAXONOMY_CONFIG.balitaMinAgeMonths, max: TAXONOMY_CONFIG.balitaMaxAgeMonths }
    );
  }

  return ageMonths;
}

export function deriveIsBadutaPrioritas(jenisSasaran, dateOfBirthIso, anchorDateIso) {
  const normalized = assertJenisSasaranValid(jenisSasaran);

  if (normalized !== "BALITA") {
    return false;
  }

  const ageMonths = calculateAgeInMonths(dateOfBirthIso, anchorDateIso);
  assertBalitaAgeInRange(ageMonths);

  return ageMonths >= TAXONOMY_CONFIG.badutaPriorityMinAgeMonths &&
    ageMonths <= TAXONOMY_CONFIG.badutaPriorityMaxAgeMonths;
}

export function deriveKelompokUmurBalita(jenisSasaran, dateOfBirthIso, anchorDateIso) {
  const normalized = assertJenisSasaranValid(jenisSasaran);

  if (normalized !== "BALITA") {
    return "";
  }

  const ageMonths = calculateAgeInMonths(dateOfBirthIso, anchorDateIso);
  assertBalitaAgeInRange(ageMonths);

  if (ageMonths >= TAXONOMY_CONFIG.badutaPriorityMinAgeMonths &&
      ageMonths <= TAXONOMY_CONFIG.badutaPriorityMaxAgeMonths) {
    return TAXONOMY_CONFIG.kelompokUmurBalita.BADUTA_0_23;
  }

  return TAXONOMY_CONFIG.kelompokUmurBalita.BALITA_24_59;
}

export function deriveTaxonomyProfile(jenisSasaran, dateOfBirthIso, anchorDateIso) {
  const normalized = assertJenisSasaranValid(jenisSasaran);

  if (normalized !== "BALITA") {
    return Object.freeze({
      jenis_sasaran: normalized,
      is_balita: false,
      age_months_at_anchor: null,
      kelompok_umur_balita: "",
      is_baduta_prioritas: false,
      anchor_date: anchorDateIso || "",
    });
  }

  const ageMonths = calculateAgeInMonths(dateOfBirthIso, anchorDateIso);
  assertBalitaAgeInRange(ageMonths);

  return Object.freeze({
    jenis_sasaran: normalized,
    is_balita: true,
    age_months_at_anchor: ageMonths,
    kelompok_umur_balita: deriveKelompokUmurBalita(normalized, dateOfBirthIso, anchorDateIso),
    is_baduta_prioritas: deriveIsBadutaPrioritas(normalized, dateOfBirthIso, anchorDateIso),
    anchor_date: anchorDateIso,
  });
}
