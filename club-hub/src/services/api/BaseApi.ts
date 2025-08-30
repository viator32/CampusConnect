/**
 * Minimal base abstraction for HTTP clients.
 * Concrete APIs should extend this class and implement `request`.
 */
export abstract class BaseApi {
  /** Root URL joined with relative `path` values. */
  protected baseUrl: string;

  /**
   * @param baseUrl Base server URL used for relative requests.
   */
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Perform an HTTP request and return typed data.
   * @typeParam T Expected shape of the JSON payload or response type.
   * @param path Relative path or absolute URL.
   * @param options Standard `fetch` options.
   */
  abstract request<T>(path: string, options?: RequestInit): Promise<T>;
}
