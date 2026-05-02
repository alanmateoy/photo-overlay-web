import { useState, useCallback } from 'react';
import './App.css';
import PhotoUpload from './components/PhotoUpload';
import BackgroundGallery from './components/BackgroundGallery';
import ImageEditor from './components/ImageEditor';

function App() {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [backgrounds, setBackgrounds] = useState<string[]>([]);
  const [selectedBg, setSelectedBg] = useState<string | null>(null);
  const [transparency, setTransparency] = useState(0.4);

  const handlePhotoUpload = useCallback((uri: string) => {
    setPhotoUri(uri);
  }, []);

  const handleAddBackground = useCallback((uri: string) => {
    setBackgrounds(prev => [...prev, uri]);
    if (!selectedBg) setSelectedBg(uri);
  }, [selectedBg]);

  const handleRemoveBackground = useCallback((uri: string) => {
    setBackgrounds(prev => prev.filter(bg => bg !== uri));
    if (selectedBg === uri) setSelectedBg(null);
  }, [selectedBg]);

  const handleClear = useCallback(() => {
    setPhotoUri(null);
    setTransparency(0.4);
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>📸 Photo Overlay Studio</h1>
        <p>Sube fotos y personaliza con fondos</p>
      </header>

      <main className="container">
        {!photoUri ? (
          <div className="upload-section">
            <PhotoUpload onPhotoUpload={handlePhotoUpload} />

            <section className="backgrounds-section">
              <h2>Fondos disponibles</h2>
              <BackgroundGallery
                backgrounds={backgrounds}
                selectedBackground={selectedBg}
                onSelect={setSelectedBg}
                onAdd={handleAddBackground}
                onRemove={handleRemoveBackground}
              />
            </section>
          </div>
        ) : (
          <div className="editor-section">
            <div className="editor-container">
              <ImageEditor
                photoUri={photoUri}
                backgroundUri={selectedBg}
                transparency={transparency}
              />
            </div>

            <div className="controls">
              <div className="backgrounds-sidebar">
                <h3>Fondos</h3>
                <BackgroundGallery
                  backgrounds={backgrounds}
                  selectedBackground={selectedBg}
                  onSelect={setSelectedBg}
                  onAdd={handleAddBackground}
                  onRemove={handleRemoveBackground}
                  compact
                />
              </div>

              <div className="editor-controls">
                {selectedBg && (
                  <div className="slider-container">
                    <label>Opacidad del fondo: {Math.round(transparency * 100)}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={Math.round(transparency * 100)}
                      onChange={(e) => setTransparency(parseInt(e.target.value) / 100)}
                      className="slider"
                    />
                  </div>
                )}

                <div className="action-buttons">
                  <button className="btn btn-download" onClick={() => {
                    const canvas = document.querySelector('canvas');
                    if (canvas) {
                      const link = document.createElement('a');
                      link.href = canvas.toDataURL('image/jpeg', 1.0);
                      link.download = `photo-overlay-${Date.now()}.jpg`;
                      link.click();
                    }
                  }}>
                    ⬇️ Descargar
                  </button>
                  <button className="btn btn-clear" onClick={handleClear}>
                    ↶ Nueva foto
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Hecho con ❤️ - Máxima calidad garantizada</p>
      </footer>
    </div>
  );
}

export default App;
