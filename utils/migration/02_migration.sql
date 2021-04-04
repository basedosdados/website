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
-- Temp functions definition

CREATE OR REPLACE function pg_temp.rename_key(ext jsonb, from_ text, to_ text) returns jsonb as 
$$
	select ext - from_ || (case when ext ? from_ then jsonb_build_object(to_, ext->from_) else '{}'::jsonb end)
$$ language sql;
CREATE OR REPLACE function pg_temp.replace_value(ext jsonb, key_ text, from_ text, to_ json) returns jsonb as 
$$ 
	select ext || (case when ext ->> key_ = from_ then jsonb_build_object(key_, to_) else '{}'::jsonb end)
$$ language sql;
CREATE OR REPLACE function pg_temp.replace_value(ext jsonb, key_ text, from_ text, to_ int) returns jsonb as 
$$ 
	select pg_temp.replace_value(ext, key_, from_, to_::text::json)
$$ language sql;

-- Start of migration script

update resource 
set resource_type = 
	case when extras::json->>'is_bdm' = '[]' or extras::json->'is_bdm' is null then 
		'external_link' 
	else 
		'bdm_table' 
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
			'language', package_extras->>'idioma'
)
FROM p WHERE p.id = resource.package_id
;

-- Remove nulls
UPDATE resource SET extras = jsonb_strip_nulls(extras::jsonb);
SELECT * FROM resource JOIN package ON package.id = resource.package_id 
LIMIT 10 ;
