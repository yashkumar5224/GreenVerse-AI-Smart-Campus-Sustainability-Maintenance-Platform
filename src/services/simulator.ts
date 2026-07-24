// GreenVerse IoT Telemetry Simulation Loop
// Simulates live sensory metrics, AI anomalies, and sustainability data, broadcasting realtime updates.

import { triggerRealtimeUpdate } from './supabaseClient';
import type { Sensor, SystemNotification, ActiveStaffLocation } from '../types/database';

const simulateStaffMovements = () => {
  let staffList: ActiveStaffLocation[] = JSON.parse(localStorage.getItem('gv_active_staff') || '[]');
  
  if (staffList.length === 0) {
    staffList = [
      { id: 's-1', user_id: 'u-ramesh', name: 'Ramesh Prasad', role: 'Plumber', latitude: 26.1990, longitude: 87.3200, status: 'IDLE', updated_at: new Date().toISOString() },
      { id: 's-2', user_id: 'u-suresh', name: 'Suresh Kumar', role: 'Electrician', latitude: 26.1998, longitude: 87.3214, status: 'WORKING', updated_at: new Date().toISOString() },
      { id: 's-3', user_id: 'u-mohan', name: 'Mohan Singh', role: 'HVAC Tech', latitude: 26.1986, longitude: 87.3211, status: 'EN_ROUTE', updated_at: new Date().toISOString() }
    ];
  }

  staffList = staffList.map(staff => {
    const latMove = (Math.random() - 0.5) * 0.0002;
    const lngMove = (Math.random() - 0.5) * 0.0002;
    let newLat = staff.latitude + latMove;
    let newLng = staff.longitude + lngMove;
    
    // Bounds check
    if (newLat < 26.1980 || newLat > 26.2010) newLat = staff.latitude - latMove;
    if (newLng < 87.3190 || newLng > 87.3225) newLng = staff.longitude - lngMove;
    
    return {
      ...staff,
      latitude: newLat,
      longitude: newLng,
      updated_at: new Date().toISOString()
    };
  });
  
  localStorage.setItem('gv_active_staff', JSON.stringify(staffList));
  window.dispatchEvent(new CustomEvent('gv_staff_update', { detail: staffList }));
};


let simIntervalId: any = null;

// Helper to update sustainability stats
const updateSustainabilityStats = (solarKw: number, waterSavedLiters: number) => {
  const statsStr = localStorage.getItem('gv_sustainability');
  if (statsStr) {
    const stats = JSON.parse(statsStr);
    stats.energy_saved += parseFloat((solarKw / 360).toFixed(2)); // kWh accumulated per tick (assuming 10s tick = 1/360 of hour)
    stats.water_saved += waterSavedLiters;
    stats.carbon_offset += parseFloat(((solarKw / 360) * 0.00085).toFixed(5)); // ~0.85kg CO2 offset per kWh
    
    // Recalculate dynamic ESG score (max 100)
    // Decreases slightly if critical tickets or waste overflows are active
    const complaints = JSON.parse(localStorage.getItem('gv_complaints') || '[]');
    const sensors = JSON.parse(localStorage.getItem('gv_sensors') || '[]');
    const criticalCount = complaints.filter((c: any) => c.priority === 'CRITICAL' && c.status !== 'RESOLVED').length;
    const overflowCount = sensors.filter((s: any) => s.type === 'SMART_BIN' && s.last_reading > 90).length;
    
    const penalty = (criticalCount * 5) + (overflowCount * 3);
    stats.score = Math.max(50, Math.min(100, 88 - penalty));
    
    localStorage.setItem('gv_sustainability', JSON.stringify(stats));
    triggerRealtimeUpdate('sustainability:UPDATE', stats);
  }
};

