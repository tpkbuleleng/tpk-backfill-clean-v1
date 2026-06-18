/**
 * Scope registry statis sementara untuk CB-2.
 */
const TPK_SCOPE_CONFIG = Object.freeze({
  registryMode: 'STATIC_CB2_TEST_REGISTRY',
  officialKecamatanCodes: ['GRK', 'SRT', 'BSB', 'BJR', 'BLL', 'SKS', 'SWN', 'KBT', 'TJK'],
  validTimByKecamatan: Object.freeze({
    TJK: ['TIM_TJK_001'],
    GRK: [],
    SRT: [],
    BSB: [],
    BJR: [],
    BLL: [],
    SKS: [],
    SWN: [],
    KBT: [],
  }),
});
