import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ApiError, apiRequest, authStorage, validateSession } from '../services/api';

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

const SearchBox = styled.div`
  position: relative;
  width: ${({ $expanded }) => $expanded ? 'min(420px, 44vw)' : '42px'};
  transition: width 180ms ease;

  @media (max-width: 820px) {
    width: ${({ $expanded }) => $expanded ? '100%' : '42px'};
  }
`;

const SearchInput = styled.input`
  width: 100%;
  height: 42px;
  border: 1px solid #dce2e8;
  border-radius: 8px;
  background: #fff;
  color: #20242a;
  opacity: ${({ $expanded }) => $expanded ? 1 : 0};
  pointer-events: ${({ $expanded }) => $expanded ? 'auto' : 'none'};
  padding: 11px 14px;
  transition: opacity 120ms ease;

  &::placeholder {
    color: #8a929c;
  }
`;

const SearchToggle = styled.button`
  position: absolute;
  inset: 0 auto 0 0;
  display: ${({ $expanded }) => $expanded ? 'none' : 'grid'};
  place-items: center;
  width: 42px;
  height: 42px;
  border: 1px solid #dce2e8;
  border-radius: 8px;
  background: #fff;

  &::before {
    content: '';
    width: 13px;
    height: 13px;
    border: 2px solid #20242a;
    border-radius: 50%;
    transform: translate(-2px, -2px);
  }

  &::after {
    content: '';
    position: absolute;
    width: 9px;
    height: 2px;
    border-radius: 999px;
    background: #20242a;
    transform: translate(8px, 8px) rotate(45deg);
  }
`;

const SearchResults = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 12;
  width: min(420px, 100vw - 56px);
  border: 1px solid #dce2e8;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 18px 46px rgba(18, 21, 24, 0.14);
  overflow: hidden;
`;

const SearchResultButton = styled.button`
  display: grid;
  grid-template-columns: 84px 1fr;
  gap: 10px;
  width: 100%;
  border-bottom: 1px solid #edf0f3;
  background: transparent;
  color: #20242a;
  padding: 11px 12px;
  text-align: left;

  &:hover {
    background: #f4f6f8;
  }

  &:last-child {
    border-bottom: 0;
  }

  small {
    color: #69727d;
    font-weight: 800;
    text-transform: uppercase;
  }

  strong {
    display: block;
    margin-bottom: 2px;
  }

  span {
    color: #68707a;
    font-size: 0.82rem;
  }
`;

const SearchEmpty = styled.div`
  color: #68707a;
  padding: 13px 14px;
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
  position: relative;
  display: grid;
  place-items: center;
  aspect-ratio: 1;
  border-radius: 8px;
  background: ${({ $active }) => $active ? '#e23d32' : 'transparent'};
  color: ${({ $active }) => $active ? '#fff' : 'rgba(255,255,255,0.84)'};
  font-weight: ${({ $active }) => $active ? 800 : 500};

  ${({ $hasItems }) => $hasItems && `
    &::after {
      content: '';
      position: absolute;
      left: 50%;
      bottom: 5px;
      width: 14px;
      height: 3px;
      border-radius: 999px;
      background: rgba(51, 209, 122, 0.95);
      transform: translateX(-50%);
    }
  `}

  ${({ $active, $hasItems }) => $active && $hasItems && `
    &::after {
      background: rgba(255, 255, 255, 0.88);
    }
  `}
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

const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 18px 0 0;
`;

const FilterField = styled.label`
  color: #4f5965;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;

  select {
    display: block;
    min-width: 150px;
    margin-top: 5px;
    border: 1px solid #dde3ea;
    border-radius: 8px;
    background: #fff;
    color: #20242a;
    padding: 9px 10px;
  }
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
  box-shadow: ${({ $highlight }) => $highlight ? '0 0 0 3px rgba(226, 61, 50, 0.34), 0 18px 38px rgba(18, 21, 24, 0.14)' : '0 12px 28px rgba(18, 21, 24, 0.08)'};
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

const RowActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;

  button {
    border-radius: 8px;
    font-size: 0.78rem;
    font-weight: 800;
    padding: 8px 10px;
  }

  @media (max-width: 760px) {
    justify-content: flex-start;
  }
`;

const SmallEditButton = styled.button`
  background: #eef1f5;
  color: #20242a;
