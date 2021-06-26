INSERT INTO public.api_token (id,"name",user_id,created_at)
SELECT
    '5ELrpuTWFQ1z1mp0aa9F3MjZlfyAmJFgzaPFHalSMx4yLQy_Tvrc8tntXMySgxyKMbRJeMdkxSCpzu8A',
    'dev token',
    (select id from public."user" where name='dev'),
    '2021-05-16 00:03:14.235'
;
