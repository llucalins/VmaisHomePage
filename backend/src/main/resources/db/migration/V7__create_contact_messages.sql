create table contact_messages (
  id uuid primary key,
  name varchar(140) not null,
  email varchar(180) not null,
  company varchar(160),
  service varchar(160),
  message text not null,
  created_at timestamptz not null
);

create index idx_contact_messages_created_at
  on contact_messages(created_at desc);
