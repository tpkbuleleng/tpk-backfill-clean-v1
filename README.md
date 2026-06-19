# TPK Backfill Clean v1

Clean rebuild untuk TPK Backfill berdasarkan kontrak final yang sudah dikunci.

## Status

Paket aktif: **CB-5 — Real Sheet Provider Hardening & Multi-Action Write Contract**

Mode uji:

- GitHub Pages static health-check
- Regression test tetap memakai Mock Sheet Provider
- GAS Web App Endpoint untuk uji real Google Sheet
- Real Sheet Provider sudah diperkuat untuk normalisasi tanggal, clear test rows, duplicate guard, multi-action smoke test, snapshot bersih, dan audit log terstruktur.

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

Untuk CB-5, Apps Script `TPK_BC` perlu diganti dengan isi `gas/Code.gs` dari paket ini, lalu deploy versi Web App baru.

## Paket

```txt
CB-0 — Foundation & Contract Freeze
CB-1 — Taxonomy, Age Engine & Domain Model
CB-2 — Shared Validation Layer
CB-3 — Sheet Provider & Staging Writer
CB-4 — GAS Web App Endpoint & Real Sheet Provider
CB-5 — Real Sheet Provider Hardening & Multi-Action Write Contract
```
