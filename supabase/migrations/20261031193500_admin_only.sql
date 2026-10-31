-- ============================================================
-- Admin-only access. Roles live in public.users and are enforced
-- by RLS. Nothing trusts user_metadata or client-side flags.
-- ============================================================

begin;

-- ------------------------------------------------------------
-- 1. Helpers (SECURITY DEFINER = bypass RLS, so no recursion)
-- ------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.users
    where uid = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.current_user_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role from public.users where uid = auth.uid();
$$;

revoke all on function public.is_admin() from public;
revoke all on function public.current_user_role() from public;
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.current_user_role() to authenticated;

-- ------------------------------------------------------------
-- 2. public.users
--    - admin: full CRUD
--    - signed-in user: read own row, may create own row as
--      'customer', may update own row but NEVER change own role
-- ------------------------------------------------------------
alter table public.users enable row level security;

drop policy if exists "Users can read their own profile" on public.users;
drop policy if exists "Admins can read all profiles" on public.users;
drop policy if exists "Users can insert their own profile" on public.users;
drop policy if exists "Users can update their own profile" on public.users;
drop policy if exists "admin_all_users" on public.users;
drop policy if exists "self_read_users" on public.users;
drop policy if exists "self_insert_users" on public.users;
drop policy if exists "self_update_users" on public.users;

create policy "admin_all_users" on public.users
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "self_read_users" on public.users
  for select to authenticated
  using (auth.uid() = uid);

create policy "self_insert_users" on public.users
  for insert to authenticated
  with check (auth.uid() = uid and role = 'customer');

create policy "self_update_users" on public.users
  for update to authenticated
  using (auth.uid() = uid)
  with check (auth.uid() = uid and role = public.current_user_role());

-- ------------------------------------------------------------
-- 3. public.shipments (the tracking data)
--    - everyone (anon + authenticated): SELECT only, no write
--    - admin: full CRUD
-- ------------------------------------------------------------
alter table public.shipments enable row level security;

drop policy if exists "Everyone can read shipments by tracking" on public.shipments;
drop policy if exists "Everyone can read shipments" on public.shipments;
drop policy if exists "Staff can do everything" on public.shipments;
drop policy if exists "Staff can insert shipments" on public.shipments;
drop policy if exists "Staff can update shipments" on public.shipments;
drop policy if exists "Staff can delete shipments" on public.shipments;
drop policy if exists "public_read_shipments" on public.shipments;
drop policy if exists "admin_insert_shipments" on public.shipments;
drop policy if exists "admin_update_shipments" on public.shipments;
drop policy if exists "admin_delete_shipments" on public.shipments;

create policy "public_read_shipments" on public.shipments
  for select to anon, authenticated
  using (true);

create policy "admin_insert_shipments" on public.shipments
  for insert to authenticated
  with check (public.is_admin());

create policy "admin_update_shipments" on public.shipments
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "admin_delete_shipments" on public.shipments
  for delete to authenticated
  using (public.is_admin());

-- Column-level: anon may only read the columns the public tracking
-- pages render. Signed-in admins keep full column access.
revoke select on public.shipments from anon;
grant select (
  id, tracking_number, status, origin, destination,
  current_location, history, estimated_delivery,
  created_at, updated_at, metadata
) on public.shipments to anon;

-- ------------------------------------------------------------
-- 4. Stop auto-promoting by email on signup.
--    New auth users get 'customer'; admins are granted explicitly.
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
    'customer',
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
