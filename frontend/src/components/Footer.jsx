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

const SocialLinks = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 22px;
`;

const SocialLink = styled.a`
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  color: rgba(255, 255, 255, 0.78);
  display: inline-flex;
  height: 42px;
  justify-content: center;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
  width: 42px;

  svg {
    display: block;
    height: 19px;
    width: 19px;
  }

  &:hover,
  &:focus-visible {
    background: #fff;
    border-color: #fff;
    color: #0f0f0f;
    transform: translateY(-2px);
  }
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

const FooterLinks = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
`;

const FooterLink = styled(Link)`
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

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
    <circle cx="17.5" cy="6.5" r="1.3" fill="currentColor" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M14.15 8.15V6.8c0-.64.43-.79.73-.79h1.86V3.15L14.18 3.14c-2.84 0-3.49 2.13-3.49 3.49v1.52H8.86v2.95h1.83V21h3.46v-9.9h2.33l.31-2.95h-2.64z" />
  </svg>
);

const Footer = () => (
  <FooterContainer>
    <Container>
      <FooterContent>
        <BrandBlock>
          <BrandName>Vmais Comunicação</BrandName>
          <Description>
            Comunicação, criatividade e estratégia para marcas que precisam se conectar melhor com o público.
          </Description>
          <SocialLinks aria-label="Redes sociais">
            <SocialLink
              href="https://www.instagram.com/vmaiscomunicacao/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram da Vmais Comunicação"
            >
              <InstagramIcon />
            </SocialLink>
            <SocialLink
              href="https://www.facebook.com/agenciavmaiscomunicacao"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook da Vmais Comunicação"
            >
              <FacebookIcon />
            </SocialLink>
          </SocialLinks>
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
        <FooterLinks>
          <FooterLink to="/privacidade">Política de privacidade</FooterLink>
          <AdminAccess to="/login">Área administrativa</AdminAccess>
        </FooterLinks>
      </FooterBottom>
    </Container>
  </FooterContainer>
);

export default Footer;
