# 04 — Validation Contract

Validasi minimum:

- BADUTA ditolak sebagai `jenis_sasaran`
- jenis_sasaran wajib salah satu dari CATIN, BUMIL, BUFAS, BALITA
- NIK wajib 16 digit
- KK wajib 16 digit
- tanggal_lahir tidak boleh masa depan
- tanggal_pendampingan tidak boleh masa depan
- BALITA wajib punya tanggal_lahir valid
- BALITA usia 0–23 bulan adalah baduta_prioritas
- BALITA usia 24–59 bulan bukan baduta_prioritas
