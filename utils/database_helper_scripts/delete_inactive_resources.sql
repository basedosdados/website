--select * from package where state = 'deleted';
select count(*) from resource where state = 'deleted';
begin;
delete from resource where state = 'deleted';
select id from resource where state = 'deleted';
commit;