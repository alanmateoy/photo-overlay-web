import { useRef } from 'react';

interface PhotoUploadProps {
  onPhotoUpload: (uri: string) => void;
}

export default function PhotoUpload({ onPhotoUpload }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const uri = event.target?.result as string;
        onPhotoUpload(uri);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="upload-box">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="file-input"
      />
      <button
        className="btn btn-upload"
        onClick={() => inputRef.current?.click()}
      >
        📤 Sube tu foto
      </button>
      <p className="upload-hint">
        Selecciona una imagen JPG, PNG o cualquier formato.
        <br />
        Se mantendrá el 100% de calidad.
      </p>
    </div>
  );
}
