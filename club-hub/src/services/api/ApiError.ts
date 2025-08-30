/**
 * Error thrown by API requests on non-2xx responses.
 * Contains the HTTP status code alongside the message.
 */
export class ApiError extends Error {
  /** HTTP status code returned by the server. */
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}