// Start background simulation ticks
export const startTelemetrySimulation = () => {
  if (simIntervalId) return;
  
  console.log('GreenVerse IoT & AI Telemetry Simulation Started.');
  
  simIntervalId = setInterval(() => {
    const sensors: Sensor[] = JSON.parse(localStorage.getItem('gv_sensors') || '[]');
    const complaints = JSON.parse(localStorage.getItem('gv_complaints') || '[]');
    
    let solarGeneratedNow = 0;
    let waterSavedNow = 0;
    const notifications: SystemNotification[] = JSON.parse(localStorage.getItem('gv_notifications') || '[]');
    
    // Simulate current solar time-of-day multiplier (peaking mid-day, zero at night)
    // Uses minutes of the current hour to speed up the daylight cycle for visual demo
    const date = new Date();
    const minutes = date.getMinutes() + date.getSeconds() / 60;
    const timeFactor = Math.max(0, Math.sin((minutes / 60) * Math.PI)); // sinusoidal 60-minute day cycle
    
    const nextSensors = sensors.map((sensor): Sensor => {
      let reading = sensor.last_reading;
      let status = sensor.status;
      let battery = sensor.battery;
      
      // Drain battery slowly
      if (Math.random() > 0.85) {
        battery = Math.max(5, battery - 1);
      }
      
      // Simulation by Sensor Type
      switch (sensor.type) {
        case 'SMART_BIN':
          // Bins fill up over time
          if (reading < 100) {
            const fillRate = Math.random() * 2.5 + 0.5; // fill by 0.5% - 3%
            reading = Math.min(100, parseFloat((reading + fillRate).toFixed(1)));
          }
          // Update Status thresholds
          if (reading >= 95) {
            status = 'CRITICAL';
            // Trigger critical notification if status changed to critical
            if (sensor.status !== 'CRITICAL') {
              const newNotif: SystemNotification = {
                id: 'n-sim-' + Math.random().toString(36).substring(2, 11),
                user_id: 'u-all',
                title: 'Dustbin Overflow Warning',
                message: `CRITICAL: Smart Bin at ${sensor.location} is at ${reading}% capacity. Immediate clearing required.`,
                read: false,
                type: 'CRITICAL',
                created_at: new Date().toISOString()
              };
              notifications.unshift(newNotif);
              triggerRealtimeUpdate('notifications:INSERT', newNotif);
            }
          } else if (reading >= 80) {
            status = 'WARNING';
          } else {
            status = 'HEALTHY';
          }
          break;
          
        case 'WATER_TANK':
          // Overhead tanks drain slowly unless pump is active
          // If water pump sensor exists, assume it refills
          const pumpActive = true; 
          const delta = pumpActive ? (Math.random() * 2 - 0.8) : -(Math.random() * 1.5);
          reading = Math.max(10, Math.min(100, parseFloat((reading + delta).toFixed(1))));
          
          if (reading < 20) {
            status = 'CRITICAL';
            if (sensor.status !== 'CRITICAL') {
              const newNotif: SystemNotification = {
                id: 'n-sim-' + Math.random().toString(36).substring(2, 11),
                user_id: 'u-all',
                title: 'Low Water Level Alert',
                message: `CRITICAL: Main tank level has dropped below 20% (${reading}%).`,
                read: false,
                type: 'CRITICAL',
                created_at: new Date().toISOString()
              };
              notifications.unshift(newNotif);
              triggerRealtimeUpdate('notifications:INSERT', newNotif);
            }
          } else if (reading < 40) {
            status = 'WARNING';
          } else {
            status = 'HEALTHY';
            waterSavedNow += 5; // Simulating 5L of greywater recycled per tick
          }
          break;
          
        case 'LEAKAGE':
          // Check if the plumbing complaint (c-01) is resolved
          const plumbingIssue = complaints.find((c: any) => c.category === 'PLUMBING' && c.status !== 'RESOLVED');
          if (plumbingIssue) {
            reading = 1; // leak active
            status = 'CRITICAL';
          } else {
            reading = 0; // no leak
            status = 'HEALTHY';
          }
          break;
          
        case 'SOLAR_PANEL':
          // Generates solar power according to timeFactor
          const maxOutput = 250; // 250 kW peak
          reading = parseFloat((maxOutput * timeFactor * (0.9 + Math.random() * 0.1)).toFixed(1));
          solarGeneratedNow = reading;
          status = reading > 5 ? 'HEALTHY' : 'WARNING'; // Warning if dark/no generation
          break;
          
        case 'ENERGY_METER':
          // Power consumed by campus buildings
          // Base load + class activity variations
          const hour = date.getHours();
          const activeHours = hour >= 8 && hour <= 18;
          const baseLoad = activeHours ? 110 : 45;
          reading = parseFloat((baseLoad + Math.random() * 30).toFixed(1));
          status = 'HEALTHY';
          break;
          
        case 'AQI':
          // Air quality PM2.5 random walk
          const windCleanFactor = Math.random() > 0.5 ? 1 : -1;
          reading = Math.max(30, Math.min(180, parseFloat((reading + Math.random() * 4 * windCleanFactor).toFixed(0))));
          if (reading > 150) {
            status = 'CRITICAL';
          } else if (reading > 100) {
            status = 'WARNING';
          } else {
            status = 'HEALTHY';
          }
          break;
          
        case 'TEMP':
          // Slow ambient fluctuations
          reading = parseFloat((30 + Math.sin((date.getSeconds() / 60) * Math.PI) * 2).toFixed(1));
          break;
          
        case 'HUMIDITY':
          // Moisture levels
          reading = parseFloat((60 + Math.cos((date.getSeconds() / 60) * Math.PI) * 5).toFixed(1));
          break;
      }
      
      const updatedSensor = {
        ...sensor,
        last_reading: reading,
        status,
        battery,
        updated_at: new Date().toISOString()
      };
      
      // Dispatch Realtime updates per sensor changes
      if (sensor.last_reading !== reading || sensor.status !== status) {
        triggerRealtimeUpdate(`sensors:UPDATE`, { new: updatedSensor });
      }
      
      return updatedSensor;
    });
    
    // Save updated sensors and notifications back
    localStorage.setItem('gv_sensors', JSON.stringify(nextSensors));
    localStorage.setItem('gv_notifications', JSON.stringify(notifications.slice(0, 50))); // Keep last 50
    
    // Accumulate sustainability values
    simulateStaffMovements();
    updateSustainabilityStats(solarGeneratedNow, waterSavedNow);
    
  }, 10000); // Tick every 10 seconds
};

export const stopTelemetrySimulation = () => {
  if (simIntervalId) {
    clearInterval(simIntervalId);
    simIntervalId = null;
    console.log('GreenVerse Telemetry Simulation Stopped.');
  }
};
