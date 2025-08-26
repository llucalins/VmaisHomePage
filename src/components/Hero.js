import React, { useState, useEffect } from 'react';
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

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showLogo, setShowLogo] = useState(true);
  const [isLogoVisible, setIsLogoVisible] = useState(true);

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
    let interval;
    
    if (showLogo) {
      // Logo fica visível por 4 segundos
      const logoTimer = setTimeout(() => {
        setShowLogo(false);
        setIsLogoVisible(false);
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
              setIsLogoVisible(true);
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
    <HeroSection>
      <VideoBackground>
        <Video autoPlay muted loop playsInline>
          <source src={slides[currentSlide].video} type="video/mp4" />
          Seu navegador não suporta vídeos.
        </Video>
      </VideoBackground>

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
