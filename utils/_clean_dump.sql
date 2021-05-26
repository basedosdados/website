begin;

    drop table if exists stats; create temp table stats as
    select table_schema,
           table_name,
           (xpath('/row/cnt/text()', xml_count))[1]::text::int as row_count
    from (
      select table_name, table_schema,
             query_to_xml(format('select count(*) as cnt from %I.%I', table_schema, table_name), false, true, '') as xml_count
      from information_schema.tables
      where table_schema = 'public' --<< change here for the schema you want
    ) t
    order by row_count DESC;


---------- START
DO $$ -- Delete all tables with '_' prefix
DECLARE _tbl text;
BEGIN
FOR _tbl  IN
    SELECT quote_ident(table_schema) || '.'
        || quote_ident(table_name)      -- escape identifier and schema-qualify!
    FROM   information_schema.tables
    WHERE  table_name LIKE '\_' || '%'  -- your table name prefix
    AND    table_schema NOT LIKE 'pg\_%'    -- exclude system schemas
    AND    table_name NOT LIKE '\_pg\_%'    -- exclude system schemas
LOOP
 -- RAISE NOTICE '%',
   EXECUTE
  'DROP TABLE ' || _tbl;
END LOOP;
END $$;

    drop table if exists chosen_user; create temp table chosen_user as
        select id from "user" where name in ('ckan', 'rdahis');
    drop table if exists chosen_pack; create temp table chosen_pack as
        select id from package where creator_user_id in (select id from chosen_user)
        order by metadata_modified desc LIMIT 100; -- Number of datasets to keep
    drop table if exists chosen_pack_extra; create temp table chosen_pack_extra as
        select id from package_extra where package_id in (select * from chosen_pack) ;

    TRUNCATE api_token;

    DELETE FROM tracking_summary
    WHERE ctid not IN (
        SELECT ctid
        FROM tracking_summary
        ORDER BY tracking_date DESC
        LIMIT 300
    );
    DELETE FROM tracking_raw
    WHERE ctid not IN (
        SELECT ctid
        FROM tracking_raw
        ORDER BY access_timestamp DESC
        LIMIT 300
    );
    DELETE FROM activity_detail
    WHERE (object_type = 'PackageExtra' and object_id not IN (
        SELECT * from chosen_pack_extra
    )) or
    (object_type = 'Tag' and "data"::json->'package'->>'id' not IN (
        SELECT * from chosen_pack
    ))
    ;

    DELETE FROM package_revision WHERE id not IN ( SELECT * FROM chosen_pack);
    DELETE FROM package_extra_revision WHERE id not IN ( SELECT * FROM chosen_pack_extra);
    DELETE FROM package_extra WHERE id not IN ( SELECT * FROM chosen_pack_extra);
    DELETE FROM package_tag_revision WHERE package_id not IN ( SELECT * FROM chosen_pack);
    DELETE FROM package_tag WHERE package_id not IN ( SELECT * FROM chosen_pack);
    DELETE FROM package WHERE id not IN ( SELECT * FROM chosen_pack);
    DELETE FROM "user" WHERE id not IN ( SELECT * FROM chosen_user);
    UPDATE "user" SET apikey='', password='', email='';
    DELETE FROM "member" where table_id not in (
            select * FROM chosen_user union select * FROM chosen_pack);
    DELETE FROM "member_revision" where table_id not in (
            select * FROM chosen_user union select * FROM chosen_pack);
    DELETE FROM resource_revision where package_id not in (select * FROM chosen_pack);
    DELETE FROM resource where package_id not in (select * FROM chosen_pack);

    DELETE FROM revision
    WHERE id not IN (
        select revision_id from package_extra_revision UNION
        select revision_id from member_revision UNION
        select revision_id from group_revision UNION
        select revision_id from package_tag_revision UNION
        select revision_id from resource_revision UNION
        select revision_id from package_revision UNION
        select revision_id from system_info_revision UNION
        select revision_id from group_extra_revision UNION
        select revision_id from package_relationship_revision
    );

drop table if exists kill_act; create temp table kill_act as
    select id FROM activity
    where activity_type ilike '%package%' and
    data::json->'package'->>'id' not in (
        select * FROM chosen_pack
    );
    delete FROM activity_detail where activity_id in (select * FROM kill_act);
    delete FROM activity where id in (select * FROM kill_act);


----- RELATORIO

    drop table if exists stats2; create temp table stats2 as
    select table_schema,
           table_name,
           row_count as row_count_old,
           (xpath('/row/cnt/text()', xml_count))[1]::text::int as row_count_new
    FROM (
      select table_name, table_schema,
             query_to_xml(format('select count(*) as cnt FROM %I.%I', table_schema, table_name), false, true, '') as xml_count
      FROM information_schema.tables
      where table_schema = 'public'
    ) t
    join stats using(table_schema, table_name)
    order by row_count_new DESC;
    select * FROM stats2;
    select sum(row_count_old) old_n_of_rows, sum(row_count_new) new_n_of_rows FROM stats2;

commit;
