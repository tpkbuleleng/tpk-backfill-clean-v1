# 08 — Shared Validation Layer Contract

## Tujuan

Shared Validation Layer adalah pagar sebelum data masuk:

- Sheet Provider
- CSV Export
- Supabase Import
- Dry Run
- Promote

## Validator

```txt
validateSasaran(raw, options)
validatePendampingan(raw, options)
```

## Prinsip

- Validator tidak throw untuk error data biasa.
- Validator mengembalikan daftar error terstruktur.
- Validator hanya mengisi `domain` jika `ok = true`.
- Validator boleh menangkap DomainError dari domain layer dan mengubahnya menjadi validation error.
- Validator belum melakukan query backend pada CB-2.

## Options

### validateSasaran

```txt
anchorDate
```

### validatePendampingan

```txt
currentDate
parentSasaranKeys
```

## Catatan Scope

Scope masih memakai registry statis CB-2:

```txt
TJK → TIM_TJK_001
```

Registry dinamis dari master reference akan masuk pada paket lanjutan.
