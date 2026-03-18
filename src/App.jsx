import { useState } from 'react';
import Roulette from './components/Roulette';
import Uploader from './components/Uploader';

function App() {
  const [images, setImages] = useState([]);

  return (
    <div style={{ backgroundColor: '#050505', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      {images.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '20px', boxSizing: 'border-box' }}>
          <div style={{ width: '100%', maxWidth: '600px' }}>
            <Uploader setImages={setImages} />
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <Roulette items={images} />
          
          <button 
            onClick={() => setImages([])}
            style={{
              marginTop: '40px',
              background: 'transparent',
              color: '#444',
              border: '1px solid #222',
              padding: '10px 20px',
              marginBottom: '50px',
              cursor: 'pointer',
              fontSize: '10px',
              letterSpacing: '2px'
            }}
          >
            VOLVER A SUBIR IMÁGENES
          </button>
        </div>
      )}
    </div>
  );
}

export default App;