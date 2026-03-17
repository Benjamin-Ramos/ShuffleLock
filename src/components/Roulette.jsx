import { useState, useRef } from 'react';
import {
  motion,
  useAnimation,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import confetti from 'canvas-confetti';

const colors = ['#4b69ff', '#8847ff', '#d32ce6', '#eb4b4b', '#ffd700'];

const Roulette = ({ items }) => {
  const controls = useAnimation();
  const [rolling, setRolling] = useState(false);
  const [winnerImage, setWinnerImage] = useState(null);
  const [winnerColor, setWinnerColor] = useState(null);
  const startAudio = useRef(new Audio('/start.m4a'));
  const timerRef = useRef(null);
  const lastTickIndex = useRef(0);
  const finalWinIdx = useRef(0);

  const xMouse = useMotionValue(0);
  const yMouse = useMotionValue(0);
  const rotateX = useSpring(
    useTransform(yMouse, [-0.5, 0.5], [20, -20]),
    { stiffness: 150, damping: 20 }
  );
  const rotateY = useSpring(
    useTransform(xMouse, [-0.5, 0.5], [-20, 20]),
    { stiffness: 150, damping: 20 }
  );
  const glareX = useTransform(xMouse, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(yMouse, [-0.5, 0.5], ['0%', '100%']);

  const cardWidth = 180;
  const gap = 12;
  const totalStep = cardWidth + gap;
  const displayItems = Array(20).fill(items).flat();

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    xMouse.set(x);
    yMouse.set(y);
  };

  const playTick = () => {
    const tick = new Audio('/click.m4a');
    tick.volume = 0.25;
    tick.play().catch(() => {});
  };

  const spin = async () => {
    if (rolling) return;
    setRolling(true);
    setWinnerImage(null);
    setWinnerColor(null);
    startAudio.current.currentTime = 0;
    startAudio.current.play().catch(() => {});

    const duration = 9000;
    const winIdx = Math.floor(Math.random() * items.length) + 100;
    finalWinIdx.current = winIdx;
    const targetX = winIdx * totalStep;
    const startTime = Date.now();

    lastTickIndex.current = 0;
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 4);
      const currentX = easeOut * targetX;
      const currentIndex = Math.floor(currentX / totalStep);
      if (currentIndex > lastTickIndex.current) {
        playTick();
        lastTickIndex.current = currentIndex;
      }
      if (progress >= 1) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }, 16);

    await controls.start({
      x: -targetX,
      transition: { duration: duration / 1000, ease: [0.1, 0, 0.05, 1] },
    });

    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });

    setTimeout(() => {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setWinnerImage(displayItems[finalWinIdx.current]);
      setWinnerColor(randomColor);
      setRolling(false);
    }, 300);
  };

  return (
    <div
      style={{
        width: '100vw',
        minHeight: '90vh',
        background: 'radial-gradient(circle, #1a1b21 0%, #050505 100%)', // Fondo CSGO
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* TÍTULO DEL CASO */}
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ color: '#fff', fontSize: '42px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', margin: 0 }}>
          Shuffle <span style={{ color: '#facc15' }}>Lock</span>
        </h1>
      </div>

      {/* RULETA ESTILO CSGO */}
      <div
        style={{
          background: 'rgba(0,0,0,0.4)',
          width: '100%',
          height: '280px',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          borderTop: '2px solid rgba(255,255,255,0.05)',
          borderBottom: '2px solid rgba(255,255,255,0.05)',
          boxShadow: 'inset 0 0 50px #000',
        }}
      >
        {/* SELECTOR CENTRAL (FLECHAS CSGO) */}
        <div style={{ position: 'absolute', left: '50%', top: '-15px', zIndex: 110, transform: 'translateX(-50%)' }}>
          <div style={{ width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: '15px solid #facc15' }} />
        </div>
        <div style={{
          position: 'absolute',
          left: '50%',
          width: '2px',
          height: '100%',
          backgroundColor: '#facc15',
          zIndex: 100,
          transform: 'translateX(-50%)',
          boxShadow: '0 0 15px rgba(250,204,21,0.5)',
        }} />
        <div style={{ position: 'absolute', left: '50%', bottom: '-15px', zIndex: 110, transform: 'translateX(-50%)' }}>
          <div style={{ width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderBottom: '15px solid #facc15' }} />
        </div>

        {/* GRADIENTES LATERALES PARA OCULTAR ITEMS */}
        <div style={{ position: 'absolute', left: 0, width: '25%', height: '100%', background: 'linear-gradient(to right, #050505, transparent)', zIndex: 10 }} />
        <div style={{ position: 'absolute', right: 0, width: '25%', height: '100%', background: 'linear-gradient(to left, #050505, transparent)', zIndex: 10 }} />

        <motion.div
          style={{
            display: 'flex',
            gap: `${gap}px`,
            paddingLeft: 'calc(50vw - 90px)',
          }}
          animate={controls}
          initial={{ x: 0 }}
        >
          {displayItems.map((src, i) => (
            <div
              key={i}
              style={{
                width: cardWidth,
                height: 220,
                flexShrink: 0,
                background: 'linear-gradient(180deg, #1e1e24 0%, #111115 100%)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <img
                src={src}
                style={{ width: '85%', height: 'auto', objectFit: 'contain' }}
                draggable="false"
              />
              {/* BARRA DE COLOR ABAJO */}
              <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '5px', background: colors[i % colors.length] }} />
            </div>
          ))}
        </motion.div>
      </div>

      <button
        onClick={spin}
        disabled={rolling}
        style={{
          marginTop: '60px',
          padding: '15px 60px',
          fontSize: '16px',
          fontWeight: 'bold',
          border: 'none',
          backgroundColor: rolling ? '#111' : '#4b69ff',
          color: '#fff',
          cursor: rolling ? 'default' : 'pointer',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          boxShadow: rolling ? 'none' : '0 4px 0 #2a3eb1',
          transition: 'all 0.1s',
        }}
        onMouseDown={(e) => !rolling && (e.currentTarget.style.transform = 'translateY(2px)', e.currentTarget.style.boxShadow = 'none')}
        onMouseUp={(e) => !rolling && (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = '0 4px 0 #2a3eb1')}
      >
        {rolling ? 'Abriendo...' : 'Abrir'}
      </button>

      {/* MODAL GANADOR (SIN CAMBIOS) */}
      <AnimatePresence>
        {winnerImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0,0,0,0.96)',
              zIndex: 200,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(16px)',
              perspective: '1200px',
              overflow: 'hidden',
            }}
            onClick={() => {
              setWinnerImage(null);
              setWinnerColor(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                width: '140%',
                height: '70%',
                background:
                  'radial-gradient(circle at 20% 0%, rgba(59,130,246,0.45), transparent 60%), radial-gradient(circle at 80% 100%, rgba(244,63,94,0.45), transparent 60%)',
                filter: 'blur(28px)',
              }}
            />
            <motion.div
              initial={{ x: '-60%' }}
              animate={{ x: '60%' }}
              exit={{ opacity: 0 }}
              transition={{
                repeat: Infinity,
                repeatType: 'mirror',
                duration: 4.5,
                ease: 'linear',
              }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '-10%',
                width: '120%',
                height: 2,
                background:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)',
                opacity: 0.9,
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0, rotateY: 180 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 12, stiffness: 80 }}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => {
                xMouse.set(0);
                yMouse.set(0);
              }}
              style={{
                width: '380px',
                height: '540px',
                cursor: 'pointer',
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
                position: 'relative',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  border: `2px solid ${
                    winnerColor || 'rgba(255,255,255,0.4)'
                  }`,
                  boxShadow: `0 40px 120px ${
                    winnerColor || 'rgba(0,0,0,0.9)'
                  }`,
                  background:
                    'radial-gradient(circle at 0% 0%, rgba(255,255,255,0.06), transparent 50%), #000',
                  position: 'relative',
                }}
              >
                <img
                  src={winnerImage}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'translateZ(0)',
                  }}
                />
                <motion.div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.35) 0%, transparent 70%)`,
                    mixBlendMode: 'screen',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Roulette;