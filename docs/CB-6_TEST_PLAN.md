# CB-6 Test Plan

## Target Tampilan

Pada GitHub Pages harus tersedia panel:

- Endpoint & Mode.
- Scope Export.
- Setup & Sample Data.
- Panel Uji CB-6.
- Output JSON.

Tombol utama:

- Export Sasaran CSV.
- Export Pendampingan CSV.
- Export Manifest.
- Run Export Smoke Test.
- Snapshot Export.
- Regression Test CB-6.

## Urutan Uji Mock

1. Buka GitHub Pages.
2. Pastikan `Mode Mock: ON`.
3. Klik `Regression Test CB-6`.
4. Pastikan `overall = PASS`.
5. Klik `Export Sasaran CSV` dan pastikan file CSV terunduh.
6. Klik `Export Pendampingan CSV` dan pastikan file CSV terunduh.
7. Klik `Export Manifest` dan pastikan file JSON terunduh.

## Urutan Uji Real GAS

1. Buka workbook `BACKFILL_TPK_CLEAN_CB4_TEST`.
2. Buka Apps Script `TPK_BC`.
3. Pasang `gas/Code.gs`.
4. Deploy ulang Web App.
5. Buka GitHub Pages.
6. Paste URL Web App.
7. Klik `Simpan Endpoint`.
8. Klik `Mode Mock` sampai status menjadi OFF.
9. Klik `Health GAS`.
10. Klik `Setup Sheets`.
11. Klik `Clear Test Rows`.
12. Klik `Write Sample Sasaran`.
13. Klik `Write Sample Pendampingan`.
14. Klik `Export Sasaran CSV`.
15. Klik `Export Pendampingan CSV`.
16. Klik `Export Manifest`.
17. Klik `Run Export Smoke Test`.
18. Klik `Snapshot Export`.
19. Klik `Regression Test CB-6`.

## Kriteria PASS

CB-6 dinyatakan PASS jika:

```txt
1. GitHub Pages CB-6 terbuka normal.
2. Regression Test CB-6 = Overall PASS.
3. GAS Web App endpoint CB-6 health ok.
4. Export Sasaran CSV menghasilkan ok = true.
5. Export Pendampingan CSV menghasilkan ok = true.
6. Manifest menghasilkan ok = true.
7. Manifest memuat export_batch_id.
8. Manifest memuat selected_row_count.
9. Manifest memuat selected_record_keys.
10. Manifest memuat checksum.
11. CSV header konsisten.
12. NIK/KK tetap string 16 digit.
13. tanggal tetap YYYY-MM-DD.
14. runExportSmokeTest ok = true / smoke_ok = true.
```

## Catatan Scope

- `ALL`: export seluruh staging.
- `KODE_KECAMATAN`: filter berdasarkan `kode_kecamatan`.
- `ID_TIM`: filter berdasarkan `id_tim`.
- `RECORD_KEYS`: filter berdasarkan `record_key` atau `sasaran_record_key`.
