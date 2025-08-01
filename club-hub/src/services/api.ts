export let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

/** Generic API request helper. */
export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  // TODO: set your API base URL
  const baseUrl = '';
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

  const res = await fetch(baseUrl + path, { ...options, headers });
  if (!res.ok) throw new Error('API error');
  return res.json() as Promise<T>;
}
