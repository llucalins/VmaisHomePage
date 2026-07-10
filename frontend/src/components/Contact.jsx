import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { submitContactMessage } from '../services/api';

const ContactSection = styled.section`
  padding: 120px 0;
  background: #000;
  color: #fff;
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

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
        message: ''
      });
    } catch (error) {
      setSubmitError(error.message || 'Nao foi possivel enviar sua mensagem. Tente novamente em instantes.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ContactSection>
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
