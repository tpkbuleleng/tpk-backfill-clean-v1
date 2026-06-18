# 10 — GAS Web App Endpoint Contract

## Paket

CB-4 — GAS Web App Endpoint & Real Sheet Provider

## Endpoint Mode

```txt
JSONP_GET_BRIDGE
```

Mode ini dipakai agar halaman GitHub Pages dapat membaca respons Apps Script Web App langsung dari browser.

## Actions GET

```txt
?action=health
?action=setupSheets
?action=writeSampleSasaran
?action=writeSamplePendampingan
?action=snapshot
?action=clearTestRows
```

Untuk GitHub Pages, parameter `callback` otomatis ditambahkan.

## doPost

`doPost` disiapkan untuk pemakaian lanjutan, tetapi uji CB-4 dari GitHub Pages memakai JSONP GET bridge.

## Real Sheet Provider

Real Sheet Provider menulis ke:

```txt
staging_sasaran
staging_pendampingan
staging_audit_log
meta_cb4
```

## Batas CB-4

CB-4 belum menjadi autentikasi produksi. Endpoint Web App dipakai untuk uji integrasi real sheet provider.
