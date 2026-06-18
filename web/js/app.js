import { APP_CONFIG } from "./config/AppConfig.js";
import { TAXONOMY_CONFIG } from "./config/TaxonomyConfig.js";
import { runContractTests } from "./test/TestRunner.js";

function renderStatus() {
  const el = document.querySelector("#app-status");

  const rows = [
    ["App Name", APP_CONFIG.appName],
    ["App Version", APP_CONFIG.appVersion],
    ["Build Package", APP_CONFIG.buildPackage],
    ["Backend Mode", APP_CONFIG.backendMode],
    ["Taxonomy Version", TAXONOMY_CONFIG.taxonomyVersion],
    ["Official Jenis Sasaran", TAXONOMY_CONFIG.officialJenisSasaran.join(", ")],
    ["Legacy BADUTA Allowed", TAXONOMY_CONFIG.allowLegacyBaduta ? "YA" : "TIDAK"],
  ];

  el.innerHTML = rows.map(([label, value]) => `
    <div class="status-row">
      <strong>${label}</strong>
      <span class="muted">${value}</span>
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
      <span>${item.name}</span>
      <span class="badge ${item.ok ? "ok" : "bad"}">${item.ok ? "PASS" : "FAIL"}</span>
    </div>
  `).join("");

  el.innerHTML = header + body;
}

renderStatus();
renderTests();
