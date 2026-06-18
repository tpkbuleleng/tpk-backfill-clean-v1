# 03 — Data Dictionary Pendampingan

## Minimal Field Domain Pendampingan CB-2

| Field | Wajib | Keterangan |
|---|---:|---|
| domain_version | Ya | Versi domain model |
| record_type | Ya | `PENDAMPINGAN` |
| pendampingan_unique_key | Ya | Default: `sasaran_unique_key|tanggal_pendampingan` |
| sasaran_unique_key | Ya | Parent sasaran |
| id_sasaran | Ya | ID sasaran |
| id_tim | Ya | ID tim |
| kode_kecamatan | Ya | Kode kecamatan |
| scope_key | Ya | `kode_kecamatan|id_tim` |
| tanggal_pendampingan | Ya | Anchor umur pendampingan |
| jenis_sasaran | Ya | CATIN/BUMIL/BUFAS/BALITA |
| tanggal_lahir | Ya | Dibutuhkan untuk derived priority |
| age_months_at_pendampingan | Derived | Umur bulan pada tanggal pendampingan |
| kelompok_umur_balita_at_pendampingan | Derived | Kelompok umur saat pendampingan |
| is_baduta_prioritas_at_pendampingan | Derived | Derived priority saat pendampingan |
| status_pendampingan | Ya | Status/metode pendampingan |
| source | Tidak | Sumber pembentukan domain |
