import { useState } from 'react';
import Uploader from './components/Uploader';
import Roulette from './components/Roulette';

function App() {
  const [images, setImages] = useState([]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050505', color: 'white', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      {images.length === 0 ? (
        <Uploader setImages={setImages} />
      ) : (
        <div style={{ width: '100%' }}>
          <Roulette items={images} />
          <button 
            onClick={() => setImages([])}
            style={{ display: 'block', margin: '30px auto', background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px' }}
          >
            Reiniciar Galería
          </button>
        </div>
      )}
    </div>
  );
}

export default App;