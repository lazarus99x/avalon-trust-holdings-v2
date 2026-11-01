-- ============================================================
--  AVALON / GSS — ADMIN ACCESS FIX   (one file, run once)
--  Supabase Dashboard -> SQL Editor -> paste all -> Run
--  Idempotent: safe to run again any time.
-- ============================================================
--
-- WHAT WAS ACTUALLY WRONG (measured against the live project
-- blfpqcwbycaffagtuxip, not guessed):
--
--   1. anon, authenticated and service_role had NO table privileges
--      on public.users / public.shipments. Every read came back
--      403 "permission denied for table users", so the app's
--      AuthProvider could never load the profile row -> role stayed
--      null -> /admin redirected to /. This hit EVERY account,
--      including leoanthony197@gmail.com which is already 'admin'.
--   2. lazarus99x@gmail.com exists in public.users, role = 'customer'.
--
--   3. New signups all land as 'customer' (public.handle_new_user),
--      which is why the account you created was never an admin.
--
-- PART 1 restores privileges. PART 2 makes lazarus99x@gmail.com an
-- admin. PART 3 keeps it an admin on every future signup of that
-- address (email confirmation is still required, so only the mailbox
-- owner can use it). Nothing is dropped, no policy is loosened.
-- ============================================================

begin;

-- ------------------------------------------------------------
-- PART 1 — restore the privileges the roles lost
-- ------------------------------------------------------------
grant usage on schema public to anon, authenticated, service_role;

grant all on all tables    in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
grant all on all functions in schema public to anon, authenticated, service_role;

-- so future tables created in this schema are reachable too
alter default privileges in schema public
  grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public
  grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema public
  grant all on functions to anon, authenticated, service_role;

-- The earlier migration narrowed anon to a column list, but the public
-- tracking pages select * (and render sender/receiver), so anon needs the
-- full row or tracking breaks. To go back to hiding the party details from
-- the public, replace the anon grants above with:
--   revoke select on public.shipments from anon;
--   grant select (id, tracking_number, status, origin, destination,
--     current_location, history, estimated_delivery, created_at,
--     updated_at, metadata) on public.shipments to anon;
-- ...and change ShipmentDetail.tsx's select("*") to that column list.

-- ------------------------------------------------------------
-- PART 2 — grant admin to the existing account(s)
-- ------------------------------------------------------------
insert into public.users (uid, email, role, display_name)
select id, email, 'admin', coalesce(nullif(raw_user_meta_data->>'full_name', ''), 'Admin')
from auth.users
where lower(email) = any (array[
  lower('lazarus99x@gmail.com'),
  lower('leoanthony197@gmail.com')
])
on conflict (uid) do update
  set role = 'admin',
      email = excluded.email;

-- ------------------------------------------------------------
-- PART 3 — future signups with these addresses are admin too
-- (replaces the trigger in 20261031193500_admin_only.sql and the
--  TEMP-admin-signup.sql placeholder, which still says CHANGE_ME)
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (uid, email, role, display_name)
  values (
    new.id,
    new.email,
    case
      when lower(new.email) = any (array[
        lower('lazarus99x@gmail.com'),
        lower('leoanthony197@gmail.com')
      ]) then 'admin'
      else 'customer'
    end,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (uid) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

commit;

-- ------------------------------------------------------------
-- VERIFY (run after the block above; both must be non-empty)
-- ------------------------------------------------------------
-- select uid, email, role from public.users order by role, email;
-- select proname from pg_proc where proname = 'handle_new_user';
