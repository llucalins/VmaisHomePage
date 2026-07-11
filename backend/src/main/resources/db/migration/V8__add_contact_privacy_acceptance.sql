alter table contact_messages
  add column privacy_accepted_at timestamptz;

update contact_messages
set privacy_accepted_at = created_at
where privacy_accepted_at is null;

alter table contact_messages
  alter column privacy_accepted_at set not null;
