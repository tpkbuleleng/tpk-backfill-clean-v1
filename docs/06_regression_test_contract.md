# 06 — Regression Test Contract

Test wajib CB-2:

- BADUTA_LEGACY_NOT_ALLOWED
- jenis sasaran resmi diterima
- jenis_sasaran lowercase dinormalisasi
- age engine menghitung 23 bulan
- age engine menghitung 24 bulan
- tanggal_lahir setelah anchor ditolak
- BALITA usia 0–23 bulan → baduta_prioritas true
- BALITA usia 24–59 bulan → baduta_prioritas false
- BALITA usia 60 bulan ditolak sebagai BALITA aktif
- BUFAS bukan baduta_prioritas
- kelompok umur BALITA 0–23 bulan = BADUTA_0_23
- kelompok umur BALITA 24–59 bulan = BALITA_24_59
- sasaran domain membentuk sasaran_unique_key dari NIK dan id_tim
- pendampingan memakai tanggal_pendampingan sebagai anchor umur
- validator sasaran valid menghasilkan OK dan domain
- validator sasaran menolak NIK tidak 16 digit
- validator sasaran menolak KK tidak 16 digit
- validator sasaran menolak tanggal_lahir masa depan
- validator sasaran menolak BADUTA legacy
- validator sasaran menolak scope tim tidak terdaftar
- validator pendampingan valid menghasilkan OK dan domain
- validator pendampingan menolak parent sasaran tidak ditemukan
- validator pendampingan menolak tanggal_pendampingan masa depan
- validator mengembalikan error terstruktur
