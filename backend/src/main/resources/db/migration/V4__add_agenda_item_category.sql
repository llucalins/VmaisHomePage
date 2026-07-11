alter table agenda_items
  add column category varchar(80);

update agenda_items item
set category = sector.name
from sectors sector
where item.sector_id = sector.id
  and item.category is null;
