import { useState } from 'react';

const Uploader = ({ setImages }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileCount, setFileCount] = useState(0);
  const uploadAudio = new Audio('/opencase.m4a');

  const handleFiles = (filesList) => {
    const files = Array.from(filesList).slice(0, 40);
    if (files.length > 0) {
      setFileCount(files.length);
      uploadAudio.play().catch(() => {});
      const urls = files.map(file => URL.createObjectURL(file));
      setImages(urls);
    }
  };

  const handleChange = (e) => {
    handleFiles(e.target.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{ 
        border: isDragging ? '2px dashed #facc15' : '2px dashed #333',
        padding: '100px 60px', 
        borderRadius: '4px', 
        textAlign: 'center', 
        backgroundColor: isDragging ? 'rgba(250, 204, 21, 0.05)' : '#0a0a0b', 
        boxShadow: '0 30px 60px rgba(0,0,0,0.8)',
        position: 'relative',
        transition: 'all 0.2s ease',
        maxWidth: '600px',
        margin: '20px auto',
        cursor: 'pointer'
      }}
    >
      {/* DECORACIÓN ESQUINAS TÁCTICAS */}
      <div style={{ position: 'absolute', top: '10px', left: '10px', width: '20px', height: '20px', borderTop: '2px solid #444', borderLeft: '2px solid #444' }} />
      <div style={{ position: 'absolute', top: '10px', right: '10px', width: '20px', height: '20px', borderTop: '2px solid #444', borderRight: '2px solid #444' }} />
      <div style={{ position: 'absolute', bottom: '10px', left: '10px', width: '20px', height: '20px', borderBottom: '2px solid #444', borderLeft: '2px solid #444' }} />
      <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '20px', height: '20px', borderBottom: '2px solid #444', borderRight: '2px solid #444' }} />

      {/* ICONO CENTRAL */}
      <div style={{ fontSize: '50px', marginBottom: '20px', opacity: isDragging ? 1 : 0.4, color: isDragging ? '#facc15' : '#fff' }}>
        📦
      </div>

      <h3 style={{ color: '#fff', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>
        {isDragging ? 'Suelta para Añadirla' : 'Suministra tus opciones'}
      </h3>
      
      <p style={{ color: '#666', fontSize: '12px', marginBottom: '30px', textTransform: 'uppercase' }}>
        O arrastra tus cartex
      </p>

      <input 
        type="file" 
        multiple 
        accept="image/*" 
        onChange={handleChange} 
        id="file" 
        style={{ display: 'none' }} 
      />
      
      <label 
        htmlFor="file" 
        style={{ 
          backgroundColor: '#facc15', 
          color: '#000', 
          padding: '14px 35px', 
          fontWeight: '900', 
          cursor: 'pointer', 
          fontSize: '12px', 
          textTransform: 'uppercase',
          letterSpacing: '1px',
          boxShadow: '0 4px 0 #b48608',
          display: 'inline-block',
          transition: 'transform 0.1s'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#ffeb3b'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#facc15'}
      >
        Seleccionar Imagenes
      </label>

      {fileCount > 0 && (
        <div style={{ marginTop: '25px', color: '#4b69ff', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>
          ● {fileCount} Imágenes encriptadas listas para el sorteo
        </div>
      )}

    </div>
  );
};

export default Uploader;