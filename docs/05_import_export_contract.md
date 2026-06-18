# 05 — Import Export Contract

Alur target:

CSV Export → Raw/Staging → Validation → Dry Run → Promote

Export wajib membawa:

- export_batch_id
- selected_row_count
- selected_record_keys
- checksum_sha256
- taxonomy_version
- validation_version

Catatan CB-2:

Import/export belum diimplementasikan. Shared Validation Layer sudah siap menjadi pagar sebelum export/import.
