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
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(24px, 5vw, 70px);
  width: 100vw;
  margin: 90px 0 -120px calc(50% - 50vw);
  padding: clamp(52px, 7vw, 82px) max(24px, calc((100vw - 1200px) / 2 + 20px));
  background: #0f0f0f;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  border-bottom: 6px solid #e11d2e;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
  overflow: hidden;

  &::before,
  &::after {
    content: '+';
    position: absolute;
    color: rgba(225, 29, 46, 0.12);
    font-size: clamp(7rem, 16vw, 14rem);
    font-weight: 900;
    line-height: 1;
    pointer-events: none;
  }

  &::before {
    top: -42px;
    left: clamp(18px, 6vw, 90px);
  }

  &::after {
    right: clamp(18px, 6vw, 90px);
    bottom: -62px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 34px;
    margin-top: 70px;
    padding-top: 52px;
    padding-bottom: 58px;
  }
`;

const StatItem = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  
  .number {
    display: inline-flex;
    align-items: flex-start;
    justify-content: center;
    gap: 10px;
    color: #fff;
    margin-bottom: 14px;
    line-height: 0.9;
  }

  .value {
    font-size: clamp(3.4rem, 6vw, 5.6rem);
    font-weight: 800;
    letter-spacing: 0;
  }

  .plus {
    color: #e11d2e;
    font-size: clamp(3.5rem, 5.8vw, 6.2rem);
    font-weight: 900;
    line-height: 0.72;
    text-shadow: 0 0 28px rgba(225, 29, 46, 0.52);
    transform: translateY(0.04em);
  }
  
  .label {
    font-size: clamp(0.8rem, 1.1vw, 0.95rem);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.8px;
    color: rgba(255, 255, 255, 0.72);
  }

  &.background-plus {
    position: absolute;
    z-index: 0;
    color: rgba(225, 29, 46, 0.09);
    font-size: clamp(3.6rem, 8vw, 8.5rem);
    font-weight: 900;
    line-height: 1;
    pointer-events: none;
    user-select: none;
  }

  &.background-plus.one {
    top: 28px;
    left: 24%;
  }

  &.background-plus.two {
    top: 34px;
    right: 27%;
    font-size: clamp(2.9rem, 6vw, 6.4rem);
  }

  &.background-plus.three {
    left: 43%;
    bottom: 16px;
    color: rgba(225, 29, 46, 0.12);
  }

  &.background-plus.four {
    left: 10%;
    bottom: 24px;
    font-size: clamp(2.8rem, 5vw, 5.6rem);
  }

  &.background-plus.five {
    right: 12%;
    bottom: 26px;
    font-size: clamp(3rem, 5.5vw, 6rem);
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
            <StatItem as="span" className="background-plus one" aria-hidden="true">+</StatItem>
            <StatItem as="span" className="background-plus two" aria-hidden="true">+</StatItem>
            <StatItem as="span" className="background-plus three" aria-hidden="true">+</StatItem>
            <StatItem as="span" className="background-plus four" aria-hidden="true">+</StatItem>
            <StatItem as="span" className="background-plus five" aria-hidden="true">+</StatItem>
            <StatItem>
              <div className="number"><span className="value">100</span><span className="plus">+</span></div>
              <div className="label">Projetos Realizados</div>
            </StatItem>
            <StatItem>
              <div className="number"><span className="value">50</span><span className="plus">+</span></div>
              <div className="label">Clientes Satisfeitos</div>
            </StatItem>
            <StatItem>
              <div className="number"><span className="value">5</span><span className="plus">+</span></div>
              <div className="label">Anos de Experiência</div>
            </StatItem>
          </StatsContainer>
        </motion.div>
      </Container>
    </AboutSection>
  );
};

export default AboutUs;
