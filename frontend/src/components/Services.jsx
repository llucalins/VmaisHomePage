import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ServicesSection = styled.section`
  padding: 120px 0;
  background:
    linear-gradient(180deg, #ffffff 0%, #f6f7f7 100%);
  position: relative;
  overflow: hidden;
  scroll-margin-top: 90px;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 2;
`;

const SectionHeader = styled(motion.div)`
  max-width: 760px;
  margin-bottom: 72px;
`;

const SectionEyebrow = styled.span`
  display: inline-block;
  color: #565656;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0;
  margin-bottom: 18px;
  text-transform: uppercase;
`;

const SectionTitle = styled.h2`
  font-size: 4.4rem;
  font-weight: 300;
  line-height: 1;
  margin-bottom: 24px;
  text-transform: uppercase;
  letter-spacing: 0;

  @media (max-width: 980px) {
    font-size: 3.4rem;
  }

  @media (max-width: 640px) {
    font-size: 2.45rem;
  }
`;

const SectionSubtitle = styled.p`
  color: #424242;
  font-size: 1.12rem;
  line-height: 1.75;
  max-width: 640px;
`;

const ServicesGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const ServiceCard = styled(motion.article)`
  --card-bg: ${({ $featured }) => ($featured ? '#050505' : '#ffffff')};
  --card-fg: ${({ $featured }) => ($featured ? '#ffffff' : '#090909')};
  --card-muted: ${({ $featured }) => ($featured ? 'rgba(255, 255, 255, 0.7)' : '#555555')};

  min-height: ${({ $featured }) => ($featured ? '404px' : '352px')};
  padding: 28px;
  background: var(--card-bg);
  border: 1px solid ${({ $featured }) => ($featured ? '#050505' : '#e5e5e5')};
  border-radius: 8px;
  color: var(--card-fg);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  isolation: isolate;
  overflow: hidden;
  position: relative;
  transition: border-color 0.35s ease, box-shadow 0.35s ease, color 0.35s ease, background 0.35s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(135deg, ${({ $accent }) => $accent} 0%, transparent 38%),
      radial-gradient(circle at 85% 16%, ${({ $accent }) => $accent} 0%, transparent 30%);
    opacity: ${({ $featured }) => ($featured ? 0.32 : 0.08)};
    transform: scale(1.08);
    transition: opacity 0.35s ease, transform 0.35s ease;
    z-index: -2;
  }

  &::after {
    color: ${({ $featured }) => ($featured ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.035)')};
    content: attr(data-index);
    font-size: 9rem;
    font-weight: 800;
    line-height: 0.8;
    position: absolute;
    right: -10px;
    top: 18px;
    z-index: -1;
  }

  &:hover {
    background: #050505;
    border-color: ${({ $accent }) => $accent};
    color: #ffffff;
    box-shadow: 0 28px 60px rgba(0, 0, 0, 0.18);
  }

  &:hover::before {
    opacity: 0.36;
    transform: scale(1);
  }

  @media (max-width: 640px) {
    min-height: 320px;
    padding: 24px;

    &::after {
      font-size: 6.75rem;
    }
  }
`;

const CardTop = styled.div`
  align-items: flex-start;
  display: flex;
  justify-content: space-between;
  margin-bottom: auto;
  position: relative;
  z-index: 1;
`;

const ServiceMeta = styled.span`
  color: currentColor;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0;
  opacity: 0.58;
  text-transform: uppercase;
`;

const IconFrame = styled(motion.div)`
  align-items: center;
  background: ${({ $featured, $accent }) => ($featured ? 'rgba(255, 255, 255, 0.08)' : `${$accent}18`)};
  border: 1px solid ${({ $featured, $accent }) => ($featured ? 'rgba(255, 255, 255, 0.14)' : `${$accent}55`)};
  border-radius: 999px;
  color: ${({ $featured, $accent }) => ($featured ? '#ffffff' : $accent)};
  display: flex;
  height: 68px;
  justify-content: center;
  transition: background 0.35s ease, border-color 0.35s ease, color 0.35s ease, transform 0.35s ease;
  width: 68px;

  ${ServiceCard}:hover & {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.26);
    color: #ffffff;
    transform: rotate(-6deg) scale(1.04);
  }
`;

const IconSvg = styled.svg`
  display: block;
  height: 34px;
  overflow: visible;
  width: 34px;
`;

