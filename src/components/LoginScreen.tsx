import { useState, type FormEvent } from 'react';
import { saveSession } from '../utils/auth';
import '../styles/LoginScreen.css';

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading || locked || !password) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success && data.token) {
        saveSession(data.token, data.expiresAt);
        onLogin();
        return;
      }

      setError(data.error || 'Error de autenticación');
      if (response.status === 429) {
        setLocked(true);
      }
      setPassword('');
    } catch {
      setError('Error de conexión. Verifica tu internet e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form
        className="login-box"
        onSubmit={handleSubmit}
        method="post"
        action="/api/login"
        autoComplete="on"
      >
        <div className="login-icon" aria-hidden="true">🔐</div>
        <h1 className="login-title">Sistema Privado</h1>
        <p className="login-subtitle">Acceso restringido al personal autorizado</p>

        {/* Username oculto pero presente: ayuda a iOS Keychain a guardar/sugerir
            la contraseña asociada a este sitio. */}
        <input
          type="text"
          name="username"
          autoComplete="username"
          value="almacen"
          readOnly
          hidden
          aria-hidden="true"
        />

        <input
          type="password"
          name="password"
          autoComplete="current-password"
          inputMode="text"
          enterKeyHint="go"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          disabled={loading || locked}
          required
          autoFocus
        />

        {error && (
          <div className={`login-error ${locked ? 'locked' : ''}`} role="alert">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="login-button"
          disabled={loading || locked || !password}
        >
          {loading ? 'Verificando…' : locked ? 'Bloqueado' : 'Entrar'}
        </button>

        <p className="login-disclaimer">
          ⚠️ Este es un sistema privado. El acceso no autorizado está prohibido
          y puede ser sancionado conforme a la ley.
        </p>
      </form>
    </div>
  );
}
