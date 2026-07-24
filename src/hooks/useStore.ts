// GreenVerse Zustand State Management Store
// Manages global user sessions, tickets, sensor data, notifications, and gamification rewards.

import { create } from 'zustand';
import { supabase } from '../services/supabaseClient';
import type { User, Complaint, Sensor, LeaderboardEntry, SystemNotification, ActiveStaffLocation } from '../types/database';

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

interface AppState {
  user: User | null;
  loading: boolean;
  error: string | null;
  complaints: Complaint[];
  sensors: Sensor[];
  notifications: SystemNotification[];
  leaderboard: LeaderboardEntry[];
  activeStaff: ActiveStaffLocation[];
  sustainability: {
    water_saved: number;
    energy_saved: number;
    carbon_offset: number;
    recycling_rate: number;
    score: number;
  };
  realtimeSubscribed: boolean;
  
  // Actions
  initData: () => Promise<void>;
  setUser: (user: User | null) => void;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (email: string, name: string, role: 'STUDENT' | 'MAINTENANCE', password: string, dept?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  
  // Tickets/Complaints
  fetchComplaints: () => Promise<void>;
  createComplaint: (complaint: Partial<Complaint>) => Promise<Complaint | null>;
  updateComplaintStatus: (id: string, status: Complaint['status'], repairNotes?: string, afterImageUrl?: string) => Promise<void>;
  assignComplaint: (id: string, staffId: string, staffName: string) => Promise<void>;
  verifyComplaint: (id: string, notes?: string) => Promise<void>;
  
  // Sensors
  fetchSensors: () => Promise<void>;
  
  // Notifications
  fetchNotifications: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  
  // Gamification & Rewards
  fetchLeaderboard: () => Promise<void>;
  addPoints: (userId: string, points: number, reason: string) => Promise<void>;
}

const sanitizeUuid = (val?: string | null) => {
  if (!val) return null;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(val) ? val : null;
};

const DEFAULT_SENSORS: Sensor[] = [
  { id: 's-solar-01', name: '250kW Solar Photovoltaic Grid', type: 'SOLAR_PANEL', location: 'Solar Energy Plant', latitude: 26.2008, longitude: 87.3217, status: 'HEALTHY', last_reading: 185.4, battery: 98, unit: 'kW', updated_at: new Date().toISOString() },
  { id: 's-water-01', name: 'Main Overhead Tank Pressure Node', type: 'WATER_TANK', location: 'Water Tank Complex', latitude: 26.2000, longitude: 87.3199, status: 'CRITICAL', last_reading: 34.2, battery: 15, unit: 'PSI', updated_at: new Date().toISOString() },
  { id: 's-water-02', name: 'Boys Hostel Washroom Flow Sensor', type: 'LEAKAGE', location: 'Boys Hostel', latitude: 26.2004, longitude: 87.3209, status: 'CRITICAL', last_reading: 18.5, battery: 42, unit: 'L/min', updated_at: new Date().toISOString() },
  { id: 's-bin-01', name: 'CSE Department Yard Smart Bin', type: 'SMART_BIN', location: 'Computer Science Department Yard', latitude: 26.1996, longitude: 87.3207, status: 'WARNING', last_reading: 94.0, battery: 85, unit: '% Full', updated_at: new Date().toISOString() },
  { id: 's-bin-02', name: 'Canteen Waste Accumulation Bin', type: 'SMART_BIN', location: 'Academic Block', latitude: 26.1991, longitude: 87.3209, status: 'WARNING', last_reading: 88.0, battery: 76, unit: '% Full', updated_at: new Date().toISOString() },
  { id: 's-aqi-01', name: 'Main Gate PM2.5 Air Quality Monitor', type: 'AQI', location: 'Administrative Block', latitude: 26.1986, longitude: 87.3211, status: 'HEALTHY', last_reading: 42.0, battery: 90, unit: 'AQI', updated_at: new Date().toISOString() },
  { id: 's-energy-01', name: 'Library Central Power Meter', type: 'ENERGY_METER', location: 'Central Library', latitude: 26.1992, longitude: 87.3215, status: 'HEALTHY', last_reading: 112.8, battery: 100, unit: 'kWh', updated_at: new Date().toISOString() }
];

const DEFAULT_COMPLAINTS: Complaint[] = [
  {
    id: 'c-01',
    title: 'Water pipe leakage under washbasin sink',
    description: 'Continuous leakage under the ground floor washbasin near Boys Hostel.',
    category: 'PLUMBING',
    priority: 'CRITICAL',
    status: 'PENDING',
    location: 'Boys Hostel Ground Floor',
    latitude: 26.2004,
    longitude: 87.3209,
    reporter_id: 'u-student',
    reporter_name: 'Aarav Singh',
    image_url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'c-02',
    title: 'Smart bin overflowing near CSE Laboratory',
    description: 'Ultrasonic bin level reached 94%. Plastics spilling out.',
    category: 'WASTE',
    priority: 'HIGH',
    status: 'ACCEPTED',
    location: 'Computer Science Department Yard',
    latitude: 26.1996,
    longitude: 87.3207,
    reporter_id: 'u-student-2',
    reporter_name: 'Neha Kumari',
    assignee_id: 'u-staff',
    assignee_name: 'Ramesh Prasad',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    updated_at: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 'c-03',
    title: 'HVAC Ventilation breakdown in Library reading room',
    description: 'Air flow stopped, indoor temperature rising above 34°C.',
    category: 'HVAC',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    location: 'Central Library Ground Floor',
    latitude: 26.1992,
    longitude: 87.3215,
    reporter_id: 'u-student-3',
    reporter_name: 'Suraj Kumar',
    assignee_id: 'u-staff-2',
    assignee_name: 'Manoj Sinha',
    image_url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400',
    created_at: new Date(Date.now() - 14400000).toISOString(),
    updated_at: new Date(Date.now() - 14400000).toISOString()
  }
];

const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  { id: 'l-01', user_id: 'u-student', name: 'Aarav Singh', points: 340, rank: 1, tier: 'GOLD', updated_at: new Date().toISOString() },
  { id: 'l-02', user_id: 'u-student-2', name: 'Neha Kumari', points: 280, rank: 2, tier: 'SILVER', updated_at: new Date().toISOString() },
  { id: 'l-03', user_id: 'u-student-3', name: 'Suraj Kumar', points: 210, rank: 3, tier: 'SILVER', updated_at: new Date().toISOString() },
  { id: 'l-04', user_id: 'u-student-4', name: 'Utkarsh Raj', points: 120, rank: 4, tier: 'BRONZE', updated_at: new Date().toISOString() }
];

