/**
 * Validation result helper untuk Apps Script.
 */

function TPK_createValidationResult_(context) {
  return {
    ok: true,
    validation_version: TPK_APP_CONFIG.validationVersion,
    context: context || {},
    error_count: 0,
    warning_count: 0,
    errors: [],
    warnings: [],
    domain: null,
  };
}

function TPK_addValidationError_(result, code, field, message, details) {
  result.ok = false;
  result.errors.push({
    code: code,
    field: field,
    message: message,
    details: details || {},
  });
  result.error_count = result.errors.length;
  return result;
}

function TPK_addDomainError_(result, error, fallbackField) {
  return TPK_addValidationError_(
    result,
    error.code || 'DOMAIN_ERROR',
    (error.details && error.details.fieldName) || fallbackField || '',
    error.message || 'Domain error tidak dikenal.',
    error.details || {}
  );
}

function TPK_finalizeValidationResult_(result, domain) {
  result.ok = result.errors.length === 0;
  result.error_count = result.errors.length;
  result.warning_count = result.warnings.length;
  result.domain = result.ok ? domain || null : null;
  return result;
}
