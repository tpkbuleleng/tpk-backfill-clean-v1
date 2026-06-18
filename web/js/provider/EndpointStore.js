const STORAGE_KEY = "TPK_CB4_GAS_WEB_APP_URL";

export function getSavedEndpointUrl() {
  return localStorage.getItem(STORAGE_KEY) || "";
}

export function saveEndpointUrl(url) {
  const normalized = String(url || "").trim();
  localStorage.setItem(STORAGE_KEY, normalized);
  return normalized;
}
