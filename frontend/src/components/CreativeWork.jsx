import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const CreativeWorkSection = styled.section`
  padding: 120px 0;
  background: #080808;
  color: #ffffff;
  overflow: hidden;
  position: relative;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 2;
`;

const SectionHeader = styled(motion.div)`
  align-items: end;
  display: grid;
  gap: 40px;
  grid-template-columns: 1.05fr 0.95fr;
  margin-bottom: 64px;

  @media (max-width: 820px) {
    align-items: start;
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const HeaderLabel = styled.span`
  color: #bdbdbd;
  display: block;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0;
  margin-bottom: 18px;
  text-transform: uppercase;
`;

const SectionTitle = styled.h2`
  font-size: 4.2rem;
  font-weight: 300;
  line-height: 1.02;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0;

  @media (max-width: 980px) {
    font-size: 3.35rem;
  }

  @media (max-width: 640px) {
    font-size: 2.35rem;
  }
`;

const SectionSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.68);
  font-size: 1.08rem;
  line-height: 1.8;
  margin: 0;
  max-width: 520px;
`;

const WorkGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 20px;
  margin-bottom: 44px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const WorkCard = styled(motion.article)`
  --accent: ${({ $accent }) => $accent};

  background: #f7f7f2;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  color: #090909;
  cursor: pointer;
  display: grid;
  grid-column: ${({ $wide }) => ($wide ? 'span 8' : 'span 4')};
  grid-template-rows: ${({ $wide }) => ($wide ? '1fr' : '260px auto')};
  min-height: ${({ $wide }) => ($wide ? '430px' : '520px')};
  overflow: hidden;
  position: relative;
  transition: border-color 0.35s ease, box-shadow 0.35s ease;

  ${({ $wide }) => $wide && `
    grid-template-columns: 1.05fr 0.95fr;
  `}

  &:hover {
    border-color: var(--accent);
    box-shadow: 0 32px 70px rgba(0, 0, 0, 0.38);
  }

  @media (max-width: 900px) {
    grid-column: span 1;
    grid-template-columns: 1fr;
    grid-template-rows: 250px auto;
    min-height: 500px;
  }

  @media (max-width: 640px) {
    min-height: 0;
  }
`;

const VisualPanel = styled.div`
  align-items: stretch;
  background:
    linear-gradient(135deg, ${({ $accent }) => $accent} 0%, ${({ $secondary }) => $secondary} 100%);
  display: flex;
  min-height: 100%;
  overflow: hidden;
  padding: 24px;
  position: relative;

  &::before {
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.18) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.18) 1px, transparent 1px);
    background-size: 38px 38px;
    content: '';
    inset: 0;
    opacity: 0.28;
    position: absolute;
  }

  &::after {
    border: 1px solid rgba(255, 255, 255, 0.42);
    content: '';
    height: 180px;
    position: absolute;
    right: -54px;
    top: 44px;
    transform: rotate(18deg);
    width: 180px;
  }
`;

const CampaignMockup = styled(motion.div)`
  align-self: end;
  background: rgba(8, 8, 8, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 8px;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: ${({ $wide }) => ($wide ? '310px' : '210px')};
  padding: 24px;
  position: relative;
  width: 100%;
  z-index: 1;
`;

const MockupTopline = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;

const MockupType = styled.span`
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0;
  opacity: 0.72;
  text-transform: uppercase;
`;

const MockupMark = styled.span`
  background: ${({ $accent }) => $accent};
  display: block;
  height: 12px;
  width: 44px;
`;

const MockupClient = styled.div`
  font-size: ${({ $wide }) => ($wide ? '2.5rem' : '1.7rem')};
  font-weight: 800;
  line-height: 1.08;
  margin-top: 48px;
  max-width: 360px;
  text-transform: uppercase;
  letter-spacing: 0;

  @media (max-width: 640px) {
    font-size: 1.55rem;
  }
`;

const MockupFooter = styled.div`
  align-items: end;
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
`;

const MockupIndex = styled.span`
  font-size: 0.9rem;
  font-weight: 700;
  opacity: 0.68;
`;

const MockupMetric = styled.span`
  font-size: 2.1rem;
  font-weight: 300;
  line-height: 1;
`;

const WorkContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${({ $wide }) => ($wide ? '34px' : '28px')};
`;

const WorkAgency = styled.div`
  color: #5e5e5e;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0;
  margin-bottom: 14px;
  text-transform: uppercase;
`;

const WorkTitle = styled.h3`
  color: #080808;
  font-size: ${({ $wide }) => ($wide ? '2.25rem' : '1.55rem')};
  font-weight: 700;
  line-height: 1.16;
  margin-bottom: 18px;
  letter-spacing: 0;

  @media (max-width: 640px) {
    font-size: 1.45rem;
  }
