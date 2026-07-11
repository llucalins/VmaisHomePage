import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { submitContactMessage } from '../services/api';

const ContactSection = styled.section`
  padding: 120px 0;
  background: #000;
  color: #fff;
  scroll-margin-top: 90px;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const ContactInfo = styled(motion.div)`
  h2 {
    font-size: 3rem;
    font-weight: 300;
    margin-bottom: 30px;
    text-transform: uppercase;
    letter-spacing: -1px;
  }

  p {
    font-size: 1.2rem;
    line-height: 1.8;
    margin-bottom: 40px;
    opacity: 0.9;
  }
`;

const ContactDetails = styled.div`
  margin-top: 40px;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 1.1rem;

  svg {
    margin-right: 15px;
    width: 20px;
    height: 20px;
    opacity: 0.7;
  }

  a {
    color: inherit;
    transition: opacity 0.2s ease;
  }

  a:hover,
  a:focus-visible {
    opacity: 0.72;
  }
`;

const WhatsAppLink = styled.a`
  align-items: center;
  background: rgba(37, 211, 102, 0.12);
  border: 1px solid rgba(37, 211, 102, 0.42);
  border-radius: 999px;
  color: #ffffff;
  display: inline-flex;
  font-size: 0.92rem;
  font-weight: 700;
  gap: 10px;
  line-height: 1;
  margin-top: 8px;
  padding: 13px 18px;
  text-decoration: none;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
  width: fit-content;

  svg {
    height: 20px;
    width: 20px;
  }

  &:hover,
  &:focus-visible {
    background: rgba(37, 211, 102, 0.22);
    border-color: rgba(37, 211, 102, 0.72);
    transform: translateY(-2px);
  }
`;

const ContactForm = styled(motion.form)`
  background: rgba(255, 255, 255, 0.05);
  padding: 50px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 30px;
`;

const ConsentGroup = styled.label`
  align-items: flex-start;
  color: rgba(255, 255, 255, 0.72);
  display: flex;
  font-size: 0.84rem;
  gap: 12px;
  line-height: 1.55;
  margin: -6px 0 28px;

  input {
    accent-color: #ffffff;
    flex: 0 0 auto;
    margin-top: 4px;
  }

  a {
    color: #ffffff;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 10px;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.8;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: #fff;
    background: rgba(255, 255, 255, 0.15);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: #fff;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: #fff;
    background: rgba(255, 255, 255, 0.15);
  }
`;

const SubmitButton = styled(motion.button)`
  background: #fff;
  color: #000;
  border: none;
  padding: 15px 40px;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;

  &:hover {
    background: transparent;
    color: #fff;
    border: 2px solid #fff;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.62;
  }
`;

const SuccessMessage = styled(motion.div)`
  background: rgba(76, 175, 80, 0.2);
  border: 1px solid rgba(76, 175, 80, 0.5);
  color: #4caf50;
  padding: 20px;
  border-radius: 4px;
  margin-top: 20px;
  text-align: center;
`;

const ErrorMessage = styled(motion.div)`
  background: rgba(225, 29, 46, 0.18);
  border: 1px solid rgba(225, 29, 46, 0.48);
  color: #ffb8b8;
  padding: 20px;
  border-radius: 4px;
  margin-top: 20px;
  text-align: center;
