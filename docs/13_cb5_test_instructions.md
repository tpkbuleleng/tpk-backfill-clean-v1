# 13 — CB-5 Test Instructions

## Langkah Uji

1. Upload ZIP CB-5 ke GitHub repo.
2. Ganti isi Apps Script `TPK_BC` dengan `gas/Code.gs` dari ZIP CB-5.
3. Deploy Web App versi baru.
4. Buka GitHub Pages CB-5.
5. Tempel URL Web App `/exec`.
6. Klik:
   - Save URL
   - Health
   - Setup Sheets
   - Clear Test Rows
   - Write Sample Sasaran
   - Write Sample Pendampingan
   - Snapshot

## Uji Duplicate

Setelah sample ditulis:

- Klik `Test Duplicate Sasaran`
- Klik `Test Duplicate Pendampingan`

Expected:

```txt
duplicate_guard_ok = true
DUPLICATE_SASARAN_UNIQUE_KEY
DUPLICATE_PENDAMPINGAN_UNIQUE_KEY
```

## Uji Smoke

Klik:

```txt
Run GAS Smoke
```

Expected:

```txt
ok = true
snapshot.sasaran_count >= 1
snapshot.pendampingan_count >= 1
```
