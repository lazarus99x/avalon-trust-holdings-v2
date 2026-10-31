// Create (or repair) an admin account: auth user + public.users row with role='admin'.
//
// Usage:
//   node scripts/create-admin.mjs --list
//   node scripts/create-admin.mjs <email> <password>
//
// Needs a Supabase SERVICE ROLE key in .env (server-side only, never VITE_/NEXT_PUBLIC_):
//   SUPABASE_SERVICE_ROLE_KEY=<service role key>
//
// Falls back to .env.production for VITE_SUPABASE_URL so you do not have to duplicate it.
// The password is taken from argv only. Nothing is written to disk.

import dotenv from "dotenv";
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.production" });

import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing SUPABASE_URL / VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env",
  );
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const [, , arg1, arg2] = process.argv;

// --- --list : show every auth user and whether it has a public.users row ---
if (arg1 === "--list") {
  const { data: list, error } = await admin.auth.admin.listUsers({
    perPage: 1000,
  });
  if (error) {
    console.error("listUsers failed:", error.message);
    process.exit(1);
  }
  const { data: rows } = await admin.from("users").select("uid, email, role");

  for (const u of list.users) {
    const row = rows?.find((r) => r.uid === u.id);
    console.log(
      [
        u.email,
        `confirmed=${!!u.email_confirmed_at}`,
        `users_row=${row ? row.role : "MISSING"}`,
      ].join("  |  "),
    );
  }
  console.log(
    `\n${list.users.length} auth user(s), ${rows?.length ?? 0} public.users row(s).`,
  );
  process.exit(0);
}

// --- create / repair ---
if (!arg1 || !arg2) {
  console.error(
    "Usage: node scripts/create-admin.mjs Leoanthony197@gmail.com Ejovwoke12@",
  );
  console.error("       node scripts/create-admin.mjs --list");
  process.exit(1);
}

const email = arg1;
const password = arg2;

const { data: created, error: createErr } = await admin.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});

let userId = created?.user?.id;

if (createErr) {
  // Already exists -> find it and just reset the password + confirm.
  const { data: list } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const existing = list?.users.find(
    (u) => u.email?.toLowerCase() === email.toLowerCase(),
  );
  if (!existing) {
    console.error("createUser failed:", createErr.message);
    process.exit(1);
  }
  const { error: updErr } = await admin.auth.admin.updateUserById(existing.id, {
    password,
    email_confirm: true,
  });
  if (updErr) {
    console.error("updateUserById failed:", updErr.message);
    process.exit(1);
  }
  userId = existing.id;
  console.log(`Auth user already existed; password reset + email confirmed.`);
}

// The users row is written with the service role, so it is not subject to RLS.
const { error: rowErr } = await admin
  .from("users")
  .upsert({ uid: userId, email, role: "admin" }, { onConflict: "uid" });

if (rowErr) {
  console.error("users row upsert failed:", rowErr.message);
  process.exit(1);
}

console.log(
  `Admin ready: ${email} (uid ${userId}) — auth confirmed, public.users.role = 'admin'.`,
);
