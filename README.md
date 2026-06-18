# TPK Backfill Clean v1

Clean rebuild untuk TPK Backfill berdasarkan kontrak final yang sudah dikunci.

## Status

Paket aktif: **CB-4 — GAS Web App Endpoint & Real Sheet Provider**

Mode uji:

- GitHub Pages static health-check
- Regression test tetap memakai Mock Sheet Provider
- GAS Web App Endpoint dapat diuji dari halaman GitHub Pages setelah URL endpoint ditempel
- Real Sheet Provider menulis ke Google Sheet melalui Apps Script Web App

## GitHub Pages

Gunakan:

- Branch: `main`
- Folder/source: `/root`

Entry point:

- `index.html`

## GAS Web App

File Apps Script utama:

```txt
gas/Code.gs
```

Cara paling aman:

1. Buat Google Sheet baru untuk uji CB-4.
2. Buka `Extensions → Apps Script`.
3. Hapus isi `Code.gs`.
4. Tempel isi file `gas/Code.gs`.
5. Deploy sebagai Web App.
6. Copy Web App URL.
7. Paste URL pada panel CB-4 di GitHub Pages.

## Paket

```txt
CB-0 — Foundation & Contract Freeze
CB-1 — Taxonomy, Age Engine & Domain Model
CB-2 — Shared Validation Layer
CB-3 — Sheet Provider & Staging Writer
CB-4 — GAS Web App Endpoint & Real Sheet Provider
```

