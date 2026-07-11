import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Page = styled.main`
  background: #f6f7f7;
  color: #111111;
  min-height: 100vh;
  padding: 96px 20px;
`;

const Container = styled.article`
  margin: 0 auto;
  max-width: 880px;
`;

const BackLink = styled(Link)`
  color: #111111;
  display: inline-block;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0;
  margin-bottom: 42px;
  text-decoration: none;
  text-transform: uppercase;

  &:hover,
  &:focus-visible {
    color: #e11d2e;
  }
`;

const Title = styled.h1`
  font-size: clamp(2.5rem, 7vw, 5rem);
  font-weight: 300;
  letter-spacing: 0;
  line-height: 0.96;
  margin: 0 0 20px;
  text-transform: uppercase;
`;

const UpdatedAt = styled.p`
  color: #5a5a5a;
  font-size: 0.95rem;
  margin: 0 0 54px;
`;

const Section = styled.section`
  border-top: 1px solid #d9d9d9;
  padding: 30px 0;

  h2 {
    font-size: 1.2rem;
    letter-spacing: 0;
    margin: 0 0 14px;
    text-transform: uppercase;
  }

  p,
  li {
    color: #343434;
    font-size: 1rem;
    line-height: 1.75;
  }

  p {
    margin: 0 0 14px;
  }

  ul {
    list-style: disc;
    margin: 0;
    padding-left: 22px;
  }

  a {
    color: #111111;
    font-weight: 700;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`;

const PrivacyPolicyPage = () => (
  <Page>
    <Container>
      <BackLink to="/">Voltar ao site</BackLink>
      <Title>Política de Privacidade</Title>
      <UpdatedAt>Última atualização: 11 de julho de 2026</UpdatedAt>

      <Section>
        <h2>Quem somos</h2>
        <p>
          Esta política descreve como a Vmais Comunicação trata dados pessoais recebidos pelo site, em especial pelo formulário de contato e pelos canais diretos de atendimento.
        </p>
      </Section>

      <Section>
        <h2>Dados coletados</h2>
        <p>Quando você envia uma mensagem pelo formulário, podemos coletar:</p>
        <ul>
          <li>nome;</li>
          <li>email;</li>
          <li>empresa, quando informada;</li>
          <li>serviço de interesse;</li>
          <li>conteúdo da mensagem enviada;</li>
          <li>data e horário do envio.</li>
        </ul>
      </Section>

      <Section>
        <h2>Finalidade</h2>
        <p>
          Usamos esses dados para responder solicitações, entender a necessidade apresentada, elaborar propostas comerciais quando aplicável e manter histórico mínimo de atendimento.
        </p>
      </Section>

      <Section>
        <h2>Base legal</h2>
        <p>
          O tratamento ocorre com base no consentimento fornecido no formulário e em procedimentos preliminares relacionados a eventual contratação de serviços.
        </p>
      </Section>

      <Section>
        <h2>Compartilhamento</h2>
        <p>
          Não vendemos dados pessoais. Os dados podem ser acessados por pessoas autorizadas da equipe Vmais e por fornecedores técnicos necessários para hospedagem, banco de dados, email e operação do site.
        </p>
      </Section>

      <Section>
        <h2>Cookies e analytics</h2>
        <p>
          No momento, este site não utiliza cookies de analytics, pixels de publicidade ou ferramentas de rastreamento comportamental na área pública. A área administrativa usa armazenamento local do navegador apenas para manter a sessão de login dos administradores.
        </p>
        <p>
          Caso ferramentas de analytics sejam adicionadas futuramente, exibiremos um aviso de consentimento antes de ativar cookies não essenciais.
        </p>
      </Section>

      <Section>
        <h2>Retenção e segurança</h2>
        <p>
          Mantemos as mensagens pelo tempo necessário para atendimento, relacionamento comercial, cumprimento de obrigações legais e proteção de direitos. Aplicamos controles de acesso na área administrativa e protegemos senhas com hash.
        </p>
      </Section>

      <Section>
        <h2>Seus direitos</h2>
        <p>
          Você pode solicitar acesso, correção, exclusão, oposição ao tratamento ou revogação do consentimento, conforme aplicável pela LGPD.
        </p>
        <p>
          Para exercer esses direitos, entre em contato pelo email <a href="mailto:agenciavmaiscomunicacao@gmail.com">agenciavmaiscomunicacao@gmail.com</a>.
        </p>
      </Section>
    </Container>
  </Page>
);

export default PrivacyPolicyPage;
