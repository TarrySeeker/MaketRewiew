
import { createClient } from '@supabase/supabase-js';

// Fallback to avoid build crash if env vars are missing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.info("⚠️ Supabase environment variables are missing. Using fallbacks for build.");
}

export const supabase = createClient(
    supabaseUrl || 'https://your-project.supabase.co',
    supabaseAnonKey || 'your-anon-key'
);
