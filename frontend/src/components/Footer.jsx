import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background: #0f0f0f;
  color: #fff;
  padding: 54px 0 28px;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(260px, 0.8fr);
  gap: 48px;
  align-items: start;
  padding-bottom: 38px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 28px;
  }
`;

const BrandBlock = styled.div`
  max-width: 460px;
`;

const BrandName = styled.h2`
  margin-bottom: 14px;
  font-size: clamp(1.45rem, 3vw, 2rem);
  font-weight: 700;
  letter-spacing: 0;
`;

const Description = styled.p`
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.7;
  font-size: 0.95rem;
`;

const ContactBlock = styled.address`
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-style: normal;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.92rem;

  strong {
    margin-bottom: 4px;
    color: #fff;
    font-size: 0.78rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  a {
    width: fit-content;
    color: rgba(255, 255, 255, 0.78);
    text-decoration: none;
    transition: color 0.2s ease;
  }

  a:hover,
  a:focus-visible {
    color: #fff;
  }
`;

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Copyright = styled.p`
  color: rgba(255, 255, 255, 0.52);
  font-size: 0.84rem;
`;

const AdminAccess = styled(Link)`
  color: rgba(255, 255, 255, 0.46);
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-decoration: none;
  text-transform: uppercase;
  transition: color 0.2s ease;

  &:hover,
  &:focus-visible {
    color: #fff;
  }
`;

const Footer = () => (
  <FooterContainer>
    <Container>
      <FooterContent>
        <BrandBlock>
          <BrandName>Vmais Comunicação</BrandName>
          <Description>
            Comunicação, criatividade e estratégia para marcas que precisam se conectar melhor com o público.
          </Description>
        </BrandBlock>

        <ContactBlock>
          <strong>Contato</strong>
          <a href="mailto:agenciavmaiscomunicacao@gmail.com">agenciavmaiscomunicacao@gmail.com</a>
          <span>Esperança, PB - Brasil</span>
        </ContactBlock>
      </FooterContent>

      <FooterBottom>
        <Copyright>
          © {new Date().getFullYear()} Vmais Comunicação. Todos os direitos reservados.
        </Copyright>
        <AdminAccess to="/login">Área administrativa</AdminAccess>
      </FooterBottom>
    </Container>
  </FooterContainer>
);

export default Footer;
