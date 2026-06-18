import { assertNotFutureDate, parseIsoLocalDate } from "../domain/DateService.js";
import { addDomainError } from "./ValidationResult.js";

export function validateIsoDate(result, raw, field, label = field) {
  try {
    parseIsoLocalDate(raw?.[field], label);
  } catch (error) {
    addDomainError(result, error, field);
  }

  return result;
}

export function validateNotFutureDate(result, raw, field, anchorDate, label = field) {
  try {
    assertNotFutureDate(raw?.[field], anchorDate, label);
  } catch (error) {
    addDomainError(result, error, field);
  }

  return result;
}
