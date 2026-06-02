import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MarketingPage from './pages/MarketingPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';

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
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<MarketingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
            </BrowserRouter>
          </motion.div>
        )}
      </AnimatePresence>
    </AppContainer>
  );
}

export default App;
