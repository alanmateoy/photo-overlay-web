# Guia de Despliegue

Documento: DEPLOYMENT.md
Version: 1.0.0

## Despliegue Automatico en Vercel

### Paso 1: Push a GitHub

Cada push a rama main dispara un deploy automatico en Vercel.

git add -A
git commit -m "Descripcion de cambios"
git push origin main

### Paso 2: Configurar Variable de Entorno

1. Ve a: https://vercel.com/alanmateoy-projects/photo-overlay-web
2. Click en Settings
3. Click en Environments
4. Click en Production
5. Click en Add Environment Variable
6. Completa:
   - Key: PASSWORD
   - Value: Xm9!Kp$2vNqR7#tEbW8hLyZ&jB4
   - Environments: Marca todas
7. Click Save

### Paso 3: Redeploy

1. Ve a Deployments
2. Click en los 3 puntos del ultimo deploy
3. Click en Redeploy
4. Espera a que termine (verde checkmark)

## URL de Produccion

https://photo-overlay-web.vercel.app

Este es el link definitivo que funciona siempre.

## Configuracion Local

Para probar con /api/login localmente:

npm install -g vercel
vercel dev

Luego abre: http://localhost:3000

## Rollback

Si algo falla, en Deployments click en deployment anterior y marca como Production.

## Variables de Entorno

Solo una requerida:
PASSWORD=Xm9!Kp$2vNqR7#tEbW8hLyZ&jB4

## Monitoreo

Vercel proporciona automaticamente:
- Uptime monitoring
- Error logs
- Performance analytics
- SSL/HTTPS automatico

