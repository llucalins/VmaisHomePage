import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ServicesSection = styled.section`
  padding: 120px 0;
  background: #fff;
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

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-top: 60px;
`;

const ServiceCard = styled(motion.div)`
  background: #f8f8f8;
  padding: 40px;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    background: #000;
    color: #fff;
    transform: translateY(-10px);
  }

  &:hover::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1);
  }
`;

const ServiceIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 20px;
  opacity: 0.7;
`;

const ServiceTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ServiceDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  opacity: 0.8;
`;

const Services = () => {
  const services = [
    {
      icon: "💼",
      title: "Consultoria de Negócios",
      description: "Transformação digital e estratégia de negócios para impulsionar o crescimento da sua empresa."
    },
    {
      icon: "🎨",
      title: "Consultoria de Marca",
      description: "Desenvolvimento de identidade visual e posicionamento estratégico para sua marca."
    },
    {
      icon: "✨",
      title: "Criatividade",
      description: "Campanhas criativas inovadoras que conectam sua marca com o público de forma autêntica."
    },
    {
      icon: "📺",
      title: "Mídia",
      description: "Planejamento e compra de mídia estratégica para maximizar o retorno sobre investimento."
    },
    {
      icon: "💚",
      title: "Saúde & Bem-estar",
      description: "Comunicação especializada para o setor de saúde e bem-estar."
    },
    {
      icon: "👥",
      title: "Experiência do Cliente",
      description: "Design de jornadas do cliente que criam conexões emocionais duradouras."
    },
    {
      icon: "📢",
      title: "RP & Comunicação",
      description: "Relações públicas e comunicação corporativa para fortalecer a reputação da sua marca."
    },
    {
      icon: "🤝",
      title: "Parcerias & Eventos",
      description: "Estratégias de parceria e eventos que geram engajamento e visibilidade."
    },
    {
      icon: "🎬",
      title: "Produção de Conteúdo",
      description: "Produção de conteúdo em escala para todas as suas necessidades de comunicação."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <ServicesSection>
      <Container>
        <SectionHeader
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <SectionTitle>Nossos Serviços</SectionTitle>
          <SectionSubtitle>
            Oferecemos soluções completas de comunicação para transformar sua marca e impulsionar seus resultados
          </SectionSubtitle>
        </SectionHeader>

        <ServicesGrid
          as={motion.div}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <ServiceIcon>{service.icon}</ServiceIcon>
              <ServiceTitle>{service.title}</ServiceTitle>
              <ServiceDescription>{service.description}</ServiceDescription>
            </ServiceCard>
          ))}
        </ServicesGrid>
      </Container>
    </ServicesSection>
  );
};

export default Services;
