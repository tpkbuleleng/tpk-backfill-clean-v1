import { DomainError } from "../domain/DomainError.js";
import { calculateAgeInMonths } from "../domain/AgeService.js";
import {
  assertJenisSasaranValid,
  deriveIsBadutaPrioritas,
  deriveKelompokUmurBalita,
} from "../domain/TaxonomyService.js";
import { buildSasaranDomain } from "../domain/SasaranModel.js";
import { buildPendampinganDomain } from "../domain/PendampinganModel.js";

function test(name, fn) {
  try {
    fn();
    return { name, ok: true };
  } catch (error) {
    console.error(`[FAIL] ${name}`, error);
    return { name, ok: false, error };
  }
}

function expectEqual(actual, expected) {
  if (actual !== expected) {
    throw new Error(`Expected ${expected}, received ${actual}`);
  }
}

function expectThrowsCode(fn, expectedCode) {
  try {
    fn();
  } catch (error) {
    if (error instanceof DomainError && error.code === expectedCode) {
      return;
    }

    if (String(error.code || error.message).includes(expectedCode)) {
      return;
    }

    throw error;
  }

  throw new Error(`Expected error code: ${expectedCode}`);
}

export function runContractTests() {
  return [
    test("BADUTA legacy ditolak sebagai jenis_sasaran", () => {
      expectThrowsCode(
        () => assertJenisSasaranValid("BADUTA"),
        "BADUTA_LEGACY_NOT_ALLOWED"
      );
    }),

    test("Jenis sasaran resmi diterima", () => {
      expectEqual(assertJenisSasaranValid("CATIN"), "CATIN");
      expectEqual(assertJenisSasaranValid("BUMIL"), "BUMIL");
      expectEqual(assertJenisSasaranValid("BUFAS"), "BUFAS");
      expectEqual(assertJenisSasaranValid("BALITA"), "BALITA");
    }),

    test("jenis_sasaran lowercase dinormalisasi", () => {
      expectEqual(assertJenisSasaranValid(" balita "), "BALITA");
    }),

    test("Age engine menghitung 23 bulan tepat", () => {
      expectEqual(calculateAgeInMonths("2024-07-18", "2026-06-18"), 23);
    }),

    test("Age engine menghitung 24 bulan tepat", () => {
      expectEqual(calculateAgeInMonths("2024-06-18", "2026-06-18"), 24);
    }),

    test("Tanggal lahir setelah anchor ditolak", () => {
      expectThrowsCode(
        () => calculateAgeInMonths("2026-06-19", "2026-06-18"),
        "DATE_OF_BIRTH_AFTER_ANCHOR"
      );
    }),

    test("BALITA usia 0–23 bulan menjadi baduta_prioritas", () => {
      expectEqual(
        deriveIsBadutaPrioritas("BALITA", "2024-07-18", "2026-06-18"),
        true
      );
    }),

    test("BALITA usia 24–59 bulan bukan baduta_prioritas", () => {
      expectEqual(
        deriveIsBadutaPrioritas("BALITA", "2024-06-18", "2026-06-18"),
        false
      );
    }),

    test("BALITA usia 60 bulan ditolak sebagai BALITA aktif", () => {
      expectThrowsCode(
        () => deriveIsBadutaPrioritas("BALITA", "2021-06-18", "2026-06-18"),
        "BALITA_AGE_OUT_OF_RANGE"
      );
    }),

    test("BUFAS bukan baduta_prioritas", () => {
      expectEqual(
        deriveIsBadutaPrioritas("BUFAS", "2024-07-18", "2026-06-18"),
        false
      );
    }),

    test("Kelompok umur BALITA 0–23 bulan = BADUTA_0_23", () => {
      expectEqual(
        deriveKelompokUmurBalita("BALITA", "2024-07-18", "2026-06-18"),
        "BADUTA_0_23"
      );
    }),

    test("Kelompok umur BALITA 24–59 bulan = BALITA_24_59", () => {
      expectEqual(
        deriveKelompokUmurBalita("BALITA", "2024-06-18", "2026-06-18"),
        "BALITA_24_59"
      );
    }),

    test("Sasaran domain membentuk sasaran_unique_key dari NIK dan id_tim", () => {
      const domain = buildSasaranDomain({
        id_sasaran: "SAS_TJK_0001",
        id_tim: "tim_tjk_001",
        kode_kecamatan: "tjk",
        jenis_sasaran: "balita",
        nama_sasaran: "Contoh",
        nik: "5108010101999999",
        no_kk: "5108010101888888",
        tanggal_lahir: "2024-07-18",
      }, {
        anchorDate: "2026-06-18",
      });

      expectEqual(domain.sasaran_unique_key, "5108010101999999|TIM_TJK_001");
      expectEqual(domain.jenis_sasaran, "BALITA");
      expectEqual(domain.is_baduta_prioritas, true);
      expectEqual(domain.kelompok_umur_balita, "BADUTA_0_23");
      expectEqual(domain.scope_key, "TJK|TIM_TJK_001");
    }),

    test("Pendampingan memakai tanggal_pendampingan sebagai anchor umur", () => {
      const domain = buildPendampinganDomain({
        sasaran_unique_key: "5108010101999999|TIM_TJK_001",
        id_sasaran: "SAS_TJK_0001",
        id_tim: "TIM_TJK_001",
        kode_kecamatan: "TJK",
        jenis_sasaran: "BALITA",
        tanggal_lahir: "2024-07-01",
        tanggal_pendampingan: "2026-07-01",
        status_pendampingan: "KUNJUNGAN_RUMAH",
      });

      expectEqual(domain.age_months_at_pendampingan, 24);
      expectEqual(domain.is_baduta_prioritas_at_pendampingan, false);
      expectEqual(domain.kelompok_umur_balita_at_pendampingan, "BALITA_24_59");
    }),
  ];
}
