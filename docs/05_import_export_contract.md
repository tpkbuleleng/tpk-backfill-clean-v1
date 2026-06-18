# 05 — Import Export Contract

Alur target:

CSV Export → Raw/Staging → Validation → Dry Run → Promote

Export wajib membawa:

- export_batch_id
- selected_row_count
- selected_record_keys
- checksum_sha256
- taxonomy_version

Catatan CB-1:

Import/export belum diimplementasikan. Kontrak ini dipertahankan sebagai pagar untuk paket CB-4.
