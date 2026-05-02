import { useEffect, useRef } from 'react';

interface ImageEditorProps {
  photoUri: string;
  backgroundUri: string | null;
  transparency: number;
}

export default function ImageEditor({
  photoUri,
  backgroundUri,
  transparency,
}: ImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;

    const photo = new Image();
    photo.crossOrigin = 'anonymous';
    photo.onload = () => {
      if (cancelled) return;

      // Crop cuadrado centrado SIN distorsión, en resolución original
      const size = Math.min(photo.width, photo.height);
      const offsetX = (photo.width - size) / 2;
      const offsetY = (photo.height - size) / 2;

      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Máxima calidad de remuestreo (interpolación bicúbica/Lanczos según navegador)
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Dibujar foto recortada al cuadrado (sin distorsión, sin perder calidad)
      ctx.drawImage(photo, offsetX, offsetY, size, size, 0, 0, size, size);

      // Dibujar fondo encima con transparencia
      if (backgroundUri) {
        const bg = new Image();
        bg.crossOrigin = 'anonymous';
        bg.onload = () => {
          if (cancelled) return;
          ctx.globalAlpha = transparency;
          ctx.drawImage(bg, 0, 0, size, size);
          ctx.globalAlpha = 1.0;
        };
        bg.src = backgroundUri;
      }
    };
    photo.src = photoUri;

    return () => {
      cancelled = true;
    };
  }, [photoUri, backgroundUri, transparency]);

  return (
    <div className="editor-wrapper">
      <canvas ref={canvasRef} className="editor-canvas" />
    </div>
  );
}
