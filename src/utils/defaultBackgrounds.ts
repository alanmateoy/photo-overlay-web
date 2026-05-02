import { removeWhiteBackground } from './imageProcessing';

// Rutas de los fondos predefinidos. Vienen de /public/fondos/.
const DEFAULT_BACKGROUND_PATHS = [
  '/fondos/2_upscaled.png',
  '/fondos/3_upscaled.png',
  '/fondos/4_upscaled.png',
];

// Tolerancia para detectar pixeles "blancos" en los logos.
// 35-40 funciona bien para fondos JPG-comprimidos donde el blanco
// no es exactamente 255,255,255.
const WHITE_TOLERANCE = 38;

async function fetchAsDataUri(url: string): Promise<string> {
  const response = await fetch(url, { cache: 'force-cache' });
  if (!response.ok) {
    throw new Error(`No se pudo cargar ${url}: ${response.status}`);
  }
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/**
 * Carga los fondos predefinidos en paralelo, les remueve el fondo
 * blanco, y devuelve los data URIs listos para usarse como overlays.
 *
 * Si alguno falla, lo omite silenciosamente (la app sigue funcionando).
 */
export async function loadDefaultBackgrounds(): Promise<string[]> {
  const tasks = DEFAULT_BACKGROUND_PATHS.map(async (path) => {
    try {
      const dataUri = await fetchAsDataUri(path);
      const transparent = await removeWhiteBackground(dataUri, WHITE_TOLERANCE);
      return transparent;
    } catch (err) {
      console.error(`Error cargando fondo ${path}:`, err);
      return null;
    }
  });

  const results = await Promise.all(tasks);
  return results.filter((r): r is string => r !== null);
}
