export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

/** GET a JSON resource from the backend. Paths are relative to /api. */
export async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`/api${path}`, { signal });
  if (!res.ok) {
    const body = (await res.json().catch(() => undefined)) as { message?: string } | undefined;
    throw new HttpError(res.status, body?.message ?? `HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}
