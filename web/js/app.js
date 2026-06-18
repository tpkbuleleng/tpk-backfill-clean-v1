import { APP_CONFIG } from "./config/AppConfig.js";
import { TAXONOMY_CONFIG } from "./config/TaxonomyConfig.js";
import { runContractTests } from "./test/TestRunner.js";
import { SAMPLE_SASARAN_RAW, SAMPLE_PENDAMPINGAN_RAW } from "./sample/SampleData.js";
import { buildSasaranDomain } from "./domain/SasaranModel.js";
import { buildPendampinganDomain } from "./domain/PendampinganModel.js";

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
    ["Taxonomy Version", TAXONOMY_CONFIG.taxonomyVersion],
    ["Official Jenis Sasaran", TAXONOMY_CONFIG.officialJenisSasaran.join(", ")],
    ["Legacy BADUTA Allowed", TAXONOMY_CONFIG.allowLegacyBaduta ? "YA" : "TIDAK"],
    ["Baduta Priority Age", `${TAXONOMY_CONFIG.badutaPriorityMinAgeMonths}–${TAXONOMY_CONFIG.badutaPriorityMaxAgeMonths} bulan`],
    ["Balita Age Range", `${TAXONOMY_CONFIG.balitaMinAgeMonths}–${TAXONOMY_CONFIG.balitaMaxAgeMonths} bulan`],
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
  const sasaranEl = document.querySelector("#sasaran-sample");
  const pendampinganEl = document.querySelector("#pendampingan-sample");

  const sasaran = buildSasaranDomain(SAMPLE_SASARAN_RAW, {
    anchorDate: "2026-06-18",
  });

  const pendampingan = buildPendampinganDomain(SAMPLE_PENDAMPINGAN_RAW);

  sasaranEl.textContent = JSON.stringify(sasaran, null, 2);
  pendampinganEl.textContent = JSON.stringify(pendampingan, null, 2);
}

try {
  renderStatus();
  renderTests();
  renderSamples();
} catch (error) {
  console.error(error);
  document.body.insertAdjacentHTML(
    "afterbegin",
    `<div class="card"><strong>Runtime Error:</strong> ${escapeHtml(error.message)}</div>`
  );
}