`;

const SmallDangerButton = styled.button`
  background: #fff1f0;
  color: #b42318;
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
  left: calc(8px + ${({ $lane }) => $lane} * ((100% - 16px) / ${({ $laneCount }) => $laneCount}));
  width: calc(((100% - 16px) / ${({ $laneCount }) => $laneCount}) - 6px);
  top: ${({ $top }) => $top}px;
  min-height: ${({ $height }) => $height}px;
  border-radius: 8px;
  background: ${({ $color }) => $color};
  color: #17191d;
  padding: 10px;
  overflow: hidden;
  box-shadow: ${({ $highlight }) => $highlight ? '0 0 0 3px rgba(226, 61, 50, 0.34), 0 16px 32px rgba(18, 21, 24, 0.18)' : '0 10px 20px rgba(18, 21, 24, 0.08)'};
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
  background: ${({ disabled }) => disabled ? '#858b93' : '#111'};
  color: #fff;
  font-weight: 800;
  padding: 13px 14px;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};

  &:hover {
    background: ${({ disabled }) => disabled ? '#858b93' : '#e23d32'};
  }
`;

const HeaderAction = styled(PrimaryButton)`
  width: auto;
  min-width: 150px;
  padding: 11px 16px;
`;

const HeaderTools = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;

  @media (max-width: 820px) {
    width: 100%;
    align-items: stretch;
    flex-wrap: wrap;

    ${HeaderAction} {
      flex: 1;
    }
  }
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
  border: 1px solid ${({ $highlight }) => $highlight ? '#e23d32' : '#dde2e8'};
  border-radius: 8px;
  background: #fff;
  box-shadow: ${({ $highlight }) => $highlight ? '0 0 0 3px rgba(226, 61, 50, 0.12)' : 'none'};
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

const StatusPill = styled(Pill)`
  background: ${({ $active }) => $active ? '#d8f8df' : '#ffe1de'};
  color: ${({ $active }) => $active ? '#176b2c' : '#b42318'};
`;

const Notice = styled.div`
  border: 1px solid ${({ $type }) => {
    if ($type === 'success') return '#9ed8aa';
    if ($type === 'error') return '#efb0aa';
    return '#f1d38f';
  }};
  border-radius: 8px;
  background: ${({ $type }) => {
    if ($type === 'success') return '#effaf1';
    if ($type === 'error') return '#fff1f0';
    return '#fff8e6';
  }};
  color: ${({ $type }) => {
    if ($type === 'success') return '#176b2c';
    if ($type === 'error') return '#9f1f17';
    return '#6b4a00';
  }};
  padding: 12px 14px;
  margin: 18px 0 0;
`;

const LoadingState = styled.div`
  color: #68707a;
  padding: 28px 0;
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
  meetingPoint: '',
  notes: '',
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

const timeToMinutes = (time) => {
  if (!time) return 0;
  const [hour, minute] = time.split(':').map(Number);
  return (hour * 60) + (minute || 0);
};

const durationToHeight = (start, end) => {
  if (!start || !end) return 84;
  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);
  const minutes = ((endHour * 60) + (endMinute || 0)) - ((startHour * 60) + (startMinute || 0));
  return Math.max(64, (minutes / 60) * hourHeight);
};

const itemTimeRange = (item) => {
  const start = timeToMinutes(item.startTime);
  const fallbackEnd = start + 90;
  const end = item.endTime ? timeToMinutes(item.endTime) : fallbackEnd;
  return { start, end: Math.max(start + 30, end) };
};

const layoutCalendarItems = (items) => {
  const sorted = [...items].sort((a, b) => {
    const aRange = itemTimeRange(a);
    const bRange = itemTimeRange(b);
    return aRange.start - bRange.start || aRange.end - bRange.end;
  });

  const groups = [];
  let currentGroup = [];
  let currentGroupEnd = -1;

  sorted.forEach((item) => {
    const range = itemTimeRange(item);
    if (currentGroup.length && range.start >= currentGroupEnd) {
      groups.push(currentGroup);
      currentGroup = [];
      currentGroupEnd = -1;
    }
    currentGroup.push({ item, ...range });
    currentGroupEnd = Math.max(currentGroupEnd, range.end);
  });

  if (currentGroup.length) {
    groups.push(currentGroup);
  }

  return groups.flatMap((group) => {
    const laneEnds = [];
    const positioned = group.map((entry) => {
      const lane = laneEnds.findIndex((end) => entry.start >= end);
      const nextLane = lane === -1 ? laneEnds.length : lane;
      laneEnds[nextLane] = entry.end;
      return { ...entry, lane: nextLane };
    });
    const laneCount = laneEnds.length || 1;
    return positioned.map((entry) => ({ ...entry.item, lane: entry.lane, laneCount }));
  });
};

const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

const normalizeSearch = (value = '') =>
  value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const levenshteinDistance = (a, b) => {
  if (!a) return b.length;
  if (!b) return a.length;
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);

  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= b.length; j += 1) {
      current[j] = a[i - 1] === b[j - 1]
        ? previous[j - 1]
        : Math.min(previous[j - 1], previous[j], current[j - 1]) + 1;
    }
    previous.splice(0, previous.length, ...current);
  }

  return previous[b.length];
};

