import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Page = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at 18% 18%, rgba(226, 61, 50, 0.16), transparent 30%),
    radial-gradient(circle at 82% 78%, rgba(66, 188, 255, 0.14), transparent 30%),
    #111315;
  color: #fff;
  padding: 24px;
`;

const Panel = styled.section`
  width: min(460px, 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  padding: 28px;
  text-align: center;
`;

const Mark = styled.div`
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  margin: 0 auto 18px;
  border: 2px solid #fff;
  border-radius: 8px;
  font-size: 1.5rem;
  font-weight: 900;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 10px;
`;

const Copy = styled.p`
  color: rgba(255, 255, 255, 0.68);
  margin-bottom: 22px;
`;

const Button = styled.button`
  width: 100%;
  border-radius: 8px;
  background: #fff;
  color: #111315;
  font-weight: 800;
  padding: 13px 16px;

  &:hover {
    background: #e23d32;
    color: #fff;
  }
`;

const SessionExpiredPage = () => {
  const navigate = useNavigate();

  return (
    <Page>
      <Panel>
        <Mark>+</Mark>
        <Title>Sessao expirada</Title>
        <Copy>Por seguranca, o acesso ao painel foi encerrado. Entre novamente para continuar.</Copy>
        <Button type="button" onClick={() => navigate('/login', { replace: true })}>
          Fazer login novamente
        </Button>
      </Panel>
    </Page>
  );
};

export default SessionExpiredPage;
