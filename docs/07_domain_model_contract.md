# 07 — Domain Model Contract

## Tujuan

Domain model bertugas membentuk representasi data yang sudah dinormalisasi secara domain, tetapi belum melakukan validasi bisnis lengkap.

## Prinsip

- Domain model tidak membaca Google Sheet.
- Domain model tidak menulis Google Sheet.
- Domain model tidak memanggil Supabase.
- Domain model tidak bergantung pada UI.
- Domain model hanya menerima object raw dan mengembalikan object domain.
- Domain model boleh melempar DomainError untuk kontrak domain keras, seperti BADUTA legacy atau umur BALITA di luar rentang.

## Sasaran Domain

Input minimal:

```txt
id_sasaran
id_tim
kode_kecamatan
jenis_sasaran
nama_sasaran
nik
no_kk
tanggal_lahir
```

Output tambahan:

```txt
sasaran_unique_key
scope_key
age_months_at_anchor
kelompok_umur_balita
is_baduta_prioritas
```

## Pendampingan Domain

Input minimal:

```txt
sasaran_unique_key
id_sasaran
id_tim
kode_kecamatan
jenis_sasaran
tanggal_lahir
tanggal_pendampingan
status_pendampingan
```

Output tambahan:

```txt
pendampingan_unique_key
scope_key
age_months_at_pendampingan
kelompok_umur_balita_at_pendampingan
is_baduta_prioritas_at_pendampingan
```
