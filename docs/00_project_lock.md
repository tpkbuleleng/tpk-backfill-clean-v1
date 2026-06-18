# 00 — Project Lock

## Nama

TPK Backfill Clean v1

## Prinsip

Clean codebase, frozen domain contract.

## Tujuan

Membangun ulang codebase dari nol tanpa membawa patch historis, tetapi tetap memakai kontrak domain final yang sudah dikunci.

## Paket aktif

CB-1 — Taxonomy, Age Engine & Domain Model

## Batas Paket CB-1

CB-1 hanya menangani:

- taxonomy
- age engine
- sasaran domain model
- pendampingan domain model
- scope domain model
- regression test berbasis browser

CB-1 belum menangani:

- validasi NIK/KK final
- Sheet Provider
- CSV export
- Supabase import
- Auth/RLS
- UI form produksi
