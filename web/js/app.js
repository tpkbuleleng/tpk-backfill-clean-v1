import { APP_CONFIG } from "./config/AppConfig.js";
import { TAXONOMY_CONFIG } from "./config/TaxonomyConfig.js";
import { SCOPE_CONFIG } from "./config/ScopeConfig.js";
import { SHEET_CONFIG } from "./config/SheetConfig.js";
import { runContractTests } from "./test/TestRunner.js";
import { SAMPLE_SASARAN_RAW, SAMPLE_PENDAMPINGAN_RAW } from "./sample/SampleData.js";
import { MockSheetProvider } from "./provider/MockSheetProvider.js";
import { StagingWriterService } from "./service/StagingWriterService.js";
import { getSavedEndpointUrl, saveEndpointUrl } from "./provider/EndpointStore.js";
import { GasWebAppClient } from "./provider/GasWebAppClient.js";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderStatus() {
  const el = document.querySelector("#app-status");

  const rows = [
    ["App Name", APP_CONFIG.appName],
    ["App Version", APP_CONFIG.appVersion],
    ["Build Package", APP_CONFIG.buildPackage],
    ["Backend Mode", APP_CONFIG.backendMode],
    ["Domain Version", APP_CONFIG.domainVersion],
    ["Validation Version", APP_CONFIG.validationVersion],
    ["Provider Version", APP_CONFIG.providerVersion],
    ["Endpoint Bridge Version", APP_CONFIG.endpointBridgeVersion],
    ["Taxonomy Version", TAXONOMY_CONFIG.taxonomyVersion],
    ["Official Jenis Sasaran", TAXONOMY_CONFIG.officialJenisSasaran.join(", ")],
    ["Legacy BADUTA Allowed", TAXONOMY_CONFIG.allowLegacyBaduta ? "YA" : "TIDAK"],
    ["Baduta Priority Age", `${TAXONOMY_CONFIG.badutaPriorityMinAgeMonths}–${TAXONOMY_CONFIG.badutaPriorityMaxAgeMonths} bulan`],
    ["Balita Age Range", `${TAXONOMY_CONFIG.balitaMinAgeMonths}–${TAXONOMY_CONFIG.balitaMaxAgeMonths} bulan`],
    ["Scope Registry Mode", SCOPE_CONFIG.registryMode],
    ["Sheet Provider Mode", SHEET_CONFIG.providerMode],
    ["Real Provider Mode", SHEET_CONFIG.realProviderMode],
    ["Endpoint Mode", SHEET_CONFIG.endpointMode],
  ];

  el.innerHTML = rows.map(([label, value]) => `
    <div class="status-row">
      <strong>${escapeHtml(label)}</strong>
      <span class="muted">${escapeHtml(value)}</span>
    </div>
  `).join("");
}

function renderTests() {
  const el = document.querySelector("#test-output");
  const results = runContractTests();
  const allPass = results.every((item) => item.ok);

  const header = `
    <div class="test-row">
      <strong>Overall</strong>
      <span class="badge ${allPass ? "ok" : "bad"}">${allPass ? "PASS" : "FAIL"}</span>
    </div>
  `;

  const body = results.map((item) => `
    <div class="test-row">
      <span>${escapeHtml(item.name)}</span>
      <span class="badge ${item.ok ? "ok" : "bad"}">${item.ok ? "PASS" : "FAIL"}</span>
    </div>
  `).join("");

  el.innerHTML = header + body;
}

function renderSamples() {
  const stagingEl = document.querySelector("#staging-sample");
  const snapshotEl = document.querySelector("#provider-snapshot");

  const provider = new MockSheetProvider();
  const writer = new StagingWriterService(provider);

  const writeSasaran = writer.writeSasaran(SAMPLE_SASARAN_RAW, {
    anchorDate: "2026-06-18",
  });

  const writePendampingan = writer.writePendampingan(SAMPLE_PENDAMPINGAN_RAW, {
    currentDate: "2026-06-18",
  });

  stagingEl.textContent = JSON.stringify({ writeSasaran, writePendampingan }, null, 2);
  snapshotEl.textContent = JSON.stringify(writer.getSnapshot(), null, 2);
}

function setupEndpointPanel() {
  const input = document.querySelector("#gas-endpoint-url");
  const output = document.querySelector("#gas-endpoint-output");

  input.value = getSavedEndpointUrl();

  function print(payload) {
    output.textContent = JSON.stringify(payload, null, 2);
  }

  function printError(error) {
    output.textContent = JSON.stringify({
      ok: false,
      error: {
        message: error.message,
      },
    }, null, 2);
  }

  function getClient() {
    const url = saveEndpointUrl(input.value);
    return new GasWebAppClient(url);
  }

  document.querySelector("#btn-save-endpoint").addEventListener("click", () => {
    const url = saveEndpointUrl(input.value);
    print({ ok: true, saved_endpoint_url: url });
  });

  document.querySelector("#btn-gas-health").addEventListener("click", async () => {
    try { print(await getClient().health()); } catch (error) { printError(error); }
  });

  document.querySelector("#btn-gas-setup").addEventListener("click", async () => {
    try { print(await getClient().setupSheets()); } catch (error) { printError(error); }
  });

  document.querySelector("#btn-gas-write-sasaran").addEventListener("click", async () => {
    try { print(await getClient().writeSampleSasaran()); } catch (error) { printError(error); }
  });

  document.querySelector("#btn-gas-write-pendampingan").addEventListener("click", async () => {
    try { print(await getClient().writeSamplePendampingan()); } catch (error) { printError(error); }
  });

  document.querySelector("#btn-gas-snapshot").addEventListener("click", async () => {
    try { print(await getClient().snapshot()); } catch (error) { printError(error); }
  });
}

try {
  renderStatus();
  renderTests();
  renderSamples();
  setupEndpointPanel();
} catch (error) {
  console.error(error);
  document.body.insertAdjacentHTML(
    "afterbegin",
    `<div class="card"><strong>Runtime Error:</strong> ${escapeHtml(error.message)}</div>`
  );
}
