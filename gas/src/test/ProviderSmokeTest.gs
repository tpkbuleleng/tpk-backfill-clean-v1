function testCB3ProviderSmoke() {
  return {
    ok: true,
    package: 'CB-3',
    provider_health: TPK_getSheetProviderHealth(),
  };
}
