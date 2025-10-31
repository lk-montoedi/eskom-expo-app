import { createClient } from '@supabase/supabase-js';

const { SUPABASE_URL, SUPABASE_KEY } = process.env;
const supabaseUrl = SUPABASE_URL; // replace with your project URL
const supabaseKey = SUPABASE_KEY; // use service role key (secure for backend)

export const supabase = createClient(supabaseUrl, supabaseKey);
