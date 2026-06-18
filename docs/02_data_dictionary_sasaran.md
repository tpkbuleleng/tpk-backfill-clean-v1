# 02 — Data Dictionary Sasaran

## Minimal Field Domain Sasaran CB-1

| Field | Keterangan |
|---|---|
| domain_version | Versi domain model |
| record_type | `SASARAN` |
| sasaran_unique_key | Default: `nik|id_tim` |
| id_sasaran | ID internal sasaran |
| id_tim | ID tim |
| kode_kecamatan | Kode kecamatan |
| scope_key | `kode_kecamatan|id_tim` |
| jenis_sasaran | CATIN/BUMIL/BUFAS/BALITA |
| nama_sasaran | Nama sasaran |
| nik | NIK sasaran |
| no_kk | Nomor KK |
| tanggal_lahir | Format `YYYY-MM-DD` |
| anchor_date | Tanggal anchor umur |
| age_months_at_anchor | Umur bulan pada anchor |
| kelompok_umur_balita | `BADUTA_0_23`, `BALITA_24_59`, atau kosong |
| is_baduta_prioritas | Boolean |
| source | Sumber pembentukan domain |
