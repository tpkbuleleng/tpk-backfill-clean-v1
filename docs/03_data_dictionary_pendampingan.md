# 03 — Data Dictionary Pendampingan

## Minimal Field Domain Pendampingan CB-1

| Field | Keterangan |
|---|---|
| domain_version | Versi domain model |
| record_type | `PENDAMPINGAN` |
| pendampingan_unique_key | Default: `sasaran_unique_key|tanggal_pendampingan` |
| sasaran_unique_key | Parent sasaran |
| id_sasaran | ID sasaran |
| id_tim | ID tim |
| kode_kecamatan | Kode kecamatan |
| scope_key | `kode_kecamatan|id_tim` |
| tanggal_pendampingan | Anchor umur pendampingan |
| jenis_sasaran | CATIN/BUMIL/BUFAS/BALITA |
| age_months_at_pendampingan | Umur bulan pada tanggal pendampingan |
| kelompok_umur_balita_at_pendampingan | Kelompok umur balita saat pendampingan |
| is_baduta_prioritas_at_pendampingan | Derived priority saat pendampingan |
| status_pendampingan | Status/metode pendampingan |
| source | Sumber pembentukan domain |
