# 07 — Domain Model Contract

## Tujuan

Domain model bertugas membentuk representasi data yang sudah dinormalisasi secara domain.

## Prinsip

- Domain model tidak membaca Google Sheet.
- Domain model tidak menulis Google Sheet.
- Domain model tidak memanggil Supabase.
- Domain model tidak bergantung pada UI.
- Domain model hanya menerima object raw dan mengembalikan object domain.
- Domain model boleh melempar DomainError untuk kontrak domain keras.

## Sasaran Domain

Output tambahan:

```txt
sasaran_unique_key
scope_key
age_months_at_anchor
kelompok_umur_balita
is_baduta_prioritas
```

## Pendampingan Domain

Output tambahan:

```txt
pendampingan_unique_key
scope_key
age_months_at_pendampingan
kelompok_umur_balita_at_pendampingan
is_baduta_prioritas_at_pendampingan
```
