import { DomainError } from "./DomainError.js";
import { parseIsoLocalDate } from "./DateService.js";

export function calculateAgeInMonths(dateOfBirthIso, anchorDateIso) {
  const dob = parseIsoLocalDate(dateOfBirthIso, "tanggal_lahir");
  const anchor = parseIsoLocalDate(anchorDateIso, "anchor_date");

  if (dob > anchor) {
    throw new DomainError(
      "DATE_OF_BIRTH_AFTER_ANCHOR",
      "Tanggal lahir tidak boleh lebih baru dari anchor date.",
      { dateOfBirthIso, anchorDateIso }
    );
  }

  let months = (anchor.getFullYear() - dob.getFullYear()) * 12;
  months += anchor.getMonth() - dob.getMonth();

  if (anchor.getDate() < dob.getDate()) {
    months -= 1;
  }

  return months;
}

export function calculateAgeInYears(dateOfBirthIso, anchorDateIso) {
  return Math.floor(calculateAgeInMonths(dateOfBirthIso, anchorDateIso) / 12);
}
