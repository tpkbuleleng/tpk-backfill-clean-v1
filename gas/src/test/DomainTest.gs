/**
 * Smoke test backend GAS untuk CB-1.
 * Jalankan manual di Apps Script pada paket backend berikutnya.
 */

function testCB1DomainSmoke() {
  const sasaran = TPK_buildSasaranDomain_({
    id_sasaran: 'SAS_TJK_0001',
    id_tim: 'tim_tjk_001',
    kode_kecamatan: 'tjk',
    jenis_sasaran: 'balita',
    nama_sasaran: 'Contoh',
    nik: '5108010101999999',
    no_kk: '5108010101888888',
    tanggal_lahir: '2024-07-18',
    tanggal_registrasi: '2026-06-18',
  }, {
    anchorDate: '2026-06-18',
  });

  return {
    ok: true,
    package: 'CB-1',
    sasaran: sasaran,
  };
}
