# 04 — Validation Contract

## Validation Version

`TPK_VALIDATION_2026_CB2`

## Output Validator

Semua validator wajib mengembalikan object:

```txt
ok
validation_version
context
error_count
warning_count
errors[]
warnings[]
domain
```

Struktur error:

```txt
code
field
message
details
```

## Validasi Sasaran

- `id_tim` wajib
- `kode_kecamatan` wajib
- `jenis_sasaran` wajib
- `nama_sasaran` wajib
- `nik` wajib 16 digit angka
- `no_kk` wajib 16 digit angka
- `tanggal_lahir` wajib format `YYYY-MM-DD`
- `tanggal_lahir` tidak boleh lebih baru dari anchor date
- `jenis_sasaran = BADUTA` wajib ditolak
- `jenis_sasaran` wajib CATIN/BUMIL/BUFAS/BALITA
- `scope` wajib valid

## Validasi Pendampingan

- `sasaran_unique_key` wajib
- parent sasaran wajib ditemukan
- `id_sasaran` wajib
- `id_tim` wajib
- `kode_kecamatan` wajib
- `jenis_sasaran` wajib valid
- `tanggal_lahir` wajib valid
- `tanggal_pendampingan` wajib valid
- `tanggal_pendampingan` tidak boleh masa depan
- `status_pendampingan` wajib
- `scope` wajib valid

## Error Code Utama

```txt
FIELD_REQUIRED
NIK_REQUIRED
NIK_16_DIGIT_REQUIRED
KK_REQUIRED
KK_16_DIGIT_REQUIRED
DATE_FORMAT_INVALID
DATE_VALUE_INVALID
DATE_IN_FUTURE
JENIS_SASARAN_REQUIRED
JENIS_SASARAN_INVALID
BADUTA_LEGACY_NOT_ALLOWED
BALITA_AGE_OUT_OF_RANGE
KODE_KECAMATAN_REQUIRED
KODE_KECAMATAN_INVALID
ID_TIM_REQUIRED
SCOPE_TIM_NOT_REGISTERED
PARENT_SASARAN_KEY_REQUIRED
PARENT_SASARAN_NOT_FOUND
```