const similarityScore = (query, target) => {
  const normalizedQuery = normalizeSearch(query);
  const normalizedTarget = normalizeSearch(target);
  if (!normalizedQuery || !normalizedTarget) return 0;
  if (normalizedTarget === normalizedQuery) return 120;
  if (normalizedTarget.startsWith(normalizedQuery)) return 105;
  if (normalizedTarget.includes(normalizedQuery)) return 92;

  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);
  const targetTokens = normalizedTarget.split(/\s+/).filter(Boolean);
  const tokenScore = Math.max(
    0,
    ...targetTokens.flatMap((targetToken) => queryTokens.map((queryToken) => {
      if (targetToken.startsWith(queryToken)) return 82;
      if (targetToken.includes(queryToken)) return 72;
      const distance = levenshteinDistance(queryToken, targetToken);
      const ratio = 1 - (distance / Math.max(queryToken.length, targetToken.length));
      return ratio >= 0.58 ? Math.round(ratio * 68) : 0;
    }))
  );

  const distance = levenshteinDistance(normalizedQuery, normalizedTarget);
  const ratio = 1 - (distance / Math.max(normalizedQuery.length, normalizedTarget.length));
  return Math.max(tokenScore, ratio >= 0.55 ? Math.round(ratio * 80) : 0);
};

const getAssignmentEmployeeId = (item, role) =>
  item.assignments?.find((assignment) => assignment.coverageRole === role)?.employeeId || '';

