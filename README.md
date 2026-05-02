# 📸 Photo Overlay Studio

**Versión:** 1.0.0  
**Estado:** Producción ✅  
**Último actualizado:** Mayo 2026

## 🎯 Descripción General

**Photo Overlay Studio** es una aplicación web privada y segura para editar fotos con fondos personalizados. Permite:

- 📤 Subir fotos en cualquier formato
- 🎨 Superponerle fondos con transparencia ajustable
- 📸 Recorte inteligente a formato cuadrado sin distorsión
- 🔄 Remover fondos blancos automáticamente
- 📱 Compartir directamente a WhatsApp en máxima calidad
- 💾 Guardar en galería en máxima calidad JPEG

**Diseñada para:** Almacenes, estudios fotográficos, y negocios que necesitan editar fotos rápidamente.

**Seguridad:** Acceso protegido con contraseña de 24 horas. Sistema privado, no indexable en Google.

---

## 🚀 Inicio Rápido

### Para Usuarios

1. Abre: **https://photo-overlay-web.vercel.app**
2. Ingresa la contraseña
3. Sube una foto
4. Selecciona un fondo (o sube el tuyo)
5. Ajusta la opacidad
6. Comparte a WhatsApp o guarda

### Para Desarrolladores

```bash
# Clonar repositorio
git clone https://github.com/usuario/photo-overlay-web.git
cd photo-overlay-web

# Instalar dependencias
npm install

# Desarrollo local (requiere Vercel CLI para /api)
vercel dev

# O solo frontend (sin login):
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

---

## 📊 Características Principales

| Característica | Descripción | Estado |
|---|---|---|
| **Login seguro** | Contraseña con token 24h | ✅ Activo |
| **Fondos predefinidos** | 4 fondos preconfigurados | ✅ Activo |
| **Upload de fondos** | Usuarios pueden subir sus propios | ✅ Activo |
| **Remover fondo blanco** | Automático para logos | ✅ Activo |
| **Crop a cuadrado** | Sin distorsión, resolución original | ✅ Activo |
| **Compartir a WhatsApp** | Web Share API, máxima calidad | ✅ Activo |
| **Guardar en galería** | iOS/Android, JPEG quality 1.0 | ✅ Activo |
| **Slider de opacidad** | Ajuste fino 0-100% | ✅ Activo |
| **Responsive mobile** | Optimizado para iPhone | ✅ Activo |
| **Headers de seguridad** | HSTS, X-Frame-Options, etc. | ✅ Activo |
| **Rate limiting** | 3 intentos, 15 min lockout | ✅ Activo |
| **No indexable** | robots.txt + meta noindex | ✅ Activo |

---

## 🏗️ Arquitectura

```
Frontend (React 19 + Vite)
├── src/
│   ├── components/
│   │   ├── LoginScreen.tsx (Pantalla de login)
│   │   ├── PhotoUpload.tsx (Upload de foto)
│   │   ├── ImageEditor.tsx (Canvas, composición)
│   │   └── BackgroundGallery.tsx (Galería de fondos)
│   ├── utils/
│   │   ├── auth.ts (Token de sesión 24h)
│   │   ├── imageProcessing.ts (Remover fondo blanco)
│   │   ├── defaultBackgrounds.ts (Cargar 4 fondos)
│   │   └── canvasExport.ts (Compartir/Guardar máxima calidad)
│   ├── styles/
│   │   ├── App.css (Estilos principales)
│   │   ├── LoginScreen.css (Login responsive)
│   │   └── BackgroundGallery.css (Galería)
│   └── App.tsx (Componente raíz, orquesta todo)
│
Backend (Vercel Serverless)
└── api/
    └── login.ts (POST /api/login - Validación + token)

Static Assets
├── public/
│   ├── fondos/ (4 PNGs upscaleados)
│   └── robots.txt (Bloquea Google)

