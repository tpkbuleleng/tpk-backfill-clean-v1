# TPK Backfill Clean v1

Clean rebuild untuk TPK Backfill berdasarkan kontrak final yang sudah dikunci.

## Status

Paket aktif: **CB-1 — Taxonomy, Age Engine & Domain Model**

Mode uji awal:

- GitHub Pages static health-check
- Domain model test berbasis browser
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
- BALITA usia 24–59 bulan bukan baduta_prioritas.
- Pendampingan menggunakan `tanggal_pendampingan` sebagai anchor umur.
- Domain model tidak membaca/menulis backend.
- Provider Sheet/Supabase akan dibangun pada paket berikutnya.

## Struktur

```txt
docs/
web/
gas/
```

## Paket


```txt
CB-0 — Foundation & Contract Freeze
CB-1 — Taxonomy, Age Engine & Domain Model
```
