# 12 — Provider Hardening Contract

## Paket

CB-5 — Real Sheet Provider Hardening & Multi-Action Write Contract

## Provider Version

```txt
TPK_PROVIDER_2026_CB5
```

## Hardening Version

```txt
TPK_PROVIDER_HARDENING_2026_CB5
```

## Kontrak Hardening

- Semua kolom staging diformat plain text.
- Field tanggal dibaca dan dikembalikan sebagai `YYYY-MM-DD`.
- `created_at` dan `timestamp` tetap ISO datetime.
- Duplicate sasaran menghasilkan `DUPLICATE_SASARAN_UNIQUE_KEY`.
- Duplicate pendampingan menghasilkan `DUPLICATE_PENDAMPINGAN_UNIQUE_KEY`.
- `clearTestRows` membersihkan staging dan mengembalikan header.
- `runSmokeTest` menjalankan uji end-to-end real provider.

## Actions GET

```txt
health
setupSheets
clearTestRows
writeSampleSasaran
writeSamplePendampingan
testDuplicateSasaran
testDuplicatePendampingan
runSmokeTest
snapshot
```

## Actions POST-ready

```txt
writeSasaran
writePendampingan
multiAction
```
