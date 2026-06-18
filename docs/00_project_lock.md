# 00 — Project Lock

## Nama

TPK Backfill Clean v1

## Prinsip

Clean codebase, frozen domain contract.

## Paket aktif

CB-2 — Shared Validation Layer

## Batas Paket CB-2

CB-2 menangani:

- validasi NIK 16 digit
- validasi KK 16 digit
- validasi tanggal tidak masa depan
- validasi taxonomy
- validasi scope statis sementara
- validasi parent sasaran untuk pendampingan
- output error terstruktur

CB-2 belum menangani:

- baca/tulis Google Sheet
- CSV export
- Supabase import
- Auth/RLS
- UI form produksi
- registry scope penuh dari master_tim/master_wilayah

## Keputusan

Scope registry pada CB-2 masih statis untuk test:

```txt
TJK → TIM_TJK_001
```

Registry penuh akan masuk pada paket provider/master reference berikutnya.
