# Documentacion API

Documento: API.md
Version: 1.0.0

## Endpoint: POST /api/login

Autenticacion mediante contrasena.

### Request

POST /api/login
Content-Type: application/json

{
  "password": "string"
}

Parametros:
- password (string, requerido): La contrasena para acceder

### Response: 200 OK

{
  "success": true,
  "token": "string",
  "expiresAt": number
}

Propiedades:
- success: true si autenticacion fue correcta
- token: Token firmado con HMAC-SHA256, valido 24h
- expiresAt: Timestamp Unix en milisegundos de expiracion

Ejemplo:
{
  "success": true,
  "token": "a1b2c3d4e5f6g7h8i9j0.1234567890000.abcdef...",
  "expiresAt": 1234567890000
}

### Response: 401 Unauthorized

{
  "error": "string",
  "attemptsLeft": number
}

Propiedades:
- error: Mensaje de error
- attemptsLeft: Intentos restantes antes de bloqueo

Ejemplo:
{
  "error": "Contrasena incorrecta. Quedan 2 intentos.",
  "attemptsLeft": 2
}

Nota: Despues de 3 intentos fallidos, el endpoint retorna 429.

### Response: 429 Too Many Requests

{
  "error": "string",
  "lockedUntil": number
}

Propiedades:
- error: Mensaje de bloqueo
- lockedUntil: Timestamp Unix cuando se levanta el bloqueo

Ejemplo:
{
  "error": "Demasiados intentos. Espera 15 minutos.",
  "lockedUntil": 1234567890000
}

Bloquer dura 15 minutos por IP.

## Headers de Respuesta

Todas las respuestas incluyen:

X-Robots-Tag: noindex, nofollow, noarchive, nosnippet
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: no-referrer
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload

## Detalles de Implementacion

### Comparacion de Contrasena

Usa crypto.timingSafeEqual() para evitar timing attacks.

### Generacion de Token

1. random = crypto.randomBytes(24).toString('hex')
2. expiresAt = Date.now() + 24 horas
3. payload = `${random}.${expiresAt}`
4. signature = HMAC-SHA256(payload)
5. token = `${payload}.${signature}`

### Almacenamiento Cliente

Frontend almacena en localStorage:
- pow_auth_token: Token completo
- pow_auth_expires: Timestamp expiracion

Si expiresAt < Date.now(), token se considera invalido.

### Rate Limiting

- Limite: 3 intentos por IP
- Ventana: Por solicitud (no temporal)
- Bloqueo: 15 minutos por IP
- Implementacion: Map en memoria en serverless function

Nota: Se reinicia con cold starts de Vercel (OK para este uso).

