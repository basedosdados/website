-- Load python
 CREATE EXTENSION IF NOT EXISTS plpython3u;

-- Temp functions definition
CREATE OR REPLACE FUNCTION pg_temp.migrate_sc(sc_list_str json, debug_info text) RETURNS json AS $$
	if sc_list_str == 'null' or not sc_list_str: return None
	import json
	sc_list = json.loads(sc_list_str)
	if sc_list in ([], [{}], [{'country': None, 'continent': None}]):
		return '["world"]'
	CONTINENTS  = {
	'asia': 'as',
	'europe': 'eu',
	'north_america': 'na',
	'oceania': 'oc',
	'south_america': 'sa',
	'africa': 'af',
	}
	def old2new(old):
		if {'continent': 'north_america'} == old:
		    return ('na')
		elif {'continent': 'asia', 'country': 'ru'} == old:
		    return 'eu.ru' 
		elif {'continent': 'south_america'} == old:
		    return ('sa')
		elif {'continent': 'africa'} == old:
		    return ('af')
		elif {'continent': 'asia'} == old:
		    return ('as')
		elif {'continent': 'europe'} == old:
		    return ('eu')
		elif {'continent': 'south_america', 'country': 'br'} == old:
		    return ('sa.br')
		elif old.get('continent') == 'south_america' and old.get('country') == 'br':
			admin1 = old['admin1']
			uf = int(admin1[-2:])
			return 'sa.br.' + {
				11: 'ro',
				12: 'ac',
				13: 'am',
				14: 'rr',
				15: 'pa',
				16: 'ap',
				17: 'to',
				21: 'ma',
				22: 'pi',
				23: 'ce',
				24: 'rn',
				25: 'pb',
				26: 'pe',
				27: 'al',
				28: 'se',
				29: 'ba',
				31: 'mg',
				32: 'es',
				33: 'rj',
				35: 'sp',
				41: 'pr',
				42: 'sc',
				43: 'rs',
				50: 'ms',
				51: 'mt',
				52: 'go',
				53: 'df',
			}[uf]
		elif old.get('continent') in (CONTINENTS) and 'country' in old:
			return CONTINENTS[old['continent']] + '.' + old['country']
		else:
			plpy.warning(sc_list)
			plpy.warning("debug info: " + debug_info)
			plpy.warning(len(old))
			raise Exception(old)
	return json.dumps([old2new(r) for r in sc_list] )
$$ LANGUAGE plpython3u;

begin;

select 
	extras::json ->> 'spatial_coverage',
	pg_temp.migrate_sc(extras::json -> 'spatial_coverage', extras),
	extras::jsonb || jsonb_build_object('spatial_coverage',
			pg_temp.migrate_sc(extras::json -> 'spatial_coverage', ''))
from resource;

update resource 
set extras = extras::jsonb || jsonb_build_object('spatial_coverage',
		pg_temp.migrate_sc(extras::json -> 'spatial_coverage', extras));

select extras
from resource;

--rollback;
commit;
