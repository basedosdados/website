-- to see changes run:
--  docker-compose run --rm ckan ckan search-index rebuild

--Perform or restore backup

-- SETUP_BACKUP
DO $$ BEGIN
	-- Create backup tables
	IF (SELECT to_regclass('public._backup_package') IS NULL) THEN
		CREATE TABLE public._backup_package AS SELECT * FROM package;
	END IF;
	IF (SELECT to_regclass('public._backup_package_extra') IS NULL) THEN
		CREATE TABLE public._backup_package_extra AS SELECT * FROM package_extra;
	END IF;
	IF (SELECT to_regclass('public._backup_resource') IS NULL) THEN
		CREATE TABLE public._backup_resource AS SELECT * FROM resource;
	END IF;
	IF (
		SELECT BOOL_OR(b.id IS NULL OR p.id IS NULL) FROM _backup_package b FULL JOIN package p using(id)
	) THEN
		RAISE 'backup table exists and has different packages, please check manually';
	END IF;
	IF (
		SELECT BOOL_OR(b.id IS NULL OR r.id IS NULL) FROM _backup_resource b FULL JOIN resource r using(id)
	) THEN
		RAISE 'backup table exists and has different resources, please check manually';
	END IF;
END $$;

-- RESTORE_FROM_BACKUP
	INSERT INTO package  (SELECT * FROM _backup_package)  ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, title = EXCLUDED.title, version = EXCLUDED.version, url = EXCLUDED.url, notes = EXCLUDED.notes, license_id = EXCLUDED.license_id, author = EXCLUDED.author, author_email = EXCLUDED.author_email, maintainer = EXCLUDED.maintainer, maintainer_email = EXCLUDED.maintainer_email, state = EXCLUDED.state, type = EXCLUDED.type, owner_org = EXCLUDED.owner_org, private = EXCLUDED.private, metadata_modified = EXCLUDED.metadata_modified, creator_user_id = EXCLUDED.creator_user_id, metadata_created = EXCLUDED.metadata_created;
	INSERT INTO resource (SELECT * FROM _backup_resource) ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url, format = EXCLUDED.format, description = EXCLUDED.description, position = EXCLUDED.position, hash = EXCLUDED.hash, state = EXCLUDED.state, extras = EXCLUDED.extras, name = EXCLUDED.name, resource_type = EXCLUDED.resource_type, mimetype = EXCLUDED.mimetype, mimetype_inner = EXCLUDED.mimetype_inner, size = EXCLUDED.size, last_modified = EXCLUDED.last_modified, cache_url = EXCLUDED.cache_url, cache_last_updated = EXCLUDED.cache_last_updated, webstore_url = EXCLUDED.webstore_url, webstore_last_updated = EXCLUDED.webstore_last_updated, created = EXCLUDED.created, url_type = EXCLUDED.url_type, package_id = EXCLUDED.package_id, metadata_modified = EXCLUDED.metadata_modified;
	INSERT INTO package_extra (SELECT * FROM _backup_package_extra) ON CONFLICT (id) DO UPDATE SET package_id = EXCLUDED.package_id, key = EXCLUDED.key, value = EXCLUDED.value, state = EXCLUDED.state;

-- End of backup

-- Load python
CREATE EXTENSION IF NOT EXISTS plpython3u;

-- Temp functions definition
CREATE OR REPLACE FUNCTION pg_temp.translate_languages(languages_array text) RETURNS json AS $$
    if languages_array is None: return
    import json
    FROM_TO = {"ingles": "english", "portugues": "portuguese", "espanhol": "spanish"
            ,"alemao": "german", "arabe": "arabic", "russo": "russian", "chines": "chinese"
            ,"frances": "french", "japones": "japanese", "bahasa": "bahasa", "hindi": "hindi"
    }
    array = json.loads(languages_array)
    return json.dumps([FROM_TO[l] for l in array])
$$ LANGUAGE plpython3u;

CREATE OR REPLACE FUNCTION pg_temp.translate_times(times_array text) RETURNS json AS $$
    if times_array is None: return
    import json
    FROM_TO =  {"pre_1999": "CHECK", "atual": "CHECK", "vazio": "CHECK"}
    return json.dumps([FROM_TO.get(l, l) for l in json.loads(times_array)])
$$ LANGUAGE plpython3u;

CREATE OR REPLACE FUNCTION pg_temp.translate_boolean(bool text) RETURNS text AS $$
    if bool is None: return
    return {'sim': 'yes', 'nao': 'no'}[bool]
