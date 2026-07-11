import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const HeroSection = styled.section`
  height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #000;
`;

const VideoBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 2;
  }
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PlusRevealLayer = styled.div`
  --mouse-x: 50%;
  --mouse-y: 50%;

  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.28s ease;
  z-index: 2;
  mask-image: radial-gradient(circle 260px at var(--mouse-x) var(--mouse-y), #000 0%, #000 42%, rgba(0, 0, 0, 0.58) 64%, transparent 82%);
  -webkit-mask-image: radial-gradient(circle 260px at var(--mouse-x) var(--mouse-y), #000 0%, #000 42%, rgba(0, 0, 0, 0.58) 64%, transparent 82%);

  &[data-active="true"] {
    opacity: 0.92;
  }

  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
`;

const StaticPlus = styled.span`
  display: block;
  height: ${({ $size }) => $size}px;
  left: ${({ $left }) => $left}%;
  opacity: ${({ $opacity }) => $opacity};
  position: absolute;
  top: 0;
  transform: translate3d(0, ${({ $top }) => $top}vh, 0) rotate(${({ $rotate }) => $rotate}deg);
  user-select: none;
  width: ${({ $size }) => $size}px;
  filter: drop-shadow(0 0 22px rgba(226, 61, 50, 0.16));

  .plus-bar {
    background: rgba(226, 61, 50, 0.03);
    border: ${({ $stroke }) => $stroke}px solid rgba(226, 61, 50, 0.9);
    box-shadow: inset 0 0 18px rgba(226, 61, 50, 0.08);
    display: block;
    position: absolute;
  }

  .plus-bar-horizontal {
    border-radius: ${({ $hRadius }) => $hRadius}px;
    height: ${({ $hHeight }) => $hHeight}%;
    left: ${({ $hLeft }) => $hLeft}%;
    top: ${({ $hTop }) => $hTop}%;
    transform: rotate(${({ $hRotate }) => $hRotate}deg);
    width: ${({ $hWidth }) => $hWidth}%;
  }

  .plus-bar-vertical {
    border-radius: ${({ $vRadius }) => $vRadius}px;
    height: ${({ $vHeight }) => $vHeight}%;
    left: ${({ $vLeft }) => $vLeft}%;
    top: ${({ $vTop }) => $vTop}%;
    transform: rotate(${({ $vRotate }) => $vRotate}deg);
    width: ${({ $vWidth }) => $vWidth}%;
  }
`;

const HeroContent = styled(motion.div)`
  position: relative;
  z-index: 3;
  text-align: center;
  color: #fff;
  max-width: 800px;
  padding: 0 20px;
`;

const LogoContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60px;
  position: relative;
`;

const LogoMain = styled(motion.div)`
  font-size: 4rem;
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: -2px;
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const LetterV = styled(motion.span)`
  font-size: 4.5rem;
  margin-right: 4px;
`;

const LetterA = styled(motion.span)`
  position: relative;
  display: inline-block;
  
  &::after {
    content: '+';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.5rem;
    font-weight: 900;
    color: #fff;
    opacity: 0;
    transition: all 0.3s ease;
  }
  
  &:hover::after {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.2);
  }
`;

const LogoSubtitle = styled(motion.div)`
  font-size: 1.2rem;
  font-weight: 300;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 4px;
  opacity: 0.8;
`;

const LogoGlow = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  z-index: -1;
`;

const MainTitle = styled(motion.h1)`
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 300;
  line-height: 1.1;
  margin-bottom: 30px;
  text-transform: uppercase;
  letter-spacing: -2px;
`;

const Subtitle = styled(motion.h2)`
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 300;
  margin-bottom: 40px;
  opacity: 0.9;
`;

const ScrollIndicator = styled(motion.div)`
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  z-index: 3;
  
  &::after {
    content: '';
    position: absolute;
    top: 30px;
    left: 50%;
    transform: translateX(-50%);
    width: 1px;
    height: 40px;
    background: #fff;
    animation: scroll 2s infinite;
  }
  
  @keyframes scroll {
    0% { transform: translateX(-50%) scaleY(0); transform-origin: top; }
    50% { transform: translateX(-50%) scaleY(1); transform-origin: top; }
    100% { transform: translateX(-50%) scaleY(0); transform-origin: bottom; }
  }
