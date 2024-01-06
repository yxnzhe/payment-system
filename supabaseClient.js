import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "", // TODO: Add Supabase URL
  "" // TODO: Add ANON Key
);

export const storage = createClient(
  "", // TODO: Add Supabase URL
  "" // TODO: Add ANON Key
);
