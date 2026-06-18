# 00 — Project Lock

## Nama

TPK Backfill Clean v1

## Prinsip

Clean codebase, frozen domain contract.

## Paket aktif

CB-3 — Sheet Provider & Staging Writer

## Batas Paket CB-3

CB-3 menangani:

- Provider interface mock berbasis browser
- Staging writer orchestration
- Write sasaran valid ke staging
- Write pendampingan valid ke staging
- Duplicate guard sasaran
- Duplicate guard pendampingan
- Parent sasaran guard untuk pendampingan
- Audit log mock

CB-3 belum menangani:

- koneksi GitHub Pages ke Apps Script endpoint
- deploy Web App GAS
- baca/tulis Google Sheet sungguhan dari browser
- CSV export
- Supabase import
- Auth/RLS
