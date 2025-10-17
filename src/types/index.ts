export interface City {
  id: string;
  name: string;
  name_pt: string;
  name_en: string;
  name_es: string;
  country_code: string;
}

export interface Zone {
  id: string;
  city_id: string;
  name: string;
  name_pt: string;
  name_en: string;
  name_es: string;
  circuit_code: string | null;
}

export interface GarbageType {
  id: string;
  code: string;
  name_pt: string;
  name_en: string;
  name_es: string;
  color_hex: string;
  icon: string;
}

export interface CollectionSchedule {
  id: string;
  zone_id: string;
  garbage_type_id: string;
  day_of_week: number;
  week_interval: number;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
}

export interface CollectionDay {
  date: Date;
  garbageTypes: GarbageType[];
}

export interface WeeklyCollection {
  week: Date[];
  collections: CollectionDay[];
}