$$ LANGUAGE plpython3u;

CREATE OR REPLACE FUNCTION pg_temp.translate_time_unit(t text) RETURNS text AS $$
    if not t: return None
    return {'segundos': 'second', 'minuto': 'minute', 'horas': 'hour', 'dois_anos': 'two_years',
    'dia': 'day', 'semana': 'week', 'mes': 'month', 'trimestre': 'quarter',
    'semestre': 'semester', 'ano': 'one_year', 'tres_anos': 'three_years',
    'quatro_anos': 'four_years', 'cinco_anos': 'five_years', 'dez_anos': 'ten_years',
    'recorrente': 'recurring', 'sem_atualizacao': 'unique', 'vazio': 'empty',
    'outro': 'other'
}[t]
$$ LANGUAGE plpython3u;

-- Start of migration script

-- Show package extras for reference
SELECT package_id, jsonb_object_agg(pe.key, value) AS package_extras FROM package_extra pe GROUP BY package_id;


update resource
set resource_type =
	case when 
			( extras::json->'is_bdm' IS NOT NULL 
			AND extras::json->>'is_bdm' != '[]'
			) OR (
			extras::json->>'formato' = 'bd+'
			)
	then 
		'bdm_table'
	else 
		'external_link'
	end
;

WITH p AS (
	SELECT	*
	FROM
		package p
	JOIN (
		SELECT
			package_id,
			jsonb_object_agg(pe.key, value) AS package_extras
		FROM
			package_extra pe
		GROUP BY
			package_id
	) pe ON pe.package_id = p.id
)

UPDATE
	resource
SET
	extras = extras::jsonb || jsonb_build_object(
-- describe metadata as `key, value`
			'is_bdm',                   NULL
			,'table_id',                case when resource_type = 'bdm_table' then resource.name else NULL end
			,'language',                case when resource_type = 'external_link' then pg_temp.translate_languages(package_extras->>'idioma') else NULL end
			,'description',             case when extras::jsonb->>'descricao' != '' then extras::jsonb->>'descricao' else '' END
			,'descricao',               NULL
			,'spatial_coverage',        package_extras->>'regiao'
			,'temporal_coverage',       pg_temp.translate_times(package_extras->>'ano')
			,'update_frequency',        pg_temp.translate_time_unit(package_extras->>'periodicidade')
			,'free',                    case when resource_type = 'external_link' then pg_temp.translate_boolean(package_extras->>'gratis') else NULL end
			,'brazilian_ip',            case when resource_type = 'external_link' then pg_temp.translate_boolean(package_extras->>'ip_brasileiro') else NULL end
			,'has_api',                 case when resource_type = 'external_link' then pg_temp.translate_boolean(package_extras->>'api') else NULL end
			,'license_type',            case when resource_type = 'external_link' then 'CHECK' else NULL end
			,'signup_needed',           case when resource_type = 'external_link' then pg_temp.translate_boolean(package_extras->>'registro') else NULL end
			,'version',                 package_extras->>'versao'
			,'availability',            case when resource_type = 'external_link' then package_extras->>'disponibilidade' else NULL END
	)
		
	-- Remove basedosdados urls on bd+ resources
			/*
			 * {"ano": " \"2020\"]", "api": "sim", "pais": "vazio",
			 *  "autor": "", "coleta": "administrativo", "estado": "vazio",
			 *  "gratis": "sim", "idioma": "[\"ingles\"]",
			 *  "regiao": "internacional", "versao": "", "registro": "nao",
			 *  "mantenedor": "", "microdados": "sim", "autor_email": "",
			 *  "download_type": "Link Externo", "ip_brasileiro": "nao",
			 *  "periodicidade": "recorrente", "disponibilidade": "online",
			 *  "mantenedor_email": "", "nivel_observacao": "[\"convenio\"]"}
			 * 
			 */ 
	,url = CASE WHEN resource.url LIKE '%basedosdados.github.io%'
			THEN '' -- URL must be NULL string ON this DATABASE design
			ELSE resource.url END
			
FROM p WHERE p.id = resource.package_id
;

-- Remove nulls
UPDATE resource SET extras = jsonb_strip_nulls(extras::jsonb);
UPDATE package SET owner_org = COALESCE(owner_org, '3626e93d-165f-42b8-bde1-2e0972079694'); -- sending to basedosdados org any package without org
SELECT * FROM resource JOIN package ON package.id = resource.package_id 
LIMIT 100000 ;
