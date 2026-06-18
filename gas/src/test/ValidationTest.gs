/**
 * Smoke test backend GAS untuk CB-2.
 * Jalankan manual di Apps Script pada paket backend berikutnya.
 */

function testCB2ValidationSmoke() {
  const sasaran = TPK_validateSasaran_({
    id_sasaran: 'SAS_TJK_0001',
    id_tim: 'TIM_TJK_001',
    kode_kecamatan: 'TJK',
    jenis_sasaran: 'balita',
    nama_sasaran: 'Contoh',
    nik: '5108010101999999',
    no_kk: '5108010101888888',
    tanggal_lahir: '2024-07-18',
    tanggal_registrasi: '2026-06-18',
  }, {
    anchorDate: '2026-06-18',
  });

  const pendampingan = TPK_validatePendampingan_({
    sasaran_unique_key: '5108010101999999|TIM_TJK_001',
    id_sasaran: 'SAS_TJK_0001',
    id_tim: 'TIM_TJK_001',
    kode_kecamatan: 'TJK',
    jenis_sasaran: 'BALITA',
    tanggal_lahir: '2024-06-18',
    tanggal_pendampingan: '2026-06-18',
    status_pendampingan: 'KUNJUNGAN_RUMAH',
  }, {
    currentDate: '2026-06-18',
    parentSasaranKeys: ['5108010101999999|TIM_TJK_001'],
  });

  return {
    ok: sasaran.ok && pendampingan.ok,
    package: 'CB-2',
    sasaran: sasaran,
    pendampingan: pendampingan,
  };
}
