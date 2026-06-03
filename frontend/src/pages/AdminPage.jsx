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

const designColumns = [
  ['TODO', 'Backlog'],
  ['IN_PROGRESS', 'Em producao'],
  ['WAITING', 'Aguardando'],
  ['DONE', 'Finalizado']
];

const coverageCategories = ['Evento', 'Sessao', 'Institucional', 'Entrevista', 'Materia', 'Externa'];
const designCategories = ['Feed', 'Stories', 'Cartaz', 'Outdoor', 'Identidade', 'Video curto'];
const palette = ['#b7dcff', '#a7efbd', '#ffd978', '#f4a8ca', '#b8a8ff', '#bff1f2'];
const hourHeight = 56;
const timeSlots = Array.from({ length: 24 }, (_, index) => index);

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
  grid-template-columns: ${({ $withSidebar }) => $withSidebar ? '300px minmax(0, 1fr)' : 'minmax(0, 1fr)'};
  gap: 18px;
  max-width: 1500px;
  margin: 0 auto;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;

const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  max-width: 1500px;
  margin: 0 auto 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  background: rgba(15, 17, 19, 0.92);
  color: #fff;
  padding: 16px 18px;

  @media (max-width: 1080px) {
    align-items: stretch;
    flex-direction: column;
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

const MiniHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;

  h2 {
    margin-bottom: 0;
  }
`;

const MiniNav = styled.div`
  display: flex;
  gap: 6px;

  button {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
    font-weight: 900;
  }
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

const MiniBlank = styled.div`
  aspect-ratio: 1;
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

const CardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 10px;

  span {
    color: rgba(23, 25, 29, 0.62);
    font-size: 0.78rem;
  }

  strong {
    color: #17191d;
    font-size: 0.84rem;
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

const SidebarNav = styled.nav`
  display: flex;
  justify-content: center;
  gap: 8px;
  flex: 1;
  flex-wrap: wrap;
`;

const SidebarNavButton = styled.button`
  width: min(190px, 100%);
  border: 1px solid ${({ $active }) => $active ? 'rgba(255,255,255,0.38)' : 'rgba(255,255,255,0.08)'};
  border-radius: 8px;
  background: ${({ $active }) => $active ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.04)'};
  color: #fff;
  font-weight: 800;
  padding: 12px 14px;
  text-align: left;

  span {
    display: block;
    color: rgba(255, 255, 255, 0.58);
    font-size: 0.78rem;
    font-weight: 500;
    margin-top: 3px;
  }
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
  display: block;
`;

const BoardLayout = styled.div`
  padding-top: 20px;
`;

const DesignBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(220px, 1fr));
  gap: 14px;
  overflow-x: auto;
  padding-bottom: 8px;
`;

const BoardColumn = styled.section`
  min-height: 620px;
  border: 1px solid #dde3ea;
  border-radius: 8px;
  background: ${({ $active }) => $active ? '#e3edf8' : '#eef1f5'};
  padding: 12px;
  transition: background 160ms ease, border-color 160ms ease;

  ${({ $active }) => $active && `
    border-color: #9ecbf4;
  `}

  h2 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    font-size: 0.88rem;
    margin-bottom: 12px;
    text-transform: uppercase;
  }
`;

const DesignCard = styled.article`
  border: 1px solid #e0e5eb;
  border-radius: 8px;
  background: ${({ $color }) => $color || '#fff'};
  box-shadow: 0 12px 28px rgba(18, 21, 24, 0.08);
  color: #17191d;
  cursor: grab;
  margin-bottom: 10px;
  opacity: ${({ $dragging }) => $dragging ? 0.54 : 1};
  padding: 14px;
  transition: opacity 160ms ease, transform 160ms ease, box-shadow 160ms ease;

  &:active {
    cursor: grabbing;
    transform: scale(0.99);
  }

  h3 {
    font-size: 1rem;
    margin-bottom: 8px;
  }

  p {
    color: #4f5965;
    font-size: 0.88rem;
    margin-bottom: 12px;
  }
`;

const CardPills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const InlineAction = styled.button`
  border: 0;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.66);
  color: #20242a;
  font-size: 0.78rem;
  font-weight: 800;
  margin-top: 12px;
  padding: 8px 10px;
  width: 100%;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: 52px minmax(280px, 1fr);
  grid-template-rows: repeat(${timeSlots.length}, ${hourHeight}px);
  gap: 1px 8px;
  min-width: 520px;
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
  border-right: 1px solid #e3e7ec;
`;

const HourLine = styled.div`
  height: ${hourHeight}px;
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
  cursor: pointer;

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

const HeaderAction = styled(PrimaryButton)`
  width: auto;
  min-width: 150px;
  padding: 11px 16px;
`;

const SecondaryButton = styled.button`
  width: 100%;
  border: 1px solid #d9dee5;
  border-radius: 8px;
  background: #fff;
  color: #20242a;
  font-weight: 800;
  padding: 12px 14px;
`;

const CloseButton = styled(SecondaryButton)`
  width: auto;
  padding: 9px 12px;
`;

const DangerButton = styled(SecondaryButton)`
  border-color: #f0b8b4;
  color: #b42318;
`;

const ButtonRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 14px;

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
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

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 20;
  display: grid;
  place-items: center;
  background: rgba(11, 12, 14, 0.58);
  padding: 18px;
`;

const ModalPanel = styled.section`
  width: min(620px, 100%);
  max-height: min(760px, calc(100vh - 36px));
  overflow: auto;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.28);
  padding: 22px;
`;

const ModalHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 16px;

  h2 {
    font-size: 1.35rem;
  }

  p {
    color: #68707a;
    margin-top: 4px;
  }
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin: 14px 0;

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

const DetailItem = styled.div`
  border: 1px solid #e1e5eb;
  border-radius: 8px;
  background: #f7f8fa;
  padding: 12px;

  span {
    display: block;
    color: #68707a;
    font-size: 0.76rem;
    font-weight: 800;
    margin-bottom: 4px;
    text-transform: uppercase;
  }
`;

const initialPautaForm = {
  title: '',
  description: '',
  eventDate: new Date().toISOString().slice(0, 10),
  startTime: '09:00',
  status: 'IN_PROGRESS',
  category: 'Evento',
  reminderMinutesBefore: 60,
  photographerId: '',
  videomakerId: '',
  storymakerId: ''
};

const initialDesignForm = {
  title: '',
  description: '',
  eventDate: new Date().toISOString().slice(0, 10),
  status: 'TODO',
  priority: 'NORMAL',
  category: 'Feed',
  responsibleId: ''
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
  return Math.max(0, (hour * hourHeight) + ((minute || 0) / 60) * hourHeight);
};

const durationToHeight = (start, end) => {
  if (!start || !end) return 84;
  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);
  const minutes = ((endHour * 60) + (endMinute || 0)) - ((startHour * 60) + (startMinute || 0));
  return Math.max(64, (minutes / 60) * hourHeight);
};

