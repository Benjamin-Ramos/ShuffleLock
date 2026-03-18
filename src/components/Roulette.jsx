import { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import confetti from 'canvas-confetti';

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const Roulette = ({ items }) => {
  const controls = useAnimation();
  const rouletteRef = useRef(null);

  const [rolling, setRolling] = useState(false);
  const [winnerImage, setWinnerImage] = useState(null);
  const [winnerColor, setWinnerColor] = useState(null);
  const [history, setHistory] = useState([]);
  const [displayList, setDisplayList] = useState([]);

  const cardWidth = 220;
  const gap = 12;
  const totalStep = cardWidth + gap;

  useEffect(() => {
    if (items.length > 0) {
      const list = [];
      for (let i = 0; i < 150; i++) {
        list.push({
          src: items[i % items.length],
          color: getRandomColor()
        });
      }
      setDisplayList(list);
    }
  }, [items]);

  const playTick = () => {
    const tick = new Audio('/click.m4a');
    tick.volume = 1.0;
    tick.play().catch(() => {});
  };

  const spin = async () => {
    if (rolling || items.length === 0 || displayList.length === 0) return;

    await controls.set({ x: 0 });

    setRolling(true);
    setWinnerImage(null);

    const winIndex = Math.floor(Math.random() * 10) + 100;
    const chosen = displayList[winIndex];

    const duration = 8;
    const startTime = Date.now();
    let lastTick = 0;

    const cardCenterX = winIndex * totalStep + cardWidth / 2;

    const timer = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 4);
      const currentX = easeOut * cardCenterX;

      const currentIndex = Math.floor(currentX / totalStep);
      if (currentIndex > lastTick) {
        playTick();
        lastTick = currentIndex;
      }
      if (progress >= 1) clearInterval(timer);
    }, 16);

    const containerWidth = rouletteRef.current?.offsetWidth || window.innerWidth;
    const centerLineX = containerWidth / 2;
    const targetX = cardCenterX - centerLineX;

    await controls.start({
      x: -targetX,
      transition: { duration: duration, ease: [0.1, 0, 0.05, 1] }
    });

    confetti({ 
      particleCount: 150, 
      spread: 70, 
      origin: { y: 0.6 },
      colors: [chosen.color, '#ffffff']
    });

    setTimeout(() => {
      setWinnerImage(chosen.src);
      setWinnerColor(chosen.color);
      setRolling(false);
      setHistory(prev => [{ img: chosen.src, color: chosen.color }, ...prev]);
    }, 500);
  };

  const xM = useMotionValue(0);
  const yM = useMotionValue(0);
  const rX = useSpring(useTransform(yM, [-0.5, 0.5], [15, -15]));
  const rY = useSpring(useTransform(xM, [-0.5, 0.5], [-15, 15]));

  return (
    <div
      style={{
        width: '100vw',
        minHeight: '100vh',
        background: 'radial-gradient(circle at center, #111 0%, #000 100%)',
        backgroundImage: 'linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: 'system-ui, sans-serif'
      }}
    >
      <div style={{ marginTop: '60px', textAlign: 'center' }}>
        <h1
          style={{
            fontSize: '3.5rem',
            letterSpacing: '15px',
            fontWeight: '900',
            color: '#fff',
            margin: 0,
            textShadow: '0 0 20px rgba(255,255,255,0.1)'
          }}
        >
          SHUFFLELOCK
        </h1>
      </div>

      <div
        ref={rouletteRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '380px',
          margin: '40px 0',
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(10px)',
          borderTop: '2px solid #222',
          borderBottom: '2px solid #222',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8)'
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '0',
            transform: 'translateX(-50%)',
            width: '4px',
            height: '100%',
            backgroundColor: '#fff',
            zIndex: 100,
            boxShadow: '0 0 20px #fff, 0 0 40px #fff'
          }}
        >
            <div style={{ position: 'absolute', top: 0, left: '-8px', width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: '10px solid #fff' }} />
            <div style={{ position: 'absolute', bottom: 0, left: '-8px', width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderBottom: '10px solid #fff' }} />
        </div>

        <motion.div
          animate={controls}
          style={{ display: 'flex', gap: `${gap}px`, x: 0, paddingLeft: '10px' }}
        >
          {displayList.map((item, i) => (
            <div
              key={i}
              style={{
                width: cardWidth,
                height: '280px',
                flexShrink: 0,
                background: '#0a0a0a',
                border: '1px solid #222',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                clipPath: 'polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)' // Corte angular
              }}
            >
              <img src={item.src} style={{ width: '70%', filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))', pointerEvents: 'none' }} alt="" />
              
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '6px',
                  background: item.color,
                  boxShadow: `0 0 15px ${item.color}66`
                }}
              />
              <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '8px', color: '#333' }}>
                #{i.toString(16).toUpperCase()}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <button
      onClick={spin}
      disabled={rolling}
      style={{
        width: '320px',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0',
        fontSize: '14px',
        fontWeight: 'bold',
        letterSpacing: '5px',
        backgroundColor: rolling ? '#111' : '#fff',
        color: rolling ? '#444' : '#000',
        border: 'none',
        cursor: rolling ? 'not-allowed' : 'pointer',
        textTransform: 'uppercase',
        transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
        clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)'
      }}>
      {rolling ? 'RULETEANDO...' : 'GIRA LA MALCRIADA'}
      </button>

      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          marginTop: '60px',
          padding: '40px',
          background: 'rgba(255,255,255,0.02)',
          borderTop: '1px solid #1a1a1a'
        }}
      >
        <p style={{ color: '#444', fontSize: '11px', letterSpacing: '3px', marginBottom: '25px', fontWeight: 'bold' }}>
          &gt; HISTORIAL DE CARTEX
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '20px'
          }}
        >
          {history.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.05)' }}
              onClick={() => {
                setWinnerImage(item.img);
                setWinnerColor(item.color);
              }}
              style={{
                height: '180px',
                background: '#050505',
                border: '1px solid #1a1a1a',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                borderLeft: `2px solid ${item.color}`
              }}
            >
              <img
                src={item.img}
                style={{ height: '60%', objectFit: 'contain' }}
                alt=""
              />
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {winnerImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.95)',
              backdropFilter: 'blur(20px)'
            }}
            onClick={() => setWinnerImage(null)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onMouseMove={e => {
                const rect = e.currentTarget.getBoundingClientRect();
                xM.set((e.clientX - rect.left) / rect.width - 0.5);
                yM.set((e.clientY - rect.top) / rect.height - 0.5);
              }}
              style={{
                width: '400px',
                height: '550px',
                rotateX: rX,
                rotateY: rY,
                transformStyle: 'preserve-3d'
              }}
              onClick={e => e.stopPropagation()}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: '#080808',
                  borderRadius: '2px',
                  border: `2px solid ${winnerColor}`,
                  boxShadow: `0 0 60px ${winnerColor}44`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <img
                  src={winnerImage}
                  style={{ width: '85%', objectFit: 'contain', filter: `drop-shadow(0 0 20px ${winnerColor}66)` }}
                  alt=""
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