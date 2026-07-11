create table admin_users (
  id uuid primary key,
  email varchar(160) not null unique,
  password_hash varchar(255) not null,
  display_name varchar(120) not null,
  role varchar(40) not null,
  active boolean not null default true,
  created_at timestamptz not null
);

create table sectors (
  id uuid primary key,
  name varchar(120) not null unique,
  color varchar(20) not null,
  active boolean not null default true,
  created_at timestamptz not null
);

create table employees (
  id uuid primary key,
  name varchar(140) not null,
  phone_number varchar(40) not null,
  role_name varchar(120),
  sector_id uuid references sectors(id),
  active boolean not null default true,
  created_at timestamptz not null
);

create table agenda_items (
  id uuid primary key,
  title varchar(180) not null,
  description text,
  event_date date not null,
  start_time time,
  end_time time,
  status varchar(40) not null,
  priority varchar(40) not null,
  whatsapp_group_name varchar(140),
  reminder_minutes_before integer not null,
  sector_id uuid references sectors(id),
  responsible_id uuid references employees(id),
  created_by_id uuid not null references admin_users(id),
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create index idx_agenda_items_date on agenda_items(event_date);
create index idx_agenda_items_sector on agenda_items(sector_id);
create index idx_agenda_items_status on agenda_items(status);
