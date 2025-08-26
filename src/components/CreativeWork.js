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
  background: ${props => props.gradient || 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)'};
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${props => props.gradient || 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)'};
    opacity: 0.9;
  }

  .client-name {
    position: relative;
    z-index: 2;
    text-align: center;
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

const WorkTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
`;

const Tag = styled.span`
  background: #f0f0f0;
  color: #666;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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
  background: ${props => props.gradient || 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)'};
  border-radius: 8px 8px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 3rem;
  font-weight: 700;
  text-transform: uppercase;
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
      agency: "Vmais Comunicação",
      client: "Prefeitura de Petrolina",
      title: "Campanha Institucional",
      description: "Desenvolvimento de campanha institucional completa para a Prefeitura de Petrolina, incluindo produção de vídeos, gestão de redes sociais e comunicação estratégica para aproximar a gestão municipal da população.",
      tags: ["Campanha Institucional", "Produção de Vídeo", "Gestão de Redes", "Comunicação Pública"],
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      services: ["Produção Audiovisual", "Gestão de Redes Sociais", "Comunicação Institucional", "Design Gráfico"]
    },
    {
      id: 2,
      agency: "Vmais Comunicação",
      client: "Influenciadores Locais",
      title: "Gestão de Redes Sociais",
      description: "Gestão completa de redes sociais para influenciadores locais, criando estratégias personalizadas que aumentam o engajamento e fortalecem a presença digital dos clientes.",
      tags: ["Gestão de Redes", "Influenciadores", "Marketing Digital", "Engajamento"],
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      services: ["Gestão de Redes Sociais", "Criação de Conteúdo", "Estratégia Digital", "Analytics"]
    },
    {
      id: 3,
      agency: "Vmais Comunicação",
      client: "Empresas Locais",
      title: "Marketing Digital Completo",
      description: "Soluções integradas de marketing digital para pequenas e médias empresas da região, incluindo identidade visual, campanhas publicitárias e presença online.",
      tags: ["Marketing Digital", "Identidade Visual", "Campanhas", "Pequenas Empresas"],
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      services: ["Branding", "Marketing Digital", "Design Gráfico", "Publicidade"]
    },
    {
      id: 4,
      agency: "Vmais Comunicação",
      client: "Eventos Regionais",
      title: "Produção de Eventos",
      description: "Produção audiovisual e comunicação para eventos regionais, capturando momentos especiais e criando conteúdo que gera engajamento e visibilidade.",
      tags: ["Produção de Eventos", "Audiovisual", "Fotografia", "Vídeo"],
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      services: ["Produção Audiovisual", "Fotografia", "Edição de Vídeo", "Cobertura de Eventos"]
    },
    {
      id: 5,
      agency: "Vmais Comunicação",
      client: "Instituições Públicas",
      title: "Comunicação Institucional",
      description: "Desenvolvimento de estratégias de comunicação institucional para órgãos públicos, criando conexão entre governo e cidadãos através de conteúdo relevante e transparente.",
      tags: ["Comunicação Institucional", "Setor Público", "Transparência", "Cidadania"],
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      services: ["Comunicação Institucional", "Produção de Conteúdo", "Gestão de Crises", "Relacionamento com Mídia"]
    },
    {
      id: 6,
      agency: "Vmais Comunicação",
      client: "Pequenos Negócios",
      title: "Transformação Digital",
      description: "Acompanhamento completo da transformação digital de pequenos negócios, desde a criação da identidade visual até a implementação de estratégias de marketing digital.",
      tags: ["Transformação Digital", "Pequenos Negócios", "Inovação", "Crescimento"],
      gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      services: ["Consultoria Digital", "Branding", "Marketing Digital", "Gestão de Redes Sociais"]
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
            Descubra alguns dos nossos projetos mais impactantes que transformaram marcas e conectaram com audiências
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
              <WorkImage gradient={work.gradient}>
                <div className="client-name">{work.client}</div>
              </WorkImage>
              <WorkContent>
                <WorkAgency>{work.agency}</WorkAgency>
                <WorkTitle>{work.title}</WorkTitle>
                <WorkDescription>{work.description}</WorkDescription>
                <WorkTags>
                  {work.tags.map((tag, tagIndex) => (
                    <Tag key={tagIndex}>{tag}</Tag>
                  ))}
                </WorkTags>
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
              <ModalImage gradient={selectedWork.gradient}>
                {selectedWork.client}
              </ModalImage>
              <ModalBody>
                <ModalTitle>{selectedWork.title}</ModalTitle>
                <ModalDescription>{selectedWork.description}</ModalDescription>
                <p><strong>Cliente:</strong> {selectedWork.client}</p>
                <p><strong>Agência:</strong> {selectedWork.agency}</p>
                <div style={{ marginTop: '20px' }}>
                  <strong>Serviços Prestados:</strong>
                  <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                    {selectedWork.services.map((service, index) => (
                      <li key={index} style={{ marginBottom: '5px', color: '#666' }}>{service}</li>
                    ))}
                  </ul>
                </div>
              </ModalBody>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </CreativeWorkSection>
  );
};

export default CreativeWork;
