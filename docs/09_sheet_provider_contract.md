# 09 — Sheet Provider & Staging Writer Contract

## Provider Version

`TPK_PROVIDER_2026_CB3`

## Prinsip

Provider tidak menyimpan logika domain dan validasi bisnis.

Urutan wajib:

```txt
raw input
→ Shared Validation Layer
→ domain object
→ provider write
→ staging result
```

## Provider Result

```txt
ok
provider_version
provider_mode
action
table
key
row
error
meta
```

## Staging Tables

```txt
staging_sasaran
staging_pendampingan
staging_audit_log
```

## Duplicate Guard

```txt
sasaran_unique_key wajib unik di staging_sasaran
pendampingan_unique_key wajib unik di staging_pendampingan
```

## Parent Guard

Pendampingan hanya boleh ditulis jika parent `sasaran_unique_key` sudah ada pada staging provider.

## CB-3 Mode

CB-3 memakai:

```txt
MOCK_BROWSER_STAGING
```

GAS Sheet Provider disiapkan sebagai file backend, tetapi belum menjadi jalur uji utama.