`;

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.04 2C6.57 2 2.12 6.35 2.12 11.7c0 1.72.47 3.4 1.35 4.87L2 22l5.58-1.43a10.14 10.14 0 004.46 1.03c5.47 0 9.92-4.35 9.92-9.7S17.51 2 12.04 2zm0 17.95c-1.43 0-2.83-.36-4.06-1.05l-.29-.16-3.31.85.88-3.16-.19-.31a8.05 8.05 0 01-1.3-4.42c0-4.44 3.71-8.05 8.27-8.05s8.27 3.61 8.27 8.05-3.71 8.25-8.27 8.25zm4.54-6.04c-.25-.12-1.47-.71-1.7-.79-.23-.08-.4-.12-.56.12-.17.24-.65.79-.79.95-.15.16-.29.18-.54.06-.25-.12-1.05-.38-2-1.21-.74-.64-1.24-1.43-1.38-1.67-.15-.24-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.24.25-.4.08-.16.04-.3-.02-.43-.06-.12-.56-1.32-.77-1.81-.2-.47-.41-.41-.56-.42h-.48c-.17 0-.43.06-.66.3-.23.24-.87.83-.87 2.03s.89 2.36 1.02 2.52c.12.16 1.75 2.62 4.25 3.67.59.25 1.06.4 1.42.51.6.19 1.14.16 1.57.1.48-.07 1.47-.59 1.68-1.16.21-.57.21-1.05.15-1.16-.06-.1-.23-.16-.48-.28z" />
  </svg>
);

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    message: '',
    privacyAccepted: false
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsSubmitted(false);
    setSubmitError('');

    try {
      await submitContactMessage(formData);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        company: '',
        service: '',
        message: '',
        privacyAccepted: false
      });
    } catch (error) {
      setSubmitError(error.message || 'Nao foi possivel enviar sua mensagem. Tente novamente em instantes.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ContactSection id="contact">
      <Container>
        <ContactGrid>
          <ContactInfo
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>Quer Conectar?</h2>
            <p>
              Você está procurando por serviços de comunicação? 
              Você é um talento querendo se juntar a nós?
            </p>
            <p>
              Envie-nos uma mensagem em <strong>agenciavmaiscomunicacao@gmail.com</strong>. 
              Retornaremos o mais rápido possível.
            </p>

            <ContactDetails>
              <ContactItem>
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Esperança, PB - Brasil
              </ContactItem>
              <ContactItem>
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <a href="mailto:agenciavmaiscomunicacao@gmail.com">agenciavmaiscomunicacao@gmail.com</a>
              </ContactItem>
              <ContactItem>
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <a href="tel:+5583986761617">(83) 98676-1617</a>
              </ContactItem>
              <WhatsAppLink
                href="https://wa.me/5583986761617?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20Vmais%20Comunica%C3%A7%C3%A3o%20e%20gostaria%20de%20conversar."
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Conversar com a Vmais Comunicação pelo WhatsApp"
              >
                <WhatsAppIcon />
                Conversar pelo WhatsApp
              </WhatsAppLink>
            </ContactDetails>
          </ContactInfo>

          <ContactForm
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
          >
            <FormGroup>
              <Label htmlFor="name">Nome</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Seu nome completo"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="company">Empresa</Label>
              <Input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Nome da sua empresa"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="service">Serviço de Interesse</Label>
              <Input
                type="text"
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                placeholder="Ex: Campanha publicitária, Branding, etc."
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="message">Mensagem</Label>
              <TextArea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Conte-nos sobre seu projeto..."
                required
              />
            </FormGroup>

            <ConsentGroup htmlFor="privacyAccepted">
              <input
                id="privacyAccepted"
                name="privacyAccepted"
                type="checkbox"
                checked={formData.privacyAccepted}
                onChange={handleChange}
                required
              />
              <span>
                Li e concordo com a <Link to="/privacidade">Política de Privacidade</Link> e autorizo a Vmais Comunicação a tratar meus dados para responder esta solicitação.
              </span>
            </ConsentGroup>

            <SubmitButton
              disabled={isSubmitting}
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
            </SubmitButton>

            {submitError && (
              <ErrorMessage
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {submitError}
              </ErrorMessage>
            )}

            {isSubmitted && (
              <SuccessMessage
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Mensagem enviada com sucesso! Entraremos em contato em breve.
              </SuccessMessage>
            )}
          </ContactForm>
        </ContactGrid>
      </Container>
    </ContactSection>
  );
};

export default Contact;