`;

const WorkDescription = styled.p`
  color: #555555;
  font-size: 0.98rem;
  line-height: 1.75;
  margin-bottom: 24px;
`;

const WorkTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
`;

const Tag = styled.span`
  background: #e9e9e3;
  border: 1px solid #ddddd5;
  border-radius: 999px;
  color: #555555;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0;
  padding: 6px 11px;
  text-transform: uppercase;
`;

const WorkAction = styled.div`
  align-items: center;
  display: flex;
  gap: 12px;
  margin-top: 30px;
`;

const ActionIcon = styled.span`
  align-items: center;
  background: #080808;
  border-radius: 999px;
  color: #ffffff;
  display: flex;
  height: 38px;
  justify-content: center;
  transition: transform 0.35s ease, background 0.35s ease;
  width: 38px;

  ${WorkCard}:hover & {
    background: var(--accent);
    transform: translateX(4px);
  }
`;

const ActionText = styled.span`
  color: #080808;
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
`;

const InsightPanel = styled(motion.aside)`
  align-items: stretch;
  background: #ffffff;
  border-radius: 8px;
  color: #080808;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  margin-bottom: 44px;
  overflow: hidden;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const InsightCopy = styled.div`
  padding: 30px;
`;

const InsightTitle = styled.h3`
  font-size: 1.35rem;
  line-height: 1.35;
  margin-bottom: 12px;
  letter-spacing: 0;
`;

const InsightText = styled.p`
  color: #555555;
  font-size: 0.98rem;
  line-height: 1.7;
`;

const InsightStats = styled.div`
  background: #111111;
  color: #ffffff;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
`;

const Stat = styled.div`
  border-left: 1px solid rgba(255, 255, 255, 0.12);
  padding: 26px;

  @media (max-width: 760px) {
    border-left: 0;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
  }
`;

const StatValue = styled.div`
  font-size: 2.35rem;
  font-weight: 300;
  line-height: 1;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.62);
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
`;

const SeeMoreButton = styled(motion.button)`
  align-items: center;
  background: #ffffff;
  border: 1px solid #ffffff;
  border-radius: 999px;
  color: #080808;
  display: flex;
  font-size: 0.88rem;
  font-weight: 800;
  gap: 12px;
  letter-spacing: 0;
  margin: 0 auto;
  padding: 14px 18px 14px 24px;
  text-transform: uppercase;
  transition: background 0.3s ease, color 0.3s ease;

  &:hover {
    background: transparent;
    color: #ffffff;
  }
`;

const ButtonIcon = styled.span`
  align-items: center;
  background: #080808;
  border-radius: 999px;
  color: #ffffff;
  display: flex;
  height: 34px;
  justify-content: center;
  transition: background 0.3s ease, color 0.3s ease;
  width: 34px;

  ${SeeMoreButton}:hover & {
    background: #ffffff;
    color: #080808;
  }
`;

const Modal = styled(motion.div)`
  align-items: center;
  background: rgba(0, 0, 0, 0.86);
  display: flex;
  height: 100%;
  justify-content: center;
  left: 0;
  padding: 20px;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10000;
`;

const ModalContent = styled(motion.div)`
  background: #f7f7f2;
  border-radius: 8px;
  color: #080808;
  max-height: 84vh;
  max-width: 860px;
  overflow-y: auto;
  position: relative;
  width: 100%;
`;

const ModalHero = styled.div`
  background: linear-gradient(135deg, ${({ $accent }) => $accent} 0%, ${({ $secondary }) => $secondary} 100%);
  color: #ffffff;
  min-height: 280px;
  padding: 34px;
  position: relative;
  overflow: hidden;

  &::after {
    border: 1px solid rgba(255, 255, 255, 0.34);
    content: '';
    height: 220px;
    position: absolute;
    right: -42px;
    top: 32px;
    transform: rotate(16deg);
    width: 220px;
  }
`;

const ModalClient = styled.div`
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.05;
  max-width: 620px;
  position: relative;
  text-transform: uppercase;
  z-index: 1;

  @media (max-width: 640px) {
    font-size: 2rem;
  }
`;

const ModalBody = styled.div`
  padding: 36px;
`;

const ModalTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 18px;
`;

const ModalDescription = styled.p`
  color: #555555;
  font-size: 1.05rem;
  line-height: 1.8;
  margin-bottom: 26px;
`;

const ModalMeta = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-bottom: 26px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const MetaItem = styled.div`
  background: #ffffff;
  border: 1px solid #e5e2da;
  border-radius: 8px;
  padding: 16px;
`;

