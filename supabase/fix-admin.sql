-- Avalon Trust Holdings — fix admin login (Part A)
-- The admin auth user exists in auth.users but has no row in public.users.
-- Public signup is off, so this row must be created explicitly.
--
-- Paste into Supabase → SQL Editor and run.
-- Column names come from supabase.sql: uid, email, role, display_name, photo_url.

insert into public.users (uid, email, role, display_name)
select id, email, 'admin', 'Admin'
from auth.users
where lower(email) = lower('Leoanthony197@gmail.com')
on conflict (uid) do update
  set role = 'admin',
      email = excluded.email;
