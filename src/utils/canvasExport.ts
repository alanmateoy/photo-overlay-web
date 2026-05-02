// Utilidades para exportar el canvas en máxima calidad
// Centraliza la lógica de download / share para garantizar 1.0 quality siempre

const FILENAME_PREFIX = 'photo-overlay';

function timestampedFilename(ext: 'jpg' | 'png'): string {
  const ts = Date.now();
  return `${FILENAME_PREFIX}-${ts}.${ext}`;
}

/**
 * Convierte el canvas a Blob en JPEG con calidad 1.0 (máxima posible).
 * Si JPEG no está disponible, intenta PNG (lossless).
 */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: 'image/jpeg' | 'image/png' = 'image/jpeg'
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('No se pudo generar la imagen'));
      },
      format,
      1.0 // máxima calidad
    );
  });
}

/**
 * Convierte el canvas a un objeto File listo para Web Share API.
 */
export async function canvasToFile(
  canvas: HTMLCanvasElement,
  format: 'image/jpeg' | 'image/png' = 'image/jpeg'
): Promise<File> {
  const blob = await canvasToBlob(canvas, format);
  const ext = format === 'image/png' ? 'png' : 'jpg';
  return new File([blob], timestampedFilename(ext), { type: format });
}

/**
 * Detecta si el navegador puede compartir archivos vía Web Share API.
 * iPhone Safari, Android Chrome modernos lo soportan.
 */
export function canShareFiles(file: File): boolean {
  if (typeof navigator === 'undefined') return false;
  if (typeof navigator.share !== 'function') return false;
  if (typeof navigator.canShare !== 'function') return false;
  try {
    return navigator.canShare({ files: [file] });
  } catch {
    return false;
  }
}

/**
 * Comparte la foto editada vía la hoja nativa de iOS/Android.
 * Ahí el usuario puede elegir WhatsApp, Mensajes, "Guardar imagen", etc.
 *
 * Devuelve true si se compartió, false si fue cancelado o no soportado.
 */
export async function shareImage(canvas: HTMLCanvasElement): Promise<boolean> {
  const file = await canvasToFile(canvas, 'image/jpeg');

  if (canShareFiles(file)) {
    try {
      await navigator.share({
        files: [file],
        title: 'Foto editada',
      });
      return true;
    } catch (err) {
      // AbortError = el usuario canceló. No es un error real.
      if (err instanceof Error && err.name === 'AbortError') {
        return false;
      }
      throw err;
    }
  }

  // Fallback para escritorio / navegadores sin Web Share: descarga directa
  downloadFromBlob(file, file.name);
  return true;
}

/**
 * Descarga la foto al dispositivo en máxima calidad.
 * En iOS, abre la hoja de compartir con opción "Guardar imagen".
 * En escritorio y Android, descarga directamente como archivo.
 */
export async function saveImage(canvas: HTMLCanvasElement): Promise<void> {
  const file = await canvasToFile(canvas, 'image/jpeg');

  // iOS Safari: usar share sheet para que el usuario pueda elegir "Guardar imagen"
  // y que vaya directo a la galería de Fotos.
  if (canShareFiles(file)) {
    try {
      await navigator.share({
        files: [file],
        title: 'Guardar foto',
      });
      return;
    } catch (err) {
      // Si cancela o falla, caemos al download tradicional
      if (err instanceof Error && err.name !== 'AbortError') {
        console.warn('Share falló, usando descarga directa:', err);
      } else {
        return;
      }
    }
  }

  // Escritorio / fallback: descarga directa
  downloadFromBlob(file, file.name);
}

function downloadFromBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Liberar memoria un instante después
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
