# Paket CB-6 — Selective Export CSV & Manifest Builder

## Ringkasan

Paket ini menambahkan mekanisme export selektif dari staging Google Sheet ke CSV dan manifest JSON.

Fokus CB-6:

- Export CSV dari `staging_sasaran`.
- Export CSV dari `staging_pendampingan`.
- Export scope: `ALL`, `KODE_KECAMATAN`, `ID_TIM`, `RECORD_KEYS`.
- Manifest JSON berisi batch ID, versi paket, versi provider, taxonomy, validation, hardening, source workbook, source sheets, selected row count, selected record keys, generated_at, checksum, dan metadata file CSV.
- CSV stabil untuk pipeline import Supabase berikutnya.
- Panel uji GitHub Pages tetap dapat berjalan dalam mode mock tanpa backend.

## Struktur File

```txt
index.html
web/app.css
web/app.js
web/cb6-contract.js
web/gas-provider.js
web/mock-provider.js
gas/Code.gs
docs/CB-6_README.md
docs/CB-6_TEST_PLAN.md
```

## Cara Pasang Frontend

1. Extract ZIP.
2. Copy seluruh isi folder paket ke repo `tpk-backfill-clean-v1`.
3. Commit dan push ke GitHub.
4. Buka GitHub Pages.
5. Jalankan `Regression Test CB-6` dalam Mode Mock: ON.

## Cara Pasang Apps Script

1. Buka project Apps Script `TPK_BC`.
2. Hapus isi file lama atau ganti dengan isi `gas/Code.gs` dari paket ini.
3. Save.
4. Deploy ulang sebagai Web App.
5. Gunakan URL deployment terbaru pada panel GitHub Pages.
6. Matikan Mode Mock: OFF.
7. Jalankan Health GAS dan uji real export.

## Catatan Operasional

CB-6 tidak membuat import Supabase. Output CB-6 hanya CSV + manifest JSON + checksum. Tahap Supabase import dilanjutkan setelah CB-6 stabil.
