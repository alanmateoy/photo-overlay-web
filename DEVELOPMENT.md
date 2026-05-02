# Guia para Desarrolladores

## Setup Local

### Requisitos

- Node.js 18+
- npm o yarn
- Git
- Vercel CLI (opcional, para probar /api)

### Instalacion

bash
git clone https://github.com/usuario/photo-overlay-web.git
cd photo-overlay-web
npm install

### Development Sin API

Para solo frontend (sin /api/login):

bash
npm run dev

Abre: http://localhost:5173

Nota: Login no funcionara (requiere Vercel serverless)

### Development Con API

Para probar login completo:

bash
npm install -g vercel
vercel login
vercel dev

Abre: http://localhost:3000

### Build para Produccion

bash
npm run build

Output: dist/

### Preview del Build

bash
npm run preview

Abre: http://localhost:4173

## Estructura de Carpetas

photo-overlay-web/
├── src/
│   ├── components/
│   │   ├── LoginScreen.tsx
│   │   ├── PhotoUpload.tsx
│   │   ├── ImageEditor.tsx
│   │   └── BackgroundGallery.tsx
│   ├── utils/
│   │   ├── auth.ts
│   │   ├── imageProcessing.ts
│   │   ├── defaultBackgrounds.ts
│   │   └── canvasExport.ts
│   ├── styles/
│   │   ├── App.css
│   │   ├── LoginScreen.css
│   │   └── BackgroundGallery.css
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── api/
│   └── login.ts (Vercel serverless)
├── public/
│   ├── fondos/ (4 PNG backgrounds)
│   ├── robots.txt
│   └── favicon.svg
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vercel.json

## Key Files to Modify

### Cambiar Contrasena

1. Ve a https://vercel.com/dashboard
2. Proyecto photo-overlay-web → Settings → Environments
3. Edita PASSWORD variable
4. Redeploy en Deployments

### Agregar Mas Fondos

1. Agrega PNG a public/fondos/
2. Actualiza defaultBackgrounds.ts:

const DEFAULT_BACKGROUND_PATHS = [
  '/fondos/1_upscaled.png',
  '/fondos/2_upscaled.png',
  '/fondos/3_upscaled.png',
  '/fondos/4_upscaled.png',
  '/fondos/5_upscaled.png', // nuevo
];

3. Deploy

### Cambiar Tiempo de Sesion

En api/login.ts:

const SESSION_MS = 24 * 60 * 60 * 1000; // cambiar aqui

Cambiar a, por ejemplo, 12 horas:

const SESSION_MS = 12 * 60 * 60 * 1000;

### Cambiar Tolerancia Fondo Blanco

En utils/defaultBackgrounds.ts:

const WHITE_TOLERANCE = 38; // cambiar aqui

Valores: 30-50 segun necesidad

## Testing

### Manual Testing

1. Login:
   - Intenta 3 veces mal, verifica bloqueo
   - Login exitoso, verifica token guardado
   - Refresh, verifica que mantenga sesion

2. Foto:
   - Sube JPG, PNG, WebP
   - Verifica que sea cuadrado centrado
   - Verifica que no pierda calidad

3. Fondo:
   - Selecciona fondos predefinidos
   - Carga fondos custom
   - Elimina fondos
   - Ajusta opacidad

4. Compartir:
   - Enviar a WhatsApp
   - Guardar en galeria
   - Verifica calidad 1.0 JPEG

### Browser Testing

- Chrome/Edge (Windows, Mac, Android)
- Firefox (Windows, Mac, Android)
- Safari (Mac, iOS)

## Deployment

Push a main dispara deploy automatico:

bash
git push origin main

Vercel hace:
1. Build: npm run build
2. Deploy a CDN
3. HTTPS + SSL automatico
4. Vercel env vars cargan automaticamente

Monitor en: https://vercel.com/dashboard

## Debugging

### Frontend

Chrome DevTools:
- F12
- Network tab: ver requests a /api/login
- Application tab: ver localStorage (pow_auth_token)
- Console: ver errores JavaScript

### Backend (/api)

Vercel Dashboard:
- Proyecto → Deployments
- Click en deployment
- Logs tab

O local con `vercel dev`:
- Stdout/stderr aparecen en terminal

## Stack Versions

React: 19.2.5
Vite: 8.0.10
TypeScript: 6.0.2
Node: 18+
Vercel: latest

## Next Steps

Ideas para expandir:
- Guardar fotos en servidor (requiere backend)
- Multi-usuario autenticacion
- Historial de fotos editadas
- Filtros avanzados (brillo, contraste)
- PWA offline support
- Dark mode

