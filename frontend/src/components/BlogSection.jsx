import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const BLOG_URL = 'https://blog.vmaiscomunicacao.com.br';

const topics = [
  {
    number: '01',
    title: 'Estratégia de marca',
    description: 'Posicionamento, planejamento e decisões que aproximam marcas das pessoas.'
  },
  {
    number: '02',
    title: 'Conteúdo e criatividade',
    description: 'Ideias, referências e práticas para comunicar com clareza e personalidade.'
  },
  {
    number: '03',
    title: 'Comunicação pública',
    description: 'Caminhos para transformar informação em serviço, presença e conexão.'
  }
];

const Section = styled.section`
  background: #f3f1ed;
  color: #111;
  overflow: hidden;
  padding: clamp(88px, 10vw, 140px) 0;
  position: relative;
  scroll-margin-top: 90px;

  &::before {
    color: rgba(17, 17, 17, 0.035);
    content: '+';
    font-size: clamp(22rem, 48vw, 48rem);
    font-weight: 700;
    line-height: 0.7;
    pointer-events: none;
    position: absolute;
    right: -0.08em;
    top: 0.08em;
  }
`;

const Container = styled.div`
  margin: 0 auto;
  max-width: 1200px;
  padding: 0 20px;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  align-items: end;
  display: grid;
  gap: 48px;
  grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.65fr);
  margin-bottom: clamp(54px, 7vw, 84px);

  @media (max-width: 760px) {
    align-items: start;
    gap: 26px;
    grid-template-columns: 1fr;
  }
`;

const Eyebrow = styled.span`
  align-items: center;
  display: flex;
  font-size: 0.76rem;
  font-weight: 700;
  gap: 12px;
  letter-spacing: 0.18em;
  margin-bottom: 22px;
  text-transform: uppercase;

  &::before {
    background: #e23d32;
    content: '';
    height: 8px;
    width: 8px;
  }
`;

const Title = styled.h2`
  font-size: clamp(2.8rem, 6vw, 5.8rem);
  font-weight: 300;
  letter-spacing: -0.055em;
  line-height: 0.96;
  max-width: 850px;
  text-transform: uppercase;

  strong {
    font-weight: 700;
  }
`;

const Intro = styled.p`
  color: #4b4b4b;
  font-size: 1.05rem;
  line-height: 1.75;
  max-width: 390px;
`;

const Topics = styled.div`
  border-bottom: 1px solid rgba(17, 17, 17, 0.18);
  border-top: 1px solid rgba(17, 17, 17, 0.18);
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const Topic = styled(motion.article)`
  min-height: 260px;
  padding: 32px clamp(22px, 3vw, 38px) 36px;
  position: relative;

  & + & {
    border-left: 1px solid rgba(17, 17, 17, 0.18);
  }

  @media (max-width: 760px) {
    min-height: auto;

    & + & {
      border-left: 0;
      border-top: 1px solid rgba(17, 17, 17, 0.18);
    }
  }
`;

const TopicNumber = styled.span`
  color: #e23d32;
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  margin-bottom: 68px;

  @media (max-width: 760px) {
    margin-bottom: 34px;
  }
`;

const TopicTitle = styled.h3`
  font-size: clamp(1.3rem, 2.5vw, 1.75rem);
  font-weight: 600;
  letter-spacing: -0.03em;
  margin-bottom: 13px;
`;

const TopicDescription = styled.p`
  color: #555;
  font-size: 0.95rem;
  line-height: 1.65;
  max-width: 310px;
`;

const Footer = styled.div`
  align-items: center;
  display: flex;
  gap: 28px;
  justify-content: space-between;
  margin-top: 42px;

  @media (max-width: 620px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const Note = styled.p`
  color: #606060;
  font-size: 0.85rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const BlogLink = styled(motion.a)`
  align-items: center;
  background: #111;
  color: #fff;
  display: inline-flex;
  font-size: 0.82rem;
  font-weight: 700;
  gap: 28px;
  justify-content: space-between;
  letter-spacing: 0.12em;
  min-width: 245px;
  padding: 18px 20px 18px 24px;
  text-transform: uppercase;
  transition: background 0.25s ease, color 0.25s ease;

  span {
    font-size: 1.35rem;
    font-weight: 300;
    line-height: 1;
    transition: transform 0.25s ease;
  }

  &:hover,
  &:focus-visible {
    background: #e23d32;
    color: #fff;
  }

  &:hover span,
  &:focus-visible span {
    transform: translateX(4px);
  }

  &:focus-visible {
    outline: 3px solid rgba(226, 61, 50, 0.35);
    outline-offset: 4px;
  }
`;

const BlogSection = () => (
  <Section id="blog">
    <Container>
      <Header>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55 }}
        >
          <Eyebrow>Conteúdo Vmais</Eyebrow>
          <Title>
            Ideias que movem a <strong>comunicação</strong>
          </Title>
        </motion.div>

        <Intro>
          Estratégia, criatividade e experiências para marcas e instituições que querem se comunicar melhor.
        </Intro>
      </Header>

      <Topics>
        {topics.map((topic, index) => (
          <Topic
            key={topic.number}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: index * 0.08, duration: 0.45 }}
          >
            <TopicNumber>{topic.number}</TopicNumber>
            <TopicTitle>{topic.title}</TopicTitle>
            <TopicDescription>{topic.description}</TopicDescription>
          </Topic>
        ))}
      </Topics>

      <Footer>
        <Note>Novos olhares para desafios reais</Note>
        <BlogLink
          href={BLOG_URL}
          aria-label="Acessar o blog da Vmais Comunicação"
          whileTap={{ scale: 0.98 }}
        >
          Acessar o blog
          <span aria-hidden="true">→</span>
        </BlogLink>
      </Footer>
    </Container>
  </Section>
);

export default BlogSection;
