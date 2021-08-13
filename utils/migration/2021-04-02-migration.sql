--Start 

rollback;

begin;

-- Temps

CREATE OR REPLACE temporary VIEW r AS
SELECT extras::jsonb as ext, * FROM resource;
create function pg_temp.rename_key(ext jsonb, from_ text, to_ text) returns jsonb as 
$$
	select ext - from_ || (case when ext ? from_ then jsonb_build_object(to_, ext->from_) else '{}'::jsonb end)
$$ language sql;
create function pg_temp.replace_value(ext jsonb, key_ text, from_ text, to_ json) returns jsonb as 
$$ 
	select ext || (case when ext ->> key_ = from_ then jsonb_build_object(key_, to_) else '{}'::jsonb end)
$$ language sql;
create function pg_temp.replace_value(ext jsonb, key_ text, from_ text, to_ int) returns jsonb as 
$$ 
	select pg_temp.replace_value(ext, key_, from_, to_::text::json)
$$ language sql;

-- Updates

update r
set resource_type = 'bdm_table'
where ext->>'is_bdm' = '["BD+"]'
;
update resource
set resource_type = 'external_link'
where extras::json->>'is_bdm' != '["BD+"]' or extras::json->>'is_bdm' is NULL
;
update r
set extras = pg_temp.rename_key(ext, 'is_bdm', 'ble')
;
update r
set extras = pg_temp.replace_value(ext, 'bdm_file_size', 'Unavailable', null::json)
;
select * from r order by id limit 10;


-- End

rollback;

