/**
 * Supabase Database Connection Configuration
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from root .env file
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

let supabase: SupabaseClient | null = null;

export const connectDatabase = async (): Promise<SupabaseClient | null> => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.warn('⚠️  Supabase credentials not configured. Interview features will be disabled.');
      console.warn('   Set SUPABASE_URL and SUPABASE_ANON_KEY in .env to enable interview features.');
      return null;
    }

    supabase = createClient(supabaseUrl, supabaseKey);

    // Test connection by attempting a simple query
    const { error } = await supabase.from('interview_sessions').select('count').limit(1);
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = table is empty, which is fine
      throw error;
    }

    console.log('✅ Supabase connected successfully');
    console.log(`📊 Project: ${supabaseUrl}`);
    return supabase;
  } catch (error: any) {
    console.error('❌ Supabase connection error:', error.message);
    console.warn('⚠️  Interview features will be disabled. Chatbot will still work.');
    return null;
  }
};

export const getSupabaseClient = (): SupabaseClient | null => {
  return supabase;
};

