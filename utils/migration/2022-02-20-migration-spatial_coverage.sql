-- Load python
-- CREATE EXTENSION IF NOT EXISTS plpython3u;

-- Temp functions definition
CREATE OR REPLACE FUNCTION pg_temp.migrate_sc(sc_list_str json) RETURNS json AS $$
	if sc_list_str == 'null': return None
	import json
	sc_list = json.loads(sc_list_str)
	if sc_list == []:
		return '["world"]'
	def old2new(old):
		if {'continent': 'north_america'} == old:
		    return ('na')
		elif {'continent': 'south_america'} == old:
		    return ('sa')
		elif {'continent': 'africa'} == old:
		    return ('af')
		elif {'continent': 'asia'} == old:
		    return ('as')
		elif {'continent': 'europe'} == old:
		    return ('eu')
		elif {'continent': 'north_america', 'country': 'us'} == old:
		    return ('na.us')
		elif {'continent': 'europe', 'country': 'gb'} == old:
		    return ('eu.gb')
		elif {'continent': 'south_america', 'country': 'br'} == old:
		    return ('sa.br')
		elif {'continent': 'south_america', 'country': 'br', 'admin1': 'id_uf_15'} == old:
		    return ('sa.br.pa')
		elif {'continent': 'south_america', 'country': 'br', 'admin1': 'id_uf_16'} == old:
		    return ('sa.br.ap')
		elif {'continent': 'south_america', 'country': 'br', 'admin1': 'id_uf_23'} == old:
		    return ('sa.br.ce')
		elif {'continent': 'south_america', 'country': 'br', 'admin1': 'id_uf_26'} == old:
		    return ('sa.br.pe')
		elif {'continent': 'south_america', 'country': 'br', 'admin1': 'id_uf_29'} == old:
		    return ('sa.br.ba')
		elif {'continent': 'south_america', 'country': 'br', 'admin1': 'id_uf_31'} == old:
		    return ('sa.br.mg')
		elif {'continent': 'south_america', 'country': 'br', 'admin1': 'id_uf_33'} == old:
		    return ('sa.br.rj')
		elif {'continent': 'south_america', 'country': 'br', 'admin1': 'id_uf_35'} == old:
		    return ('sa.br.sp')
		elif {'continent': 'south_america', 'country': 'br', 'admin1': 'id_uf_41'} == old:
		    return ('sa.br.pr')
		elif {'continent': 'south_america', 'country': 'br', 'admin1': 'id_uf_43'} == old:
		    return ('sa.br.rs')
		elif {'continent': 'south_america', 'country': 'br', 'admin1': 'id_uf_53'} == old:
		    return ('sa.br.df')
		else:
			plpy.warning(sc_list)
			plpy.warning(len(old))
			raise Exception(old)
	return json.dumps([old2new(r) for r in sc_list] )
$$ LANGUAGE plpython3u;

BEGIN

select 
	extras::json ->> 'spatial_coverage',
	pg_temp.migrate_sc(extras::json -> 'spatial_coverage'),
	extras::jsonb || jsonb_build_object('spatial_coverage', 	pg_temp.migrate_sc(extras::json -> 'spatial_coverage'))
from resource;

update resource 
set extras = extras::jsonb || jsonb_build_object('spatial_coverage', pg_temp.migrate_sc(extras::json -> 'spatial_coverage'));

select extras
from resource;

ROLLBACK
