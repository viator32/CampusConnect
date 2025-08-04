import { EnvironmentApi, environmentApi } from './api';

export abstract class BaseService {
  protected api: EnvironmentApi;

  constructor(api: EnvironmentApi = environmentApi) {
    this.api = api;
  }

  protected abstract buildPayload(...args: unknown[]): unknown;
}

