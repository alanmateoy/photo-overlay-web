# Documentacion Tecnica

Documento: TECHNICAL.md
Version: 1.0.0

## Stack Tecnologico

Frontend: React 19 + TypeScript + Vite
Backend: Node.js Serverless (Vercel /api)
Hosting: Vercel global CDN
VCS: GitHub
Package Manager: npm

## Componentes Principales

### LoginScreen.tsx
- Pantalla de login con autocompletar iOS
- Valida contra /api/login
- Genera token HMAC-SHA256 de 24h
- Muestra errores claros

### ImageEditor.tsx
- Canvas para composicion foto + fondo
- Remuestreo en calidad high
- Actualiza en tiempo real
- Mantiene resolucion original

### BackgroundGallery.tsx
- Galeria de fondos (4 predefinidos + uploads)
- Seleccionar fondo activo
- Eliminar fondos
- Subir nuevos fondos

### App.tsx
- Orquesta autenticacion, state, componentes
- Maneja compartir y guardar
- Toast de feedback

## Utilidades Clave

### auth.ts
- saveSession(token, expiresAt)
- getToken() - retorna null si expirado
- isAuthenticated() - boolean
- clearSession()

### imageProcessing.ts
- removeWhiteBackground(uri, tolerance)
- Itera pixeles RGBA
- Detecta blancos, pone alpha 0
- Retorna PNG data URI

### defaultBackgrounds.ts
- loadDefaultBackgrounds()
- Carga 4 PNGs en paralelo
- Aplica removeWhiteBackground
- Retorna array de data URIs

### canvasExport.ts
- canvasToBlob(canvas) - retorna Blob
- canvasToFile(canvas) - retorna File
- shareImage(canvas) - Web Share API
- saveImage(canvas) - Download/Share
- Quality siempre 1.0 (maxima)

## API /api/login

POST /api/login

Request:
{
  "password": "..."
}

Response 200:
{
  "success": true,
  "token": "...",
  "expiresAt": 1234567890
}

Response 401:
{
  "error": "Contrasena incorrecta. Quedan N intentos.",
  "attemptsLeft": 2
}

Response 429:
{
  "error": "Demasiados intentos. Espera 15 minutos.",
  "lockedUntil": 1234567890
}

## TypeScript Config

- Target: ES2023
- Module: esnext
- Strict: true
- No unused locals/params
- JSX: react-jsx

## Performance

- Bundle: 200KB gzip
- First paint: <500ms
- Canvas render: <100ms
- Share: <1000ms
- Login: <500ms

## Seguridad Implementada

Rate Limiting:
- Map en memoria por IP
- 3 intentos max
- 15 min lockout
- Reset en cold start (OK para uso privado)

Contrasena:
- crypto.timingSafeEqual() - anti-timing attack
- No se valida sin constante tiempo

Token:
- crypto.randomBytes(24)
- HMAC-SHA256 firmado
- Payload: random.expiresAt.signature
- Validacion: parse y comparar HMAC

Headers HTTP (vercel.json):
- X-Frame-Options: DENY (anti-clickjacking)
- X-Content-Type-Options: nosniff
- Referrer-Policy: no-referrer
- X-Robots-Tag: noindex, nofollow, noarchive, nosnippet
- Strict-Transport-Security: max-age=63072000

robots.txt:
User-agent: *
Disallow: /

Meta noindex en HTML:
<meta name="robots" content="noindex, nofollow, noarchive, nosnippet">

