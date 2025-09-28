// src/lib/apiClient.js
let getToken = () => null;
let onSessionExpired = () => {};
let shouldHandleAsSessionExpired = () => true; // override in init if needed
let _isLoggingOut = false;

export function initApiClient(opts = {}) {
  getToken = opts.getToken || getToken;
  onSessionExpired = opts.onSessionExpired || onSessionExpired;
  if (typeof opts.shouldHandleAsSessionExpired === 'function') {
    shouldHandleAsSessionExpired = opts.shouldHandleAsSessionExpired;
  }
}

/**
 * apiFetch(url, { method, headers, body })
 * - Always sends Accept: application/json
 * - Adds Bearer token if present
 * - Triggers onSessionExpired() on 401/419 (once), unless shouldHandleAsSessionExpired(...) returns false
 */
export async function apiFetch(input, init = {}) {
  const token = getToken();

  let res;
  try {
    res = await fetch(input, {
      ...init,
      headers: {
        Accept: 'application/json',
        // Only set Content-Type if we actually send a body AND it's not FormData
        ...(init.body && !(init.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
        ...(init.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: 'include',
    });
  } catch (err) {
    // Network error / CORS / offline — let the caller decide
    throw err;
  }

  // --- Global session handling ---
  if (res.status === 401 || res.status === 419) {
    const urlStr = typeof input === 'string' ? input : (input?.url || '');
    const shouldLogout = shouldHandleAsSessionExpired(urlStr, res) !== false;

    if (shouldLogout && !_isLoggingOut) {
      _isLoggingOut = true;
      try {
        onSessionExpired();
      } finally {
        // allow future triggers after handler runs
        _isLoggingOut = false;
      }
    }

    const e = new Error('SESSION_EXPIRED');
    e.code = 'SESSION_EXPIRED';
    throw e;
  }

  // Non-OK => throw with best-effort message
  if (!res.ok) {
    // try json first, fallback to text
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      const data = await res.json().catch(() => ({}));
      const msg = data?.message || `Request failed: ${res.status}`;
      const e = new Error(msg);
      e.status = res.status;
      e.data = data;
      throw e;
    } else {
      const text = await res.text().catch(() => '');
      const e = new Error(`Request failed: ${res.status}${text ? ` - ${text}` : ''}`);
      e.status = res.status;
      e.data = text;
      throw e;
    }
  }

  if (res.status === 204) return null;

  // Safe JSON parse (some endpoints might return empty body)
  const raw = await res.text();
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    // If backend accidentally sent non-JSON, return raw for debugging
    return raw;
  }
}
