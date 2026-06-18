# 01 — Taxonomy Contract

## Taxonomy Version

`TPK_TAXONOMY_2026_7E_R1`

## Jenis Sasaran Resmi

- CATIN
- BUMIL
- BUFAS
- BALITA

## BADUTA

BADUTA bukan `jenis_sasaran` resmi.

BADUTA adalah derived priority dari BALITA usia 0–23 bulan.

Field resmi:

- `is_baduta_prioritas`
- `kelompok_umur_balita`

Nilai `kelompok_umur_balita`:

- `BADUTA_0_23`
- `BALITA_24_59`

## Rule

```txt
jenis_sasaran = BADUTA → reject BADUTA_LEGACY_NOT_ALLOWED
jenis_sasaran = BALITA + umur 0–23 bulan → is_baduta_prioritas = true
jenis_sasaran = BALITA + umur 24–59 bulan → is_baduta_prioritas = false
jenis_sasaran = CATIN/BUMIL/BUFAS → is_baduta_prioritas = false
```
