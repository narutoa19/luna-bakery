import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  const msg = "Missing Supabase environment variables. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.";
  if (typeof window !== "undefined") {
    console.error(msg);
  } else {
    throw new Error(msg);
  }
}

// Client-side (anon key, RLS-enforced)
export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

// Server-side (service role, bypasses RLS)
export const supabaseAdmin = serviceRoleKey
  ? createClient(supabaseUrl!, serviceRoleKey)
  : createClient(supabaseUrl!, supabaseAnonKey!);
