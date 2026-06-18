export const SAMPLE_SASARAN_RAW = Object.freeze({
  sasaran_unique_key: "",
  id_sasaran: "SAS_TJK_0001",
  id_tim: "TIM_TJK_001",
  kode_kecamatan: "TJK",
  jenis_sasaran: "balita",
  nama_sasaran: "CONTOH BALITA 23 BULAN",
  nik: "5108010101999999",
  no_kk: "5108010101888888",
  tanggal_lahir: "2024-07-18",
  tanggal_registrasi: "2026-06-18",
  source: "SAMPLE_CB2",
});

export const SAMPLE_PARENT_REGISTRY = Object.freeze([
  "5108010101999999|TIM_TJK_001",
]);

export const SAMPLE_PENDAMPINGAN_RAW = Object.freeze({
  pendampingan_unique_key: "",
  sasaran_unique_key: "5108010101999999|TIM_TJK_001",
  id_sasaran: "SAS_TJK_0001",
  id_tim: "TIM_TJK_001",
  kode_kecamatan: "TJK",
  jenis_sasaran: "BALITA",
  tanggal_lahir: "2024-06-18",
  tanggal_pendampingan: "2026-06-18",
  status_pendampingan: "KUNJUNGAN_RUMAH",
  source: "SAMPLE_CB2",
});

export const SAMPLE_INVALID_SASARAN_RAW = Object.freeze({
  id_sasaran: "SAS_TJK_BAD",
  id_tim: "TIM_TJK_999",
  kode_kecamatan: "TJK",
  jenis_sasaran: "BADUTA",
  nama_sasaran: "",
  nik: "510801010199999",
  no_kk: "ABC",
  tanggal_lahir: "2026-06-19",
  tanggal_registrasi: "2026-06-18",
  source: "SAMPLE_INVALID_CB2",
});

export const SAMPLE_INVALID_PENDAMPINGAN_RAW = Object.freeze({
  pendampingan_unique_key: "",
  sasaran_unique_key: "5108010101777777|TIM_TJK_001",
  id_sasaran: "SAS_TJK_UNKNOWN",
  id_tim: "TIM_TJK_001",
  kode_kecamatan: "TJK",
  jenis_sasaran: "BALITA",
  tanggal_lahir: "2024-01-01",
  tanggal_pendampingan: "2026-06-19",
  status_pendampingan: "",
  source: "SAMPLE_INVALID_CB2",
});
