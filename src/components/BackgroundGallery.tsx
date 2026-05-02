import { useRef } from 'react';
import '../styles/BackgroundGallery.css';
import { removeWhiteBackground } from '../utils/imageProcessing';

interface BackgroundGalleryProps {
  backgrounds: string[];
  selectedBackground: string | null;
  onSelect: (uri: string | null) => void;
  onAdd: (uri: string) => void;
  onRemove: (uri: string) => void;
  compact?: boolean;
}

export default function BackgroundGallery({
  backgrounds,
  selectedBackground,
  onSelect,
  onAdd,
  onRemove,
  compact = false,
}: BackgroundGalleryProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      let uri = event.target?.result as string;
      const quitar = window.confirm(
        '¿Quieres quitar el fondo blanco/claro de esta imagen?\n\nIdeal para logos. Presiona "Aceptar" si tiene fondo blanco, o "Cancelar" si ya tiene transparencia o es una foto de fondo.'
      );
      if (quitar) {
        uri = await removeWhiteBackground(uri);
      }
      onAdd(uri);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className={`background-gallery ${compact ? 'compact' : ''}`}>
      <div className="gallery-grid">
        {/* Opción sin fondo */}
        <div
          className={`gallery-item ${!selectedBackground ? 'selected' : ''}`}
          onClick={() => onSelect(null)}
          title="Sin fondo"
        >
          <div className="item-empty">
            <span>✕</span>
            <p>Sin fondo</p>
          </div>
        </div>

        {/* Fondos cargados */}
        {backgrounds.map((bg, idx) => (
          <div
            key={`${bg}-${idx}`}
            className={`gallery-item ${selectedBackground === bg ? 'selected' : ''}`}
            onClick={() => onSelect(bg)}
          >
            <img src={bg} alt={`Fondo ${idx + 1}`} />
            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(bg);
              }}
              title="Eliminar fondo"
            >
              🗑️
            </button>
          </div>
        ))}

        {/* Botón agregar */}
        <div
          className="gallery-item add-item"
          onClick={() => inputRef.current?.click()}
          title="Agregar fondo"
        >
          <div className="item-add">
            <span>+</span>
            <p>Agregar</p>
          </div>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="file-input"
      />
    </div>
  );
}
