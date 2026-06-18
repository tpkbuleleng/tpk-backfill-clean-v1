# 02 — Data Dictionary Sasaran

## Minimal Field Domain Sasaran CB-2

| Field | Wajib | Keterangan |
|---|---:|---|
| domain_version | Ya | Versi domain model |
| record_type | Ya | `SASARAN` |
| sasaran_unique_key | Ya | Default: `nik|id_tim` |
| id_sasaran | Tidak pada CB-2 | ID internal sasaran |
| id_tim | Ya | ID tim |
| kode_kecamatan | Ya | Kode kecamatan |
| scope_key | Ya | `kode_kecamatan|id_tim` |
| jenis_sasaran | Ya | CATIN/BUMIL/BUFAS/BALITA |
| nama_sasaran | Ya | Nama sasaran |
| nik | Ya | 16 digit |
| no_kk | Ya | 16 digit |
| tanggal_lahir | Ya | Format `YYYY-MM-DD` |
| anchor_date | Ya | Tanggal anchor umur |
| age_months_at_anchor | Derived | Umur bulan pada anchor |
| kelompok_umur_balita | Derived | `BADUTA_0_23`, `BALITA_24_59`, atau kosong |
| is_baduta_prioritas | Derived | Boolean |
| source | Tidak | Sumber pembentukan domain |