`;

const plusMarks = [
  { left: 8, top: 9, size: 142, rotate: -12, opacity: 0.46, stroke: 2 },
  { left: 18, top: 14, size: 190, rotate: 8, opacity: 0.38, stroke: 2 },
  { left: 29, top: 7, size: 120, rotate: 18, opacity: 0.44, stroke: 2 },
  { left: 41, top: 16, size: 176, rotate: -6, opacity: 0.34, stroke: 2 },
  { left: 55, top: 8, size: 138, rotate: 15, opacity: 0.42, stroke: 2 },
  { left: 68, top: 15, size: 210, rotate: -10, opacity: 0.34, stroke: 2 },
  { left: 82, top: 7, size: 152, rotate: 7, opacity: 0.4, stroke: 2 },
  { left: 3, top: 34, size: 205, rotate: 9, opacity: 0.32, stroke: 2 },
  { left: 17, top: 35, size: 132, rotate: -18, opacity: 0.48, stroke: 2 },
  { left: 29, top: 31, size: 224, rotate: 4, opacity: 0.32, stroke: 2 },
  { left: 46, top: 37, size: 148, rotate: -10, opacity: 0.44, stroke: 2 },
  { left: 58, top: 31, size: 196, rotate: 16, opacity: 0.36, stroke: 2 },
  { left: 74, top: 36, size: 132, rotate: -5, opacity: 0.5, stroke: 2 },
  { left: 86, top: 32, size: 220, rotate: 10, opacity: 0.3, stroke: 2 },
  { left: 9, top: 61, size: 154, rotate: -7, opacity: 0.42, stroke: 2 },
  { left: 22, top: 57, size: 238, rotate: 12, opacity: 0.28, stroke: 2 },
  { left: 39, top: 63, size: 128, rotate: -16, opacity: 0.5, stroke: 2 },
  { left: 50, top: 58, size: 212, rotate: 6, opacity: 0.34, stroke: 2 },
  { left: 66, top: 64, size: 150, rotate: -12, opacity: 0.44, stroke: 2 },
  { left: 78, top: 58, size: 236, rotate: 14, opacity: 0.3, stroke: 2 }
];

const getPlusShape = (index) => {
  const length = 62 + (index % 5) * 5;
  const thickness = 10 + (index % 4) * 2;
  const offset = (100 - length) / 2;
  const center = (100 - thickness) / 2;
  const tilt = -1.5 + (index % 4);
  const radius = index % 2 === 0 ? 4 : 999;

  return {
    hWidth: length,
    hHeight: thickness,
    hLeft: offset,
    hTop: center,
    hRotate: tilt,
    hRadius: radius,
    vWidth: thickness,
    vHeight: length,
    vLeft: center,
    vTop: offset,
    vRotate: -tilt,
    vRadius: radius
  };
};

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showLogo, setShowLogo] = useState(true);
  const plusLayerRef = useRef(null);
  const pointerFrameRef = useRef(null);

  const slides = [
    {
      title: "COMUNICAÇÃO",
      subtitle: "que conecta e engaja",
      video: "https://www.havas.com/wp-content/uploads/2023/12/Havas-Homepage-Hero-Video.mp4"
    },
    {
      title: "CRIATIVIDADE",
      subtitle: "que transforma e inspira",
      video: "https://www.havas.com/wp-content/uploads/2023/12/Havas-Homepage-Hero-Video.mp4"
    },
    {
      title: "INOVAÇÃO",
      subtitle: "que impulsiona resultados",
      video: "https://www.havas.com/wp-content/uploads/2023/12/Havas-Homepage-Hero-Video.mp4"
    }
  ];

  useEffect(() => {
    return () => {
      if (pointerFrameRef.current) {
        window.cancelAnimationFrame(pointerFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let interval;
    
    if (showLogo) {
      // Logo fica visível por 4 segundos
      const logoTimer = setTimeout(() => {
        setShowLogo(false);
      }, 4000);
      
      return () => clearTimeout(logoTimer);
    } else {
      // Carrossel de frases
      interval = setInterval(() => {
        setCurrentSlide((prev) => {
          const nextSlide = (prev + 1) % slides.length;
          
          // Se chegou ao final do carrossel, volta para a logo
          if (nextSlide === 0) {
            setTimeout(() => {
              setShowLogo(true);
            }, 3000); // Aguarda 3 segundos na última frase antes de voltar para logo
          }
          
          return nextSlide;
        });
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [showLogo, slides.length]);

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  const handlePointerMove = useCallback((event) => {
    const layer = plusLayerRef.current;

    if (!layer || event.pointerType !== 'mouse') {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const bounds = layer.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;

    if (pointerFrameRef.current) {
      window.cancelAnimationFrame(pointerFrameRef.current);
    }

    pointerFrameRef.current = window.requestAnimationFrame(() => {
      layer.style.setProperty('--mouse-x', `${x}px`);
      layer.style.setProperty('--mouse-y', `${y}px`);
      layer.dataset.active = 'true';
    });
  }, []);

  const handlePointerLeave = useCallback(() => {
    const layer = plusLayerRef.current;

    if (layer) {
      layer.dataset.active = 'false';
    }
  }, []);

  const logoVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 1.5,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.8,
        ease: "easeIn"
      }
    }
  };

  const letterVariants = {
    initial: { opacity: 0, x: -30 },
    animate: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.8,
        ease: "easeOut"
      }
    })
  };

  const glowVariants = {
    initial: { opacity: 0, scale: 0.5 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        delay: 1,
        duration: 1.5,
        ease: "easeOut"
      }
    }
  };

  const contentVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -50,
      transition: {
        duration: 0.8,
        ease: "easeIn"
      }
    }
  };

  return (
    <HeroSection onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
      <VideoBackground>
        <Video autoPlay muted loop playsInline>
          <source src={slides[currentSlide].video} type="video/mp4" />
          Seu navegador não suporta vídeos.
        </Video>
      </VideoBackground>
      <PlusRevealLayer ref={plusLayerRef} aria-hidden="true" data-active="false">
        {plusMarks.map((plus, index) => {
          const shape = getPlusShape(index);

          return (
            <StaticPlus
              key={index}
              $left={plus.left}
              $top={plus.top}
              $size={plus.size}
              $rotate={plus.rotate}
              $opacity={plus.opacity}
              $stroke={plus.stroke}
              $hWidth={shape.hWidth}
              $hHeight={shape.hHeight}
              $hLeft={shape.hLeft}
              $hTop={shape.hTop}
              $hRotate={shape.hRotate}
              $hRadius={shape.hRadius}
              $vWidth={shape.vWidth}
              $vHeight={shape.vHeight}
              $vLeft={shape.vLeft}
              $vTop={shape.vTop}
              $vRotate={shape.vRotate}
              $vRadius={shape.vRadius}
            >
              <span className="plus-bar plus-bar-horizontal" />
              <span className="plus-bar plus-bar-vertical" />
            </StaticPlus>
          );
        })}
      </PlusRevealLayer>

      <HeroContent>
        <AnimatePresence mode="wait">
          {showLogo ? (
            <LogoContainer
              key="logo"
              variants={logoVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <LogoGlow
                variants={glowVariants}
                initial="initial"
                animate="animate"
              />
              <LogoMain>
                <LetterV
                  custom={0}
                  variants={letterVariants}
                  initial="initial"
                  animate="animate"
                >
                  V
                </LetterV>
                <LetterA
                  custom={1}
                  variants={letterVariants}
                  initial="initial"
                  animate="animate"
                >
                  m
                </LetterA>
                <LetterA
                  custom={2}
                  variants={letterVariants}
                  initial="initial"
                  animate="animate"
                >
                  a
                </LetterA>
                <LetterA
                  custom={3}
                  variants={letterVariants}
                  initial="initial"
                  animate="animate"
                >
                  i
                </LetterA>
                <LetterA
                  custom={4}
                  variants={letterVariants}
                  initial="initial"
                  animate="animate"
                >
                  s
                </LetterA>
              </LogoMain>
              <LogoSubtitle
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0.8, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              >
                Comunicação
              </LogoSubtitle>
            </LogoContainer>
          ) : (
            <motion.div
              key="content"
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <MainTitle
                key={currentSlide}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.8 }}
              >
                {slides[currentSlide].title}
              </MainTitle>
              
              <Subtitle
                key={`subtitle-${currentSlide}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {slides[currentSlide].subtitle}
              </Subtitle>
            </motion.div>
          )}
        </AnimatePresence>
      </HeroContent>

      <ScrollIndicator
        onClick={handleScrollDown}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: showLogo ? 2.5 : 1.5, duration: 1 }}
      >
        Role para baixo
      </ScrollIndicator>
    </HeroSection>
  );
};

export default Hero;
