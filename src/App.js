import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutUs from './components/AboutUs';
import Services from './components/Services';
import CreativeWork from './components/CreativeWork';
import Contact from './components/Contact';
import Footer from './components/Footer';

const AppContainer = styled.div`
  min-height: 100vh;
  overflow-x: hidden;
`;

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular tempo de carregamento
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <AppContainer>
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              color: '#fff',
              fontSize: '2rem',
              fontWeight: 300
            }}
          >
            Vmais Comunicação
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Header />
            <Hero />
            <AboutUs />
            <Services />
            <CreativeWork />
            <Contact />
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </AppContainer>
  );
}

export default App;
