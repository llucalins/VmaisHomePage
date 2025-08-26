import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const AboutSection = styled.section`
  padding: 120px 0;
  background: #fff;
  position: relative;
  overflow: hidden;
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #f8f8f8 25%, transparent 25%), 
              linear-gradient(-45deg, #f8f8f8 25%, transparent 25%), 
              linear-gradient(45deg, transparent 75%, #f8f8f8 75%), 
              linear-gradient(-45deg, transparent 75%, #f8f8f8 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  opacity: 0.3;
  z-index: 1;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 2;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const TextContent = styled(motion.div)`
  h2 {
    font-size: 3rem;
    font-weight: 300;
    margin-bottom: 40px;
    text-transform: uppercase;
    letter-spacing: -1px;
    color: #000;
  }

  p {
    font-size: 1.1rem;
    line-height: 1.8;
    margin-bottom: 25px;
    color: #333;
    text-align: justify;
  }

  .highlight {
    font-weight: 600;
    color: #000;
  }

  .signature {
    font-size: 1.2rem;
    font-weight: 500;
    color: #000;
    margin-top: 30px;
    text-align: center;
    font-style: italic;
  }
`;

const VisualContent = styled(motion.div)`
  position: relative;
  height: 500px;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border-radius: 15px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.05) 50%, transparent 70%);
    animation: shine 3s infinite;
  }

  @keyframes shine {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const TeamImage = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  text-align: center;
  z-index: 2;
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
`;

const LogoMain = styled.div`
  font-size: 3.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: -2px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LetterV = styled.span`
  font-size: 4rem;
  margin-right: 4px;
`;

const LetterA = styled.span`
  position: relative;
  display: inline-block;
  
  &::after {
    content: '+';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.2rem;
    font-weight: 900;
    color: #fff;
    opacity: 0.8;
  }
`;

const LogoSubtitle = styled.div`
  font-size: 1rem;
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: 3px;
  opacity: 0.8;
`;

const QuoteContainer = styled.div`
  max-width: 450px;
  margin: 0 auto;
  padding: 25px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const Quote = styled.div`
  font-size: 1.2rem;
  font-weight: 400;
  line-height: 1.6;
  margin-bottom: 15px;
  font-style: italic;
`;

const Author = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.8;
`;

const DecorativeElements = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 3;
`;

const Icon = styled.div`
  width: 20px;
  height: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
`;

const PurpleAccent = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 1.2rem;
  z-index: 3;
`;

const BorderFrame = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  pointer-events: none;
  z-index: 1;
`;

const StatsContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 60px;
  padding-top: 60px;
  border-top: 1px solid #eee;
`;

const StatItem = styled.div`
  text-align: center;
  
  .number {
    font-size: 2.5rem;
    font-weight: 700;
    color: #000;
    margin-bottom: 10px;
  }
  
  .label {
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #666;
  }
`;

const AboutUs = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const visualVariants = {
    hidden: { opacity: 0, scale: 0.8, rotateY: -15 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 1.2,
        ease: "easeOut"
      }
    }
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    }
  };

  return (
    <AboutSection>
      <BackgroundPattern />
      <Container>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <ContentGrid>
            <TextContent variants={itemVariants}>
              <h2>Quem Somos</h2>
              <p>
                A <span className="highlight">Vmais Comunicação</span> nasceu para transformar ideias em resultados. Somos uma agência de publicidade e produtora de vídeo com atuação regional e visão de expansão, especializada em criar estratégias criativas que aproximam marcas do seu público.
              </p>
              <p>
                Unimos clareza, agilidade e profissionalismo para entregar soluções completas em marketing, gestão de redes sociais, produção audiovisual, design e comunicação institucional. Nosso diferencial está na produção interna de conteúdos e na presença do fundador, <span className="highlight">Valdy Lins</span>, como rosto da marca, fortalecendo a confiança e a proximidade com cada cliente.
              </p>
              <p>
                Acreditamos que cada projeto é único e merece ser tratado com dedicação e estratégia. Por isso, trabalhamos lado a lado com pequenos e médios empresários, instituições públicas e influenciadores locais, ajudando-os a se destacar em um mercado cada vez mais competitivo.
              </p>
              <div className="signature">
                "Na Vmais, comunicação é mais que serviço: é parceria, é criatividade, é resultado."
              </div>
            </TextContent>

            <VisualContent variants={visualVariants}>
              <BorderFrame />
              <PurpleAccent>✓+</PurpleAccent>
              
              <DecorativeElements>
                <Icon>♥</Icon>
                <Icon>□</Icon>
                <Icon>👤</Icon>
                <Icon>🔖</Icon>
              </DecorativeElements>

              <TeamImage>
                <div>
                  <motion.div
                    variants={logoVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <LogoContainer>
                      <LogoMain>
                        <LetterV>V</LetterV>
                        <LetterA>m</LetterA>
                        <LetterA>a</LetterA>
                        <LetterA>i</LetterA>
                        <LetterA>s</LetterA>
                      </LogoMain>
                      <LogoSubtitle>Comunicação</LogoSubtitle>
                    </LogoContainer>
                  </motion.div>
                  
                  <QuoteContainer>
                    <Quote>
                      "Marketing não é mais sobre o que você faz, mas sobre a história que você conta."
                    </Quote>
                    <Author>Equipe Vmais Comunicação</Author>
                  </QuoteContainer>
                </div>
              </TeamImage>
            </VisualContent>
          </ContentGrid>

          <StatsContainer variants={itemVariants}>
            <StatItem>
              <div className="number">100+</div>
              <div className="label">Projetos Realizados</div>
            </StatItem>
            <StatItem>
              <div className="number">50+</div>
              <div className="label">Clientes Satisfeitos</div>
            </StatItem>
            <StatItem>
              <div className="number">5+</div>
              <div className="label">Anos de Experiência</div>
            </StatItem>
          </StatsContainer>
        </motion.div>
      </Container>
    </AboutSection>
  );
};

export default AboutUs;
