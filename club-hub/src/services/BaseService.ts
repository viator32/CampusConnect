import { EnvironmentApi, environmentApi } from './api';

/**
 * Base class for feature services that call the backend.
 * Holds a reference to the shared `EnvironmentApi` instance.
 */
export abstract class BaseService {
  /** API client used for HTTP requests. */
  protected api: EnvironmentApi;

  /**
   * @param api API client instance. Defaults to the shared `environmentApi`.
   */
  constructor(api: EnvironmentApi = environmentApi) {
    this.api = api;
  }

  /**
   * Merge multiple plain objects into a single payload. Non-objects are ignored.
   * Useful to build request bodies from optional fragments.
   */
  protected buildPayload(...args: unknown[]): Record<string, unknown> {
    return args.reduce<Record<string, unknown>>((acc, arg) => {
      if (typeof arg === 'object' && arg !== null) {
        return { ...acc, ...(arg as Record<string, unknown>) };
      }
      return acc;
    }, {});
  }
}
