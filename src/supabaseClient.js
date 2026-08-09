// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gmnqczxvmtwzcucghvzd.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtbnFjenh2bXR3emN1Y2dodnpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMTIwNjksImV4cCI6MjA5Mzg4ODA2OX0.Ybu5mrycY8phekDYdu20IZnpj_0G05gPIEFN52fgBgg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey)