/**
 * Error domain sederhana untuk Apps Script.
 */
function TPK_DomainError_(code, message, details) {
  const error = new Error(message || code);
  error.name = 'DomainError';
  error.code = code;
  error.details = details || {};
  return error;
}
