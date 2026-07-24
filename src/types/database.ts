// GreenVerse Shared Database Type Interfaces
// Standard PostgreSQL / Supabase schema mappings.

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'MAINTENANCE' | 'ADMIN' | 'SUPER_ADMIN' | 'GUEST';
  avatar?: string;
  dept?: string;
  points?: number;
  badge?: string;
}

export interface ActiveStaffLocation {
  id: string;
  user_id: string;
  name: string;
  role: string;
  latitude: number;
  longitude: number;
  status: 'IDLE' | 'EN_ROUTE' | 'WORKING';
  updated_at: string;
}

export interface CampusBuilding {
  id: string;
  name: string;
  code: string;
  latitude: number;
  longitude: number;
  description: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: 'ELECTRICAL' | 'PLUMBING' | 'HVAC' | 'WASTE' | 'OTHER' | 'INFRASTRUCTURE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'RESOLVED';
  location: string;
  latitude: number;
  longitude: number;
  reporter_id: string;
  reporter_name: string;
  assignee_id?: string;
  assignee_name?: string;
  image_url?: string;
  after_image_url?: string;
  voice_url?: string;
  repair_notes?: string;
  verified?: boolean;
  verification_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Sensor {
  id: string;
  name: string;
  type: 'SMART_BIN' | 'SOLAR_PANEL' | 'WATER_TANK' | 'LEAKAGE' | 'ENERGY_METER' | 'AQI' | 'TEMP' | 'HUMIDITY';
  location: string;
  latitude: number;
  longitude: number;
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  last_reading: number;
  battery: number;
  unit: string;
  updated_at: string;
}

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  name: string;
  points: number;
  rank: number;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'DIAMOND';
  updated_at?: string;
}

export interface SystemNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  read: boolean;
  type: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';
  created_at: string;
}
