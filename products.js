import { supabase } from './supabaseClient.js';

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
async function fetchWithCache(key, fetcher) {
  try {
    const cached = localStorage.getItem(key);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL) return data;
    }
  } catch (e) {}
  const data = await fetcher();
  try { localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() })); } catch (e) {}
  return data;
}

/**
 * Retrieves all vehicles from the database.
 * @returns {Promise<Array>} List of vehicles
 */
export async function getVehicles() {
  return fetchWithCache('cache_vehicles', async () => {
    const { data, error } = await supabase.from('products').select('*').order('inventory_order', { ascending: true });
    if (error) throw error;
    return data;
  });
}

/**
 * Retrieves spotlight vehicles from the database.
 * @returns {Promise<Array>} List of spotlight vehicles
 */
export async function getSpotlightVehicles() {
  return fetchWithCache('cache_spotlight', async () => {
    const { data, error } = await supabase.from('products').select('*').eq('is_spotlight', true).order('spotlight_order', { ascending: true });
    if (error) throw error;
    return data;
  });
}

/**
 * Creates a new vehicle.
 * @param {Object} vehicle - Vehicle data
 * @returns {Promise<Object>} Created vehicle
 */
export async function createVehicle(vehicle) {
  const { data, error } = await supabase.from('products').insert([vehicle]).select();
  if (error) throw error;
  try { localStorage.removeItem('cache_vehicles'); localStorage.removeItem('cache_spotlight'); } catch(e) {}
  return data[0];
}

/**
 * Updates an existing vehicle.
 * @param {string} id - Vehicle ID
 * @param {Object} updates - Data to update
 * @returns {Promise<Object>} Updated vehicle
 */
export async function updateVehicle(id, updates) {
  const { data, error } = await supabase.from('products').update(updates).eq('id', id).select();
  if (error) throw error;
  try { localStorage.removeItem('cache_vehicles'); localStorage.removeItem('cache_spotlight'); } catch(e) {}
  return data[0];
}

/**
 * Deletes a vehicle.
 * @param {string} id - Vehicle ID
 * @returns {Promise<void>}
 */
export async function deleteVehicle(id) {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
  try { localStorage.removeItem('cache_vehicles'); localStorage.removeItem('cache_spotlight'); } catch(e) {}
}
