import { useRef } from 'react';
import './CasesResultados.css';

const cases = [
  {
    categoria: 'Comunicação Pública',
    titulo: 'Esperança que Comunica',
    cliente: 'Prefeitura Municipal de Esperança',
    resumo: 'Campanhas, coberturas e conteúdos estratégicos para divulgar serviços, eventos, ações sociais e prestação de contas.',
    tags: ['Campanhas', 'Eventos', 'Gestão Pública'],
    marca: 'ESP',
    logo: '/Images/logos/ESPERAN%C3%87A%20BRANCO.png',
    destaque: 'Presença pública',
    formato: 'Campanhas integradas'
  },
  {
    categoria: 'Comunicação Pública',
    titulo: 'Montadas em Destaque',
    cliente: 'Prefeitura Municipal de Montadas',
    resumo: 'Comunicação pública para registrar ações da gestão, divulgar serviços e aproximar a prefeitura da população.',
    tags: ['Gestão Pública', 'Institucional', 'Audiovisual'],
    marca: 'MON',
    logo: '/Images/logos/montadas-mask.png',
    destaque: 'Gestão em movimento',
    formato: 'Cobertura + social'
  },
  {
    categoria: 'Comunicação Pública',
    titulo: 'Areia em Movimento',
    cliente: 'Prefeitura Municipal de Areia',
    resumo: 'Comunicação institucional para registrar ações, valorizar entregas públicas e aproximar a gestão da população.',
    tags: ['Gestão Pública', 'Institucional', 'Audiovisual'],
    marca: 'ARE',
    logo: '/Images/logos/areia.png',
    destaque: 'Gestão em pauta',
    formato: 'Cobertura + conteúdo'
  },
  {
    categoria: 'Educação',
    titulo: 'Educação com Presença',
    cliente: 'UNDIME-PB',
    resumo: 'Cobertura e comunicação para encontros, fóruns e ações ligadas à gestão pública da educação na Paraíba.',
    tags: ['Educação', 'Institucional', 'Eventos'],
    marca: 'UND',
    logo: '/Images/logos/undime.png',
    destaque: 'Agenda educacional',
    formato: 'Eventos + registro'
  },
  {
    categoria: 'Comunicação Pública',
    titulo: 'Direito do Consumidor em Evidência',
    cliente: 'PROCON Esperança',
    resumo: 'Comunicação institucional para tornar serviços, orientações e ações de defesa do consumidor mais claros e acessíveis à população.',
    tags: ['Institucional', 'Serviço Público', 'Conteúdo'],
    marca: 'PRO',
    logo: '/Images/logos/procon.png',
    destaque: 'Serviço público',
    formato: 'Institucional + social'
  },
  {
    categoria: 'Eventos',
    titulo: 'Setor Moveleiro em Evidência',
    cliente: 'Salão Móvel Paraíba',
    resumo: 'Produção audiovisual e cobertura estratégica para fortalecer a presença de um dos principais eventos moveleiros da Paraíba.',
    tags: ['Eventos', 'Cobertura', 'Redes Sociais'],
    marca: 'SMP',
    logo: '/Images/logos/salao-movel.png',
    destaque: 'Evento em evidência',
    formato: 'Vídeo + social'
  },
  {
    categoria: 'Turismo',
    titulo: 'Experiências que Viram Conteúdo',
    cliente: 'Fazenda Tanques',
    resumo: 'Conteúdo turístico, cobertura de experiências e fortalecimento da presença digital da marca.',
    tags: ['Turismo', 'Experiência', 'Conteúdo'],
    marca: 'FT',
    logo: '/Images/logos/fazenda.png',
    destaque: 'Destino narrado',
    formato: 'Imagem + experiência'
  },
  {
    categoria: 'Gastronomia',
    titulo: 'Sabor, Imagem e Desejo',
    cliente: 'Panificadora Divina',
    resumo: 'Fotografia, campanhas promocionais e conteúdo gastronômico para fortalecer a marca nas redes sociais.',
    tags: ['Gastronomia', 'Social Media', 'Campanhas'],
    marca: 'PD',
    logo: '/Images/logos/logo-divina2.png',
    destaque: 'Produto com desejo',
    formato: 'Foto + campanha'
  },
  {
    categoria: 'Varejo',
    titulo: 'Ofertas com Presença',
    cliente: 'Super Esperança Supermercados',
    resumo: 'Conteúdo comercial, divulgação de ofertas e campanhas promocionais para o varejo local.',
    tags: ['Varejo', 'Campanhas', 'Redes Sociais'],
    marca: 'SES',
    logo: '/Images/logos/super.png',
    destaque: 'Oferta em destaque',
    formato: 'Varejo + conversão'
  },
  {
    categoria: 'Gastronomia',
    titulo: 'Tradição que Dá Água na Boca',
    cliente: 'Tapiocaria do Irmão Firmino',
    resumo: 'Conteúdo gastronômico para valorizar sabor, rotina de produção e presença local de uma marca querida pelo público.',
    tags: ['Gastronomia', 'Conteúdo', 'Redes Sociais'],
    marca: 'TIF',
    logo: '/Images/logos/Tapiocaria.png',
    logoTreatment: 'image',
    destaque: 'Sabor em cena',
    formato: 'Foto + social'
  }
];

