import { validateSasaran } from "../validation/SasaranValidator.js";
import { validatePendampingan } from "../validation/PendampinganValidator.js";

export class StagingWriterService {
  constructor(provider) {
    this.provider = provider;
  }

  writeSasaran(raw, options = {}) {
    const validation = validateSasaran(raw, options);

    if (!validation.ok) {
      return Object.freeze({
        ok: false,
        stage: "VALIDATION",
        action: "WRITE_SASARAN",
        validation,
        provider: null,
      });
    }

    const providerResult = this.provider.writeSasaran(validation.domain);

    return Object.freeze({
      ok: providerResult.ok,
      stage: providerResult.ok ? "PROVIDER_WRITE" : "PROVIDER_ERROR",
      action: "WRITE_SASARAN",
      validation,
      provider: providerResult,
    });
  }

  writePendampingan(raw, options = {}) {
    const validation = validatePendampingan(raw, {
      ...options,
      parentSasaranKeys: options.parentSasaranKeys || this.provider.getParentSasaranKeys(),
    });

    if (!validation.ok) {
      return Object.freeze({
        ok: false,
        stage: "VALIDATION",
        action: "WRITE_PENDAMPINGAN",
        validation,
        provider: null,
      });
    }

    const providerResult = this.provider.writePendampingan(validation.domain);

    return Object.freeze({
      ok: providerResult.ok,
      stage: providerResult.ok ? "PROVIDER_WRITE" : "PROVIDER_ERROR",
      action: "WRITE_PENDAMPINGAN",
      validation,
      provider: providerResult,
    });
  }

  getSnapshot() {
    return this.provider.getSnapshot();
  }
}
