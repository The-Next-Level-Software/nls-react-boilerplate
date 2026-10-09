import { appConfig } from '@/config/app.config'
import { useAuthStore } from '@/store/auth.store'

export class ApiError extends Error {
  status: number
  data: unknown

  constructor(status: number, message: string, data?: unknown) {
    super(message)
    this.status = status
    this.data = data
  }
}

type Query = Record<string, string | number | boolean | null | undefined>

interface RequestOptions extends Omit<RequestInit, 'body'> {
  query?: Query
  body?: unknown
}

function buildUrl(path: string, query?: Query) {
  const url = new URL(path.replace(/^\//, ''), appConfig.apiUrl.replace(/\/?$/, '/'))
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value))
  }
  return url.toString()
}

/** Minimal fetch wrapper: JSON in/out, bearer token, 401 → sign out. */
async function request<T>(path: string, { query, body, headers, ...init }: RequestOptions = {}): Promise<T> {
  const token = useAuthStore.getState().token
  const res = await fetch(buildUrl(path, query), {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const data = res.status === 204 ? null : await res.json().catch(() => null)
  if (!res.ok) {
    if (res.status === 401) useAuthStore.getState().clear()
    throw new ApiError(res.status, data?.message ?? res.statusText, data)
  }
  return data as T
}

export const http = {
  get: <T>(path: string, query?: Query) => request<T>(path, { method: 'GET', query }),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PATCH', body }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}

/** Simulated network latency for mock services. */
export const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))
