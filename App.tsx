/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { Users, ExternalLink, Shield, Gamepad2, Award, Info, Zap, Target, RefreshCw, User } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';

const useGameSound = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playHoverSound = useCallback(() => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state !== 'running') return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.05);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.02);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }, []);

  const playClickSound = useCallback(() => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state !== 'running') return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.02);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  }, []);

  useEffect(() => {
    const handleInteraction = () => initAudio();
    window.addEventListener('click', handleInteraction, { once: true });
    window.addEventListener('keydown', handleInteraction, { once: true });
    
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  useEffect(() => {
    const attachSounds = () => {
      const interactables = document.querySelectorAll('a, button, .cursor-pointer, .roblox-card');
      
      const onHover = () => playHoverSound();
      const onClick = () => playClickSound();

      interactables.forEach(el => {
        el.addEventListener('mouseenter', onHover);
        el.addEventListener('click', onClick);
      });

      return () => {
        interactables.forEach(el => {
          el.removeEventListener('mouseenter', onHover);
          el.removeEventListener('click', onClick);
        });
      };
    };

    const timer = setTimeout(attachSounds, 1000);
    return () => clearTimeout(timer);
  }, [playHoverSound, playClickSound]);
};

const members = [
  { 
    name: 'Bisma', 
    role: 'Chairman & Founder', 
    id: '3503775580', 
    link: 'https://www.roblox.com/id/users/3503775580/profile',
    special: true 
  },
  { 
    name: 'Fathan', 
    role: 'Elite Member', 
    id: '7864646425', 
    link: 'https://www.roblox.com/id/users/7864646425/profile' 
  },
  { 
    name: 'Gery', 
    role: 'Elite Member', 
    id: '1782274310', 
    link: 'https://www.roblox.com/id/users/1782274310/profile' 
  },
  { 
    name: 'Riski (Iki)', 
    role: 'Elite Member', 
    id: '8363328651', 
    link: 'https://www.roblox.com/id/users/8363328651/profile' 
  },
  { 
    name: 'Rafi (Rapi)', 
    role: 'Elite Member', 
    id: '859592736', 
    link: 'https://www.roblox.com/id/users/859592736/profile' 
  },
  { 
    name: 'Ade', 
    role: 'Elite Member', 
    id: '7595474794', 
    link: 'https://www.roblox.com/id/users/7595474794/profile' 
  },
  { 
    name: 'Doni', 
    role: 'Elite Member', 
    id: '10882360447', 
    link: 'https://www.roblox.com/id/users/10882360447/profile' 
  }
];

const RobloxAvatar = ({ userId, name, className }: { userId: string, name: string, className?: string }) => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchAvatar = async () => {
      try {
        const response = await fetch(`https://thumbnails.roproxy.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=Png&isCircular=false`);
        const result = await response.json();
        if (isMounted && result?.data?.[0]?.imageUrl) {
          setImgSrc(result.data[0].imageUrl);
        } else if (isMounted) {
          setError(true);
        }
      } catch (err) {
        if (isMounted) setError(true);
      }
    };

    fetchAvatar();
    return () => { isMounted = false; };
  }, [userId]);
  
  return (
    <div className={`relative flex items-center justify-center ${className || ''} ${className?.includes('bg-') ? '' : 'bg-[#111]'}`}>
      {!imgSrc && !error && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-[#111]">
          <motion.div 
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-10 h-10 border-2 border-white/20 p-2 flex items-center justify-center rounded-sm overflow-hidden"
          >
            <div className="w-full h-full bg-roblox-blue rounded-[2px]" />
            <div className="w-3 h-3 bg-[#111] absolute" />
          </motion.div>
        </div>
      )}
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-[#191b1d] z-10">
          <User size={32} className="opacity-20 text-white" />
        </div>
      ) : imgSrc ? (
        <img 
          src={imgSrc}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setError(true)}
        />
      ) : null}
    </div>
  );
};

