# Arquitectura del Proyecto

## Stack Tecnologico

Frontend: React 19 + TypeScript + Vite
Backend: Node.js Serverless (Vercel /api)
Hosting: Vercel global CDN
VCS: GitHub
Package Manager: npm

## Componentes Principales

### Frontend (src/)

App.tsx
- Componente raiz, orquesta todo
- State: photoUri, backgrounds, selectedBg, transparency, authed
- Maneja login, fondos, compartir

LoginScreen.tsx
- Form de login
- Valida contra /api/login
- Genera y guarda token 24h

ImageEditor.tsx
- Canvas para foto + fondo
- Remuestreo high quality
- Actualiza en tiempo real

BackgroundGallery.tsx
- Galeria de fondos
- Agregar/eliminar fondos
- Seleccionar fondo activo

### Utilidades (src/utils/)

auth.ts: manejo token (save, get, clear, isAuthenticated)
imageProcessing.ts: removeWhiteBackground (pixeles RGBA)
defaultBackgrounds.ts: carga 4 PNGs en paralelo
canvasExport.ts: toBlob, share, save (Web Share API)

### Backend (api/)

login.ts
- POST /api/login
- Valida password vs env var
- Rate limiting 3x + 15min lockout
- Retorna token HMAC-SHA256

### Configuracion

vercel.json: Headers de seguridad
vite.config.ts: Build config
tsconfig.json: TypeScript
package.json: Dependencias

## Flujo de Autenticacion

1. Usuario abre app
2. App.tsx verifica isAuthenticated()
3. Si no: muestra LoginScreen
4. Usuario escribe password
5. fetch POST /api/login
6. Vercel valida contra PASSWORD env var
7. Si OK: retorna token + expiresAt
8. Frontend guarda en localStorage
9. setAuthed(true)
10. Pantalla de app aparece

## Flujo de Edicion

1. Usuario sube foto (FileReader → data URI)
2. ImageEditor carga en Image() 
3. Calcula square crop (centrado)
4. Dibuja en canvas
5. Si hay fondo: dibuja con globalAlpha
6. Canvas renderiza en tiempo real segun slider

## Flujo de Compartir

1. Usuario toca "Enviar a WhatsApp"
2. canvas.toBlob('image/jpeg', 1.0)
3. Crea File object
4. navigator.share({ files: [file] })
5. iOS/Android share sheet aparece
6. Usuario elige WhatsApp
7. App se abre con imagen adjunta
8. Usuario selecciona contacto y envia

## Decisiones Arquitectonicas

### Sin Backend

Decision: Cero base de datos, todo en frontend
Razon: Datos privados, no requieren servidor
Ventaja: Simpler, mas seguro, sin scaling issues
Trade-off: Rate limiting en memoria (reset en deploy)

### Canvas API (Sin librerías)

Decision: Usar Canvas nativo, sin procesamiento externo
Razon: Cero dependencias para imágenes
Ventaja: Bundle pequeno, sin vulnerabilidades
Trade-off: Codigo mas verboso

### Web Share API

Decision: Usar share sheet nativa iOS/Android
Razon: UX mejor que descargar manualmente
Ventaja: Directo a WhatsApp, mejor UX
Trade-off: No funciona en browsers viejos

### React Hooks

Decision: useState, useCallback, useRef (sin Redux)
Razon: Estado es simple
Ventaja: Cero boilerplate
Trade-off: Sin persistencia compleja

## Escalabilidad

Horizontal:
- Vercel CDN global
- Auto-scaling
- Sin limite usuarios

Vertical:
- Frontend stateless
- /api/login stateless
- Todo en cliente

## Performance

Bundle: 200KB gzip
Initial load: <1s
Paint: <500ms
Canvas: <100ms
Share: <1000ms

## Security Architecture

1. HTTPS (automatico)
2. HSTS 2 anos
3. Rate limiting
4. Comparacion constante-tiempo
5. Token HMAC-SHA256
6. Sin cookies
7. No indexable
8. Headers anti-clickjacking
9. Session 24h