const MetaLabel = styled.div`
  color: #777777;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0;
  margin-bottom: 6px;
  text-transform: uppercase;
`;

const MetaValue = styled.div`
  font-weight: 700;
`;

const ServiceList = styled.ul`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 14px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ServiceItem = styled.li`
  background: #ffffff;
  border: 1px solid #e5e2da;
  border-radius: 8px;
  color: #555555;
  padding: 12px 14px;
`;

const CloseButton = styled.button`
  align-items: center;
  background: #ffffff;
  border-radius: 999px;
  color: #080808;
  display: flex;
  font-size: 1rem;
  font-weight: 800;
  height: 42px;
  justify-content: center;
  position: absolute;
  right: 20px;
  top: 20px;
  width: 42px;
  z-index: 10001;
`;

const ArrowIcon = () => (
  <svg aria-hidden="true" fill="none" height="17" viewBox="0 0 18 18" width="17">
    <path d="M5 13L13 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    <path d="M6 5h7v7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
  </svg>
);

const works = [
  {
    id: 1,
    agency: 'Vmais Comunicação',
    client: 'Prefeitura de Petrolina',
    title: 'Campanha Institucional',
    description: 'Desenvolvimento de campanha institucional completa para a Prefeitura de Petrolina, incluindo produção de vídeos, gestão de redes sociais e comunicação estratégica para aproximar a gestão municipal da população.',
    tags: ['Campanha Institucional', 'Produção de Vídeo', 'Gestão de Redes'],
    accent: '#E15D44',
    secondary: '#5A67D8',
    metric: '360',
    type: 'Comunicação pública',
    wide: true,
    services: ['Produção Audiovisual', 'Gestão de Redes Sociais', 'Comunicação Institucional', 'Design Gráfico']
  },
  {
    id: 2,
    agency: 'Vmais Comunicação',
    client: 'Influenciadores Locais',
    title: 'Gestão de Redes Sociais',
    description: 'Gestão completa de redes sociais para influenciadores locais, criando estratégias personalizadas que aumentam o engajamento e fortalecem a presença digital dos clientes.',
    tags: ['Gestão de Redes', 'Influenciadores', 'Engajamento'],
    accent: '#D4578E',
    secondary: '#F0A43A',
    metric: '+42%',
    type: 'Social strategy',
    services: ['Gestão de Redes Sociais', 'Criação de Conteúdo', 'Estratégia Digital', 'Analytics']
  },
  {
    id: 3,
    agency: 'Vmais Comunicação',
    client: 'Empresas Locais',
    title: 'Marketing Digital Completo',
    description: 'Soluções integradas de marketing digital para pequenas e médias empresas da região, incluindo identidade visual, campanhas publicitárias e presença online.',
    tags: ['Marketing Digital', 'Identidade Visual', 'Campanhas'],
    accent: '#1FA3A3',
    secondary: '#4A7BD0',
    metric: 'Full',
    type: 'Growth suite',
    services: ['Branding', 'Marketing Digital', 'Design Gráfico', 'Publicidade']
  },
  {
    id: 4,
    agency: 'Vmais Comunicação',
    client: 'Eventos Regionais',
    title: 'Produção de Eventos',
    description: 'Produção audiovisual e comunicação para eventos regionais, capturando momentos especiais e criando conteúdo que gera engajamento e visibilidade.',
    tags: ['Audiovisual', 'Fotografia', 'Vídeo'],
    accent: '#73A857',
    secondary: '#2E8B7C',
    metric: 'Live',
    type: 'Cobertura',
    services: ['Produção Audiovisual', 'Fotografia', 'Edição de Vídeo', 'Cobertura de Eventos']
  },
  {
    id: 5,
    agency: 'Vmais Comunicação',
    client: 'Instituições Públicas',
    title: 'Comunicação Institucional',
    description: 'Desenvolvimento de estratégias de comunicação institucional para órgãos públicos, criando conexão entre governo e cidadãos através de conteúdo relevante e transparente.',
    tags: ['Setor Público', 'Transparência', 'Cidadania'],
    accent: '#C4A03A',
    secondary: '#E15D44',
    metric: 'Gov',
    type: 'Reputação',
    services: ['Comunicação Institucional', 'Produção de Conteúdo', 'Gestão de Crises', 'Relacionamento com Mídia']
  },
  {
    id: 6,
    agency: 'Vmais Comunicação',
    client: 'Pequenos Negócios',
    title: 'Transformação Digital',
    description: 'Acompanhamento completo da transformação digital de pequenos negócios, desde a criação da identidade visual até a implementação de estratégias de marketing digital.',
    tags: ['Transformação Digital', 'Inovação', 'Crescimento'],
    accent: '#7E6EDB',
    secondary: '#1FA3A3',
    metric: 'Next',
    type: 'Evolução',
    wide: true,
    services: ['Consultoria Digital', 'Branding', 'Marketing Digital', 'Gestão de Redes Sociais']
  }
];

const CreativeWork = () => {
  const [selectedWork, setSelectedWork] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 42 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.58,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <CreativeWorkSection id="work">
      <Container>
        <SectionHeader
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, amount: 0.35 }}
        >
          <div>
            <HeaderLabel>Trabalhos criativos</HeaderLabel>
            <SectionTitle>Cases com cara, ritmo e resultado</SectionTitle>
          </div>
          <SectionSubtitle>
            Um recorte de projetos que combinam narrativa, design, mídia e execução para marcas que precisam ser vistas, lembradas e escolhidas.
          </SectionSubtitle>
        </SectionHeader>

        <WorkGrid
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
        >
          {works.map((work, index) => (
            <WorkCard
              key={work.id}
              $accent={work.accent}
              $wide={work.wide}
              variants={cardVariants}
              onClick={() => setSelectedWork(work)}
              whileHover={{ y: -10, scale: 1.01 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <VisualPanel $accent={work.accent} $secondary={work.secondary}>
                <CampaignMockup $wide={work.wide}>
                  <MockupTopline>
                    <MockupType>{work.type}</MockupType>
                    <MockupMark $accent={work.accent} />
                  </MockupTopline>
                  <MockupClient $wide={work.wide}>{work.client}</MockupClient>
                  <MockupFooter>
                    <MockupIndex>{String(index + 1).padStart(2, '0')}</MockupIndex>
                    <MockupMetric>{work.metric}</MockupMetric>
                  </MockupFooter>
                </CampaignMockup>
              </VisualPanel>

              <WorkContent $wide={work.wide}>
                <WorkAgency>{work.agency}</WorkAgency>
                <WorkTitle $wide={work.wide}>{work.title}</WorkTitle>
                <WorkDescription>{work.description}</WorkDescription>
                <WorkTags>
                  {work.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </WorkTags>
                <WorkAction>
                  <ActionIcon>
                    <ArrowIcon />
                  </ActionIcon>
                  <ActionText>Ver projeto</ActionText>
                </WorkAction>
              </WorkContent>
            </WorkCard>
          ))}
        </WorkGrid>

        <InsightPanel
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, amount: 0.4 }}
        >
          <InsightCopy>
            <InsightTitle>Do briefing ao conteúdo publicado, cada projeto nasce como sistema.</InsightTitle>
            <InsightText>
              A entrega combina conceito criativo, produção, canais e leitura de performance para manter consistência entre campanha, social, imprensa e presença de marca.
            </InsightText>
          </InsightCopy>
          <InsightStats>
            <Stat>
              <StatValue>06</StatValue>
              <StatLabel>Frentes de atuação</StatLabel>
            </Stat>
            <Stat>
              <StatValue>01</StatValue>
              <StatLabel>Direção integrada</StatLabel>
            </Stat>
          </InsightStats>
        </InsightPanel>

        <SeeMoreButton
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.04 }}
        >
          Ver mais trabalhos
          <ButtonIcon>
            <ArrowIcon />
          </ButtonIcon>
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
            <ModalContent
              initial={{ opacity: 0, y: 34, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.28 }}
              onClick={(event) => event.stopPropagation()}
            >
              <CloseButton onClick={() => setSelectedWork(null)} aria-label="Fechar projeto">X</CloseButton>
              <ModalHero $accent={selectedWork.accent} $secondary={selectedWork.secondary}>
                <MockupType>{selectedWork.type}</MockupType>
                <ModalClient>{selectedWork.client}</ModalClient>
              </ModalHero>
              <ModalBody>
                <ModalTitle>{selectedWork.title}</ModalTitle>
                <ModalDescription>{selectedWork.description}</ModalDescription>
                <ModalMeta>
                  <MetaItem>
                    <MetaLabel>Cliente</MetaLabel>
                    <MetaValue>{selectedWork.client}</MetaValue>
                  </MetaItem>
                  <MetaItem>
                    <MetaLabel>Agência</MetaLabel>
                    <MetaValue>{selectedWork.agency}</MetaValue>
                  </MetaItem>
                </ModalMeta>
                <MetaLabel>Serviços prestados</MetaLabel>
                <ServiceList>
                  {selectedWork.services.map((service) => (
                    <ServiceItem key={service}>{service}</ServiceItem>
                  ))}
                </ServiceList>
              </ModalBody>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </CreativeWorkSection>
  );
};

export default CreativeWork;
