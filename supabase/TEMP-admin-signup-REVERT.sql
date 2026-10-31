-- Closes the temporary signup window. Run this as soon as the new
-- admin account exists. New signups go back to role = 'customer'.
--
-- This is the same trigger as in supabase/migrations/20261031193500_admin_only.sql.

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
