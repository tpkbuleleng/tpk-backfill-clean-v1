export const SCOPE_CONFIG = Object.freeze({
  registryMode: "STATIC_CB4_TEST_REGISTRY",

  officialKecamatanCodes: Object.freeze([
    "GRK", "SRT", "BSB", "BJR", "BLL", "SKS", "SWN", "KBT", "TJK",
  ]),

  validTimByKecamatan: Object.freeze({
    TJK: Object.freeze(["TIM_TJK_001"]),
    GRK: Object.freeze([]),
    SRT: Object.freeze([]),
    BSB: Object.freeze([]),
    BJR: Object.freeze([]),
    BLL: Object.freeze([]),
    SKS: Object.freeze([]),
    SWN: Object.freeze([]),
    KBT: Object.freeze([]),
  }),
});
