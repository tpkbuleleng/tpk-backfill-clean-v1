/**
 * Taxonomy service untuk Apps Script.
 */

function TPK_normalizeText_(value) {
  return String(value || '').trim();
}

function TPK_normalizeUpperCode_(value) {
  return TPK_normalizeText_(value).toUpperCase();
}

function TPK_normalizeJenisSasaran_(value) {
  return TPK_normalizeUpperCode_(value);
}

function TPK_isJenisSasaranValid_(value) {
  const normalized = TPK_normalizeJenisSasaran_(value);
  return TPK_TAXONOMY_CONFIG.officialJenisSasaran.indexOf(normalized) >= 0;
}

function TPK_assertJenisSasaranValid_(value) {
  const normalized = TPK_normalizeJenisSasaran_(value);

  if (!normalized) {
    throw TPK_DomainError_('JENIS_SASARAN_REQUIRED', 'jenis_sasaran wajib diisi.', { value: value });
  }

  if (normalized === 'BADUTA') {
    throw TPK_DomainError_(
      'BADUTA_LEGACY_NOT_ALLOWED',
      'BADUTA tidak boleh menjadi jenis_sasaran. Gunakan BALITA dan turunkan baduta_prioritas dari umur.',
      { value: value }
    );
  }

  if (!TPK_isJenisSasaranValid_(normalized)) {
    throw TPK_DomainError_('JENIS_SASARAN_INVALID', 'jenis_sasaran tidak valid: ' + value, {
      value: value,
      allowedValues: TPK_TAXONOMY_CONFIG.officialJenisSasaran,
    });
  }

  return normalized;
}

function TPK_assertBalitaAgeInRange_(ageMonths) {
  if (
    ageMonths < TPK_TAXONOMY_CONFIG.balitaMinAgeMonths ||
    ageMonths > TPK_TAXONOMY_CONFIG.balitaMaxAgeMonths
  ) {
    throw TPK_DomainError_(
      'BALITA_AGE_OUT_OF_RANGE',
      'Umur BALITA harus 0–59 bulan.',
      { ageMonths: ageMonths }
    );
  }

  return ageMonths;
}

function TPK_deriveIsBadutaPrioritas_(jenisSasaran, dateOfBirthIso, anchorDateIso) {
  const normalized = TPK_assertJenisSasaranValid_(jenisSasaran);

  if (normalized !== 'BALITA') {
    return false;
  }

  const ageMonths = TPK_calculateAgeInMonths_(dateOfBirthIso, anchorDateIso);
  TPK_assertBalitaAgeInRange_(ageMonths);

  return (
    ageMonths >= TPK_TAXONOMY_CONFIG.badutaPriorityMinAgeMonths &&
    ageMonths <= TPK_TAXONOMY_CONFIG.badutaPriorityMaxAgeMonths
  );
}

function TPK_deriveKelompokUmurBalita_(jenisSasaran, dateOfBirthIso, anchorDateIso) {
  const normalized = TPK_assertJenisSasaranValid_(jenisSasaran);

  if (normalized !== 'BALITA') {
    return '';
  }

  const ageMonths = TPK_calculateAgeInMonths_(dateOfBirthIso, anchorDateIso);
  TPK_assertBalitaAgeInRange_(ageMonths);

  if (
    ageMonths >= TPK_TAXONOMY_CONFIG.badutaPriorityMinAgeMonths &&
    ageMonths <= TPK_TAXONOMY_CONFIG.badutaPriorityMaxAgeMonths
  ) {
    return TPK_TAXONOMY_CONFIG.kelompokUmurBalita.BADUTA_0_23;
  }

  return TPK_TAXONOMY_CONFIG.kelompokUmurBalita.BALITA_24_59;
}
