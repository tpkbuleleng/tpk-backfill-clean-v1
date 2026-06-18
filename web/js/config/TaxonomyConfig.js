export const TAXONOMY_CONFIG = Object.freeze({
  taxonomyVersion: "TPK_TAXONOMY_2026_7E_R1",
  officialJenisSasaran: ["CATIN", "BUMIL", "BUFAS", "BALITA"],
  allowLegacyBaduta: false,

  balitaMinAgeMonths: 0,
  balitaMaxAgeMonths: 59,

  badutaPriorityMinAgeMonths: 0,
  badutaPriorityMaxAgeMonths: 23,

  kelompokUmurBalita: Object.freeze({
    BADUTA_0_23: "BADUTA_0_23",
    BALITA_24_59: "BALITA_24_59",
  }),
});
