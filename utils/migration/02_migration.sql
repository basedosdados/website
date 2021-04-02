-- to see changes run:
--  docker-compose run --rm ckan ckan search-index rebuild
begin;

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

commit;