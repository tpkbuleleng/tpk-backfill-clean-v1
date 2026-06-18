import { APP_CONFIG } from "./config/AppConfig.js";
import { TAXONOMY_CONFIG } from "./config/TaxonomyConfig.js";
import { SCOPE_CONFIG } from "./config/ScopeConfig.js";
import { runContractTests } from "./test/TestRunner.js";
import {
  SAMPLE_SASARAN_RAW,
  SAMPLE_PENDAMPINGAN_RAW,
  SAMPLE_INVALID_SASARAN_RAW,
  SAMPLE_INVALID_PENDAMPINGAN_RAW,
  SAMPLE_PARENT_REGISTRY,
} from "./sample/SampleData.js";
import { validateSasaran } from "./validation/SasaranValidator.js";
import { validatePendampingan } from "./validation/PendampinganValidator.js";

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
    ["Taxonomy Version", TAXONOMY_CONFIG.taxonomyVersion],
    ["Official Jenis Sasaran", TAXONOMY_CONFIG.officialJenisSasaran.join(", ")],
    ["Legacy BADUTA Allowed", TAXONOMY_CONFIG.allowLegacyBaduta ? "YA" : "TIDAK"],
    ["Baduta Priority Age", `${TAXONOMY_CONFIG.badutaPriorityMinAgeMonths}–${TAXONOMY_CONFIG.badutaPriorityMaxAgeMonths} bulan`],
    ["Balita Age Range", `${TAXONOMY_CONFIG.balitaMinAgeMonths}–${TAXONOMY_CONFIG.balitaMaxAgeMonths} bulan`],
    ["Scope Registry Mode", SCOPE_CONFIG.registryMode],
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
  const sasaranEl = document.querySelector("#sasaran-validation-sample");
  const pendampinganEl = document.querySelector("#pendampingan-validation-sample");
  const invalidEl = document.querySelector("#invalid-validation-sample");

  const sasaranValidation = validateSasaran(SAMPLE_SASARAN_RAW, {
    anchorDate: "2026-06-18",
  });

  const pendampinganValidation = validatePendampingan(SAMPLE_PENDAMPINGAN_RAW, {
    currentDate: "2026-06-18",
    parentSasaranKeys: SAMPLE_PARENT_REGISTRY,
  });

  const invalidSasaranValidation = validateSasaran(SAMPLE_INVALID_SASARAN_RAW, {
    anchorDate: "2026-06-18",
  });

  const invalidPendampinganValidation = validatePendampingan(SAMPLE_INVALID_PENDAMPINGAN_RAW, {
    currentDate: "2026-06-18",
    parentSasaranKeys: SAMPLE_PARENT_REGISTRY,
  });

  sasaranEl.textContent = JSON.stringify(sasaranValidation, null, 2);
  pendampinganEl.textContent = JSON.stringify(pendampinganValidation, null, 2);
  invalidEl.textContent = JSON.stringify({
    invalid_sasaran: invalidSasaranValidation,
    invalid_pendampingan: invalidPendampinganValidation,
  }, null, 2);
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
