import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { login, authStorage } from '../services/api';

const Page = styled.main`
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(380px, 500px);
  background: #111;
  color: #fff;

  @media (max-width: 880px) {
    grid-template-columns: 1fr;
  }
`;

const BrandPanel = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  overflow: hidden;
  padding: 48px;
  background: #101317;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
    background-size: 88px 88px;
    mask-image: radial-gradient(circle at 45% 50%, #000 0%, transparent 72%);
    opacity: 0.8;
  }

  @media (max-width: 880px) {
    min-height: 420px;
    padding: 32px 24px;
  }
`;

const BackHomeButton = styled.button`
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  width: 44px;
  height: 44px;
  justify-content: center;
  border: 2px solid #fff;
  border-radius: 8px;
  background: transparent;
  color: #fff;
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;

  &::before {
    content: '';
    width: 13px;
    height: 13px;
    border-left: 3px solid currentColor;
    border-bottom: 3px solid currentColor;
    transform: rotate(45deg) translate(2px, -2px);
  }

  &:hover,
  &:focus-visible {
    border-color: #e23d32;
    color: #e23d32;
    transform: translateX(-2px);
  }

  &:focus-visible {
    outline: 3px solid rgba(226, 61, 50, 0.28);
    outline-offset: 3px;
  }
`;

const MotionStage = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  min-height: 520px;
`;

const LogoOrbit = styled.div`
  position: relative;
  width: min(560px, 78vw);
  aspect-ratio: 1;

  &::before,
  &::after {
    content: '';
    position: absolute;
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 50%;
    inset: 10%;
    animation: spin 18s linear infinite;
  }

  &::after {
    inset: 22%;
    border-color: rgba(226, 61, 50, 0.38);
    animation-duration: 12s;
    animation-direction: reverse;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const MainLogo = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  strong {
    font-size: clamp(4rem, 10vw, 8.8rem);
    line-height: 0.82;
    letter-spacing: 0;
    text-transform: uppercase;
  }

  span {
    margin-top: 16px;
    color: #e23d32;
    font-size: clamp(1.2rem, 3vw, 2.4rem);
    font-weight: 900;
  }
`;

const FloatingNote = styled.div`
  position: absolute;
  min-width: 146px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  padding: 12px;
  animation: float 5s ease-in-out infinite;

  strong {
    display: block;
    font-size: 0.8rem;
    text-transform: uppercase;
  }

  span {
    color: rgba(255, 255, 255, 0.72);
    font-size: 0.78rem;
  }

  &:nth-child(2) {
    top: 16%;
    left: 2%;
  }

  &:nth-child(3) {
    right: 3%;
    top: 28%;
    animation-delay: 0.8s;
  }

  &:nth-child(4) {
    bottom: 14%;
    left: 12%;
    animation-delay: 1.4s;
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(-14px);
    }
  }
`;

const BrandCopy = styled.div`
  position: relative;
  z-index: 2;
  max-width: 620px;

  h1 {
    font-size: clamp(2.6rem, 6vw, 5.4rem);
    line-height: 0.98;
    margin-bottom: 18px;
    text-transform: uppercase;
  }

  p {
    color: rgba(255, 255, 255, 0.76);
    font-size: 1.05rem;
    max-width: 540px;
  }
`;

const FormPanel = styled.section`
  display: flex;
  align-items: center;
  padding: 40px;
  background: #fff;
  color: #111;
`;

const Form = styled.form`
  width: 100%;

  h2 {
    font-size: 2rem;
    margin-bottom: 8px;
  }

  > p {
    color: #666;
    margin-bottom: 32px;
  }
`;

const Field = styled.label`
  display: block;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin-bottom: 18px;
  text-transform: uppercase;

  input {
    display: block;
    width: 100%;
    margin-top: 8px;
    border: 1px solid #d7dbe2;
    border-radius: 6px;
    padding: 14px;
    font-size: 1rem;
  }
`;

const Button = styled.button`
  width: 100%;
  border-radius: 6px;
  background: #111;
  color: #fff;
  font-weight: 700;
  padding: 15px;
  transition: background 0.2s ease;

  &:hover {
    background: #e23d32;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;

const ErrorMessage = styled.div`
  border: 1px solid #f0b4ae;
  border-radius: 6px;
  background: #fff4f2;
  color: #9c261b;
  padding: 12px 14px;
  margin-bottom: 18px;
  font-size: 0.92rem;
`;

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const session = await login(email, password);
      authStorage.setSession(session);
      navigate('/admin');
    } catch (err) {
      setError('Nao foi possivel entrar com essas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <BrandPanel>
        <BackHomeButton
          aria-label="Voltar para a pagina inicial"
          onClick={() => navigate('/')}
          type="button"
        />
        <MotionStage>
          <LogoOrbit>
            <MainLogo>
              <strong>Vmais</strong>
              <span>+</span>
            </MainLogo>
            <FloatingNote>
              <strong>Foto</strong>
              <span>cobertura 09:00</span>
            </FloatingNote>
            <FloatingNote>
              <strong>Video</strong>
              <span>evento externo</span>
            </FloatingNote>
            <FloatingNote>
              <strong>Stories</strong>
              <span>publicacao ao vivo</span>
            </FloatingNote>
          </LogoOrbit>
        </MotionStage>
        <BrandCopy>
          <h1>Agenda de pautas</h1>
          <p>Planejamento de cobertura, equipe em campo e lembretes operacionais em um so lugar.</p>
        </BrandCopy>
      </BrandPanel>
      <FormPanel>
        <Form onSubmit={handleSubmit}>
          <h2>Login admin</h2>
          <p>Acesso restrito aos donos e administradores da operacao.</p>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Field>
            Email
            <input
              autoComplete="email"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </Field>
          <Field>
            Senha
            <input
              autoComplete="current-password"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </Field>
          <Button disabled={loading} type="submit">
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </Form>
      </FormPanel>
    </Page>
  );
};

export default LoginPage;