const DEFAULT_STAFF: ActiveStaffLocation[] = [
  { id: 's-1', user_id: 'u-staff', name: 'Ramesh Prasad', role: 'Plumber', latitude: 26.1990, longitude: 87.3200, status: 'WORKING', updated_at: new Date().toISOString() },
  { id: 's-2', user_id: 'u-staff-2', name: 'Manoj Sinha', role: 'Electrician', latitude: 26.1998, longitude: 87.3214, status: 'EN_ROUTE', updated_at: new Date().toISOString() },
  { id: 's-3', user_id: 'u-staff-3', name: 'Mohan Singh', role: 'HVAC Tech', latitude: 26.1986, longitude: 87.3211, status: 'IDLE', updated_at: new Date().toISOString() }
];

export const useStore = create<AppState>((set, get) => ({
  user: null,
  loading: false,
  error: null,
  complaints: [],
  sensors: [],
  notifications: [],
  leaderboard: [],
  activeStaff: [],
  sustainability: {
    water_saved: 45200,
    energy_saved: 12400,
    carbon_offset: 9.8,
    recycling_rate: 68,
    score: 82
  },
  realtimeSubscribed: false,
  
  setUser: (user) => set({ user }),
  
  initData: async () => {
    set({ loading: true });
    try {
      // 1. Get current active session
      let currentUser: User | null = null;
      try {
        const sessionStr = sessionStorage.getItem('gv_current_user');
        if (sessionStr) {
          currentUser = JSON.parse(sessionStr);
        }
      } catch (e) {
        console.warn("Session loading error:", e);
      }
      
      // 2. Fetch live data tables from Supabase PostgreSQL
      const { data: cData } = await supabase.from('complaints').select('*').order('created_at', { ascending: false });
      const { data: sData } = await supabase.from('sensors').select('*');
      const { data: lData } = await supabase.from('leaderboard').select('*').order('points', { ascending: false });
      const { data: nData } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
      
      const stats = JSON.parse(localStorage.getItem('gv_sustainability') || '{"water_saved":45200,"energy_saved":12400,"carbon_offset":9.8,"recycling_rate":68,"score":82}');
      
      // Seed fallback values locally and merge with real database for demo sessions
      const localComplaints = JSON.parse(localStorage.getItem('gv_complaints') || '[]');
      let complaintsList = (cData && cData.length > 0) ? [...cData] : [];
      localComplaints.forEach((lc: any) => {
        const existingIdx = complaintsList.findIndex((c: any) => c.id === lc.id);
        if (existingIdx >= 0) complaintsList[existingIdx] = lc; // Local overrides remote for demo
        else complaintsList.push(lc);
      });

      if (complaintsList.length === 0) {
        complaintsList = [...DEFAULT_COMPLAINTS];
        localStorage.setItem('gv_complaints', JSON.stringify(DEFAULT_COMPLAINTS));
      } else {
        localStorage.setItem('gv_complaints', JSON.stringify(complaintsList));
      }
      complaintsList.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      const localSensors = JSON.parse(localStorage.getItem('gv_sensors') || '[]');
      let sensorsList = (sData && sData.length > 0) ? [...sData] : localSensors;
      if (sensorsList.length === 0) {
        sensorsList = [...DEFAULT_SENSORS];
        localStorage.setItem('gv_sensors', JSON.stringify(DEFAULT_SENSORS));
      } else {
        localStorage.setItem('gv_sensors', JSON.stringify(sensorsList));
      }
      
      const localLeaderboard = JSON.parse(localStorage.getItem('gv_leaderboard') || '[]');
      let leaderboardList = (lData && lData.length > 0) ? [...lData] : localLeaderboard;
      if (leaderboardList.length === 0) {
        leaderboardList = [...DEFAULT_LEADERBOARD];
        localStorage.setItem('gv_leaderboard', JSON.stringify(DEFAULT_LEADERBOARD));
      } else {
        localStorage.setItem('gv_leaderboard', JSON.stringify(leaderboardList));
      }
      
      const localNotifications = JSON.parse(localStorage.getItem('gv_notifications') || '[]');
      let notificationsList = (nData && nData.length > 0) ? [...nData] : [];
      localNotifications.forEach((ln: any) => {
        if (!notificationsList.some((n: any) => n.id === ln.id)) notificationsList.push(ln);
      });
      notificationsList.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      let staffList = JSON.parse(localStorage.getItem('gv_active_staff') || '[]');
      if (staffList.length === 0) {
        staffList = [...DEFAULT_STAFF];
        localStorage.setItem('gv_active_staff', JSON.stringify(DEFAULT_STAFF));
      }

      set({
        user: currentUser,
        complaints: complaintsList,
        sensors: sensorsList,
        leaderboard: leaderboardList,
        notifications: notificationsList,
        activeStaff: staffList,
        sustainability: { ...get().sustainability, ...stats },
        loading: false
      });

      // 3. Realtime CDC Database Listeners
      if (!get().realtimeSubscribed) {
        supabase
          .channel('db-complaints')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'complaints' }, (payload: any) => {
            const { eventType, new: newRow, old: oldRow } = payload;
            if (eventType === 'INSERT' && newRow?.id) {
              set((state) => {
                if (state.complaints.some(c => c?.id === newRow.id)) return state;
                return { complaints: [newRow, ...state.complaints] };
              });
            } else if (eventType === 'UPDATE' && newRow?.id) {
              set((state) => ({
                complaints: state.complaints.map(c => c?.id === newRow.id ? newRow : c)
              }));
            } else if (eventType === 'DELETE' && oldRow?.id) {
              set((state) => ({
                complaints: state.complaints.filter(c => c?.id !== oldRow.id)
              }));
            }
          })
          .subscribe();

        supabase
          .channel('db-notifications')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload: any) => {
            const newNotif = payload.new;
            if (newNotif?.id) {
              set((state) => {
                if (state.notifications.some(n => n?.id === newNotif.id)) return state;
                return { notifications: [newNotif, ...state.notifications] };
              });
            }
          })
          .subscribe();

        supabase
          .channel('db-sensors')
          .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sensors' }, (payload: any) => {
            const updatedSensor = payload.new;
            if (updatedSensor?.id) {
              set((state) => ({
                sensors: state.sensors.map(s => s?.id === updatedSensor.id ? updatedSensor : s)
              }));
            }
          })
          .subscribe();
          
        set({ realtimeSubscribed: true });
        
        // Listen to local staff simulation updates
        window.addEventListener('gv_staff_update', ((e: CustomEvent) => {
          set({ activeStaff: e.detail });
        }) as EventListener);
      }
    } catch (err: any) {
      console.warn("Real database fetch failed, running local seeding fallback:", err.message);
      // Fallback
      set({
        complaints: JSON.parse(localStorage.getItem('gv_complaints') || '[]'),
        sensors: JSON.parse(localStorage.getItem('gv_sensors') || '[]'),
        leaderboard: JSON.parse(localStorage.getItem('gv_leaderboard') || '[]'),
        notifications: JSON.parse(localStorage.getItem('gv_notifications') || '[]'),
        activeStaff: JSON.parse(localStorage.getItem('gv_active_staff') || '[]'),
        loading: false
      });
    }
  },
  
  login: async (email: string, password?: string) => {
    set({ loading: true, error: null });
    
    // Default demo passwords as documented in README if none provided (for quick login triggers)
    let selectedPassword = password;
    if (!selectedPassword) {
      selectedPassword = 'Student@2026';
      if (email.toLowerCase() === 'yashkumar2278012@gmail.com') selectedPassword = 'Admin@2026';
      else if (email.toLowerCase().startsWith('staff')) selectedPassword = 'Staff@2026';
      else if (email.toLowerCase().startsWith('guest')) selectedPassword = 'Guest@2026';
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: selectedPassword
      });

      if (error) {
        // Fallback for demo/quick-login accounts
        const demoEmail = email.trim().toLowerCase();
        const demoAccounts: Record<string, User> = {
          'student@spnrec.ac.in': { id: 'u-student', email: 'student@spnrec.ac.in', name: 'Aarav Singh', role: 'STUDENT', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=student', dept: 'Computer Science', points: 120, badge: 'Eco Warrior' },
          'staff@spnrec.ac.in': { id: 'u-staff', email: 'staff@spnrec.ac.in', name: 'Ramesh Prasad', role: 'MAINTENANCE', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=staff', points: 0, badge: 'Technician' },
          'yashkumar2278012@gmail.com': { id: 'u-admin-yash', email: 'yashkumar2278012@gmail.com', name: 'Yash Kumar', role: 'ADMIN', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=yash', points: 0, badge: 'Administrator' },
          'guest@spnrec.ac.in': { id: generateUUID(), email: 'guest@spnrec.ac.in', name: 'Guest Visitor', role: 'GUEST' as any, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=guest', points: 0, badge: 'Visitor' },
        };
        
        const fallbackUser = demoAccounts[demoEmail];
        if (fallbackUser) {
          console.warn('Real Auth failed, falling back to local credentials:', error.message);
          set({ user: fallbackUser, loading: false, error: null });
          sessionStorage.setItem('gv_current_user', JSON.stringify(fallbackUser));
          return true;
        }
        
        set({ error: error.message, loading: false });
        return false;
      }

      // Fetch profile details from profiles table
      const { data: p } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
      const loadedUser: User = {
        id: data.user.id,
        email: data.user.email || '',
        name: p?.name || 'Anonymous User',
        role: (p?.role || 'STUDENT') as any,
        avatar: p?.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${data.user.email}`,
        dept: p?.dept,
        points: p?.points || 0,
        badge: p?.badge || 'Eco Novice'
      };

      set({ user: loadedUser, loading: false });
      sessionStorage.setItem('gv_current_user', JSON.stringify(loadedUser));
      return true;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return false;
    }
  },
  
  register: async (email: string, name: string, role: 'STUDENT' | 'MAINTENANCE', password: string, dept?: string) => {
    set({ loading: true, error: null });

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name,
            role,
            dept
          }
        }
      });

      if (error) {
        set({ error: error.message, loading: false });
        return false;
      }

      // Insert profile details into profiles table
      try {
        await supabase.from('profiles').insert([{
          id: data.user?.id,
          email,
          name,
          role,
          dept,
          points: role === 'STUDENT' ? 10 : 0,
          badge: 'Eco Novice',
          avatar_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`
        }]);
      } catch (profileErr) {
        console.warn("Profile creation in db failed (could be handled by database triggers):", profileErr);
      }

      // Auto-login registered user
      const registeredUser: User = {
        id: data.user?.id || 'u-registered',
        email,
        name,
        role,
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`,
        dept,
        points: role === 'STUDENT' ? 10 : 0,
        badge: 'Eco Novice'
      };

      set({ user: registeredUser, loading: false });
      sessionStorage.setItem('gv_current_user', JSON.stringify(registeredUser));
      return true;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return false;
    }
  },
  
  logout: async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Signout request error:", e);
    }
    sessionStorage.removeItem('gv_current_user');
    set({ user: null });
  },
  
  fetchComplaints: async () => {
    try {
      const { data } = await supabase.from('complaints').select('*').order('created_at', { ascending: false });
      if (data && data.length > 0) {
        set({ complaints: data });
      }
    } catch (e) {
      console.warn("Fetch complaints error:", e);
    }
  },
  
  createComplaint: async (payload: Partial<Complaint>) => {
    const dbPayload = {
      ...payload,
      reporter_id: sanitizeUuid(payload.reporter_id),
      assignee_id: sanitizeUuid(payload.assignee_id)
    };

    try {
      const { data, error } = await supabase.from('complaints').insert([dbPayload]).select();
      if (error || !data || data.length === 0) {
        throw new Error(error?.message || "Insert failed");
      }
      
      const added = { ...data[0], reporter_id: payload.reporter_id || data[0].reporter_id };
      const nextList = [added, ...get().complaints];
      set({ complaints: nextList });
      localStorage.setItem('gv_complaints', JSON.stringify(nextList));
      
      try {
        const adminNotification = {
          user_id: 'u-all',
          title: 'New Complaint Reported',
          message: `A new ${added.category} ticket has been reported at ${added.location} by ${added.reporter_name}.`,
          read: false,
          type: 'INFO'
        };
        await supabase.from('notifications').insert([adminNotification]);
      } catch (notifErr) {
        console.warn("Failed to send admin notification:", notifErr);
      }
      
      return added;
    } catch (err: any) {
      console.warn("Real database insert failed, caching locally in state:", err.message);
      // Local state fallback
      const mockComplaint: Complaint = {
        id: generateUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        reporter_id: get().user?.id || generateUUID(),
        reporter_name: get().user?.name || 'Aarav Singh',
        status: 'PENDING',
        ...payload
      } as any;
      
      const nextList = [mockComplaint, ...get().complaints];
      localStorage.setItem('gv_complaints', JSON.stringify(nextList));
      set({ complaints: nextList });
      return mockComplaint;
    }
  },
  
  updateComplaintStatus: async (id: string, status: Complaint['status'], repairNotes?: string, afterImageUrl?: string) => {
    const payload: Partial<Complaint> = { status };
    if (repairNotes) payload.repair_notes = repairNotes;
    if (afterImageUrl) payload.after_image_url = afterImageUrl;
    
    try {
      const { data, error } = await supabase.from('complaints').update(payload).eq('id', id).select();
      if (error || !data || data.length === 0) {
        throw new Error(error?.message || "Update failed");
      }
      
      const updated = data[0];
      const nextList = get().complaints.map(c => c.id === id ? updated : c);
      set({ complaints: nextList });
      localStorage.setItem('gv_complaints', JSON.stringify(nextList));
      
      try {
        const userNotif = {
          user_id: updated.reporter_id,
          title: `Complaint Status Updated`,
          message: `Your complaint "${updated.title}" status has changed to: ${status}.`,
          read: false,
          type: status === 'RESOLVED' ? 'SUCCESS' : 'INFO'
        };
        await supabase.from('notifications').insert([userNotif]);
      } catch (notifErr) {
        console.warn("Failed to send notification:", notifErr);
      }
    } catch (err: any) {
      console.warn("Real database update failed, updating locally:", err.message);
      // Local state fallback
      const updatedList = get().complaints.map(c => {
        if (c.id === id) {
          return {
            ...c,
            status,
            repair_notes: repairNotes || c.repair_notes,
            after_image_url: afterImageUrl || c.after_image_url,
            updated_at: new Date().toISOString()
          };
        }
        return c;
      });
      localStorage.setItem('gv_complaints', JSON.stringify(updatedList));
      set({ complaints: updatedList });
    }
  },
  
  assignComplaint: async (id: string, staffId: string, staffName: string) => {
    const dbStaffId = sanitizeUuid(staffId);
    try {
      const { data, error } = await supabase.from('complaints').update({
        assignee_id: dbStaffId,
        assignee_name: staffName,
        status: 'ACCEPTED'
      }).eq('id', id).select();
      
      if (error || !data || data.length === 0) {
        throw new Error(error?.message || "Assignment failed");
      }
      
      const updated = { ...data[0], assignee_id: staffId };
      const nextList = get().complaints.map(c => c.id === id ? updated : c);
      set({ complaints: nextList });
      localStorage.setItem('gv_complaints', JSON.stringify(nextList));
      
      try {
        const staffNotif = {
          user_id: staffId,
          title: 'New Task Assigned',
          message: `You have been assigned to: "${updated.title}" at ${updated.location}.`,
          read: false,
          type: 'WARNING'
        };
        await supabase.from('notifications').insert([staffNotif]);
      } catch (notifErr) {
        console.warn("Failed to send staff notification:", notifErr);
      }
    } catch (err: any) {
      console.warn("Real database assignment failed, updating locally:", err.message);
      // Local state fallback
      const updatedList = get().complaints.map(c => {
        if (c.id === id) {
          return {
            ...c,
            assignee_id: staffId,
            assignee_name: staffName,
            status: 'ACCEPTED' as const,
            updated_at: new Date().toISOString()
          };
        }
        return c;
      });
      localStorage.setItem('gv_complaints', JSON.stringify(updatedList));
      set({ complaints: updatedList });
    }
  },
  
  verifyComplaint: async (id: string, notes?: string) => {
    try {
      const { data, error } = await supabase.from('complaints').update({
        verified: true,
        verification_notes: notes || 'Admin verified resolution.'
      }).eq('id', id).select();
      
      if (error || !data || data.length === 0) {
        throw new Error(error?.message || "Verification failed");
      }
      
      const updated = data[0];
      const nextList = get().complaints.map(c => c.id === id ? updated : c);
      set({ complaints: nextList });
      localStorage.setItem('gv_complaints', JSON.stringify(nextList));
      
      try {
        const notif = {
          user_id: updated.reporter_id,
          title: 'Task Resolution Verified',
          message: `Admin verified task completion for: "${updated.title}". Eco-points credited!`,
          read: false,
          type: 'SUCCESS'
        };
        await supabase.from('notifications').insert([notif]);
      } catch (notifErr) {
        console.warn("Failed to send verification notification:", notifErr);
      }
      
      // Award student points
      await get().addPoints(updated.reporter_id, 50, `Admin verified resolution of ${updated.category} ticket`);
    } catch (err: any) {
      console.warn("Real database verification failed, updating locally:", err.message);
      // Local fallback
      const updatedList = get().complaints.map(c => {
        if (c.id === id) {
          return {
            ...c,
            verified: true,
            verification_notes: notes || 'Admin verified resolution.',
            updated_at: new Date().toISOString()
          };
        }
        return c;
      });
      localStorage.setItem('gv_complaints', JSON.stringify(updatedList));
      set({ complaints: updatedList });
      
      const c = get().complaints.find(x => x.id === id);
      if (c) {
        await get().addPoints(c.reporter_id, 50, `Admin verified resolution of ${c.category} ticket`);
      }
    }
  },
  
  fetchSensors: async () => {
    try {
      const { data } = await supabase.from('sensors').select('*');
      if (data && data.length > 0) {
        set({ sensors: data });
      }
    } catch (e) {
      console.warn("Fetch sensors error:", e);
    }
  },
  
  fetchNotifications: async () => {
    try {
      const { data } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
      const localNotifications = JSON.parse(localStorage.getItem('gv_notifications') || '[]');
      let notificationsList = (data && data.length > 0) ? [...data] : [];
      localNotifications.forEach((ln: any) => {
        if (!notificationsList.some((n: any) => n.id === ln.id)) notificationsList.push(ln);
      });
      notificationsList.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      set({ notifications: notificationsList });
    } catch (e) {
      console.warn("Fetch notifications error:", e);
      set({ notifications: JSON.parse(localStorage.getItem('gv_notifications') || '[]') });
    }
  },
  
  markNotificationRead: async (id: string) => {
    const dbId = sanitizeUuid(id);
    if (dbId) {
      try {
        await supabase.from('notifications').update({ read: true }).eq('id', dbId);
      } catch (e) {
        console.warn("Database notification status update failed:", e);
      }
    }
    set({
      notifications: get().notifications.map(n => n.id === id ? { ...n, read: true } : n)
    });
  },
  
  fetchLeaderboard: async () => {
    try {
      const { data } = await supabase.from('leaderboard').select('*').order('points', { ascending: false });
      if (data && data.length > 0) {
        set({ leaderboard: data });
      }
    } catch (e) {
      console.warn("Fetch leaderboard error:", e);
    }
  },
  
  addPoints: async (userId: string, points: number, reason: string) => {
    // 1. Update user points locally
    const users = JSON.parse(localStorage.getItem('gv_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === userId);
    let finalPoints = points;
    let finalBadge = 'Eco Novice';
    
    if (userIndex !== -1) {
      const user = users[userIndex];
      user.points = (user.points || 0) + points;
      
      if (user.points >= 500) user.badge = 'Eco Legend';
      else if (user.points >= 300) user.badge = 'Eco Champion';
      else if (user.points >= 150) user.badge = 'Green Warrior';
      
      users[userIndex] = user;
      localStorage.setItem('gv_users', JSON.stringify(users));
      
      finalPoints = user.points;
      finalBadge = user.badge || 'Eco Novice';

      const currentUser = get().user;
      if (currentUser && currentUser.id === userId) {
        set({ user: { ...currentUser, points: user.points, badge: user.badge } });
        sessionStorage.setItem('gv_current_user', JSON.stringify(user));
      }
    }
    
    // 2. Update Leaderboard Entry
    const board = JSON.parse(localStorage.getItem('gv_leaderboard') || '[]');
    const boardIndex = board.findIndex((b: any) => b.user_id === userId);
    
    if (boardIndex !== -1) {
      board[boardIndex].points += points;
      if (board[boardIndex].points >= 500) board[boardIndex].tier = 'DIAMOND';
      else if (board[boardIndex].points >= 300) board[boardIndex].tier = 'GOLD';
      else if (board[boardIndex].points >= 150) board[boardIndex].tier = 'SILVER';
    } else {
      board.push({
        id: generateUUID(),
        user_id: userId,
        name: get().user?.name || 'Anonymous User',
        points: points,
        rank: board.length + 1,
        tier: points >= 500 ? 'DIAMOND' : points >= 300 ? 'GOLD' : points >= 150 ? 'SILVER' : 'BRONZE'
      });
    }
    
    board.sort((a: any, b: any) => b.points - a.points);
    const rankedBoard = board.map((item: any, idx: number) => ({
      ...item,
      rank: idx + 1
    }));
    
    localStorage.setItem('gv_leaderboard', JSON.stringify(rankedBoard));
    set({ leaderboard: rankedBoard });
    
    // Update live database if accessible and valid UUID
    const dbUserId = sanitizeUuid(userId);
    if (dbUserId) {
      try {
        await supabase.from('profiles').update({ points: finalPoints, badge: finalBadge }).eq('id', dbUserId);
      } catch (e) {
        console.warn("Profiles points upload failed:", e);
      }
    }
    
    try {
      const pointNotif = {
        user_id: userId,
        title: 'Green Points Credited',
        message: `Received +${points} Eco-points! Reason: ${reason}`,
        read: false,
        type: 'SUCCESS'
      };
      await supabase.from('notifications').insert([pointNotif]);
    } catch (e) {
      console.warn("Notification insert failed:", e);
    }
  }
}));
