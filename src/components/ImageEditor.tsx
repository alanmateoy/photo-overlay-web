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

    const photo = new Image();
    photo.onload = () => {
      // Crop cuadrado centrado sin distorsión
      const size = Math.min(photo.width, photo.height);
      const offsetX = (photo.width - size) / 2;
      const offsetY = (photo.height - size) / 2;

      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Dibujar foto recortada al cuadrado (sin distorsión, sin perder calidad)
      ctx.drawImage(photo, offsetX, offsetY, size, size, 0, 0, size, size);

      // Dibujar fondo encima con transparencia
      if (backgroundUri) {
        const bg = new Image();
        bg.onload = () => {
          ctx.globalAlpha = transparency;
          ctx.drawImage(bg, 0, 0, size, size);
          ctx.globalAlpha = 1.0;
        };
        bg.src = backgroundUri;
      }
    };
    photo.src = photoUri;
  }, [photoUri, backgroundUri, transparency]);

  return (
    <div className="editor-wrapper">
      <canvas ref={canvasRef} className="editor-canvas" />
    </div>
  );
}
