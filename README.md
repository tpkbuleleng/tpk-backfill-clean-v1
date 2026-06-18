# TPK Backfill Clean v1

Clean rebuild untuk TPK Backfill berdasarkan kontrak final yang sudah dikunci.

## Status

Paket aktif: **CB-2 — Shared Validation Layer**

Mode uji:

- GitHub Pages static validation health-check
- Domain model test berbasis browser
- Shared validation test berbasis browser
- Backend aktif: belum dihubungkan, masih `CONTRACT_CHECK`

## GitHub Pages

Gunakan:

- Branch: `main`
- Folder/source: `/root`

Entry point:

- `index.html`

## Kontrak Utama

- BADUTA bukan `jenis_sasaran` resmi.
- BALITA adalah `jenis_sasaran` resmi.
- BADUTA adalah derived priority untuk BALITA usia 0–23 bulan.
- NIK wajib 16 digit.
- KK wajib 16 digit.
- tanggal_lahir tidak boleh masa depan terhadap anchor validasi.
- tanggal_pendampingan tidak boleh masa depan terhadap tanggal sistem validasi.
- Scope wajib valid.
- Pendampingan wajib punya parent sasaran.
- Validator menghasilkan error terstruktur, bukan sekadar throw mentah.

## Paket

```txt
CB-0 — Foundation & Contract Freeze
CB-1 — Taxonomy, Age Engine & Domain Model
CB-2 — Shared Validation Layer
```