const CardContent = styled.div`
  margin-top: 72px;
  position: relative;
  z-index: 1;

  @media (max-width: 640px) {
    margin-top: 54px;
  }
`;

const ServiceTitle = styled.h3`
  font-size: 1.68rem;
  font-weight: 700;
  line-height: 1.28;
  margin-bottom: 18px;
  max-width: 310px;
  text-transform: uppercase;
  letter-spacing: 0;

  @media (max-width: 640px) {
    font-size: 1.42rem;
  }
`;

const ServiceDescription = styled.p`
  color: var(--card-muted);
  font-size: 0.98rem;
  line-height: 1.68;
  max-width: 320px;
  transition: color 0.35s ease;

  ${ServiceCard}:hover & {
    color: rgba(255, 255, 255, 0.76);
  }
`;

const ServiceSignal = styled.div`
  align-items: center;
  color: currentColor;
  display: flex;
  gap: 10px;
  margin-top: 28px;
  opacity: 0.72;
`;

const SignalLine = styled.span`
  background: ${({ $accent }) => $accent};
  display: block;
  height: 2px;
  transition: width 0.35s ease;
  width: 34px;

  ${ServiceCard}:hover & {
    width: 58px;
  }
`;

const SignalText = styled.span`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
`;

const Icon = ({ name }) => {
  const sharedProps = {
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 1.8,
    viewBox: '0 0 48 48',
    'aria-hidden': true
  };

  switch (name) {
    case 'business':
      return (
        <IconSvg {...sharedProps}>
          <path d="M8 36h32" />
          <path d="M12 32V18h8v14" />
          <path d="M20 32V12h8v20" />
          <path d="M28 32V22h8v10" />
          <path d="M10 12h6" />
          <path d="M32 12l6-6 2 8-8-2z" />
        </IconSvg>
      );
    case 'brand':
      return (
        <IconSvg {...sharedProps}>
          <circle cx="24" cy="24" r="15" />
          <circle cx="24" cy="24" r="7" />
          <path d="M24 9V5" />
          <path d="M24 43v-4" />
          <path d="M9 24H5" />
          <path d="M43 24h-4" />
        </IconSvg>
      );
    case 'creative':
      return (
        <IconSvg {...sharedProps}>
          <path d="M24 6l3.4 10.6L38 20l-10.6 3.4L24 34l-3.4-10.6L10 20l10.6-3.4L24 6z" />
          <path d="M10 34l1.6 4.4L16 40l-4.4 1.6L10 46l-1.6-4.4L4 40l4.4-1.6L10 34z" />
          <path d="M38 4l1.5 4.5L44 10l-4.5 1.5L38 16l-1.5-4.5L32 10l4.5-1.5L38 4z" />
        </IconSvg>
      );
    case 'media':
      return (
        <IconSvg {...sharedProps}>
          <rect x="7" y="13" width="34" height="22" rx="3" />
          <path d="M16 41h16" />
          <path d="M24 35v6" />
          <path d="M19 22l10 6-10 6V22z" />
        </IconSvg>
      );
    case 'health':
      return (
        <IconSvg {...sharedProps}>
          <path d="M24 40s-15-8.8-15-21a8.5 8.5 0 0 1 15-5.5A8.5 8.5 0 0 1 39 19c0 12.2-15 21-15 21z" />
          <path d="M15 25h6l3-6 4 10 3-4h4" />
        </IconSvg>
      );
    case 'experience':
      return (
        <IconSvg {...sharedProps}>
          <path d="M17 25a7 7 0 1 1 0-14 7 7 0 0 1 0 14z" />
          <path d="M31 25a7 7 0 1 0 0-14" />
          <path d="M6 40c1.8-7 7.1-11 13-11s11.2 4 13 11" />
          <path d="M32 30c4.6 1.1 8.2 4.6 10 10" />
        </IconSvg>
      );
    case 'pr':
      return (
        <IconSvg {...sharedProps}>
          <path d="M8 27h7l18 8V13l-18 8H8v6z" />
          <path d="M15 27l4 12h6l-5-10" />
          <path d="M38 18c2 1.5 3 3.5 3 6s-1 4.5-3 6" />
        </IconSvg>
      );
    case 'events':
      return (
        <IconSvg {...sharedProps}>
          <rect x="8" y="10" width="32" height="30" rx="4" />
          <path d="M8 19h32" />
          <path d="M16 6v8" />
          <path d="M32 6v8" />
          <path d="M24 25l2.2 4.4 4.8.7-3.5 3.4.8 4.8-4.3-2.3-4.3 2.3.8-4.8-3.5-3.4 4.8-.7L24 25z" />
        </IconSvg>
      );
    case 'content':
      return (
        <IconSvg {...sharedProps}>
          <rect x="8" y="9" width="32" height="30" rx="4" />
          <path d="M16 9v30" />
          <path d="M32 9v30" />
          <path d="M8 18h8" />
          <path d="M32 18h8" />
          <path d="M8 30h8" />
          <path d="M32 30h8" />
          <path d="M22 19l8 5-8 5V19z" />
        </IconSvg>
      );
    default:
      return null;
  }
};

