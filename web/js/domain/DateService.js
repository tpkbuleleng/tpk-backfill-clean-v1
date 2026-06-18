import { DomainError } from "./DomainError.js";

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function normalizeIsoDate(value) {
  return String(value || "").trim();
}

export function parseIsoLocalDate(value, fieldName = "date") {
  const normalized = normalizeIsoDate(value);

  if (!ISO_DATE_PATTERN.test(normalized)) {
    throw new DomainError(
      "DATE_FORMAT_INVALID",
      `${fieldName} wajib memakai format YYYY-MM-DD.`,
      { fieldName, value }
    );
  }

  const [year, month, day] = normalized.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  const isRealDate =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  if (!isRealDate) {
    throw new DomainError(
      "DATE_VALUE_INVALID",
      `${fieldName} bukan tanggal kalender yang valid.`,
      { fieldName, value }
    );
  }

  return date;
}

export function toIsoDateLocal(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayIsoLocal() {
  return toIsoDateLocal(new Date());
}

export function assertNotFutureDate(value, anchorIsoDate = todayIsoLocal(), fieldName = "date") {
  const date = parseIsoLocalDate(value, fieldName);
  const anchor = parseIsoLocalDate(anchorIsoDate, "anchor_date");

  if (date > anchor) {
    throw new DomainError(
      "DATE_IN_FUTURE",
      `${fieldName} tidak boleh lebih baru dari anchor date.`,
      { fieldName, value, anchorIsoDate }
    );
  }

  return value;
}
