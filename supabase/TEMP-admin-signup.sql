-- ============================================================
-- TEMPORARY. Run this ONLY while creating the new admin account.
-- Then immediately run TEMP-admin-signup-REVERT.sql.
--
-- STEP 1: replace the email below with the exact address you will
--         sign up with at /admin-signup.
-- STEP 2: run this file in Supabase -> SQL Editor.
-- STEP 3: sign up, confirm the email, log in. The account is admin.
-- STEP 4: run TEMP-admin-signup-REVERT.sql.   <-- do not skip
--
-- Why this is needed: a browser cannot grant itself role='admin'
-- (RLS forbids it), so the promotion has to happen in the DB at
-- signup time. Only the one address below is promoted - everyone
-- else still lands as 'customer'.
-- ============================================================

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
        lower('CHANGE_ME@example.com')   -- <-- put your new admin email here
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
