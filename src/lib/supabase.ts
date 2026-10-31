/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export enum OperationType {
  GET = 'fetch',
  ADD = 'insert',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'fetch-list',
}

export const handleSupabaseError = (error: any, operation: OperationType, context: string) => {
  console.error(`Supabase Error during ${operation} ${context}:`, error);
  // Optional: add toast or global error handling here
};
