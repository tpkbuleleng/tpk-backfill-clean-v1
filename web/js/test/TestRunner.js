import { DomainError } from "../domain/DomainError.js";
import { calculateAgeInMonths } from "../domain/AgeService.js";
import {
  assertJenisSasaranValid,
  deriveIsBadutaPrioritas,
  deriveKelompokUmurBalita,
} from "../domain/TaxonomyService.js";
import { buildSasaranDomain } from "../domain/SasaranModel.js";
import { buildPendampinganDomain } from "../domain/PendampinganModel.js";
import { validateSasaran } from "../validation/SasaranValidator.js";
import { validatePendampingan } from "../validation/PendampinganValidator.js";
import {
  SAMPLE_SASARAN_RAW,
  SAMPLE_PENDAMPINGAN_RAW,
  SAMPLE_PARENT_REGISTRY,
} from "../sample/SampleData.js";

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

function expectTrue(value) {
  if (value !== true) {
    throw new Error(`Expected true, received ${value}`);
  }
}

function expectFalse(value) {
  if (value !== false) {
    throw new Error(`Expected false, received ${value}`);
  }
}

function expectErrorCode(validationResult, code) {
  const found = validationResult.errors.some((error) => error.code === code);

  if (!found) {
    throw new Error(`Expected validation error code: ${code}`);
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
      expectTrue(
        deriveIsBadutaPrioritas("BALITA", "2024-07-18", "2026-06-18")
      );
    }),

    test("BALITA usia 24–59 bulan bukan baduta_prioritas", () => {
      expectFalse(
        deriveIsBadutaPrioritas("BALITA", "2024-06-18", "2026-06-18")
      );
    }),

    test("BALITA usia 60 bulan ditolak sebagai BALITA aktif", () => {
      expectThrowsCode(
        () => deriveIsBadutaPrioritas("BALITA", "2021-06-18", "2026-06-18"),
        "BALITA_AGE_OUT_OF_RANGE"
      );
    }),

    test("BUFAS bukan baduta_prioritas", () => {
      expectFalse(
        deriveIsBadutaPrioritas("BUFAS", "2024-07-18", "2026-06-18")
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
      expectTrue(domain.is_baduta_prioritas);
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
        tanggal_lahir: "2024-06-18",
        tanggal_pendampingan: "2026-06-18",
        status_pendampingan: "KUNJUNGAN_RUMAH",
      });

      expectEqual(domain.age_months_at_pendampingan, 24);
      expectFalse(domain.is_baduta_prioritas_at_pendampingan);
      expectEqual(domain.kelompok_umur_balita_at_pendampingan, "BALITA_24_59");
    }),

    test("Validator sasaran valid menghasilkan OK dan domain", () => {
      const result = validateSasaran(SAMPLE_SASARAN_RAW, {
        anchorDate: "2026-06-18",
      });

      expectTrue(result.ok);
      expectEqual(result.error_count, 0);
      expectEqual(result.domain.sasaran_unique_key, "5108010101999999|TIM_TJK_001");
    }),

    test("Validator sasaran menolak NIK tidak 16 digit", () => {
      const result = validateSasaran({
        ...SAMPLE_SASARAN_RAW,
        nik: "12345",
      }, {
        anchorDate: "2026-06-18",
      });

      expectFalse(result.ok);
      expectErrorCode(result, "NIK_16_DIGIT_REQUIRED");
    }),

    test("Validator sasaran menolak KK tidak 16 digit", () => {
      const result = validateSasaran({
        ...SAMPLE_SASARAN_RAW,
        no_kk: "12345",
      }, {
        anchorDate: "2026-06-18",
      });

      expectFalse(result.ok);
      expectErrorCode(result, "KK_16_DIGIT_REQUIRED");
    }),

    test("Validator sasaran menolak tanggal_lahir masa depan", () => {
      const result = validateSasaran({
        ...SAMPLE_SASARAN_RAW,
        tanggal_lahir: "2026-06-19",
      }, {
        anchorDate: "2026-06-18",
      });

      expectFalse(result.ok);
      expectErrorCode(result, "DATE_IN_FUTURE");
    }),

    test("Validator sasaran menolak BADUTA legacy", () => {
      const result = validateSasaran({
        ...SAMPLE_SASARAN_RAW,
        jenis_sasaran: "BADUTA",
      }, {
        anchorDate: "2026-06-18",
      });

      expectFalse(result.ok);
      expectErrorCode(result, "BADUTA_LEGACY_NOT_ALLOWED");
    }),

    test("Validator sasaran menolak scope tim tidak terdaftar", () => {
      const result = validateSasaran({
        ...SAMPLE_SASARAN_RAW,
        id_tim: "TIM_TJK_999",
      }, {
        anchorDate: "2026-06-18",
      });

      expectFalse(result.ok);
      expectErrorCode(result, "SCOPE_TIM_NOT_REGISTERED");
    }),

    test("Validator pendampingan valid menghasilkan OK dan domain", () => {
      const result = validatePendampingan(SAMPLE_PENDAMPINGAN_RAW, {
        currentDate: "2026-06-18",
        parentSasaranKeys: SAMPLE_PARENT_REGISTRY,
      });

      expectTrue(result.ok);
      expectEqual(result.error_count, 0);
      expectEqual(result.domain.pendampingan_unique_key, "5108010101999999|TIM_TJK_001|2026-06-18");
    }),

    test("Validator pendampingan menolak parent sasaran tidak ditemukan", () => {
      const result = validatePendampingan({
        ...SAMPLE_PENDAMPINGAN_RAW,
        sasaran_unique_key: "5108010101777777|TIM_TJK_001",
      }, {
        currentDate: "2026-06-18",
        parentSasaranKeys: SAMPLE_PARENT_REGISTRY,
      });

      expectFalse(result.ok);
      expectErrorCode(result, "PARENT_SASARAN_NOT_FOUND");
    }),

    test("Validator pendampingan menolak tanggal_pendampingan masa depan", () => {
      const result = validatePendampingan({
        ...SAMPLE_PENDAMPINGAN_RAW,
        tanggal_pendampingan: "2026-06-19",
      }, {
        currentDate: "2026-06-18",
        parentSasaranKeys: SAMPLE_PARENT_REGISTRY,
      });

      expectFalse(result.ok);
      expectErrorCode(result, "DATE_IN_FUTURE");
    }),

    test("Validator mengembalikan error terstruktur", () => {
      const result = validateSasaran({
        ...SAMPLE_SASARAN_RAW,
        nik: "123",
      }, {
        anchorDate: "2026-06-18",
      });

      expectFalse(result.ok);
      expectEqual(typeof result.errors[0].code, "string");
      expectEqual(typeof result.errors[0].field, "string");
      expectEqual(typeof result.errors[0].message, "string");
    }),
  ];
}
