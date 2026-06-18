import { APP_CONFIG } from "../config/AppConfig.js";

let callbackCounter = 0;

function makeCallbackName() {
  callbackCounter += 1;
  return `TPK_CB5_JSONP_${Date.now()}_${callbackCounter}`;
}

function appendParams(url, params) {
  const parsed = new URL(url);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      parsed.searchParams.set(key, String(value));
    }
  });
  return parsed.toString();
}

export class GasWebAppClient {
  constructor(endpointUrl) { this.endpointUrl = String(endpointUrl || "").trim(); }
  assertReady() { if (!this.endpointUrl) throw new Error("GAS Web App URL belum diisi."); }
  request(action, params = {}) {
    this.assertReady();
    const callbackName = makeCallbackName();
    const url = appendParams(this.endpointUrl, { action, bridge_version: APP_CONFIG.endpointBridgeVersion, callback: callbackName, ...params });
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      const timeout = window.setTimeout(() => { cleanup(); reject(new Error("Timeout saat memanggil GAS Web App endpoint.")); }, 30000);
      function cleanup() { window.clearTimeout(timeout); script.remove(); try { delete window[callbackName]; } catch { window[callbackName] = undefined; } }
      window[callbackName] = (payload) => { cleanup(); resolve(payload); };
      script.onerror = () => { cleanup(); reject(new Error("Gagal memuat GAS Web App endpoint. Periksa URL dan izin deployment.")); };
      script.src = url;
      document.body.appendChild(script);
    });
  }
  health() { return this.request("health"); }
  setupSheets() { return this.request("setupSheets"); }
  clearTestRows() { return this.request("clearTestRows"); }
  writeSampleSasaran() { return this.request("writeSampleSasaran"); }
  writeSamplePendampingan() { return this.request("writeSamplePendampingan"); }
  testDuplicateSasaran() { return this.request("testDuplicateSasaran"); }
  testDuplicatePendampingan() { return this.request("testDuplicatePendampingan"); }
  runSmokeTest() { return this.request("runSmokeTest"); }
  snapshot() { return this.request("snapshot"); }
}
