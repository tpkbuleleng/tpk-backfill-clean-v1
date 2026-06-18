# 00 — Project Lock

## Nama

TPK Backfill Clean v1

## Paket aktif

CB-5 — Real Sheet Provider Hardening & Multi-Action Write Contract

## Status Paket Sebelumnya

```txt
CB-0 PASS
CB-1 PASS
CB-2 PASS
CB-3 PASS
CB-4 PASS
```

## Batas CB-5

CB-5 menangani:

- hardening real sheet provider
- normalisasi tanggal read/write sebagai `YYYY-MM-DD`
- clear test rows dari UI
- duplicate guard yang dapat diuji dari endpoint
- multi-action smoke test
- snapshot lebih bersih
- audit log lebih terstruktur
- provider error contract lebih konsisten

CB-5 belum menangani:

- autentikasi produksi
- routing 9 workbook kecamatan
- CSV export
- Supabase import
- RLS/Auth Supabase
```