const services = [
  {
    icon: 'business',
    accent: '#E15D44',
    title: 'Consultoria de Negócios',
    description: 'Transformação digital e estratégia de negócios para impulsionar o crescimento da sua empresa.',
    signal: 'Estratégia',
    featured: true
  },
  {
    icon: 'brand',
    accent: '#1FA3A3',
    title: 'Consultoria de Marca',
    description: 'Desenvolvimento de identidade visual e posicionamento estratégico para sua marca.',
    signal: 'Posicionamento'
  },
  {
    icon: 'creative',
    accent: '#C4A03A',
    title: 'Criatividade',
    description: 'Campanhas criativas inovadoras que conectam sua marca com o público de forma autêntica.',
    signal: 'Ideias'
  },
  {
    icon: 'media',
    accent: '#4A7BD0',
    title: 'Mídia',
    description: 'Planejamento e compra de mídia estratégica para maximizar o retorno sobre investimento.',
    signal: 'Performance'
  },
  {
    icon: 'experience',
    accent: '#7E6EDB',
    title: 'Experiência do Cliente',
    description: 'Design de jornadas do cliente que criam conexões emocionais duradouras.',
    signal: 'Jornada',
    featured: true
  },
  {
    icon: 'pr',
    accent: '#D4578E',
    title: 'RP & Comunicação',
    description: 'Relações públicas e comunicação corporativa para fortalecer a reputação da sua marca.',
    signal: 'Reputação'
  },
  {
    icon: 'events',
    accent: '#2F8A63',
    title: 'Parcerias & Eventos',
    description: 'Estratégias de parceria e eventos que geram engajamento e visibilidade.',
    signal: 'Presença'
  },
  {
    icon: 'content',
    accent: '#E28A2E',
    title: 'Produção de Conteúdo',
    description: 'Produção de conteúdo em escala para todas as suas necessidades de comunicação.',
    signal: 'Narrativa'
  }
];

const Services = () => {
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
    <ServicesSection id="services">
      <Container>
        <SectionHeader
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, amount: 0.4 }}
        >
          <SectionEyebrow>O que fazemos</SectionEyebrow>
          <SectionTitle>Serviços que movem marcas</SectionTitle>
          <SectionSubtitle>
            Da estratégia à execução, combinamos inteligência de negócio, criatividade e relacionamento para transformar comunicação em resultado.
          </SectionSubtitle>
        </SectionHeader>

        <ServicesGrid
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
        >
          {services.map((service, index) => (
            <ServiceCard
              key={service.title}
              data-index={String(index + 1).padStart(2, '0')}
              $accent={service.accent}
              $featured={service.featured}
              variants={cardVariants}
              whileHover={{ y: -12, scale: 1.015 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <CardTop>
                <ServiceMeta>{String(index + 1).padStart(2, '0')} / {service.signal}</ServiceMeta>
                <IconFrame $accent={service.accent} $featured={service.featured}>
                  <Icon name={service.icon} />
                </IconFrame>
              </CardTop>

              <CardContent>
                <ServiceTitle>{service.title}</ServiceTitle>
                <ServiceDescription>{service.description}</ServiceDescription>
                <ServiceSignal>
                  <SignalLine $accent={service.accent} />
                  <SignalText>{service.signal}</SignalText>
                </ServiceSignal>
              </CardContent>
            </ServiceCard>
          ))}
        </ServicesGrid>
      </Container>
    </ServicesSection>
  );
};

export default Services;
