import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { apiRequest, authStorage } from '../services/api';

const roleLabels = {
  PHOTOGRAPHER: 'Fotografo',
  VIDEOMAKER: 'Videomaker',
  STORYMAKER: 'Storymaker'
};

const statusLabels = {
  TODO: 'A confirmar',
  IN_PROGRESS: 'Confirmada',
  WAITING: 'Aguardando',
  DONE: 'Concluida',
  CANCELED: 'Cancelada'
};

const priorityLabels = {
  LOW: 'Baixa',
  NORMAL: 'Normal',
  HIGH: 'Alta',
  URGENT: 'Urgente'
};

const palette = ['#b7dcff', '#a7efbd', '#ffd978', '#f4a8ca', '#b8a8ff', '#bff1f2'];
const timeSlots = Array.from({ length: 13 }, (_, index) => index + 6);

const Page = styled.main`
  min-height: 100vh;
  background:
    radial-gradient(circle at 14% 14%, rgba(66, 188, 255, 0.18), transparent 32%),
    radial-gradient(circle at 88% 84%, rgba(226, 61, 50, 0.16), transparent 32%),
    #1f1f20;
  color: #17191d;
  padding: 28px;

  @media (max-width: 760px) {
    padding: 12px;
  }
`;

const AppFrame = styled.div`
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr);
  gap: 18px;
  min-height: calc(100vh - 56px);
  max-width: 1500px;
  margin: 0 auto;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  background: rgba(15, 17, 19, 0.92);
  color: #fff;
  padding: 18px;
  min-height: 100%;
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const Mark = styled.div`
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 2px solid #fff;
  border-radius: 8px;
  font-weight: 900;
`;

const ProfileText = styled.div`
  flex: 1;

  strong {
    display: block;
  }

  span {
    color: rgba(255, 255, 255, 0.62);
    font-size: 0.84rem;
  }
`;

const IconButton = styled.button`
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  padding: 9px 12px;
`;

const DarkPanel = styled.section`
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  padding: 16px;

  h2 {
    font-size: 0.94rem;
    margin-bottom: 12px;
  }
`;

const MiniMonth = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  text-align: center;
  font-size: 0.78rem;

  span {
    color: rgba(255, 255, 255, 0.55);
  }
`;

const MiniDay = styled.button`
  aspect-ratio: 1;
  border-radius: 8px;
  background: ${({ $active }) => $active ? '#e23d32' : 'transparent'};
  color: ${({ $active }) => $active ? '#fff' : 'rgba(255,255,255,0.84)'};
`;

const Stat = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 9px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  &:last-child {
    border-bottom: 0;
  }

  span {
    color: rgba(255, 255, 255, 0.62);
  }
`;

const Legend = styled.div`
  display: grid;
  gap: 10px;
`;

const LegendItem = styled.div`
  display: grid;
  grid-template-columns: 12px 1fr 90px;
  gap: 8px;
  align-items: center;

  i {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${({ $color }) => $color};
  }

  div {
    height: 4px;
    border-radius: 999px;
    background: ${({ $color }) => $color};
  }
