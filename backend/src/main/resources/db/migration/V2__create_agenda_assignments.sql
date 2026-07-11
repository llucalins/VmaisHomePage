create table agenda_assignments (
  id uuid primary key,
  agenda_item_id uuid not null references agenda_items(id) on delete cascade,
  employee_id uuid not null references employees(id),
  coverage_role varchar(40) not null,
  unique (agenda_item_id, coverage_role, employee_id)
);

create index idx_agenda_assignments_item on agenda_assignments(agenda_item_id);
create index idx_agenda_assignments_employee on agenda_assignments(employee_id);
