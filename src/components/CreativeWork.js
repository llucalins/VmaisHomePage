import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const CreativeWorkSection = styled.section`
  padding: 120px 0;
  background: #f8f8f8;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const SectionHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: 80px;
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: 300;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: -1px;
`;

const SectionSubtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
`;

const WorkGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
`;

const WorkCard = styled(motion.div)`
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const WorkImage = styled.div`
  width: 100%;
  height: 250px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
    opacity: 0.8;
  }
`;

const WorkContent = styled.div`
  padding: 30px;
`;

const WorkAgency = styled.div`
  font-size: 0.9rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 10px;
`;

const WorkTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: #000;
`;

const WorkDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #666;
  margin-bottom: 20px;
`;

const ViewButton = styled.button`
  background: transparent;
  border: 2px solid #000;
  color: #000;
  padding: 10px 20px;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #000;
    color: #fff;
  }
`;

const SeeMoreButton = styled(motion.button)`
  display: block;
  margin: 0 auto;
  background: #000;
  color: #fff;
  border: 2px solid #000;
  padding: 15px 40px;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: transparent;
    color: #000;
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: #fff;
  max-width: 800px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  border-radius: 8px;
  position: relative;
`;

const ModalImage = styled.div`
  width: 100%;
  height: 300px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
  border-radius: 8px 8px 0 0;
`;

const ModalBody = styled.div`
  padding: 40px;
`;

const ModalTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 20px;
`;

const ModalDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #666;
  margin-bottom: 30px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: #fff;
  font-size: 2rem;
  cursor: pointer;
  z-index: 10001;
`;

const CreativeWork = () => {
  const [selectedWork, setSelectedWork] = useState(null);

  const works = [
    {
      id: 1,
      agency: "Vmais São Paulo",
      title: "Campanha Nike - Just Do It",
      description: "Uma campanha inovadora que revolucionou a forma como a Nike se conecta com seus consumidores através de storytelling emocional.",
      image: "https://via.placeholder.com/400x250/ff6b6b/ffffff?text=Nike+Campaign"
    },
    {
      id: 2,
      agency: "Vmais Rio de Janeiro",
      title: "Redesign Coca-Cola",
      description: "Redesign completo da identidade visual da Coca-Cola, mantendo a essência da marca enquanto moderniza sua presença digital.",
      image: "https://via.placeholder.com/400x250/4ecdc4/ffffff?text=Coca-Cola+Redesign"
    },
    {
      id: 3,
      agency: "Vmais Digital",
      title: "App Spotify - Discover Weekly",
      description: "Desenvolvimento da estratégia de comunicação digital para o lançamento do Discover Weekly, revolucionando a descoberta de música.",
      image: "https://via.placeholder.com/400x250/45b7d1/ffffff?text=Spotify+App"
    },
    {
      id: 4,
      agency: "Vmais Creative",
      title: "Campanha Dove - Real Beauty",
      description: "Campanha global que redefiniu os padrões de beleza e empoderou mulheres ao redor do mundo.",
      image: "https://via.placeholder.com/400x250/ff6b6b/ffffff?text=Dove+Campaign"
    },
    {
      id: 5,
      agency: "Vmais Media",
      title: "Estratégia Netflix",
      description: "Planejamento de mídia integrada que transformou a Netflix na principal plataforma de streaming do Brasil.",
      image: "https://via.placeholder.com/400x250/4ecdc4/ffffff?text=Netflix+Strategy"
    },
    {
      id: 6,
      agency: "Vmais Events",
      title: "Festival Tomorrowland Brasil",
      description: "Conceituação e execução completa da comunicação para o maior festival de música eletrônica do Brasil.",
      image: "https://via.placeholder.com/400x250/45b7d1/ffffff?text=Tomorrowland"
    }
  ];

  return (
    <CreativeWorkSection>
      <Container>
        <SectionHeader
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <SectionTitle>Nossos Trabalhos Criativos</SectionTitle>
          <SectionSubtitle>
            Descubra algumas das nossas campanhas mais impactantes que transformaram marcas e conectaram com audiências
          </SectionSubtitle>
        </SectionHeader>

        <WorkGrid>
          {works.map((work, index) => (
            <WorkCard
              key={work.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => setSelectedWork(work)}
              whileHover={{ scale: 1.02 }}
            >
              <WorkImage />
              <WorkContent>
                <WorkAgency>{work.agency}</WorkAgency>
                <WorkTitle>{work.title}</WorkTitle>
                <WorkDescription>{work.description}</WorkDescription>
                <ViewButton>Ver Projeto</ViewButton>
              </WorkContent>
            </WorkCard>
          ))}
        </WorkGrid>

        <SeeMoreButton
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
        >
          Ver Mais Trabalhos
        </SeeMoreButton>
      </Container>

      <AnimatePresence>
        {selectedWork && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedWork(null)}
          >
            <CloseButton onClick={() => setSelectedWork(null)}>×</CloseButton>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalImage />
              <ModalBody>
                <ModalTitle>{selectedWork.title}</ModalTitle>
                <ModalDescription>{selectedWork.description}</ModalDescription>
                <p><strong>Agência:</strong> {selectedWork.agency}</p>
              </ModalBody>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </CreativeWorkSection>
  );
};

export default CreativeWork;
