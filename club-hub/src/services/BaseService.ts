import { EnvironmentApi, environmentApi } from './api';

export abstract class BaseService {
  protected api: EnvironmentApi;

  constructor(api: EnvironmentApi = environmentApi) {
    this.api = api;
  }

  /**
   * Merge multiple objects into a single payload.
   * Non-object arguments are ignored.
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

