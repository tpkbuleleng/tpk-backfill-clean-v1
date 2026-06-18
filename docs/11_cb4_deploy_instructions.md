# 11 — CB-5 Deploy Instructions

## 1. Buat Google Sheet

Nama yang disarankan:

```txt
BACKFILL_TPK_CLEAN_CB4_TEST
```

## 2. Buka Apps Script

Dari Google Sheet:

```txt
Extensions → Apps Script
```

## 3. Pasang Code.gs

- Hapus isi `Code.gs`
- Tempel isi file `gas/Code.gs`
- Save

## 4. Deploy Web App

```txt
Deploy → New deployment → Web app
```

Setting:

```txt
Execute as: Me
Who has access: Anyone with the link
```

## 5. Copy URL

Copy URL yang berakhiran:

```txt
/exec
```

## 6. Uji dari GitHub Pages

Pada halaman CB-5:

1. Tempel Web App URL
2. Klik `Simpan URL`
3. Klik `Health`
4. Klik `Setup Sheets`
5. Klik `Write Sample Sasaran`
6. Klik `Write Sample Pendampingan`
7. Klik `Snapshot`

## Expected Result

```txt
health.ok = true
setupSheets.ok = true
writeSampleSasaran.ok = true
writeSamplePendampingan.ok = true
snapshot.sasaran_count >= 1
snapshot.pendampingan_count >= 1
```

Jika duplicate terjadi, jalankan:

```txt
?action=clearTestRows
```

atau klik endpoint manual di browser dengan action tersebut.