const itemToPautaForm = (item) => ({
  title: item.title || '',
  description: item.description || '',
  meetingPoint: item.meetingPoint || '',
  notes: item.notes || '',
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

const itemToEmployeeForm = (employee) => ({
  name: employee.name || '',
  phoneNumber: employee.phoneNumber || '',
  roleName: employee.roleName || 'Fotografo',
  active: employee.active ?? true
});

const messageForError = (error) => {
  if (error instanceof ApiError) {
    if (error.code === 'NETWORK') {
      return error.message;
    }
    if (error.code === 'AUTH') {
      return error.message;
    }
    return error.message || 'Nao foi possivel concluir a operacao.';
  }
  return 'Nao foi possivel concluir a operacao. Tente novamente.';
};

const AdminPage = () => {
  const navigate = useNavigate();
  const token = authStorage.getToken();
  const admin = authStorage.getAdmin();
  const [agendaItems, setAgendaItems] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [activeTab, setActiveTab] = useState('agenda');
  const [selectedDate, setSelectedDate] = useState(toIsoDate(new Date()));
  const [notice, setNotice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [agendaFilters, setAgendaFilters] = useState({ category: 'ALL', status: 'ALL', employeeId: 'ALL' });
  const [designFilters, setDesignFilters] = useState({ category: 'ALL', priority: 'ALL', responsibleId: 'ALL' });
  const [employeeFilter, setEmployeeFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [highlightedResult, setHighlightedResult] = useState(null);
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
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editEmployeeForm, setEditEmployeeForm] = useState({
    name: '',
    phoneNumber: '',
    roleName: 'Fotografo',
    active: true
  });
  const [draggingDesignId, setDraggingDesignId] = useState(null);
  const [dragOverStatus, setDragOverStatus] = useState(null);
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    phoneNumber: '',
    roleName: 'Fotografo',
    active: true
  });
  const searchInputRef = useRef(null);

  const expireSession = () => {
    authStorage.clear();
    navigate('/session-expired', { replace: true });
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [currentAdmin, items, employeeList] = await Promise.all([
        validateSession(),
        apiRequest('/agenda-items'),
        apiRequest('/employees')
      ]);
      authStorage.setAdmin(currentAdmin);
      setAgendaItems(items);
      setEmployees(employeeList);
      setNotice(null);
    } catch (error) {
      if (error instanceof ApiError && error.code === 'AUTH') {
        expireSession();
        return;
      }
      setNotice({ type: 'error', message: messageForError(error) });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    if (authStorage.isExpired(1000)) {
      expireSession();
      return undefined;
    }

    loadData();

    const expiresAt = authStorage.getExpiresAt();
    if (!expiresAt) {
      return undefined;
    }

    const timeout = window.setTimeout(
      expireSession,
      Math.max(0, Date.parse(expiresAt) - Date.now())
    );

    return () => window.clearTimeout(timeout);
  }, [token]);

  useEffect(() => {
    if (isSearchExpanded) {
      searchInputRef.current?.focus();
    }
  }, [isSearchExpanded]);

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
  const activeEmployees = employees.filter((employee) => employee.active);
  const filteredCoverageItems = coverageItems.filter((item) => {
    const matchesCategory = agendaFilters.category === 'ALL' || (item.category || item.sectorName || 'Geral') === agendaFilters.category;
    const matchesStatus = agendaFilters.status === 'ALL' || item.status === agendaFilters.status;
    const matchesEmployee = agendaFilters.employeeId === 'ALL'
      || item.assignments?.some((assignment) => assignment.employeeId === agendaFilters.employeeId);
    return matchesCategory && matchesStatus && matchesEmployee;
  });
  const filteredDesignItems = designItems.filter((item) => {
    const matchesCategory = designFilters.category === 'ALL' || (item.category || item.sectorName || 'Design') === designFilters.category;
    const matchesPriority = designFilters.priority === 'ALL' || item.priority === designFilters.priority;
    const matchesResponsible = designFilters.responsibleId === 'ALL' || item.responsibleId === designFilters.responsibleId;
    return matchesCategory && matchesPriority && matchesResponsible;
  });
  const filteredEmployees = employees.filter((employee) => {
    if (employeeFilter === 'ACTIVE') return employee.active;
    if (employeeFilter === 'INACTIVE') return !employee.active;
    return true;
  });
  const selectedDateItems = filteredCoverageItems.filter((item) => item.eventDate === selectedDate);
  const positionedDateItems = layoutCalendarItems(selectedDateItems);
  const todayItems = coverageItems.filter((item) => item.eventDate === toIsoDate(new Date()));
  const confirmedCoverageItems = weekItems.filter((item) => item.status === 'IN_PROGRESS');
  const nextItem = [...coverageItems]
    .filter((item) => new Date(`${item.eventDate}T${item.startTime || '00:00'}`) >= new Date())
    .sort((a, b) => `${a.eventDate}${a.startTime || ''}`.localeCompare(`${b.eventDate}${b.startTime || ''}`))[0];
  const searchResults = useMemo(() => {
    const query = searchTerm.trim();
    if (query.length < 2) {
      return [];
    }

    return [
      ...coverageItems.map((item) => ({
        type: 'agenda',
        id: item.id,
        label: item.title,
        meta: `${new Date(`${item.eventDate}T00:00:00`).toLocaleDateString('pt-BR')} ${formatTime(item.startTime) || ''}`.trim(),
        item,
        score: similarityScore(query, item.title)
      })),
      ...designItems.map((item) => ({
        type: 'design',
        id: item.id,
        label: item.title,
        meta: `${statusLabels[item.status] || item.status} · ${item.responsibleName || 'Sem responsavel'}`,
        item,
        score: similarityScore(query, item.title)
      })),
      ...employees.map((employee) => ({
        type: 'equipe',
        id: employee.id,
        label: employee.name,
        meta: `${employee.roleName || 'Sem funcao'} · ${employee.active ? 'Ativo' : 'Inativo'}`,
        employee,
        score: similarityScore(query, employee.name)
      }))
    ]
      .filter((result) => result.score >= 42)
      .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label))
      .slice(0, 8);
  }, [coverageItems, designItems, employees, searchTerm]);

  useEffect(() => {
    if (!highlightedResult) return;
    const element = document.getElementById(`result-${highlightedResult.type}-${highlightedResult.id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightedResult, activeTab, selectedDate, filteredDesignItems, filteredEmployees]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const logout = () => {
    authStorage.clear();
    navigate('/login');
  };

  const showNotice = (type, message) => {
    setNotice({ type, message });
  };

  const selectSearchResult = (result) => {
    setHighlightedResult({ type: result.type, id: result.id });
    setIsSearchOpen(false);
    setIsSearchExpanded(false);

    if (result.type === 'agenda') {
      setActiveTab('agenda');
      setAgendaFilters({ category: 'ALL', status: 'ALL', employeeId: 'ALL' });
      setSelectedDate(result.item.eventDate);
      return;
    }

    if (result.type === 'design') {
      setActiveTab('design');
      setDesignFilters({ category: 'ALL', priority: 'ALL', responsibleId: 'ALL' });
      return;
    }

    setActiveTab('equipe');
    setEmployeeFilter('ALL');
  };

  const runAction = async (action, successMessage) => {
    setIsSaving(true);
    try {
      const result = await action();
      if (successMessage) {
        showNotice('success', successMessage);
      }
      return result;
    } catch (error) {
      showNotice('error', messageForError(error));
      if (error instanceof ApiError && error.code === 'AUTH') {
        expireSession();
      }
      return undefined;
    } finally {
      setIsSaving(false);
    }
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
      meetingPoint: form.meetingPoint,
      notes: form.notes,
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

  const openEmployeeEditor = (employee) => {
    setSelectedEmployee(employee);
    setEditEmployeeForm(itemToEmployeeForm(employee));
  };

  const closeEmployeeModal = () => {
    setShowEmployeeForm(false);
    setSelectedEmployee(null);
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
    const created = await runAction(() => apiRequest('/agenda-items', {
      method: 'POST',
      body: JSON.stringify(buildPautaPayload(pautaForm))
    }), 'Pauta criada com sucesso.');
    if (!created) return;
    setAgendaItems((items) => [...items, created]);
    setSelectedDate(created.eventDate);
    setPautaForm({ ...initialPautaForm, eventDate: created.eventDate });
    setShowPautaForm(false);
  };

  const updatePauta = async (event) => {
    event.preventDefault();
    const updated = await runAction(() => apiRequest(`/agenda-items/${selectedEvent.id}`, {
      method: 'PUT',
      body: JSON.stringify(buildPautaPayload(editPautaForm))
    }), 'Pauta atualizada com sucesso.');
    if (!updated) return;
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
    const deleted = await runAction(() => apiRequest(`/agenda-items/${selectedEvent.id}`, { method: 'DELETE' }), 'Pauta excluida com sucesso.');
    if (deleted === undefined) return;
    setAgendaItems((items) => items.filter((item) => item.id !== selectedEvent.id));
    closeEventDetails();
  };

  const createDesignTask = async (event) => {
    event.preventDefault();
    const created = await runAction(() => apiRequest('/agenda-items', {
      method: 'POST',
      body: JSON.stringify(buildDesignPayload(designForm))
    }), 'Card criado com sucesso.');
    if (!created) return;
    setAgendaItems((items) => [...items, created]);
    setDesignForm({ ...initialDesignForm, eventDate: created.eventDate });
    setShowDesignForm(false);
  };

  const updateDesignTask = async (event) => {
    event.preventDefault();
    const updated = await runAction(() => apiRequest(`/agenda-items/${selectedDesign.id}`, {
      method: 'PUT',
      body: JSON.stringify(buildDesignPayload(editDesignForm))
    }), 'Card atualizado com sucesso.');
    if (!updated) return;
    setAgendaItems((items) => items.map((item) => (item.id === updated.id ? updated : item)));
    setSelectedDesign(updated);
    setEditDesignForm(itemToDesignForm(updated));
    setIsEditingDesign(false);
  };

  const deleteDesignTask = async () => {
    if (!selectedDesign || !window.confirm('Excluir este card de design?')) {
      return;
    }
    const deleted = await runAction(() => apiRequest(`/agenda-items/${selectedDesign.id}`, { method: 'DELETE' }), 'Card excluido com sucesso.');
    if (deleted === undefined) return;
    setAgendaItems((items) => items.filter((item) => item.id !== selectedDesign.id));
    closeDesignDetails();
  };

  const createEmployee = async (event) => {
    event.preventDefault();
    const created = await runAction(() => apiRequest('/employees', {
      method: 'POST',
      body: JSON.stringify({ ...employeeForm, sectorId: null })
    }), 'Funcionario criado com sucesso.');
    if (!created) return;
    setEmployees((items) => [...items, created]);
    setEmployeeForm({ name: '', phoneNumber: '', roleName: 'Fotografo', active: true });
    setShowEmployeeForm(false);
  };

  const updateEmployee = async (event) => {
    event.preventDefault();
    const updated = await runAction(() => apiRequest(`/employees/${selectedEmployee.id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...editEmployeeForm, sectorId: null })
    }), 'Funcionario atualizado com sucesso.');
    if (!updated) return;
    setEmployees((items) => items.map((employee) => (employee.id === updated.id ? updated : employee)));
    closeEmployeeModal();
  };

  const deleteEmployee = async (employee) => {
    if (!window.confirm(`Excluir ${employee.name}?`)) {
      return;
    }
    const deleted = await runAction(() => apiRequest(`/employees/${employee.id}`, { method: 'DELETE' }), 'Funcionario excluido com sucesso.');
    if (deleted === undefined) return;
    setEmployees((items) => items.filter((current) => current.id !== employee.id));
  };

  const updateStatus = async (item, status) => {
    const updated = await runAction(() => apiRequest(`/agenda-items/${item.id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }), 'Status atualizado com sucesso.');
    if (!updated) return;
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

  const renderSearch = () => (
    <SearchBox $expanded={isSearchExpanded}>
      <SearchToggle
        type="button"
        aria-label="Abrir busca"
        $expanded={isSearchExpanded}
        onClick={() => {
          setIsSearchExpanded(true);
          setIsSearchOpen(true);
        }}
      />
      <SearchInput
        ref={searchInputRef}
        type="search"
        value={searchTerm}
        $expanded={isSearchExpanded}
        placeholder="Buscar pauta, card ou funcionario"
        onChange={(event) => {
          setSearchTerm(event.target.value);
          setIsSearchOpen(true);
        }}
        onFocus={() => setIsSearchOpen(true)}
        onBlur={() => window.setTimeout(() => {
          setIsSearchOpen(false);
          if (!searchTerm.trim()) {
            setIsSearchExpanded(false);
          }
        }, 140)}
      />
      {isSearchExpanded && isSearchOpen && searchTerm.trim().length >= 2 && (
        <SearchResults>
          {searchResults.length ? searchResults.map((result) => (
            <SearchResultButton
              key={`${result.type}-${result.id}`}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectSearchResult(result)}
            >
              <small>{result.type === 'agenda' ? 'Pauta' : result.type === 'design' ? 'Design' : 'Equipe'}</small>
              <div>
                <strong>{result.label}</strong>
                <span>{result.meta}</span>
              </div>
            </SearchResultButton>
          )) : <SearchEmpty>Nenhum resultado parecido.</SearchEmpty>}
        </SearchResults>
      )}
    </SearchBox>
  );

  const renderAgenda = () => (
    <>
      <FilterBar>
        <FilterField>
          Tipo
          <select
            value={agendaFilters.category}
            onChange={(event) => setAgendaFilters({ ...agendaFilters, category: event.target.value })}
          >
            <option value="ALL">Todos</option>
            {coverageCategories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </FilterField>
        <FilterField>
          Status
          <select
            value={agendaFilters.status}
            onChange={(event) => setAgendaFilters({ ...agendaFilters, status: event.target.value })}
          >
            <option value="ALL">Todos</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </FilterField>
        <FilterField>
          Responsavel
          <select
            value={agendaFilters.employeeId}
            onChange={(event) => setAgendaFilters({ ...agendaFilters, employeeId: event.target.value })}
          >
            <option value="ALL">Todos</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>{employee.name}</option>
            ))}
          </select>
        </FilterField>
      </FilterBar>
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
              {positionedDateItems.map((item, index) => {
                const color = item.sectorColor || palette[index % palette.length];
                const category = item.category || item.sectorName || 'Geral';
                const assignments = item.assignments || [];
                return (
                  <EventCard
                    id={`result-agenda-${item.id}`}
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    $color={color}
                    $highlight={highlightedResult?.type === 'agenda' && highlightedResult.id === item.id}
                    $top={timeToTop(item.startTime)}
                    $height={durationToHeight(item.startTime, item.endTime)}
                    $lane={item.lane}
                    $laneCount={item.laneCount}
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
                Ponto de encontro
                <input
                  value={editPautaForm.meetingPoint}
                  onChange={(event) => setEditPautaForm({ ...editPautaForm, meetingPoint: event.target.value })}
                />
              </Field>
              <Field>
                Descricao
                <textarea
                  value={editPautaForm.description}
                  onChange={(event) => setEditPautaForm({ ...editPautaForm, description: event.target.value })}
                />
              </Field>
              <Field>
                Observacoes
                <textarea
                  value={editPautaForm.notes}
                  onChange={(event) => setEditPautaForm({ ...editPautaForm, notes: event.target.value })}
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
                      {activeEmployees.map((employee) => (
                        <option key={employee.id} value={employee.id}>{employee.name}</option>
                      ))}
                    </select>
                  </Field>
                );
              })}
              <ButtonRow>
                <SecondaryButton type="button" onClick={() => setIsEditingEvent(false)}>Cancelar</SecondaryButton>
                <PrimaryButton type="submit" disabled={isSaving}>{isSaving ? 'Salvando...' : 'Salvar alteracoes'}</PrimaryButton>
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
                <DetailItem>
                  <span>Ponto de encontro</span>
                  <strong>{selectedEvent.meetingPoint || 'Nao definido'}</strong>
                </DetailItem>
              </DetailGrid>

              {selectedEvent.description && (
                <DetailItem>
                  <span>Descricao</span>
                  <strong>{selectedEvent.description}</strong>
                </DetailItem>
              )}

              {selectedEvent.notes && (
                <DetailItem>
                  <span>Observacoes</span>
                  <strong>{selectedEvent.notes}</strong>
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
                <DangerButton type="button" disabled={isSaving} onClick={deletePauta}>Excluir</DangerButton>
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
              Ponto de encontro
              <input
                value={pautaForm.meetingPoint}
                onChange={(event) => setPautaForm({ ...pautaForm, meetingPoint: event.target.value })}
              />
            </Field>
            <Field>
              Descricao
              <textarea
                value={pautaForm.description}
                onChange={(event) => setPautaForm({ ...pautaForm, description: event.target.value })}
              />
            </Field>
            <Field>
              Observacoes
              <textarea
                value={pautaForm.notes}
                onChange={(event) => setPautaForm({ ...pautaForm, notes: event.target.value })}
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
                    {activeEmployees.map((employee) => (
                      <option key={employee.id} value={employee.id}>{employee.name}</option>
                    ))}
                  </select>
                </Field>
              );
            })}
            <ButtonRow>
              <SecondaryButton type="button" onClick={() => setShowPautaForm(false)}>Cancelar</SecondaryButton>
              <PrimaryButton type="submit" disabled={isSaving}>{isSaving ? 'Salvando...' : 'Salvar pauta'}</PrimaryButton>
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
                {activeEmployees.map((employee) => (
                  <option key={employee.id} value={employee.id}>{employee.name}</option>
                ))}
              </select>
            </Field>
            <ButtonRow>
              <SecondaryButton type="button" onClick={() => setShowDesignForm(false)}>Cancelar</SecondaryButton>
              <PrimaryButton type="submit" disabled={isSaving}>{isSaving ? 'Salvando...' : 'Criar trabalho'}</PrimaryButton>
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
                  {activeEmployees.map((employee) => (
                    <option key={employee.id} value={employee.id}>{employee.name}</option>
                  ))}
                </select>
              </Field>
              <ButtonRow>
                <SecondaryButton type="button" onClick={() => setIsEditingDesign(false)}>Cancelar</SecondaryButton>
                <PrimaryButton type="submit" disabled={isSaving}>{isSaving ? 'Salvando...' : 'Salvar alteracoes'}</PrimaryButton>
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
                <DangerButton type="button" disabled={isSaving} onClick={deleteDesignTask}>Excluir</DangerButton>
              </ButtonRow>
            </>
          )}
        </ModalPanel>
      </ModalBackdrop>
    );
  };

  const renderEmployeeFormModal = () => {
    if (!showEmployeeForm && !selectedEmployee) {
      return null;
    }

    const isEditing = Boolean(selectedEmployee);
    const form = isEditing ? editEmployeeForm : employeeForm;
    const setForm = isEditing ? setEditEmployeeForm : setEmployeeForm;

    return (
      <ModalBackdrop onClick={closeEmployeeModal}>
        <ModalPanel onClick={(event) => event.stopPropagation()}>
          <ModalHeader>
            <div>
              <h2>{isEditing ? 'Editar funcionario' : 'Novo funcionario'}</h2>
              <p>Equipe operacional</p>
            </div>
            <CloseButton type="button" onClick={closeEmployeeModal}>Fechar</CloseButton>
          </ModalHeader>
          <form onSubmit={isEditing ? updateEmployee : createEmployee}>
            <Field>
              Nome
              <input
                required
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
            </Field>
            <Field>
              WhatsApp
              <input
                required
                value={form.phoneNumber}
                onChange={(event) => setForm({ ...form, phoneNumber: event.target.value })}
              />
            </Field>
            <FieldGrid>
              <Field>
                Funcao
                <select
                  value={form.roleName}
                  onChange={(event) => setForm({ ...form, roleName: event.target.value })}
                >
                  <option value="Fotografo">Fotografo</option>
                  <option value="Videomaker">Videomaker</option>
                  <option value="Storymaker">Storymaker</option>
                  <option value="Designer">Designer</option>
                  <option value="Editor">Editor</option>
                  <option value="Produtor">Produtor</option>
                </select>
              </Field>
              <Field>
                Status
                <select
                  value={form.active ? 'true' : 'false'}
                  onChange={(event) => setForm({ ...form, active: event.target.value === 'true' })}
                >
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
                </select>
              </Field>
            </FieldGrid>
            <ButtonRow>
              <SecondaryButton type="button" onClick={closeEmployeeModal}>Cancelar</SecondaryButton>
              <PrimaryButton type="submit" disabled={isSaving}>
                {isSaving ? 'Salvando...' : isEditing ? 'Salvar alteracoes' : 'Salvar funcionario'}
              </PrimaryButton>
            </ButtonRow>
          </form>
        </ModalPanel>
      </ModalBackdrop>
    );
  };

  const renderDesign = () => (
    <BoardLayout>
      <FilterBar>
        <FilterField>
          Tipo de peca
          <select
            value={designFilters.category}
            onChange={(event) => setDesignFilters({ ...designFilters, category: event.target.value })}
          >
            <option value="ALL">Todos</option>
            {designCategories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </FilterField>
        <FilterField>
          Prioridade
          <select
            value={designFilters.priority}
            onChange={(event) => setDesignFilters({ ...designFilters, priority: event.target.value })}
          >
            <option value="ALL">Todas</option>
            {Object.entries(priorityLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </FilterField>
        <FilterField>
          Responsavel
          <select
            value={designFilters.responsibleId}
            onChange={(event) => setDesignFilters({ ...designFilters, responsibleId: event.target.value })}
          >
            <option value="ALL">Todos</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>{employee.name}</option>
            ))}
          </select>
        </FilterField>
      </FilterBar>
      <DesignBoard>
        {designColumns.map(([status, label], columnIndex) => {
          const items = filteredDesignItems.filter((item) => item.status === status);
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
                  id={`result-design-${item.id}`}
                  key={item.id}
                  draggable
                  $color={palette[(columnIndex + index) % palette.length]}
                  $dragging={draggingDesignId === item.id}
                  $highlight={highlightedResult?.type === 'design' && highlightedResult.id === item.id}
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
    <BoardLayout>
      <FilterBar>
        <FilterField>
          Status
          <select value={employeeFilter} onChange={(event) => setEmployeeFilter(event.target.value)}>
            <option value="ALL">Todos</option>
            <option value="ACTIVE">Ativos</option>
            <option value="INACTIVE">Inativos</option>
          </select>
        </FilterField>
      </FilterBar>
      <LightPanel>
        <h2>Equipe cadastrada</h2>
        {filteredEmployees.length ? filteredEmployees.map((employee) => (
          <Row
            id={`result-equipe-${employee.id}`}
            key={employee.id}
            $columns="1.2fr 1fr 120px 160px"
            $highlight={highlightedResult?.type === 'equipe' && highlightedResult.id === employee.id}
          >
            <div>
              <strong>{employee.name}</strong>
              <span>{employee.phoneNumber}</span>
            </div>
            <div>
              <strong>{employee.roleName || 'Sem funcao'}</strong>
              <span>{employee.active ? 'Disponivel' : 'Inativo'}</span>
            </div>
            <StatusPill $active={employee.active}>{employee.active ? 'Ativo' : 'Inativo'}</StatusPill>
            <RowActions>
              <SmallEditButton type="button" onClick={() => openEmployeeEditor(employee)}>Editar</SmallEditButton>
              <SmallDangerButton type="button" disabled={isSaving} onClick={() => deleteEmployee(employee)}>Excluir</SmallDangerButton>
            </RowActions>
          </Row>
        )) : <Empty>Nenhum funcionario encontrado.</Empty>}
      </LightPanel>
    </BoardLayout>
  );

  const monthBase = new Date(`${selectedDate}T00:00:00`);
  const miniDays = Array.from({ length: daysInMonth(monthBase) }, (_, index) => index + 1);
  const miniBlanks = Array.from({ length: new Date(monthBase.getFullYear(), monthBase.getMonth(), 1).getDay() });
  const monthAgendaDates = new Set(
    coverageItems
      .filter((item) => {
        const date = new Date(`${item.eventDate}T00:00:00`);
        return date.getFullYear() === monthBase.getFullYear() && date.getMonth() === monthBase.getMonth();
      })
      .map((item) => item.eventDate)
  );
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
              {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}
              {miniBlanks.map((_, index) => <MiniBlank key={`blank-${index}`} />)}
              {miniDays.map((day) => {
                const date = new Date(monthBase.getFullYear(), monthBase.getMonth(), day);
                const iso = toIsoDate(date);
                return (
                  <MiniDay
                    key={day}
                    $active={iso === selectedDate}
                    $hasItems={monthAgendaDates.has(iso)}
                    onClick={() => setSelectedDate(iso)}
                  >
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
            <HeaderTools>
              {renderSearch()}
              {activeTab === 'agenda' && (
                <HeaderAction type="button" onClick={() => setShowPautaForm(true)}>Nova pauta</HeaderAction>
              )}
              {activeTab === 'design' && (
                <HeaderAction type="button" onClick={() => setShowDesignForm(true)}>Novo card</HeaderAction>
              )}
              {activeTab === 'equipe' && (
                <HeaderAction type="button" onClick={() => setShowEmployeeForm(true)}>Novo funcionario</HeaderAction>
              )}
            </HeaderTools>
          </Header>
          <Content>
            {notice && <Notice $type={notice.type}>{notice.message}</Notice>}
            {isLoading ? (
              <LoadingState>Carregando dados do painel...</LoadingState>
            ) : (
              <>
                {activeTab === 'agenda' && renderAgenda()}
                {activeTab === 'design' && renderDesign()}
                {activeTab === 'equipe' && renderEquipe()}
              </>
            )}
            {renderEventDetails()}
            {renderDesignDetails()}
            {renderPautaFormModal()}
            {renderDesignFormModal()}
            {renderEmployeeFormModal()}
          </Content>
        </MainPanel>
      </AppFrame>
    </Page>
  );
};

export default AdminPage;