// Minigame Components
const NoobDefender = () => {
  const [score, setScore] = useState(0);
  const [targets, setTargets] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const spawnTarget = useCallback(() => {
    const id = Date.now() + Math.random();
    const x = Math.random() * 80 + 10;
    const y = Math.random() * 80 + 10;
    setTargets(prev => [...prev, { id, x, y }]);
    
    setTimeout(() => {
      setTargets(prev => prev.filter(t => t.id !== id));
    }, 2000);
  }, []);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(spawnTarget, 800);
    }
    return () => clearInterval(interval);
  }, [isPlaying, spawnTarget]);

  const handleHit = (id: number) => {
    setScore(prev => prev + 10);
    setTargets(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="roblox-panel p-8 flex flex-col items-center gap-6 overflow-hidden relative min-h-[400px]">
      <div className="text-center z-10">
        <h3 className="text-2xl font-black mb-2 flex items-center justify-center gap-2">
          <Target className="text-roblox-red" /> NOOB DEFENDER
        </h3>
        <p className="text-sm opacity-50 mb-4 font-medium uppercase tracking-widest text-[#bdbebf]">Click the Noobs to defend the base!</p>
        <div className="flex gap-4 justify-center">
          <div className="bg-black/50 px-6 py-2 rounded-sm border border-white/10 flex flex-col items-center">
            <span className="text-[10px] uppercase font-black text-white/30 tracking-tighter">Current Score</span>
            <span className="text-2xl font-display font-black text-roblox-blue">{score}</span>
          </div>
          {!isPlaying ? (
            <button onClick={() => setIsPlaying(true)} className="roblox-btn-primary px-8">
              <Zap size={18} /> INITIALIZE ARENA
            </button>
          ) : (
            <button onClick={() => { setIsPlaying(false); setScore(0); setTargets([]); }} className="roblox-btn-sec px-8">
              <RefreshCw size={18} /> REBOOT
            </button>
          )}
        </div>
      </div>

      <div className="absolute inset-0 z-0">
        <AnimatePresence>
          {targets.map(t => (
            <motion.div
              key={t.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => handleHit(t.id)}
              className="absolute cursor-crosshair w-16 h-16 pointer-events-auto"
              style={{ left: `${t.x}%`, top: `${t.y}%` }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <RobloxAvatar
                userId="2"
                name="Noob"
                className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] select-none [&_img]:mix-blend-normal bg-transparent"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {isPlaying && (
        <div className="mt-auto z-10 text-[10px] text-white/20 animate-pulse uppercase font-black tracking-widest">
          {targets.length === 0 ? "SCANNING FOR HOSTILES..." : "THREAT DETECTED"}
        </div>
      )}
    </div>
  );
};

const BG_IMAGES = [
  'https://i.ibb.co.com/qLc4Y1hR/Whats-App-Image-2026-04-29-at-12-11-01.jpg',
  'https://i.ibb.co.com/WNkXF9C8/Whats-App-Image-2026-04-29-at-12-11-00.jpg',
  'https://i.ibb.co.com/zWn6ZKyB/Whats-App-Image-2026-04-29-at-12-10-59.jpg',
  'https://i.ibb.co.com/BV2k6ZwP/Whats-App-Image-2026-04-29-at-12-08-45.jpg',
  'https://i.ibb.co.com/1f6ht1VQ/Whats-App-Image-2026-04-29-at-12-08-07.jpg',
  'https://i.ibb.co.com/mVqRdWzg/Whats-App-Image-2026-04-29-at-12-08-08.jpg'
];

const ScrollBackgrounds = () => {
  const { scrollYProgress } = useScroll();

  return (
    <div className="fixed inset-0 pointer-events-none z-0 bg-bg-deep">
      {BG_IMAGES.map((src, i) => {
        return <ScrollImage key={src} src={src} index={i} total={BG_IMAGES.length} scrollYProgress={scrollYProgress} />;
      })}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-deep/80 via-bg-deep/50 to-bg-deep z-10 pointer-events-none" />
    </div>
  );
};

const ScrollImage = ({ src, index, total, scrollYProgress }: { src: string, index: number, total: number, scrollYProgress: any }) => {
  const step = 1 / total;
  const start = index * step;
  const fadeWidth = step * 0.3;

  let points = [
    { x: start - fadeWidth, y: 0 },
    { x: start + fadeWidth, y: 0.4 },
    { x: start + step - fadeWidth, y: 0.4 },
    { x: start + step + fadeWidth, y: 0 }
  ];

  // clamp X to [0,1]
  points = points.map(p => ({ ...p, x: Math.max(0, Math.min(1, p.x)) }));

  // Remove exact X duplicates to make strictly increasing
  const uniquePoints: { x: number, y: number }[] = [];
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    if (uniquePoints.length === 0) {
      uniquePoints.push(p);
    } else {
      const last = uniquePoints[uniquePoints.length - 1];
      if (p.x > last.x) {
        uniquePoints.push(p);
      } else if (p.x === last.x && Math.abs(p.y - last.y) > 0.01) {
        // if X is same but Y is different, slightly offset X to keep WAAPI happy
        uniquePoints.push({ x: Math.min(1, p.x + 0.0001), y: p.y });
      }
    }
  }

  // Fallback to avoid error if we end up with less than 2 points
  if (uniquePoints.length === 1) {
    if (uniquePoints[0].x < 1) uniquePoints.push({ x: 1, y: uniquePoints[0].y });
    else uniquePoints.unshift({ x: 0, y: uniquePoints[0].y });
  }

  const opacity = useTransform(
    scrollYProgress,
    uniquePoints.map(p => p.x),
    uniquePoints.map(p => p.y)
  );
  
  return (
    <motion.img
      style={{ opacity }}
      src={src}
      className="absolute inset-0 w-full h-full object-cover"
      alt="background block"
      referrerPolicy="no-referrer"
    />
  );
};

const NoiseOverlay = () => (
  <div 
    className="fixed inset-0 pointer-events-none z-[90] opacity-[0.04]"
    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
  />
);

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    const handleMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).tagName.toLowerCase() === 'a' || (e.target as HTMLElement).closest('button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div className="hidden md:block pointer-events-none z-[100] fixed inset-0">
      <motion.div
        className="absolute w-3 h-3 bg-roblox-blue rounded-full pointer-events-none mix-blend-screen shadow-[0_0_10px_rgba(0,162,255,0.8)]"
        animate={{ x: mousePosition.x - 6, y: mousePosition.y - 6, scale: isHovering ? 0 : 1 }}
        transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
      />
      <motion.div
        className="absolute w-10 h-10 border border-roblox-blue/50 rounded-full pointer-events-none flex items-center justify-center"
        animate={{ 
          x: mousePosition.x - 20, 
          y: mousePosition.y - 20, 
          scale: isHovering ? 1.5 : 1, 
          backgroundColor: isHovering ? 'rgba(0,162,255,0.1)' : 'rgba(0,162,255,0)'
        }}
        transition={{ type: "spring", stiffness: 400, damping: 28, mass: 0.8 }}
      >
        {isHovering && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-1 h-1 bg-roblox-blue rounded-full" />}
      </motion.div>
    </div>
  );
};

