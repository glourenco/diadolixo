import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      cities: {
        Row: {
          id: string;
          name: string;
          name_pt: string;
          name_en: string;
          name_es: string;
          country_code: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          name_pt: string;
          name_en: string;
          name_es: string;
          country_code?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          name_pt?: string;
          name_en?: string;
          name_es?: string;
          country_code?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      zones: {
        Row: {
          id: string;
          city_id: string;
          name: string;
          name_pt: string;
          name_en: string;
          name_es: string;
          circuit_code: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          city_id: string;
          name: string;
          name_pt: string;
          name_en: string;
          name_es: string;
          circuit_code?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          city_id?: string;
          name?: string;
          name_pt?: string;
          name_en?: string;
          name_es?: string;
          circuit_code?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      garbage_types: {
        Row: {
          id: string;
          code: string;
          name_pt: string;
          name_en: string;
          name_es: string;
          color_hex: string;
          icon: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name_pt: string;
          name_en: string;
          name_es: string;
          color_hex: string;
          icon: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          name_pt?: string;
          name_en?: string;
          name_es?: string;
          color_hex?: string;
          icon?: string;
          created_at?: string;
        };
      };
      collection_schedules: {
        Row: {
          id: string;
          zone_id: string;
          garbage_type_id: string;
          day_of_week: number;
          week_interval: number;
          start_date: string;
          end_date: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          zone_id: string;
          garbage_type_id: string;
          day_of_week: number;
          week_interval?: number;
          start_date: string;
          end_date?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          zone_id?: string;
          garbage_type_id?: string;
          day_of_week?: number;
          week_interval?: number;
          start_date?: string;
          end_date?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      device_tokens: {
        Row: {
          id: string;
          token: string;
          device_id: string | null;
          user_id: string | null;
          zone_id: string;
          notifications_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          token: string;
          device_id?: string | null;
          user_id?: string | null;
          zone_id: string;
          notifications_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          token?: string;
          device_id?: string | null;
          user_id?: string | null;
          zone_id?: string;
          notifications_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      notification_schedules: {
        Row: {
          id: string;
          device_token_id: string;
          garbage_type_id: string;
          scheduled_date: string;
          notification_date: string;
          expo_notification_id: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          device_token_id: string;
          garbage_type_id: string;
          scheduled_date: string;
          notification_date: string;
          expo_notification_id?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          device_token_id?: string;
          garbage_type_id?: string;
          scheduled_date?: string;
          notification_date?: string;
          expo_notification_id?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
