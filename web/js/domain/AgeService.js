export function calculateAgeInMonths(dateOfBirthIso, anchorDateIso) {
  if (!dateOfBirthIso || !anchorDateIso) {
    throw new Error("Tanggal lahir dan anchor date wajib diisi.");
  }

  const dob = new Date(`${dateOfBirthIso}T00:00:00`);
  const anchor = new Date(`${anchorDateIso}T00:00:00`);

  if (Number.isNaN(dob.getTime()) || Number.isNaN(anchor.getTime())) {
    throw new Error("Format tanggal tidak valid. Gunakan YYYY-MM-DD.");
  }

  if (dob > anchor) {
    throw new Error("Tanggal lahir tidak boleh lebih baru dari anchor date.");
  }

  let months = (anchor.getFullYear() - dob.getFullYear()) * 12;
  months += anchor.getMonth() - dob.getMonth();

  if (anchor.getDate() < dob.getDate()) {
    months -= 1;
  }

  return months;
}
