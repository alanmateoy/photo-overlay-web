# Especificacion de Requerimientos

**Documento:** REQUIREMENTS.md  
**Version:** 1.0.0  
**Ultima actualizacion:** Mayo 2026  
**Estado:** Completado

## 1. REQUERIMIENTOS FUNCIONALES (RF)

### 1.1 Autenticacion y Seguridad

- **RF-1.1:** El sistema debe solicitar contrasena al acceder
- **RF-1.2:** La contrasena debe venir de variable de entorno (no en codigo)
- **RF-1.3:** Comparacion de contrasena debe ser constante en tiempo
- **RF-1.4:** Maximo 3 intentos de contrasena fallidos por IP
- **RF-1.5:** Bloqueo de 15 minutos despues de 3 intentos fallidos
- **RF-1.6:** Sesion valida por 24 horas desde login correcto
- **RF-1.7:** Token firmado criptograficamente (HMAC-SHA256)
- **RF-1.8:** Sin boton de logout (sesion se expira automaticamente)

### 1.2 Gestion de Fotos

- **RF-2.1:** Usuario debe poder subir foto en cualquier formato
- **RF-2.2:** Foto debe recortarse a cuadrado automaticamente
- **RF-2.3:** Recorte debe estar centrado (sin distorsion)
- **RF-2.4:** Foto debe mantenerse en su resolucion original
- **RF-2.5:** Sistema debe mantener maxima calidad en todo el proceso

### 1.3 Gestion de Fondos

- **RF-3.1:** Sistema debe incluir 4 fondos predefinidos
- **RF-3.2:** Fondos predefinidos cargan automaticamente al login
- **RF-3.3:** Usuario puede subir fondos adicionales
- **RF-3.4:** Usuario puede remover fondos
- **RF-3.5:** Sistema debe remover fondo blanco automaticamente
- **RF-3.6:** Tolerancia de deteccion de blanco: 35-40 pixeles

### 1.4 Edicion de Imagen

- **RF-4.1:** Canvas debe mostrar foto + fondo superpuesto
- **RF-4.2:** Opacidad del fondo debe ajustarse de 0-100 porciento
- **RF-4.3:** Slider de opacidad debe actualizar en tiempo real
- **RF-4.4:** Canvas debe usar remuestreo de alta calidad

### 1.5 Exportacion y Compartir

- **RF-5.1:** Usuario debe poder enviar a WhatsApp directamente
- **RF-5.2:** Envio a WhatsApp debe usar Web Share API
- **RF-5.3:** Imagen debe exportarse en JPEG quality 1.0
- **RF-5.4:** Usuario debe poder guardar copia en galeria
- **RF-5.5:** Nombre de archivo debe incluir timestamp

---

## 2. REQUERIMIENTOS NO FUNCIONALES (RNF)

### 2.1 Rendimiento

- **RNF-1.1:** Pagina debe cargar en menos de 2 segundos
- **RNF-1.2:** Login debe responder en menos de 500ms
- **RNF-1.3:** Canvas debe renderizar en menos de 1 segundo
- **RNF-1.4:** Compartir debe completarse en menos de 3 segundos

### 2.2 Escalabilidad

- **RNF-2.1:** Debe soportar multiples usuarios simultaneos
- **RNF-2.2:** Sin servidor/base de datos (serverless)
- **RNF-2.3:** Procesamiento en navegador del cliente
- **RNF-2.4:** Auto-escalable via CDN (Vercel)

### 2.3 Seguridad

- **RNF-3.1:** Conexion HTTPS obligatoria
- **RNF-3.2:** HSTS activado (2 anos)
- **RNF-3.3:** No indexable en Google
- **RNF-3.4:** No vulnerable a clickjacking
- **RNF-3.5:** Headers de seguridad completos
- **RNF-3.6:** Sin cookies de tracking
- **RNF-3.7:** Sin almacenamiento de datos sensibles

### 2.4 Compatibilidad

- **RNF-4.1:** Debe funcionar en iPhone Safari iOS 13+
- **RNF-4.2:** Debe funcionar en Android Chrome 8+
- **RNF-4.3:** Debe funcionar en Desktop (Chrome, Firefox, Safari, Edge)
- **RNF-4.4:** Responsive para viewport movil (375px+)

### 2.5 Mantenibilidad

- **RNF-5.1:** Codigo debe estar tipado (TypeScript)
- **RNF-5.2:** Documentacion completa
- **RNF-5.3:** Desplegable en menos de 2 minutos
- **RNF-5.4:** Cambios de contrasena sin modificar codigo

---

## 3. RESTRICCIONES

- **No backend:** Cero servidor de base de datos
- **No almacenamiento:** Las fotos/fondos NO se guardan en servidor
- **Una contrasena:** Todos comparten la misma contrasena
- **Sesion 24h:** Login se expira automaticamente
- **Mobile first:** Optimizado para iPhone
- **Vercel free:** Debe funcionar en tier gratuito

---

**Documento completado:** Mayo 2, 2026
**Responsable:** Equipo Tecnico
