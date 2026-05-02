import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

// Almacén en memoria de intentos fallidos por IP.
// Nota: se reinicia con cold-starts del serverless. Es suficiente
// para nuestro caso de uso (almacén privado, pocos usuarios).
type AttemptRecord = { count: number; lockedUntil: number };
const attempts = new Map<string, AttemptRecord>();

const MAX_ATTEMPTS = 3;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutos
const SESSION_MS = 24 * 60 * 60 * 1000; // 24 horas

function getClientIp(req: VercelRequest): string {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length > 0) {
    return fwd.split(',')[0].trim();
  }
  if (Array.isArray(fwd) && fwd.length > 0) {
    return fwd[0];
  }
  return req.socket?.remoteAddress || 'unknown';
}

function timingSafeEquals(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) {
    // Ejecuta una comparación dummy para mantener tiempo constante
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Solo aceptamos POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const ip = getClientIp(req);

  // Verificar bloqueo activo
  const record = attempts.get(ip);
  if (record && record.lockedUntil > Date.now()) {
    const minutesLeft = Math.ceil((record.lockedUntil - Date.now()) / 60000);
    return res.status(429).json({
      error: `Demasiados intentos fallidos. Espera ${minutesLeft} minuto(s).`,
      lockedUntil: record.lockedUntil,
    });
  }

  // Validar body
  const body = req.body || {};
  const password = typeof body.password === 'string' ? body.password : '';
  if (!password) {
    return res.status(400).json({ error: 'Contraseña requerida' });
  }

  const expected = process.env.PASSWORD;
  const secret = process.env.AUTH_SECRET || expected || '';

  if (!expected) {
    // Falla segura: si la variable no está configurada, no aceptar nada
    return res.status(500).json({
      error: 'Servidor mal configurado. Contacta al administrador.',
    });
  }

  const valid = timingSafeEquals(password, expected);

  if (!valid) {
    const current: AttemptRecord = record && record.lockedUntil <= Date.now()
      ? { count: 0, lockedUntil: 0 }
      : (record || { count: 0, lockedUntil: 0 });

    current.count += 1;

    if (current.count >= MAX_ATTEMPTS) {
      current.lockedUntil = Date.now() + LOCKOUT_MS;
      current.count = 0;
      attempts.set(ip, current);
      return res.status(429).json({
        error: 'Demasiados intentos fallidos. Bloqueado por 15 minutos.',
        lockedUntil: current.lockedUntil,
      });
    }

    attempts.set(ip, current);
    const remaining = MAX_ATTEMPTS - current.count;
    return res.status(401).json({
      error: `Contraseña incorrecta. Te quedan ${remaining} intento(s).`,
      attemptsLeft: remaining,
    });
  }

  // Éxito: limpiar registros y emitir token firmado
  attempts.delete(ip);

  const expiresAt = Date.now() + SESSION_MS;
  const random = crypto.randomBytes(24).toString('hex');
  const payload = `${random}.${expiresAt}`;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  const token = `${payload}.${signature}`;

  return res.status(200).json({
    success: true,
    token,
    expiresAt,
  });
}
