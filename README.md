# TPK Backfill Clean v1

Clean rebuild untuk TPK Backfill berdasarkan kontrak final yang sudah dikunci.

## Status

Paket aktif: **CB-3 — Sheet Provider & Staging Writer**

Mode uji:

- GitHub Pages static provider health-check
- Domain model test berbasis browser
- Shared validation test berbasis browser
- Mock Sheet Provider test berbasis browser
- Backend GAS disiapkan, tetapi belum dihubungkan ke GitHub Pages

## GitHub Pages

Gunakan:

- Branch: `main`
- Folder/source: `/root`

Entry point:

- `index.html`

## Kontrak Utama

- Data masuk staging hanya setelah lulus Shared Validation Layer.
- Provider tidak menyimpan logika taxonomy.
- Provider tidak menyimpan logika validasi bisnis.
- Staging Writer bertugas orkestrasi: validate → provider write → result.
- Duplicate `sasaran_unique_key` ditolak.
- Pendampingan wajib punya parent sasaran di staging.
- CB-3 menggunakan Mock Sheet Provider untuk uji online.
- GAS Sheet Provider disiapkan untuk paket backend berikutnya.

## Paket

```txt
CB-0 — Foundation & Contract Freeze
CB-1 — Taxonomy, Age Engine & Domain Model
CB-2 — Shared Validation Layer
CB-3 — Sheet Provider & Staging Writer
```