export default function CasesResultados() {
  const filmRef = useRef(null);
  const dragState = useRef({
    isDragging: false,
    startX: 0,
    scrollLeft: 0
  });

  const handleFilmWheel = (event) => {
    const film = filmRef.current;

    if (!film || Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      return;
    }

    const maxScroll = film.scrollWidth - film.clientWidth;
    const isAtStart = film.scrollLeft <= 0;
    const isAtEnd = film.scrollLeft >= maxScroll - 1;
    const isLeavingTrack = (event.deltaY < 0 && isAtStart) || (event.deltaY > 0 && isAtEnd);

    if (isLeavingTrack) {
      return;
    }

    event.preventDefault();
    film.scrollLeft += event.deltaY;
  };

  const handleDragStart = (event) => {
    const film = filmRef.current;

    if (!film || event.button !== 0) {
      return;
    }

    dragState.current = {
      isDragging: true,
      startX: event.pageX - film.offsetLeft,
      scrollLeft: film.scrollLeft
    };
    film.classList.add('is-dragging');
  };

  const handleDragMove = (event) => {
    const film = filmRef.current;

    if (!film || !dragState.current.isDragging) {
      return;
    }

    event.preventDefault();
    const x = event.pageX - film.offsetLeft;
    const distance = x - dragState.current.startX;
    film.scrollLeft = dragState.current.scrollLeft - distance;
  };

  const handleDragEnd = () => {
    const film = filmRef.current;

    dragState.current.isDragging = false;
    film?.classList.remove('is-dragging');
  };

  return (
    <section className="cases-resultados-section" id="portfolio">
      <div className="cases-resultados-container">
        <div className="cases-resultados-header">
          <span>TRABALHOS CRIATIVOS</span>
          <h2>CASES QUE CONTAM HISTÓRIAS REAIS</h2>
          <p>
            Projetos que transformam ações, marcas e eventos em presença, imagem e conexão com o público.
          </p>
        </div>
      </div>

      <div className="cases-film-shell">
        <div className="cases-film-meta" aria-hidden="true">
          <span>VMAIS / PORTFÓLIO</span>
          <span>FRAME 01-{String(cases.length).padStart(2, '0')}</span>
        </div>

        <div
          className="cases-film-strip"
          ref={filmRef}
          onWheel={handleFilmWheel}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          aria-label="Cases em formato de filme fotográfico"
        >
          <div className="cases-film-track">
            {cases.map((item, index) => (
              <article
                className="case-frame"
                data-frame={String(index + 1).padStart(2, '0')}
                key={item.cliente}
                tabIndex="0"
                aria-label={`${item.categoria}: ${item.cliente}, ${item.titulo}`}
                style={item.logo ? { '--logo-image': `url("${item.logo}")` } : undefined}
              >
                <div className="case-frame-perfs" aria-hidden="true" />
                <div className="case-frame-border-label" aria-hidden="true">
                  <span>VMAIS 400TX</span>
                  <strong>{String(index + 1).padStart(2, '0')}</strong>
                </div>

                <div className="case-frame-image">
                  <div className="case-logo-seal">
                    {item.logo && item.logoTreatment === 'image' ? (
                      <img
                        className="case-logo-image"
                        src={item.logo}
                        alt={`Logo de ${item.cliente}`}
                      />
                    ) : item.logo ? (
                      <span
                        className="case-logo-badge"
                        role="img"
                        aria-label={`Logo de ${item.cliente}`}
                      />
                    ) : (
                      <span
                        className="case-logo-fallback"
                        role="img"
                        aria-label={`Iniciais de ${item.cliente}`}
                      >
                        {item.marca}
                      </span>
                    )}
                  </div>

                  <div className="case-frame-caption">
                    <span>{item.categoria}</span>
                    <strong>{item.cliente}</strong>
                    <h3>{item.titulo}</h3>
                    <p>{item.resumo}</p>
                  </div>
                </div>
                <div className="case-frame-perfs" aria-hidden="true" />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
