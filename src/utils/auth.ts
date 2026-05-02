// Utilidades de autenticación lado-cliente
// El token se obtiene de /api/login y se guarda 24h en localStorage

const TOKEN_KEY = 'pow_auth_token';
const EXPIRES_KEY = 'pow_auth_expires';

export function saveSession(token: string, expiresAt: number): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(EXPIRES_KEY, String(expiresAt));
  } catch {
    // localStorage puede fallar en modo privado
  }
}

export function getToken(): string | null {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const expires = localStorage.getItem(EXPIRES_KEY);
    if (!token || !expires) return null;

    const expiresAt = parseInt(expires, 10);
    if (Number.isNaN(expiresAt) || Date.now() > expiresAt) {
      clearSession();
      return null;
    }
    return token;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRES_KEY);
  } catch {
    // ignorar
  }
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}

export function getSessionExpiresAt(): number | null {
  try {
    const expires = localStorage.getItem(EXPIRES_KEY);
    if (!expires) return null;
    const n = parseInt(expires, 10);
    return Number.isNaN(n) ? null : n;
  } catch {
    return null;
  }
}
