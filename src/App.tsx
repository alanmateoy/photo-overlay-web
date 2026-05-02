import { useState, useCallback, useEffect, useRef } from 'react';
import './App.css';
import PhotoUpload from './components/PhotoUpload';
import BackgroundGallery from './components/BackgroundGallery';
import ImageEditor from './components/ImageEditor';
import { loadDefaultBackgrounds } from './utils/defaultBackgrounds';
import { shareImage, saveImage } from './utils/canvasExport';

function App() {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [backgrounds, setBackgrounds] = useState<string[]>([]);
  const [selectedBg, setSelectedBg] = useState<string | null>(null);
  const [transparency, setTransparency] = useState(0.4);
  const [defaultsLoaded, setDefaultsLoaded] = useState(false);
  // Set de URIs de fondos predefinidos (no se pueden eliminar)
  const [defaultUris, setDefaultUris] = useState<Set<string>>(() => new Set());
  const [busy, setBusy] = useState<null | 'share' | 'save'>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const feedbackTimer = useRef<number | null>(null);

  // Cargar los fondos predefinidos al iniciar la app
  useEffect(() => {
    if (defaultsLoaded) return;

    let cancelled = false;
    loadDefaultBackgrounds().then((defaults) => {
      if (cancelled || defaults.length === 0) return;
      setBackgrounds((prev) => {
        const existing = new Set(prev);
        const merged = [...prev];
        for (const d of defaults) {
          if (!existing.has(d)) merged.push(d);
        }
        return merged;
      });
      setDefaultUris(new Set(defaults));
      setSelectedBg((current) => current ?? defaults[0] ?? null);
      setDefaultsLoaded(true);
    });

    return () => {
      cancelled = true;
    };
  }, [defaultsLoaded]);

  const showFeedback = useCallback((msg: string) => {
    setFeedback(msg);
    if (feedbackTimer.current) {
      window.clearTimeout(feedbackTimer.current);
    }
    feedbackTimer.current = window.setTimeout(() => {
      setFeedback(null);
    }, 2500);
  }, []);

  const handlePhotoUpload = useCallback((uri: string) => {
    setPhotoUri(uri);
  }, []);

  const handleAddBackground = useCallback((uri: string) => {
    setBackgrounds((prev) => [...prev, uri]);
    setSelectedBg((current) => current ?? uri);
  }, []);

  const handleRemoveBackground = useCallback((uri: string) => {
    // Los fondos predefinidos NO se pueden eliminar (defensa adicional
    // a la lógica de la galería que ya oculta el botón).
    if (defaultUris.has(uri)) return;
    setBackgrounds((prev) => prev.filter((bg) => bg !== uri));
    setSelectedBg((current) => (current === uri ? null : current));
  }, [defaultUris]);

  const handleClear = useCallback(() => {
    setPhotoUri(null);
    setTransparency(0.4);
  }, []);

  const handleShareWhatsApp = useCallback(async () => {
    if (busy) return;
    const canvas = document.querySelector<HTMLCanvasElement>('canvas.editor-canvas');
    if (!canvas) return;
    setBusy('share');
    try {
      const ok = await shareImage(canvas);
      if (ok) showFeedback('✅ Listo para enviar');
    } catch (err) {
      console.error(err);
      showFeedback('❌ No se pudo compartir');
    } finally {
      setBusy(null);
    }
  }, [busy, showFeedback]);

  const handleSave = useCallback(async () => {
    if (busy) return;
    const canvas = document.querySelector<HTMLCanvasElement>('canvas.editor-canvas');
    if (!canvas) return;
    setBusy('save');
    try {
      await saveImage(canvas);
      showFeedback('✅ Imagen guardada');
    } catch (err) {
      console.error(err);
      showFeedback('❌ No se pudo guardar');
    } finally {
      setBusy(null);
    }
  }, [busy, showFeedback]);

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
                defaultBackgrounds={defaultUris}
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
                  defaultBackgrounds={defaultUris}
                  compact
                />
              </div>

              <div className="editor-controls">
                {selectedBg && (
                  <div className="slider-container">
                    <label>
                      Opacidad del fondo: {Math.round(transparency * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={Math.round(transparency * 100)}
                      onChange={(e) =>
                        setTransparency(parseInt(e.target.value, 10) / 100)
                      }
                      className="slider"
                    />
                  </div>
                )}

                <div className="action-buttons">
                  <button
                    className="btn btn-whatsapp"
                    onClick={handleShareWhatsApp}
                    disabled={busy !== null}
                  >
                    {busy === 'share' ? '📤 Preparando…' : '📤 Enviar a WhatsApp'}
                  </button>

                  <button
                    className="btn btn-save"
                    onClick={handleSave}
                    disabled={busy !== null}
                  >
                    {busy === 'save' ? '💾 Guardando…' : '💾 Guardar copia'}
                  </button>

                  <button
                    className="btn btn-clear"
                    onClick={handleClear}
                    disabled={busy !== null}
                  >
                    ↶ Nueva foto
                  </button>
                </div>

                {feedback && <div className="feedback-toast">{feedback}</div>}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Sistema privado · Máxima calidad garantizada</p>
      </footer>
    </div>
  );
}

export default App;
