import {
  assertJenisSasaranValid,
  deriveIsBadutaPrioritas,
  deriveKelompokUmurBalita,
} from "../domain/TaxonomyService.js";

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

function expectThrows(fn, expectedMessage) {
  try {
    fn();
  } catch (error) {
    if (String(error.message).includes(expectedMessage)) {
      return;
    }
    throw error;
  }

  throw new Error(`Expected error: ${expectedMessage}`);
}

export function runContractTests() {
  return [
    test("BADUTA legacy ditolak sebagai jenis_sasaran", () => {
      expectThrows(() => assertJenisSasaranValid("BADUTA"), "BADUTA_LEGACY_NOT_ALLOWED");
    }),

    test("BALITA usia 0–23 bulan menjadi baduta_prioritas", () => {
      const actual = deriveIsBadutaPrioritas("BALITA", "2024-07-18", "2026-06-18");
      expectEqual(actual, true);
    }),

    test("BALITA usia 24–59 bulan bukan baduta_prioritas", () => {
      const actual = deriveIsBadutaPrioritas("BALITA", "2023-06-18", "2026-06-18");
      expectEqual(actual, false);
    }),

    test("BUFAS bukan baduta_prioritas", () => {
      const actual = deriveIsBadutaPrioritas("BUFAS", "2024-07-18", "2026-06-18");
      expectEqual(actual, false);
    }),

    test("Kelompok umur BALITA 0–23 bulan = BADUTA_0_23", () => {
      const actual = deriveKelompokUmurBalita("BALITA", "2024-07-18", "2026-06-18");
      expectEqual(actual, "BADUTA_0_23");
    }),

    test("Kelompok umur BALITA 24–59 bulan = BALITA_24_59", () => {
      const actual = deriveKelompokUmurBalita("BALITA", "2023-06-18", "2026-06-18");
      expectEqual(actual, "BALITA_24_59");
    }),
  ];
}
