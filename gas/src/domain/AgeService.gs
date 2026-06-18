/**
 * Age engine untuk Apps Script.
 */

function TPK_calculateAgeInMonths_(dateOfBirthIso, anchorDateIso) {
  const dob = TPK_parseIsoLocalDate_(dateOfBirthIso, 'tanggal_lahir');
  const anchor = TPK_parseIsoLocalDate_(anchorDateIso, 'anchor_date');

  if (dob > anchor) {
    throw TPK_DomainError_('DATE_OF_BIRTH_AFTER_ANCHOR', 'Tanggal lahir tidak boleh lebih baru dari anchor date.', {
      dateOfBirthIso: dateOfBirthIso,
      anchorDateIso: anchorDateIso,
    });
  }

  let months = (anchor.getFullYear() - dob.getFullYear()) * 12;
  months += anchor.getMonth() - dob.getMonth();

  if (anchor.getDate() < dob.getDate()) {
    months -= 1;
  }

  return months;
}