`;

const MainPanel = styled.section`
  border: 8px solid #111;
  border-radius: 18px;
  background: #f7f8fa;
  overflow: hidden;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 22px 26px 16px;
  background: #fff;
  border-bottom: 1px solid #e5e8ec;

  h1 {
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 600;
  }

  @media (max-width: 820px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const Tabs = styled.nav`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const TabButton = styled.button`
  border-radius: 8px;
  background: ${({ $active }) => $active ? '#111' : '#f0f2f5'};
  color: ${({ $active }) => $active ? '#fff' : '#20242a'};
  font-weight: 700;
  padding: 10px 16px;
`;

const Content = styled.div`
  padding: 0 26px 26px;
`;

const WeekStrip = styled.div`
  display: grid;
  grid-template-columns: 52px repeat(7, minmax(112px, 1fr));
  gap: 8px;
  padding: 18px 0;
  overflow-x: auto;
`;

const DayButton = styled.button`
  min-height: 78px;
  border-radius: 8px;
  background: ${({ $active }) => $active ? '#202020' : '#eef1f5'};
  color: ${({ $active }) => $active ? '#fff' : '#20242a'};
  padding: 10px;
  text-align: center;

  span {
    display: block;
    color: ${({ $active }) => $active ? 'rgba(255,255,255,0.72)' : '#68707a'};
    font-size: 0.78rem;
  }

  strong {
    display: block;
    font-size: 1.8rem;
    line-height: 1.1;
  }
`;

const CalendarLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 330px;
  gap: 18px;
  align-items: start;

  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: 52px repeat(7, minmax(112px, 1fr));
  grid-template-rows: repeat(${timeSlots.length}, 64px);
  gap: 1px 8px;
  min-width: 860px;
  overflow: hidden;
`;

const CalendarScroller = styled.div`
  overflow-x: auto;
  padding-bottom: 8px;
`;

const TimeCell = styled.div`
  color: #49505a;
  font-size: 0.82rem;
  padding-top: 4px;
`;

const DayColumn = styled.div`
  position: relative;
  grid-row: 1 / span ${timeSlots.length};
  border-left: 1px solid #e3e7ec;
`;

const HourLine = styled.div`
  height: 64px;
  border-top: 1px solid #e3e7ec;
`;

const EventCard = styled.article`
  position: absolute;
  left: 8px;
  right: 8px;
  top: ${({ $top }) => $top}px;
  min-height: ${({ $height }) => $height}px;
  border-radius: 8px;
  background: ${({ $color }) => $color};
  color: #17191d;
  padding: 10px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(18, 21, 24, 0.08);

  h3 {
    font-size: 0.84rem;
    margin-bottom: 4px;
  }

  span {
    display: block;
    font-size: 0.76rem;
  }
`;

const People = styled.div`
  display: flex;
  margin-top: 8px;

  i {
    display: grid;
    place-items: center;
    width: 24px;
    height: 24px;
    margin-right: -6px;
    border: 2px solid rgba(255,255,255,0.72);
    border-radius: 50%;
    background: #111;
    color: #fff;
    font-size: 0.7rem;
    font-style: normal;
  }
`;

const FormPanel = styled.section`
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 24px 70px rgba(18, 21, 24, 0.14);
  padding: 22px;

  h2 {
    margin-bottom: 16px;
  }
`;

const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.label`
  display: block;
  color: #20242a;
  font-size: 0.75rem;
  font-weight: 800;
  margin-bottom: 12px;
  text-transform: uppercase;

  input,
  textarea,
  select {
    display: block;
    width: 100%;
    margin-top: 6px;
    border: 0;
    border-radius: 8px;
    background: #f1f3f6;
    padding: 11px;
    font-size: 0.95rem;
  }

  textarea {
    min-height: 82px;
    resize: vertical;
  }
`;

const PrimaryButton = styled.button`
  width: 100%;
  border-radius: 8px;
  background: #111;
  color: #fff;
  font-weight: 800;
  padding: 13px 14px;

  &:hover {
    background: #e23d32;
  }
`;

const ListGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(330px, 420px) minmax(0, 1fr);
  gap: 18px;
  padding-top: 20px;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`;

const LightPanel = styled.section`
  border: 1px solid #e0e4ea;
  border-radius: 8px;
  background: #fff;
  padding: 18px;

  h2 {
    margin-bottom: 14px;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: ${({ $columns }) => $columns || '1fr 1fr 1fr'};
  gap: 12px;
  align-items: center;
  border: 1px solid #dde2e8;
  border-radius: 8px;
  background: #fff;
  padding: 12px;
  margin-bottom: 8px;

  strong {
    display: block;
  }

  span {
    color: #68707a;
    font-size: 0.88rem;
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  border-radius: 999px;
  background: ${({ $color }) => $color || '#eef1f5'};
  color: ${({ $color }) => ($color ? '#111' : '#404852')};
  font-size: 0.74rem;
  font-weight: 800;
  padding: 5px 9px;
`;

const Notice = styled.div`
  border: 1px solid #f1d38f;
  border-radius: 8px;
  background: #fff8e6;
  color: #6b4a00;
  padding: 12px 14px;
  margin: 18px 0 0;
`;

const Empty = styled.div`
  color: #68707a;
  font-size: 0.92rem;
  padding: 22px 0;
`;

const initialPautaForm = {
  title: '',
  description: '',
  eventDate: new Date().toISOString().slice(0, 10),
  startTime: '09:00',
  endTime: '',
  status: 'IN_PROGRESS',
  priority: 'NORMAL',
  sectorId: '',
  whatsappGroupName: '',
  reminderMinutesBefore: 60,
  photographerId: '',
  videomakerId: '',
  storymakerId: ''
};

const toIsoDate = (date) => date.toISOString().slice(0, 10);
const formatTime = (value) => value ? value.slice(0, 5) : '';
const dayName = (date) => date.toLocaleDateString('pt-BR', { weekday: 'short' });
const monthTitle = (date) => date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

const getMonday = (value) => {
  const date = new Date(`${value}T00:00:00`);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  return date;
};

const getAssignment = (item, role) => item.assignments?.find((current) => current.coverageRole === role);

const initials = (name = '') => name
  .split(' ')
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0])
  .join('')
  .toUpperCase();

const timeToTop = (time) => {
  if (!time) return 0;
  const [hour, minute] = time.split(':').map(Number);
  return Math.max(0, ((hour - 6) * 64) + ((minute || 0) / 60) * 64);
};

const durationToHeight = (start, end) => {
  if (!start || !end) return 96;
  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);
  const minutes = ((endHour * 60) + (endMinute || 0)) - ((startHour * 60) + (startMinute || 0));
  return Math.max(72, (minutes / 60) * 64);
};

const AdminPage = () => {
  const navigate = useNavigate();
  const token = authStorage.getToken();
  const admin = authStorage.getAdmin();
  const [agendaItems, setAgendaItems] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [activeTab, setActiveTab] = useState('agenda');
  const [selectedDate, setSelectedDate] = useState(toIsoDate(new Date()));
  const [notice, setNotice] = useState('');
  const [pautaForm, setPautaForm] = useState(initialPautaForm);
  const [sectorForm, setSectorForm] = useState({ name: '', color: '#e23d32', active: true });
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    phoneNumber: '',
    roleName: 'Fotografo',
    sectorId: '',
    active: true
  });

  const loadData = async () => {
    try {
      const [items, sectorList, employeeList] = await Promise.all([
        apiRequest('/agenda-items'),
        apiRequest('/sectors'),
        apiRequest('/employees')
      ]);
      setAgendaItems(items);
      setSectors(sectorList);
      setEmployees(employeeList);
      setNotice('');
    } catch (error) {
      setNotice('Backend indisponivel. O painel precisa da API Java em execucao.');
    }
  };

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  const weekDays = useMemo(() => {
    const start = getMonday(selectedDate);
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return date;
    });
  }, [selectedDate]);

  const weekItems = useMemo(() => {
    const days = new Set(weekDays.map(toIsoDate));
    return agendaItems.filter((item) => days.has(item.eventDate));
  }, [agendaItems, weekDays]);

  const todayItems = agendaItems.filter((item) => item.eventDate === toIsoDate(new Date()));
  const nextItem = [...agendaItems]
    .filter((item) => `${item.eventDate}T${item.startTime || '00:00'}` >= new Date().toISOString().slice(0, 16))
    .sort((a, b) => `${a.eventDate}${a.startTime || ''}`.localeCompare(`${b.eventDate}${b.startTime || ''}`))[0];

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const logout = () => {
    authStorage.clear();
    navigate('/login');
  };

  const countForDay = (date) => agendaItems.filter((item) => item.eventDate === toIsoDate(date)).length;

  const buildAssignments = () => [
    [pautaForm.photographerId, 'PHOTOGRAPHER'],
    [pautaForm.videomakerId, 'VIDEOMAKER'],
    [pautaForm.storymakerId, 'STORYMAKER']
  ]
    .filter(([employeeId]) => employeeId)
    .map(([employeeId, coverageRole]) => ({ employeeId, coverageRole }));

  const createPauta = async (event) => {
    event.preventDefault();
    const assignments = buildAssignments();
    const created = await apiRequest('/agenda-items', {
      method: 'POST',
      body: JSON.stringify({
        title: pautaForm.title,
        description: pautaForm.description,
        eventDate: pautaForm.eventDate,
        startTime: pautaForm.startTime || null,
        endTime: pautaForm.endTime || null,
        status: pautaForm.status,
        priority: pautaForm.priority,
        sectorId: pautaForm.sectorId || null,
        responsibleId: assignments[0]?.employeeId || null,
        whatsappGroupName: pautaForm.whatsappGroupName,
        reminderMinutesBefore: Number(pautaForm.reminderMinutesBefore),
        assignments
      })
    });
    setAgendaItems((items) => [...items, created]);
    setSelectedDate(created.eventDate);
    setPautaForm({ ...initialPautaForm, eventDate: created.eventDate });
  };

  const createSector = async (event) => {
    event.preventDefault();
    const created = await apiRequest('/sectors', {
      method: 'POST',
      body: JSON.stringify(sectorForm)
    });
    setSectors((items) => [...items, created]);
    setSectorForm({ name: '', color: '#e23d32', active: true });
  };

  const createEmployee = async (event) => {
    event.preventDefault();
    const created = await apiRequest('/employees', {
      method: 'POST',
      body: JSON.stringify({ ...employeeForm, sectorId: employeeForm.sectorId || null })
    });
    setEmployees((items) => [...items, created]);
    setEmployeeForm({ name: '', phoneNumber: '', roleName: 'Fotografo', sectorId: '', active: true });
  };

  const updateStatus = async (item, status) => {
    const updated = await apiRequest(`/agenda-items/${item.id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    setAgendaItems((items) => items.map((current) => (current.id === updated.id ? updated : current)));
  };

  const renderAgenda = () => (
    <>
      <WeekStrip>
        <div />
        {weekDays.map((date) => {
          const iso = toIsoDate(date);
          return (
            <DayButton key={iso} $active={iso === selectedDate} onClick={() => setSelectedDate(iso)}>
              <span>{dayName(date)}</span>
              <strong>{date.getDate()}</strong>
              <span>{countForDay(date)} pauta{countForDay(date) === 1 ? '' : 's'}</span>
            </DayButton>
          );
        })}
      </WeekStrip>

      <CalendarLayout>
        <CalendarScroller>
          <CalendarGrid>
            {timeSlots.map((hour) => (
              <TimeCell key={hour} style={{ gridColumn: 1, gridRow: hour - 5 }}>
                {hour}:00
              </TimeCell>
            ))}

            {weekDays.map((date, dayIndex) => {
              const iso = toIsoDate(date);
              const items = weekItems.filter((item) => item.eventDate === iso);
              return (
                <DayColumn key={iso} style={{ gridColumn: dayIndex + 2 }}>
                  {timeSlots.map((hour) => <HourLine key={hour} />)}
                  {items.map((item, index) => {
                    const color = item.sectorColor || palette[index % palette.length];
                    const assignments = item.assignments || [];
                    return (
                      <EventCard
                        key={item.id}
                        $color={color}
                        $top={timeToTop(item.startTime)}
                        $height={durationToHeight(item.startTime, item.endTime)}
                      >
                        <h3>{item.title}</h3>
                        <span>{formatTime(item.startTime) || '--:--'} {item.endTime ? `- ${formatTime(item.endTime)}` : ''}</span>
                        <span>{item.sectorName || 'Geral'}</span>
                        <People>
                          {assignments.slice(0, 3).map((assignment) => (
                            <i key={`${item.id}-${assignment.coverageRole}`}>{initials(assignment.employeeName)}</i>
                          ))}
                        </People>
                      </EventCard>
                    );
                  })}
                </DayColumn>
              );
            })}
          </CalendarGrid>
        </CalendarScroller>

        <FormPanel>
          <h2>Nova pauta</h2>
          <form onSubmit={createPauta}>
            <Field>
              Titulo
              <input
                required
                value={pautaForm.title}
                onChange={(event) => setPautaForm({ ...pautaForm, title: event.target.value })}
              />
            </Field>
            <FieldGrid>
              <Field>
                Data
                <input
                  required
                  type="date"
                  value={pautaForm.eventDate}
                  onChange={(event) => setPautaForm({ ...pautaForm, eventDate: event.target.value })}
                />
              </Field>
              <Field>
                Inicio
                <input
                  type="time"
                  value={pautaForm.startTime}
                  onChange={(event) => setPautaForm({ ...pautaForm, startTime: event.target.value })}
                />
              </Field>
              <Field>
                Fim
                <input
                  type="time"
                  value={pautaForm.endTime}
                  onChange={(event) => setPautaForm({ ...pautaForm, endTime: event.target.value })}
                />
              </Field>
              <Field>
                Prioridade
                <select
                  value={pautaForm.priority}
                  onChange={(event) => setPautaForm({ ...pautaForm, priority: event.target.value })}
                >
                  {Object.entries(priorityLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </Field>
            </FieldGrid>
            <Field>
              Descricao
              <textarea
                value={pautaForm.description}
                onChange={(event) => setPautaForm({ ...pautaForm, description: event.target.value })}
              />
            </Field>
            <FieldGrid>
              <Field>
                Setor
                <select
                  value={pautaForm.sectorId}
                  onChange={(event) => setPautaForm({ ...pautaForm, sectorId: event.target.value })}
                >
                  <option value="">Geral</option>
                  {sectors.map((sector) => (
                    <option key={sector.id} value={sector.id}>{sector.name}</option>
                  ))}
                </select>
              </Field>
              <Field>
                Grupo
                <input
                  value={pautaForm.whatsappGroupName}
                  onChange={(event) => setPautaForm({ ...pautaForm, whatsappGroupName: event.target.value })}
                />
              </Field>
            </FieldGrid>
            {Object.entries(roleLabels).map(([role, label]) => {
              const key = role === 'PHOTOGRAPHER' ? 'photographerId' : role === 'VIDEOMAKER' ? 'videomakerId' : 'storymakerId';
              return (
                <Field key={role}>
                  {label}
                  <select
                    value={pautaForm[key]}
                    onChange={(event) => setPautaForm({ ...pautaForm, [key]: event.target.value })}
                  >
                    <option value="">Nao escalado</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>{employee.name}</option>
                    ))}
                  </select>
                </Field>
              );
            })}
            <PrimaryButton type="submit">Salvar pauta</PrimaryButton>
          </form>
        </FormPanel>
      </CalendarLayout>
    </>
  );

  const renderEquipe = () => (
    <ListGrid>
      <LightPanel>
        <h2>Novo funcionario</h2>
        <form onSubmit={createEmployee}>
          <Field>
            Nome
            <input
              required
              value={employeeForm.name}
              onChange={(event) => setEmployeeForm({ ...employeeForm, name: event.target.value })}
            />
          </Field>
          <Field>
            WhatsApp
            <input
              required
              value={employeeForm.phoneNumber}
              onChange={(event) => setEmployeeForm({ ...employeeForm, phoneNumber: event.target.value })}
            />
          </Field>
          <FieldGrid>
            <Field>
              Funcao
              <select
                value={employeeForm.roleName}
                onChange={(event) => setEmployeeForm({ ...employeeForm, roleName: event.target.value })}
              >
                <option value="Fotografo">Fotografo</option>
                <option value="Videomaker">Videomaker</option>
                <option value="Storymaker">Storymaker</option>
                <option value="Editor">Editor</option>
                <option value="Produtor">Produtor</option>
              </select>
            </Field>
            <Field>
              Setor
              <select
                value={employeeForm.sectorId}
                onChange={(event) => setEmployeeForm({ ...employeeForm, sectorId: event.target.value })}
              >
                <option value="">Geral</option>
                {sectors.map((sector) => (
                  <option key={sector.id} value={sector.id}>{sector.name}</option>
                ))}
              </select>
            </Field>
          </FieldGrid>
          <PrimaryButton type="submit">Salvar funcionario</PrimaryButton>
        </form>
      </LightPanel>

      <LightPanel>
        <h2>Equipe cadastrada</h2>
        {employees.length ? employees.map((employee) => (
          <Row key={employee.id} $columns="1.2fr 1fr 1fr">
            <div>
              <strong>{employee.name}</strong>
              <span>{employee.phoneNumber}</span>
            </div>
            <div>
              <strong>{employee.roleName || 'Sem funcao'}</strong>
              <span>{employee.sectorName || 'Geral'}</span>
            </div>
            <Pill>{employee.active ? 'Ativo' : 'Inativo'}</Pill>
          </Row>
        )) : <Empty>Nenhum funcionario cadastrado.</Empty>}
      </LightPanel>
    </ListGrid>
  );

  const renderSetores = () => (
    <ListGrid>
      <LightPanel>
        <h2>Novo setor</h2>
        <form onSubmit={createSector}>
          <Field>
            Nome
            <input
              required
              value={sectorForm.name}
              onChange={(event) => setSectorForm({ ...sectorForm, name: event.target.value })}
            />
          </Field>
          <Field>
            Cor
            <input
              type="color"
              value={sectorForm.color}
              onChange={(event) => setSectorForm({ ...sectorForm, color: event.target.value })}
            />
          </Field>
          <PrimaryButton type="submit">Criar setor</PrimaryButton>
        </form>
      </LightPanel>

      <LightPanel>
        <h2>Setores</h2>
        {sectors.length ? sectors.map((sector) => (
          <Row key={sector.id} $columns="1fr 120px 120px">
            <div>
              <strong>{sector.name}</strong>
              <span>{employees.filter((employee) => employee.sectorId === sector.id).length} pessoa(s)</span>
            </div>
            <Pill $color={sector.color}>{sector.color}</Pill>
            <Pill>{sector.active ? 'Ativo' : 'Inativo'}</Pill>
          </Row>
        )) : <Empty>Nenhum setor cadastrado.</Empty>}
      </LightPanel>
    </ListGrid>
  );

  const monthBase = new Date(`${selectedDate}T00:00:00`);
  const miniDays = Array.from({ length: 31 }, (_, index) => index + 1);

  return (
    <Page>
      <AppFrame>
        <Sidebar>
          <Profile>
            <Mark>+</Mark>
            <ProfileText>
              <strong>Vmais Agenda</strong>
              <span>{admin?.displayName || 'Administrador'}</span>
            </ProfileText>
            <IconButton onClick={logout}>Sair</IconButton>
          </Profile>

          <DarkPanel>
            <h2>{monthTitle(monthBase)}</h2>
            <MiniMonth>
              {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((day) => <span key={day}>{day}</span>)}
              {miniDays.map((day) => {
                const date = new Date(monthBase.getFullYear(), monthBase.getMonth(), day);
                const iso = toIsoDate(date);
                return (
                  <MiniDay key={day} $active={iso === selectedDate} onClick={() => setSelectedDate(iso)}>
                    {day}
                  </MiniDay>
                );
              })}
            </MiniMonth>
          </DarkPanel>

          <DarkPanel>
            <h2>Resumo</h2>
            <Stat><span>Hoje</span><strong>{todayItems.length}</strong></Stat>
            <Stat><span>Semana</span><strong>{weekItems.length}</strong></Stat>
            <Stat><span>Equipe</span><strong>{employees.length}</strong></Stat>
          </DarkPanel>

          <DarkPanel>
            <h2>Proxima pauta</h2>
            {nextItem ? (
              <>
                <Stat><span>{formatTime(nextItem.startTime) || '--:--'}</span><strong>{nextItem.title}</strong></Stat>
                <Stat><span>Setor</span><strong>{nextItem.sectorName || 'Geral'}</strong></Stat>
              </>
            ) : <Empty>Nenhuma pauta futura.</Empty>}
          </DarkPanel>

          <DarkPanel>
            <h2>Coberturas</h2>
            <Legend>
              {Object.entries(roleLabels).map(([role, label], index) => (
                <LegendItem key={role} $color={palette[index]}>
                  <i />
                  <span>{label}</span>
                  <div />
                </LegendItem>
              ))}
            </Legend>
          </DarkPanel>
        </Sidebar>

        <MainPanel>
          <Header>
            <h1>{monthTitle(monthBase)}</h1>
            <Tabs>
              <TabButton $active={activeTab === 'agenda'} onClick={() => setActiveTab('agenda')}>Agenda</TabButton>
              <TabButton $active={activeTab === 'equipe'} onClick={() => setActiveTab('equipe')}>Equipe</TabButton>
              <TabButton $active={activeTab === 'setores'} onClick={() => setActiveTab('setores')}>Setores</TabButton>
            </Tabs>
          </Header>
          <Content>
            {notice && <Notice>{notice}</Notice>}
            {activeTab === 'agenda' && renderAgenda()}
            {activeTab === 'equipe' && renderEquipe()}
            {activeTab === 'setores' && renderSetores()}
          </Content>
        </MainPanel>
      </AppFrame>
    </Page>
  );
};

export default AdminPage;
