import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const FooterContainer = styled.footer`
  background: #111;
  color: #fff;
  padding: 80px 0 40px;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 60px;
`;

const FooterSection = styled.div`
  h3 {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 20px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  ul {
    list-style: none;
  }

  li {
    margin-bottom: 10px;
  }

  a {
    color: #ccc;
    text-decoration: none;
    transition: color 0.3s ease;
    font-size: 0.9rem;

    &:hover {
      color: #fff;
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
`;

const SocialLink = styled(motion.a)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: #fff;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background: #fff;
    color: #000;
    transform: translateY(-3px);
  }
`;

const BottomFooter = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: #999;
  font-size: 0.9rem;
`;

const LegalLinks = styled.div`
  display: flex;
  gap: 30px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
  }

  a {
    color: #999;
    text-decoration: none;
    font-size: 0.8rem;
    transition: color 0.3s ease;

    &:hover {
      color: #fff;
    }
  }
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 20px;
`;

const Description = styled.p`
  color: #ccc;
  line-height: 1.6;
  margin-bottom: 20px;
  font-size: 0.9rem;
`;

const Footer = () => {
  const footerSections = [
    {
      title: "Vmais Comunicação",
      content: (
        <>
          <Logo>Vmais Comunicação</Logo>
          <Description>
            Transformando marcas através da criatividade e inovação. 
            Fazemos a diferença que sua empresa precisa.
          </Description>
          <SocialLinks>
            <SocialLink 
              href="https://twitter.com/vmaiscomunicacao" 
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </SocialLink>
            <SocialLink 
              href="https://twitter.com/vmaiscomunicacao" 
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
              </svg>
            </SocialLink>
            <SocialLink 
              href="https://pinterest.com/vmaiscomunicacao" 
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
              </svg>
            </SocialLink>
            <SocialLink 
              href="https://linkedin.com/company/vmaiscomunicacao" 
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </SocialLink>
          </SocialLinks>
        </>
      )
    },
         {
       title: "Quem Somos",
       links: [
         { text: "Nossa Missão", href: "/nossa-missao" },
         { text: "Nossa Estratégia", href: "/nossa-estrategia" },
         { text: "Governança", href: "/governanca" },
         { text: "Nossos Escritórios", href: "/nossos-escritorios" },
         { text: "Nossas Carreiras", href: "/nossas-carreiras" }
       ]
     },
     {
       title: "O Que Fazemos",
       links: [
         { text: "Nossos Serviços", href: "/nossos-servicos" },
         { text: "Consultoria de Negócios", href: "/consultoria-negocios" },
         { text: "Consultoria de Marca", href: "/consultoria-marca" },
         { text: "Criatividade", href: "/criatividade" },
         { text: "Mídia", href: "/midia" },
         { text: "Saúde & Bem-estar", href: "/saude-bem-estar" },
         { text: "Experiência do Cliente", href: "/experiencia-cliente" },
         { text: "RP & Comunicação", href: "/rp-comunicacao" },
         { text: "Parcerias & Eventos", href: "/parcerias-eventos" },
         { text: "Produção de Conteúdo", href: "/producao-conteudo" }
       ]
     },
     {
       title: "Recursos",
       links: [
         { text: "Trabalhos Criativos", href: "/trabalhos-criativos" },
         { text: "Vida na Vmais", href: "/vida-vmais" },
         { text: "Sustentabilidade", href: "/sustentabilidade" },
         { text: "Imprensa", href: "/imprensa" },
         { text: "Blog", href: "/blog" },
         { text: "Eventos", href: "/eventos" }
       ]
     }
  ];

  return (
    <FooterContainer>
      <Container>
        <FooterGrid>
          {footerSections.map((section, index) => (
            <FooterSection key={index}>
              <h3>{section.title}</h3>
              {section.content ? (
                section.content
              ) : (
                <ul>
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href={link.href}>{link.text}</a>
                    </li>
                  ))}
                </ul>
              )}
            </FooterSection>
          ))}
        </FooterGrid>

        <BottomFooter>
          <Copyright>
            © 2024 Vmais Comunicação. Todos os direitos reservados.
          </Copyright>
          <LegalLinks>
            <a href="/avisos-legais">Avisos Legais</a>
            <a href="/termos-condicoes">Termos e Condições</a>
            <a href="/politica-privacidade">Política de Privacidade</a>
            <a href="/politica-cookies">Política de Cookies</a>
            <a href="/configuracoes-cookies">Configurações de Cookies</a>
            <a href="/mapa-site">Mapa do Site</a>
            <a href="/acessibilidade">Acessibilidade</a>
          </LegalLinks>
        </BottomFooter>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
