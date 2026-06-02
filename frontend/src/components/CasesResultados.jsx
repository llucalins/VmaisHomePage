import ScrollStack, { ScrollStackItem } from './ScrollStack';
import { useRef } from 'react';
import './CasesResultados.css';

const cases = [
  {
    categoria: 'Comunicação Pública',
    titulo: 'Areia em Movimento',
    cliente: 'Prefeitura Municipal de Areia',
    resumo: 'Comunicação institucional para registrar ações, valorizar entregas públicas e aproximar a gestão da população.',
    tags: 'Gestão Pública | Institucional | Audiovisual'
  },
  {
    categoria: 'Comunicação Pública',
    titulo: 'Esperança que Comunica',
    cliente: 'Prefeitura Municipal de Esperança',
    resumo: 'Campanhas, coberturas e conteúdos estratégicos para divulgar serviços, eventos, ações sociais e prestação de contas.',
    tags: 'Campanhas | Eventos | Gestão Pública'
  },
  {
    categoria: 'Educação',
    titulo: 'Educação com Presença',
    cliente: 'UNDIME-PB',
    resumo: 'Cobertura e comunicação para encontros, fóruns e ações ligadas à gestão pública da educação na Paraíba.',
    tags: 'Educação | Institucional | Eventos'
  },
  {
    categoria: 'Eventos',
    titulo: 'Setor Moveleiro em Evidência',
    cliente: 'Salão Móvel Paraíba',
    resumo: 'Produção audiovisual e cobertura estratégica para fortalecer a presença de um dos principais eventos moveleiros da Paraíba.',
    tags: 'Eventos | Cobertura | Redes Sociais'
  },
  {
    categoria: 'Turismo',
    titulo: 'Experiências que Viram Conteúdo',
    cliente: 'Fazenda Tanques',
    resumo: 'Conteúdo turístico, cobertura de experiências e fortalecimento da presença digital da marca.',
    tags: 'Turismo | Experiência | Conteúdo'
  },
  {
    categoria: 'Gastronomia',
    titulo: 'Sabor, Imagem e Desejo',
    cliente: 'Panificadora Divina',
    resumo: 'Fotografia, campanhas promocionais e conteúdo gastronômico para fortalecer a marca nas redes sociais.',
    tags: 'Gastronomia | Social Media | Campanhas'
  },
  {
    categoria: 'Varejo',
    titulo: 'Ofertas com Presença',
    cliente: 'Super Esperança Supermercados',
    resumo: 'Conteúdo comercial, divulgação de ofertas e campanhas promocionais para o varejo local.',
    tags: 'Varejo | Campanhas | Redes Sociais'
  },
  {
    categoria: 'Varejo e Ofertas',
    titulo: 'Comunicação que Vende',
    cliente: 'Decorama',
    resumo: 'Campanhas comerciais, artes para redes sociais e comunicação promocional para divulgar ofertas, produtos e relacionamento com clientes.',
    tags: 'Varejo | Design | Social Media'
  },
  {
    categoria: 'Comunicação Profissional',
    titulo: 'Autoridade com Clareza',
    cliente: 'AR André Ricardo Advocacia',
    resumo: 'Comunicação institucional e produção de conteúdo para fortalecer autoridade, presença digital e posicionamento profissional.',
    tags: 'Advocacia | Autoridade | Conteúdo'
  }
];

export default function CasesResultados() {
  const sectionRef = useRef(null);

  return (
    <section className="cases-resultados-section" id="portfolio" ref={sectionRef}>
      <div className="cases-resultados-header">
        <span>TRABALHOS CRIATIVOS</span>
        <h2>CASES QUE CONTAM HISTÓRIAS REAIS</h2>
        <p>
          Projetos que transformam ações, marcas e eventos em presença, imagem e conexão com o público.
        </p>
      </div>

      <ScrollStack
        useWindowScroll={false}
        itemDistance={100}
        itemScale={0.03}
        itemStackDistance={30}
        stackPosition="20%"
        scaleEndPosition="10%"
        baseScale={0.85}
        rotationAmount={0}
        blurAmount={0}
      >
        {cases.map((item, index) => (
          <ScrollStackItem key={item.cliente}>
            <div className="vmais-card-content">
              <span>{String(index + 1).padStart(2, '0')} / {item.categoria}</span>
              <h3>{item.titulo}</h3>
              <h4>{item.cliente}</h4>
              <p>{item.resumo}</p>
              <small>Tags: {item.tags}</small>
            </div>
          </ScrollStackItem>
        ))}
      </ScrollStack>
    </section>
  );
}
