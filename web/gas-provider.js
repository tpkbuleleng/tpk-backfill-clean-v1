class GasProvider {
  constructor(endpointUrl) { this.endpointUrl = endpointUrl || ''; }
  async call(action, payload = {}) {
    if (!this.endpointUrl) throw new Error('Endpoint GAS belum diisi.');
    const res = await fetch(this.endpointUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action, payload, client_version: window.CB6.appVersion })
    });
    const text = await res.text();
    let json;
    try { json = JSON.parse(text); } catch (err) { throw new Error('Response GAS bukan JSON: ' + text.slice(0, 300)); }
    if (!json.ok) throw new Error(json.error_code || json.message || 'GAS action gagal');
    return json;
  }
}
window.GasProvider = GasProvider;
