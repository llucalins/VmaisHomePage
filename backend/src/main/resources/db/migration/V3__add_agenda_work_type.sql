alter table agenda_items
  add column work_type varchar(40) not null default 'COVERAGE';

create index idx_agenda_items_work_type on agenda_items(work_type);
