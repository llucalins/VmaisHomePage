create table reminder_dispatches (
  id uuid primary key,
  dispatch_key varchar(220) not null unique,
  dispatch_type varchar(60) not null,
  agenda_item_id uuid references agenda_items(id) on delete set null,
  scheduled_at timestamp not null,
  whatsapp_group_name varchar(140),
  message text not null,
  payload jsonb not null,
  status varchar(40) not null,
  sent_at timestamp,
  failed_at timestamp,
  error_message text,
  attempts integer not null default 0,
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create index idx_reminder_dispatches_status_scheduled_at
  on reminder_dispatches(status, scheduled_at);

create index idx_reminder_dispatches_agenda_item
  on reminder_dispatches(agenda_item_id);
