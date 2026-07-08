import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';

const HeaderContainer = styled(motion.header)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: ${props => props.scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent'};
  backdrop-filter: ${props => props.scrolled ? 'blur(10px)' : 'none'};
  transition: all 0.3s ease;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  max-width: 1400px;
  margin: 0 auto;
`;

const LogoContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  cursor: pointer;
  position: relative;
`;

const LogoMain = styled(motion.div)`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.scrolled ? '#000' : '#fff'};
  text-transform: uppercase;
  letter-spacing: -1px;
  position: relative;
  display: flex;
  align-items: center;
`;

const LetterV = styled(motion.span)`
  font-size: 2.2rem;
  margin-right: 2px;
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
    font-size: 0.8rem;
    font-weight: 900;
    color: ${props => props.scrolled ? '#000' : '#fff'};
    opacity: 0;
    transition: all 0.3s ease;
  }
  
  &:hover::after {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.2);
  }
`;

const LogoSubtitle = styled(motion.div)`
  font-size: 0.7rem;
  font-weight: 300;
  color: ${props => props.scrolled ? '#000' : '#fff'};
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-top: -2px;
  opacity: 0.8;
`;

const LogoGlow = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  z-index: -1;
`;

const MenuItems = styled.ul`
  display: flex;
  gap: 40px;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MenuItem = styled.li`
  position: relative;
  cursor: pointer;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.9rem;
  transition: color 0.3s ease;
  color: ${props => props.scrolled ? '#000' : '#fff'};

  &:hover {
    color: #666;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: ${props => props.scrolled ? '#000' : '#fff'};
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;

  @media (max-width: 768px) {
    display: flex;
  }

  span {
    width: 25px;
    height: 2px;
    background: ${props => props.scrolled ? '#000' : '#fff'};
    transition: all 0.3s ease;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: #fff;
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
`;

const MobileMenuItem = styled.div`
  font-size: 2rem;
  font-weight: 300;
  cursor: pointer;
  transition: color 0.3s ease;
  color: #000;

  &:hover {
    color: #666;
  }
`;

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    'QUEM SOMOS',
    'SOLUÇÕES',
    'PORTFÓLIO',
    'CLIENTES',
    'CONTEÚDOS',
    'CONTATO'
  ];

  const logoVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const letterVariants = {
    initial: { opacity: 0, x: -20 },
    animate: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    }),
    hover: {
      y: -2,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const glowVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        delay: 0.5,
        duration: 1,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.2,
      opacity: 0.3,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <HeaderContainer
      scrolled={scrolled}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Nav>
        <LogoContainer
          variants={logoVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
        >
          <LogoGlow
            variants={glowVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
          />
          <LogoMain scrolled={scrolled}>
            <LetterV
              custom={0}
              variants={letterVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
            >
              V
            </LetterV>
            <LetterA
              custom={1}
              variants={letterVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              scrolled={scrolled}
            >
              m
            </LetterA>
            <LetterA
              custom={2}
              variants={letterVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              scrolled={scrolled}
            >
              a
            </LetterA>
            <LetterA
              custom={3}
              variants={letterVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              scrolled={scrolled}
            >
              i
            </LetterA>
            <LetterA
              custom={4}
              variants={letterVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              scrolled={scrolled}
            >
              s
            </LetterA>
          </LogoMain>
          <LogoSubtitle
            scrolled={scrolled}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            Comunicação
          </LogoSubtitle>
        </LogoContainer>
        
        <MenuItems>
          {menuItems.map((item, index) => (
            <MenuItem 
              key={index} 
              scrolled={scrolled}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
            >
              {item}
            </MenuItem>
          ))}
        </MenuItems>

        <MobileMenuButton 
          scrolled={scrolled}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span style={{ transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></span>
          <span style={{ opacity: mobileMenuOpen ? 0 : 1 }}></span>
          <span style={{ transform: mobileMenuOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none' }}></span>
        </MobileMenuButton>
      </Nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenu
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3 }}
          >
            {menuItems.map((item, index) => (
              <MobileMenuItem 
                key={index}
                onClick={() => setMobileMenuOpen(false)}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                {item}
              </MobileMenuItem>
            ))}
          </MobileMenu>
        )}
      </AnimatePresence>
    </HeaderContainer>
  );
};

export default Header;
