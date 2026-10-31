// Reset the Avalon Trust Holdings admin password.
// Usage:  node scripts/reset-admin.mjs "<NEW_PASSWORD>"
//
// - Takes the password from the command line argument ONLY. Nothing is written to disk.
// - Needs a Supabase SERVICE ROLE key (server-side only, never VITE_/NEXT_PUBLIC_).
//   Add to .env (which is gitignored):   SUPABASE_SERVICE_ROLE_KEY=<service role key>
//
//   SAFE-ISH: also reads ADMIN_EMAIL to override the default admin address.

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'Leoanthony197@gmail.com';
const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/reset-admin.mjs "<NEW_PASSWORD>"');
  process.exit(1);
}
if (!url || !serviceKey) {
  console.error('Missing SUPABASE_URL (or VITE_SUPABASE_URL) / SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: list, error: listErr } = await admin.auth.admin.listUsers({ perPage: 1000 });
if (listErr) {
  console.error('listUsers failed:', listErr.message);
  process.exit(1);
}

const user = list.users.find((u) => u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase());
if (!user) {
  console.error(`No auth user found for ${ADMIN_EMAIL}`);
  process.exit(1);
}

const { error } = await admin.auth.admin.updateUserById(user.id, {
  password,
  email_confirm: true,
});
if (error) {
  console.error('updateUserById failed:', error.message);
  process.exit(1);
}

console.log(`Done: password reset and email confirmed for ${ADMIN_EMAIL} (uid ${user.id}).`);