const TerminalOverlay = () => {
  const [lines, setLines] = useState<string[]>([]);
  
  useEffect(() => {
    const sequence = [
      "INITIALIZING ROBLOX API CONNECTION...",
      "FETCHING ROSTER DATABASES... OK",
      "ESTABLISHING SECURE COMMS LINK... OK",
      "IRCE MAINFRAME ONLINE.",
      "AWAITING COMMAND..."
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      if (i < sequence.length) {
        setLines(prev => [...prev, sequence[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 800);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute bottom-10 left-6 sm:left-10 z-30 font-mono text-[10px] sm:text-xs text-roblox-green opacity-70 pointer-events-none">
      {lines.map((line, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {"> " + line}
        </motion.div>
      ))}
      <motion.div 
        animate={{ opacity: [1, 0] }} 
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="inline-block w-2 sm:w-3 h-3 sm:h-4 bg-roblox-green mt-1"
      />
    </div>
  );
};

export default function App() {
  useGameSound();
  const { scrollY, scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  const heroImageOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroVideoY = useTransform(scrollY, [0, 1000], [0, 250]);

  return (
    <div className="min-h-screen text-white font-sans scroll-smooth relative cursor-default scanlines">
      <CustomCursor />
      <NoiseOverlay />
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1.5 bg-roblox-green origin-left z-[100] shadow-[0_0_15px_rgba(37,211,102,1)]"
      />
      <ScrollBackgrounds />
      
      {/* Roblox-style Top Bar */}
      <nav className="bg-bg-deep/80 backdrop-blur-md border-b border-border-light px-4 md:px-8 py-3 md:py-5 flex flex-wrap justify-between items-center sticky top-0 z-50 gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-white p-1 rounded-sm">
              <svg viewBox="0 0 100 100" className="w-4 h-4 md:w-5 md:h-5 fill-black">
                <path d="M20 20 L80 25 L75 80 L15 75 Z" />
                <path d="M40 40 L60 42 L58 58 L38 56 Z" fill="white" />
              </svg>
            </div>
            <span className="font-display font-black text-lg md:text-xl tracking-tighter uppercase italic">IRCE</span>
          </div>
          <div className="hidden lg:flex gap-8 text-[10px] font-black opacity-60 pl-8 uppercase tracking-[0.2em]">
            <a href="#" className="hover:text-roblox-blue transition-colors whitespace-nowrap">Home</a>
            <a href="#about" className="hover:text-roblox-blue transition-colors whitespace-nowrap">About</a>
            <a href="#gallery" className="hover:text-roblox-blue transition-colors whitespace-nowrap">Gallery</a>
            <a href="#roster" className="hover:text-roblox-blue transition-colors whitespace-nowrap">Staff & Roster</a>
            <a href="#arena" className="hover:text-roblox-blue transition-colors whitespace-nowrap">Combat Arena</a>
            <a href="#contact" className="hover:text-roblox-blue transition-colors whitespace-nowrap">Contact Us</a>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3 font-mono font-black tracking-wider uppercase ml-auto">
          <a href="https://discord.gg/kt5nJspbW" target="_blank" rel="noreferrer" className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-3 md:px-5 py-1.5 md:py-2 flex items-center gap-2 transition-colors rounded-sm shadow-[0_0_15px_rgba(88,101,242,0.3)]">
            <svg width="16" height="16" className="md:w-[20px] md:h-[20px]" viewBox="0 0 127.14 96.36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.3,46,96.19,53,91.08,65.69,84.69,65.69Z"/>
            </svg>
            <span className="text-xs md:text-sm hidden sm:inline">DISCORD</span>
          </a>
          <a href="https://chat.whatsapp.com/FZk2OAGTCYy8thvvEeY1vj" target="_blank" rel="noreferrer" className="bg-[#25D366] hover:bg-[#128C7E] text-white px-3 md:px-5 py-1.5 md:py-2 flex items-center gap-2 transition-colors rounded-sm shadow-[0_0_15px_rgba(37,211,102,0.3)]">
            <svg width="16" height="16" className="md:w-[20px] md:h-[20px]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            <span className="text-xs md:text-sm hidden sm:inline">WHATSAPP</span>
          </a>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <header className="relative pt-32 sm:pt-40 pb-32 sm:pb-48 px-4 sm:px-6 overflow-hidden border-b border-border-light min-h-[100vh] flex flex-col justify-center">
          <TerminalOverlay />
          <motion.div 
            className="absolute inset-0 pointer-events-none overflow-hidden bg-transparent"
            style={{ opacity: heroImageOpacity, y: heroVideoY }}
          >
            <div className="absolute inset-0 w-[400%] h-[400%] -top-[150%] -left-[150%] md:w-[150%] md:h-[150%] md:-top-[25%] md:-left-[25%]">
              <iframe 
                src="https://www.youtube.com/embed/E0ZK0ChE6Bo?autoplay=1&mute=1&loop=1&playlist=E0ZK0ChE6Bo&controls=0&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1&playsinline=1"
                className="w-full h-full opacity-100 pointer-events-none brightness-110"
                style={{ border: 0 }}
                allow="autoplay; encrypted-media; picture-in-picture"
                title="IRCE Background Video"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-deep/80" />
          </motion.div>
          <div className="max-w-6xl mx-auto relative z-20 flex flex-col items-center text-center w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-3 bg-black/30 backdrop-blur-sm text-white px-5 py-2 text-[10px] font-mono mb-12 border border-white/10 tracking-[0.25em] uppercase hover:bg-black/50 transition-colors"
            >
              <Shield size={12} className="opacity-50" />
              <span>International Roblox Esports Alliance</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[12vw] sm:text-6xl md:text-8xl lg:text-[140px] font-display font-black mb-8 sm:mb-10 leading-[0.85] tracking-tighter uppercase glitch-hover cursor-pointer"
              data-text="ELITE COMPETITIVE FRAMEWORK"
            >
              ELITE <br className="md:hidden" />
              <span className="text-white/40">COMPETITIVE</span> <br />
              FRAMEWORK
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg text-[#bdbebf] max-w-xl mb-12 leading-relaxed font-medium"
            >
              Selamat datang di pusat komando IRCE. Wadah profesional bagi atlet Roblox berambisi tinggi untuk mendominasi panggung internasional.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 100 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <motion.a 
                href="https://discord.gg/kt5nJspbW"
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="roblox-btn-primary w-full sm:w-auto text-base sm:text-lg px-8 sm:px-12 py-3 sm:py-4 shadow-[0_0_20px_rgba(0,162,255,0.3)] hover:shadow-[0_0_30px_rgba(0,162,255,0.5)] transition-shadow duration-300"
              >
                JOIN THE HUB (DISCORD)
              </motion.a>
              <motion.a 
                href="https://chat.whatsapp.com/FZk2OAGTCYy8thvvEeY1vj"
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="roblox-btn-sec w-full sm:w-auto text-base sm:text-lg px-8 sm:px-12 py-3 sm:py-4 border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 shadow-[0_0_20px_rgba(37,211,102,0.1)] hover:shadow-[0_0_30px_rgba(37,211,102,0.3)] transition-all duration-300 flex justify-center"
              >
                JOIN WHATSAPP
              </motion.a>
            </motion.div>
          </div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,162,255,0.03)_0%,transparent_70%)] -z-10" />
        </header>

        {/* Marquee Ticker */}
        <div className="bg-roblox-blue text-[#0a0a0a] overflow-hidden py-3 flex font-mono font-black uppercase tracking-[0.2em] text-[10px] md:text-xs whitespace-nowrap z-20 shadow-[0_0_20px_rgba(0,162,255,0.2)]">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
              className="flex gap-12 sm:gap-16 pr-12 sm:pr-16"
            >
              {[...Array(2)].map((_, i) => (
                 <div key={i} className="flex gap-12 sm:gap-16 items-center">
                    <span className="opacity-60">🔴 LATEST NEWS</span>
                    <span>NEW ROSTER: XYLON JOINED THE HUB</span>
                    <span className="opacity-60">⭐ ACHIEVEMENT</span>
                    <span>IRCE TOURNAMENT Q2 CHAMPIONS</span>
                    <span className="opacity-60">🔥 10M+ VISITS SIMULATOR</span>
                    <span>DISCORD MILESTONE: 500+ CORE MEMBERS</span>
                 </div>
              ))}
            </motion.div>
        </div>

        {/* Global Roster */}
        <section id="roster" className="py-20 sm:py-32 px-4 sm:px-6 border-b border-border-light relative z-20 bg-bg-deep/80 backdrop-blur-md">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12 sm:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8 border-b border-border-light pb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl sm:text-5xl lg:text-7xl font-display font-black mb-4 sm:mb-6 tracking-tighter uppercase leading-[0.9]">
                  ACTIVE <br className="sm:hidden" /> PERSONNEL
                </h2>
                <p className="text-text-sec text-[10px] sm:text-xs font-mono uppercase tracking-widest flex items-center gap-3">
                  <Users size={14} className="opacity-50" />
                  ROSTER CORE DATABASE v2.0
                </p>
              </motion.div>
              
              <div className="flex gap-8 sm:gap-12 text-[10px] sm:text-[11px] font-mono uppercase tracking-widest">
                <div className="flex flex-col gap-1 sm:gap-2">
                  <span className="text-text-sec">COMMITMENT</span>
                  <span className="text-base sm:text-lg text-white">UNWAVERING</span>
                </div>
                <div className="flex flex-col gap-1 sm:gap-2">
                  <span className="text-text-sec">STATUS</span>
                  <span className="text-base sm:text-lg text-white">ONLINE</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {members.map((member, i) => (
                <motion.a 
                  key={member.name}
                  href={member.link}
                  target="_blank"
                  rel="noreferrer"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, type: 'spring', stiffness: 100 }}
                  whileHover={{ 
                    y: -10,
                    transition: { duration: 0.2 }
                  }}
                  viewport={{ once: true }}
                  className={`roblox-card group relative p-4 sm:p-6 cursor-pointer hover:bg-white/5 border border-border-light`}
                >
                  <div className="aspect-square bg-[#0a0a0a] mb-4 sm:mb-6 flex items-center justify-center overflow-hidden border border-border-light relative">
                    <RobloxAvatar 
                      userId={member.id} 
                      name={member.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 select-none pointer-events-none"
                    />
                    {member.special && (
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white text-black p-1 sm:p-1.5 shadow-xl z-20">
                        <Award size={12} className="sm:w-[14px] sm:h-[14px]" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                       <span className="text-[8px] font-black uppercase text-white/80 shrink-0">VIEW ROBLOX PROFILE ↗</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-xl sm:text-2xl font-display font-black tracking-tighter truncate leading-tight transition-colors">{member.name}</h3>
                      <div className="w-6 h-6 sm:w-8 sm:h-8 flex shrink-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink size={14} className="text-white w-3 h-3 sm:w-4 sm:h-4" />
                      </div>
                    </div>
                    <p className={`text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] text-text-sec mt-1 sm:mt-2 truncate`}>
                      {member.role}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* IRCE Projects */}
        <section id="projects" className="py-32 px-6 border-b border-border-light relative overflow-hidden bg-black/50 backdrop-blur-sm">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
          
          <div className="max-w-6xl mx-auto relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8"
            >
              <div>
                <h2 className="text-5xl lg:text-7xl font-display font-black mb-4 tracking-tighter uppercase italic">
                  IRCE <span className="text-roblox-blue">PROJECTS</span>
                </h2>
                <p className="text-text-sec text-xs font-mono uppercase tracking-widest flex items-center gap-3">
                  <Gamepad2 size={14} className="opacity-50" />
                  OFFICIAL GAME ENTRIES
                </p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Game 1 */}
              <motion.a 
                href="https://www.roblox.com/id/games/119735845544651/The-Interogation"
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03, y: -8 }}
                className="group relative block overflow-hidden border border-white/10 bg-[#0a0a0a] hover:border-roblox-blue/80 hover:z-10 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,162,255,0.25)]"
              >
                <div className="h-56 sm:h-64 relative bg-black/60 overflow-hidden">
                  <motion.img 
                    src="https://tr.rbxcdn.com/180DAY-7c9156f675b985363a7de4db153c7900/512/512/Image/Png/noFilter" 
                    alt="The Interogation" 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 origin-center" 
                    whileHover={{ scale: 1.15 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />
                  
                  {/* Dynamic Hover Element - simulating a gameplay clip/flash */}
                  <div className="absolute inset-0 bg-roblox-blue/20 opacity-0 group-hover:opacity-100 mix-blend-overlay transition-opacity duration-300" />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-roblox-blue/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-full group-hover:translate-y-0" />
                </div>
                <div className="p-6 sm:p-8 relative bg-[#0a0a0a] z-10">
                  <div className="absolute top-0 left-0 w-full h-1 bg-roblox-blue transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 shadow-[0_0_10px_rgba(0,162,255,1)]" />
                  <h3 className="text-2xl sm:text-3xl font-display font-black mb-3 italic tracking-tighter uppercase group-hover:text-roblox-blue transition-colors">The Interogation</h3>
                  <p className="text-[#bdbebf] mb-6 font-medium text-sm leading-relaxed">Experience intense interrogation scenarios. Test your psychological resilience in this immersive roleplay experience.</p>
                  
                  <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] uppercase text-roblox-blue">
                    <span>Play Experience</span>
                    <ExternalLink size={12} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </div>
              </motion.a>

              {/* Game 2 */}
              <motion.a 
                href="https://www.roblox.com/id/games/140671257136651/Clicker"
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03, y: -8 }}
                className="group relative block overflow-hidden border border-white/10 bg-[#0a0a0a] hover:border-roblox-green/80 hover:z-10 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(37,211,102,0.15)]"
              >
                <div className="h-56 sm:h-64 relative bg-black/60 overflow-hidden">
                  <motion.img 
                    src="https://tr.rbxcdn.com/180DAY-e4f79dba7367a4311dbceb8a566e0231/512/512/Image/Png/noFilter" 
                    alt="Clicker Simulation" 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 origin-center" 
                    whileHover={{ scale: 1.15 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />
                  
                  {/* Dynamic Hover Element - simulating a gameplay clip/flash */}
                  <div className="absolute inset-0 bg-roblox-green/20 opacity-0 group-hover:opacity-100 mix-blend-overlay transition-opacity duration-300" />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-roblox-green/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-full group-hover:translate-y-0" />
                </div>
                <div className="p-6 sm:p-8 relative bg-[#0a0a0a] z-10">
                  <div className="absolute top-0 left-0 w-full h-1 bg-roblox-green transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 shadow-[0_0_10px_rgba(37,211,102,1)]" />
                  <h3 className="text-2xl sm:text-3xl font-display font-black mb-3 italic tracking-tighter uppercase group-hover:text-roblox-green transition-colors">Clicker Simulation</h3>
                  <p className="text-[#bdbebf] mb-6 font-medium text-sm leading-relaxed">How fast can you click? Compete on the leaderboards and unlock exclusive IRCE achievements.</p>
                  
                  <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] uppercase text-roblox-green">
                    <span>Play Experience</span>
                    <ExternalLink size={12} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </div>
              </motion.a>
            </div>
          </div>
        </section>

        {/* Minigame Arena */}
        <section id="arena" className="py-24 sm:py-32 px-4 sm:px-6 relative overflow-hidden">
          {/* VIDEO BACKGROUND 1: ARENA */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <iframe 
              src="https://www.youtube.com/embed/ZA0fwSBVptQ?autoplay=1&mute=1&loop=1&playlist=ZA0fwSBVptQ&controls=0&showinfo=0&rel=0&modestbranding=1"
              allow="autoplay; encrypted-media"
              className="absolute top-1/2 left-1/2 w-[200vw] h-[112.5vw] min-h-[200vh] min-w-[355.5vh] -translate-x-1/2 -translate-y-1/2 opacity-75 pointer-events-none brightness-125"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-b from-bg-deep via-transparent to-bg-deep" />
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-display font-black mb-4 italic">COMBAT SIMULATION</h2>
              <p className="text-[#bdbebf] max-w-lg mx-auto font-medium">Uji refleksmu di Simulator Tempur IRCE. Klik secepat mungkin untuk menyingkirkan target yang muncul!</p>
            </motion.div>
            <NoobDefender />
          </div>
        </section>

        {/* Vision Section */}
        <section id="about" className="py-24 sm:py-32 px-4 sm:px-6 overflow-hidden relative border-b border-border-light bg-black/40 backdrop-blur-sm">
          {/* VIDEO BACKGROUND 3: ABOUT */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-black">
            <iframe 
              src="https://www.youtube.com/embed/fgQQjwwwrL0?autoplay=1&mute=1&loop=1&playlist=fgQQjwwwrL0&controls=0&showinfo=0&rel=0&modestbranding=1"
              allow="autoplay; encrypted-media"
              className="absolute top-1/2 left-1/2 w-[200vw] h-[112.5vw] min-h-[200vh] min-w-[355.5vh] -translate-x-1/2 -translate-y-1/2 opacity-30 pointer-events-none"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-bg-deep/40 to-bg-deep/80" />
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center relative z-10">
            <div className="space-y-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-6xl font-display font-black leading-[0.9] mb-8 italic tracking-tighter">
                  REACH THE <br />
                  <span className="text-roblox-blue">SUMMIT.</span>
                </h2>
                <div className="space-y-6 text-[#bdbebf] text-lg leading-relaxed font-medium">
                  <p>IRCE lahir untuk mendefinisikan kembali apa itu atlet siber di platform Roblox. Kami percaya bahwa dengan disiplin dan kolaborasi, komunitas ini akan menjadi basis esport terkuat.</p>
                  <p>Misi kami adalah menyediakan infrastruktur, pelatihan, dan eksposur internasional bagi setiap anggota kami.</p>
                </div>
              </motion.div>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="roblox-panel p-6 border-b-2 border-b-roblox-blue group hover:bg-white/5 transition-colors relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-roblox-blue/10 blur-3xl -z-10 group-hover:bg-roblox-blue/20 transition-colors" />
                  <Shield size={24} className="text-roblox-blue mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="font-black italic mb-2">IRON DEFENSE</h4>
                  <p className="text-xs text-[#bdbebf] font-medium leading-relaxed uppercase tracking-tighter">Keamanan dan integritas adalah prioritas utama kami dalam setiap turnamen.</p>
                </div>
                <div className="roblox-panel p-6 border-b-2 border-b-white/20 group hover:bg-white/5 transition-colors relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl -z-10 group-hover:bg-white/10 transition-colors" />
                  <Target size={24} className="text-white/40 mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="font-black italic mb-2">PRECISION STRIKE</h4>
                  <p className="text-xs text-[#bdbebf] font-medium leading-relaxed uppercase tracking-tighter">Fokus pada eksekusi strategi yang matang dan gameplay yang taktis.</p>
                </div>
              </div>

              {/* Animated Stats */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10"
              >
                {[
                  { value: "500+", label: "CORE MEMBERS" },
                  { value: "50+", label: "TOURNAMENTS" },
                  { value: "10K+", label: "MATCHES PLAYED" }
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <span className="text-3xl sm:text-4xl font-display font-black text-roblox-blue">{stat.value}</span>
                    <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.1em] uppercase text-text-sec">{stat.label}</span>
                  </div>
                ))}
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-[#0c0c0c] p-12 border-t-2 border-t-white relative"
            >
               <h4 className="text-[10px] font-mono text-text-sec uppercase tracking-[0.4em] mb-12">Official Directive</h4>
               <blockquote className="text-3xl font-display font-medium italic leading-tight mb-12 text-white">
                 "Kita tidak hanya bermain; kita mendominasi panggung dengan disiplin dan strategi yang terasah."
               </blockquote>
               <div className="flex items-center gap-5">
                 <div className="w-16 h-16 bg-[#111] flex items-center justify-center border border-border-light overflow-hidden">
                   <RobloxAvatar 
                     userId="3503775580" 
                     name="Chairman" 
                     className="w-full h-full grayscale opacity-80"
                   />
                 </div>
                 <div>
                   <div className="text-2xl font-black italic tracking-tighter uppercase">Bisma</div>
                   <div className="text-[9px] text-text-sec uppercase font-mono tracking-widest mt-1">Chairman & Founder</div>
                 </div>
               </div>
            </motion.div>
          </div>
        </section>
        {/* Moment Gallery Section */}
        <section id="gallery" className="py-24 sm:py-32 px-4 sm:px-6 relative overflow-hidden">
          <div className="max-w-6xl mx-auto">
             <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12 sm:mb-20"
            >
              <h2 className="text-4xl sm:text-6xl font-display font-black mb-4 tracking-tighter uppercase italic">
                Seruan-Seruan <br className="sm:hidden" /> Bareng <span className="text-[#5865F2]">IRCE</span>
              </h2>
              <p className="text-text-sec text-sm sm:text-base max-w-2xl font-medium leading-relaxed">
                Momen-momen tak terlupakan dari komunitas IRCE. Uploaded by members.
              </p>
            </motion.div>

            <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3 sm:gap-4 space-y-3 sm:space-y-4">
              {[
                'https://i.ibb.co.com/qLc4Y1hR/Whats-App-Image-2026-04-29-at-12-11-01.jpg',
                'https://i.ibb.co.com/WNkXF9C8/Whats-App-Image-2026-04-29-at-12-11-00.jpg',
                'https://i.ibb.co.com/zWn6ZKyB/Whats-App-Image-2026-04-29-at-12-10-59.jpg',
                'https://i.ibb.co.com/BV2k6ZwP/Whats-App-Image-2026-04-29-at-12-08-45.jpg',
                'https://i.ibb.co.com/1f6ht1VQ/Whats-App-Image-2026-04-29-at-12-08-07.jpg',
                'https://i.ibb.co.com/mVqRdWzg/Whats-App-Image-2026-04-29-at-12-08-08.jpg',
                'https://i.ibb.co.com/p6p80gY8/Whats-App-Image-2026-04-29-at-12-06-53-2.jpg',
                'https://i.ibb.co.com/WWbPJBH5/Whats-App-Image-2026-04-29-at-12-06-53-1.jpg',
                'https://i.ibb.co.com/4nBcyffy/Whats-App-Image-2026-04-29-at-12-06-53.jpg',
                'https://i.ibb.co.com/5gyWdMB1/Whats-App-Image-2026-04-29-at-11-45-30-1.jpg',
                'https://i.ibb.co.com/7tfLqr9P/Whats-App-Image-2026-04-29-at-11-45-30.jpg',
                'https://i.ibb.co.com/bjFvNQSF/Whats-App-Image-2026-04-29-at-11-45-29-1.jpg',
                'https://i.ibb.co.com/spPHYg2L/Whats-App-Image-2026-04-29-at-11-45-29.jpg',
                'https://i.ibb.co.com/BHNdkLNX/Whats-App-Image-2026-04-29-at-11-27-57.jpg',
                'https://i.ibb.co.com/B83Lp2M/Whats-App-Image-2026-04-29-at-11-27-56-1.jpg',
                'https://i.ibb.co.com/hJkC0xxW/Whats-App-Image-2026-04-29-at-11-27-56.jpg',
                'https://i.ibb.co.com/p63j30yV/Screenshot-2026-04-29-133010.png',
                'https://i.ibb.co.com/V0sHDXdw/Screenshot-2026-04-29-133155.png',
                'https://i.ibb.co.com/Wv3XrQd7/Screenshot-2026-04-29-133201.png',
                'https://i.ibb.co.com/9HWpDmRR/Screenshot-2026-04-29-133225.png',
                'https://i.ibb.co.com/qY7qQpF3/Screenshot-2026-04-29-133333.png',
                'https://i.ibb.co.com/jkh1Qrv6/Screenshot-2026-04-29-133621.png',
                'https://i.ibb.co.com/qYWYYJ4S/Screenshot-2026-04-29-133625.png',
                'https://i.ibb.co.com/JWVy7VGn/Screenshot-2026-04-29-133814.png',
                'https://i.ibb.co.com/RGjML6zj/Screenshot-2026-04-29-134433.png',
                'https://i.ibb.co.com/yccmPn0x/Screenshot-2026-04-29-135428.png',
                'https://i.ibb.co.com/RGMbV9K3/Screenshot-2026-04-29-135710.png',
                'https://i.ibb.co.com/Wv7gbVpB/Screenshot-2026-04-29-140035.png',
                'https://i.ibb.co.com/F4KBmBCb/Screenshot-2026-04-29-140040.png',
                'https://i.ibb.co.com/ZzRyMT9k/Screenshot-2026-04-29-140425.png',
                'https://i.ibb.co.com/zWS9rZLw/Screenshot-2026-04-29-140429.png',
                'https://i.ibb.co.com/0yPT2cbH/Screenshot-2026-04-29-140454.png',
                'https://i.ibb.co.com/SDZHbjgV/Screenshot-2026-04-29-140502.png',
                'https://i.ibb.co.com/GvZr93TZ/Screenshot-2026-04-29-140554.png',
                'https://i.ibb.co.com/qMF5Z7jJ/Screenshot-2026-04-29-140601.png',
                'https://i.ibb.co.com/0Hx5NkR/Screenshot-2026-04-29-140615.png',
                'https://i.ibb.co.com/VY1MbrrG/Screenshot-2026-04-29-140630.png',
                'https://i.ibb.co.com/rLVF6xf/Screenshot-2026-04-29-140640.png',
                'https://i.ibb.co.com/k2kvMqWY/Screenshot-2026-04-29-140757.png',
                'https://i.ibb.co.com/Z6YdcsC7/Screenshot-2026-04-29-141204.png',
                'https://i.ibb.co.com/LD1zcccK/Screenshot-2026-04-29-142340.png'
              ].map((src, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 4) * 0.05 }}
                  className="break-inside-avoid relative group overflow-hidden border border-white/10 rounded-sm bg-white/5"
                >
                  <div className="flex items-center justify-center min-h-[150px] bg-transparent group-hover:bg-roblox-blue/5 transition-colors">
                     <img src={src} alt={`IRCE Memory ${i+1}`} referrerPolicy="no-referrer" className="w-full h-auto block object-cover brightness-125 saturate-110 drop-shadow-lg group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex items-end">
                    <span className="text-[10px] font-mono uppercase text-white/90 font-bold z-10 drop-shadow-md">IRCE MEMORIES</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* Recruitment CTA Section */}
      <section id="contact" className="py-24 sm:py-32 px-4 sm:px-6 relative overflow-hidden border-t border-roblox-blue/20">
        {/* VIDEO BACKGROUND 2: RECRUITMENT/CTA */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-black">
          <iframe 
            src="https://www.youtube.com/embed/ku-Q7yu5VCI?autoplay=1&mute=1&loop=1&playlist=ku-Q7yu5VCI&controls=0&showinfo=0&rel=0&modestbranding=1"
            allow="autoplay; encrypted-media"
            className="absolute top-1/2 left-1/2 w-[200vw] h-[112.5vw] min-h-[200vh] min-w-[355.5vh] -translate-x-1/2 -translate-y-1/2 opacity-75 pointer-events-none brightness-110"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-transparent to-transparent" />
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,162,255,0.15)_0%,transparent_70%)] z-10" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-roblox-blue to-transparent opacity-50 z-10" />
        
        {/* Radar/Grid background animation */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-screen z-10 pointer-events-none" />
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-roblox-blue/20 border-t-roblox-blue/60 z-10 pointer-events-none"
        />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-16 h-16 sm:w-20 sm:h-20 bg-roblox-blue/10 border border-roblox-blue/30 rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,162,255,0.2)]"
          >
             <Shield className="text-roblox-blue w-8 h-8 sm:w-10 sm:h-10" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-6xl md:text-7xl font-display font-black mb-6 tracking-tighter uppercase italic"
          >
            READY TO <span className="text-roblox-blue">DOMINATE?</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-text-sec text-base sm:text-xl max-w-2xl mx-auto font-medium leading-relaxed mb-12"
          >
            Pintu IRCE selalu terbuka untuk individu ambisius yang siap mengasah kemampuan dan bertarung di turnamen tingkat tertinggi. 
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 sm:gap-6 w-full"
          >
            <motion.a 
              href="https://discord.gg/kt5nJspbW"
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="roblox-btn-primary w-full sm:w-auto text-base sm:text-lg px-8 sm:px-12 py-4 shadow-[0_0_20px_rgba(0,162,255,0.3)] hover:shadow-[0_0_40px_rgba(0,162,255,0.6)]"
            >
              ENLIST NOW (DISCORD)
            </motion.a>
            <motion.a 
              href="https://chat.whatsapp.com/FZk2OAGTCYy8thvvEeY1vj"
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="roblox-btn-sec w-full sm:w-auto text-base sm:text-lg px-8 sm:px-12 py-4 border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 shadow-[0_0_20px_rgba(37,211,102,0.1)] hover:shadow-[0_0_30px_rgba(37,211,102,0.3)] flex justify-center"
            >
              JOIN WHATSAPP COMMS
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-black/80 backdrop-blur-md py-20 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 lg:gap-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1 rounded-sm">
                <svg viewBox="0 0 100 100" className="w-5 h-5 fill-black">
                  <path d="M20 20 L80 25 L75 80 L15 75 Z" />
                  <path d="M40 40 L60 42 L58 58 L38 56 Z" fill="white" />
                </svg>
              </div>
              <span className="font-display font-black text-3xl tracking-tighter uppercase italic">IRCE</span>
            </div>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.1em] max-w-xs leading-relaxed">
              Organisasi esport internasional yang berdedikasi untuk memajukan komunitas Roblox secara global.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-16">
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-black text-roblox-blue uppercase tracking-widest">Navigation</span>
              <div className="flex flex-col gap-2 text-xs font-bold text-white/40 uppercase tracking-tighter">
                <a href="#roster" className="hover:text-white transition-colors">Elite Roster</a>
                <a href="#arena" className="hover:text-white transition-colors">Combat Arena</a>
                <a href="#about" className="hover:text-white transition-colors">Operations</a>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Connect</span>
              <div className="flex flex-col gap-2 text-xs font-bold text-white/40 uppercase tracking-tighter">
                <a href="https://discord.gg/kt5nJspbW" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Discord Hub</a>
                <a href="https://chat.whatsapp.com/FZk2OAGTCYy8thvvEeY1vj" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">WhatsApp</a>
                <a href="#" className="hover:text-white transition-colors">Roblox Group</a>
                <a href="#" className="hover:text-white transition-colors">YouTube</a>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] font-black text-white/10 uppercase tracking-widest">
            © 2024 IRCE. ALL RIGHTS RESERVED. NOT AFFILIATED WITH ROBLOX CORP.
          </p>
          <div className="flex gap-6">
             <div className="w-2 h-2 bg-roblox-green rounded-full shadow-[0_0_8px_rgba(0,176,111,0.5)]"></div>
             <span className="text-[9px] font-black text-roblox-green uppercase tracking-widest">Systems Online</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

