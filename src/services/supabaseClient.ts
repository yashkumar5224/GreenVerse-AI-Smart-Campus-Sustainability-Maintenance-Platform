// GreenVerse Real Supabase Client Configuration & Hybrid Telemetry Router
// Connects directly to the live PostgreSQL backend database using browser client bindings.

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vwelousjisvsgcxnkrwe.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_8JykW6ekqQSx76zr2DHWqA_d3-oK027';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Hybrid Realtime Adapter
// Allows in-browser simulated IoT ticks to trigger the same reactive callbacks as real database sockets.
const listeners: { [key: string]: ((payload: any) => void)[] } = {};

export const triggerRealtimeUpdate = (channelEvent: string, payload: any) => {
  const listenersList = listeners[channelEvent] || [];
  listenersList.forEach(cb => cb(payload));
};

const originalChannel = supabase.channel.bind(supabase);

// Override channel to register local subscription hooks alongside live postgres change listeners
supabase.channel = (channelName: string): any => {
  const chan = originalChannel(channelName);
  const originalOn = chan.on.bind(chan);
  
  chan.on = (type: string, filter: any, callback: (payload: any) => void) => {
    if (type === 'postgres_changes' && filter && filter.table) {
      const table = filter.table;
      const event = filter.event || '*';
      const events = event === '*' ? ['INSERT', 'UPDATE', 'DELETE'] : [event];
      
      events.forEach(ev => {
        const channelKey = `${table}:${ev}`;
        if (!listeners[channelKey]) listeners[channelKey] = [];
        listeners[channelKey].push(callback);
      });
    }
    return originalOn(type as any, filter, callback);
  };
  
  return chan;
};

export const SPNREC_CENTER = { lat: 26.1989, lng: 87.3216 };

export default supabase;