const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

const getAssignmentEmployeeId = (item, role) =>
  item.assignments?.find((assignment) => assignment.coverageRole === role)?.employeeId || '';

const itemToPautaForm = (item) => ({
  title: item.title || '',
  description: item.description || '',
  eventDate: item.eventDate,
  startTime: formatTime(item.startTime) || '09:00',
  status: item.status || 'IN_PROGRESS',
  category: item.category || item.sectorName || 'Evento',
  reminderMinutesBefore: item.reminderMinutesBefore ?? 60,
  photographerId: getAssignmentEmployeeId(item, 'PHOTOGRAPHER'),
  videomakerId: getAssignmentEmployeeId(item, 'VIDEOMAKER'),
  storymakerId: getAssignmentEmployeeId(item, 'STORYMAKER')
});

const itemToDesignForm = (item) => ({
  title: item.title || '',
  description: item.description || '',
  eventDate: item.eventDate,
  status: item.status || 'TODO',
  priority: item.priority || 'NORMAL',
  category: item.category || item.sectorName || 'Feed',
  responsibleId: item.responsibleId || ''
});

const AdminPage = () => {
  const navigate = useNavigate();
  const token = authStorage.getToken();
  const admin = authStorage.getAdmin();
  const [agendaItems, setAgendaItems] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [activeTab, setActiveTab] = useState('agenda');
  const [selectedDate, setSelectedDate] = useState(toIsoDate(new Date()));
  const [notice, setNotice] = useState('');
  const [pautaForm, setPautaForm] = useState(initialPautaForm);
  const [designForm, setDesignForm] = useState(initialDesignForm);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditingEvent, setIsEditingEvent] = useState(false);
  const [editPautaForm, setEditPautaForm] = useState(initialPautaForm);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [isEditingDesign, setIsEditingDesign] = useState(false);
  const [editDesignForm, setEditDesignForm] = useState(initialDesignForm);
  const [showPautaForm, setShowPautaForm] = useState(false);
  const [showDesignForm, setShowDesignForm] = useState(false);
  const [draggingDesignId, setDraggingDesignId] = useState(null);
  const [dragOverStatus, setDragOverStatus] = useState(null);
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    phoneNumber: '',
    roleName: 'Fotografo',
    active: true
  });

  const loadData = async () => {
    try {
      const [items, employeeList] = await Promise.all([
        apiRequest('/agenda-items'),
        apiRequest('/employees')
      ]);
      setAgendaItems(items);
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
    return agendaItems.filter((item) => (item.workType || 'COVERAGE') === 'COVERAGE' && days.has(item.eventDate));
  }, [agendaItems, weekDays]);

  const coverageItems = agendaItems.filter((item) => (item.workType || 'COVERAGE') === 'COVERAGE');
  const designItems = agendaItems.filter((item) => item.workType === 'DESIGN');
  const selectedDateItems = coverageItems.filter((item) => item.eventDate === selectedDate);
  const todayItems = coverageItems.filter((item) => item.eventDate === toIsoDate(new Date()));
  const confirmedCoverageItems = weekItems.filter((item) => item.status === 'IN_PROGRESS');
  const nextItem = [...coverageItems]
    .filter((item) => new Date(`${item.eventDate}T${item.startTime || '00:00'}`) >= new Date())
    .sort((a, b) => `${a.eventDate}${a.startTime || ''}`.localeCompare(`${b.eventDate}${b.startTime || ''}`))[0];

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const logout = () => {
    authStorage.clear();
    navigate('/login');
  };

  const countForDay = (date) => coverageItems.filter((item) => item.eventDate === toIsoDate(date)).length;

  const buildAssignments = (form) => [
    [form.photographerId, 'PHOTOGRAPHER'],
    [form.videomakerId, 'VIDEOMAKER'],
    [form.storymakerId, 'STORYMAKER']
  ]
    .filter(([employeeId]) => employeeId)
    .map(([employeeId, coverageRole]) => ({ employeeId, coverageRole }));

  const buildPautaPayload = (form) => {
    const assignments = buildAssignments(form);
    return {
      title: form.title,
      description: form.description,
      eventDate: form.eventDate,
      startTime: form.startTime || null,
      endTime: null,
      status: form.status,
      priority: 'NORMAL',
      workType: 'COVERAGE',
      category: form.category,
      sectorId: null,
      responsibleId: assignments[0]?.employeeId || null,
      whatsappGroupName: '',
      reminderMinutesBefore: Number(form.reminderMinutesBefore),
      assignments
    };
  };

  const buildDesignPayload = (form) => ({
    title: form.title,
    description: form.description,
    eventDate: form.eventDate,
    startTime: null,
    endTime: null,
    status: form.status,
    priority: form.priority,
    workType: 'DESIGN',
    category: form.category,
    sectorId: null,
    responsibleId: form.responsibleId || null,
    whatsappGroupName: '',
    reminderMinutesBefore: 0,
    assignments: []
  });

  const openEventDetails = (item) => {
    setSelectedEvent(item);
    setEditPautaForm(itemToPautaForm(item));
    setIsEditingEvent(false);
  };

  const closeEventDetails = () => {
    setSelectedEvent(null);
    setIsEditingEvent(false);
  };

  const openDesignDetails = (item) => {
    setSelectedDesign(item);
    setEditDesignForm(itemToDesignForm(item));
    setIsEditingDesign(false);
  };

  const closeDesignDetails = () => {
    setSelectedDesign(null);
    setIsEditingDesign(false);
  };

  const changeSelectedMonth = (amount) => {
    const date = new Date(`${selectedDate}T00:00:00`);
    const currentDay = date.getDate();
    date.setDate(1);
    date.setMonth(date.getMonth() + amount);
    date.setDate(Math.min(currentDay, daysInMonth(date)));
    setSelectedDate(toIsoDate(date));
  };

  const changeSelectedYear = (amount) => {
    const date = new Date(`${selectedDate}T00:00:00`);
    const currentDay = date.getDate();
    date.setDate(1);
    date.setFullYear(date.getFullYear() + amount);
    date.setDate(Math.min(currentDay, daysInMonth(date)));
    setSelectedDate(toIsoDate(date));
  };

  const createPauta = async (event) => {
    event.preventDefault();
    const created = await apiRequest('/agenda-items', {
      method: 'POST',
      body: JSON.stringify(buildPautaPayload(pautaForm))
    });
    setAgendaItems((items) => [...items, created]);
    setSelectedDate(created.eventDate);
    setPautaForm({ ...initialPautaForm, eventDate: created.eventDate });
    setShowPautaForm(false);
  };

  const updatePauta = async (event) => {
    event.preventDefault();
    const updated = await apiRequest(`/agenda-items/${selectedEvent.id}`, {
      method: 'PUT',
      body: JSON.stringify(buildPautaPayload(editPautaForm))
    });
    setAgendaItems((items) => items.map((item) => (item.id === updated.id ? updated : item)));
    setSelectedEvent(updated);
    setEditPautaForm(itemToPautaForm(updated));
    setSelectedDate(updated.eventDate);
    setIsEditingEvent(false);
  };

  const deletePauta = async () => {
    if (!selectedEvent || !window.confirm('Excluir esta pauta?')) {
      return;
    }
    await apiRequest(`/agenda-items/${selectedEvent.id}`, { method: 'DELETE' });
    setAgendaItems((items) => items.filter((item) => item.id !== selectedEvent.id));
    closeEventDetails();
  };

  const createDesignTask = async (event) => {
    event.preventDefault();
    const created = await apiRequest('/agenda-items', {
      method: 'POST',
      body: JSON.stringify(buildDesignPayload(designForm))
    });
    setAgendaItems((items) => [...items, created]);
    setDesignForm({ ...initialDesignForm, eventDate: created.eventDate });
    setShowDesignForm(false);
  };

  const updateDesignTask = async (event) => {
    event.preventDefault();
    const updated = await apiRequest(`/agenda-items/${selectedDesign.id}`, {
      method: 'PUT',
      body: JSON.stringify(buildDesignPayload(editDesignForm))
    });
    setAgendaItems((items) => items.map((item) => (item.id === updated.id ? updated : item)));
    setSelectedDesign(updated);
    setEditDesignForm(itemToDesignForm(updated));
    setIsEditingDesign(false);
  };

  const deleteDesignTask = async () => {
    if (!selectedDesign || !window.confirm('Excluir este card de design?')) {
      return;
    }
    await apiRequest(`/agenda-items/${selectedDesign.id}`, { method: 'DELETE' });
    setAgendaItems((items) => items.filter((item) => item.id !== selectedDesign.id));
    closeDesignDetails();
  };

  const createEmployee = async (event) => {
    event.preventDefault();
    const created = await apiRequest('/employees', {
      method: 'POST',
      body: JSON.stringify({ ...employeeForm, sectorId: null })
    });
    setEmployees((items) => [...items, created]);
    setEmployeeForm({ name: '', phoneNumber: '', roleName: 'Fotografo', active: true });
  };

  const updateStatus = async (item, status) => {
    const updated = await apiRequest(`/agenda-items/${item.id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    setAgendaItems((items) => items.map((current) => (current.id === updated.id ? updated : current)));
  };

  const startDesignDrag = (event, item) => {
    setDraggingDesignId(item.id);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', item.id);
  };

  const dropDesignCard = async (event, status) => {
    event.preventDefault();
    const itemId = event.dataTransfer.getData('text/plain') || draggingDesignId;
    const item = designItems.find((current) => current.id === itemId);
    setDraggingDesignId(null);
    setDragOverStatus(null);
    if (!item || item.status === status) {
      return;
    }
    await updateStatus(item, status);
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
              <TimeCell key={hour} style={{ gridColumn: 1, gridRow: hour + 1 }}>
                {String(hour).padStart(2, '0')}:00
              </TimeCell>
            ))}

            <DayColumn style={{ gridColumn: 2 }}>
              {timeSlots.map((hour) => <HourLine key={hour} />)}
              {selectedDateItems.map((item, index) => {
                const color = item.sectorColor || palette[index % palette.length];
                const category = item.category || item.sectorName || 'Geral';
                const assignments = item.assignments || [];
                return (
                  <EventCard
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    $color={color}
                    $top={timeToTop(item.startTime)}
                    $height={durationToHeight(item.startTime, item.endTime)}
                    onClick={() => openEventDetails(item)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        openEventDetails(item);
                      }
                    }}
                  >
                    <h3>{item.title}</h3>
                    <span>{formatTime(item.startTime) || '--:--'} {item.endTime ? `- ${formatTime(item.endTime)}` : ''}</span>
                    <span>{category}</span>
                    <People>
                      {assignments.slice(0, 3).map((assignment) => (
                        <i key={`${item.id}-${assignment.coverageRole}`}>{initials(assignment.employeeName)}</i>
                      ))}
                    </People>
                  </EventCard>
                );
              })}
            </DayColumn>
          </CalendarGrid>
        </CalendarScroller>

      </CalendarLayout>
    </>
  );

  const renderEventDetails = () => {
    if (!selectedEvent) {
      return null;
    }

    const category = selectedEvent.category || selectedEvent.sectorName || 'Geral';
    const assignments = selectedEvent.assignments || [];

    return (
      <ModalBackdrop onClick={closeEventDetails}>
        <ModalPanel onClick={(event) => event.stopPropagation()}>
          <ModalHeader>
            <div>
              <h2>{isEditingEvent ? 'Editar pauta' : selectedEvent.title}</h2>
              <p>
                {new Date(`${selectedEvent.eventDate}T00:00:00`).toLocaleDateString('pt-BR')}
                {' as '}
                {formatTime(selectedEvent.startTime) || '--:--'}
              </p>
            </div>
            <CloseButton type="button" onClick={closeEventDetails}>Fechar</CloseButton>
          </ModalHeader>

          {isEditingEvent ? (
            <form onSubmit={updatePauta}>
              <Field>
                Titulo
                <input
                  required
                  value={editPautaForm.title}
                  onChange={(event) => setEditPautaForm({ ...editPautaForm, title: event.target.value })}
                />
              </Field>
              <FieldGrid>
                <Field>
                  Data
                  <input
                    required
                    type="date"
                    value={editPautaForm.eventDate}
                    onChange={(event) => setEditPautaForm({ ...editPautaForm, eventDate: event.target.value })}
                  />
                </Field>
                <Field>
                  Inicio
                  <input
                    type="time"
                    value={editPautaForm.startTime}
                    onChange={(event) => setEditPautaForm({ ...editPautaForm, startTime: event.target.value })}
                  />
                </Field>
                <Field>
                  Tipo de pauta
                  <select
                    value={editPautaForm.category}
                    onChange={(event) => setEditPautaForm({ ...editPautaForm, category: event.target.value })}
                  >
                    {coverageCategories.map((currentCategory) => (
                      <option key={currentCategory} value={currentCategory}>{currentCategory}</option>
                    ))}
                  </select>
                </Field>
                <Field>
                  Status
                  <select
                    value={editPautaForm.status}
                    onChange={(event) => setEditPautaForm({ ...editPautaForm, status: event.target.value })}
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </Field>
              </FieldGrid>
              <Field>
                Descricao
                <textarea
                  value={editPautaForm.description}
                  onChange={(event) => setEditPautaForm({ ...editPautaForm, description: event.target.value })}
                />
              </Field>
              {Object.entries(roleLabels).map(([role, label]) => {
                const key = role === 'PHOTOGRAPHER' ? 'photographerId' : role === 'VIDEOMAKER' ? 'videomakerId' : 'storymakerId';
                return (
                  <Field key={role}>
                    {label}
                    <select
                      value={editPautaForm[key]}
                      onChange={(event) => setEditPautaForm({ ...editPautaForm, [key]: event.target.value })}
                    >
                      <option value="">Nao escalado</option>
                      {employees.map((employee) => (
                        <option key={employee.id} value={employee.id}>{employee.name}</option>
                      ))}
                    </select>
                  </Field>
                );
              })}
              <ButtonRow>
                <SecondaryButton type="button" onClick={() => setIsEditingEvent(false)}>Cancelar</SecondaryButton>
                <PrimaryButton type="submit">Salvar alteracoes</PrimaryButton>
              </ButtonRow>
            </form>
          ) : (
            <>
              <DetailGrid>
                <DetailItem>
                  <span>Tipo</span>
                  <strong>{category}</strong>
                </DetailItem>
                <DetailItem>
                  <span>Status</span>
                  <strong>{statusLabels[selectedEvent.status] || selectedEvent.status}</strong>
                </DetailItem>
                <DetailItem>
                  <span>Horario</span>
                  <strong>{formatTime(selectedEvent.startTime) || '--:--'}</strong>
                </DetailItem>
                <DetailItem>
                  <span>Responsavel principal</span>
                  <strong>{selectedEvent.responsibleName || 'Nao definido'}</strong>
                </DetailItem>
              </DetailGrid>

              {selectedEvent.description && (
                <DetailItem>
                  <span>Descricao</span>
                  <strong>{selectedEvent.description}</strong>
                </DetailItem>
              )}

              <LightPanel style={{ marginTop: 14 }}>
                <h2>Equipe escalada</h2>
                {assignments.length ? assignments.map((assignment) => (
                  <Row key={`${assignment.coverageRole}-${assignment.employeeId}`} $columns="1fr 1fr">
                    <strong>{roleLabels[assignment.coverageRole] || assignment.coverageRole}</strong>
                    <span>{assignment.employeeName}</span>
                  </Row>
                )) : <Empty>Nenhum responsavel escalado.</Empty>}
              </LightPanel>

              <ButtonRow>
                <SecondaryButton type="button" onClick={() => setIsEditingEvent(true)}>Editar</SecondaryButton>
                <DangerButton type="button" onClick={deletePauta}>Excluir</DangerButton>
              </ButtonRow>
            </>
          )}
        </ModalPanel>
      </ModalBackdrop>
    );
  };

  const renderPautaFormModal = () => {
    if (!showPautaForm) {
      return null;
    }

    return (
      <ModalBackdrop onClick={() => setShowPautaForm(false)}>
        <ModalPanel onClick={(event) => event.stopPropagation()}>
          <ModalHeader>
            <div>
              <h2>Nova pauta</h2>
              <p>Foto, video e stories</p>
            </div>
            <CloseButton type="button" onClick={() => setShowPautaForm(false)}>Fechar</CloseButton>
          </ModalHeader>
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
                  onChange={(event) => {
                    setPautaForm({ ...pautaForm, eventDate: event.target.value });
                    setSelectedDate(event.target.value);
                  }}
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
                Tipo de pauta
                <select
                  value={pautaForm.category}
                  onChange={(event) => setPautaForm({ ...pautaForm, category: event.target.value })}
                >
                  {coverageCategories.map((category) => (
                    <option key={category} value={category}>{category}</option>
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
            <ButtonRow>
              <SecondaryButton type="button" onClick={() => setShowPautaForm(false)}>Cancelar</SecondaryButton>
              <PrimaryButton type="submit">Salvar pauta</PrimaryButton>
            </ButtonRow>
          </form>
        </ModalPanel>
      </ModalBackdrop>
    );
  };

  const renderDesignFormModal = () => {
    if (!showDesignForm) {
      return null;
    }

    return (
      <ModalBackdrop onClick={() => setShowDesignForm(false)}>
        <ModalPanel onClick={(event) => event.stopPropagation()}>
          <ModalHeader>
            <div>
              <h2>Novo design</h2>
              <p>Quadro de producao</p>
            </div>
            <CloseButton type="button" onClick={() => setShowDesignForm(false)}>Fechar</CloseButton>
          </ModalHeader>
          <form onSubmit={createDesignTask}>
            <Field>
              Titulo
              <input
                required
                value={designForm.title}
                onChange={(event) => setDesignForm({ ...designForm, title: event.target.value })}
              />
            </Field>
            <Field>
              Briefing
              <textarea
                value={designForm.description}
                onChange={(event) => setDesignForm({ ...designForm, description: event.target.value })}
              />
            </Field>
            <FieldGrid>
              <Field>
                Entrega
                <input
                  required
                  type="date"
                  value={designForm.eventDate}
                  onChange={(event) => setDesignForm({ ...designForm, eventDate: event.target.value })}
                />
              </Field>
              <Field>
                Prioridade
                <select
                  value={designForm.priority}
                  onChange={(event) => setDesignForm({ ...designForm, priority: event.target.value })}
                >
                  {Object.entries(priorityLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </Field>
            </FieldGrid>
            <Field>
              Tipo de peca
              <select
                value={designForm.category}
                onChange={(event) => setDesignForm({ ...designForm, category: event.target.value })}
              >
                {designCategories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </Field>
            <Field>
              Responsavel
              <select
                value={designForm.responsibleId}
                onChange={(event) => setDesignForm({ ...designForm, responsibleId: event.target.value })}
              >
                <option value="">Nao definido</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>{employee.name}</option>
                ))}
              </select>
            </Field>
            <ButtonRow>
              <SecondaryButton type="button" onClick={() => setShowDesignForm(false)}>Cancelar</SecondaryButton>
              <PrimaryButton type="submit">Criar trabalho</PrimaryButton>
            </ButtonRow>
          </form>
        </ModalPanel>
      </ModalBackdrop>
    );
  };

  const renderDesignDetails = () => {
    if (!selectedDesign) {
      return null;
    }

    return (
      <ModalBackdrop onClick={closeDesignDetails}>
        <ModalPanel onClick={(event) => event.stopPropagation()}>
          <ModalHeader>
            <div>
              <h2>{isEditingDesign ? 'Editar design' : selectedDesign.title}</h2>
              <p>{new Date(`${selectedDesign.eventDate}T00:00:00`).toLocaleDateString('pt-BR')}</p>
            </div>
            <CloseButton type="button" onClick={closeDesignDetails}>Fechar</CloseButton>
          </ModalHeader>

          {isEditingDesign ? (
            <form onSubmit={updateDesignTask}>
              <Field>
                Titulo
                <input
                  required
                  value={editDesignForm.title}
                  onChange={(event) => setEditDesignForm({ ...editDesignForm, title: event.target.value })}
                />
              </Field>
              <Field>
                Briefing
                <textarea
                  value={editDesignForm.description}
                  onChange={(event) => setEditDesignForm({ ...editDesignForm, description: event.target.value })}
                />
              </Field>
              <FieldGrid>
                <Field>
                  Entrega
                  <input
                    required
                    type="date"
                    value={editDesignForm.eventDate}
                    onChange={(event) => setEditDesignForm({ ...editDesignForm, eventDate: event.target.value })}
                  />
                </Field>
                <Field>
                  Status
                  <select
                    value={editDesignForm.status}
                    onChange={(event) => setEditDesignForm({ ...editDesignForm, status: event.target.value })}
                  >
                    {designColumns.map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                    <option value="CANCELED">Cancelado</option>
                  </select>
                </Field>
                <Field>
                  Prioridade
                  <select
                    value={editDesignForm.priority}
                    onChange={(event) => setEditDesignForm({ ...editDesignForm, priority: event.target.value })}
                  >
                    {Object.entries(priorityLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </Field>
                <Field>
                  Tipo de peca
                  <select
                    value={editDesignForm.category}
                    onChange={(event) => setEditDesignForm({ ...editDesignForm, category: event.target.value })}
                  >
                    {designCategories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </Field>
              </FieldGrid>
              <Field>
                Responsavel
                <select
                  value={editDesignForm.responsibleId}
                  onChange={(event) => setEditDesignForm({ ...editDesignForm, responsibleId: event.target.value })}
                >
                  <option value="">Nao definido</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>{employee.name}</option>
                  ))}
                </select>
              </Field>
              <ButtonRow>
                <SecondaryButton type="button" onClick={() => setIsEditingDesign(false)}>Cancelar</SecondaryButton>
                <PrimaryButton type="submit">Salvar alteracoes</PrimaryButton>
              </ButtonRow>
            </form>
          ) : (
            <>
              <DetailGrid>
                <DetailItem>
                  <span>Status</span>
                  <strong>{statusLabels[selectedDesign.status] || selectedDesign.status}</strong>
                </DetailItem>
                <DetailItem>
                  <span>Prioridade</span>
                  <strong>{priorityLabels[selectedDesign.priority] || selectedDesign.priority}</strong>
                </DetailItem>
                <DetailItem>
                  <span>Tipo de peca</span>
                  <strong>{selectedDesign.category || selectedDesign.sectorName || 'Design'}</strong>
                </DetailItem>
                <DetailItem>
                  <span>Responsavel</span>
                  <strong>{selectedDesign.responsibleName || 'Nao definido'}</strong>
                </DetailItem>
              </DetailGrid>

              {selectedDesign.description && (
                <DetailItem>
                  <span>Briefing</span>
                  <strong>{selectedDesign.description}</strong>
                </DetailItem>
              )}

              <ButtonRow>
                <SecondaryButton type="button" onClick={() => setIsEditingDesign(true)}>Editar</SecondaryButton>
                <DangerButton type="button" onClick={deleteDesignTask}>Excluir</DangerButton>
              </ButtonRow>
            </>
          )}
        </ModalPanel>
      </ModalBackdrop>
    );
  };

  const renderDesign = () => (
    <BoardLayout>
      <DesignBoard>
        {designColumns.map(([status, label], columnIndex) => {
          const items = designItems.filter((item) => item.status === status);
          return (
            <BoardColumn
              key={status}
              $active={dragOverStatus === status}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = 'move';
                setDragOverStatus(status);
              }}
              onDragLeave={() => setDragOverStatus((current) => (current === status ? null : current))}
              onDrop={(event) => dropDesignCard(event, status)}
            >
              <h2>
                {label}
                <Pill>{items.length}</Pill>
              </h2>
              {items.length ? items.map((item, index) => (
                <DesignCard
                  key={item.id}
                  draggable
                  $color={palette[(columnIndex + index) % palette.length]}
                  $dragging={draggingDesignId === item.id}
                  onDragStart={(event) => startDesignDrag(event, item)}
                  onDragEnd={() => {
                    setDraggingDesignId(null);
                    setDragOverStatus(null);
                  }}
                >
                  <h3>{item.title}</h3>
                  {item.description && <p>{item.description}</p>}
                  <CardPills>
                    <Pill>{priorityLabels[item.priority] || item.priority}</Pill>
                    <Pill>{item.category || item.sectorName || 'Design'}</Pill>
                  </CardPills>
                  <CardMeta>
                    <span>Entrega</span>
                    <strong>{new Date(`${item.eventDate}T00:00:00`).toLocaleDateString('pt-BR')}</strong>
                  </CardMeta>
                  <CardMeta>
                    <span>Responsavel</span>
                    <strong>{item.responsibleName || 'Nao definido'}</strong>
                  </CardMeta>
                  <InlineAction
                    type="button"
                    draggable={false}
                    onClick={(event) => {
                      event.stopPropagation();
                      openDesignDetails(item);
                    }}
                  >
                    Detalhes
                  </InlineAction>
                </DesignCard>
              )) : <Empty>Nenhum trabalho.</Empty>}
            </BoardColumn>
          );
        })}
      </DesignBoard>

    </BoardLayout>
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
              <span>{employee.active ? 'Disponivel' : 'Inativo'}</span>
            </div>
            <Pill>{employee.active ? 'Ativo' : 'Inativo'}</Pill>
          </Row>
        )) : <Empty>Nenhum funcionario cadastrado.</Empty>}
      </LightPanel>
    </ListGrid>
  );

  const monthBase = new Date(`${selectedDate}T00:00:00`);
  const miniDays = Array.from({ length: daysInMonth(monthBase) }, (_, index) => index + 1);
  const miniBlanks = Array.from({ length: new Date(monthBase.getFullYear(), monthBase.getMonth(), 1).getDay() });
  const activeTitle = {
    agenda: monthTitle(monthBase),
    design: 'Design',
    equipe: 'Equipe'
  }[activeTab];

  return (
    <Page>
      <TopBar>
        <Profile>
          <Mark>+</Mark>
          <ProfileText>
            <strong>Vmais Agenda</strong>
            <span>{admin?.displayName || 'Administrador'}</span>
          </ProfileText>
        </Profile>

        <SidebarNav>
          <SidebarNavButton $active={activeTab === 'agenda'} onClick={() => setActiveTab('agenda')}>
            Agenda de pautas
            <span>Foto, video e stories</span>
          </SidebarNavButton>
          <SidebarNavButton $active={activeTab === 'design'} onClick={() => setActiveTab('design')}>
            Design
            <span>Quadro de producao</span>
          </SidebarNavButton>
          <SidebarNavButton $active={activeTab === 'equipe'} onClick={() => setActiveTab('equipe')}>
            Equipe
            <span>Funcionarios e funcoes</span>
          </SidebarNavButton>
        </SidebarNav>

        <IconButton onClick={logout}>Sair</IconButton>
      </TopBar>

      <AppFrame $withSidebar={activeTab === 'agenda'}>
        {activeTab === 'agenda' && (
          <Sidebar>
          <Profile>
            <ProfileText>
              <strong>Apoio da agenda</strong>
              <span>Periodo, resumo e coberturas</span>
            </ProfileText>
          </Profile>

          <DarkPanel>
            <MiniHeader>
              <h2>{monthTitle(monthBase)}</h2>
              <MiniNav>
                <button type="button" aria-label="Ano anterior" onClick={() => changeSelectedYear(-1)}>{'<<'}</button>
                <button type="button" aria-label="Mes anterior" onClick={() => changeSelectedMonth(-1)}>{'<'}</button>
                <button type="button" aria-label="Proximo mes" onClick={() => changeSelectedMonth(1)}>{'>'}</button>
                <button type="button" aria-label="Proximo ano" onClick={() => changeSelectedYear(1)}>{'>>'}</button>
              </MiniNav>
            </MiniHeader>
            <MiniMonth>
              {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((day) => <span key={day}>{day}</span>)}
              {miniBlanks.map((_, index) => <MiniBlank key={`blank-${index}`} />)}
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
            <Stat><span>Dia ativo</span><strong>{selectedDateItems.length}</strong></Stat>
            <Stat><span>Confirmadas</span><strong>{confirmedCoverageItems.length}</strong></Stat>
          </DarkPanel>

          <DarkPanel>
            <h2>Proxima pauta</h2>
            {nextItem ? (
              <>
                <Stat><span>{formatTime(nextItem.startTime) || '--:--'}</span><strong>{nextItem.title}</strong></Stat>
                <Stat><span>Tipo</span><strong>{nextItem.category || nextItem.sectorName || 'Geral'}</strong></Stat>
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
        )}

        <MainPanel>
          <Header>
            <h1>{activeTitle}</h1>
            {activeTab === 'agenda' && (
              <HeaderAction type="button" onClick={() => setShowPautaForm(true)}>Nova pauta</HeaderAction>
            )}
            {activeTab === 'design' && (
              <HeaderAction type="button" onClick={() => setShowDesignForm(true)}>Novo card</HeaderAction>
            )}
          </Header>
          <Content>
            {notice && <Notice>{notice}</Notice>}
            {activeTab === 'agenda' && renderAgenda()}
            {activeTab === 'design' && renderDesign()}
            {activeTab === 'equipe' && renderEquipe()}
            {renderEventDetails()}
            {renderDesignDetails()}
            {renderPautaFormModal()}
            {renderDesignFormModal()}
          </Content>
        </MainPanel>
      </AppFrame>
    </Page>
  );
};

export default AdminPage;
