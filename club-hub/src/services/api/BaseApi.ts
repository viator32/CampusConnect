export abstract class BaseApi {
  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  abstract request<T>(path: string, options?: RequestInit): Promise<T>;
}
