# 06 — Regression Test Contract

Test wajib CB-3:

- Semua test CB-1
- Semua test CB-2
- MockSheetProvider health OK
- StagingWriter menulis sasaran valid ke staging
- StagingWriter menolak sasaran invalid sebelum provider write
- MockSheetProvider menolak duplicate sasaran_unique_key
- StagingWriter menulis pendampingan setelah parent sasaran ada
- StagingWriter menolak pendampingan jika parent belum ada
- MockSheetProvider menolak duplicate pendampingan_unique_key