Config
├── vercel.json (Headers de seguridad, rewrite rules)
├── vite.config.ts (Build config)
├── tsconfig.json (TypeScript config)
└── package.json (Dependencias)
```

---

## 🔐 Seguridad Implementada

### Contraseña
- ✅ Vive en variable de entorno Vercel (NUNCA en código)
- ✅ Comparación con tiempo constante (anti-timing attack)
- ✅ 3 intentos máximo, bloqueo de 15 minutos
- ✅ Token firmado con HMAC-SHA256
- ✅ Sesión de 24 horas

### Headers HTTP
- ✅ `Strict-Transport-Security` (HSTS, 2 años)
- ✅ `X-Frame-Options: DENY` (anti-clickjacking)
- ✅ `X-Content-Type-Options: nosniff`
- ✅ `Referrer-Policy: no-referrer`
- ✅ `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet`

### Privacidad
- ✅ `robots.txt` bloquea indexación Google
- ✅ Meta tags `noindex, nofollow`
- ✅ Sin cookies de tracking
- ✅ Sin envío de datos a terceros
- ✅ Procesamiento 100% en el navegador del cliente

---

## 📱 Compatibilidad

| Navegador | Desktop | Mobile | Notas |
|---|---|---|---|
| **Chrome/Edge** | ✅ | ✅ | Web Share API completo |
| **Firefox** | ✅ | ✅ (Android) | Web Share API en Android |
| **Safari** | ✅ | ✅ | Web Share API iOS 13+ |
| **iPhone Safari** | N/A | ✅ | Optimizado, autocompletar de iOS |
| **Android Chrome** | N/A | ✅ | Optimizado, Web Share API |

---

## 💾 Requerimientos de Servidor

**Hosting:** Vercel (gratis)  
**Base de datos:** Ninguno (sin servidor, frontend only)  
**Almacenamiento:** Ninguno (procesamiento local en navegador)  
**Región:** Global (CDN automático)  

---

## 📦 Dependencias Principales

```json
{
  "react": "^19.2.5",
  "react-dom": "^19.2.5",
  "@vercel/node": "^5.7.15"
}
```

**Nota:** Cero dependencias externas para procesamiento de imágenes. Todo usa APIs nativas del navegador (Canvas, FileReader, Web Share).

---

## 🔄 Flujo de Usuario

```
1. Usuario abre app
   ↓
2. Si NO está autenticado → LoginScreen
   ├─ Escribe contraseña
   ├─ Servidor valida (/api/login)
   ├─ Si correcto → genera token 24h
   └─ Si incorrecto → muestra error
   ↓
3. Pantalla de upload
   ├─ Sube foto (cualquier formato)
   ├─ Ve 4 fondos predefinidos
   └─ Opción de subir más fondos
   ↓
4. Pantalla de edición
   ├─ Canvas mostrando foto + fondo
   ├─ Slider de opacidad
   ├─ Botón "Enviar a WhatsApp" → Web Share
   ├─ Botón "Guardar copia" → Descarga/Share
   └─ Botón "Nueva foto" → Vuelve a upload
   ↓
5. Compartir o guardar
   └─ iOS/Android share sheet → usuario elige
```

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| **Frontend** | React | 19.2.5 |
| **Bundler** | Vite | 8.0.10 |
| **Lenguaje** | TypeScript | 6.0.2 |
| **Styling** | CSS puro | - |
| **Backend** | Node.js (Vercel) | latest |
| **Hosting** | Vercel | - |
| **VCS** | GitHub | - |
| **Package Manager** | NPM | - |

---

## 🚀 Despliegue

La aplicación se despliega automáticamente en Vercel cuando haces push a la rama `main` de GitHub.

```bash
git add -A
git commit -m "Cambio description"
git push origin main
# Vercel detecta automáticamente → deploy en ~1 minuto
```

**URL de producción:** https://photo-overlay-web.vercel.app

---

## ⚙️ Configuración Requerida

### Variables de Entorno (Vercel)

```
PASSWORD=Xm9!Kp$2vNqR7#tEbW8hLyZ&jB4
AUTH_SECRET=(auto-generado internamente)
```

---

## 📞 Soporte

Para reportar bugs o sugerencias:
1. Crea un issue en GitHub
2. Describe el problema detalladamente
3. Incluye capturas si es posible

---

## 📄 Licencia

Privado - Uso interno únicamente.

---

**Última actualización:** Mayo 2, 2026  
**Autor:** Equipo de Desarrollo  
**Estado:** ✅ Producción
