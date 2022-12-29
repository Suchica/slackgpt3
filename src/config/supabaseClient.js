import { createClient } from "@supabase/supabase-js";
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Create a single supabase client for interacting with our database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
