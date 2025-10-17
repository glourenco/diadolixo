import { supabase } from '../lib/supabase';
import { City, Zone } from '../types';

export class CityService {
  static async getCities(): Promise<City[]> {
    try {
      const { data: cities, error } = await supabase
        .from('cities')
        .select(`
          id,
          name,
          name_pt,
          name_en,
          name_es,
          country_code,
          zones (
            id,
            city_id,
            name,
            name_pt,
            name_en,
            name_es,
            circuit_code
          )
        `)
        .order('name');

      if (error) throw error;

      return cities || [];
    } catch (error) {
      console.error('Error fetching cities:', error);
      throw error;
    }
  }

  static async getCityById(cityId: string): Promise<City | null> {
    try {
      const { data: city, error } = await supabase
        .from('cities')
        .select(`
          id,
          name,
          name_pt,
          name_en,
          name_es,
          country_code,
          zones (
            id,
            city_id,
            name,
            name_pt,
            name_en,
            name_es,
            circuit_code
          )
        `)
        .eq('id', cityId)
        .single();

      if (error) throw error;

      return city;
    } catch (error) {
      console.error('Error fetching city:', error);
      throw error;
    }
  }

  static async getZoneById(zoneId: string): Promise<Zone | null> {
    try {
      const { data: zone, error } = await supabase
        .from('zones')
        .select(`
          id,
          city_id,
          name,
          name_pt,
          name_en,
          name_es,
          circuit_code
        `)
        .eq('id', zoneId)
        .single();

      if (error) throw error;

      return zone;
    } catch (error) {
      console.error('Error fetching zone:', error);
      throw error;
    }
  }
}
